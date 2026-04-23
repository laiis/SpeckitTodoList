import request from 'supertest';
import { describe, it, expect, beforeAll } from 'vitest';

// 設定測試用的記憶體資料庫
process.env.DB_PATH = ':memory:';

// 在載入 app 之前先載入 db 確保初始化
import db from '../../server/db/init';
import app from '../../server/app';

describe('Todo Flow Integration - Multi-line Support', () => {
  let adminCookie;

  beforeAll(() => {
    db.resetDB();
  });

  it('應能以管理者身份登入', async () => {
    const res = await request(app)
      .post('/api/auth/login')
      .send({ username: 'admin', password: 'admin' });

    expect(res.status).toBe(200);
    adminCookie = res.headers['set-cookie'][0].split(';')[0];
  });

  it('應能建立並儲存包含換行符的任務', async () => {
    const multiLineContent = '第一行\n第二行\n第三行';
    const res = await request(app)
      .post('/api/tasks')
      .set('Cookie', adminCookie)
      .send({ content: multiLineContent, status: 'todo' });

    expect(res.status).toBe(201);
    expect(res.body.content).toBe(multiLineContent);
  });

  it('應能讀取包含換行符的任務列表', async () => {
    const res = await request(app)
      .get('/api/tasks')
      .set('Cookie', adminCookie);

    expect(res.status).toBe(200);
    const task = res.body.find(t => t.content.includes('\n'));
    expect(task).toBeDefined();
    expect(task.content).toBe('第一行\n第二行\n第三行');
  });

  it('應能更新任務為多行內容', async () => {
    // 先建立一個單行任務
    const createRes = await request(app)
      .post('/api/tasks')
      .set('Cookie', adminCookie)
      .send({ content: '單行任務', status: 'todo' });
    
    const taskId = createRes.body.id;
    const newMultiLineContent = '更新後第一行\n更新後第二行';

    const updateRes = await request(app)
      .patch(`/api/tasks/${taskId}`)
      .set('Cookie', adminCookie)
      .send({ content: newMultiLineContent });

    expect(updateRes.status).toBe(200);
    expect(updateRes.body.content).toBe(newMultiLineContent);

    // 再次確認讀取
    const getRes = await request(app)
      .get('/api/tasks')
      .set('Cookie', adminCookie);
    
    const updatedTask = getRes.body.find(t => t.id === taskId);
    expect(updatedTask.content).toBe(newMultiLineContent);
  });

  it('應能建立並儲存包含優先序的任務 (T024.2)', async () => {
    const res = await request(app)
      .post('/api/tasks')
      .set('Cookie', adminCookie)
      .send({ content: '高優先序任務', status: 'todo', priority: 1 });

    expect(res.status).toBe(201);
    expect(res.body.priority).toBe(1);
  });

  it('應能建立並儲存包含截止日期的任務', async () => {
    const dueDate = '2026-12-31';
    const res = await request(app)
      .post('/api/tasks')
      .set('Cookie', adminCookie)
      .send({ content: '具日期的任務', status: 'todo', due_date: dueDate });

    expect(res.status).toBe(201);
    expect(res.body.due_date).toBe(dueDate);
  });

  it('應能建立並儲存包含起始日期的任務 (US8)', async () => {
    const startDate = '2026-04-23';
    const res = await request(app)
      .post('/api/tasks')
      .set('Cookie', adminCookie)
      .send({ content: '具起始日期的任務', status: 'todo', start_date: startDate });

    expect(res.status).toBe(201);
    expect(res.body.start_date).toBe(startDate);
  });
});
