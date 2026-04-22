import request from 'supertest';
import { describe, it, expect, beforeAll } from 'vitest';
import { performance } from 'perf_hooks';

// 設定測試用的記憶體資料庫
process.env.DB_PATH = ':memory:';

import db from '../../server/db/init';
import app from '../../server/app';

describe('Performance Benchmarks (T034)', () => {
  beforeAll(() => {
    db.resetDB();
  });

  it('should complete login flow within 1s', async () => {
    const start = performance.now();
    
    const res = await request(app)
      .post('/api/auth/login')
      .send({ username: 'admin', password: 'admin' });

    const end = performance.now();
    const duration = end - start;

    expect(res.status).toBe(200);
    expect(duration).toBeLessThan(1000);
    console.log(`Login duration: ${duration.toFixed(2)}ms`);
  });

  it('should have API latency < 200ms for fetching tasks', async () => {
    const loginRes = await request(app)
      .post('/api/auth/login')
      .send({ username: 'admin', password: 'admin' });
    const cookie = loginRes.headers['set-cookie'][0].split(';')[0];

    // 建立 10 個任務以模擬負載
    for (let i = 0; i < 10; i++) {
      await db.prepare('INSERT INTO tasks (user_id, content) VALUES (?, ?)').run(1, `Task ${i}`);
    }

    const start = performance.now();
    
    const res = await request(app)
      .get('/api/tasks')
      .set('Cookie', cookie);

    const end = performance.now();
    const duration = end - start;

    expect(res.status).toBe(200);
    expect(duration).toBeLessThan(200);
    console.log(`Fetch tasks latency: ${duration.toFixed(2)}ms`);
  });
});
