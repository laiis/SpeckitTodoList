/**
 * @vitest-environment jsdom
 */
import { describe, it, expect, vi, beforeEach } from 'vitest';
import performanceService from '../../services/performanceService';

describe('Performance Service', () => {
  beforeEach(() => {
    localStorage.clear();
    vi.restoreAllMocks();
  });

  it('should be disabled by default if no localStorage entry exists', () => {
    expect(performanceService.isEnabled()).toBe(false);
  });

  it('should load state from localStorage', () => {
    localStorage.setItem('performance-mode', 'true');
    expect(performanceService.isEnabled()).toBe(true);
  });

  it('should toggle state and persist to localStorage', () => {
    performanceService.toggle();
    expect(performanceService.isEnabled()).toBe(true);
    expect(localStorage.getItem('performance-mode')).toBe('true');

    performanceService.toggle();
    expect(performanceService.isEnabled()).toBe(false);
    expect(localStorage.getItem('performance-mode')).toBe('false');
  });

  it('should suggest performance mode if RAM <= 1GB and no preference set', () => {
    // Mock navigator.deviceMemory
    Object.defineProperty(global.navigator, 'deviceMemory', {
      value: 1,
      configurable: true
    });

    expect(performanceService.shouldSuggestMode()).toBe(true);
  });

  it('should NOT suggest performance mode if RAM > 1GB', () => {
    Object.defineProperty(global.navigator, 'deviceMemory', {
      value: 4,
      configurable: true
    });

    expect(performanceService.shouldSuggestMode()).toBe(false);
  });

  it('should NOT suggest performance mode if preference is already set', () => {
    Object.defineProperty(global.navigator, 'deviceMemory', {
      value: 1,
      configurable: true
    });
    localStorage.setItem('performance-mode', 'false');

    expect(performanceService.shouldSuggestMode()).toBe(false);
  });
});
