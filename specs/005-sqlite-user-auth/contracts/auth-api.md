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
使用者登入並取得 JWT。支援 5 次嘗試鎖定。

### Request Body
```json
{
  "username": "example_user",
  "password": "secure_password"
}
```

### Success Response (200 OK)
```json
{
  "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
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
取得當前登入使用者的資訊。

### Headers
`Authorization: Bearer <token>`

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
  { "id": 1, "username": "admin", "role": "admin" },
  { "id": 5, "username": "user1", "role": "viewer" }
]
```

### POST /api/admin/reset-password
管理員手動重設使用者密碼。

### Request Body
```json
{
  "userId": 5,
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
