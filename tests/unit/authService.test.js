import { describe, it, expect, beforeEach, beforeAll, vi } from 'vitest';
import bcrypt from 'bcryptjs';

// 使用 require 確保與服務層共用同一個 db 實例
const db = require('../../server/db/init');
const { authService } = require('../../server/services/authService');

// Mock db and bcrypt if necessary, or use a test database
// For simplicity, we'll assume authService uses the actual db/init but we could wrap it.

describe('AuthService - Login', () => {
  beforeAll(() => {
    console.log('[DEBUG AUTH TEST] DB Instance ID:', db.instanceId);
    db.resetDB();
  });

  beforeEach(() => {
    // Reset test data if needed
    db.prepare('DELETE FROM users WHERE username = ?').run('testuser');
    const hashedPassword = bcrypt.hashSync('password123', 10);
    db.prepare('INSERT INTO users (username, password_hash, role_id) VALUES (?, ?, ?)')
      .run('testuser', hashedPassword, 3); // 3: viewer

    const roles = db.prepare('SELECT * FROM roles').all();
    const users = db.prepare('SELECT * FROM users WHERE username = ?').all('testuser');
    console.log('[DEBUG AUTH TEST] Roles:', roles);
    console.log('[DEBUG AUTH TEST] Users:', users);
  });

  it('應能成功登入並返回使用者資訊', async () => {
    const result = await authService.login('testuser', 'password123');
    expect(result).toBeDefined();
    expect(result.username).toBe('testuser');
    expect(result.role).toBe('viewer');
  });

  it('密碼錯誤時應拋出錯誤', async () => {
    await expect(authService.login('testuser', 'wrongpassword'))
      .rejects.toThrow('Invalid username or password');
  });

  it('帳號不存在時應拋出錯誤', async () => {
    await expect(authService.login('nonexistent', 'password123'))
      .rejects.toThrow('Invalid username or password');
  });

  it('連續登入失敗 5 次後應鎖定帳號', async () => {
    // 模擬 5 次失敗
    for (let i = 0; i < 5; i++) {
      try { await authService.login('testuser', 'wrong'); } catch (e) {}
    }

    await expect(authService.login('testuser', 'password123'))
      .rejects.toThrow('Account is temporarily locked');
  });
});

describe('AuthService - Register', () => {
  beforeEach(() => {
    db.prepare('DELETE FROM users WHERE username = ?').run('newuser');
  });

  it('應能成功註冊新使用者且預設角色為 viewer', async () => {
    const result = await authService.register('newuser', 'securePassword123');
    expect(result).toBeDefined();
    expect(result.username).toBe('newuser');
    
    // 驗證資料庫中的角色
    const user = db.prepare('SELECT role_id FROM users WHERE username = ?').get('newuser');
    expect(user.role_id).toBe(3); // 3: viewer
  });

  it('註冊已存在的使用者名稱時應拋出錯誤', async () => {
    await authService.register('newuser', 'securePassword123');
    await expect(authService.register('newuser', 'anotherPassword'))
      .rejects.toThrow('Username already exists');
  });
});
