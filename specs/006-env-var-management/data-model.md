# Data Model: 環境配置 (Environment Configuration)

## AppConfig (Singleton)

系統啟動時由 `server/config/index.js` 產生的單例物件，負責封裝所有環境變數。

### 屬性 (Properties)

| 屬性 | 類型 | 環境變數對應 | 說明 | 驗證規則 |
|------|------|--------------|------|----------|
| `env` | String | `NODE_ENV` | 執行環境 (development/production/test) | 預設 `development` |
| `port` | Number | `PORT` | 伺服器埠號 | 預設 `3000` |
| `jwt.secret` | String | `JWT_SECRET` | JWT 簽署金鑰 | 生產環境必填 |
| `jwt.expiresIn` | String | `JWT_EXPIRES_IN` | 權杖有效期 | 預設 `24h` |
| `database.path` | String | `DB_PATH` | SQLite 檔案路徑 | 預設 `database.sqlite` |
| `admin.password` | String | `ADMIN_PASSWORD` | 預設管理員密碼 | 必填 |

### 狀態與驗證 (Validation & State)

- **生產模式 (Production Mode)**: 
  - 若 `JWT_SECRET` 缺失，系統必須拋出錯誤並終止啟動。
  - 若 `ADMIN_PASSWORD` 仍為預設值（例如 `admin`），應發出安全性警告。
- **預設值 (Default Values)**: 
  - 非生產模式下，缺失變數應使用安全預設值。
