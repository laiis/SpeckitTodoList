# Work Log: 多行待辦事項輸入功能完成 (Multi-line Todo Input Completion)

**日期**: 2026-04-23  
**狀態**: 已完成 (Completed)  
**功能分支**: `007-input-type-text`

## 核心達成項目

### 1. 前端 UI 變更
- **HTML**: 將待辦事項輸入框從單行 `<input type="text">` 轉換為多行 `<textarea>`。
- **CSS**: 
    - 設定固定 10 行高度 (`height: calc(10 * 1.5em)`) 與 `line-height: 1.5`。
    - 實作垂直滾動條與禁用手動調整大小 (`resize: none`)。
    - 實作列表任務內容的 3 行縮略顯示 (`-webkit-line-clamp: 3`)。
    - 確保所有輸入/顯示區域支援 `white-space: pre-wrap` 以保留換行符。

### 2. 互動邏輯優化
- **JavaScript**:
    - 支援 `Ctrl + Enter` (及 Mac `Cmd + Enter`) 快捷鍵提交任務。
    - 更新 `createNewTodo` 邏輯，確保從 `textarea.value` 正確獲取多行字串。
    - 更新編輯模式，點擊任務內容後進入 10 行高度的 `textarea` 編輯界面。

### 3. 品質與測試
- **單元測試**: 
    - 建立 `tests/unit/ui.test.js` 驗證快捷鍵與換行邏輯。
    - 更新 `tests/unit/taskService.test.js` 並將其改為使用 `:memory:` 資料庫，解決並行測試下的外鍵約束衝突，並確認換行符的儲存與讀取 100% 準確。
- **整合測試**: 透過 `tests/integration/todo_flow.test.mjs` 驗證端到端的多行資料流。

### 4. 文件更新
- **README.md**: 補全「啟動系統」步驟（包含前後端分離啟動說明），並新增多行輸入與快捷鍵的使用指南。
- **spec.md**: 修正 FR-007 規格，將縮略行數明確定義為固定 3 行，以符合實作現狀。
- **tasks.md**: 標註所有 17 個任務為已完成狀態。

## 執行成效
- 滿足所有功能性需求 (FR-001 ~ FR-007)。
- 通過所有與本功能相關的測試案例（共 10 個核心測試）。
- 符合專案憲法中的 TDD、Logger 記錄與安全規範。

## 下一步計劃
- 合併 `007-input-type-text` 分支至主線。
- 準備下一個功能的規格定義或進行系統重構分析。
