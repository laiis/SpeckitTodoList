const db = require('../db/init');
const logger = require('../utils/logger');

/**
 * 脫逸 HTML 字元以防範 XSS (FR-004)
 */
function escapeHTML(str) {
  if (!str) return str;
  return str
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#039;');
}

const taskService = {
  /**
   * 取得使用者的所有任務 (FR-012)
   * @param {number} userId 
   */
  async getTasks(userId) {
    return db.prepare('SELECT * FROM tasks WHERE user_id = ? ORDER BY created_at DESC')
      .all(userId);
  },

  /**
   * 建立新任務 (FR-012)
   * @param {number} userId 
   * @param {string} content 
   * @param {string} status 
   */
  async createTask(userId, content, status = 'todo') {
    const sanitizedContent = escapeHTML(content);
    const result = db.prepare('INSERT INTO tasks (user_id, content, status) VALUES (?, ?, ?)')
      .run(userId, sanitizedContent, status);
    
    const newTask = {
      id: result.lastInsertRowid,
      content: sanitizedContent,
      status,
      user_id: userId
    };

    logger.info(`Task created: [ID: ${newTask.id}] by [User: ${userId}]. Content: ${sanitizedContent.substring(0, 50)}${sanitizedContent.length > 50 ? '...' : ''}`);
    return newTask;
  },

  /**
   * 更新任務內容或狀態 (FR-012)
   * @param {number} userId 
   * @param {number} taskId 
   * @param {Object} updates 
   */
  async updateTask(userId, taskId, updates) {
    const { content, status } = updates;
    const sanitizedContent = content !== undefined ? escapeHTML(content) : undefined;
    
    // 確保任務屬於該使用者 (資料隔離)
    const task = db.prepare('SELECT id FROM tasks WHERE id = ? AND user_id = ?')
      .get(taskId, userId);
    
    if (!task) {
      throw new Error('Task not found or unauthorized');
    }

    if (sanitizedContent !== undefined && status !== undefined) {
      db.prepare('UPDATE tasks SET content = ?, status = ? WHERE id = ?')
        .run(sanitizedContent, status, taskId);
    } else if (sanitizedContent !== undefined) {
      db.prepare('UPDATE tasks SET content = ? WHERE id = ?')
        .run(sanitizedContent, taskId);
    } else if (status !== undefined) {
      db.prepare('UPDATE tasks SET status = ? WHERE id = ?')
        .run(status, taskId);
    }

    const finalUpdates = { ...updates };
    if (sanitizedContent !== undefined) finalUpdates.content = sanitizedContent;

    logger.info(`Task updated: [ID: ${taskId}] by [User: ${userId}]. Updates: ${JSON.stringify(finalUpdates)}`);
    return { id: taskId, ...finalUpdates };
  },

  /**
   * 刪除任務 (FR-012)
   * @param {number} userId 
   * @param {number} taskId 
   */
  async deleteTask(userId, taskId) {
    // 確保任務屬於該使用者
    const result = db.prepare('DELETE FROM tasks WHERE id = ? AND user_id = ?')
      .run(taskId, userId);
    
    if (result.changes === 0) {
      throw new Error('Task not found or unauthorized');
    }
    
    logger.info(`Task deleted: [ID: ${taskId}] by [User: ${userId}]`);
    return { success: true };
  }
};

module.exports = taskService;
