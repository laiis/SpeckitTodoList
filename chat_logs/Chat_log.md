# Todo List App 設計方案

這是一個現代化、美觀且功能完備的 Todo List 應用程式設計。

## 1. 目標
- 使用純 HTML, CSS, JavaScript (Vanilla JS)。
- 提供精美的 UI (毛玻璃效果、漸層、流暢動畫)。
- 具備基本的 CRUD (增、查、改、刪) 功能。
- 使用 `localStorage` 實現離線儲存。

## 2. 功能特點
- **新增任務**: 輸入任務名稱，按下 Enter 或點擊「+」按鈕。
- **任務狀態**: 點擊勾選框標記完成，文字顯示刪除線並變灰。
- **編輯任務**: 點擊任務文字即可修改內容。
- **刪除任務**: 點擊右側刪除按鈕移除。
- **過濾功能**: 提供「全部」、「待完成」、「已完成」三個分頁過濾顯示。
- **清除功能**: 一鍵清除所有已完成任務。
- **數據持久化**: 刷新頁面後數據依然保留。

## 3. 技術棧
- **HTML5**: 結構化標籤。
- **CSS3**: 使用 CSS 變量 (Variables) 管理主題色，Flexbox/Grid 佈局，CSS Transitions/Animations 增強體驗。
- **JavaScript (ES6+)**: DOM 操作，事件處理，LocalStorage API。

## 4. 目標目錄結構
- `index.html`: 應用程式主結構。
- `style.css`: 樣式表。
- `script.js`: 邏輯與數據處理。

## 5. 實施計劃
1. 建立 `index.html`：定義基礎結構。
2. 撰寫 `style.css`：實現「毛玻璃」視覺與漸層背景。
3. 撰寫 `script.js`：
   - 定義數據結構 (Task Object)。
   - 實現渲染函數 (Render Tasks)。
   - 處理使用者互動 (Add, Toggle, Delete, Filter)。
   - 儲存到 LocalStorage。
4. 最終測試與修正。
