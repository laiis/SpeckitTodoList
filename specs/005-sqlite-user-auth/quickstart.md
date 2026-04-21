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
node server/index.js
```

### 登入並取得 Token
使用 Postman 或 curl 呼叫 `POST /api/auth/login`。

## 3. 測試指南

### 單元測試 (Service 層)
```bash
npm test tests/unit/authService.test.js
```

### 安全性測試範例
1. **暴力破解測試**：連續輸入 5 次錯誤密碼，確認第 6 次回傳 403 且記錄鎖定時間。
2. **資料隔離測試**：使用 User A 建立任務，確認 User B 登入後無法看到該任務。
3. **權限測試**：使用 Viewer 角色登入，嘗試呼叫 `POST /api/tasks` 應回傳 403。

## 4. 常見問題
- **如何重設 Admin 密碼？**：需直接透過 SQLite 終端操作資料庫，或刪除資料庫檔案重新初始化。
- **Token 過期怎麼辦？**：用戶端應捕捉 401 錯誤並導向登入頁面。
