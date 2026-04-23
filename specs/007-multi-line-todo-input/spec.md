# Feature Specification: 多行待辦事項輸入 (Multi-line Todo Input)

**Feature Branch**: `007-input-type-text`  
**Created**: 2026-04-22  
**Status**: Draft  
**Input**: User description: "修正 'input type=text class=todo-text', 將欄位從單行改成多行, 至少可顯示10 行, 超過則顯示直式 scroll bar"

## Clarifications

### Session 2026-04-22

- Q: 當 Enter 用於換行時，是否需要保留鍵盤快捷鍵來觸發「提交/儲存」動作？ → A: 支援 Ctrl + Enter (或 Cmd + Enter) 觸發提交
- Q: 當輸入內容少於 10 行時，輸入框應維持固定的 10 行高度，還是根據內容自動增長？ → A: 固定 10 行高度 (即使內容為空或只有 1 行)
- Q: 在任務列表中檢視已儲存的任務時，是否也需要顯示完整的 10 行高度？ → A: 僅顯示前 1-3 行，點擊後展開或進入編輯模式以維持列表整潔

## User Scenarios & Testing *(mandatory)*

### User Story 1 - 輸入與檢視詳細任務描述 (Priority: P1)

身為一個使用者，我希望在新增、編輯或瀏覽待辦事項時能處理多行文字，以便詳細描述與檢視複雜的任務內容。

**Why this priority**: 這是本功能的核心價值，改善使用者對於長描述內容的完整生命週期體驗。

**Independent Test**: 可透過輸入換行文字儲存後，在列表中確認其顯示方式（縮略），並進入編輯模式確認完整內容顯示。

**Acceptance Scenarios**:

1. **Given** 處於新增或編輯任務狀態，**When** 點擊輸入框，**Then** 應該看到一個具備 10 行固定高度的多行編輯區域。
2. **Given** 任務列表顯示包含多行的任務，**When** 檢視該任務，**Then** 應僅顯示前 1-3 行內容，以保持列表簡潔。
3. **Given** 在輸入框中輸入內容，**When** 文字超過一行，**Then** 輸入框應正確顯示換行內容，而非橫向滾動。
4. **Given** 多行輸入框已顯示，**When** 檢視頁面，**Then** 下方的看板區域（.kanban.container）應完整可見，不被主容器遮蔽。

---

### User Story 2 - 長文本視覺管理 (Priority: P2)

身為一個使用者，當我輸入非常長的描述時，我希望輸入框能保持固定高度並提供滾動條，以維持頁面佈局的整潔。

**Why this priority**: 確保長內容不會破壞頁面 UI，同時提供良好的閱讀方式。

**Independent Test**: 輸入超過 10 行的內容，確認輸入框高度固定且出現滾動條。

**Acceptance Scenarios**:

1. **Given** 輸入框中已有內容，**When** 內容行數少於或等於 10 行，**Then** 輸入框應顯示完整的 10 行高度。
2. **Given** 輸入框中內容超過 10 行，**When** 檢視輸入框，**Then** 應出現垂直滾動條，且輸入框總高度不再增加。

---

### User Story 4 - 介面佈局滾動優化 (Priority: P2)

身為一個使用者，我希望當內容（輸入框、過濾器、看板）超過螢幕高度或寬度時，這些內容能集合在一個具備滾動條的容器中，以便我能在不影響 Header 與 Footer 的情況下瀏覽所有資訊。

**Why this priority**: 優化在小螢幕或長看板下的操作體驗，確保導航工具始終可見。

**Independent Test**: 縮小瀏覽器高度與寬度至內容溢出，確認出現垂直與橫向滾動條且 Header/Footer 保持固定。

**Acceptance Scenarios**:

1. **Given** 頁面載入完成，**When** 內容總長度超過可視區域，**Then** 應出現一個包裹輸入與看板區域的垂直滾動條。
2. **Given** 頁面載入完成，**When** 看板內容總寬度超過可視區域，**Then** 應出現一個包裹看板區域的橫向滾動條（位於 .main-content-scroller）。
3. **Given** 捲動內容，**When** 向上、下、左、右捲動時，**Then** 頁面頂部的標題 (Header) 與底部的統計資訊 (Footer) 應保持固定位置，不隨內容捲動消失。
4. **Given** 使用看板視圖，**When** 看板高度或寬度增加，**Then** 滾動條應能正確涵蓋整個看板區域。

---

### User Story 5 - 任務優先序與排序 (Priority: P2)

身為一個使用者，我希望在看板上能為任務設定優先序（Priority），並讓系統自動按優先序與起始時間排序，以便我能優先處理最重要的工作。

**Why this priority**: 提升工作效率，確保關鍵任務能顯眼地顯示在最上方。

**Independent Test**: 為同一欄位建立多個不同優先序與建立時間的任務，確認其顯示順序。

**Acceptance Scenarios**:

1. **Given** 看板載入完成，**When** 檢視任務欄位內容，**Then** 任務應優先按 `priority` (1 > 2 > 3) 排序，次之按 `created_at` (起始時間) 排序。
2. **Given** 任務顯示於看板，**When** 檢視任務卡片，**Then** 應能清楚看到該任務的優先序狀態標籤。

---

### User Story 6 - 逾期管理與高亮 (Priority: P2)

身為一個使用者，我希望系統能自動偵測並高亮（Highlight）已超過預計完成日期的任務，以便我能及時處理延誤的工作。

