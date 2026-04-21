# Tasks: 使用者登入系統 (SQLite)

**Feature**: `005-sqlite-user-auth` | **Spec**: [specs/005-sqlite-user-auth/spec.md](specs/005-sqlite-user-auth/spec.md) | **Plan**: [specs/005-sqlite-user-auth/plan.md](specs/005-sqlite-user-auth/plan.md)

## Implementation Strategy

本特徵將採用 TDD (Test-Driven Development) 模式開發。首先建立資料庫 Schema 與 Service 層，確保業務邏輯（尤其是安全性部分）通過單元測試，再實作 API 端點與前端介面。

**MVP Scope**: 完成 Phase 1 至 Phase 3，實現基本的 admin 登入、JWT 會話與 Tasks 基礎保護。

## Phase 1: Setup (環境與資料庫基礎建設)

- [x] T001 安裝後端必要依賴 `bcryptjs`, `jsonwebtoken`, `better-sqlite3`
- [x] T002 建立 SQLite 初始化腳本 `server/db/init.js`，包含 Roles 與 Users 表
- [x] T003 實作自動建立預設 admin/admin 帳號邏輯 (FR-010)
- [x] T004 建立 `server/utils/logger.js` 以符合憲章日誌規範

## Phase 2: Foundational (核心邏輯與安全性基礎)

- [x] T005 [P] 實作密碼加密與比對工具函數於 `server/utils/auth.js` (bcrypt)
- [x] T006 實作 JWT 簽發與驗證服務於 `server/services/tokenService.js` (24h 有效期)
- [x] T007 [P] 建立身份驗證中間件 `server/middleware/auth.js` (驗證 JWT & HttpOnly Cookie)
- [x] T008 建立角色權限檢查中間件 `server/middleware/rbac.js`
- [x] T009 [P] 為中間件撰寫單元測試以確保安全攔截邏輯正確 (C2)

## Phase 3: [US1] 安全的身份驗證 (Priority: P1)

- [ ] T010 [US1] 撰寫 AuthService 登入邏輯單元測試 `tests/unit/authService.test.js`
- [ ] T011 [US1] 實作 `server/services/authService.js` 的登入邏輯，包含失敗計數與日誌記錄 (FR-013)
- [ ] T012 [US1] 實作暴力破解防護邏輯：5 次失敗鎖定 15 分鐘 (FR-013)
- [ ] T013 [US1] 實作登入 API 端點 `POST /api/auth/login`，**成功/失敗均須記錄日誌 (logger.security)**
- [ ] T014 [US1] 實作 `GET /api/auth/me` 端點以取得當前使用者資訊
- [ ] T015 [US1] 實作登出 API 端點 `POST /api/auth/logout`，**記錄登出事件 (logger.info)**
- [ ] T016 [US1] 建立前端登入頁面 `public/pages/login.html` (需繼承憲法規範之共用 Layout 組件)
- [ ] T017 [US1] 整合前端 API 客戶端服務於 `public/services/auth.js` (配合 Cookie 認證模式)

## Phase 4: [US3] 使用者註冊 (Priority: P3)

- [ ] T018 [US3] 撰寫註冊邏輯單元測試於 `tests/unit/authService.test.js`
- [ ] T019 [US3] 實作 `server/services/authService.js` 的註冊邏輯 (預設角色為 viewer)
- [ ] T020 [US3] 實作註冊 API 端點 `POST /api/auth/register`，**記錄新帳號建立事件 (logger.security)**
- [ ] T021 [US3] 建立前端註冊頁面 `public/pages/register.html` (需繼承憲法規範之共用 Layout 組件)

## Phase 5: [US2] 角色存取控制 & 資料隔離 (Priority: P2)

- [ ] T022 [US2] 更新 SQLite 遷移腳本，為 `Tasks` 表新增 `user_id` 欄位並建立索引
- [ ] T023 [US2] 撰寫 TaskService 資料隔離單元測試 `tests/unit/taskService.test.js`
- [ ] T024 [US2] 修改 `server/services/taskService.js`，確保所有 CRUD 操作皆包含 `user_id` 過濾 (FR-012)
- [ ] T025 [US2] 應用 RBAC 中間件於 Task 路由，限制 Viewer 僅能讀取，Editor 與 Admin 具備完整 CRUD 權限 (FR-006)
- [ ] T026 [US2] 實作前端 Tasks 頁面的資料隔離展示邏輯

## Phase 6: Admin Dashboard (管理員專屬功能)

- [ ] T027 [P] 實作 Admin 專用路由 `server/routes/admin.js` 與角色檢查 (FR-011)
- [ ] T027b 撰寫 AdminService 管理功能單元測試 `tests/unit/adminService.test.js`
- [ ] T028 實作管理員獲取所有使用者 API `GET /api/admin/users` (包含鎖定狀態)
- [ ] T029 實作管理員重設密碼 API `POST /api/admin/reset-password`，**記錄重設操作 (logger.security)**
- [ ] T030 實作獲取系統安全日誌 API `GET /api/admin/logs` (SC-002)
- [ ] T031 建立管理員儀表板頁面 `public/pages/admin.html` (包含使用者清單、日誌檢視、角色變更與密碼重設介面)

## Phase 7: Polish & Cross-Cutting (優化與最終稽核)

- [ ] T032 [P] 全面檢查所有 API 輸入的 XSS 防護與欄位驗證
- [ ] T033 實作全域 401/403 錯誤處理，前端自動導向登入頁
- [ ] T034 [P] 執行效能基準測試：驗證 API Latency < 200ms 與整體登入流程 < 1s (SC-001)
- [ ] T035 執行全路徑整合測試 `tests/integration/auth_flow.test.js`
- [ ] T035b 執行安全性滲透測試：驗證無法透過直接操作 URL 或 API 繞過權限檢查 (SC-004)
- [ ] T036 更新文件，確保 `quickstart.md` 指令與實際代碼一致

## Dependencies & Parallel Execution

- **Blocking**: T001-T004 (Setup) 必須先完成。
- **Story 1 (Login)**: 依賴 Phase 2。
- **Story 2 (RBAC)**: 依賴 Story 1 完成以進行身份測試。
- **Parallel Opportunities**:
  - T005, T007 可與 T006 同步開發。
  - T009 (中間件測試) 可在中間件框架建立後並行。
  - T034 (效能測試) 可在 Phase 3 完成後分批執行。
