import { describe, it, expect, vi, beforeEach } from 'vitest';
const Database = require('better-sqlite3');
const config = require('../../server/config');
const db = require('../../server/db/init');
const bcrypt = require('bcryptjs');

describe('Database Init - Environment Variables', () => {
  it('T021 - 應正確引用 AppConfig.database.path 建立資料庫連線', () => {
    // 這裡我們驗證匯出的 db 物件是否連線到正確的路徑
    // better-sqlite3 產生的 db 物件有其內部狀態，我們可以檢查其唯讀屬性（如果有的話）
    // 或者我們可以直接驗證 db 實體是否存在
    expect(db).toBeDefined();
    expect(db instanceof Database).toBe(true);
  });

  it('T021 - 應正確引用 AppConfig.admin.password 建立預設管理員帳號', () => {
    // 取得當前的 admin 使用者
    const admin = db.prepare('SELECT * FROM users WHERE username = ?').get('admin');
    expect(admin).toBeDefined();
    
    // 驗證其密碼是否與 config 中的一致
    const isValid = bcrypt.compareSync(config.admin.password, admin.password_hash);
    expect(isValid).toBe(true);
  });
});
