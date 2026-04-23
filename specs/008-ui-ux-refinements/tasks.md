# Tasks: UI/UX 優化 (UI/UX Refinements)

## Phase 1: Setup & Foundational
- [ ] T001 建立 `specs/008-ui-ux-refinements/research.md` 並記錄雙捲動條實作方案
- [ ] T002 建立測試檔案 `tests/unit/ui-refinements.test.js` 並設置基礎測試環境
- [ ] T003 [P] 在 `tests/unit/ui-refinements.test.js` 增加對 `TodoService.updateTask` 更新日期的驗證測試

## Phase 2: [US1] 看板雙橫向捲動條 (Kanban Dual Scrollbars)
- [ ] T004 [US1] 在 `index.html` 的 `.kanban-container` 上方新增 `.kanban-scroll-top` 結構
- [ ] T005 [P] [US1] 在 `style.css` 實作 `.kanban-scroll-top` 的同步捲動樣式 (overflow-x, dummy height)
- [ ] T006 [US1] 在 `script.js` 實作頂部捲動條與 `.kanban-container` 的即時捲動位置同步邏輯
- [ ] T007 [US1] 在 `script.js` 實作視窗調整大小時同步頂部捲動條寬度的邏輯
- [ ] T008 [US1] 在 `tests/unit/ui-refinements.test.js` 驗證捲動位置同步函數

## Phase 3: [US2] 任務日期編輯 (Edit Task Dates in Card)
- [ ] T009 [US2] 在 `script.js` 的 `renderTodoItem` 函數中，為編輯模式新增起始與截止日期的 `<input type="date">`
- [ ] T010 [P] [US2] 在 `style.css` 增加任務卡片內日期輸入框的樣式，確保與現有 UI 協調
- [ ] T011 [US2] 在 `script.js` 實作日期輸入框的 `change` 事件處理，調用 `todoService.updateTask` 儲存變更
- [ ] T012 [US2] 更新 `script.js` 中的 `timeLabel` 渲染邏輯，確保起始日期也能顯示在卡片上
- [ ] T013 [US2] 在 `tests/unit/ui-refinements.test.js` 驗證卡片日期更新後的 UI 渲染

## Phase 4: [US3] 篩選按鈕互動優化 (Filter Button Interaction)
- [ ] T014 [US3] 檢查並移除 `script.js` 中篩選按鈕點擊事件內任何可能導致自動聚焦或捲動的代碼 (如 `.focus()`)
- [ ] T015 [P] [US3] 在 `style.css` 檢查 `.filter-btn:focus` 樣式，確保其不帶有強制置中的 outline 或 layout 偏移
- [ ] T016 [US3] 在 `tests/unit/ui-refinements.test.js` 模擬篩選按鈕點擊並驗證頁面捲動位置是否保持不變

## Phase 5: Polish & Compliance
- [ ] T017 執行專案全量單元測試 `npm test` 並修復潛在回歸問題
- [ ] T018 最終視覺檢查，確保各組件在 Dark Mode 下的顯示正確性
- [ ] T019 [Compliance] 檢查並移除代碼中所有殘留的 `console.log`，確保符合專案憲法 V 條款

## Dependencies
US1, US2, US3 均可獨立實作與測試。

## Implementation Strategy
優先實作 US1 與 US2，因為其涉及較多結構性變更。US3 為行為微調，可放在最後處理。
全程遵循 TDD 模式，先在測試檔定義行為再進行實作。
