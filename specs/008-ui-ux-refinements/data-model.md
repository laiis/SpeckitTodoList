# Data Model: UI/UX Refinements

## Entities

### Todo Item (Existing)
No schema changes are required. The focus is on implementing validation logic during updates.

| Field | Type | Description | Validation |
|-------|------|-------------|------------|
| `start_date` | Date (String) | Task start date | `start_date <= due_date` |
| `due_date` | Date (String) | Task due date | `due_date >= start_date` |

## Validation Logic

### Client-side Validation
1.  **Logical Check**: When saving a todo item in the card editor, check if `startDate` and `dueDate` are both present.
2.  **Constraint**: `new Date(startDate) <= new Date(dueDate)`.
3.  **UI Feedback**:
    - If validation fails, apply `.invalid` class (red border) to both inputs.
    - Show tooltip: "起始日期不能晚於截止日期".
    - Prevent the `save` API call.

### Server-side Validation
1.  **Endpoint**: `PUT /api/tasks/:id`.
2.  **Check**: Ensure the dates provided in the body satisfy the logical constraint.
3.  **Response**: Return `400 Bad Request` if validation fails.

## State Transitions
N/A - This feature focuses on data integrity during editing.
