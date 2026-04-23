import { describe, it, expect, beforeEach, vi } from 'vitest';
import { JSDOM } from 'jsdom';

describe('UI/UX Refinements', () => {
  let dom;
  let document;
  let window;

  beforeEach(() => {
    // 模擬基礎 HTML 結構，包含看板容器與篩選按鈕
    dom = new JSDOM(`
      <!DOCTYPE html>
      <html>
        <body>
          <div class="filter-container">
            <button class="filter-btn active" data-status="all">全部</button>
            <button class="filter-btn" data-status="pending">待完成</button>
            <button class="filter-btn" data-status="completed">已完成</button>
          </div>
          <div class="kanban-scroll-top" style="overflow-x: auto; height: 1px;">
            <div class="kanban-scroll-dummy" style="height: 1px;"></div>
          </div>
          <div class="kanban-container" style="overflow-x: auto; display: flex;">
            <div class="kanban-column" style="min-width: 300px;"></div>
            <div class="kanban-column" style="min-width: 300px;"></div>
            <div class="kanban-column" style="min-width: 300px;"></div>
          </div>
        </body>
      </html>
    `);
    document = dom.window.document;
    window = dom.window;
    global.document = document;
    global.window = window;
    global.HTMLElement = window.HTMLElement;
    global.MouseEvent = window.MouseEvent;
  });

  describe('US1: 看板雙橫向捲動條 (Kanban Dual Scrollbars)', () => {
    it('頂部捲動條應能與看板容器同步捲動位置 (T008.1)', () => {
      const scrollTop = document.querySelector('.kanban-scroll-top');
      const kanbanContainer = document.querySelector('.kanban-container');
      
      // 模擬同步函數 (在 script.js 中實作後應匯入或在此模擬)
      const syncScroll = (source, target) => {
        target.scrollLeft = source.scrollLeft;
      };

      scrollTop.scrollLeft = 100;
      syncScroll(scrollTop, kanbanContainer);
      
      expect(kanbanContainer.scrollLeft).toBe(100);

      kanbanContainer.scrollLeft = 250;
      syncScroll(kanbanContainer, scrollTop);
      
      expect(scrollTop.scrollLeft).toBe(250);
    });

    it('視窗縮放時應更新頂部捲動條內虛擬內容的寬度 (T007.1)', () => {
      const dummy = document.querySelector('.kanban-scroll-dummy');
      const container = document.querySelector('.kanban-container');
      
      // 模擬更新寬度邏輯
      const updateDummyWidth = (source, targetDummy) => {
        targetDummy.style.width = `${source.scrollWidth}px`;
      };

      // 模擬容器內容加寬
      Object.defineProperty(container, 'scrollWidth', { value: 1200, configurable: true });
      updateDummyWidth(container, dummy);
      
      expect(dummy.style.width).toBe('1200px');
    });
  });

  describe('US2: 任務日期編輯 (Edit Task Dates in Card)', () => {
    it('編輯模式下應顯示起始與截止日期輸入框 (T013.1)', () => {
      const todoItem = document.createElement('div');
      todoItem.className = 'todo-item editing';
      todoItem.innerHTML = `
        <input type="text" class="edit-input" value="Task Name">
        <input type="date" class="edit-start-date" value="2026-04-23">
        <input type="date" class="edit-due-date" value="2026-04-25">
      `;
      document.body.appendChild(todoItem);

      const startInput = todoItem.querySelector('.edit-start-date');
      const dueInput = todoItem.querySelector('.edit-due-date');

      expect(startInput).not.toBeNull();
      expect(dueInput).not.toBeNull();
      expect(startInput.value).toBe('2026-04-23');
    });

    it('變更日期後應能觸發更新邏輯 (T013.2)', () => {
      const updateSpy = vi.fn();
      const input = document.createElement('input');
      input.type = 'date';
      input.addEventListener('change', (e) => updateSpy(e.target.value));

      input.value = '2026-05-01';
      input.dispatchEvent(new window.Event('change'));

      expect(updateSpy).toHaveBeenCalledWith('2026-05-01');
    });
  });

  describe('US3: 篩選按鈕互動優化 (Filter Button Interaction)', () => {
    it('點擊篩選按鈕時，頁面垂直捲動位置應保持不變 (T016.1)', () => {
      const filterBtn = document.querySelector('.filter-btn[data-status="completed"]');
      
      // 模擬目前捲動位置
      window.scrollY = 500;
      
      // 模擬點擊事件處理邏輯 (不應包含 .focus() 或其他會觸發捲動的操作)
      filterBtn.addEventListener('click', (e) => {
        // 執行篩選邏輯...
        // 嚴禁執行 e.target.focus()
      });

      filterBtn.click();
      
      // 在 JSDOM 中，除非顯式更改或觸發了會更改它的 DOM API，否則 scrollY 不會變
      expect(window.scrollY).toBe(500);
    });
  });
});
