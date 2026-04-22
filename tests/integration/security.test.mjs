import request from 'supertest';
import { describe, it, expect, beforeAll } from 'vitest';

// 設定測試用的記憶體資料庫
process.env.DB_PATH = ':memory:';

import db from '../../server/db/init';
import app from '../../server/app';

describe('Security & Penetration Testing', () => {
  let adminCookie;
  let viewerCookie;
  let viewerId;
  let otherUserCookie;
  let otherUserId;

  beforeAll(async () => {
    db.resetDB();
    
    // 登入 Admin
    const adminLogin = await request(app).post('/api/auth/login').send({ username: 'admin', password: 'admin' });
    adminCookie = adminLogin.headers['set-cookie'][0].split(';')[0];

    // 註冊並登入 Viewer
    await request(app).post('/api/auth/register').send({ username: 'viewer_user', password: 'password123' });
    const viewerLogin = await request(app).post('/api/auth/login').send({ username: 'viewer_user', password: 'password123' });
    viewerCookie = viewerLogin.headers['set-cookie'][0].split(';')[0];
    viewerId = viewerLogin.body.user.id;

    // 註冊另一個使用者 (Editor) 用於測試 IDOR
    await request(app).post('/api/auth/register').send({ username: 'other_user', password: 'password123' });
    db.prepare('UPDATE users SET role_id = 2 WHERE username = ?').run('other_user');
    const otherLogin = await request(app).post('/api/auth/login').send({ username: 'other_user', password: 'password123' });
    otherUserCookie = otherLogin.headers['set-cookie'][0].split(';')[0];
    otherUserId = otherLogin.body.user.id;
  });

  describe('XSS Prevention (T032)', () => {
    it('should sanitize task content to prevent XSS', async () => {
      const xssPayload = '<script>alert("XSS")</script>';
      const res = await request(app)
        .post('/api/tasks')
        .set('Cookie', adminCookie)
        .send({ content: xssPayload });

      expect(res.status).toBe(201);
      // 如果有過濾，content 應該被脫逸或移除標籤
      // 例如: &lt;script&gt;...
      expect(res.body.content).not.toBe(xssPayload);
      expect(res.body.content).toContain('&lt;script&gt;');
    });
  });

  describe('IDOR (Insecure Direct Object Reference) (T035b)', () => {
    let otherTaskId;

    beforeAll(async () => {
      const res = await request(app)
        .post('/api/tasks')
        .set('Cookie', otherUserCookie)
        .send({ content: 'Other user task' });
      otherTaskId = res.body.id;
    });

    it('should prevent user from reading others tasks (Indirectly via list)', async () => {
      const res = await request(app)
        .get('/api/tasks')
        .set('Cookie', viewerCookie);
      
      expect(res.body.some(t => t.id === otherTaskId)).toBe(false);
    });

    it('should prevent admin from updating others tasks (FR-012 Isolation)', async () => {
      // Admin 即使有權限更新任務，也應遵循資料隔離 (FR-012)
      // 他只能更新自己的任務。更新別人的任務應該報錯 404
      const res = await request(app)
        .patch(`/api/tasks/${otherTaskId}`)
        .set('Cookie', adminCookie)
        .send({ content: 'Hacked content' });

      expect(res.status).toBe(404);
    });

    it('should block viewer from deleting others tasks via RBAC (403)', async () => {
      const res = await request(app)
        .delete(`/api/tasks/${otherTaskId}`)
        .set('Cookie', viewerCookie);

      // Viewer 本來就沒權限 DELETE，所以是被 RBAC 中間件擋掉
      expect(res.status).toBe(403);
    });
  });

  describe('RBAC Bypassing (T035b)', () => {
    it('should prevent Viewer from creating tasks via API', async () => {
      const res = await request(app)
        .post('/api/tasks')
        .set('Cookie', viewerCookie)
        .send({ content: 'Viewer should not create' });
      
      expect(res.status).toBe(403);
    });

    it('should prevent Viewer from accessing Admin logs', async () => {
      const res = await request(app)
        .get('/api/admin/logs')
        .set('Cookie', viewerCookie);
      
      expect(res.status).toBe(403);
    });
  });
});
