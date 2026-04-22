import request from 'supertest';
import path from 'path';
import fs from 'fs';
import { describe, it, expect, beforeAll, afterAll } from 'vitest';

// 設定測試用的記憶體資料庫
process.env.DB_PATH = ':memory:';

// 在載入 app 之前先載入 db 確保初始化
import db from '../../server/db/init';
import app from '../../server/app';

describe('Auth & Data Isolation Integration Flow', () => {
  let adminCookie;
  let viewerCookie;
  let viewerId;

  beforeAll(() => {
    db.resetDB();
  });

  it('should allow admin login and set secure cookie', async () => {
    const res = await request(app)
      .post('/api/auth/login')
      .send({ username: 'admin', password: 'admin' });

    expect(res.status).toBe(200);
    expect(res.headers['set-cookie']).toBeDefined();
    adminCookie = res.headers['set-cookie'][0].split(';')[0];
    expect(res.body.user.role).toBe('admin');
  });

  it('should register a new viewer user', async () => {
    const res = await request(app)
      .post('/api/auth/register')
      .send({ username: 'viewer_user', password: 'password123' });

    expect(res.status).toBe(201);
    expect(res.body.userId).toBeDefined();
    viewerId = res.body.userId;
  });

  it('should allow viewer login', async () => {
    const res = await request(app)
      .post('/api/auth/login')
      .send({ username: 'viewer_user', password: 'password123' });

    expect(res.status).toBe(200);
    viewerCookie = res.headers['set-cookie'][0].split(';')[0];
    expect(res.body.user.username).toBe('viewer_user');
  });

  it('should show currently logged in user info (me)', async () => {
    const res = await request(app)
      .get('/api/auth/me')
      .set('Cookie', viewerCookie);

    expect(res.status).toBe(200);
    expect(res.body.username).toBe('viewer_user');
  });

  describe('Data Isolation & RBAC', () => {
    let viewerTaskId;

    it('should allow viewer to create a task', async () => {
      // 根據 Phase 5: "限制 Viewer 僅能讀取"
      const res = await request(app)
        .post('/api/tasks')
        .set('Cookie', viewerCookie)
        .send({ content: 'Viewer private task' });

      expect(res.status).toBe(403); 
    });

    it('should allow admin to create a task', async () => {
      const res = await request(app)
        .post('/api/tasks')
        .set('Cookie', adminCookie)
        .send({ content: 'Admin secret task' });

      expect(res.status).toBe(201);
    });

    it('should isolate tasks by user_id', async () => {
      // 先用 admin 建立
      await request(app).post('/api/tasks').set('Cookie', adminCookie).send({ content: 'Admin Task 1' });
      
      // 登入一個 Editor 來建立任務
      await request(app).post('/api/auth/register').send({ username: 'editor_user', password: 'password123' });
      // 手動在 DB 改角色為 editor (ID 2)，因為註冊預設是 viewer (ID 3)
      db.prepare('UPDATE users SET role_id = 2 WHERE username = ?').run('editor_user');
      
      const loginRes = await request(app).post('/api/auth/login').send({ username: 'editor_user', password: 'password123' });
      const editorCookie = loginRes.headers['set-cookie'][0].split(';')[0];
      
      await request(app).post('/api/tasks').set('Cookie', editorCookie).send({ content: 'Editor Task 1' });

      // 驗證 Editor 只能看到自己的任務
      const editorTasks = await request(app).get('/api/tasks').set('Cookie', editorCookie);
      expect(editorTasks.body.length).toBe(1);
      expect(editorTasks.body[0].content).toBe('Editor Task 1');

      // 驗證 Admin 只能看到自己的任務 (FR-012)
      const adminTasks = await request(app).get('/api/tasks').set('Cookie', adminCookie);
      expect(adminTasks.body.some(t => t.content === 'Editor Task 1')).toBe(false);
    });
  });

  describe('Admin Operations', () => {
    it('should deny non-admin access to admin dashboard API', async () => {
      const res = await request(app)
        .get('/api/admin/users')
        .set('Cookie', viewerCookie);
      
      expect(res.status).toBe(403);
    });

    it('should allow admin to list users', async () => {
      const res = await request(app)
        .get('/api/admin/users')
        .set('Cookie', adminCookie);
      
      expect(res.status).toBe(200);
      expect(res.body.length).toBeGreaterThan(1);
    });
  });
});
