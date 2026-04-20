# Quickstart: 任務狀態細分功能測試 (Refine Task Status)

## 1. 開發準備 (Development Setup)

1.  確認 `localStorage` 中是否有 `todo-list` 的 Key。
2.  開啟瀏覽器開發者工具 (F12)。

## 2. 功能測試步驟 (Manual Verification)

### 情境 A：資料遷移驗證
1.  手動在 `localStorage` 建立舊格式資料：
    ```javascript
    localStorage.setItem('todo-list', JSON.stringify([{id: Date.now(), text: 'Legacy Task', completed: false}]));
    ```
2.  重新整理頁面。
3.  **預期結果**: 該任務應自動獲得 `status: 'Todo'`，且 UI 下拉選單顯示 `Todo`。

### 情境 B：狀態切換與時間記錄
1.  建立一個新任務。
2.  **操作**: 將狀態從 `Todo` 改為 `Testing`。
3.  **預期結果**: 
    - 任務 UI 顯示橘色標籤。
    - 檢視 `localStorage` 中該項目的 `testedAt` 是否有時間戳記。
4.  **操作**: 將狀態從 `Testing` 改為 `Done`。
5.  **預期結果**:
    - 勾選框自動打勾。
    - 任務 UI 顯示綠色標籤。
    - `completedAt` 有時間戳記，`testedAt` 被清除。

### 情境 C：效能基準測試 (SC-003)
1. 在 `script.js` 的過濾函式開始與結束處加入 `console.time('filter')` 與 `console.timeEnd('filter')`。
2. 切換各個狀態過濾器（全部、待完成、已完成）。
3. **預期結果**: 控制台輸出的時間均低於 200ms。

## 3. 自動化驗證 (CLI)

執行 `/speckit.verify` 進行基準測試。