**Why this priority**: 提供直觀的視覺反饋，協助使用者追蹤延期項目。

**Independent Test**: 設定一個日期已過期的任務，確認其在看板中呈現特殊樣式（如紅色邊框或背景）。

**Acceptance Scenarios**:

1. **Given** 任務具備預計完成日期，**When** 該日期早於目前系統日期（依據客戶端瀏覽器當地時間之當日 00:00 判定，即日期小於今日則為逾期），**Then** 看板中的任務卡片應顯示高亮樣式（例如 `class="overdue-highlight"`）。
2. **Given** 任務編輯介面，**When** 使用者新增或編輯任務，**Then** 應能選擇或輸入預計完成日期。

---

### User Story 7 - UI 流程優化與儲存互動 (Priority: P2)

身為一個使用者，我希望新增任務的介面能預設隱藏，僅在需要時顯示，並提供明確的「儲存」按鈕，以維持介面簡潔並降低誤觸風險。

**Why this priority**: 優化輸入區域的視覺佔比，提升操作的確定性。

**Independent Test**: 預設看不到輸入區，點擊「+」後顯示；點擊「儲存」後完成新增並恢復隱藏。

**Acceptance Scenarios**:

1. **Given** 頁面載入完成，**When** 檢視頁面，**Then** `.input-section` 應預設隱藏。
2. **Given** 點擊新增按鈕，**When** 輸入區顯示後，**Then** 應看到一個「儲存任務」按鈕。
3. **Given** 點擊「儲存任務」按鈕且驗證通過，**When** 任務建立成功，**Then** `.input-section` 應自動隱藏。

---

### User Story 8 - 起始日期驗證與欄位 (Priority: P2)

身為一個使用者，我希望在建立任務時能指定「起始日期」，且系統應強制我選擇此日期，以確保每個任務都有明確的啟動時間點。

**Why this priority**: 強化任務管理的時間維度，並確保資料的完整性。

**Independent Test**: 嘗試在不選擇起始日期的情況下儲存任務，確認系統顯示警告並阻止儲存。

**Acceptance Scenarios**:

1. **Given** 輸入區已顯示，**When** 填寫內容但未選擇起始日期，**Then** 點擊儲存按鈕時應跳出視窗提示「請選擇起始日期」。
2. **Given** 起始日期已選擇，**When** 執行儲存，**Then** 任務應成功建立且起始日期正確寫入資料庫。

## Requirements *(mandatory)*


### Functional Requirements

- **FR-001**: 系統必須將待辦事項輸入欄位（class: `todo-text`）由單行輸入框轉換為多行輸入區域。
- **FR-002**: 系統必須確保多行輸入區域具備固定的顯示高度，不論內容多寡，皆維持 10 行文字的高度。
- **FR-003**: 系統必須在內容行數超過 10 行時，自動啟用並顯示垂直滾動條。
- **FR-004**: 系統必須支援在多行輸入區域內使用 `Enter` 鍵進行換行操作。
- **FR-005**: 系統必須確保多行輸入的內容能被正確儲存並在重新載入時保持換行格式。
- **FR-006**: 系統必須支援使用 `Ctrl + Enter` (或 Mac 上的 `Cmd + Enter`) 作為快捷鍵，在輸入框焦點內直接觸發儲存/提交動作。
- **FR-007**: 在任務列表視圖（非編輯狀態）中，對於多行任務內容應僅顯示前 3 行文字（透過 CSS `line-clamp` 實作），並提供擴展檢視或進入編輯模式的途徑。
- **FR-008**: 系統必須提供一個包含輸入、過濾與看板區域的滾動容器，並確保 Header 與 Footer 在內容滾動時保持固定。
- **FR-009**: 系統必須支援為任務設定優先序 (High, Medium, Low)。
- **FR-010**: 系統必須在看板渲染時，根據「優先序 > 建立時間」進行排序。
- **FR-011**: 系統必須偵測任務是否逾期（due_date < today），並套用高亮 CSS 樣式。
- **FR-012**: 系統必須在 `.input-section` 預設套用 `display: none`，並透過 `#add-btn` 切換顯示。
- **FR-013**: 系統必須驗證 `start_date` 是否存在，若為空則使用 `window.alert` 提示使用者「請選擇起始日期」。


### Key Entities

- **Todo Item**: 代表一個待辦事項。
    - **Description**: 待辦事項的內容，現支援多行純文字。

## Success Criteria *(mandatory)*

### Measurable Outcomes

- **SC-001**: 使用者可以在輸入框中至少看到 10 行文字而無需滾動。
- **SC-002**: 當內容行數達到第 11 行時，垂直滾動條必須在 100ms 內出現且可供操作。
- **SC-003**: 任務儲存後再次開啟，換行字元（Newline）應 100% 正確還原顯示。
- **SC-004**: 當內容超過螢幕高度時，垂直滾動條應出現於指定區域，且 Header 與 Footer 始終可見。

## Assumptions
- 預設字體大小與行高將遵循專案既有的 CSS 定義。
- 原本透過 `Enter` 鍵快速提交任務的功能在該欄位中將改為「換行」，改為使用 `Ctrl + Enter` 或點擊專屬按鈕進行提交。
- 本次變更不涉及後端資料庫欄位類型的調整，預設 SQLite TEXT 類型已足夠支援長文本。
