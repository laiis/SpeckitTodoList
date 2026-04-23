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

---

### User Story 2 - 長文本的視覺管理 (Priority: P2)

身為一個使用者，當我輸入非常長的描述時，我希望輸入框能保持固定高度並提供滾動條，以維持頁面佈局的整潔。

**Why this priority**: 確保長內容不會破壞頁面 UI，同時提供良好的閱讀方式。

**Independent Test**: 輸入超過 10 行的內容，確認輸入框高度固定且出現滾動條。

**Acceptance Scenarios**:

1. **Given** 輸入框中已有內容，**When** 內容行數少於或等於 10 行，**Then** 輸入框應顯示完整的 10 行高度。
2. **Given** 輸入框中內容超過 10 行，**When** 檢視輸入框，**Then** 應出現垂直滾動條，且輸入框總高度不再增加。

---

## Requirements *(mandatory)*

### Functional Requirements

- **FR-001**: 系統必須將待辦事項輸入欄位（class: `todo-text`）由單行輸入框轉換為多行輸入區域。
- **FR-002**: 系統必須確保多行輸入區域具備固定的顯示高度，不論內容多寡，皆維持 10 行文字的高度。
- **FR-003**: 系統必須在內容行數超過 10 行時，自動啟用並顯示垂直滾動條。
- **FR-004**: 系統必須支援在多行輸入區域內使用 `Enter` 鍵進行換行操作。
- **FR-005**: 系統必須確保多行輸入的內容能被正確儲存並在重新載入時保持換行格式。
- **FR-006**: 系統必須支援使用 `Ctrl + Enter` (或 Mac 上的 `Cmd + Enter`) 作為快捷鍵，在輸入框焦點內直接觸發儲存/提交動作。
- **FR-007**: 在任務列表視圖（非編輯狀態）中，對於多行任務內容應僅顯示前 3 行文字（透過 CSS `line-clamp` 實作），並提供擴展檢視或進入編輯模式的途徑。

### Key Entities

- **Todo Item**: 代表一個待辦事項。
    - **Description**: 待辦事項的內容，現支援多行純文字。

## Success Criteria *(mandatory)*

### Measurable Outcomes

- **SC-001**: 使用者可以在輸入框中至少看到 10 行文字而無需滾動。
- **SC-002**: 當內容行數達到第 11 行時，垂直滾動條必須在 100ms 內出現且可供操作。
- **SC-003**: 任務儲存後再次開啟，換行字元（Newline）應 100% 正確還原顯示。

## Assumptions

- 預設字體大小與行高將遵循專案既有的 CSS 定義。
- 原本透過 `Enter` 鍵快速提交任務的功能在該欄位中將改為「換行」，改為使用 `Ctrl + Enter` 或點擊專屬按鈕進行提交。
- 本次變更不涉及後端資料庫欄位類型的調整，預設 SQLite TEXT 類型已足夠支援長文本。
