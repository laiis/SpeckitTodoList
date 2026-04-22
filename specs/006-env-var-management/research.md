# Research: 環境變數管理 (Environment Variable Management)

## 1. Git 歷史紀錄清理工具 (Git History Cleaning)

### Decision: 優先使用 `git-filter-repo`

- **Rationale**: 這是目前 Git 官方推薦用於取代 `git filter-branch` 的工具。它比 BFG 更強大且更符合現代 Git 的操作慣例。如果環境中安裝 Python 困難，則退而求其次使用 BFG Repo-Cleaner。
- **Alternatives considered**: 
  - `BFG Repo-Cleaner`: 雖然簡單易用（Java 撰寫），但 `git-filter-repo` 在處理複雜替換時表現更佳。
  - `git filter-branch`: 已被廢棄，效能低下且容易出錯。

## 2. 統一配置層驗證邏輯 (Configuration Validation)

### Decision: 實作手動輕量化驗證函式

- **Rationale**: 專案規模較小，引入 `Joi` 或 `Zod` 等大型驗證庫會增加不必要的依賴體積。在 `server/config/index.js` 中使用簡單的 `if` 判斷與正則表達式即可滿足 FR-005 的需求。
- **Alternatives considered**:
  - `envalid`: 專門用於環境變數驗證，但仍需額外依賴。

## 3. 測試環境變數管理 (Test Environment Variables)

### Decision: 使用 `cross-env` 搭配 npm scripts

- **Rationale**: `cross-env` 能解決 Windows 與 Unix-like 系統在設定環境變數時的語法差異，確保 `npm test` 在不同環境下行為一致。
- **Alternatives considered**:
  - `dotenv-flow`: 支援 `.env.test` 等多檔案，但規格釐清中已決議僅支援單一 `.env` 檔案，故不採用。

## 4. 載入順序與全域可用性 (Loading Order)

### Decision: 在 `server/app.js` 最頂端載入 `dotenv`

- **Rationale**: 必須在所有 Service 載入前初始化環境變數。對於不需要啟動整個 App 的腳本（如 `db/init.js`），則需要在該檔案內部或啟動命令中個別載入 `dotenv`。
