# Research Report: 看板模式實作技術分析

## 核心問題分析

### 1. 看板佈局實作 (Kanban Layout Implementation)
- **需求**: 支援橫向捲動、欄位最小寬度 280px、各欄位獨立垂直捲動。
- **技術方案**:
    - 使用 CSS `display: flex` 或 `display: grid` 於容器。
    - 欄位設置 `flex: 1 0 280px` 以支援彈性分配與最小寬度。
    - 容器設置 `overflow-x: auto` 以啟用橫向捲動。
    - 每個欄位內部內容容器設置 `overflow-y: auto` 與 `max-height: calc(100vh - header_height)`。
- **決策**: 採用 **Flexbox** 佈局，因為其在處理動態欄位數量（4 欄 vs 5 欄）時更具彈性且易於調整最小寬度。

### 2. 行動端標籤模式 (Mobile Tabbed View)
- **需求**: 寬度 < 768px 時切換為單欄標籤。
- **技術方案**:
    - 使用 CSS Media Query 切換佈局。
    - 標籤列 (Tabs) 僅在行動端顯示，內容根據點選顯示對應的欄位。
    - 每個欄位在行動端設為 `width: 100%` 並 `display: none`（除當前 active 外）。
- **決策**: 使用 **CSS Class 切換 (e.g., .active)** 配合 Media Queries。

### 3. Service 層架構設計 (Service Layer Architecture)
- **需求**: 分離業務邏輯與 DOM 操作，嚴禁於 View 直接寫邏輯 (憲法 IV)。
- **技術方案**:
    - 建立 `TodoService` 類別處理：資料存取 (localStorage)、任務過濾 (status filter)、狀態變更邏輯。
    - `KanbanPage` 類別處理：DOM 監聽、渲染欄位與任務卡片、呼叫 Service。
- **決策**: 實施 **TodoService** 單一實例管理狀態，由頁面 Controller 負責呼叫與渲染。

### 4. 測試覆蓋率驗證 (Vitest Coverage)
- **需求**: 確保 80% 覆蓋率 (憲法 IV)。
- **技術方案**:
    - 使用 Vitest 內建的 `@vitest/coverage-v8` 插件。
    - 在 `package.json` 中新增 `test:coverage` 指令。
- **決策**: 開發期間將業務邏輯 (TodoService) 獨立於 `script.js` 之外（或匯出），確保其可被 Vitest 單獨測試。

## 結論與最佳實踐
- 優先實作 `TodoService` 並完成對應單元測試 (TDD)。
- 佈局層級：`.kanban-container` (Flex/Overflow-X) > `.kanban-column` (Flex-Basis/Flex-Shrink) > `.column-content` (Overflow-Y)。
- 日誌紀錄：封裝一個 `Logger` 函式替換原本可能使用的 `console.log`。
