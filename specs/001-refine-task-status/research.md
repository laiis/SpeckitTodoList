# Research: 任務狀態細分實作 (Refine Task Status)

## 1. 資料遷移路徑 (Data Migration)

**決策**: 啟動時自動檢查 `localStorage` 內的任務資料格式，並進行「原地 (In-place) 遷移」。

**Rationale**:
- 使用者目前可能已有既有資料，直接刪除會造成不便。
- 舊格式為 `completed: true/false`，新格式為 `status: 'Done' | 'Todo' | 'Running' | 'Testing' | 'Backlog'`。
- 遷移規則：
  - `completed: true` → `status: 'Done'`
  - `completed: false` → `status: 'Todo'` (預設)

**Alternatives considered**:
- **重新命名資料鍵 (Key Rename)**：例如將 `todo-list` 改為 `todo-list-v2`。缺點是使用者會看到空白列表，需手動匯入。

## 2. 狀態下拉選單 UI 實作 (Status Dropdown UI)

**決策**: 使用 `<select>` 搭配客製化 CSS 玻璃擬態樣式。

**Rationale**:
- `<select>` 提供最佳的原生可存取性 (Accessibility)。
- 透過 CSS `backdrop-filter: blur()` 與 `background: rgba(...)` 達成玻璃擬態，保持視覺一致性。
- 為不同狀態分配專屬色標（如：Testing 為橘色，Done 為綠色），提高辨識度。

**Alternatives considered**:
- **客製化 Div 下拉選單**：視覺效果更彈性，但實作較複雜且對鍵盤導覽不友善。

## 3. 狀態同步邏輯 (State Synchronization)

**決策**: 單向數據流由 `status` 主導 `checkbox` 狀態。

**Rationale**:
- 當 `status === 'Done'` 時，自動將 `completed` 設為 `true`。
- 當 `status !== 'Done'` 時，自動將 `completed` 設為 `false`。
- 這樣可以保留既有的「已完成」篩選邏輯，不需要重寫整個過濾引擎。

**Alternatives considered**:
- **雙向綁定 (Two-way binding)**：過於複雜，且容易造成無限迴圈觸發儲存事件。
