# Quickstart: UI/UX Refinements

## Development Setup

1.  **Branch**: Ensure you are on `008-ui-ux-refinements`.
2.  **Server**: Start the backend server.
    ```bash
    npm run start
    ```
3.  **Frontend**: Open `index.html` via Live Server or browse to `http://localhost:3000`.

## Feature Verification

### US1: Kanban Top Scrollbar
1.  Add enough tasks/columns to trigger horizontal scrolling.
2.  Locate the new scrollbar at the top of the kanban board.
3.  Scroll the top bar; verify the bottom bar and content move synchronously.
4.  Resize the window; verify the top bar width adjusts.

### US2: Card Date Editing
1.  Click a task card to enter edit mode.
2.  Change the start/due dates.
3.  Test validation: Set start date later than due date. Verify red border and save prevention.
4.  Test empty state: Clear a date and save. Verify the date is removed.

### US3: Filter Interaction
1.  Scroll down the page so the filter buttons are at the top.
2.  Click "Pending" or "Completed".
3.  Verify the page does NOT jump or scroll.

## Testing

Run unit and UI tests:
```bash
npm test tests/unit/ui-refinements.test.js
```
