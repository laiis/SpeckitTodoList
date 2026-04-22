import { describe, it, expect, vi } from 'vitest';
const tokenService = require('../../server/services/tokenService');
const config = require('../../server/config');

describe('TokenService - Environment Variables', () => {
  it('T020 - 應正確引用 AppConfig.jwt.secret 簽發 Token', () => {
    const payload = { id: 1, username: 'testuser' };
    const token = tokenService.generateToken(payload);
    expect(token).toBeDefined();
    
    // 驗證 token 是否可以使用當前 config 中的 secret 解析
    const decoded = tokenService.verifyToken(token);
    expect(decoded.username).toBe('testuser');
  });

  it('T020 - 應正確引用 AppConfig.jwt.expiresIn 設定有效期', () => {
    // 由於 expiresIn 是在 jwt.sign 中使用的，我們可以透過 vi 模擬 jwt.sign 來驗證參數
    const jwt = require('jsonwebtoken');
    const spy = vi.spyOn(jwt, 'sign');
    
    tokenService.generateToken({ id: 1 });
    
    expect(spy).toHaveBeenCalledWith(
      expect.anything(),
      config.jwt.secret,
      expect.objectContaining({ expiresIn: config.jwt.expiresIn })
    );
    
    spy.mockRestore();
  });
});
