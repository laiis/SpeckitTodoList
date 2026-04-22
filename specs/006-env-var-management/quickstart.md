# Quickstart: 環境變數設定

## 1. 初始設定 (Setup)

安裝必要套件：
```bash
npm install
```

建立本地環境設定檔：
```bash
cp .env.example .env
```

## 2. 配置 .env

編輯 `.env` 檔案，填入必要的機敏資料：
```env
# .env
NODE_ENV="development"
JWT_SECRET="your_super_secret_key"
ADMIN_PASSWORD="your_secure_admin_password"
DB_PATH="todo.sqlite"
```

## 3. 啟動服務

開發環境啟動：
```bash
npm run dev
```

生產環境啟動（確保系統變數已注入）：
```bash
NODE_ENV=production JWT_SECRET=... ADMIN_PASSWORD=... npm start
```

## 4. 執行測試

系統會自動使用測試環境配置：
```bash
npm test
```
