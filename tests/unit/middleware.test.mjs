import { describe, it, expect, beforeEach, vi } from 'vitest';

// 先進行 mock
vi.mock('../../server/services/tokenService', () => ({
  verifyToken: vi.fn(),
  __esModule: true
}));

const mockLogger = {
  warn: vi.fn(),
  error: vi.fn(),
  info: vi.fn(),
  security: vi.fn()
};

vi.mock('../../server/utils/logger', () => ({
  default: mockLogger,
  warn: mockLogger.warn,
  error: mockLogger.error,
  info: mockLogger.info,
  security: mockLogger.security,
  __esModule: true
}));

import authMiddleware from '../../server/middleware/auth';
import authorize from '../../server/middleware/rbac';
import { verifyToken } from '../../server/services/tokenService';

describe('Auth & RBAC Middleware Unit Tests', () => {
  let req, res, next;

  beforeEach(() => {
    req = { cookies: {}, headers: {} };
    res = {
      status: vi.fn().mockReturnThis(),
      json: vi.fn().mockReturnThis()
    };
    next = vi.fn();
    vi.clearAllMocks();
  });

  describe('authMiddleware', () => {
    it('should pass if token is valid (from cookie)', () => {
      req.cookies.token = 'valid-token';
      const decodedUser = { id: 1, username: 'testuser', role: 'admin' };
      // 確保 mock 返回正確的值
      verifyToken.mockReturnValue(decodedUser);

      authMiddleware(req, res, next);

      expect(req.user).toEqual(decodedUser);
      expect(next).toHaveBeenCalled();
      expect(res.status).not.toHaveBeenCalled();
    });

    it('should fail if token is missing', () => {
      authMiddleware(req, res, next);

      expect(res.status).toHaveBeenCalledWith(401);
      expect(res.json).toHaveBeenCalledWith({ error: expect.stringContaining('未經授權') });
      expect(next).not.toHaveBeenCalled();
    });

    it('should fail if token is invalid or expired', () => {
      req.headers.authorization = 'Bearer invalid-token';
      verifyToken.mockImplementation(() => { throw new Error('Invalid token'); });

      authMiddleware(req, res, next);

      expect(res.status).toHaveBeenCalledWith(401);
      expect(res.json).toHaveBeenCalledWith({ error: expect.stringContaining('重新登入') });
      expect(next).not.toHaveBeenCalled();
    });
  });

  describe('authorize (RBAC)', () => {
    it('should pass if user has the required role', () => {
      req.user = { id: 1, username: 'testuser', role: 'admin' };
      const middleware = authorize(['admin', 'editor']);

      middleware(req, res, next);

      expect(next).toHaveBeenCalled();
      expect(res.status).not.toHaveBeenCalled();
    });

    it('should fail if user has insufficient permissions', () => {
      req.user = { id: 1, username: 'testuser', role: 'viewer' };
      const middleware = authorize(['admin', 'editor']);

      middleware(req, res, next);

      expect(res.status).toHaveBeenCalledWith(403);
      expect(res.json).toHaveBeenCalledWith({ error: expect.stringContaining('權限不足') });
      expect(next).not.toHaveBeenCalled();
    });

    it('should fail if user context is missing (middleware order error)', () => {
      // req.user is undefined
      const middleware = authorize(['admin']);

      middleware(req, res, next);

      expect(res.status).toHaveBeenCalledWith(500);
      expect(next).not.toHaveBeenCalled();
    });
  });
});
