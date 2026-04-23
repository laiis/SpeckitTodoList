# Tasks: 多行待辦事項輸入 (Multi-line Todo Input)

**Input**: Design documents from `/specs/007-multi-line-todo-input/`
**Prerequisites**: plan.md (required), spec.md (required), research.md, data-model.md, quickstart.md

**Tests**: 依照專案憲法要求 (TDD 模式與 80% 覆蓋率)，本清單包含單元與整合測試任務。

**Organization**: 任務按 User Story 優先順序分組，以實現獨立實作與測試。

## Format: `[ID] [P?] [Story] Description`

- **[P]**: 可並行執行（不同檔案，無相依性）
- **[Story]**: 所屬的 User Story (US1, US2, US3, US4, US5, US6, US7, US8)
- 包含檔案路徑：`index.html`, `style.css`, `script.js`, `server/services/taskService.js`

---

## Phase 1: Setup (Shared Infrastructure)

**Purpose**: 專案初始化與環境檢查

- [x] T001 驗證當前分支 `007-input-type-text` 與環境變數設定
- [x] T002 檢視 `index.html` 與 `script.js` 中既有的待辦事項輸入邏輯

---

## Phase 2: Foundational (Blocking Prerequisites)

**Purpose**: 實作前必須完成的基礎架構與測試準備

- [x] T003 建立測試目錄與基礎配置 `tests/unit/ui.test.js`

---

## Phase 3: User Story 1 - 輸入與檢視多行任務 (Priority: P1) 🎯 MVP

**Goal**: 將輸入框改為 textarea 並支援換行與基本顯示

- [x] T004 [P] [US1] 撰寫單元測試驗證 textarea 換行符保留邏輯於 `tests/unit/taskService.test.js`
- [x] T005 [P] [US1] 撰寫整合測試驗證多行任務的儲存與讀取於 `tests/integration/todo_flow.test.mjs`
- [x] T006 [US1] 修改 `index.html` 將 `.todo-text` 從 `<input type="text">` 變更為 `<textarea>`
- [x] T007 [US1] 更新 `script.js` 以從 `textarea.value` 獲取內容並處理 DOM 元素選擇
- [x] T008 [US1] 更新 `style.css` 加上 `white-space: pre-wrap;` 確保顯示時保留換行

---

## Phase 4: User Story 2 - 長文本視覺管理 (Priority: P2)

**Goal**: 鎖定 10 行高度並提供滾動條

- [x] T009 [US2] 在 `index.html` 為 textarea 增加 `rows="10"` 屬性
- [x] T010 [US2] 在 `style.css` 設定 textarea 為固定高度並禁用 resize 調整大小
- [x] T011 [US2] 在 `style.css` 確保超過內容高度時出現垂直滾動條

---

## Phase 5: User Story 3 - 互動優化與列表縮略 (Priority: P3)

**Goal**: 實作 Ctrl+Enter 提交與列表 3 行縮略

- [x] T012 [US3] 在 `script.js` 為 textarea 增加 `keydown` 監聽器，實作 `Ctrl + Enter` 提交邏輯
- [x] T013 [US3] 在 `style.css` 使用 `-webkit-line-clamp` 實作列表任務內容的 3 行縮略顯示

---

## Phase 6: User Story 4 - 介面佈局滾動優化 (Priority: P2)

**Goal**: 將輸入與看板區域集合在具備垂直滾動條的容器中。

- [x] T019 [US4] 修改 `index.html`，將 `.input-section` 等包裹在新的 `<div class="main-content-scroller">` 中。
- [x] T020 [US4] 在 `style.css` 中定義 `.main-content-scroller` 類別，設定 `overflow: auto;`。
- [x] T021 [US4] 更新 `style.css` 中的 `.container.glass` 佈局。
- [x] T022 [US4] 調整 `style.css` 以確保滾動條樣式一致。
- [x] T023 [US4] 將 `.kanban-container` 的橫軸 scrollbar 移至 `.main-content-scroller`。

---

## Phase 7: User Story 5 - 任務優先序與看板排序 (Priority: P2)

**Goal**: 為任務增加優先序屬性，並按優先序與建立時間排序看板。

- [x] T024 [P] [US5] 執行 SQLite 遷移，在 `tasks` 資料表增加 `priority` (INTEGER) 與 `created_at` (DATETIME)。
- [x] T025 [US5] 更新 `server/services/taskService.js` 以支援儲存與讀取 `priority` 欄位。
- [x] T026 [US5] 修改 `index.html` 增加優先序選擇介面。
- [x] T027 [US5] 更新 `script.js` 的渲染邏輯，顯示優先序狀態。
- [x] T028 [US5] 在 `script.js` 實作看板排序邏輯 (Priority > CreatedAt)。

