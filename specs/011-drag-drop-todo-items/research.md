# Research: 拖拉式任務管理 (Drag-and-Drop Task Management)

## 1. 拖拉函式庫選擇 (Drag-and-Drop Library)

- **Decision**: 使用 **SortableJS**。
- **Rationale**: 
    - 支援跨列表（河道）拖曳，且設定簡單。
    - 內建良好的視覺回饋（Ghost/Choosing classes）。
    - 效能優異，且不依賴 jQuery。
    - 支援自動捲動 (Auto-scroll) 功能。
- **Alternatives considered**: 
    - HTML5 Drag and Drop API: 實作複雜度高，跨瀏覽器視覺一致性較差。
    - Dragula: 較輕量但功能及維護活躍度不及 SortableJS。

## 2. 排序持久化邏輯 (Rank/Order Field Implementation)

- **Decision**: 採用 **Lexical Rank (字串排序或高精度浮點數)** 的概念，但為求簡單，初期使用 **整數權重 (Integer Rank)** 並預留較大間隔。
- **Rationale**: 
    - 每次拖放時，將任務的 `rank` 設為 `(prev_rank + next_rank) / 2`。
    - SQLite 支援 `REAL` 型別，可提供足夠精度。
    - 此方法只需更新單一任務，不需重新排定整條河道的序號。
- **Alternatives considered**: 
    - 簡單索引順序 (0, 1, 2...): 移動一個任務需要更新河道內所有後續任務的索引，效能較差且易產生競爭。

## 3. 自動捲動與視覺回饋 (Auto-scroll & Visual Feedback)

- **Decision**: 
    - **自動捲動**: 使用 SortableJS 內建的 `scroll` 選項。
    - **佔位符 (Placeholder)**: 使用 `ghostClass` 配合 CSS 虛線框樣式。
    - **半透明效果**: 使用 `chosenClass` 調整不透明度。
- **Rationale**: 符合規格書中 P2 (視覺提示) 與 Q5 (自動捲動) 的要求。

## 4. API 設計 (API Contracts)

- **Decision**: 
    - `PATCH /api/tasks/:id`: 僅更新 `status` (若跨河道) 與 `rank`。
- **Rationale**: 符合 RESTful 規範，減少傳輸資料量。

## 5. 衝突處理 (Conflict Resolution)

- **Decision**: 最後一次操作勝出 (Last Write Wins)。
- **Rationale**: 根據 `/speckit.clarify` Q1 的決策，對於本專案規模，此策略最為可行。
