# Quickstart: 拖拉式任務管理 (Drag-and-Drop Task Management)

## 開發者快速入門

### 1. 資料庫變更
本功能需要對 `tasks` 資料表新增 `rank` 欄位：
```sql
ALTER TABLE tasks ADD COLUMN rank REAL DEFAULT 0;
```

### 2. 前端整合
安裝或引用 SortableJS，並在 `script.js` 中初始化各河道的拖拉功能：
```javascript
new Sortable(laneElement, {
    group: 'shared',
    animation: 150,
    ghostClass: 'drag-ghost',
    onEnd: function (evt) {
        // 呼叫 API 更新狀態與排序
    }
});
```

### 3. 本地開發環境啟動
1. 確保已安裝 Node.js 依賴：`npm install`
2. 啟動開發伺服器：`npm run dev`
3. 存取：`http://localhost:5173`

### 4. 驗證
- 拖曳任務到新河道。
- 重新整理頁面，驗證位置是否正確。
- 檢查網路面板中的 `PATCH /api/tasks/:id` 請求。
