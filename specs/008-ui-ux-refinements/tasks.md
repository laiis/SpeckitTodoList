# Tasks: UI/UX 優化 (UI/UX Refinements)

## Phase 1: Setup (Shared Infrastructure)

- [x] T001 更新 `GEMINI.md` 以連結至新的實作計畫 `specs/008-ui-ux-refinements/plan.md`
- [x] T002 建立測試檔案 `tests/unit/ui-refinements.test.js` 並設置基礎測試環境

---

## Phase 2: Foundational (Blocking Prerequisites)

- [x] T003 [P] 在 `style.css` 定義共通的 `.invalid` 樣式 (red border) 與 `.error-message` (small red text)
- [x] T004 在 `script.js` 封裝 `requestAnimationFrame` 基礎同步函數以確保 60fps 效能
- [x] T024 [US2] 在 `services/taskService.js` (前端) 封裝 `validateDateRange(start, end)` 邏輯以符合憲法 IV

---

## Phase 3: User Story 1 - 看板雙橫向捲動條 (Priority: P1) 🎯 MVP

**Goal**: 在看板頂部實作與內容同步的橫向捲動條。

**Independent Test**: 當手動捲動頂部捲動條時，`.kanban-container` 應同步移動；當看板內容寬度改變時，頂部捲動條應自動調整 or 隱藏。

### Tests for User Story 1

- [x] T005 [P] [US1] 在 `tests/unit/ui-refinements.test.js` 撰寫測試驗證捲動同步函數的偏移量正確性
- [x] T006 [P] [US1] 在 `tests/unit/ui-refinements.test.js` 撰寫測試驗證 `ResizeObserver` 能正確觸發寬度更新及隱藏行為

### Implementation for User Story 1

- [x] T007 [US1] 在 `index.html` 的 `.kanban-container` 上方新增 `.kanban-scroll-top` 與其虛擬內容結構
- [x] T008 [P] [US1] 在 `style.css` 設定 `.kanban-scroll-top` 樣式 (overflow-x: auto, height: 15px)
- [x] T009 [US1] 在 `script.js` 初始化 `ResizeObserver` 以監聽 `.kanban-container` 的 `scrollWidth`
- [x] T010 [US1] 在 `script.js` 實作雙向捲動監聽，包含寬度不足時自動隱藏邏輯，並使用 `requestAnimationFrame` 限制同步頻率 (延遲 < 16ms)

---

## Phase 4: User Story 2 - 任務日期編輯 (Priority: P1)

**Goal**: 在任務卡片內直接編輯起始與截止日期，具備邏輯驗證與錯誤訊息顯示。

**Independent Test**: 編輯卡片日期後儲存，資料庫與 UI 標籤應即時更新；若驗證失敗，應顯示錯誤文字。

### Tests for User Story 2

- [x] T011 [P] [US2] 在 `tests/unit/ui-refinements.test.js` 撰寫 `taskService.validateDateRange` 的測試案例 (包含合法、非法與空值)
- [x] T012 [P] [US2] 在 `tests/unit/ui-refinements.test.js` 撰寫 UI 測試，驗證非法日期時輸入框是否顯示紅框與錯誤訊息

### Implementation for User Story 2

- [x] T013 [US2] 修改 `script.js` 中的 `renderTodoItem` 函數，在編輯模式下渲染日期輸入框與 `.error-message` 容器
- [x] T014 [P] [US2] 在 `style.css` 調整卡片內日期輸入框與錯誤訊息的樣式與間距
- [x] T015 [US2] 在 `script.js` 的儲存邏輯中調用 `taskService.validateDateRange`，失敗時顯示錯誤訊息並套用 `.invalid` 樣式
- [x] T016 [US2] 修改 `script.js` 的資料發送邏輯，支援將清空的日期欄位傳送為 `null`
- [x] T017 [US2] 更新 `script.js` 中的 `timeLabel` 顯示邏輯，確保儲存後即時反映新的日期區間
- [x] T025 [US2] 修改 `index.html` 的任務樣板結構，預留存放錯誤訊息的容器空間

---

## Phase 5: User Story 3 - 篩選按鈕互動優化 (Priority: P2)

**Goal**: 點擊篩選按鈕時頁面不產生非預期的位移。

**Independent Test**: 在捲動頁面後點擊「待完成」按鈕，視窗垂直位置應保持不變。

### Implementation for User Story 3

- [x] T018 [US3] 在 `script.js` 的篩選按鈕點擊事件處理程序中加入 `event.preventDefault()`
- [x] T019 [US3] 移除 `script.js` 中所有與篩選操作相關的 `.focus()` 或 `.scrollIntoView()` 調用
- [x] T020 [P] [US3] 在 `style.css` 檢查並修復可能導致 Layout Shift 的按鈕狀態樣式

---

## Phase 6: Polish & Cross-Cutting Concerns

- [x] T021 執行全量測試 `npm test` 確保無功能回歸
- [x] T022 [P] 檢查並移除所有代碼中的 `console.log`，改用專案 Logger (憲法條款 V)
- [x] T023 執行 `specs/008-ui-ux-refinements/quickstart.md` 中的所有驗證場景

---

## Dependencies & Execution Order

- **Phase 1 & 2** 是所有後續開發的基礎。
- **US1 (Phase 3)** 與 **US2 (Phase 4)** 優先順序最高 (P1)，可併行開發。
- **US3 (Phase 5)** 優先度較低，在 P1 任務完成後執行。

### Parallel Opportunities

- T003 與 T004 可併行。
- US1 (T005, T006, T008) 與 US2 (T011, T012, T014) 可由不同開發者同時進行。
- 不同 User Story 內的測試 (T005, T011) 可同步撰寫。

---

## Implementation Strategy

1. **MVP (US1)**: 先完成看板頂部捲動條，這是使用者最有感的體驗改進。
2. **Data Integrity (US2)**: 實作具備驗證機制的日期編輯。
3. **Refinement (US3)**: 最後修復微小的互動位移問題。
