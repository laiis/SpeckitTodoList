import { describe, it, expect, beforeEach } from 'vitest';
import taskService from '../../server/services/taskService';
import db from '../../server/db/init';

describe('TaskService - Data Isolation', () => {
  const USER_A = 100;
  const USER_B = 200;

  beforeEach(() => {
    db.prepare('DELETE FROM tasks').run();
    db.prepare('DELETE FROM users WHERE id IN (?, ?)').run(USER_A, USER_B);
    
    // 建立測試使用者 (簡化處理，不透過 authService)
    db.prepare('INSERT INTO users (id, username, password_hash, role_id) VALUES (?, ?, ?, ?)')
      .run(USER_A, 'userA', 'hash', 3);
    db.prepare('INSERT INTO users (id, username, password_hash, role_id) VALUES (?, ?, ?, ?)')
      .run(USER_B, 'userB', 'hash', 3);
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
});
