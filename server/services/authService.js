const bcrypt = require('bcryptjs');
const logger = require('../utils/logger');
const db = require('../db/init');

const authService = {
  /**
   * 使用者登入
   * @param {string} username 
   * @param {string} password 
   * @returns {Promise<Object>} 使用者資訊
   */
  async login(username, password) {
    const user = db.prepare(`
      SELECT u.*, r.name as role 
      FROM users u 
      JOIN roles r ON u.role_id = r.id 
      WHERE u.username = ?
    `).get(username);

    if (!user) {
      logger.security(`Failed login attempt: User not found [${username}]`);
      throw new Error('Invalid username or password');
    }

    // 檢查帳號是否鎖定
    if (user.locked_until && new Date(user.locked_until) > new Date()) {
      logger.security(`Account locked: Attempt to login to locked account [${username}]`);
      throw new Error('Account is temporarily locked');
    }

    const isMatch = await bcrypt.compare(password, user.password_hash);

    if (isMatch) {
      // 登入成功，重置失敗計數
      db.prepare('UPDATE users SET failed_attempts = 0, locked_until = NULL WHERE id = ?')
        .run(user.id);
      
      logger.info(`User logged in: [${username}]`);
      
      return {
        id: user.id,
        username: user.username,
        role: user.role
      };
    } else {
      // 登入失敗，增加計數
      const newAttempts = user.failed_attempts + 1;
      let lockedUntil = null;

      if (newAttempts >= 5) {
        // 鎖定 15 分鐘
        lockedUntil = new Date(Date.now() + 15 * 60 * 1000).toISOString();
        logger.security(`Account locked: Too many failed attempts [${username}]`);
      }

      db.prepare('UPDATE users SET failed_attempts = ?, locked_until = ? WHERE id = ?')
        .run(newAttempts, lockedUntil, user.id);

      logger.security(`Failed login attempt: Wrong password [${username}] (Attempt: ${newAttempts})`);
      throw new Error('Invalid username or password');
    }
  },

  /**
   * 使用者註冊
   * @param {string} username 
   * @param {string} password 
   * @returns {Promise<Object>} 建立的使用者資訊
   */
  async register(username, password) {
    // 檢查使用者名稱是否已存在
    const existing = db.prepare('SELECT id FROM users WHERE username = ?').get(username);
    if (existing) {
      throw new Error('Username already exists');
    }

    const salt = await bcrypt.genSalt(10);
    const passwordHash = await bcrypt.hash(password, salt);
    
    // 預設角色為 viewer (ID: 3)
    const result = db.prepare('INSERT INTO users (username, password_hash, role_id) VALUES (?, ?, ?)')
      .run(username, passwordHash, 3);

    logger.security(`New user registered: [${username}]`);

    return {
      id: result.lastInsertRowid,
      username
    };
  }
};

module.exports = { authService };
