# Research: UI/UX Refinements

## US1: Kanban Top Scrollbar Implementation

### Problem
Standard browser scrollbars only appear at the bottom of overflow containers. In a kanban view with many items, users must scroll to the bottom of the page to reach the horizontal scrollbar.

### Solution: Synchronized Dummy Scrollbar
1.  **HTML Structure**:
    ```html
    <div class="kanban-scroll-top" style="overflow-x: auto; overflow-y: hidden;">
      <div class="kanban-dummy-content" style="height: 1px;"></div>
    </div>
    <div class="kanban-container" id="kanban-container">...</div>
    ```
2.  **CSS**:
    - `.kanban-scroll-top` should have the same width/margin as `.kanban-container`.
    - `.kanban-dummy-content` width should be set via JS to match `kanbanContainer.scrollWidth`.
3.  **JS Synchronization**:
    ```javascript
    const scrollTop = document.querySelector('.kanban-scroll-top');
    const container = document.getElementById('kanban-container');

    scrollTop.onscroll = () => {
        container.scrollLeft = scrollTop.scrollLeft;
    };
    container.onscroll = () => {
        scrollTop.scrollLeft = container.scrollLeft;
    };
    ```

## US2: Date Editing in Card

### UI Integration
- The current `todo-item` rendering logic creates a `timeLabel` span.
- In edit mode, we will hide `timeLabel` and show two `<input type="date">` elements.
- Labels: "起始:" and "截止:".
- Data: `todo.start_date` and `todo.due_date`.

## US3: Filter Button Focus

### Root Cause Analysis
- Browsers might automatically scroll an element into view if it receives focus and is partially off-screen.
- The `active` class transition might trigger a layout recalculation.
- Ensure `button:focus { outline: none; }` or use `tabindex="-1"` if focus isn't needed for click interaction (while maintaining accessibility).
- In `script.js`, ensure no `scrollIntoView()` is called during `render()`.
