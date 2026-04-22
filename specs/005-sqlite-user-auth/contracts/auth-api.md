# Authentication & Admin API Contracts

## POST /api/auth/register
註冊新使用者。

### Request Body
```json
{
  "username": "example_user",
  "password": "secure_password"
}
```

### Success Response (201 Created)
```json
{
  "message": "User registered successfully",
  "userId": 5
}
```

---

## POST /api/auth/login
使用者登入。支援 5 次嘗試鎖定。
成功後將 JWT 寫入 Secure HttpOnly Cookie。

### Request Body
```json
{
  "username": "example_user",
  "password": "secure_password"
}
```

### Success Response (200 OK)
**Headers**:
`Set-Cookie: token=<jwt>; HttpOnly; Secure; SameSite=Strict; Max-Age=86400`

**Body**:
```json
{
  "user": {
    "id": 5,
    "username": "example_user",
    "role": "admin"
  }
}
```

### Failure Response (401/403)
- 401: 無效帳號或密碼。
- 403: 帳號已鎖定（鎖定期內）。

---

## GET /api/auth/me
取得當前登入使用者的資訊。依賴於 Cookie 中的 JWT。

### Success Response (200 OK)
```json
{
  "id": 5,
  "username": "example_user",
  "role": "admin"
}
```

---

## Admin Dashboard API (Requires Admin Role)

### GET /api/admin/users
取得系統中所有使用者清單。

### Success Response (200 OK)
```json
[
  { "id": 1, "username": "admin", "role": "admin", "is_locked": false },
  { "id": 5, "username": "user1", "role": "viewer", "is_locked": true }
]
```

### POST /api/admin/users/:id/password-reset
管理員手動重設使用者密碼。

### Request Body
```json
{
  "newPassword": "new_secure_password"
}
```

### Success Response (200 OK)
```json
{ "message": "Password reset successfully" }
```

### PATCH /api/admin/users/:id/role
變更使用者的角色權限。

### Request Body
```json
{ "role_id": 1 }
```

### Success Response (200 OK)
```json
{ "message": "User role updated successfully" }
```

### POST /api/admin/users/:id/unlock
管理員手動解鎖帳號。

### Success Response (200 OK)
```json
{ "message": "User unlocked successfully" }
```

### GET /api/admin/logs
獲取系統安全日誌。

### Success Response (200 OK)
```json
[
  { "timestamp": "2026-04-21T10:00:00Z", "type": "security", "message": "Login failed for user: admin" },
  { "timestamp": "2026-04-21T10:05:00Z", "type": "security", "message": "User locked: admin" }
]
```
