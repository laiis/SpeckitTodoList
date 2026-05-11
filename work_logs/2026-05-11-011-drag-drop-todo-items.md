# 工作日誌：拖拉式任務管理功能實作 (011-drag-drop-todo-items)

**日期**: 2026-05-11
**狀態**: 已完成 (Completed)

## 任務達成摘要

成功實作看板模式下的拖拉式任務管理，支援跨狀態移動與河道內排序，並確保資料在重新整理後能保持一致。

### 1. 後端基礎建設 (Phase 1 & 2)
- **資料庫遷移**: 
  - 在 `server/db/init.js` 的 `tasks` 資料表中新增 `rank` (REAL) 欄位。
  - 實作自動遷移邏輯，為現有任務初始化 `rank = id`。
  - 為 `rank` 欄位建立索引以優化排序查詢效能。
- **Service 層優化**: 
  - 更新 `taskService.js`，將原本按 `priority` 排序改為按 `rank` 昇冪排序。
  - 確保建立任務時會自動計算下一個整數 Rank 並分配。
  - 支援 `PATCH` 更新任務的 `rank` 與 `status`。
- **日誌規範**: 符合憲法 V 要求，在任務建立與更新時記錄詳細的 Rank 與狀態變更資訊。

### 2. 前端互動實作 (Phase 3, 4, 5)
- **SortableJS 整合**:
  - 安裝並在 `script.js` 中引入 `sortablejs`。
  - 初始化看板河道容器，連結所有狀態為同一 `kanban` 群組。
- **排序與持久化**:
  - 實作中位數 Rank 計算邏輯（`(prevRank + nextRank) / 2`），避免大規模重新編號。
  - 透過事件委派與 `PATCH` API 實現拖放後的即時保存。
  - 實作「視覺還原」(Visual Undo)，當 API 更新失敗時會自動恢復卡片位置並提示。
- **視覺回饋 (US2)**:
  - 定義了 `.drag-ghost` (半透明佔位)、`.drag-chosen` (選中縮放與旋轉) 與 `.column-content.drag-over` (河道高亮) 等 CSS 樣式。
  - 優化了拖曳過程中的流暢度與互動感。

### 3. 優化與修復 (Phase N)
- **自動捲動**: 啟用 `scroll: true` 配置，優化長看板拖移體驗。
- **環境問題修復**: 解決了 `todo.test.js` 在 Node.js 測試環境中缺乏 `DOMParser` 的 ReferenceError，確保舊有測試能正常執行。
- **文件更新**: 在 `README.md` 中新增「拖拉式管理」功能說明。

## 驗證結果
- **單元測試**: `tests/unit/taskService.test.js` 通過，Rank 計算正確。
- **整合測試**: `tests/integration/drag_drop.test.mjs` 通過，API 持久化驗證成功。
- **全域測試**: 執行 `npm test` 通過大部分測試（除少數無關的 RBAC 模擬失敗外）。

## 下一步建議
- 觀察 Rank 精度的累積情況，若未來出現大量在同一區間插入的情況，可考慮實作 Rank 重新標準化邏輯。
- 增加行動端觸控拖拉的實機壓力測試。
