const { adminService } = require('../../server/services/adminService');
const db = require('../../server/db/init');
const bcrypt = require('bcryptjs');

describe('AdminService', () => {
  let testUserId;

  beforeAll(async () => {
    // 確保測試使用者存在
    const username = 'testadmin_user';
    let user = db.prepare('SELECT id FROM users WHERE username = ?').get(username);
    
    if (!user) {
      const salt = bcrypt.genSaltSync(10);
      const hash = bcrypt.hashSync('testuser', salt);
      const result = db.prepare('INSERT INTO users (username, password_hash, role_id) VALUES (?, ?, ?)')
        .run(username, hash, 3);
      testUserId = result.lastInsertRowid;
    } else {
      testUserId = user.id;
    }
    
    if (!testUserId) {
      throw new Error('Failed to setup test user');
    }
  });

  test('getAllUsers should return all users with roles', async () => {
    const users = await adminService.getAllUsers();
    expect(Array.isArray(users)).toBe(true);
    expect(users.length).toBeGreaterThan(0);
    expect(users[0]).toHaveProperty('role');
  });

  test('unlockUser should reset failed attempts and lockout time', async () => {
    // 先模擬鎖定
    db.prepare('UPDATE users SET failed_attempts = 5, locked_until = ? WHERE id = ?')
      .run(new Date(Date.now() + 15 * 60 * 1000).toISOString(), testUserId);

    await adminService.unlockUser(testUserId);
    
    const user = db.prepare('SELECT failed_attempts, locked_until FROM users WHERE id = ?').get(testUserId);
    expect(user.failed_attempts).toBe(0);
    expect(user.locked_until).toBeNull();
  });

  test('updateUserRole should change user role', async () => {
    await adminService.updateUserRole(testUserId, 2); // 變更為 editor
    
    const user = db.prepare('SELECT role_id FROM users WHERE id = ?').get(testUserId);
    expect(user.role_id).toBe(2);
  });

  test('resetUserPassword should update password hash', async () => {
    const newPassword = 'newSecretPassword';
    await adminService.resetUserPassword(testUserId, newPassword);
    
    const user = db.prepare('SELECT password_hash FROM users WHERE id = ?').get(testUserId);
    const isMatch = await bcrypt.compare(newPassword, user.password_hash);
    expect(isMatch).toBe(true);
  });

  test('getSecurityLogs should return logs (from security.log file or DB)', async () => {
    // 這裡暫定從日誌檔案讀取
    const logs = await adminService.getSecurityLogs();
    expect(Array.isArray(logs)).toBe(true);
  });
});
