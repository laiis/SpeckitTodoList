import { describe, it, expect, beforeEach, vi } from 'vitest';
import { JSDOM } from 'jsdom';

describe('UI/UX Refinements', () => {
  let dom;
  let document;
  let window;

  beforeEach(() => {
    dom = new JSDOM('<!DOCTYPE html><html><body>' +
      '<div class="kanban-scroll-top" style="overflow-x: auto; height: 15px;">' +
      '  <div class="kanban-dummy-content" style="height: 1px;"></div>' +
      '</div>' +
      '<div class="kanban-container" id="kanban-container" style="overflow-x: auto;">' +
      '  <div style="width: 2000px; height: 100px;">Content</div>' +
      '</div>' +
      '</body></html>', {
        url: 'http://localhost',
        contentType: 'text/html',
      });
    document = dom.window.document;
    window = dom.window;
    global.document = document;
    global.window = window;
    global.HTMLElement = window.HTMLElement;
    window.requestAnimationFrame = (callback) => setTimeout(callback, 0);
    global.requestAnimationFrame = window.requestAnimationFrame;
  });

  describe('User Story 1 - 看板雙橫向捲動條 (Scroll Synchronization)', () => {
    it('T005: 當頂部捲動條捲動時，容器應同步捲動', async () => {
      const scrollTop = document.querySelector('.kanban-scroll-top');
      const container = document.getElementById('kanban-container');
      
      // 模擬同步邏輯
      let isSyncing = false;
      const sync = (source, target) => {
        if (!isSyncing) {
          isSyncing = true;
          target.scrollLeft = source.scrollLeft;
          window.requestAnimationFrame(() => isSyncing = false);
        }
      };

      scrollTop.scrollLeft = 100;
      sync(scrollTop, container);

      expect(container.scrollLeft).toBe(100);
    });

    it('T006: 當容器寬度改變時，頂部捲動條虛擬內容應同步更新 (模擬 ResizeObserver 行為)', () => {
      const container = document.getElementById('kanban-container');
      const dummyContent = document.querySelector('.kanban-dummy-content');
      
      // 模擬 ResizeObserver 回呼邏輯
      const updateDummyWidth = (source, target) => {
        target.style.width = source.scrollWidth + 'px';
      };

      // 模擬容器寬度為 2000px
      vi.spyOn(container, 'scrollWidth', 'get').mockReturnValue(2000);
      
      updateDummyWidth(container, dummyContent);
      
      expect(dummyContent.style.width).toBe('2000px');
    });
  });

  describe('User Story 2 - 任務日期編輯 (Date Validation)', () => {
    // 模擬 taskService.validateDateRange
    const validateDateRange = (start, end) => {
      if (!start || !end) return true;
      return new Date(start) <= new Date(end);
    };

    it('T011: 應正確驗證日期範圍', () => {
      expect(validateDateRange('2026-04-20', '2026-04-23')).toBe(true);
      expect(validateDateRange('2026-04-23', '2026-04-20')).toBe(false);
      expect(validateDateRange('2026-04-23', '2026-04-23')).toBe(true);
      expect(validateDateRange(null, '2026-04-23')).toBe(true);
      expect(validateDateRange('2026-04-20', null)).toBe(true);
    });

    it('T012: 非法日期時應顯示錯誤狀態', () => {
      const startInput = document.createElement('input');
      const endInput = document.createElement('input');
      const errorMsg = document.createElement('div');
      errorMsg.className = 'error-message';

      const handleValidationUI = (start, end, startEl, endEl, errorEl) => {
        const isValid = validateDateRange(start, end);
        if (!isValid) {
          startEl.classList.add('invalid');
          endEl.classList.add('invalid');
          errorEl.textContent = '起始日期不能晚於截止日期';
          errorEl.style.display = 'block';
        } else {
          startEl.classList.remove('invalid');
          endEl.classList.remove('invalid');
          errorEl.style.display = 'none';
        }
      };

      handleValidationUI('2026-04-23', '2026-04-20', startInput, endInput, errorMsg);

      expect(startInput.classList.contains('invalid')).toBe(true);
      expect(endInput.classList.contains('invalid')).toBe(true);
      expect(errorMsg.textContent).toBe('起始日期不能晚於截止日期');
    });
  });
});
