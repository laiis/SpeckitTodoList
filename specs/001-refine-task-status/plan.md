# Implementation Plan: 細分任務狀態 (Refine Task Status)

**Branch**: `001-refine-task-statuses` | **Date**: 2026-04-20 | **Spec**: [spec.md](spec.md)
**Input**: Feature specification from `/specs/001-refine-task-status/spec.md`

## Summary
將現有的任務狀態細分為 `Todo`, `Running`, `Testing`, `Done`, `Backlog` 五種。技術上透過更新 `localStorage` 的資料結構，並在 UI 導入下拉選單 (Dropdown) 進行切換。當切換為 `Done` 時自動同步勾選狀態，且當進入 `Testing` 狀態時記錄時間。

## Technical Context

**Language/Version**: Javascript (ES6+) / HTML5 / CSS3  
**Primary Dependencies**: None (Vanilla JS)  
**Storage**: localStorage  
**Testing**: Manual / Browser Console  
**Target Platform**: Windows / Linux (Browser)  
**Project Type**: Web Frontend Application  
**Performance Goals**: UI 回應 < 200ms, 資料儲存同步 < 50ms  
**Constraints**: 玻璃擬態風格一致性, 深色模式支援  
**Scale/Scope**: 單一頁面應用程式 (SPA)

## Constitution Check

*GATE: Must pass before Phase 0 research. Re-check after Phase 1 design.*

1. **正體中文文件**: 計畫書與相關文件均以正體中文撰寫。 (PASS)
2. **技術標準**: 採用 javascript/html/css。 (PASS)
3. **治理與記錄**: 記錄 `testedAt` 時間戳記。 (PASS)
4. **程式碼規範**: 邏輯應與視圖分離（儘量封裝於函數中）。 (PASS)

## Project Structure

### Documentation (this feature)

```text
specs/001-refine-task-status/
├── plan.md              # 本文件
├── research.md          # 狀態遷移與 UI 選項研究
├── data-model.md        # 任務狀態機與資料結構定義
└── quickstart.md        # 快速測試指南
```

### Source Code (repository root)

```text
# Single project structure
index.html              # UI 結構 (下拉選單位置)
script.js               # 核心邏輯 (狀態更新與 localStorage 遷移)
style.css               # 樣式定義 (狀態標籤顏色)
```

**Structure Decision**: 延用單一專案結構，對 `script.js` 與 `style.css` 進行功能擴展。
