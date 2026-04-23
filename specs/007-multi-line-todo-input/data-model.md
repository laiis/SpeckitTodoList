# Data Model: 多行待辦事項輸入 (Multi-line Todo Input)

## Entities

### TodoItem (既存實體)

本功能涉及資料庫結構變更，需增加優先序與日期欄位。

- **Fields**:
    - `id`: INTEGER (PK)
    - `text`: TEXT - 待辦事項內容。
        - **Validation**: 儲存時應保留換行符 (`\n`)。
    - `status`: TEXT
    - `priority`: INTEGER - 優先序狀態。
        - `1`: High (高優先序)
        - `2`: Medium (中優先序，預設值)
        - `3`: Low (低優先序)
    - `due_date`: DATE - 預計完成日期 (格式: YYYY-MM-DD)。
    - `created_at`: DATETIME - 建立/起始時間（用於排序）。
    - `user_id`: INTEGER

## Data Flow & Transitions

1. **User Input**: 使用者在 `<textarea>` 輸入包含換行的文字。
2. **Serialization**: JS 獲取 `textarea.value`（會自動包含 `\n`）。
3. **Storage**: 透過既有 API 存入 SQLite。
4. **Retrieval**: 從資料庫讀取字串。
5. **Display**:
    - **列表視圖**: 透過 CSS `line-clamp` 顯示前 3 行。
    - **編輯視圖**: 將字串填入 `textarea.value`（自動還原換行）。
    - **詳細/唯讀視圖**: 使用 `white-space: pre-wrap;` 渲染以正確換行。
