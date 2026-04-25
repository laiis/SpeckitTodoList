# Feature Specification: 後台管理頁版面優化 (Admin Dashboard Layout Refinement)

**Feature Branch**: `009-admin-layout-refinement`  
**Created**: 2026-04-25  
**Status**: Draft  
**Input**: User description: "後台管理頁的畫面， 需要將使用者資料與 log 記錄並排， 分別佔畫面 2:3 的比例. 並且畫面高度不需要固定且需要增加全域的垂宜與橫向 scrollbar，讓使用者可以依畫面大小來移動資訊欄位"

## User Scenarios & Testing *(mandatory)*

### User Story 1 - 側邊並排視圖 (Priority: P1)

管理員在進入後台管理頁面時，可以同時看到「使用者管理」與「系統日誌」，兩者以 2:3 的寬度比例並排顯示。

**Why this priority**: 這是使用者的核心需求，提升資訊的可視性與對照效率。

**Independent Test**: 可以透過檢查管理頁面的 DOM 結構與 CSS 屬性（如 Flexbox 或 Grid）來驗證寬度比例是否為 2:3。

**Acceptance Scenarios**:

1. **Given** 管理員已登入並進入後台頁面, **When** 頁面載入完成, **Then** 「使用者管理」佔據較窄的左側（約 40%），「系統日誌」佔據較寬的右側（約 60%）。

---

### User Story 2 - 全域滾動與彈性高度 (Priority: P2)

頁面內容不再受限於固定的螢幕高度，並提供全域的垂直與橫向滾動條。

**Why this priority**: 確保在資料量大或螢幕較小時，使用者仍能完整存取所有資訊。

**Independent Test**: 縮放瀏覽器視窗大小，驗證是否出現全域滾動條，且內容能隨資料量增加而垂直延伸。

**Acceptance Scenarios**:

1. **Given** 系統日誌包含大量資料, **When** 頁面高度超過視窗高度, **Then** 出現全域垂直滾動條，且頁面可向下捲動。
2. **Given** 瀏覽器視窗寬度窄於內容寬度, **When** 內容超出視窗, **Then** 出現全域橫向滾動條，讓使用者可以橫向移動查看被遮蓋的欄位。

---

### Edge Cases

- **極小螢幕解析度**: 在行動裝置或極窄視窗下，並排比例是否應維持或轉為垂直堆疊（預設維持並排並依賴橫向滾動）。
- **資料量極少**: 當使用者或日誌資料很少時，頁面應維持美觀，不應出現不必要的空白或佈局塌陷。

## Requirements *(mandatory)*

### Functional Requirements

- **FR-001**: 系統必須將「使用者管理」與「系統日誌」區塊改為水平並排顯示。
- **FR-002**: 「使用者管理」與「系統日誌」的寬度比例必須精確設定為 2:3。
- **FR-003**: 後台頁面必須移除任何強制性的固定高度限制，允許頁面依內容高度延伸。
- **FR-004**: 系統必須在 body 或主容器層級啟用垂直 (overflow-y: auto) 與橫向 (overflow-x: auto) 滾動條。
- **FR-005**: 佈局必須設定最小總寬度（建議 1200px），確保在寬度不足時，使用者可透過橫向捲軸查看完整的 2:3 欄位內容，而非強制壓縮內容。
- **FR-006**: 頁首（Header）必須實作 Scrolling but sticky 行為，確保在長頁面捲動時仍能視需求存取導覽按鈕。

### Key Entities *(include if feature involves data)*

- **Admin Wrapper**: 最外層容器，負責維持最小總寬度並管理全域橫向捲軸。
- **Admin Layout**: 代表後台管理頁面的容器結構。
- **User Section**: 顯示使用者清單的區塊（佔比 2）。
- **Log Section**: 顯示系統日誌的區塊（佔比 3）。

## Success Criteria *(mandatory)*

### Measurable Outcomes

- **SC-001**: 在桌上型電腦顯示器（1920x1080）上，使用者與日誌區塊的寬度誤差小於 1%。
- **SC-002**: 使用者可以流暢地進行橫向與垂直滾動，無任何佈局跑版。
- **SC-003**: 頁面在載入 100 筆以上日誌時，全頁垂直捲動流暢且效能穩定。

## Assumptions

- 假設目前的 `admin-container` 的 `max-width: 1000px` 限制可能需要移除或擴大，以支援更寬的並排佈局。
- 假設使用者偏好在小螢幕上使用滾動條而非自動轉為垂直佈局（基於「讓使用者可以依畫面大小來移動資訊欄位」的需求描述）。
- 既有的背景特效（Blobs）與 Glassmorphism 風格應維持不變。
��可以依畫面大小來移動資訊欄位」的需求描述）。
- 既有的背景特效（Blobs）與 Glassmorphism 風格應維持不變。
