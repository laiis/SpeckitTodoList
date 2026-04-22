// tests/unit/config.test.js
import { describe, it, expect, beforeEach, afterEach, vi } from 'vitest';

describe('Server Config', () => {

  let originalEnv;
  let warnSpy, errorSpy;
  let logger;

  beforeEach(() => {
    // Save original process.env
    originalEnv = { ...process.env };
    // Reset modules before each test to ensure we get a fresh config
    vi.resetModules();
    
    // Explicitly clear require cache for the config and logger to ensure fresh loads
    const configPath = require.resolve('../../server/config');
    const loggerPath = require.resolve('../../server/utils/logger');
    delete require.cache[configPath];
    delete require.cache[loggerPath];
    
    // Load logger and spy on its methods
    logger = require('../../server/utils/logger');
    warnSpy = vi.spyOn(logger, 'warn').mockImplementation(() => {});
    errorSpy = vi.spyOn(logger, 'error').mockImplementation(() => {});
  });

  afterEach(() => {
    // Restore original process.env and spies
    process.env = originalEnv;
    vi.restoreAllMocks();
  });

  it('T013 - should correctly identify the test environment', () => {
    process.env.NODE_ENV = 'test';
    const config = require('../../server/config');
    expect(config.env).toBe('test');
  });

  it('T017 - should use default values in non-production environments', () => {
    process.env.NODE_ENV = 'development';
    delete process.env.JWT_SECRET;
    delete process.env.ADMIN_PASSWORD;

    const config = require('../../server/config');
    
    expect(config.jwt.secret).toBe('your-default-secure-secret-key-for-dev');
    expect(config.admin.password).toBe('admin');
    expect(warnSpy).toHaveBeenCalledWith('JWT_SECRET is not set. Using default value for non-production environment.');
    expect(warnSpy).toHaveBeenCalledWith('ADMIN_PASSWORD is not set. Using default value "admin" for non-production environment.');
  });

  it('T017 - should throw an error if JWT_SECRET is missing in production', () => {
    process.env.NODE_ENV = 'production';
    delete process.env.JWT_SECRET;
    
    expect(() => require('../../server/config')).toThrow('JWT_SECRET must be set in production.');
    expect(errorSpy).toHaveBeenCalledWith('FATAL: JWT_SECRET is not defined in production environment.');
  });

  it('T017 - should log a warning if default admin password is used in production', () => {
    process.env.NODE_ENV = 'production';
    process.env.JWT_SECRET = 'a-real-secret';
    process.env.ADMIN_PASSWORD = 'admin';

    require('../../server/config');
    
    expect(warnSpy).toHaveBeenCalledWith('SECURITY WARNING: Default admin password is being used in a production-like environment.');
  });

  it('should use environment variables when they are set', () => {
    process.env.NODE_ENV = 'production';
    process.env.JWT_SECRET = 'my-secret';
    process.env.ADMIN_PASSWORD = 'my-password';
    process.env.DB_PATH = 'my-test.db';

    const config = require('../../server/config');

    expect(config.jwt.secret).toBe('my-secret');
    expect(config.admin.password).toBe('my-password');
    expect(config.database.path).toBe('my-test.db');
    expect(warnSpy).not.toHaveBeenCalled();
    expect(errorSpy).not.toHaveBeenCalled();
  });
});
