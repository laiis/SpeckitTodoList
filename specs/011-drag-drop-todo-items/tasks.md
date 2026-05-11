# Tasks: 拖拉式任務管理 (Drag-and-Drop Task Management)

**Input**: Design documents from `/specs/011-drag-drop-todo-items/`
**Prerequisites**: plan.md (required), spec.md (required for user stories), research.md, data-model.md, contracts/

**Tests**: 根據專案憲法 (Constitution) 要求 TDD 開發模式，本任務清單包含測試任務。

**Organization**: 任務按使用者故事 (User Story) 分組，以實現各個故事的獨立實作與測試。

## Format: `[ID] [P?] [Story] Description`

- **[P]**: 可並行執行（不同檔案，無相依性）
- **[Story]**: 任務所屬的使用者故事 (如 US1, US2, US3)
- 描述中包含正確的檔案路徑

## Phase 1: Setup (Shared Infrastructure)

**Purpose**: 專案初始化與基礎結構設定

- [ ] T001 安裝 SortableJS 依賴項 `npm install sortablejs`
- [ ] T002 [P] 在 `style.css` 中定義拖拉相關的基礎 CSS 類別 (如 `.drag-ghost`, `.drag-chosen`)
- [ ] T003 [P] 驗證 Vitest 測試環境是否正常執行 `npm test`

---

## Phase 2: Foundational (Blocking Prerequisites)

**Purpose**: 在實作任何使用者故事之前必須完成的核心基礎設施

**⚠️ CRITICAL**: 在此階段完成前，不可開始使用者故事的工作

- [ ] T004 更新資料庫 Schema，在 `server/db/init.js` 中為 `tasks` 資料表新增 `rank` (REAL) 欄位
- [ ] T005 撰寫資料庫遷移指令，為現有任務初始化 `rank` 值（如按 ID 遞增排序賦值）
- [ ] T006 更新 `server/services/taskService.js` 以支援 `rank` 欄位的讀取與基本賦值，並確保符合憲法 V 的日誌格式
- [ ] T007 在 `tests/unit/taskService.test.js` 中新增全面單元測試，驗證 Rank 計算（平均值、邊際精度處理）與狀態更新邏輯，確保 Service 層覆蓋率 > 80%
- [ ] T008 [P] 設定 API 路由基礎結構，確保 `server/routes/tasks.js` 準備好接受 PATCH 請求，並實作符合憲法 V 的日誌記錄

**Checkpoint**: 基礎設施已就緒 - 現在可以並行開始使用者故事的實作

---

## Phase 3: User Story 1 - 任務狀態跨河道更新 (Priority: P1) 🎯 MVP

**Goal**: 實現任務在不同河道間的拖放，並透過 API 持久化狀態與排序。

**Independent Test**: 將任務從「待辦」拖到「進行中」，重新整理頁面後任務仍留在「進行中」。

### Tests for User Story 1 ⚠️

> **注意：先撰寫這些測試，確保在實作前測試失敗**

- [ ] T009 [P] [US1] 在 `tests/integration/tasks.test.js` 中撰寫 `PATCH /api/tasks/:id` 的集成測試，驗證狀態與 Rank 更新
- [ ] T010 [US1] 在 `tests/e2e/drag_drop.test.js` (或現有 UI 測試) 中撰寫基礎拖拉互動測試腳本

### Implementation for User Story 1

- [ ] T011 [US1] 在 `server/services/taskService.js` 中實作更新任務狀態與 Rank 的業務邏輯
- [ ] T012 [US1] 在 `server/routes/tasks.js` 中實作 `PATCH /api/tasks/:id` 路由端點
- [ ] T013 [US1] 在 `script.js` 中初始化 SortableJS，並連結各個狀態河道 (Lanes)
- [ ] T014 [US1] 在 `script.js` 的 `onEnd` 回調中實作 API 呼叫，將新的狀態與 Rank 傳送至後端
- [ ] T015 [US1] 在 `script.js` 中處理 API 回傳結果，若失敗則提示使用者並將卡片復原至原始位置 (Visual Undo)

**Checkpoint**: 此時，使用者故事 1 應能獨立運作且可被測試

---

## Phase 4: User Story 2 - 拖拉過程中的視覺提示 (Priority: P2)

**Goal**: 在拖曳過程中提供明確的視覺回饋（如半透明、佔位框）。

**Independent Test**: 拖動卡片時，原位置顯示虛線佔位框，被拖動卡片變為半透明。

### Implementation for User Story 2

- [ ] T016 [P] [US2] 在 `style.css` 中完善 `.drag-ghost` (佔位符) 與 `.drag-chosen` (選中項) 的視覺樣式
- [ ] T017 [US2] 在 `script.js` 的 SortableJS 初始化設定中加入 `ghostClass` 與 `chosenClass` 配置

**Checkpoint**: 使用者故事 1 與 2 現在應該都能獨立運作

---

## Phase 5: User Story 3 - 河道內任務排序 (Priority: P3)

**Goal**: 在同一河道內透過拖拉調整任務的上下順序。

**Independent Test**: 在同一河道內交換兩個任務的位置，重新整理後順序保持不變。

### Implementation for User Story 3

- [ ] T018 [US3] 確保 `server/services/taskService.js` 的 Rank 計算邏輯能正確處理同河道內的排序變更
- [ ] T019 [US3] 驗證 `script.js` 中的 SortableJS 配置允許在同一個 group 內重排

**Checkpoint**: 所有使用者故事現在都應具備獨立功能

---

## Phase N: Polish & Cross-Cutting Concerns

**Purpose**: 影響多個使用者故事的優化項

- [ ] T020 [P] 在 `script.js` 的 SortableJS 配置中啟用 `scroll: true` 以支援自動捲動
- [ ] T021 程式碼清理與重構，確保符合 JavaScript 編碼慣例
- [ ] T022 [P] 執行 `quickstart.md` 中的驗證流程
- [ ] T023 [P] 更新 `README.md` 或相關文件，說明新的拖拉操作功能

---

## Dependencies & Execution Order

### Phase Dependencies

- **Setup (Phase 1)**: 無相依性 - 可立即開始
- **Foundational (Phase 2)**: 依賴 Setup 完成 - 阻擋所有使用者故事
- **User Stories (Phase 3+)**: 均依賴 Foundational 階段完成
  - 使用者故事可按優先順序 (P1 → P2 → P3) 進行
- **Polish (Final Phase)**: 依賴所有核心使用者故事完成

### User Story Dependencies

- **User Story 1 (P1)**: Foundational (Phase 2) 完成後即可開始
- **User Story 2 (P2)**: 可與 US1 並行，但視覺樣式依賴 T002 的定義
- **User Story 3 (P3)**: 依賴 US1 的 API 與 Service 邏輯實作

### Parallel Opportunities

- T002, T003 可並行
- T008 可與 T004-T007 並行 (重編號後需檢查)
- 一旦 Phase 2 完成，US1, US2 的大部分工作可並行

---

## Implementation Strategy

### MVP First (User Story 1 Only)

1. 完成 Phase 1 & 2。
2. 完成 Phase 3 (US1)。
3. **停止並驗證**: 獨立測試 US1。
4. 部署/展示 MVP 版本。

### Incremental Delivery

1. 基礎設施就緒 → 交付 Foundation
2. 加入 US1 → 獨立測試 → 交付 MVP
3. 加入 US2 & US3 → 增加視覺美化與排序功能
4. 最後進行 Polish 與自動捲動優化
