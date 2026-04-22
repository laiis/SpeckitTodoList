# Quickstart: 使用者登入系統 (SQLite)

本文件引導開發者如何在本地環境啟動並測試身份驗證功能。

## 1. 環境設定

### 安裝依賴
```bash
npm install express better-sqlite3 bcryptjs jsonwebtoken
```

### 資料庫初始化
系統會在首次啟動時自動建立 `todo.db` 並初始化 `Users` 與 `Roles` 表。
預設管理員：`admin / admin`。

## 2. 開發流程

### 啟動伺服器
```bash
npm start
# 或者直接執行: node server/app.js
```

### 登入並取得 Token
使用 Postman 或 curl 呼叫 `POST /api/auth/login`。Token 會自動儲存於 HttpOnly Cookie 中。

## 3. 測試指南

### 執行所有測試
```bash
npm test
```

### 整合與安全性測試 (Vitest)
```bash
# 執行身份驗證完整流程測試
npx vitest run tests/integration/auth_flow.test.mjs

# 執行安全性與滲透測試
npx vitest run tests/integration/security.test.mjs

# 執行效能基準測試
npx vitest run tests/integration/performance.test.mjs
```

### 測試環境隔離
開發測試時，可透過 `DB_PATH` 環境變數指定獨立的資料庫檔案或使用記憶體資料庫：
```bash
# 使用記憶體資料庫執行測試 (不影響本地 todo.db)
DB_PATH=:memory: npx vitest run
```

## 4. 常見問題
- **如何重設 Admin 密碼？**：需直接透過 SQLite 終端操作資料庫，或刪除資料庫檔案重新初始化。
- **Token 過期怎麼辦？**：用戶端應捕捉 401 錯誤並導向登入頁面。
