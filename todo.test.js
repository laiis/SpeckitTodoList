import { describe, it, expect, beforeEach, vi } from 'vitest';
import { JSDOM } from 'jsdom';
import fs from 'fs';
import path from 'path';

// 核心函式測試
const { 
    Status, 
    migrateLegacyData, 
    updateTaskStatus, 
    formatDateTime, 
    createNewTodo, 
    filterTodoList 
} = require('./script.js');

describe('Todo Logic (Unit)', () => {
    it('should pass all core logic tests', () => {
        expect(Status.DONE).toBe('done');
        const { migrated } = migrateLegacyData([{ id: 1, completed: true }]);
        expect(migrated[0].status).toBe(Status.DONE);
    });
});

// 整合測試 (DOM)
const scriptContent = fs.readFileSync(path.resolve(__dirname, './script.js'), 'utf8');
const htmlContent = fs.readFileSync(path.resolve(__dirname, './index.html'), 'utf8');

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

    it('should add a task correctly', () => {
        const input = document.getElementById('todo-input');
        const addBtn = document.getElementById('add-btn');
        input.value = 'Task Name';
        addBtn.click();

        const todoTextEl = document.querySelector('.todo-text');
        expect(todoTextEl.value).toBe('Task Name');
    });

    it('should toggle theme', () => {
        const toggle = document.getElementById('theme-toggle');
        toggle.click();
        expect(document.body.classList.contains('dark-mode')).toBe(true);
    });

    it('should cycle priority', () => {
        const input = document.getElementById('todo-input');
        const addBtn = document.getElementById('add-btn');
        input.value = 'P';
        addBtn.click();

        const badge = document.querySelector('.priority-badge');
        expect(badge.textContent).toBe('中');
        badge.click();
        expect(badge.textContent).toBe('高');
    });
});
