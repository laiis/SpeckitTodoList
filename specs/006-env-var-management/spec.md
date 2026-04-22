# Feature Specification: 環境變數管理 (Environment Variable Management)

**Feature Branch**: `006-env-var-management`  
**Created**: 2026-04-22  
**Status**: Draft  
**Input**: User description: "根據以下需求,改為「環境變數」管理機敏資料，專案中需要進行以下五個層面的調整： 1. 基礎設施調整 (Infrastructure) * 安裝套件：需安裝 dotenv 套件。 * npm install dotenv * Git 忽略規則：必須在 .gitignore 中加入 .env 確保不會被上傳。 * 範例檔：提供 .env.example（僅包含 Key，不包含具體 Value），讓其他開發者知道需要設定哪些變數。 2. 應用程式進入點 (Entry Point) * 載入變數：在 server/app.js 的最頂端加入 require('dotenv').config()。 * 注意：這必須在載入 any 使用到環境變數的 Service（如 db 或 tokenService）之前執行。 3. 建立統一設定層 (Config Layer) * 建議新增 server/config/index.js： 將所有從 process.env 讀取的邏輯集中。這樣做的優點是： * 可以集中管理預設值。 * 可以在啟動時檢查必要的變數是否缺失（例如：若 NODE_ENV=production 且 JWT_SECRET 缺失則拋出錯誤）。 4. 程式碼邏輯替換 (Code Refactoring) * server/services/tokenService.js： * 將 const JWT_SECRET = ... 替換為引用 Config 檔案。 * server/db/init.js： * 將 bcrypt.hashSync('admin', salt) 中的 'admin' 替換為來自環境變數的密碼。 * const dbPath = ... 也應統一由 Config 管理。 5. 測試環境調整 (Testing) * 測試專用變數：在執行 npm test 時，通常會搭配 cross-env NODE_ENV=test，並可能需要一個 .env.test 檔案或在測試啟動腳本中定義變數，確保測試結果的一致性。"

## Clarifications

### Session 2026-04-22
- Q: 是否清理 Git 歷史紀錄中的機敏資料？ → A: 是，使用專門工具 (BFG/git-filter-repo) 徹底清理。
- Q: 環境變數載入的優先順序為何？ → A: 系統環境變數優先於配置文件。
- Q: 環境變數缺失時的處理策略？ → A: 生產環境強制要求，其餘環境使用預設值並顯示警告。
- Q: 是否支援多個環境配置文件？ → A: 否，僅支援單一 .env 檔案以保持簡潔。
- Q: 是否支援機敏資料的動態重新載入？ → A: 否，變更環境變數後需重新啟動伺服器以確保穩定性。
- Q: 日誌中是否可以輸出環境變數的數值？ → A: 嚴禁輸出任何機敏變數的數值，僅限於記錄變數名稱與狀態。
- Q: 環境變數的命名規範為何？ → A: 統一使用大寫蛇形命名法 (SCREAMING_SNAKE_CASE)。
- Q: 如何處理環境變數中的特殊字元？ → A: 建議使用雙引號包裹數值，確保解析正確。
- Q: 生產環境中的環境變數注入方式？ → A: 優先使用系統層級注入（如容器設定），不建議在生產環境存放 .env 檔案.
- Q: 是否對環境變數進行格式驗證？ → A: 是，在統一配置層實作基本格式驗證（如正則表達式或類型檢查），確保設定值合法。

## User Scenarios & Testing *(mandatory)*

### User Story 1 - 環境設定與安全性 (Priority: P1)

身為開發者，我希望將所有機敏資料（如 JWT 密鑰、管理員密碼）移出程式碼並存放在環境變數中，以防止洩漏並符合安全規範。

**Why this priority**: 這是解決硬編碼金鑰風險的核心需求，直接關乎系統安全性。

**Independent Test**: 可以透過檢查原始碼中是否仍存在硬編碼金鑰字串，以及系統是否能正確從 `.env` 讀取設定來驗證。

**Acceptance Scenarios**:

1. **Given** 系統環境中定義了加密密鑰, **When** 啟動伺服器並產生安全權杖, **Then** 權杖應使用該環境定義的密鑰進行簽署。
2. **Given** 試圖將包含具體機敏資料的設定檔存入版本控制, **When** 執行提交檢查, **Then** 該檔案應被自動排除或攔截。

---

### User Story 2 - 統一配置管理 (Priority: P2)

身為維運人員，我希望系統有一個統一的配置管理層，能夠在啟動時驗證必要的設定，並提供合理的預設值。

**Why this priority**: 確保系統在配置錯誤時能即時警示，避免運行在不安全或不完整的狀態下。

**Independent Test**: 刪除必要的配置項目後嘗試啟動伺服器，觀察系統是否拋出預期的錯誤或使用正確的預設值。

**Acceptance Scenarios**:

1. **Given** 系統處於生產模式且未設定加密密鑰, **When** 啟動伺服器, **Then** 系統應拋出錯誤並停止啟動。
2. **Given** 未設定資料庫路徑, **When** 系統啟動, **Then** 系統應使用預設的儲存路徑。

---

### User Story 3 - 測試環境隔離 (Priority: P3)

身為開發者，我希望測試環境能有獨立的配置設定，避免測試過程影響到開發用的資料。

**Why this priority**: 確保測試的獨立性與重現性，防止開發環境與測試環境資料混淆。

**Independent Test**: 執行自動化測試，確認系統使用的是測試專用的資料儲存位置。

**Acceptance Scenarios**:

1. **Given** 執行測試指令, **When** 系統啟動, **Then** 系統應載入測試專用的環境配置。

### Edge Cases

- **變數缺失**: 當 `NODE_ENV` 非 `production` 但變數缺失時，系統應提供足夠清晰的警告與安全的預設值。
- **類型不符**: 當環境變數的值不符合預期類型（例如：應為數字卻給字串）時，系統應能處理或提供錯誤提示。

## Requirements *(mandatory)*

### Functional Requirements

- **FR-001**: 系統必須能自動載入外部定義的環境變數，且系統層級的變數優先權應高於本地設定檔。
- **FR-002**: 系統必須具備統一的配置存取層，負責管理所有外部設定。
- **FR-003**: 專案必須提供環境設定範例文件，詳列所有必要的變數名稱。
- **FR-004**: 版本控制系統必須排除存放具體機敏資料的設定檔。
- **FR-005**: 系統在生產模式下必須驗證關鍵設定是否存在，若缺失則應中斷啟動以確保安全性。
- **FR-006**: 系統必須支援在不同作業系統環境下一致地設定測試用的環境變數。
- **FR-007**: 系統必須使用工具徹底清理 Git 歷史紀錄中的機敏資訊，確保過去的硬編碼資料不會存留在版本控制中。

### Key Entities *(include if feature involves data)*

- **AppConfig**: 封裝所有系統設定的物件，包含 `jwt`, `database`, `admin` 等子區塊。

## Success Criteria *(mandatory)*

### Measurable Outcomes

- **SC-001**: 原始碼中硬編碼的密碼與金鑰數量為 0。
- **SC-002**: 新進開發者透過 `cp .env.example .env` 並填寫後，可在 1 分鐘內完成環境配置。
- **SC-003**: 若 `JWT_SECRET` 未設定且處於 `production` 模式，伺服器啟動失敗時間應小於 1 秒。

## Assumptions

- 專案使用 `npm` 作為套件管理器。
- 伺服器端環境為 Node.js / Express。
- 現有的 `JWT_SECRET` 與 `admin` 密碼將作為非生產環境的預設值（暫時性）。
�環境的預設值（暫時性）。
