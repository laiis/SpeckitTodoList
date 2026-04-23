# Feature Specification: UI/UX 優化 (UI/UX Refinements)

## Clarifications
### Session 2026-04-23
- Q: US1 看板雙橫向捲動條：頂部捲動條的視覺與實作方式為何？ → A: 建立一個隱藏內容的虛擬 div，寬度與看板同步，透過監聽 scroll 事件進行雙向同步。
- Q: US2 任務日期編輯：編輯模式的控制項類型？ → A: 使用原生 `<input type="date">` 控制項。
- Q: US2 任務日期編輯：日期邏輯驗證規則？ → A: 起始日期必須小於或等於截止日期。
- Q: US3 篩選按鈕互動優化：如何防止捲動？ → A: 在事件處理程序中使用 `event.preventDefault()` 或改用 `<button>`。
- Q: 效能與平滑度要求？ → A: 捲動同步延遲應小於 16ms (60fps)。
- Q: 視窗縮放 (Resize) 時的捲動條寬度處理？ → A: 使用 ResizeObserver 自動同步虛擬 div 寬度。
- Q: 日期驗證失敗時的 UI 回饋？ → A: 輸入框變紅並顯示驗證提示。
- Q: 日期空值處理？ → A: 允許空值，清除內容即視為刪除日期。

## User Stories

### US1: 看板雙橫向捲動條 (Kanban Dual Scrollbars)
**Priority**: P1
**Description**: 作為一個使用者，我希望在看板頂部也能看到並操作橫向捲動條，這樣當看板內容很長時，我不需要捲動到頁面底部才能進行橫向移動。
**Acceptance Criteria**:
- 在 `.kanban-container` 上方出現一個橫向捲動條（透過寬度同步的虛擬 div 實作）。
- 頂部捲動條與底部捲動條（原生）的位置保持即時同步（延遲 < 16ms）。
- 使用 `ResizeObserver` 確保在視窗縮放或內容變動時，頂部捲動條寬度自動同步。
- 當看板內容寬度不足以觸發捲動時，頂部捲動條應隱藏 (`display: none`)。

### US2: 任務日期編輯 (Edit Task Dates in Card)
**Priority**: P1
**Description**: 作為一個使用者，我希望可以直接在任務卡片上編輯起始時間與截止時間，而不需要透過頂部的輸入區。
**Acceptance Criteria**:
- 在 `.todo-item` 進入編輯模式時，顯示起始日期與截止日期的 `<input type="date">` 輸入框。
- 編輯後的日期應能正確儲存至資料庫。
- 驗證邏輯：起始日期必須小於或等於截止日期。若驗證失敗，輸入框應變紅並在下方顯示具體的錯誤訊息文字 (例如: "起始日期不得晚於截止日期")，且不予儲存。
- 支援空值：若清除日期輸入框內容並儲存，應正確刪除該任務的日期設定。
- 儲存後卡片上的時間標籤應即時更新。

### US3: 篩選按鈕互動優化 (Filter Button Interaction)
**Priority**: P2
**Description**: 作為一個使用者，我點擊篩選按鈕時，希望畫面不要自動捲動到該按鈕置中的位置，以保持閱讀的一致性。
**Acceptance Criteria**:
- 點擊「全部」、「待完成」、「已完成」按鈕時，透過 `preventDefault()` 確保頁面垂直捲動位置保持不變。
- 消除任何因點擊按鈕而產生的非預期畫面位移。
