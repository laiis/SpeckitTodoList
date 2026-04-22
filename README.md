# SpeckitTodoList

一個基於 Node.js、Express 與 SQLite 構建的現代化待辦清單系統，支援多使用者隔離、JWT 安全身份驗證與角色權限控管 (RBAC)。

## 🚀 快速啟動

### 1. 安裝依賴
```bash
npm install
```

### 2. 啟動後端伺服器 (預設連接埠 3000)
```bash
node server/app.js
```

### 3. 啟動前端開發環境 (Vite)
```bash
npm run dev
```
存取路徑：`http://localhost:5173`

## 🌐 環境配置

系統支援透過 `.env` 檔案進行環境配置。請參考 `.env.example` 建立您的本地設定檔：

- `PORT`: 伺服器執行的連接埠 (預設: `3000`)
- `JWT_SECRET`: JWT 簽章用的密鑰 (生產環境務必修改)
- `ADMIN_PASSWORD`: 預設管理員帳號密碼 (預設: `admin`)
- `DB_PATH`: SQLite 資料庫檔案路徑 (預設: `database.sqlite`)
- `NODE_ENV`: 執行環境模式 (`development`, `production`, 或 `test`)

### 快速設定
```bash
cp .env.example .env
# 編輯 .env 填入您的設定值
```

---

## 🔑 使用者指南

### 身份驗證
- **註冊**：新使用者可建立帳號，預設角色為 `Viewer`。
- **登入**：使用憑據登入以存取個人待辦清單。
- **會話管理**：採用 JWT 並存於 Secure HttpOnly Cookie 中，有效期 24 小時。
- **暴力破解防護**：連續登入失敗 5 次將鎖定帳號 15 分鐘。

### 待辦清單管理
- **資料隔離**：使用者僅能存取與操作屬於自己的任務。
- **看板模式**：支援「需求池」、「待辦」、「進行中」、「測試中」、「已完成」五個階段的任務管理。
- **即時編輯**：支援直接在清單中修改內容與狀態。

---

## 🛠️ 管理員介面 (Admin Dashboard)

系統為管理員提供專屬的控制台，用於監控系統狀態與管理使用者權限。

### 存取方式
1. 使用管理員帳號登入 (預設帳號：`admin` / 密碼：`admin`)。
2. 導覽至：`http://localhost:5173/pages/admin.html`

### 主要功能 (FR-011)
- **使用者清單**：即時查看所有已註冊使用者的帳號、角色、建立時間及鎖定狀態。
- **權限變更 (RBAC)**：支援將使用者角色調整為 `Admin`、`Editor` 或 `Viewer`。
- **手動解鎖**：若使用者因多次嘗試失敗而被鎖定，管理員可手動解除鎖定。
- **密碼重設**：管理員可協助使用者重設登入密碼。
- **安全日誌 (Audit Logs)**：查看系統安全相關事件 (如登入失敗、註冊、鎖定等)。
  - *註：日誌採自動清理政策，僅保留最近 10,000 筆紀錄。*

---

## 📂 目錄結構

- `server/`: 後端核心代碼 (Routes, Services, Middleware, DB)
- `services/`: 前端 API 封裝服務
- `public/`: 靜態資源 (HTML, CSS)
- `specs/`: 功能規格書、開發計畫與任務清單 (SDD 流程文件)
- `tests/`: 測試案例 (Unit, Integration)
- `logs/`: 系統執行與安全日誌

## 🛡️ 技術規範 (Constitution Highlights)
- **效能**：所有 API 平均回應延遲必須小於 200ms。
- **安全**：密碼 100% 以 bcrypt 加密儲存，所有輸入均進行 XSS 脫逸處理。
- **架構**：嚴格遵循 Service 層封裝邏輯，確保程式碼可測試性與維護性。

## 🧪 測試
執行整合、安全性與效能測試：
```bash
# 執行所有測試
npm test

# 執行並查看覆蓋率 (憲法要求需 > 80%)
npm run test:coverage
```
