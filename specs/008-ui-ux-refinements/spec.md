# Feature Specification: UI/UX 優化 (UI/UX Refinements)

## User Stories

### US1: 看板雙橫向捲動條 (Kanban Dual Scrollbars)
**Priority**: P1
**Description**: 作為一個使用者，我希望在看板頂部也能看到並操作橫向捲動條，這樣當看板內容很長時，我不需要捲動到頁面底部才能進行橫向移動。
**Acceptance Criteria**:
- 在 `.kanban-container` 上方出現一個橫向捲動條。
- 頂部捲動條與底部捲動條（原生）的位置保持即時同步。
- 當看板內容寬度不足以觸發捲動時，頂部捲動條應隱藏。

### US2: 任務日期編輯 (Edit Task Dates in Card)
**Priority**: P1
**Description**: 作為一個使用者，我希望可以直接在任務卡片上編輯起始時間與截止時間，而不需要透過頂部的輸入區。
**Acceptance Criteria**:
- 在 `.todo-item` 進入編輯模式時，顯示起始日期與截止日期的輸入框。
- 編輯後的日期應能正確儲存至資料庫。
- 儲存後卡片上的時間標籤應即時更新。

### US3: 篩選按鈕互動優化 (Filter Button Interaction)
**Priority**: P2
**Description**: 作為一個使用者，我點擊篩選按鈕時，希望畫面不要自動捲動到該按鈕置中的位置，以保持閱讀的一致性。
**Acceptance Criteria**:
- 點擊「全部」、「待完成」、「已完成」按鈕時，頁面垂直捲動位置應保持不變。
- 消除任何因點擊按鈕而產生的非預期畫面位移。
