# Tasks: 多行待辦事項輸入 (Multi-line Todo Input)

**Input**: Design documents from `/specs/007-multi-line-todo-input/`
**Prerequisites**: plan.md (required), spec.md (required), research.md, data-model.md, quickstart.md

**Tests**: 依照專案憲法要求 (TDD 模式與 80% 覆蓋率)，本清單包含單元與整合測試任務。

**Organization**: 任務按 User Story 優先順序分組，以實現獨立實作與測試。

## Format: `[ID] [P?] [Story] Description`

- **[P]**: 可並行執行（不同檔案，無相依性）
- **[Story]**: 所屬的 User Story (US1, US2, US3)
- 包含檔案路徑：`public/`, `server/`, `tests/`

---

## Phase 1: Setup (Shared Infrastructure)

**Purpose**: 專案初始化與環境檢查

- [ ] T001 驗證當前分支 `007-input-type-text` 與環境變數設定
- [ ] T002 檢視 `public/index.html` 與 `public/script.js` 中既有的待辦事項輸入邏輯

---

## Phase 2: Foundational (Blocking Prerequisites)

**Purpose**: 實作前必須完成的基礎架構與測試準備

- [ ] T003 建立測試目錄與基礎配置 `tests/unit/ui.test.js`

---

## Phase 3: User Story 1 - 輸入與檢視多行任務 (Priority: P1) 🎯 MVP

**Goal**: 將輸入框改為 textarea 並支援換行與基本顯示

**Independent Test**: 在輸入框輸入包含 `\n` 的文字，儲存後在列表中能看到換行（或縮略前幾行）

### Tests for User Story 1

- [ ] T004 [P] [US1] 撰寫單元測試驗證 textarea 換行符保留邏輯於 `tests/unit/taskService.test.js`
- [ ] T005 [P] [US1] 撰寫整合測試驗證多行任務的儲存與讀取於 `tests/integration/todo_flow.test.mjs`

### Implementation for User Story 1

- [ ] T006 [US1] 修改 `public/index.html` 將 `.todo-text` 從 `<input type="text">` 變更為 `<textarea>`
- [ ] T007 [US1] 更新 `public/script.js` 以從 `textarea.value` 獲取內容並處理 DOM 元素選擇
- [ ] T008 [US1] 更新 `public/style.css` 加上 `white-space: pre-wrap;` 確保顯示時保留換行

**Checkpoint**: 支援多行輸入與顯示，MVP 核心功能完成。

---

## Phase 4: User Story 2 - 長文本視覺管理 (Priority: P2)

**Goal**: 鎖定 10 行高度並提供滾動條

**Independent Test**: 輸入超過 10 行內容，確認高度固定且出現滾動條

### Implementation for User Story 2

- [ ] T009 [US2] 在 `public/index.html` 為 textarea 增加 `rows="10"` 屬性
- [ ] T010 [US2] 在 `public/style.css` 設定 textarea 為固定高度並禁用 resize 調整大小
- [ ] T011 [US2] 在 `public/style.css` 確保超過內容高度時出現垂直滾動條

**Checkpoint**: 輸入框視覺佈局穩定，長文本管理優化。

---

## Phase 5: User Story 3 - 互動優化與列表縮略 (Priority: P3)

**Goal**: 實作 Ctrl+Enter 提交與列表 3 行縮略

**Independent Test**: 按下 Ctrl+Enter 成功提交任務；列表中長任務僅顯示 3 行

### Implementation for User Story 3

- [ ] T012 [US3] 在 `public/script.js` 為 textarea 增加 `keydown` 監聽器，實作 `Ctrl + Enter` 提交邏輯
- [ ] T013 [US3] 在 `public/style.css` 使用 `-webkit-line-clamp` 實作列表任務內容的 3 行縮略顯示

---

## Phase 6: Polish & Cross-Cutting Concerns

**Purpose**: 最終驗證與清理

- [ ] T014 執行 `npm test` 確保 80% 覆蓋率與無回歸錯誤
- [ ] T015 執行 `quickstart.md` 中的所有驗證步驟
- [ ] T016 更新 `README.md` (如有必要) 關於快捷鍵的說明
- [ ] T017 [P] 使用 Logger 記錄多行任務建立事件於 `server/services/taskService.js`

---

## Dependencies & Execution Order

### Phase Dependencies

- **Setup (Phase 1)** -> **Foundational (Phase 2)** -> **User Stories (Phase 3+)**
- **User Story 1 (P1)** 必須優先於 **US2** 與 **US3** 的細節調整。

### Parallel Opportunities

- T004 與 T005 可並行執行（測試撰寫）。
- T010 與 T011 可並行執行（樣式定義）。

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
