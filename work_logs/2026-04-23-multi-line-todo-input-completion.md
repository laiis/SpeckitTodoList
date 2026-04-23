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

### 4. 文件更新與需求同步
- **README.md**: 補全「啟動系統」步驟（包含前後端分離啟動說明），並新增多行輸入與快捷鍵的使用指南。
- **spec.md**: 
    - 修正 FR-007 規格，將縮略行數明確定義為固定 3 行。
    - **新增 FR-008**: 定義 `.main-content-scroller` 滾動容器需求，確保 Header/Footer 固定。
    - **新增 US4**: 明確定義介面佈局滾動優化的驗收場景與成功指標 (SC-004)。
- **plan.md**: 
    - 新增 `Implementation Phases` 區塊，將 Phase 7 (UI Refinement) 與 Phase 8 (US4 - Layout Consolidation) 納入實作階段。
    - 定義 US4 的技術實作策略 (Flexbox + overflow 佈局)。
- **tasks.md**: 
    - 標註前 18 個任務為已完成狀態。
    - **新增 T013.1**: 補強列表縮略功能的測試任務。
    - **新增 Phase 8 (T019-T022)**: 追蹤介面佈局滾動優化的實作任務。

### 5. UI 流程優化與儲存互動 (US7)
- **動態切換**: `.input-section` 現在預設隱藏，點擊標題列的 `+` 按鈕後以動畫展開，並自動聚焦輸入框。
- **專屬按鈕**: 在輸入區塊內新增「儲存任務」按鈕，統一提交入口，任務儲存成功後自動隱藏輸入區，優化使用者體驗。
- **佈局重構**: 重新調整了日期選擇器與優先序選單的排版，使其更加整齊且符合現代化 UI 規範。

### 6. 起始日期驗證與欄位 (US8)
- **資料持久化**: 在資料庫 Schema 與 TaskService 中完整加入 `start_date` 支援。
- **強制驗證**: 實作儲存前的業務邏輯驗證，若「起始日期」為空則使用 `window.alert` 提示使用者並阻止提交。
- **整合測試**: 在 `tests/integration/todo_flow.test.mjs` 中新增了起始日期的存取與必填驗證案例，並全數通過。

## 執行成效
- 滿足核心功能性需求 (FR-001 ~ FR-013)。
- **進度分析**: 通過 `/speckit.analyze` 修正循環，達成需求、計畫與任務的 100% 同步，解決了規格不對齊的問題。
- 通過所有與本功能相關的測試案例（共 11 個核心測試，包含 US8 整合測試）。
- 符合專案憲法中的 TDD、Logger 記錄與安全規範。

## 下一步計劃
- 最終驗證佈局跳動 (Layout Shift) 問題。
- 合併 `007-input-type-text` 分支至主線。

