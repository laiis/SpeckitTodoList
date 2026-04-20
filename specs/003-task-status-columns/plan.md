# Implementation Plan: 看板模式 (Task Status Columns)

**Branch**: `003-task-status-columns` | **Date**: 2026-04-21 | **Spec**: [specs/003-task-status-columns/spec.md](specs/003-task-status-columns/spec.md)
**Input**: Feature specification from `/specs/003-task-status-columns/spec.md`

## Summary

將 Todo List 任務清單重構為多欄式看板佈局 (Kanban Layout)，支援 5 種狀態（需求池、待辦、進行中、測試中、已完成）。系統將根據篩選模式顯示不同數量的欄位（待完成顯示 5 欄、全部顯示 5 欄、已完成顯示 1 欄）。技術實作包含支援橫向捲動、欄位獨立垂直捲動、行動端自動切換為標籤模式 (Tabs)，以及欄位底部的快速新增功能。所有邏輯將遵循 Service 層封裝與 TDD 開發模式。

## Technical Context

**Language/Version**: Javascript (ES6+)
**Primary Dependencies**: None (Vanilla JS/HTML/CSS)
**Storage**: localStorage
**Testing**: Vitest
**Swagger**: 不適用 (N/A，本功能為純前端 localStorage 應用)
**Target Platform**: Web (Modern Browsers)
**Project Type**: Web Application
**Performance Goals**: UI 切換與欄位載入延遲 < 200ms (SC-001)
**Constraints**: 支援深色模式與玻璃擬態；業務邏輯需封裝於 Service 層 (FR-007)；窄螢幕 (<768px) 需自動適配標籤模式
**Scale/Scope**: 5 個狀態欄位，支援彈性寬度與獨立捲動

## Constitution Check

*GATE: Passed after Phase 1 design.*

- [x] **文件語言**: 所有文件與註解必須使用正體中文 (技術名詞以台灣常用詞為主)。
- [x] **架構規範**: 業務邏輯必須封裝於 PageModel 或 Service 層，嚴禁在視圖直接編寫邏輯。
- [x] **效能指標**: UI 切換與呈現延遲必須低於 200 毫秒 (SC-001)。
- [x] **品質保證**: 單元測試覆蓋率必須達到 80% 以上 (SC-004)。
- [x] **治理與日誌**: 關鍵操作必須記錄日誌，嚴禁使用 `console.log` (FR-007)。
- [x] **視覺一致性**: 必須維持玻璃擬態 (Glassmorphism) 並完美支援深色模式。

## Project Structure

### Documentation (this feature)

```text
specs/003-task-status-columns/
├── plan.md              # This file (/speckit.plan command output)
├── research.md          # Phase 0 output (/speckit.plan command)
├── data-model.md        # Phase 1 output (/speckit.plan command)
├── quickstart.md        # Phase 1 output (/speckit.plan command)
├── checklists/          # Requirements checklists
│   └── requirements.md
└── tasks.md             # Phase 2 output (/speckit.tasks command)
```

### Source Code (repository root)

```text
# Single project structure
index.html               # 更新看板佈局 HTML 結構
style.css                # 實作多欄佈局、捲動條與行動端樣式
script.js                # 重構為 Service 層並實作看板渲染邏輯
todo.test.js             # 撰寫 TDD 單元測試

tests/
└── unit/                # 現有測試位於根目錄，後續視需求重整
```

**Structure Decision**: 採用 Single Project 結構，延用根目錄現有檔案進行增量重構與邏輯分離。

## Complexity Tracking

> **Fill ONLY if Constitution Check has violations that must be justified**

| Violation | Why Needed | Simpler Alternative Rejected Because |
|-----------|------------|-------------------------------------|
| 無 | N/A | N/A |
