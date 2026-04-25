# Performance Logging Contract

## Overview
所有性能指標應透過統一的 `Logger` 進行記錄。日誌訊息應遵循特定格式以利後續分析。

## Log Event Formats

### Page Load Performance
當頁面加載完成時記錄。
- **Format**: `PERF:LOAD | TBT: {tbt}ms | LCP: {lcp}ms | RAM: {mem}GiB`
- **Example**: `PERF:LOAD | TBT: 120ms | LCP: 850ms | RAM: 1GiB`

### Interaction Performance (Long Tasks)
當偵測到執行時間超過 50ms 的任務時記錄。
- **Format**: `PERF:LONGTASK | Duration: {duration}ms | Interaction: {type}`
- **Example**: `PERF:LONGTASK | Duration: 65ms | Interaction: task_add`

### Mode Change
當切換性能模式時記錄。
- **Format**: `PERF:MODE_CHANGE | Enabled: {bool}`
- **Example**: `PERF:MODE_CHANGE | Enabled: true`
