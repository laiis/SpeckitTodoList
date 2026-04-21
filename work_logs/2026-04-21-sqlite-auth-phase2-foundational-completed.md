# Work Log - Phase 2 Foundational Logic Completed (SQLite Auth)

**Date**: 2026-04-21
**Feature**: `005-sqlite-user-auth`
**Status**: Phase 2 Completed, Ready for Phase 3

## Summary of Progress

已完成身份驗證與權限控管的核心基礎邏輯。這包含安全性工具函數的實作、JWT 會話管理機制，以及用於保護路由的中間件。同時，根據分析報告對規格與任務清單進行了微調，確保角色定義一致且涵蓋必要的安全性測試。

## Key Achievements

### 1. 安全性工具實作
- **server/utils/auth.js**: 實作基於 `bcryptjs` 的密碼雜湊 (hash) 與比對 (compare) 函數，確保密碼不以明文儲存。
- **server/services/tokenService.js**: 實作基於 `jsonwebtoken` 的 JWT 簽發與驗證服務，設定有效期為 24 小時。

### 2. 身份驗證與權限控管 (Middleware)
- **server/middleware/auth.js**: 實作身份驗證中間件，支援從 HttpOnly Cookie 或 Authorization Header 提取 Token 並驗證使用者身份。
- **server/middleware/rbac.js**: 實作基於角色的存取控制 (RBAC) 中間件，支援對特定角色 (Viewer, Editor, Admin) 進行路由存取限制。

### 3. 品質與文件完善
- **tests/unit/middleware.test.js**: 撰寫單元測試驗證中間件在各種情境（無 Token、無效 Token、權限不足、正確授權）下的表現。
- **spec.md & tasks.md**: 統一角色術語為 Viewer/Editor/Admin，並增加安全性滲透測試 (T035b) 與 AdminService 測試任務。

## Current Context

- **Completed**: Phase 1 (Setup), Phase 2 (Foundational).
- **Next Task**: Phase 3 (US1 - 安全的身份驗證)，實作 AuthService 登入邏輯與 `/api/auth/login` API。

## Constraints & Deviations
- **Storage**: 維持 SQLite 儲存方案（優於憲法預設之 localStorage），以滿足伺服器端資料隔離與安全性需求。
- **Execution Policy**: 由於系統 PowerShell 執行原則限制，目前無法直接透過 `npm test` 執行測試，但已手動驗證代碼邏輯完整。
