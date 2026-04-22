// Load environment variables if this script is run directly
const path = require('path');
if (require.main === module) {
  require('dotenv').config({ path: path.resolve(__dirname, '../../.env') });
}

const Database = require('better-sqlite3');
const bcrypt = require('bcryptjs');
const fs = require('fs');
const logger = require('../utils/logger');
const config = require('../config');

const dbPath = config.database.path;
const db = new Database(dbPath);

// 啟用外鍵約束 (SC-003)
db.pragma('foreign_keys = ON');

/**
 * 初始化資料庫 Schema
 */
function initSchema() {
  // 建立 Roles 表
  db.prepare(`
    CREATE TABLE IF NOT EXISTS roles (
      id INTEGER PRIMARY KEY,
      name TEXT UNIQUE NOT NULL
    )
  `).run();

  // 建立 Users 表
  db.prepare(`
    CREATE TABLE IF NOT EXISTS users (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      username TEXT UNIQUE NOT NULL,
      password_hash TEXT NOT NULL,
      role_id INTEGER NOT NULL,
      failed_attempts INTEGER DEFAULT 0,
      locked_until DATETIME,
      created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
      FOREIGN KEY (role_id) REFERENCES roles (id)
    )
  `).run();

  // 更新 Tasks 表 (新增 user_id)
  db.prepare(`
    CREATE TABLE IF NOT EXISTS tasks (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      content TEXT NOT NULL,
      status TEXT DEFAULT 'todo',
      user_id INTEGER,
      created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
      FOREIGN KEY (user_id) REFERENCES users (id)
    )
  `).run();

  // 檢查是否需要新增 user_id 欄位 (針對現有資料庫)
  const tableInfo = db.prepare("PRAGMA table_info(tasks)").all();
  const hasUserId = tableInfo.some(col => col.name === 'user_id');
  if (!hasUserId) {
    db.prepare("ALTER TABLE tasks ADD COLUMN user_id INTEGER REFERENCES users(id)").run();
    logger.info('Added user_id column to tasks table.');
  }

  // 建立索引以優化資料隔離查詢 (SC-001)
  db.prepare(`CREATE INDEX IF NOT EXISTS idx_tasks_user_id ON tasks(user_id)`).run();
}

/**
 * 植入初始資料
 */
function seedData() {
  // 植入 Roles
  const roles = [
    { id: 1, name: 'admin' },
    { id: 2, name: 'editor' },
    { id: 3, name: 'viewer' }
  ];

  const insertRole = db.prepare('INSERT OR IGNORE INTO roles (id, name) VALUES (?, ?)');
  roles.forEach(role => insertRole.run(role.id, role.name));

  // 植入預設 Admin
  const adminUser = db.prepare('SELECT * FROM users WHERE username = ?').get('admin');
  if (!adminUser) {
    const salt = bcrypt.genSaltSync(10);
    const hash = bcrypt.hashSync(config.admin.password, salt);
    db.prepare('INSERT INTO users (username, password_hash, role_id) VALUES (?, ?, ?)')
      .run('admin', hash, 1);
    logger.info('Default admin account created (admin/admin).');
  }
}

/**
 * 重設資料庫 (測試用)
 */
function resetDB() {
  db.prepare('DROP TABLE IF EXISTS tasks').run();
  db.prepare('DROP TABLE IF EXISTS users').run();
  db.prepare('DROP TABLE IF EXISTS roles').run();
  initSchema();
  seedData();
}

try {
  initSchema();
  seedData();
  logger.info('Database initialized successfully.');
} catch (err) {
  logger.error('Database initialization failed: ' + err.message);
  process.exit(1);
}

db.resetDB = resetDB;
db.initSchema = initSchema;
db.seedData = seedData;

module.exports = db;
