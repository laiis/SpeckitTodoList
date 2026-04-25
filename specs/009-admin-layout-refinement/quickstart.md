# Quickstart: Admin Layout Refinement

## Development Setup

1. **環境需求**:
   - Node.js (用於執行 Vitest)
   - 瀏覽器 (建議 Chrome/Edge 用於佈局調適)

2. **啟動測試**:
   ```bash
   npm test tests/unit/ui-refinements.test.js
   ```

3. **手動驗證步驟**:
   - 開啟 `public/pages/admin.html`。
   - 縮小瀏覽器視窗寬度至 1000px 以下，檢查是否出現橫向捲軸。
   - 向下捲動頁面，檢查頁首 (Header) 是否固定在頂部。
   - 檢查「使用者管理」與「系統日誌」的寬度比例是否維持在 2:3。

## Key Files

- `public/pages/admin.html`: 主要實作檔案。
- `tests/unit/ui-refinements.test.js`: 佈局驗證測試。
