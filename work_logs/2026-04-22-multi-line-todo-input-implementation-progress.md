# Work Log: 多行待辦事項輸入實作進度 (Implementation Progress)

**Date**: 2026-04-22
**Feature**: 多行待辦事項輸入 (007-multi-line-todo-input)
**Status**: Core Implementation Completed & Test Refinement in Progress

## 實作摘要

今日已完成「多行待辦事項輸入」的核心實作與初步驗證。

### 1. 核心功能實作 (Core Implementation)
- **前端變更**：
    - 將 `index.html` 的輸入框與 `script.js` 的快速新增改為 `textarea`。
    - 支援 `Ctrl + Enter` (及 `Cmd + Enter`) 提交任務。
    - 實作「顯示與編輯模式」切換邏輯：預設由 `div` 顯示內容，點擊後切換為 `textarea` 進行編輯。
- **後端變更**：
    - 更新 `server/services/taskService.js` 在建立任務時加入 `logger.info` 記錄。
- **樣式優化**：
    - 實作 CSS `-webkit-line-clamp: 3` 進行列表內容縮略。
    - 使用 `white-space: pre-wrap` 保留換行。
    - 鎖定編輯狀態下的 `textarea` 高度為 10 行並禁用手動縮放。

### 2. 測試修復與環境優化 (Test Refinement)
- **環境設定**：
    - 更新 `vitest.config.js`，統一將 `DB_PATH` 設定為 `:memory:`。
    - 預先定義 `JWT_SECRET` 與 `ADMIN_PASSWORD` 測試環境變數，解決因環境差異導致的測試失敗。
- **測試修復**：
    - 修正 `todo.test.js` 中 `fetch` 模擬與變數範圍問題，目前該測試已全數通過。
- **遺留問題排查**：
    - **`taskService.test.js`**：遭遇 `SqliteError: FOREIGN KEY constraint failed`，已加入偵錯日誌確認 `users` 資料表有正確插入，正持續排查外鍵失敗原因。
    - **`authService.test.js`**：登入驗證失敗，初步懷疑與 `bcrypt` 驗證或資料庫初始化順序有關。

## 交付成果
- 更新檔案：`script.js`, `style.css`, `server/services/taskService.js`, `todo.test.js`, `vitest.config.js`。
- 實作進度：Phase 1-5 已大致完成，剩餘最終 Polish。

## 下一步計畫
- 修復 `taskService.test.js` 的外鍵問題。
- 修正 `authService.test.js` 與 `middleware.test.mjs` 的模擬邏輯。
- 執行全面驗證並更新 `tasks.md` 狀態。
