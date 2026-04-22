# Work Log: 環境變數管理實作完成 (Implementation Completed)

**Date**: 2026-04-22
**Feature**: 環境變數管理 (006-env-var-management)
**Status**: Completed & Verified

## 實作摘要

本階段已成功將系統中的機敏資料（JWT 密鑰、管理員密碼、資料庫路徑）從硬編碼遷移至環境變數管理，並建立了統一的配置存取層。

### 1. 基礎設施調整 (Infrastructure)
- 安裝 `dotenv` 與 `cross-env` 套件。
- 更新 `.gitignore` 確保 `.env` 檔案不會被上傳至版本控制。
- 建立 `.env.example` 作為環境設定範本，落實 SC-002。

### 2. 統一配置層 (Config Layer)
- 新增 `server/config/index.js`：
    - 集中管理所有 `process.env` 讀取邏輯。
    - 實作「生產模式」強制驗證：若 `JWT_SECRET` 缺失則終止啟動 (SC-003)。
    - 實作「非生產模式」安全預設值與 `Logger` 警告。

### 3. 程式碼邏輯重構 (Refactoring)
- `server/app.js`：於最頂端載入 `dotenv`。
- `server/services/tokenService.js`：重構為引用 `AppConfig.jwt.secret`。
- `server/db/init.js`：重構為引用 `AppConfig.admin.password` 與 `AppConfig.database.path`。

### 4. 測試與驗證 (Testing & Validation)
- **單元測試**：
    - `tests/unit/config.test.js`：驗證各環境下的配置載入與錯誤處理 (T017)。
    - `tests/unit/tokenService.test.js`：驗證 Token 簽發對環境變數的引用 (T020)。
    - `tests/unit/dbInit.test.js`：驗證資料庫初始化對環境變數的引用 (T021)。
- **安全性驗證**：
    - 執行生產模式模擬，確認缺失 `JWT_SECRET` 時系統可在 1 秒內拋錯並終止。
    - 配置 `scan-secrets` 檢查，確認原始碼中無硬編碼機敏字串 (SC-001)。

## 交付成果
- 統一配置層：`server/config/index.js`
- 環境範本：`.env.example`
- 補全測試：`tests/unit/tokenService.test.js`, `tests/unit/dbInit.test.js`
- 更新任務清單：`specs/006-env-var-management/tasks.md`

## 後續建議
- 在正式部署生產環境前，建議手動執行一次 Git 歷史紀錄清理 (T015)。
- 定期執行 `npm run scan-secrets` 以防止未來開發中不慎帶入硬編碼密鑰。
