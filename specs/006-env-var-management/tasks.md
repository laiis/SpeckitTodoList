---
description: "環境變數管理功能實作任務清單"
---

# Tasks: 環境變數管理 (Environment Variable Management)

**Input**: Design documents from `specs/006-env-var-management/`
**Prerequisites**: plan.md, spec.md, research.md, data-model.md, quickstart.md

**Organization**: 任務按使用者故事分組，支援獨立實作與測試。

## Format: `[ID] [P?] [Story] Description`

- **[P]**: 可並行執行（不同檔案，無未完成依賴）
- **[Story]**: 屬應的使用者故事（如 US1, US2, US3）
- 描述中包含精確的檔案路徑

---

## Phase 1: Setup (Shared Infrastructure)

**Purpose**: 專案初始化與基礎結構設定

- [x] T001 安裝必要套件 `dotenv` 與 `cross-env` 於 `package.json`
- [x] T002 更新 `.gitignore` 以排除 `.env` 檔案
- [x] T003 [P] 建立環境變數範例檔 `.env.example` 於專案根目錄

---

## Phase 2: Foundational (Blocking Prerequisites)

**Purpose**: 核心基礎設施，必須在所有使用者故事開始前完成

- [x] T004 建立統一配置層 `server/config/index.js`，實作 `AppConfig` 骨架與基礎載入邏輯

**Checkpoint**: 基礎建設已就緒 - 使用者故事實作可開始

---

## Phase 3: User Story 1 - 環境設定與安全性 (Priority: P1) 🎯 MVP

**Goal**: 將機敏資料移出程式碼並存放於環境變數，防止洩漏

**Independent Test**: 檢查原始碼中是否已無硬編碼金鑰，並確認系統能正確從 `.env` 讀取設定

### Implementation for User Story 1

- [x] T005 [US1] 在 `server/app.js` 最頂端加入 `require('dotenv').config()` 以載入變數
- [x] T006 [US1] 重構 `server/services/tokenService.js` 改為引用 `AppConfig.jwt.secret`
- [x] T007 [US1] 重構 `server/db/init.js` 以使用 `AppConfig.admin.password` 與 `AppConfig.database.path`
- [x] T008 [US1] 更新 `server/db/init.js` 確保作為獨立腳本執行時也能呼叫 `dotenv.config()` 正確載入環境變數

**Checkpoint**: 使用者故事 1 應能獨立運作，所有硬編碼機敏資料已移除

---

## Phase 4: User Story 2 - 統一配置管理 (Priority: P2)

**Goal**: 建立統一配置管理層，實作啟動驗證與預設值

**Independent Test**: 在生產模式下未設定 `JWT_SECRET` 時啟動伺服器，應拋出錯誤

### Implementation for User Story 2

- [x] T009 [US2] 在 `server/config/index.js` 實作驗證邏輯（生產模式缺失 `JWT_SECRET` 則拋錯）
- [x] T010 [US2] 在 `server/config/index.js` 實作非生產環境的安全預設值，並使用 `Logger` 記錄
- [x] T011 [US2] 在 `server/config/index.js` 實作安全性警告（若生產模式下 `ADMIN_PASSWORD` 為預設值），必須透過 `Logger` 輸出警告

**Checkpoint**: 系統配置驗證機制已完成

---

## Phase 5: User Story 3 - 測試環境隔離 (Priority: P3)

**Goal**: 確保測試環境具備獨立的配置設定

**Independent Test**: 執行 `npm test` 並確認系統載入測試專用的環境配置

### Implementation for User Story 3

- [x] T012 [US3] 更新 `package.json` 中的 `test` 腳本，使用 `cross-env NODE_ENV=test`
- [x] T013 [US3] 確保測試框架（如 Vitest）能正確讀取測試環境變數
- [x] T017 [C1] 為 `server/config/index.js` 撰寫單元測試，驗證不同環境下的預設值與拋錯邏輯

**Checkpoint**: 測試環境已與開發/生產環境隔離

---

## Phase 6: Polish & History Cleaning

**Purpose**: 跨使用者故事的改進與安全性掃描

- [x] T014 [P] 執行 `quickstart.md` 中的驗證步驟，確保手冊準確無誤
- [x] T015 [US1] 確保在具備工具的環境（或部署前）執行 `git-filter-repo` 清理歷史紀錄中的機敏資訊，並於 `work_logs` 記錄清理結果。
- [x] T016 [P] 更新 `README.md` 以包含環境變數設定的簡要說明
- [x] T018 [A1] 驗證 SC-003：在生產模式下故意缺失 `JWT_SECRET`，確認伺服器在 1 秒內中斷啟動
- [x] T019 [U1] 配置基本機敏資料掃描檢查（使用 grep 腳本）以落實 US1-AS2 的攔截機制
- [x] T020 [C2] 為 `server/services/tokenService.js` 撰寫單元測試，驗證其是否正確引用 `AppConfig.jwt.secret`
- [x] T021 [C2] 為 `server/db/init.js` 撰寫單元測試，驗證其環境變數讀取邏輯與資料庫路徑設定

---

## Dependencies & Execution Order

### Phase Dependencies

- **Setup (Phase 1)**: 無依賴，可立即開始
- **Foundational (Phase 2)**: 依賴 Setup 完成 - 阻斷所有使用者故事
- **User Stories (Phase 3+)**: 皆依賴 Foundational 完成
  - US1 (P1) 為最高優先順序，建議首先完成
  - US2 與 US3 在基礎建設完成後可並行開發
- **Polish (Final Phase)**: 依賴所有使用者故事開發完成

### User Story Dependencies

- **US1**: 基礎重構，不依賴其他故事
- **US2**: 依賴 US1 的重構路徑，但在 `AppConfig` 結構上可獨立開發
- **US3**: 配置層級調整，與 US1/US2 獨立

---

## Parallel Example: User Story 1 & 2

```bash
# 同時重構不同服務 (US1):
Task: "重構 server/services/tokenService.js (T006)"
Task: "重構 server/db/init.js (T007)"

# 在不同檔案中實作 (US1 vs US2):
Task: "在 server/app.js 載入 dotenv (T005)"
Task: "在 server/config/index.js 實作驗證 (T009)"
```

---

## Implementation Strategy

### MVP First (User Story 1 Only)

1. 完成 Phase 1: Setup
2. 完成 Phase 2: Foundational (關鍵阻斷點)
3. 完成 Phase 3: User Story 1
4. **驗證**: 確保無硬編碼且功能正常 (完成 MVP)

### Incremental Delivery

1. Foundation ready -> US1 (Security) -> US2 (Validation) -> US3 (Test Isolation)
2. 每個故事完成後皆可獨立測試並交付價值

---

## Notes

- [P] 任務代表不同檔案，無依賴衝突
- [Story] 標籤用於追蹤任務與需求的對應關係
- **安全性提醒**: 在執行 T015 (歷史清理) 前，務必確保本地已有完整備份
