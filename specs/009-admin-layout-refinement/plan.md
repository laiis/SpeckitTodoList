# Implementation Plan: 後台管理頁版面優化 (Admin Dashboard Layout Refinement)

**Branch**: `009-admin-layout-refinement` | **Date**: 2026-04-25 | **Spec**: [specs/009-admin-layout-refinement/spec.md](spec.md)
**Input**: Feature specification from `/specs/009-admin-layout-refinement/spec.md`

## Summary

優化後台管理頁面的版面配置，將「使用者管理」與「系統日誌」以 2:3 的比例水平並排顯示。技術上將採用 Flexbox 佈局，並設定容器最小寬度為 1200px 以確保資訊可讀性並在視窗縮小時觸發全域橫向捲軸。同時實作「隨頁面捲動但具固定效果 (Scrolling but sticky)」的頁首，提升導覽便利性。

## Technical Context

**Language/Version**: HTML5, CSS3, JavaScript (ESM)
**Primary Dependencies**: Vanilla JS/CSS (現有系統架構)
**Storage**: N/A (純前端佈局優化)
**Testing**: Vitest / UI unit tests
**Target Platform**: 現代網頁瀏覽器 (Chrome, Firefox, Safari, Edge)
**Project Type**: Web application (Frontend)
**Performance Goals**: 介面渲染流暢，全頁捲動不延遲 (符合憲法 < 200ms latency)
**Constraints**: 精確 2:3 寬度比例, 全域橫向與垂直捲軸, 最小寬度 1200px
**Scale/Scope**: 僅限於 `public/pages/admin.html` 及其相關 CSS 樣式

## Constitution Check

*GATE: Must pass before Phase 0 research. Re-check after Phase 1 design.*

- [x] **文件語系**: 規格與計劃均使用正體中文。
- [x] **技術標準**: 採用 javascript / html / css 核心技術。
- [x] **視覺一致性**: 維持現有的 Glassmorphism 與背景 Blob 風格。
- [x] **開發工作流**: 遵循 TDD 模式，將增加對應的 UI 測試案例。
- [x] **效能要求**: 確保佈局變更不會導致重繪效能問題。

## Project Structure

### Documentation (this feature)

```text
specs/009-admin-layout-refinement/
├── plan.md              # 本計劃文件
├── research.md          # Phase 0: 佈局實作技術研究 (Flexbox vs Grid, Sticky behavior)
├── data-model.md        # Phase 1: 介面組件結構定義
├── quickstart.md        # Phase 1: 開發環境啟動與測試說明
├── contracts/           # N/A (無外部介面變更)
└── tasks.md             # Phase 2: 任務分解 (待生成)
```

### Source Code (repository root)

```text
public/
└── pages/
    └── admin.html      # 主要修改檔案：調整 DOM 結構與內嵌樣式

style.css               # 可能修改檔案：調整通用 admin-page 樣式

tests/
└── unit/
    └── ui-refinements.test.js  # 增加 UI 佈局驗證測試
```

**Structure Decision**: 採用單一專案結構 (Single project)，直接修改 `public/pages/admin.html` 並在 `tests/unit/` 增加測試。

## Complexity Tracking

| Violation | Why Needed | Simpler Alternative Rejected Because |
|-----------|------------|-------------------------------------|
| 無 | N/A | N/A |
