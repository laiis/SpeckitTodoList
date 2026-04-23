# Tasks: 多行待辦事項輸入 (Multi-line Todo Input)

**Input**: Design documents from `/specs/007-multi-line-todo-input/`
**Prerequisites**: plan.md (required), spec.md (required), research.md, data-model.md, quickstart.md

**Tests**: 依照專案憲法要求 (TDD 模式與 80% 覆蓋率)，本清單包含單元與整合測試任務。

**Organization**: 任務按 User Story 優先順序分組，以實現獨立實作與測試。

## Format: `[ID] [P?] [Story] Description`

- **[P]**: 可並行執行（不同檔案，無相依性）
- **[Story]**: 所屬的 User Story (US1, US2, US3, US4)
- 包含檔案路徑：`index.html`, `style.css`, `script.js`, `tests/`

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

**Independent Test**: 在輸入框輸入包含 `\n` 的文字，儲存後在列表中能看到換行（或縮略前幾行）

### Tests for User Story 1

- [x] T004 [P] [US1] 撰寫單元測試驗證 textarea 換行符保留邏輯於 `tests/unit/taskService.test.js`
- [x] T005 [P] [US1] 撰寫整合測試驗證多行任務的儲存與讀取於 `tests/integration/todo_flow.test.mjs`

### Implementation for User Story 1

- [x] T006 [US1] 修改 `index.html` 將 `.todo-text` 從 `<input type="text">` 變更為 `<textarea>`
- [x] T007 [US1] 更新 `script.js` 以從 `textarea.value` 獲取內容並處理 DOM 元素選擇
- [x] T008 [US1] 更新 `style.css` 加上 `white-space: pre-wrap;` 確保顯示時保留換行

---

## Phase 4: User Story 2 - 長文本視覺管理 (Priority: P2)

**Goal**: 鎖定 10 行高度並提供滾動條

**Independent Test**: 輸入超過 10 行內容，確認高度固定且出現滾動條

### Implementation for User Story 2

- [x] T009 [US2] 在 `index.html` 為 textarea 增加 `rows="10"` 屬性
- [x] T010 [US2] 在 `style.css` 設定 textarea 為固定高度並禁用 resize 調整大小
- [x] T011 [US2] 在 `style.css` 確保超過內容高度時出現垂直滾動條

---

## Phase 5: User Story 3 - 互動優化與列表縮略 (Priority: P3)

**Goal**: 實作 Ctrl+Enter 提交與列表 3 行縮略

**Independent Test**: 按下 Ctrl+Enter 成功提交任務；列表中長任務僅顯示 3 行

### Implementation for User Story 3

- [x] T013.1 [P] [US3] 撰寫單元測試驗證列表任務內容的 3 行縮略 CSS 屬性於 `tests/unit/ui.test.js`
- [x] T012 [US3] 在 `script.js` 為 textarea 增加 `keydown` 監聽器，實作 `Ctrl + Enter` 提交邏輯
- [x] T013 [US3] 在 `style.css` 使用 `-webkit-line-clamp` 實作列表任務內容的 3 行縮略顯示

---

## Phase 6: Polish & Cross-Cutting Concerns

**Purpose**: 最終驗證與清理

- [x] T014 執行 `npm test` 確保 80% 覆蓋率與無回歸錯誤
- [x] T015 執行 `quickstart.md` 中的所有驗證步驟
- [x] T016 更新 `README.md` (如有必要) 關於快捷鍵的說明
- [x] T017 [P] 使用 Logger 記錄多行任務建立事件於 `server/services/taskService.js`

---

## Phase 7: UI Refinement (Bug Fix)

**Purpose**: 修正佈局問題，確保在多行輸入下看板內容依然可見

- [x] T018 修正 `style.css` 中 `.container.glass` 的固定高度問題，將其改為自適應或調整最大高度，以確保 `.kanban.container` 內容不被遮蔽

---

## Phase 8: User Story 4 - 介面佈局滾動優化 (Priority: P2)

**Goal**: 將輸入與看板區域集合在具備垂直滾動條的容器中，優化瀏覽體驗。

**Independent Test**: 縮小瀏覽器高度，確認主內容區域出現垂直滾動條，且 Header 與 Footer 保持可見。

### Implementation for User Story 4

- [ ] T019 [US4] 修改 `index.html`，將 `.input-section`, `.filter-section`, `.mobile-tabs`, `.kanban-container` 包裹在新的 `<div class="main-content-scroller">` 中 (對應 FR-008)。
- [ ] T020 [US4] 在 `style.css` 中定義 `.main-content-scroller` 類別，設定 `overflow-y: auto;` 並確保其能填充剩餘空間 (對應 FR-008)。
- [ ] T021 [US4] 更新 `style.css` 中的 `.container.glass` 佈局，設定為垂直 Flex 佈局並限制高度為 `90vh`，以驗證 SC-004。
- [ ] T022 [US4] 調整 `style.css` 以確保滾動條樣式一致，並最終驗證 SC-004 的 Header/Footer 固定效果。


---

## Dependencies & Execution Order

### Phase Dependencies

- **Setup (Phase 1)** -> **Foundational (Phase 2)** -> **User Stories (Phase 3+)**
- **User Story 1 (P1)** 必須優先於 **US2** 與 **US3** 的細節調整。
- **User Story 4 (P2)** 可與 **US2/US3** 並行，但建議在基礎輸入功能完成後進行。

### Parallel Opportunities

- T019, T020, T021 涉及 HTML 與 CSS 的調整，應按順序執行或由同一開發者處理。

---

## Implementation Strategy

### MVP First (User Story 1 Only)

1. 完成基礎變更 (T006, T007)。
2. 確保多行內容可儲存且不發生 XSS。
3. 驗證基本換行顯示。

### Incremental Delivery

1. 達成換行支援 (US1)。
2. 加入視覺限制 (US2)。
3. 優化操作體驗 (US3)。
4. 優化整體佈局滾動體驗 (US4)。
