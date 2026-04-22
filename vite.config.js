import { defineConfig } from 'vite';

export default defineConfig({
  server: {
    proxy: {
      '/api': {
        target: 'http://localhost:3000',
        changeOrigin: true,
        secure: false,
      },
      // 確保 services 和 script 能正確被存取 (如果需要)
      '/services': {
        target: 'http://localhost:3000',
        changeOrigin: true,
      },
    },
  },
});
