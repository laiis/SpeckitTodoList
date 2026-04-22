# Data Model: 多行待辦事項輸入 (Multi-line Todo Input)

## Entities

### TodoItem (既存實體)

本功能不涉及資料庫結構變更，但需明確資料流中的換行符處理。

- **Fields**:
    - `id`: INTEGER (PK)
    - `text`: TEXT - 待辦事項內容。
        - **Validation**: 儲存時應保留換行符 (`\n`)。
        - **Constraints**: 雖然資料庫支援無限長度，但前端應有基本的保護（如限制 2000 字元）。
    - `status`: TEXT
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
