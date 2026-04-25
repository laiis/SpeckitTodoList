import { describe, it, expect, vi, beforeEach } from 'vitest';
import logger from '../../services/logger';

describe('Logger Service', () => {
  beforeEach(() => {
    vi.restoreAllMocks();
  });

  it('should format info messages with timestamp and level', () => {
    const spy = vi.spyOn(console, 'info').mockImplementation(() => {});
    logger.info('Test message');
    
    expect(spy).toHaveBeenCalled();
    const output = spy.mock.calls[0][0];
    expect(output).toMatch(/^\[\d{4}-\d{2}-\d{2}T\d{2}:\d{2}:\d{2}\.\d{3}Z\] \[INFO\] Test message$/);
  });

  it('should format error messages with timestamp and level', () => {
    const spy = vi.spyOn(console, 'error').mockImplementation(() => {});
    logger.error('Error message');
    
    expect(spy).toHaveBeenCalled();
    const output = spy.mock.calls[0][0];
    expect(output).toMatch(/^\[\d{4}-\d{2}-\d{2}T\d{2}:\d{2}:\d{2}\.\d{3}Z\] \[ERROR\] Error message$/);
  });

  it('should format warn messages with timestamp and level', () => {
    const spy = vi.spyOn(console, 'warn').mockImplementation(() => {});
    logger.warn('Warning message');
    
    expect(spy).toHaveBeenCalled();
    const output = spy.mock.calls[0][0];
    expect(output).toMatch(/^\[\d{4}-\d{2}-\d{2}T\d{2}:\d{2}:\d{2}\.\d{3}Z\] \[WARN\] Warning message$/);
  });

  it('should format security messages with timestamp and level', () => {
    // Frontend security logs also go to console info or error
    const spy = vi.spyOn(console, 'info').mockImplementation(() => {});
    logger.security('Security alert');
    
    expect(spy).toHaveBeenCalled();
    const output = spy.mock.calls[0][0];
    expect(output).toMatch(/^\[\d{4}-\d{2}-\d{2}T\d{2}:\d{2}:\d{2}\.\d{3}Z\] \[SECURITY\] Security alert$/);
  });
});
