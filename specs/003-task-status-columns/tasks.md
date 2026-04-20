# Tasks: 看板模式 (Task Status Columns)

**Input**: Design documents from `specs/003-task-status-columns/`
**Prerequisites**: plan.md (required), spec.md (required for user stories), research.md, data-model.md, quickstart.md

**Tests**: 專案採用 TDD 開發模式 (憲法 IV)，因此包含測試任務。

**Organization**: 任務按使用者情境 (User Story) 分組，以支援獨立實作與測試。

## Format: `[ID] [P?] [Story] Description`

- **[P]**: 可並行執行 (不同檔案，無未完成的依賴項)
- **[Story]**: 該任務所屬的使用者故事 (例如 US1, US2)
- 描述中包含精確的檔案路徑

## Phase 1: Setup (Shared Infrastructure)

**Purpose**: 專案初始化與基礎結構設定

- [x] T001 安裝 Vitest 與覆蓋率相關依賴項 `npm install --save-dev vitest @vitest/coverage-v8`
- [x] T002 在 `package.json` 中配置測試與覆蓋率指令 `"test": "vitest", "test:coverage": "vitest run --coverage"`
- [x] T003 [P] 建立 `Logger` 工具函式於 `script.js` 以符合憲法 V (治理與記錄)

---

## Phase 2: Foundational (Blocking Prerequisites)

**Purpose**: 核心基礎設施，必須在實作任何使用者故事前完成

- [x] T004 [P] 定義任務狀態枚舉 (Enum) 與初始遷移邏輯於 `script.js` (確保現有資料相容)
- [x] T005 實作 `TodoService` 基礎類別於 `script.js`，包含任務存取與狀態變更邏輯
- [x] T006 [P] 更新 `style.css` 中的變數，確保支援玻璃擬態與深色模式的一致性
- [x] T007 建立看板容器 HTML 結構於 `index.html` (隱藏舊列表容器)

**Checkpoint**: 基礎設施就緒 - 現在可以並行開始使用者故事的開發

---

## Phase 3: User Story 1 - 看板式狀態檢視 (Priority: P1) 🎯 MVP

**Goal**: 在「待完成」視圖中以 4 欄並排方式顯示任務，支援獨立捲動與彈性佈局。

**Independent Test**: 切換至「待完成」視圖，驗證出現 4 個水平排列欄位，且每個欄位標題正確、內容可垂直捲動。

### Tests for User Story 1 (TDD) ⚠️

- [x] T008 [P] [US1] 撰寫 `TodoService.getTasksByStatus` 的單元測試於 `todo.test.js`
- [ ] T009 [P] [US1] 撰寫切換至「待完成」模式時欄位渲染邏輯的測試於 `todo.test.js`

### Implementation for User Story 1

- [x] T010 [US1] 實作 `TodoService` 的過濾邏輯，並整合 Logger 記錄狀態過濾行為於 `script.js` (FR-007)
- [x] T011 [P] [US1] 實作看板佈局 CSS 於 `style.css` (Flexbox, min-width 280px, overflow-x)
- [x] T012 [P] [US1] 實作欄位獨立垂直捲動與固定標題樣式於 `style.css`
- [x] T013 [US1] 實作 `KanbanPage` 渲染邏輯，生成 4 個狀態欄位於 `script.js`
- [x] T014 [US1] 實作標題旁即時顯示任務計數功能於 `script.js` (FR-004)
- [x] T014a [US1] 撰寫計數器同步測試於 `todo.test.js`：驗證新增、刪除或移動任務後，對應欄位標題旁的計數器能 100% 準確更新
- [x] T015 [US1] 實作快速新增區域 HTML/CSS 於 `index.html` 與 `style.css` (FR-008)
- [x] T016 [US1] 實作快速新增功能的事件監聽與 Service 呼叫於 `script.js`

**Checkpoint**: 使用者故事 1 應已完全運作並可獨立測試。

---

## Phase 4: User Story 2 - 全狀態看板檢視 (Priority: P2)

**Goal**: 在「全部」視圖中同時看到包含「已完成 (Done)」在內的所有 5 個狀態欄位。

**Independent Test**: 切換至「全部」視圖，驗證包含「已完成」在內的 5 欄均水平並排顯示。

### Tests for User Story 2 (TDD) ⚠️

