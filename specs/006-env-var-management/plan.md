# Implementation Plan: 環境變數管理 (Environment Variable Management)

**Branch**: `006-env-var-management` | **Date**: 2026-04-22 | **Spec**: [specs/006-env-var-management/spec.md](spec.md)
**Input**: Feature specification from `/specs/006-env-var-management/spec.md`

## Summary

主要需求是將機敏資料（如 JWT 密鑰、資料庫路徑、管理員密碼）從硬編碼遷移至環境變數管理。技術方案包含安裝 `dotenv` 與 `cross-env`，建立統一的設定層 `server/config/index.js`，重構現有程式碼引用設定層，並使用 `BFG Repo-Cleaner` 或 `git-filter-repo` 清理 Git 歷史紀錄。

## Technical Context

**Language/Version**: Node.js (ES6+)  
**Primary Dependencies**: `dotenv`, `cross-env`, `express`, `jsonwebtoken`, `better-sqlite3`, `bcryptjs`  
**Storage**: SQLite  
**Testing**: Vitest  
**Target Platform**: Node.js Server
**Project Type**: Web Service (Backend + Frontend)  
**Performance Goals**: API 回應時間 < 200ms (憲法規範)  
**Constraints**: 僅支援單一 .env 檔案、不支援動態重載、生產環境強制要求機敏變數。  
**Scale/Scope**: 涉及 5 個層面的調整，包括基礎設施、進入點、配置層、程式碼邏輯與測試環境。

## Constitution Check

*GATE: Must pass before Phase 0 research. Re-check after Phase 1 design.*

- [x] **文件語系**: 始終使用正體中文與台灣慣用詞。
- [x] **架構原則**: 資料存取與邏輯封裝於 Service/Config 層。
- [x] **安全性**: 透過環境變數隔離機敏資料，並清理歷史紀錄防止洩漏。
- [x] **日誌規範**: 統一使用 Logger，嚴禁記錄機敏資料數值。
- [x] **開發模式**: 遵循 TDD (於任務階段執行)。

## Project Structure

### Documentation (this feature)

```text
specs/006-env-var-management/
├── plan.md              # This file (/speckit.plan command output)
├── research.md          # Phase 0 output (/speckit.plan command)
├── data-model.md        # Phase 1 output (/speckit.plan command)
├── quickstart.md        # Phase 1 output (/speckit.plan command)
├── tasks.md             # Phase 2 output (/speckit.tasks command)
└── checklists/
    └── requirements.md  # Specification quality check
```

### Source Code (repository root)

```text
server/
├── app.js               # 入口點：載入 dotenv
├── config/
│   └── index.js         # 統一配置層 (New)
├── db/
│   └── init.js          # 修改：讀取環境變數密碼與路徑
└── services/
    └── tokenService.js  # 修改：讀取環境變數 JWT_SECRET

.env.example             # 環境變數範例檔 (New)
.gitignore               # 修改：排除 .env
package.json             # 修改：加入 cross-env 腳本
```

**Structure Decision**: 採用單一專案結構 (Single Project)，將配置邏輯集中於 `server/config/`，以符合專案既有的目錄慣例。

## Complexity Tracking

> **Fill ONLY if Constitution Check has violations that must be justified**

| Violation | Why Needed | Simpler Alternative Rejected Because |
|-----------|------------|-------------------------------------|
| 無 | N/A | N/A |
