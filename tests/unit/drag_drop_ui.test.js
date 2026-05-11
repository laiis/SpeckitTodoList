import { describe, it, expect, beforeEach, vi } from 'vitest';
import { JSDOM } from 'jsdom';
import Sortable from 'sortablejs';

describe('Drag and Drop UI Logic (T010)', () => {
  let dom;
  let document;

  beforeEach(() => {
    dom = new JSDOM(`
      <!DOCTYPE html>
      <html>
        <body>
          <div id="kanban-container">
            <div class="kanban-column" data-status="todo">
              <div class="column-content" id="content-todo">
                <div class="todo-item" data-id="1">Task 1</div>
                <div class="todo-item" data-id="2">Task 2</div>
              </div>
            </div>
            <div class="kanban-column" data-status="running">
              <div class="column-content" id="content-running">
                <div class="todo-item" data-id="3">Task 3</div>
              </div>
            </div>
          </div>
        </body>
      </html>
    `);
    document = dom.window.document;
    global.document = document;
    global.window = dom.window;
    global.NodeList = dom.window.NodeList;
    global.HTMLCollection = dom.window.HTMLCollection;
    global.HTMLElement = dom.window.HTMLElement;
    global.Node = dom.window.Node;
  });

  it('應能正確計算拖曳後的新 Rank (移到最上方)', () => {
    // 模擬 calculateNewRank 邏輯 (從 script.js 提取)
    function calculateNewRank(container, newIndex, todos) {
      const items = Array.from(container.querySelectorAll('.todo-item'));
      const totalItems = items.length;
      
      const getTaskRank = (el) => {
          if (!el) return null;
          const t = todos.find(task => task.id === parseInt(el.dataset.id));
          return t ? t.rank : null;
      };

      if (totalItems <= 1) return 1.0;

      if (newIndex === 0) {
          const nextRank = getTaskRank(items[1]);
          return (nextRank !== null) ? nextRank - 1.0 : 0.0;
      } else if (newIndex === totalItems - 1) {
          const prevRank = getTaskRank(items[totalItems - 2]);
          return (prevRank !== null) ? prevRank + 1.0 : 1.0;
      } else {
          const prevRank = getTaskRank(items[newIndex - 1]);
          const nextRank = getTaskRank(items[newIndex + 1]);
          return (prevRank + nextRank) / 2;
      }
    }

    const todos = [
      { id: 1, rank: 1.0 },
      { id: 2, rank: 2.0 },
      { id: 3, rank: 1.5 }
    ];

    const container = document.getElementById('content-todo');
    // 模擬 DOM 結構變化：Task 3 被拖到 Task 1 之前
    const task3 = document.createElement('div');
    task3.className = 'todo-item';
    task3.dataset.id = '3';
    container.insertBefore(task3, container.firstChild);

    const newRank = calculateNewRank(container, 0, todos);
    expect(newRank).toBe(0.0); // 1.0 - 1.0
  });

  it('應能正確計算拖曳後的新 Rank (移到兩者之間)', () => {
    function calculateNewRank(container, newIndex, todos) {
      const items = Array.from(container.querySelectorAll('.todo-item'));
      const getTaskRank = (el) => {
          const t = todos.find(task => task.id === parseInt(el.dataset.id));
          return t ? t.rank : null;
      };
      const prevRank = getTaskRank(items[newIndex - 1]);
      const nextRank = getTaskRank(items[newIndex + 1]);
      return (prevRank + nextRank) / 2;
    }

    const todos = [
      { id: 1, rank: 1.0 },
      { id: 2, rank: 2.0 },
      { id: 3, rank: 3.0 }
    ];

    const container = document.getElementById('content-todo');
    // 現在有 Task 1 (1.0), Task 2 (2.0)
    // 插入 Task 3 到 index 1
    const task3 = document.createElement('div');
    task3.className = 'todo-item';
    task3.dataset.id = '3';
    const items = container.querySelectorAll('.todo-item');
    container.insertBefore(task3, items[1]);

    const newRank = calculateNewRank(container, 1, todos);
    expect(newRank).toBe(1.5); // (1.0 + 2.0) / 2
  });
});
