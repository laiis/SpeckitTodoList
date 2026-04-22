import { describe, it, expect, beforeAll } from 'vitest';
import request from 'supertest';
import app from '../../server/app';
import db from '../../server/db/init';

describe('Performance Baseline Tests (SC-001)', () => {
  let adminToken;

  beforeAll(async () => {
    // 確保資料庫中有測試資料
    db.prepare('DELETE FROM users WHERE username = ?').run('perf_test_admin');
    const bcrypt = await import('bcryptjs');
    const salt = await bcrypt.genSalt(10);
    const hash = await bcrypt.hash('password123', salt);
    
    db.prepare('INSERT INTO users (username, password_hash, role_id) VALUES (?, ?, ?)')
      .run('perf_test_admin', hash, 1); // 1 is Admin

    // 取得 Token
    const res = await request(app)
      .post('/api/auth/login')
      .send({ username: 'perf_test_admin', password: 'password123' });
    
    const cookieHeader = res.headers['set-cookie'];
    adminToken = cookieHeader ? cookieHeader[0].split(';')[0] : '';
  });

  it('API Latency for /api/tasks should be < 200ms', async () => {
    const iterations = 100;
    const times = [];

    for (let i = 0; i < iterations; i++) {
      const start = performance.now();
      await request(app)
        .get('/api/tasks')
        .set('Cookie', adminToken);
      const end = performance.now();
      times.push(end - start);
    }

    const averageLatency = times.reduce((a, b) => a + b, 0) / iterations;
    console.log(`Average API Latency: ${averageLatency.toFixed(2)}ms`);

    expect(averageLatency).toBeLessThan(200);
  });

  it('Login process should be < 1s (1000ms)', async () => {
    const start = performance.now();
    await request(app)
      .post('/api/auth/login')
      .send({ username: 'perf_test_admin', password: 'password123' });
    const end = performance.now();
    
    const loginDuration = end - start;
    console.log(`Login Duration: ${loginDuration.toFixed(2)}ms`);
    
    expect(loginDuration).toBeLessThan(1000);
  });
});
