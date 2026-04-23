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
   * 取得使用者的所有任務 (FR-012, FR-010)
   * @param {number} userId 
   */
  async getTasks(userId) {
    // 按 priority 昇冪 (1 高 > 2 中 > 3 低) 及 created_at 降冪 (新 > 舊) 排序 (FR-010)
    return db.prepare('SELECT * FROM tasks WHERE user_id = ? ORDER BY priority ASC, created_at DESC')
      .all(userId);
  },

  /**
   * 建立新任務 (FR-012, FR-009, FR-011, US8)
   * @param {number} userId 
   * @param {string} content 
   * @param {string} status 
   * @param {number} priority 
   * @param {string} dueDate
   * @param {string} startDate
   */
  async createTask(userId, content, status = 'todo', priority = 2, dueDate = null, startDate = null) {
    const sanitizedContent = escapeHTML(content);
    const result = db.prepare('INSERT INTO tasks (user_id, content, status, priority, due_date, start_date) VALUES (?, ?, ?, ?, ?, ?)')
      .run(userId, sanitizedContent, status, priority, dueDate, startDate);
    
    const newTask = {
      id: result.lastInsertRowid,
      content: sanitizedContent,
      status,
      user_id: userId,
      priority,
      due_date: dueDate,
      start_date: startDate
    };

    logger.info(`Task created: [ID: ${newTask.id}] by [User: ${userId}]. Priority: ${priority}. Start: ${startDate}. Due: ${dueDate}. Content: ${sanitizedContent.substring(0, 50)}${sanitizedContent.length > 50 ? '...' : ''}`);
    return newTask;
  },

  /**
   * 更新任務內容或狀態 (FR-012, FR-009, FR-011, US8)
   * @param {number} userId 
   * @param {number} taskId 
   * @param {Object} updates 
   */
  async updateTask(userId, taskId, updates) {
    const { content, status, priority, due_date, start_date } = updates;
    const sanitizedContent = content !== undefined ? escapeHTML(content) : undefined;
    
    // 確保任務屬於該使用者 (資料隔離)
    const task = db.prepare('SELECT id FROM tasks WHERE id = ? AND user_id = ?')
      .get(taskId, userId);
    
    if (!task) {
      throw new Error('Task not found or unauthorized');
    }

    let query = 'UPDATE tasks SET ';
    const params = [];
    const updateClauses = [];

    if (sanitizedContent !== undefined) {
      updateClauses.push('content = ?');
      params.push(sanitizedContent);
    }
    if (status !== undefined) {
      updateClauses.push('status = ?');
      params.push(status);
    }
    if (priority !== undefined) {
      updateClauses.push('priority = ?');
      params.push(priority);
    }
    if (due_date !== undefined) {
      updateClauses.push('due_date = ?');
      params.push(due_date);
    }
    if (start_date !== undefined) {
      updateClauses.push('start_date = ?');
      params.push(start_date);
    }

    if (updateClauses.length > 0) {
      query += updateClauses.join(', ') + ' WHERE id = ?';
      params.push(taskId);
      db.prepare(query).run(...params);
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
