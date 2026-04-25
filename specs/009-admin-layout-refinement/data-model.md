# UI Structure: Admin Dashboard Refinement

## Component Tree

- **Admin Wrapper** (div.admin-wrapper)
  - **Header** (header.glass.sticky-header)
    - **Title** (h1)
    - **Back Button** (a.btn-back)
  - **Main Content** (main.admin-main)
    - **User Section** (section.glass.user-mgmt) - `flex: 2`
    - **Log Section** (section.glass.sys-logs) - `flex: 3`

## CSS Variables / Constraints

| Property | Value | Rationale |
|----------|-------|-----------|
| `--min-width` | 1200px | 確保並排時內容不擁擠 |
| `--ratio-user` | 2 | Flex-grow factor |
| `--ratio-log` | 3 | Flex-grow factor |
| `--header-height` | Auto | 隨內容彈性 |

## State Transitions (UI Only)

1. **Initial Load**:
   - Header sticky at top.
   - User table and Logs container side-by-side.
2. **Viewport Resizing**:
   - Width > 1200px: Content stretches proportionally.
   - Width < 1200px: `admin-wrapper` shows horizontal scrollbar.
3. **Scrolling**:
   - Header remains fixed at `top: 0` once it hits the top edge.
   - Main content scrolls vertically beneath the header.
