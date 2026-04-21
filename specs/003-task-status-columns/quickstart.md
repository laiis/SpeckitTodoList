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

## 驗收檢核表 (Acceptance Checklist)

### 基礎功能
- [x] 成功載入 5 個狀態欄位 (Backlog, Todo, Running, Testing, Done)
- [x] 任務能根據狀態正確歸類於對應欄位
- [x] 切換「待完成」模式時，顯示 5 欄且焦點對齊「待辦」
- [x] 切換「全部」模式時，顯示 5 欄看板全景
- [x] 切換「已完成」模式時，僅顯示單一「已完成」欄位

### 進階互動
- [x] 每個欄位底部的「快速新增」能正常運作並正確賦予狀態
- [x] 任務狀態變更時，看板能即時反映移動
- [x] 標題旁的任務計數與內容 100% 同步

### 回應式設計與優化
- [x] 螢幕寬度 < 768px 時自動切換為標籤模式 (Tabs)
- [x] 標籤切換能正確記憶最後選中狀態 (`sessionStorage`)
- [x] 看板支援橫向捲動，且每個欄位具備獨立垂直捲動條
- [x] 自定義捲動條樣式符合玻璃擬態視覺風格
- [x] UI 切換延遲 < 200ms (效能達標)
- [x] 任務文字渲染已進行安全性校閱 (防範 XSS)
