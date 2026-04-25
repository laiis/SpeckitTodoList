# Quickstart: Performance Optimization

## 開發者指引

### 1. 使用 Logger
請勿直接使用 `console.log`。請從 `services/logger.js` 匯入 `Logger`。
```javascript
import { Logger } from './services/logger.js';
Logger.info('PERF:MODE_CHANGE | Enabled: true');
```

### 2. 性能模式切換
性能模式透過 CSS 變數與 `body` class 實作：
- **Class**: `.performance-mode`
- **Effect**: 
    - 覆寫 `--blur-effect: 0 !important;`
    - 隱藏 `.background-blobs`
    - 禁用複雜動畫

### 3. 事件委派
在處理任務卡片互動時，應在 `kanban-container` 監聽事件並檢查 `event.target`。
```javascript
container.addEventListener('click', (e) => {
    const deleteBtn = e.target.closest('.delete-btn');
    if (deleteBtn) {
        // 執行刪除邏輯
    }
});
```

## 測試驗證
1. 使用 Chrome DevTools 的 **Performance** 面板。
2. 開啟 **CPU Throttling** (6x slowdown) 模擬低階硬體。
3. 確保無超過 50ms 的 **Long Tasks**。
