import request from 'supertest';
import { describe, it, expect, beforeAll } from 'vitest';

// 設定測試用的記憶體資料庫
process.env.DB_PATH = ':memory:';

import db from '../../server/db/init';
import app from '../../server/app';

describe('Drag and Drop Integration (T009)', () => {
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

  it('應能透過 PATCH 更新任務狀態與 Rank (跨河道拖拉)', async () => {
    // 1. 建立兩個任務
    const task1Res = await request(app)
      .post('/api/tasks')
      .set('Cookie', adminCookie)
      .send({ content: 'Task 1', status: 'todo' }); // rank 1.0
    
    const task2Res = await request(app)
      .post('/api/tasks')
      .set('Cookie', adminCookie)
      .send({ content: 'Task 2', status: 'todo' }); // rank 2.0

    const task1Id = task1Res.body.id;

    // 2. 將 Task 1 拖到 'doing' 狀態，並設定一個新的 rank
    const newRank = 0.5;
    const updateRes = await request(app)
      .patch(`/api/tasks/${task1Id}`)
      .set('Cookie', adminCookie)
      .send({ status: 'running', rank: newRank });

    expect(updateRes.status).toBe(200);
    expect(updateRes.body.status).toBe('running');
    expect(updateRes.body.rank).toBe(newRank);

    // 3. 驗證資料庫中的狀態與排序
    const getRes = await request(app)
      .get('/api/tasks')
      .set('Cookie', adminCookie);
    
    const tasks = getRes.body;
    // Task 1 (rank 0.5) 應該排在 Task 2 (rank 2.0) 之前
    expect(tasks[0].id).toBe(task1Id);
    expect(tasks[0].status).toBe('running');
    expect(tasks[0].rank).toBe(0.5);
  });
});
