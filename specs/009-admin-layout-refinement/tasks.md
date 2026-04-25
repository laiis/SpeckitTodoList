# Tasks: 後台管理頁版面優化 (Admin Dashboard Layout Refinement)

**Input**: Design documents from `/specs/009-admin-layout-refinement/`
**Prerequisites**: plan.md, spec.md, research.md, data-model.md, quickstart.md

**Tests**: 根據專案憲法要求，採用 TDD 模式開發，各階段包含測試任務。

**Organization**: 任務按使用者故事 (User Story) 分組，以確保每個功能增量均可獨立實作與測試。

## Format: `[ID] [P?] [Story] Description`

- **[P]**: 可並行執行 (不同檔案，無相依性)
- **[Story]**: 所屬的使用者故事 (US1, US2, US3)
- 說明中包含確切的檔案路徑

---

## Phase 1: Setup (Shared Infrastructure)

**Purpose**: 專案初始化與測試環境設置

- [X] T001 建立 UI 佈局測試檔案 `tests/unit/ui-refinements.test.js`
- [X] T002 [P] 在 `public/pages/admin.html` 內嵌樣式區初始化 CSS 變數 (`--min-width`, `--ratio-user`, `--ratio-log`)

---

## Phase 2: Foundational (Blocking Prerequisites)

**Purpose**: 核心容器結構與全域捲軸配置，此階段必須完成才能開始使用者故事

**⚠️ CRITICAL**: 在此階段完成前，無法開始任何使用者故事的實作

- [X] T003 在 `public/pages/admin.html` 的 `body` 下層建立 `admin-wrapper` 容器
- [X] T004 對 `admin-wrapper` 應用 `min-width: 1200px` 與 `overflow-x: auto` 以支撐橫向捲軸
- [X] T005 設定全頁垂直捲動環境，移除 `body` 或 `html` 的 `overflow: hidden` 限制

**Checkpoint**: 基礎結構已就緒 - 使用者故事實作現在可以開始

---

## Phase 3: User Story 1 - 側邊並排視圖 (Priority: P1) 🎯 MVP

**Goal**: 將使用者管理與系統日誌以 2:3 比例水平並排顯示

**Independent Test**: 檢查 `.admin-main` 的子元素寬度比例是否為 2:3

### Tests for User Story 1 ⚠️

- [X] T006 [US1] 在 `tests/unit/ui-refinements.test.js` 撰寫驗證 2:3 寬度比例的測試案例

### Implementation for User Story 1

- [X] T007 [US1] 在 `public/pages/admin.html` 中將兩個 `section.glass` 區塊包裹入 `.admin-main` 容器
- [X] T008 [US1] 對 `.admin-main` 應用 `display: flex` 與 `gap: 20px`
- [X] T009 [US1] 對使用者管理區塊應用 `flex: 2`，對日誌區塊應用 `flex: 3`
- [X] T010 [US1] 調整內部表格寬度確保為 `100%` 以適應彈性容器

**Checkpoint**: 此時，2:3 並排視圖應已功能完備並可獨立測試

---

## Phase 4: User Story 2 - 全域滾動與彈性高度 (Priority: P2)

**Goal**: 移除高度限制，確保內容可隨資料量延伸並全頁捲動

**Independent Test**: 當日誌量增加時，頁面出現垂直捲軸且底部內容不被遮蓋

### Tests for User Story 2 ⚠️

- [X] T011 [US2] 在 `tests/unit/ui-refinements.test.js` 撰寫驗證全頁垂直捲動與容器高度彈性的測試案例

### Implementation for User Story 2

- [X] T012 [US2] 移除 `public/pages/admin.html` 中 `#logs-container` 的 `max-height: 400px` 限制
- [X] T013 [US2] 確保 `.admin-container` 的 `margin` 與 `padding` 在長頁面下仍能正確維持佈局美觀
- [X] T014 [US2] 驗證在資料量極少時，佈局不會塌陷 (Layout collapse)

**Checkpoint**: 使用者故事 1 與 2 現在都應該能獨立運作並整合

---

## Phase 5: User Story 3 - 頁首固定行為 (Priority: P3)

**Goal**: 實作 Scrolling but sticky 頁首

**Independent Test**: 捲動頁面時，頁首在到達頂部後固定

### Tests for User Story 3 ⚠️

- [X] T015 [US3] 在 `tests/unit/ui-refinements.test.js` 撰寫驗證頁首 (Header) sticky 屬性的測試案例

### Implementation for User Story 3

- [X] T016 [US3] 對 `public/pages/admin.html` 中的 `header` 應用 `position: sticky; top: 0; z-index: 1000;`
- [X] T017 [US3] 強化頁首的 `glass` 效果，設定 `backdrop-filter: blur(10px)` 與 `background: rgba(255, 255, 255, 0.8)` 確保標題可讀性
- [X] T018 [US3] 調整頁首與下方內容的間距 (margin/padding) 避免被遮蓋

---

## Phase 6: Logic & Coverage (Constitution Compliance)

**Purpose**: 確保內部邏輯具備充足測試覆蓋率 (符合憲法 80% 要求)

- [X] T019 [P] 為 `admin.html` 中的 `loadUsers` 邏輯撰寫單元測試 (Mock Fetch API)
- [X] T020 [P] 為 `admin.html` 中的 `loadLogs` 邏輯撰寫單元測試 (Mock Fetch API)
- [X] T021 [P] 驗證 `updateRole` 與 `unlockUser` 在 UI 上的錯誤處理邏輯

## Phase 7: Polish & Cross-Cutting Concerns

**Purpose**: 多個使用者故事的共同改進與最終驗證

- [X] T022 [P] 統一全頁的 Glassmorphism 樣式與背景 Blob 渲染一致性於 `public/pages/admin.html`
- [X] T023 優化在 1200px 臨界點時橫向捲軸出現的視覺平滑度
- [X] T024 執行 `quickstart.md` 中的手動驗證流程
- [X] T025 執行完整單元測試 `npm test tests/unit/ui-refinements.test.js`
- [X] T026 修正 `admin.html` 在低解析度下未出現捲軸的問題：覆蓋 `body.admin-page` 的 `overflow: hidden` 並移除置中對齊屬性

---

## Dependencies & Execution Order

### Phase Dependencies

- **Setup (Phase 1)**: 無相依性 - 可立即開始
- **Foundational (Phase 2)**: 相依於 Setup 完成 - 阻擋所有使用者故事
- **User Stories (Phase 3+)**: 均相依於 Foundational 階段完成
  - 使用者故事可按優先順序 (P1 → P2 → P3) 循序執行
- **Polish (Final Phase)**: 相依於所有選定使用者故事完成

### Parallel Opportunities

- T001 與 T002 可並行執行
- 一旦 Phase 2 完成，各個 User Story 的測試案例撰寫 (T006, T011, T015) 可預先並行準備
- T019 可在實作階段的任何時間點並行進行

---

## Implementation Strategy

### MVP First (User Story 1 Only)

1. 完成 Phase 1: Setup
2. 完成 Phase 2: Foundational (關鍵 - 阻擋所有故事)
3. 完成 Phase 3: User Story 1
4. **停止並驗證**: 獨立測試使用者故事 1

### Incremental Delivery

1. 完成 Setup + Foundational → 基礎就緒
2. 加入 User Story 1 → 獨立測試 → 交付/展示 (MVP!)
3. 加入 User Story 2 → 獨立測試 → 交付/展示
4. 加入 User Story 3 → 獨立測試 → 交付/展示
