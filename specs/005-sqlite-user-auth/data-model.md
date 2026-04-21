# Data Model: 使用者登入系統 (SQLite)

## Entities

### Role (角色)
定義使用者的權限等級。

| 欄位 | 型別 | 說明 | 驗證規則 |
|-------|------|-------------|------------|
| id | INTEGER | 主鍵 | - |
| name | TEXT | 角色名稱 (admin, editor, viewer) | 唯一, 非空 |

### User (使用者)
代表系統中的帳號資訊與認證狀態。

| 欄位 | 型別 | 說明 | 驗證規則 |
|-------|------|-------------|------------|
| id | INTEGER | 主鍵, 自動遞增 | - |
| username | TEXT | 唯一使用者名稱 | 唯一, 非空, 最少 3 字元 |
| password_hash | TEXT | 加密後的密碼 (bcrypt) | 非空 |
| role_id | INTEGER | 關聯 Role 表的外鍵 | 必須存在於 Role 表 |
| failed_attempts | INTEGER | 登入失敗計數 | 預設：0, 最大 5 |
| locked_until | DATETIME | 帳號鎖定截止時間 | NULL 或 未來時間 |
| created_at | DATETIME | 建立時間 | 預設：當前時間 |

### Task (任務 - 更新)
現有待辦事項表需關聯使用者以實作資料隔離。

| 欄位 | 型別 | 說明 | 驗證規則 |
|-------|------|-------------|------------|
| user_id | INTEGER | 所屬使用者 ID | 必須存在於 User 表 |

## Relationships
- **User belongs to Role**: `User.role_id` -> `Role.id` (Many-to-One)
- **Task belongs to User**: `Task.user_id` -> `User.id` (Many-to-One)

## Initial Data (預設資料)
- Roles: `1: admin`, `2: editor`, `3: viewer`
- Users: `admin/admin` (role: 1)
