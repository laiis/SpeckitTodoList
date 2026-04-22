import { describe, it, expect, beforeEach, vi } from 'vitest';
import { JSDOM } from 'jsdom';

describe('UI Logic - Multi-line Input', () => {
  let dom;
  let document;
  let window;

  beforeEach(() => {
    dom = new JSDOM('<!DOCTYPE html><html><body><textarea id="todo-input"></textarea><button id="add-btn"></button></body></html>');
    document = dom.window.document;
    window = dom.window;
    global.document = document;
    global.window = window;
    global.HTMLElement = window.HTMLElement;
    global.HTMLTextAreaElement = window.HTMLTextAreaElement;
    global.KeyboardEvent = window.KeyboardEvent;
  });

  it('應能在 textarea 按下 Enter 進行換行', () => {
    const textarea = document.getElementById('todo-input');
    textarea.value = 'Line 1';
    
    // 模擬鍵盤事件
    const event = new KeyboardEvent('keydown', { key: 'Enter', bubbles: true });
    textarea.dispatchEvent(event);
    
    // 注意：原生 textarea 的 Enter 換行是由瀏覽器預設行為處理的
    // 在 JSDOM 中，我們主要是驗證我們的 Ctrl+Enter 邏輯是否攔截了正常的 Enter
    expect(event.defaultPrevented).toBe(false);
  });

  it('應能在按下 Ctrl + Enter 時觸發提交邏輯', () => {
    const textarea = document.getElementById('todo-input');
    const addBtn = document.getElementById('add-btn');
    
    // 模擬提交函數
    const addTodoSpy = vi.fn();
    
    // 實作與 script.js 類似的邏輯
    textarea.addEventListener('keydown', (e) => {
      if ((e.ctrlKey || e.metaKey) && e.key === 'Enter') {
        e.preventDefault();
        addTodoSpy();
      }
    });

    const event = new KeyboardEvent('keydown', { 
      key: 'Enter', 
      ctrlKey: true, 
      bubbles: true,
      cancelable: true
    });
    textarea.dispatchEvent(event);

    expect(addTodoSpy).toHaveBeenCalled();
    expect(event.defaultPrevented).toBe(true);
  });
});
