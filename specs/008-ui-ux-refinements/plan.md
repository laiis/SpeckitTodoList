# Implementation Plan: UI/UX 優化 (UI/UX Refinements)

**Branch**: `008-ui-ux-refinements` | **Date**: 2026-04-23 | **Spec**: [specs/008-ui-ux-refinements/spec.md](spec.md)

## Summary

本功能包含三項主要的 UI/UX 優化：
1. 為看板容器實作頂部橫向捲動條，方便使用者在列表頂部也能快速橫移。
2. 支援在待辦事項卡片中直接編輯起始時間與結束時間。
3. 修復篩選按鈕點擊時的自動聚焦行為，避免不必要的畫面置中位移。

## Technical Context

**Language/Version**: Javascript (ES6+) / HTML5 / CSS3
**Primary Dependencies**: N/A (Vanilla JS/HTML/CSS)
**Storage**: SQLite (後端)
**Testing**: Vitest (Unit/UI), Playwright (Integration)
**Target Platform**: Modern Web Browsers

## Constitution Check

| Principle | Status | Rationale |
|-----------|--------|-----------|
| I. 技術標準 | ✅ | 使用 Vanilla JS/HTML/CSS，符合標準。 |
| II. 安全規範 | ✅ | 日期輸入將進行後端驗證。 |
| III. 效能與品質 | ✅ | 捲動同步延遲目標 < 16ms。 |
| IV. 程式碼規範與測試 | ✅ | 需更新 `ui.test.js` 並增加新測試。 |
| V. 治理與記錄 | ✅ | 使用專案規範的 Logger。 |

## Implementation Phases

### Phase 0: Research & Preparation
- [x] 研究雙捲動條同步方案。
- [x] 確定日期編輯 UI 邏輯。
- [x] 分析篩選按鈕捲動觸發原因。

### Phase 1: Design & Contracts
- [ ] 更新資料模型文件（加入日期驗證規則）。
- [ ] 撰寫快速開始文件。
- [ ] 更新 `GEMINI.md` 內容。

### Phase 2: US1 看板頂部捲動條
- [ ] 在 `index.html` 加入 `.kanban-scroll-top` 結構。
- [ ] 在 `script.js` 實作 `ResizeObserver` 監聽寬度。
- [ ] 實作基於 `requestAnimationFrame` 的雙向捲動同步。

### Phase 3: US2 任務日期編輯
- [ ] 修改卡片編輯模式，加入日期輸入框。
- [ ] 實作前端日期驗證（紅框提示）。
- [ ] 支援空值（清除日期即刪除）。

### Phase 4: US3 篩選按鈕優化
- [ ] 在篩選按鈕點擊事件加入 `preventDefault()`。
- [ ] 驗證多種解析度下的捲動行為。

### Phase 5: Verification
- [ ] 撰寫單元測試驗證日期邏輯。
- [ ] 執行整合測試驗證捲動同步效能。

## Project Structure

### Documentation
```text
specs/008-ui-ux-refinements/
├── plan.md
├── spec.md
├── research.md
├── data-model.md
└── tasks.md
```

### Source Code
```text
index.html       # 新增頂部捲動條結構
style.css       # 捲動條樣式與佈局調整
script.js       # 捲動同步邏輯、日期編輯 UI 與事件處理
server/routes/tasks.js # 後端日期驗證（如有需要）
```

