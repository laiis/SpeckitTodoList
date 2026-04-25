# Research: Home Page Performance Optimization

## Decision: CSS Optimization Strategy
- **Chosen**: 「性能模式」手動開關 + 視覺降級。
- **Rationale**: CSS `backdrop-filter` 與高半徑的 `blur()` 濾鏡在低階硬體（尤其是無獨立顯卡之系統）上會造成極高的 GPU/CPU 負擔。
- **Action**: 
    - 性能模式開啟時，將 `--blur-effect` 設為 `0`。
    - 移除 `.blob` 的 `filter` 與 `animation`。
    - 將背景 `linear-gradient` 替換為純色或靜態圖片。
- **Alternatives considered**: 
    - 全量自動降級：風險在於誤判，且某些使用者即便硬體稍低也希望保留視覺效果。
    - 僅移除動畫：效果有限，模糊效果仍佔用大量顯存。

## Decision: JavaScript Optimization Strategy
- **Chosen**: 實作事件委派 (Event Delegation) + 局部渲染優化。
- **Rationale**: 目前每個任務卡片都有多個獨立事件監聽器，50+ 任務會產生 200+ 監聽器，增加記憶體壓力。全量 `innerHTML = ''` 重繪會導致嚴重的 Layout Thrashing。
- **Action**:
    - 在 `kanban-container` 層級監聽點擊、變更與失去焦點事件。
    - 優化 `renderKanban`，考慮只更新變動的欄位或使用 `DocumentFragment`。
    - 快取 `DOMParser` 實例或改用更輕量的轉義方式。
- **Alternatives considered**: 
    - 使用虛擬列表 (Virtual List)：對於看板模式（橫向+縱向）實作複雜度高，暫不作為第一階段目標。

## Decision: Environment Detection & Persistence
- **Chosen**: `navigator.deviceMemory` 偵測 + `localStorage` 持久化。
- **Rationale**: `navigator.deviceMemory` 提供系統 RAM 的近似值（以 GiB 為單位）。偵測 `RAM <= 1` 可作為主動提示的基準。
- **Action**:
    - `localStorage.getItem('performance-mode')` 控制初始狀態。
    - 若 `navigator.deviceMemory <= 1` 且無設定記錄，則彈出提示。

## Decision: Unified Frontend Logger
- **Chosen**: 實作 `services/logger.js`。
- **Rationale**: 專案憲法要求嚴禁 `console.log` 且需包含時間戳記。
- **Action**:
    - 建立符合 `server/utils/logger.js` 介面的前端 Service。
    - 提供 `info`, `error`, `warn` 等方法。
