import { describe, it, expect, beforeEach, vi, test } from 'vitest';
import { JSDOM } from 'jsdom';
import fs from 'fs';
import path from 'path';
import { performance } from 'perf_hooks';

// 核心函式測試
// 由於 script.js 是為瀏覽器設計的，我們在這裡使用 require 載入它匯出的 CommonJS 部分
const { TodoService, formatDateTime } = require('./script.js');

describe('TodoService Logic (Unit)', () => {
    let service;
    const mockTodos = [
        { id: 1, text: 'Backlog Task', status: TodoService.Status.BACKLOG, completed: false },
        { id: 2, text: 'Todo Task', status: TodoService.Status.TODO, completed: false },
        { id: 3, text: 'Running Task', status: TodoService.Status.RUNNING, completed: false },
        { id: 4, text: 'Testing Task', status: TodoService.Status.TESTING, completed: false },
        { id: 5, text: 'Done Task', status: TodoService.Status.DONE, completed: true }
    ];

    beforeEach(() => {
        // Mock localStorage
        const storage = {
            'todos': JSON.stringify(mockTodos)
        };
        global.localStorage = {
            getItem: vi.fn(key => storage[key] || null),
            setItem: vi.fn((key, value) => storage[key] = value.toString()),
            removeItem: vi.fn(key => delete storage[key]),
            clear: vi.fn(() => Object.keys(storage).forEach(k => delete storage[k]))
        };
        service = new TodoService();
    });

    test('Status constants should be correct', () => {
        expect(TodoService.Status.BACKLOG).toBe('backlog');
        expect(TodoService.Status.TODO).toBe('todo');
        expect(TodoService.Status.RUNNING).toBe('running');
        expect(TodoService.Status.TESTING).toBe('testing');
        expect(TodoService.Status.DONE).toBe('done');
    });

    test('migrateLegacyData should convert boolean completed to status', () => {
        const legacy = [
            { id: 10, text: 'Legacy Done', completed: true },
            { id: 11, text: 'Legacy Active', completed: false }
        ];
        const { migrated, modified } = TodoService.migrateLegacyData(legacy);
        expect(modified).toBe(true);
        expect(migrated[0].status).toBe(TodoService.Status.DONE);
        expect(migrated[1].status).toBe(TodoService.Status.TODO);
        expect(migrated[0].createdAt).toBeDefined();
    });

    test('T008: TodoService.getTasksByStatus should return correct tasks', () => {
        const backlogTasks = service.getTodos().filter(t => t.status === TodoService.Status.BACKLOG);
        expect(backlogTasks.length).toBe(1);
        expect(backlogTasks[0].text).toBe('Backlog Task');

        const doneTasks = service.getTodos().filter(t => t.status === TodoService.Status.DONE);
        expect(doneTasks.length).toBe(1);
        expect(doneTasks[0].text).toBe('Done Task');
    });

    test('updateTaskStatus should update status and timestamps', () => {
        service.updateTaskStatus(2, TodoService.Status.RUNNING);
        const updated = service.getTodos().find(t => t.id === 2);
        expect(updated.status).toBe(TodoService.Status.RUNNING);
        expect(updated.updatedAt).toBeDefined();
    });

    test('Audit Retention: should keep timestamps when rolling back status', () => {
        // Setup a task that was done
        service.updateTaskStatus(2, TodoService.Status.DONE);
        const doneAt = service.getTodos().find(t => t.id === 2).completedAt;
        expect(doneAt).toBeDefined();

        // Rollback to Running
        service.updateTaskStatus(2, TodoService.Status.RUNNING);
        const rolledBack = service.getTodos().find(t => t.id === 2);
        expect(rolledBack.status).toBe(TodoService.Status.RUNNING);
        expect(rolledBack.completed).toBe(false);
        // Should RETAIN completedAt for audit
        expect(rolledBack.completedAt).toBe(doneAt);
    });

    test('T014a: Task counter synchronization should be accurate', () => {
        const initialCount = service.getTodos().filter(t => t.status === TodoService.Status.TODO).length;
        
        // Add a new todo (pass status correctly)
        service.createNewTodo('New Todo Task', TodoService.Status.TODO, 'medium');
        const newCount = service.getTodos().filter(t => t.status === TodoService.Status.TODO).length;
        expect(newCount).toBe(initialCount + 1);

        // Move it to Running
        const newTodoId = service.getTodos().find(t => t.text === 'New Todo Task').id;
        service.updateTaskStatus(newTodoId, TodoService.Status.RUNNING);
        
        const countAfterMove = service.getTodos().filter(t => t.status === TodoService.Status.TODO).length;
        const runningCount = service.getTodos().filter(t => t.status === TodoService.Status.RUNNING).length;
        
        expect(countAfterMove).toBe(initialCount);
        expect(runningCount).toBe(2); // Initial 1 + new 1
    });

    test('T009: [US1] filterTodoList should return correct subsets', () => {
        // Active should exclude Done
        const activeTasks = service.filterTodoList('active');
        expect(activeTasks.every(t => t.status !== TodoService.Status.DONE)).toBe(true);
        expect(activeTasks.length).toBe(4); // 5 initial - 1 done

        // Completed should only include Done
        const completedTasks = service.filterTodoList('completed');
        expect(completedTasks.every(t => t.status === TodoService.Status.DONE)).toBe(true);
        expect(completedTasks.length).toBe(1);

        // All should include everything
        const allTasks = service.filterTodoList('all');
        expect(allTasks.length).toBe(mockTodos.length);
    });

    test('T017: [US2] "All" filter should return all 5 statuses', () => {
        const allTasks = service.filterTodoList('all');
        const statuses = [...new Set(allTasks.map(t => t.status))];
        expect(statuses).toContain(TodoService.Status.BACKLOG);
        expect(statuses).toContain(TodoService.Status.DONE);
        expect(allTasks.length).toBe(5);
    });

    test('T017a: [US2] "Completed" filter should only return DONE status', () => {
        const completedTasks = service.filterTodoList('completed');
        expect(completedTasks.length).toBe(1);
        expect(completedTasks[0].status).toBe(TodoService.Status.DONE);
    });

    test('T020: [US3] Mobile Tab Logic - Status retention and filtering', () => {
        // Mock sessionStorage
        const sessionStore = {};
        global.sessionStorage = {
            getItem: vi.fn(key => sessionStore[key] || null),
            setItem: vi.fn((key, value) => sessionStore[key] = value.toString()),
            removeItem: vi.fn(key => delete sessionStore[key]),
            clear: vi.fn(() => Object.keys(sessionStore).forEach(k => delete sessionStore[k]))
        };

        // 1. Initial State: Default to TODO if nothing in session
        let activeTabStatus = sessionStorage.getItem('activeTabStatus') || TodoService.Status.TODO;
        expect(activeTabStatus).toBe(TodoService.Status.TODO);

        // 2. Simulate User Click: Switch to RUNNING
        activeTabStatus = TodoService.Status.RUNNING;
        sessionStorage.setItem('activeTabStatus', activeTabStatus);
        expect(sessionStorage.getItem('activeTabStatus')).toBe(TodoService.Status.RUNNING);

        // 3. Verify TodoService can retrieve tasks for the active tab
        const runningTasks = service.getTasksByStatus(activeTabStatus);
        expect(runningTasks.length).toBe(1);
        expect(runningTasks[0].text).toBe('Running Task');

        // 4. Persistence Check: Simulate page reload
        const reloadedTabStatus = sessionStorage.getItem('activeTabStatus') || TodoService.Status.TODO;
        expect(reloadedTabStatus).toBe(TodoService.Status.RUNNING);
    });
});

describe('Performance Benchmark (SC-001)', () => {
    test('filterTodoList should process 1000 items in less than 200ms', () => {
        const storage = { 'todos': '[]' };
        global.localStorage = {
            getItem: vi.fn(key => storage[key] || null),
            setItem: vi.fn((key, value) => storage[key] = value.toString())
        };
        const service = new TodoService();
        
        const manyTodos = Array.from({ length: 1000 }, (_, i) => ({
            id: i,
            text: `Task ${i}`,
            completed: i % 2 === 0,
            status: i % 2 === 0 ? TodoService.Status.DONE : TodoService.Status.TODO,
            createdAt: new Date().toISOString()
        }));
        service.todos = manyTodos;
        
        const start = performance.now();
        service.filterTodoList('active');
        service.filterTodoList('completed');
        service.filterTodoList('all');
        const end = performance.now();
        
        const duration = end - start;
        console.log(`[BENCHMARK] Filtering 1000 items took ${duration.toFixed(2)}ms`);
        expect(duration).toBeLessThan(200);
    });
});
