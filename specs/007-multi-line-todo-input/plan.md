# Implementation Plan: 多行待辦事項輸入 (Multi-line Todo Input)

**Branch**: `007-input-type-text` | **Date**: 2026-04-22 | **Spec**: [specs/007-multi-line-todo-input/spec.md](spec.md)
**Input**: Feature specification from `/specs/007-multi-line-todo-input/spec.md`

## Summary

本功能旨在提升使用者輸入長篇待辦事項描述的體驗。核心技術方案是將原本的單行 `<input type="text">` 替換為多行 `<textarea>`，並透過 CSS 設定固定 10 行高度與垂直滾動條。此外，將實作 `Ctrl + Enter` 鍵盤快捷鍵以支援快速提交，並在任務列表視圖中使用 CSS `line-clamp` 技術實作內容縮略，確保介面整潔。

## Technical Context

**Language/Version**: Javascript (ES6+) / HTML5 / CSS3  
**Primary Dependencies**: N/A (Vanilla JS/HTML/CSS)  
**Storage**: SQLite (後端) / 既有 TaskService  
**Testing**: Vitest  
**Target Platform**: Modern Web Browsers
**Project Type**: Web Application  
**Performance Goals**: UI 切換延遲 < 100ms  
**Constraints**: 固定 10 行高度顯示，超過則顯示滾動條  
**Scale/Scope**: 適用於所有待辦事項的描述輸入

## Constitution Check

*GATE: Must pass before Phase 0 research. Re-check after Phase 1 design.*

- [x] **技術標準**: 使用 vanilla JS/HTML/CSS，符合專案標準。
- [x] **安全規範**: 確保 textarea 輸入內容在渲染回 HTML 時經過 XSS 脫逸。
- [x] **效認與品質**: 前端渲染邏輯應保持輕量。
- [x] **程式碼規範與測試**: TDD 模式開發，單元測試覆蓋率目標 80% 以上。
- [x] **治理與記錄**: 狀態變更（如儲存多行任務）應使用 Logger 記錄。

## Project Structure

### Documentation (this feature)

```text
specs/007-multi-line-todo-input/
├── plan.md              # This file
├── research.md          # Phase 0 output
├── data-model.md        # Phase 1 output
├── quickstart.md        # Phase 1 output
├── checklists/
│   └── requirements.md
└── spec.md
```

### Source Code (repository root)

```text
public/
├── index.html           # 結構變更 (input -> textarea)
└── style.css            # 樣式定義 (固定高度, 滾動條, line-clamp)

server/
└── services/
    └── taskService.js   # 確認資料儲存邏輯相容換行符

tests/
├── unit/                # 測試 Ctrl+Enter 與縮略邏輯
└── integration/         # 測試端到端儲存與讀取
```

**Structure Decision**: 採用 Single Project 結構，直接修改現有前端檔案並補強測試。

## Implementation Phases

1. **Phase 1-2**: 環境準備與基礎測試架構建置。
2. **Phase 3 (US1)**: 替換輸入框為 textarea，確保換行符正確儲存與顯示。
3. **Phase 4 (US2)**: 設定固定 10 行高度與垂直滾動條。
4. **Phase 5 (US3)**: 實作 Ctrl+Enter 提交與列表 3 行縮略顯示。
5. **Phase 6**: 最終驗證與效能檢查。
6. **Phase 7**: 修正 `.container.glass` 佈局高度問題，確保 UI 完整性。
7. **Phase 8 (US4)**: 整合佈局至 `.main-content-scroller`，實作固定 Header/Footer 且內容區域可滾動。

## Technical Details (US4)
- **Container Strategy**: 使用 Flexbox 佈局，Header 與 Footer 固定，中間區塊 `flex: 1; overflow-y: auto;`。
- **Height Calculation**: `.main-content-scroller` 的高度應為父容器剩餘空間，確保其不會超出 `.container.glass`。

## Complexity Tracking

*No violations detected.*
