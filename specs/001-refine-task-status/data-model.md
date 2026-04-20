# Data Model: 任務細分狀態模型 (Task Refined Status)

## 1. 實體定義 (Entity Definitions)

### Task (任務)

| 欄位名 | 類型 | 說明 | 驗證規則 |
| :--- | :--- | :--- | :--- |
| `id` | `Number` | 任務唯一識別碼 | 必填，使用時間戳記 |
| `text` | `String` | 任務描述內容 | 必填，不為空字串 |
| `completed` | `Boolean` | 是否已完成 (Legacy) | 同步至 `status === 'Done'` |
| `status` | `String` | **目前細分狀態** | 必填，限 `Enum(Status)` |
| `createdAt` | `ISO-8601` | 建立日期時間 | 必填 |
| `testedAt` | `ISO-8601` | **進入 Testing 狀態時間** | 僅於 `status === 'Testing'` 時更新 |
| `completedAt`| `ISO-8601` | **完成任務時間** | 僅於 `status === 'Done'` 時更新 |

## 2. 狀態列舉 (Status Enum)

- `Backlog`: 需求池/待處理 (灰)
- `Todo`: 待辦/預計執行 (藍)
- `Running`: 進行中 (紫)
- `Testing`: 測試中/審核中 (橘)
- `Done`: 已完成 (綠)

## 3. 狀態機轉換規則 (State Transitions)

| 起始狀態 | 目標狀態 | 觸發條件 | 自動操作 |
| :--- | :--- | :--- | :--- |
| Any | `Testing` | 下拉選單選取 `Testing` | 記錄/更新 `testedAt` (保留直到下次進入該狀態或手動刪除) |
| Any | `Done` | 下拉選單選取 `Done` | 記錄/更新 `completedAt`, `completed = true` (保留直到下次進入該狀態) |
| `Done` | Not `Done` | 下拉選單選取其他 | `completed = false` (保留 `completedAt` 供審計使用) |
| `Testing` | Not `Testing`| 下拉選單選取其他 | 保留 `testedAt` (供品質檢查參考) |

## 4. 驗證規則 (Validation Rules)

- **V-001**: 預設狀態必須為 `Todo`。
- **V-002**: 狀態切換時必須即時同步至 `localStorage`。
- **V-003**: 狀態欄位值必須與 `Status Enum` 中定義的 5 種字串一致。
