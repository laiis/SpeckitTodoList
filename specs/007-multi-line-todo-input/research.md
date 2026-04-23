# Research: 多行待辦事項輸入 (Multi-line Todo Input)

本研究旨在釐清實作多行輸入框與內容縮略時的技術細節與最佳實踐。

## 1. 樣式控制：固定 10 行高度 (Fixed 10-line Height)

- **Decision**: 使用 `min-height` 或 `height` 搭配 `lh` (line-height) 單位或 `em` 單位。
- **Rationale**: 
    - 直接在 CSS 中設定 `height: calc(10 * 1.5em);` (假設行高為 1.5) 能確保一致性。
    - 也可以使用 `<textarea rows="10">` 配合 CSS `resize: none;` 來鎖定高度。
- **Alternatives**: 
    - 使用像素 (px) 設定高度：不建議，因為字體大小變動時會失效。

## 2. 內容縮略：列表視圖顯示 (List Truncation)

- **Decision**: 使用 CSS `line-clamp` 屬性。
- **Rationale**: 
    - `display: -webkit-box; -webkit-line-clamp: 3; -webkit-box-orient: vertical; overflow: hidden;` 是目前現代瀏覽器實作多行文字縮略的最佳方式。
    - 能自動在第 3 行末尾顯示「...」。
- **Alternatives**: 
    - JS 字串切片：無法精確對應視覺上的行數，且難以處理中英文混排。

## 3. 鍵盤互動：Ctrl + Enter 提交 (Keyboard Interaction)

- **Decision**: 在 `keydown` 事件中監聽 `(event.ctrlKey || event.metaKey) && event.key === 'Enter'`。
- **Rationale**: 
    - `metaKey` 確保 Mac 使用者可以使用 `Cmd + Enter` 觸發。
    - 這是處理富文本或多行輸入時的標準 UX 模式。

## 4. 安全性：防範 XSS (XSS Prevention)

- **Decision**: 使用 `textContent` 或在渲染前進行 HTML 脫逸。
- **Rationale**: 
    - 多行內容包含換行符 `\n`，若直接放入 `innerText` 或 `textContent` 則換行符可能失效（除非配合 `white-space: pre-wrap`）。
    - 較安全的作法是將內容存為純文字，顯示時使用 CSS `white-space: pre-line;` 或透過 JS 將 `\n` 轉換為 `<br>` (並先脫逸原始文字)。

## 結論 (Summary)

- 前端：`<textarea>` + `rows="10"` + `resize: none;`。
- 列表：CSS `line-clamp: 3`。
- 事件：`keydown` 監聽 `Ctrl/Cmd + Enter`。
- 安全：顯示時使用 `white-space: pre-wrap;` 以保留換行並防止 XSS。
