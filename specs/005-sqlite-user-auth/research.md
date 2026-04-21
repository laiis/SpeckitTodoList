# Research: 使用者登入系統 (SQLite)

## Decision 1: 暴力破解防護 (Brute-force Protection)

- **Decision**: 使用自定義中間件 (Middleware) 配合 SQLite 儲存失敗次數與鎖定時間。
- **Rationale**: 由於專案已使用 `better-sqlite3`，將登入失敗記錄存放於資料庫中可確保重新啟動伺服器後鎖定狀態依然有效，且不需額外引入如 Redis 的依賴。
- **Alternatives considered**: 
  - `express-rate-limit`: 主要針對 IP 限制，較難針對特定「帳號」進行精確鎖定。
  - In-memory Map: 簡單但伺服器重啟會失效，不符合持久化安全需求。

## Decision 2: 身份驗證與會話管理 (JWT)

- **Decision**: 使用 `jsonwebtoken` 簽發 24 小時有效的 Token，並存放在瀏覽器的 `localStorage` 或 HttpOnly Cookie（優先考慮安全性選 Cookie）。
- **Rationale**: JWT 符合無狀態 (Stateless) 要求，適合多使用者環境。24 小時過期符合 FR-009 規範。
- **Alternatives considered**: 
  - Server-side Sessions: 需要在後端維護 Session Store，對於簡單的應用程式來說 JWT 更具擴展性。

## Decision 3: 資料庫架構與隔離 (RBAC & Isolation)

- **Decision**: 
  - `Users` 表新增 `role_id` 關聯 `Roles` 表。
  - `Tasks` 表新增 `user_id` 欄位並建立索引。
  - 所有 Tasks 查詢必須強制帶入 `WHERE user_id = ?`。
- **Rationale**: 這是實作 FR-012 (資料隔離) 的標準作法，確保每個使用者僅能存取其擁有的資料。
- **Alternatives considered**: 
  - 不同使用者使用不同資料庫檔案：維護成本過高，不建議。

## Decision 4: 初始管理員帳號建立 (Initial Admin Setup)

- **Decision**: 在資料庫初始化腳本 (Migration/Seed) 中檢查 `Users` 表，若為空或不存在 `admin` 則自動插入 `admin/admin` (bcrypt 雜湊後)。
- **Rationale**: 符合 FR-010 規範，確保系統部署後即可登入管理。
- **Alternatives considered**: 
  - 環境變數配置：較安全但初次使用者體驗較不直觀。

## Decision 5: 管理員儀表板 (Admin Dashboard)

- **Decision**: 建立一個獨立的 SPA 路由 `/admin`，並在後端 API 實作 `isAdmin` 中間件進行二次驗證。
- **Rationale**: 物理區隔一般功能與管理功能，符合 FR-011。
- **Alternatives considered**: 
  - 在待辦清單中切換視圖：邏輯耦合度較高，安全性較低。
