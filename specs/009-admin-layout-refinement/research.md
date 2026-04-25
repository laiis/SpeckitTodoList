# Research: Admin Dashboard Layout Refinement

## Decision: Flexbox for Side-by-Side Layout
**Decision**: 採用 Flexbox (display: flex) 實作並排佈局。
**Rationale**: 
- 對於單純的左右並排比例 (2:3)，Flexbox 的 `flex` 屬性 (`flex: 2` 與 `flex: 3`) 提供最直覺且精確的分配。
- 較易處理內容高度不等時的對齊問題。
**Alternatives considered**: 
- CSS Grid: 雖可透過 `grid-template-columns: 2fr 3fr` 達成，但對於此簡單案例，Flexbox 的語法更為簡潔且在舊版瀏覽器相容性極佳。

## Decision: CSS position: sticky for Header
**Decision**: 使用 `position: sticky; top: 0; z-index: 1000;` 實作頁首。
**Rationale**: 
- 規格要求 "Scrolling but sticky header"。`position: sticky` 在元素到達頂部前會隨頁面捲動，到達頂部後則固定。
- 配合 `background: rgba(...)` (Glassmorphism) 可以達到優雅的視覺效果。
**Alternatives considered**: 
- JavaScript scroll event: 雖然可以實作更複雜的「回捲才出現」行為，但基於簡單性與效能，優先使用純 CSS 解決方案。

## Decision: Wrapper for Global Scrollbars
**Decision**: 在 `body` 下層增加一個 `admin-wrapper` 容器，並設定 `min-width: 1200px` 與 `overflow-x: auto`。
**Rationale**: 
- 若直接在 `body` 設定 `min-width`，某些瀏覽器的捲軸行為可能不一致。
- 透過 wrapper 可以更精確控制內容邊距 (padding) 與背景 (blobs) 的相對位置。
**Alternatives considered**: 
- 直接在 `admin-container` 設定 `min-width`: 可能導致 header 也被捲走，不符合 sticky header 需相對於視窗的需求。因此需要將 header 與 content 放在正確的層級關係中。
