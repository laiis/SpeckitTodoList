# Quickstart: 看板模式開發與使用指南

## 開發環境設置
1. 安裝 Vitest 用於執行 TDD 測試：
   ```bash
   npm install --save-dev vitest @vitest/coverage-v8
   ```
2. 執行現有測試確認環境正常：
   ```bash
   npm test
   ```

## 核心元件使用方式

### 1. TodoService (業務邏輯層)
用於管理任務狀態、過濾與持久化。
```javascript
import { TodoService } from './script.js';
const service = new TodoService();
const tasks = service.getTasksByStatus('Backlog');
```

### 2. 佈局架構 (CSS)
佈局容器使用 `.kanban-container`。
```css
.kanban-container {
    display: flex;
    overflow-x: auto;
    gap: 1rem;
}
.kanban-column {
    flex: 1 0 280px;
    /* ... */
}
```

## 執行測試與覆蓋率
確認功能實作後，執行覆蓋率檢查：
```bash
npm run test:coverage
```

## 驗收標準
- [ ] 進入「待完成」模式看到 4 個並排欄位。
- [ ] 螢幕寬度 < 768px 時顯示為單一欄位與頂部標籤。
- [ ] 點選欄位底部的「+」可直接在該狀態新增任務。
- [ ] 效能：切換模式時載入延遲 < 200ms。