- [ ] T017 [P] [US2] 撰寫「全部」視圖渲染 5 欄邏輯的測試於 `todo.test.js`
- [ ] T017a [P] [US2] 撰寫「已完成」模式單欄渲染邏輯的測試於 `todo.test.js` (FR-006)

### Implementation for User Story 2

- [ ] T018 [US2] 擴充 `KanbanPage` 渲染邏輯以支援 5 欄顯示於 `script.js`
- [ ] T019 [US2] 處理 5 欄佈局下的橫向捲動邊界樣式於 `style.css`
- [ ] T019a [US2] 實作「已完成 (Completed)」模式下的單欄 (Done) 渲染邏輯於 `script.js` (FR-006)

**Checkpoint**: 使用者故事 1 與 2 現在應能獨立運作。

---

## Phase 5: User Story 3 - 行動版適配 (Priority: P3)

**Goal**: 當螢幕寬度 < 768px 時，自動切換為單欄標籤模式 (Tabs)。

**Independent Test**: 縮小瀏覽器寬度至 700px，驗證看板變為單欄顯示，且頂部出現標籤切換按鈕。

### Tests for User Story 3 (TDD) ⚠️

- [ ] T020 [P] [US3] 撰寫行動版標籤切換邏輯的測試於 `todo.test.js`

### Implementation for User Story 3

- [ ] T021 [P] [US3] 實作行動版 Media Queries 樣式於 `style.css` (隱藏非活動欄位，顯示標籤)
- [ ] T022 [US3] 實作頂部標籤列的動態生成與點擊事件處理於 `script.js` (FR-005)

**Checkpoint**: 所有使用者故事現在均已獨立運作。

---

## Phase 6: Polish & Cross-Cutting Concerns

**Purpose**: 影響多個使用者故事的改進與優化

- [ ] T023 [P] 執行 `npm run test:coverage` 確保覆蓋率 > 80% (憲法 IV)
- [ ] T024 驗證切換模式時的延遲 < 200ms (憲法 III)
- [ ] T024a 驗證在 1920x1080 解析度下，使用者無需捲動即可看到至少 4 欄內容 (SC-002)
- [ ] T025 進行最後的視覺調整，確保玻璃擬態與深色模式完美呈現於所有新元件
- [ ] T026 [P] 更新 `quickstart.md` 中的驗收檢核表

---

## Dependencies & Execution Order

### Phase Dependencies

- **Setup (Phase 1)**: 無依賴 - 可立即開始
- **Foundational (Phase 2)**: 依賴 Setup 完成 - 阻斷所有使用者故事
- **User Stories (Phase 3+)**: 全部依賴 Foundational 完成
  - 建議按優先級順序 (P1 → P2 → P3) 執行
- **Polish (Final Phase)**: 依賴所有使用者故事完成

### User Story Dependencies

- **User Story 1 (P1)**: 基礎完成後即可開始
- **User Story 2 (P2)**: 可在 US1 完成後增量實作
- **User Story 3 (P3)**: 佈局穩定後進行行動端適配優化

### Parallel Opportunities

- Phase 1 & 2 中標記為 [P] 的任務
- 測試撰寫 (T008, T009) 可與樣式設計 (T011, T012) 並行
- 不同使用者故事的樣式定義 (CSS) 可提前並行處理

---

## Parallel Example: User Story 1

```bash
# 同時開發 US1 的測試與佈局樣式
Task: "撰寫 TodoService.getTasksByStatus 的單元測試於 todo.test.js"
Task: "實作看板佈局 CSS 於 style.css"
```

---

## Implementation Strategy

### MVP First (User Story 1 Only)

1. 完成 Phase 1 & 2。
2. 完成 Phase 3 (US1 - 4 欄看板)。
3. **驗證**: 獨立測試 US1。
4. **交付**: 達成基礎看板管理能力。

### Incremental Delivery

1. 完成基礎佈局與核心 Service。
2. 交付 US1 (待完成看板)。
3. 交付 US2 (全狀態看板)。
4. 交付 US3 (行動版優化)。
5. 每次交付均確保不破壞先前功能且具備完整測試。

---

## Notes

- 嚴格遵守 TDD，先寫測試再寫實作。
- 每個任務完成後進行 commit (遵循 project 規範)。
- 確保所有 DOM 操作均透過 Controller 類別管理，業務邏輯保留在 Service 中。
業務邏輯保留在 Service 中。
rvice 中。
