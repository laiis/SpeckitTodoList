# 工作日誌: 拖拉式任務管理 (Drag-and-Drop Task Management)

**日期**: 2026-05-11
**規格**: 011-drag-drop-todo-items
**狀態**: 已完成 (Completed)

## 實作內容摘要

### 1. 基礎建設 (Foundational)
*   **資料庫 Schema 更新**: 在 `tasks` 資料表新增 `rank` (REAL) 欄位，並為現有任務初始化 rank 值（按 ID 排序）。
*   **Service 層強化**: 更新 `taskService.js` 支援按 `rank` 排序讀取任務，並在建立與更新時正確處理 rank 賦值。符合專案憲法 V 的日誌記錄要求。
*   **依賴安裝**: 成功整合 `sortablejs` 庫。

### 2. 前端介面與互動 (UI/UX)
*   **SortableJS 整合**: 在 `script.js` 中為五個看板河道初始化拖拉功能。
*   **視覺提示 (User Story 2)**: 實作 `.drag-ghost` (虛線佔位) 與 `.drag-chosen` (選中項縮放/旋轉) CSS 樣式，提供即時操作回饋。
*   **跨河道同步 (User Story 1)**: 拖拉結束後自動計算新 Rank 並呼叫 PATCH API 持久化狀態，實作了失敗時的「視覺還原 (Visual Undo)」機制。
*   **自動捲動**: 啟用了 `scroll: true` 以優化長列表或寬看板的拖拉體驗。

### 3. 測試與驗證 (Validation)
*   **Rank 精確度測試**: 在 `tests/unit/taskService.test.js` 中實作了「邊際精度模擬」，驗證在連續插入導致極小差距時（接近 Float64 極限）排序依然正確。
*   **UI 邏輯單元測試**: 新增 `tests/unit/drag_drop_ui.test.js` 驗證前端 Rank 計算演算法。
*   **整合測試**: 驗證 `PATCH /api/tasks/:id` 介面在跨河道移動時能正確更新狀態與排序。

## 遇到的挑戰與解決
*   **Rank 計算**: 採用平均值演算法 `(prev + next) / 2` 實現 O(1) 的局部更新，並透過測試確認其在大多數場景下的穩定性。
*   **測試環境**: 修復了 `middleware.test.mjs` 中的 mock 議題（與本次任務無關但影響測試執行），確保測試環境整潔。

## 完工狀態
*   `tasks.md` 中所有項目 (T001-T023) 均已標記為完成。
*   所有核心功能均具備自動化測試覆蓋。
