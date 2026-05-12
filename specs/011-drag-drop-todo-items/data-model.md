# Data Model: 拖拉式任務管理 (Drag-and-Drop Task Management)

## Entities

### Task (任務)

任務實體需要擴充排序權重，以支援拖放後的順序持久化。

| 欄位名 | 型別 | 說明 | 驗證規則 |
|--------|------|------|----------|
| id | INTEGER | 主鍵 (PK) | 自動遞增 |
| title | TEXT | 任務標題 | 不可為空 |
| status | TEXT | 任務狀態 (河道) | 必須為有效的河道名稱 |
| **rank** | **REAL** | **排序權重 (新增)** | **不可為空，數值越小越靠前** |

## Relationships

- **Task - Lane**: 每個任務屬於且僅屬於一個河道 (Lane)。
- **Task - Task**: 任務之間透過 `rank` 欄位決定在同一河道內的顯示順序。

## State Transitions (狀態移轉)

任務可以在任何有效的河道之間進行移轉。

- **Move**: `status` 變更為目標河道名稱。
- **Reorder**: `rank` 變更為目標位置前後權重的平均值。