---

## Phase 8: User Story 6 - 預計完成日期與逾期高亮 (Priority: P2)

**Goal**: 支援設定預計完成日期，並對逾期任務進行視覺標示。

- [x] T029 [P] [US6] 執行 SQLite 遷移，在 `tasks` 資料表增加 `due_date` (DATE)。
- [x] T030 [US6] 修改 `index.html` 增加日期選擇器。
- [x] T031 [US6] 更新 `script.js` 獲取日期值並傳送至後端儲存。
- [x] T032 [US6] 在 `script.js` 渲染任務卡片時，逾期則加入 CSS 類別 `overdue-highlight`。
- [x] T033 [US6] 在 `style.css` 定義 `.overdue-highlight` 樣式。

---

## Phase 9: User Story 7 - UI 流程優化與儲存互動 (Priority: P2)

**Goal**: 預設隱藏輸入區，點擊新增按鈕才顯示，並增加專屬儲存按鈕。

**Independent Test**: 點擊 `+` 按鈕顯示輸入區；輸入後點擊「儲存」按鈕成功新增任務並隱藏輸入區。

### Implementation for User Story 7

- [x] T034 [US7] 修改 `index.html` 將 `#add-btn` (原本的「+」) 移出 `.input-section` 或調整其屬性作為切換按鈕，並在 `.input-section` 內新增一個 `<button id="save-todo-btn">儲存任務</button>`。
- [x] T035 [US7] 在 `style.css` 設定 `.input-section` 預設為 `display: none;`。
- [x] T036 [US7] 在 `script.js` 實作 `#add-btn` 的點擊監聽器，切換 `.input-section` 的顯示狀態。
- [x] T037 [US7] 在 `script.js` 實作 `#save-todo-btn` 的點擊監聽器，呼叫儲存邏輯並在成功後隱藏 `.input-section`。

---

## Phase 10: User Story 8 - 起始日期驗證與欄位 (Priority: P2)

**Goal**: 增加起始日期欄位，並強制要求選擇後才能儲存。

**Independent Test**: 未選擇起始日期時點擊儲存應顯示錯誤或禁用按鈕；選擇後可成功儲存。

### Tests for User Story 8

- [x] T038 [P] [US8] 撰寫整合測試驗證 `start_date` 欄位的資料存取與必填邏輯於 `tests/integration/todo_flow.test.mjs`

### Implementation for User Story 8

- [x] T039 [P] [US8] 執行 SQLite 遷移，在 `tasks` 資料表增加 `start_date` (DATE) 欄位於 `server/db/init.js`。
- [x] T040 [US8] 更新 `server/services/taskService.js` 以支援儲存與讀取 `start_date` 欄位。
- [x] T041 [US8] 修改 `index.html` 在 `.input-section` 中增加「起始日期」選擇器 `<input type="date" id="start-date-input">`。
- [x] T042 [US8] 在 `script.js` 實作儲存前的驗證邏輯，若 `start-date-input` 為空則阻止提交並提示使用者。
- [x] T043 [US8] 更新 `script.js` 的 `addTodo` 函數，將 `start_date` 傳送至後端。

---

## Phase 11: Polish & Cross-Cutting Concerns

**Purpose**: 最終驗證與清理

- [ ] T044 執行 `npm test` 確保 80% 覆蓋率與新功能無誤
- [ ] T045 執行 `quickstart.md` 中的所有驗證步驟
- [ ] T046 修正任何因 UI 隱藏/顯示導致的佈局跳動 (Layout Shift) 問題

---

## Dependencies & Execution Order

### Phase Dependencies

- **Phase 1-8** 是基礎，必須標記完成或確認狀態。
- **User Story 7** 改變了 UI 流程，必須在 **User Story 8** 之前或同時完成，因為儲存按鈕的驗證邏輯與 US8 相關。
- **User Story 8** 依賴資料庫遷移 (T039)。

### Parallel Opportunities

- T034 (HTML) 與 T035 (CSS) 可以並行。
- T039 (DB) 與 T041 (HTML) 可以並行。

---

## Implementation Strategy

### MVP First (User Story 7)

1. 實作 UI 切換邏輯 (T034-T037)。
2. 確保原有的多行儲存功能在新的按鈕流程下運作正常。

### Incremental Delivery

1. 完成 UI 流程優化 (US7)。
2. 加入起始日期驗證 (US8)。
3. 最終驗證所有排序與高亮邏輯 (Polish)。
