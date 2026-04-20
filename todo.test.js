import { describe, it, expect, beforeEach, vi, test } from 'vitest';
import { JSDOM } from 'jsdom';
import fs from 'fs';
import path from 'path';
import { performance } from 'perf_hooks';

// 核心函式測試
// 由於 script.js 是為瀏覽器設計的，我們在這裡使用 require 載入它匯出的 CommonJS 部分
const { 
    Status, 
    migrateLegacyData, 
    updateTaskStatus, 
    formatDateTime, 
    createNewTodo, 
    filterTodoList 
} = require('./script.js');

describe('Todo Logic (Unit)', () => {
    test('Status constants should be correct', () => {
        expect(Status.BACKLOG).toBe('backlog');
        expect(Status.TODO).toBe('todo');
        expect(Status.RUNNING).toBe('running');
        expect(Status.TESTING).toBe('testing');
        expect(Status.DONE).toBe('done');
    });

    test('migrateLegacyData should convert boolean completed to status', () => {
        const legacy = [
            { id: 1, text: 'Done Task', completed: true },
            { id: 2, text: 'Active Task', completed: false }
        ];
        const { migrated, modified } = migrateLegacyData(legacy);
        expect(modified).toBe(true);
        expect(migrated[0].status).toBe(Status.DONE);
        expect(migrated[1].status).toBe(Status.TODO);
        expect(migrated[0].createdAt).toBeDefined();
    });

    test('Audit Retention: should keep timestamps when rolling back status', () => {
        const initialTodos = [{
            id: 1,
            text: 'Audit Task',
            completed: true,
            status: Status.DONE,
            completedAt: '2026-04-20T10:00:00Z',
            testedAt: '2026-04-20T09:00:00Z'
        }];
        
        // Rollback to Running
        const updated = updateTaskStatus(initialTodos, 1, Status.RUNNING);
        expect(updated[0].status).toBe(Status.RUNNING);
        expect(updated[0].completed).toBe(false);
        // Should RETAIN completedAt and testedAt for audit
        expect(updated[0].completedAt).toBe('2026-04-20T10:00:00Z');
        expect(updated[0].testedAt).toBe('2026-04-20T09:00:00Z');
    });

    test('createNewTodo should set default status to TODO', () => {
        const todo = createNewTodo('New task');
        expect(todo.status).toBe(Status.TODO);
        expect(todo.completed).toBe(false);
    });

    test('filterTodoList should filter correctly by status', () => {
        const todos = [
            { id: 1, status: Status.TODO },
            { id: 2, status: Status.DONE },
            { id: 3, status: Status.BACKLOG }
        ];
        expect(filterTodoList(todos, 'active').length).toBe(2);
        expect(filterTodoList(todos, 'completed').length).toBe(1);
    });
});

describe('Performance Benchmark (SC-003)', () => {
    test('filterTodoList should process 1000 items in less than 200ms', () => {
        const manyTodos = Array.from({ length: 1000 }, (_, i) => ({
            id: i,
            text: `Task ${i}`,
            completed: i % 2 === 0,
            status: i % 2 === 0 ? Status.DONE : Status.TODO
        }));
        
        const start = performance.now();
        filterTodoList(manyTodos, 'active');
        filterTodoList(manyTodos, 'completed');
        filterTodoList(manyTodos, 'all');
        const end = performance.now();
        
        const duration = end - start;
        console.log(`[BENCHMARK] Filtering 1000 items took ${duration.toFixed(2)}ms`);
        expect(duration).toBeLessThan(200);
    });
});

// 整合測試 (DOM)
const scriptPath = path.resolve(process.cwd(), './script.js');
const htmlPath = path.resolve(process.cwd(), './index.html');
const scriptContent = fs.readFileSync(scriptPath, 'utf8');
const htmlContent = fs.readFileSync(htmlPath, 'utf8');

describe('Todo Application Integration (DOM)', () => {
    let dom;
    let window;
    let document;

    beforeEach(() => {
        dom = new JSDOM(htmlContent, { runScripts: "dangerously", resources: "usable" });
        window = dom.window;
        document = window.document;
        
        const storage = {};
        Object.defineProperty(window, 'localStorage', {
            value: {
                getItem: vi.fn(key => storage[key] || null),
                setItem: vi.fn((key, value) => storage[key] = value.toString()),
                clear: vi.fn(() => Object.keys(storage).forEach(k => delete storage[k])),
                removeItem: vi.fn(key => delete storage[key])
            },
            writable: true
        });

        const scriptEl = document.createElement('script');
        scriptEl.textContent = scriptContent;
        document.body.appendChild(scriptEl);
        
        const event = new window.Event('DOMContentLoaded');
        document.dispatchEvent(event);
    });

    it('should sync status when checkbox is toggled', () => {
        const input = document.getElementById('todo-input');
        const addBtn = document.getElementById('add-btn');
        input.value = 'Sync Test';
        addBtn.click();

        const checkbox = document.querySelector('input[type="checkbox"]');
        const select = document.querySelector('.status-select');
        
        expect(select.value).toBe(Status.TODO);
        
        // Trigger click which changes checkbox state and triggers 'change' event
        checkbox.click();
        
        expect(select.value).toBe(Status.DONE);
        
        checkbox.click();
        expect(select.value).toBe(Status.TODO);
    });
});
