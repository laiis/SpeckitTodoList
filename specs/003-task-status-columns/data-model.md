# Data Model: 看板模式資料結構

## 任務實體 (Task Entity)
延用現有結構，但明確定義狀態枚舉與欄位關係。

| 欄位 | 類型 | 說明 | 驗證規則 |
| :--- | :--- | :--- | :--- |
| `id` | `String` | 唯一識別碼 (UUID) | 必填，不可重複 |
| `text` | `String` | 任務內容描述 | 必填，不可為空 |
| `status` | `Enum` | 任務當前狀態 | 必須為 `Backlog`, `Todo`, `Running`, `Testing`, `Done` 之一 |
| `completed` | `Boolean` | 是否完成 (Legacy) | `Done` 狀態對應 `true` |
| `createdAt` | `Number` | 建立時間戳記 | 必填 |
| `updatedAt` | `Number` | 最後更新時間戳記 | 每次變更時更新 |

## 狀態轉換邏輯 (State Transitions)
任務可在以下狀態間循環或遞進變更：
- `Backlog` ↔ `Todo` ↔ `Running` ↔ `Testing` ↔ `Done`
- **邏輯限制**: 任何狀態變更均需觸發 `updatedAt` 更新並記錄日誌。

## 看板視圖實體 (Kanban View Model)
系統於渲染時根據當前篩選器動態生成的對象。

| 視圖名稱 | 包含狀態 (Columns) | UI 表現 |
| :--- | :--- | :--- |
| `Active` (待完成) | `Backlog`, `Todo`, `Running`, `Testing` | 4 欄並排顯示 |
| `All` (全部) | `Backlog`, `Todo`, `Running`, `Testing`, `Done` | 5 欄並排顯示 |
| `Completed` (已完成) | `Done` | 1 欄單獨顯示 |

## 儲存結構 (Storage)
- **Key**: `todos`
- **Format**: JSON Array of Task objects.
- **驗證**: 讀取時執行資料遷移與狀態規範校正。
