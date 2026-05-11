# API Contract: 任務狀態與排序更新

## Endpoint: PATCH /api/tasks/:id

用於在拖放操作完成後，更新任務的所屬河道及排序。

### Request Header
- `Content-Type: application/json`

### Request Body
```json
{
  "status": "進行中",
  "rank": 1500.5
}
```
*註：`status` 與 `rank` 均為選填，可僅更新其中之一。*

### Success Response (200 OK)
```json
{
  "id": 123,
  "status": "進行中",
  "rank": 1500.5,
  "updatedAt": "2026-05-11T03:12:00Z"
}
```

### Error Responses
- **400 Bad Request**: 參數格式錯誤或數值無效。
- **404 Not Found**: 找不到指定的任務 ID。
- **500 Internal Server Error**: 資料庫寫入失敗。
