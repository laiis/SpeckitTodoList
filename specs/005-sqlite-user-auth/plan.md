# Implementation Plan: 使用者登入系統 (SQLite)

**Branch**: `005-sqlite-user-auth` | **Date**: 2026-04-21 | **Spec**: [specs/005-sqlite-user-auth/spec.md](specs/005-sqlite-user-auth/spec.md)
**Input**: Feature specification from `/specs/005-sqlite-user-auth/spec.md`

## Summary

本計劃旨在為 SpeckitTodoList 建立一個安全、可靠的身份驗證與權限控管系統。我們將使用 SQLite 作為後端儲存，透過 Node.js/Express 提供 API，並採用 JWT 進行會話管理，確保系統符合「多使用者網頁應用程式」的需求，並嚴格遵循 Service 層封裝的開發規範。

## Technical Context

**Language/Version**: JavaScript (ES6+ / Node.js)
**Primary Dependencies**: `express`, `better-sqlite3`, `bcryptjs`, `jsonwebtoken`
**Storage**: SQLite (with `user_id` on `Tasks` table)
**Testing**: Vitest (Unit, Integration, E2E)
**Target Platform**: Web (win32 Server)
**Performance Goals**: API Latency < 200ms
**Constraints**: 
- **Brute-force**: 5 failures = 15min lock (SQLite tracking)
- **Isolation**: Strictly filtered by `user_id`
- **Auth**: JWT (24h expiry) in Secure Cookies
**Scale/Scope**: Multitenant (Logical isolation) with RBAC

## Constitution Check

*GATE: All gates must be PASS before proceeding to task generation.*

| Gate | Status | Details |
|------|--------|---------|
| 語言與框架 | PASS | 使用 JavaScript 並透過 Node.js 運行。 |
| Service 層封裝 | PASS | Auth, User, Task 邏輯均封裝於 `server/services/`。 |
| 安全規範 (XSS) | PASS | 登入/註冊輸入與待辦內容均需過濾。 |
| 效能目標 (<200ms) | PASS | SQLite 索引確保任務存取效能。 |
| 測試覆蓋率 (80%+) | PASS | 需撰寫 AuthService 與 TaskService 單元測試。 |
| 日誌規範 (Logger) | PASS | 失敗登入與鎖定操作必須記錄至 Logger。 |

## Project Structure

### Documentation (this feature)

```text
specs/005-sqlite-user-auth/
├── plan.md              # 本文件
├── research.md          # 技術研究報告
├── data-model.md        # 資料模型定義
├── quickstart.md        # 開發快速入門
├── contracts/           # API 介面合約
└── tasks.md             # 任務分解（由 /speckit.tasks 生成）
```

### Source Code (repository root)

```text
server/
├── models/             # SQLite 實體定義
├── services/           # 身份驗證與使用者業務邏輯 (符合憲章規範)
├── routes/             # API 端點定義
├── middleware/         # 身份驗證與權限檢查中間件
├── utils/              # 包含 Logger 工具
└── db/                 # SQLite 初始化與遷移腳本

public/                 # 前端資產（包含登入/註冊 UI）
├── components/         # 共用 Layout 組件 (符合憲章規範)
├── pages/              # 登入、註冊、待辦清單頁面
└── services/           # API 客戶端服務

tests/
├── unit/               # Service 與 Model 測試
├── integration/        # API 端點集成測試
└── e2e/                # 登入/權限流程端到端測試
```

**Structure Decision**: 採用前後端分離架構，`server/` 處理 SQLite 邏輯與 API，`public/` 負責前端展示。

## Complexity Tracking

| Violation | Why Needed | Simpler Alternative Rejected Because |
|-----------|------------|-------------------------------------|
| 使用 SQLite 儲存 | 使用者明確要求將資料存放於資料庫，且為滿足多使用者安全、資料隔離 (FR-012) 與暴力破解防護 (FR-013) 之持久化需求。 | localStorage 無法安全儲存多使用者憑證，亦無法在伺服器端實作可靠的資料存取過濾與帳號鎖定。 |
