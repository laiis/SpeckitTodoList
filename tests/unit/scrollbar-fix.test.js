import { describe, it, expect } from 'vitest';
import { readFileSync } from 'fs';
import { join } from 'path';

describe('Admin Scrollbar Fix Verification', () => {
  it('should have body.admin-page style overrides in admin.html', () => {
    const htmlPath = join(process.cwd(), 'public/pages/admin.html');
    const content = readFileSync(htmlPath, 'utf-8');
    
    expect(content).toContain('body.admin-page {');
    expect(content).toContain('overflow: auto !important;');
    expect(content).toContain('display: block !important;');
  });
});
