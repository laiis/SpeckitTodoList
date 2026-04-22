const db = require('../db/init');
const bcrypt = require('bcryptjs');
const fs = require('fs');
const path = require('path');
const logger = require('../utils/logger');

const adminService = {
  /**
   * 獲取所有使用者資訊 (FR-011)
   */
  async getAllUsers() {
    return db.prepare(`
      SELECT u.id, u.username, u.role_id, r.name as role, u.failed_attempts, u.locked_until, u.created_at
      FROM users u
      JOIN roles r ON u.role_id = r.id
    `).all();
  },

  /**
   * 手動解鎖使用者 (FR-011)
   */
  async unlockUser(userId) {
    db.prepare('UPDATE users SET failed_attempts = 0, locked_until = NULL WHERE id = ?')
      .run(userId);
    logger.info(`Admin manually unlocked user ID: ${userId}`);
  },

  /**
   * 變更使用者角色 (FR-011)
   */
  async updateUserRole(userId, roleId) {
    db.prepare('UPDATE users SET role_id = ? WHERE id = ?')
      .run(roleId, userId);
    logger.info(`Admin updated user ID: ${userId} to role ID: ${roleId}`);
  },

  /**
   * 手動重設使用者密碼 (FR-011)
   */
  async resetUserPassword(userId, newPassword) {
    const salt = await bcrypt.genSalt(10);
    const hash = await bcrypt.hash(newPassword, salt);
    db.prepare('UPDATE users SET password_hash = ? WHERE id = ?')
      .run(hash, userId);
    logger.info(`Admin reset password for user ID: ${userId}`);
  },

  /**
   * 獲取系統安全日誌 (SC-002)
   */
  async getSecurityLogs() {
    const logPath = path.resolve(__dirname, '../../logs/security.log');
    if (!fs.existsSync(logPath)) {
      return [];
    }
    
    try {
      const content = fs.readFileSync(logPath, 'utf8');
      const lines = content.split('\n').filter(line => line.trim() !== '');
      
      // 實作自動清理邏輯: 保留最近 10,000 筆 (FR-011)
      if (lines.length > 10000) {
        const keptLines = lines.slice(-10000);
        fs.writeFileSync(logPath, keptLines.join('\n') + '\n', 'utf8');
        logger.info(`Retention Policy: Cleaned security.log to 10,000 lines`);
        return keptLines.reverse().map(this._parseLogLine);
      }
      
      return lines.reverse().map(this._parseLogLine);
    } catch (err) {
      logger.error('Failed to read security logs: ' + err.message);
      return [];
    }
  },

  /**
   * 輔助函式：解析單行日誌格式 [timestamp] [level] message
   */
  _parseLogLine(line) {
    const match = line.match(/^\[([^\]]+)\] \[([^\]]+)\] (.*)$/);
    if (match) {
      return {
        timestamp: match[1],
        level: match[2],
        message: match[3]
      };
    }
    return { message: line };
  }
};

module.exports = { adminService };
