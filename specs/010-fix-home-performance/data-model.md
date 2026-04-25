# Data Model: Performance Optimization

## LocalStorage Entities

### PerformanceSettings
用於持久化使用者的性能偏好與系統偵測結果。

| Key | Type | Description |
|-----|------|-------------|
| `performance-mode` | `Boolean` | 是否開啟性能模式 (true = 開啟優化, false = 完整視覺) |
| `performance-detect-dismissed` | `Boolean` | 是否已忽略低階環境偵測提示 |

## Constants

### PerformanceThresholds
| Name | Value | Description |
|------|-------|-------------|
| `LOW_MEM_THRESHOLD` | `1.0` | 判定為低階環境的 RAM 閾值 (GiB) |
| `LONG_TASK_THRESHOLD` | `50ms` | 判定為長任務的時間閾值 |
