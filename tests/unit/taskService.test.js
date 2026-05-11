import { describe, it, expect, beforeEach, beforeAll } from 'vitest';

// 使用記憶體資料庫以避免測試衝突
process.env.DB_PATH = ':memory:';

// 使用 require 確保在設定環境變數後才載入資料庫
const db = require('../../server/db/init');
const taskService = require('../../server/services/taskService');

describe('TaskService - Data Isolation', () => {
  const USER_A = 100;
  const USER_B = 200;

  beforeAll(() => {
    db.resetDB();
  });

  beforeEach(() => {
    db.prepare('DELETE FROM tasks').run();
    db.prepare('DELETE FROM users WHERE id IN (?, ?)').run(USER_A, USER_B);
    
    // 建立測試使用者 (簡化處理，不透過 authService)
    db.prepare('INSERT INTO users (id, username, password_hash, role_id) VALUES (?, ?, ?, ?)')
      .run(USER_A, 'userA', 'hash', 3);
    db.prepare('INSERT INTO users (id, username, password_hash, role_id) VALUES (?, ?, ?, ?)')
      .run(USER_B, 'userB', 'hash', 3);

    // DEBUG: 驗證資料
    const roles = db.prepare('SELECT * FROM roles').all();
    const users = db.prepare('SELECT id, username, role_id FROM users').all();
    console.log('[DEBUG] Roles:', roles);
    console.log('[DEBUG] Users:', users);
  });

  it('使用者應僅能取得自己的任務', async () => {
    await taskService.createTask(USER_A, 'Task for A');
    await taskService.createTask(USER_B, 'Task for B');

    const tasksA = await taskService.getTasks(USER_A);
    expect(tasksA).toHaveLength(1);
    expect(tasksA[0].content).toBe('Task for A');

    const tasksB = await taskService.getTasks(USER_B);
    expect(tasksB).toHaveLength(1);
    expect(tasksB[0].content).toBe('Task for B');
  });

  it('使用者不應能更新他人的任務', async () => {
    const taskA = await taskService.createTask(USER_A, 'Original A');
    
    await expect(taskService.updateTask(USER_B, taskA.id, { content: 'Hacked' }))
      .rejects.toThrow('Task not found or unauthorized');
    
    const verifyTask = db.prepare('SELECT content FROM tasks WHERE id = ?').get(taskA.id);
    expect(verifyTask.content).toBe('Original A');
  });

  it('使用者不應能刪除他人的任務', async () => {
    const taskA = await taskService.createTask(USER_A, 'Delete me');
    
    await expect(taskService.deleteTask(USER_B, taskA.id))
      .rejects.toThrow('Task not found or unauthorized');
    
    const verifyTask = db.prepare('SELECT id FROM tasks WHERE id = ?').get(taskA.id);
    expect(verifyTask).toBeDefined();
  });

  it('應正確儲存並讀取包含換行符的任務內容', async () => {
    const multiLineContent = 'Line 1\nLine 2\nLine 3';
    const task = await taskService.createTask(USER_A, multiLineContent);
    
    expect(task.content).toBe(multiLineContent);
    
    const tasks = await taskService.getTasks(USER_A);
    expect(tasks[0].content).toBe(multiLineContent);
    
    const dbTask = db.prepare('SELECT content FROM tasks WHERE id = ?').get(task.id);
    expect(dbTask.content).toBe(multiLineContent);
  });
});

describe('TaskService - Rank & Ordering (T007)', () => {
  const USER_ID = 300;

  beforeEach(() => {
    db.prepare('DELETE FROM tasks').run();
    db.prepare('INSERT OR IGNORE INTO users (id, username, password_hash, role_id) VALUES (?, ?, ?, ?)')
      .run(USER_ID, 'testrank', 'hash', 3);
  });

  it('建立任務時應自動遞增 rank', async () => {
    const task1 = await taskService.createTask(USER_ID, 'First');
    const task2 = await taskService.createTask(USER_ID, 'Second');

    expect(task1.rank).toBe(1.0);
    expect(task2.rank).toBe(2.0);
  });

  it('應按 rank 昇冪排序取得任務', async () => {
    await taskService.createTask(USER_ID, 'Task 1'); // rank 1.0
    const task2 = await taskService.createTask(USER_ID, 'Task 2'); // rank 2.0
    await taskService.createTask(USER_ID, 'Task 3'); // rank 3.0

    // 手動將 task 2 的 rank 改為 0.5 (排到最前面)
    await taskService.updateTask(USER_ID, task2.id, { rank: 0.5 });

    const tasks = await taskService.getTasks(USER_ID);
    expect(tasks).toHaveLength(3);
    expect(tasks[0].id).toBe(task2.id);
    expect(tasks[0].rank).toBe(0.5);
    expect(tasks[1].content).toBe('Task 1');
    expect(tasks[2].content).toBe('Task 3');
  });

  it('更新任務狀態時應保留 rank', async () => {
    const task = await taskService.createTask(USER_ID, 'Task', 'todo');
    const originalRank = task.rank;

    const updatedTask = await taskService.updateTask(USER_ID, task.id, { status: 'doing' });
    expect(updatedTask.status).toBe('doing');
    
    const dbTask = db.prepare('SELECT rank FROM tasks WHERE id = ?').get(task.id);
    expect(dbTask.rank).toBe(originalRank);
  });
});
