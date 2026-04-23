# Research: UI/UX Refinements

## US1: Kanban Top Scrollbar Implementation

### Problem
Standard browser scrollbars only appear at the bottom of overflow containers. In a kanban view with many items, users must scroll to the bottom of the page to reach the horizontal scrollbar.

### Solution: Synchronized Dummy Scrollbar
1.  **HTML Structure**:
    ```html
    <div class="kanban-scroll-top" style="overflow-x: auto; overflow-y: hidden; height: 15px;">
      <div class="kanban-dummy-content" style="height: 1px;"></div>
    </div>
    <div class="kanban-container" id="kanban-container">...</div>
    ```
2.  **Width Synchronization (ResizeObserver)**:
    - **Decision**: Use `ResizeObserver` to monitor the `scrollWidth` of `.kanban-container`.
    - **Rationale**: This ensures that even when columns are added, removed, or the window is resized, the top scrollbar's width remains perfectly in sync.
3.  **Scroll Synchronization (Performance)**:
    - **Performance Goal**: Sync delay < 16ms (60fps).
    - **Implementation**:
      ```javascript
      const scrollTop = document.querySelector('.kanban-scroll-top');
      const container = document.getElementById('kanban-container');
      let isSyncing = false;

      const sync = (source, target) => {
          if (!isSyncing) {
              isSyncing = true;
              target.scrollLeft = source.scrollLeft;
              requestAnimationFrame(() => isSyncing = false);
          }
      };

      scrollTop.onscroll = () => sync(scrollTop, container);
      container.onscroll = () => sync(container, scrollTop);
      ```

## US2: Date Editing in Card

### UI Integration
- **Control**: Native `<input type="date">`.
- **Validation**:
  - `start_date <= due_date`.
  - UI Feedback: Input border turns red (`border: 1px solid red`) and shows a validation message.
- **Empty State**: Clearing the input and saving will set the date to `null` in the database.

## US3: Filter Button Focus & Scroll

### Root Cause Analysis
- The default behavior of `<a>` tags with `href="#"` or specific focus events might trigger scrolling.
- **Decision**: Use `event.preventDefault()` in click handlers or switch to `<button type="button">`.
- **Rationale**: `preventDefault()` prevents the default browser anchor behavior that often triggers scrolling.
