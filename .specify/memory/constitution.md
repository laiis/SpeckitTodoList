<!--
  Sync Impact Report:
  - Version change: [INITIAL] → 1.0.0
  - List of modified principles: (Initial adoption of principles based on user input)
  - Added sections: 技術與合規 (Technology & Compliance), 開發工作流 (Development Workflow)
  - Templates requiring updates:
    - .specify/templates/plan-template.md: ✅ updated (gates align with principles)
    - .specify/templates/spec-template.md: ✅ updated (aligns)
    - .specify/templates/tasks-template.md: ✅ updated (aligns with TDD requirement)
  - Follow-up TODOs: None.
-->

# SpeckitTodoList Constitution

## Core Principles

### 文件
文件始終保持正體中文撰寫。技術名詞以台灣常用詞為主。

### I. 技術標準 (Technical Standards)
本專案採用 javascript / html / css 作為核心框架。資料存取應優先封裝於 Service 層。對於單機簡單應用，優先使用 localStorage；對於多使用者、具備安全隔離需求或複雜資料關係之功能，應採用伺服器端資料庫（如 SQLite）進行持久化儲存。 Rationale: 確保技術組合的一致性，並根據應用場景提供合適的安全性與資料完整性保障。

### II. 安全規範 (Security & Authentication)
安全性是系統的基石。所有使用者輸入必須進行適當的脫逸處理以防範 XSS 攻擊。資料儲存應確保結構完整性。 Rationale: 保護使用者資料安全，並符合瀏覽器端的安全標準。

### III. 效能與品質 (Performance & Quality)
API 的回應時間 (Latency) 必須維持在 200ms 以內。前端開發應優先使用共用的 Layout 組件，以確保視覺一致性並提高開發效率。 Rationale: 提供流暢的使用者體驗，並降低前端維護成本。

### IV. 程式碼規範與測試 (Coding Standards & Testing)
開發應嚴格遵循 javascript / html /css 編碼慣例。所有業務邏輯必須封裝於 PageModel 或 Service 層，嚴禁在控制器或視圖中直接編寫邏輯。單元測試覆蓋率必須達到 80% 以上。 Rationale: 提高程式碼的可讀性與可維護性，並透過高測試覆蓋率確保系統穩定。

### V. 治理與記錄 (Governance & Logging)
統一使用 Logger 工具物件進行日誌記錄，嚴禁使用 console.log。日誌應包含時間戳記與操作類別。對於所有敏感操作（如刪除、狀態變更），必須詳細記錄操作內容。 Rationale: 確保在發生問題時提供可靠的追蹤依據，並符合專案治理規範。

## 技術與合規 (Technology & Compliance)
專案核心技術棧為 javascript / html / css。所有開發活動應符合基本的瀏覽器安全標準與資料儲存規範。

## 開發工作流 (Development Workflow)
採用 TDD 開發模式。每次提交前應執行單元測試。業務邏輯應與呈現層分離。

## Governance
本憲法優於所有其他開發實務。任何對本憲法的修改均需經過正式提案、影響評估與審核。所有 PR 必須經過測試覆蓋率檢查與日誌規範校閱方可合併。

**Version**: 1.0.0 | **Ratified**: 2026-04-20 | **Last Amended**: 2026-04-20
