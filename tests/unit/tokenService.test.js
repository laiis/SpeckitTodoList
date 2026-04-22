import { describe, it, expect, vi, beforeEach } from 'vitest';

describe('TokenService - Environment Variables', () => {
  let tokenService;
  let config;

  beforeEach(() => {
    vi.resetModules();
    process.env.JWT_SECRET = 'my-secret';
    process.env.JWT_EXPIRES_IN = '24h';
    tokenService = require('../../server/services/tokenService');
    config = require('../../server/config');
  });

  it('T020 - 應正確引用 AppConfig.jwt.secret 簽發 Token', () => {
    const payload = { id: 1, username: 'testuser' };
    const token = tokenService.generateToken(payload);
    expect(token).toBeDefined();
    
    // 驗證 token 是否可以使用當前 config 中的 secret 解析
    const decoded = tokenService.verifyToken(token);
    expect(decoded.username).toBe('testuser');
  });

  it('T020 - 應正確引用 AppConfig.jwt.expiresIn 設定有效期', () => {
    const jwt = require('jsonwebtoken');
    const spy = vi.spyOn(jwt, 'sign');
    
    tokenService.generateToken({ id: 1 });
    
    expect(spy).toHaveBeenCalledWith(
      expect.anything(),
      'my-secret',
      expect.objectContaining({ expiresIn: '24h' })
    );
    
    spy.mockRestore();
  });
});
