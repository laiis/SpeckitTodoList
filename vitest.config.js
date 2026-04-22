import { defineConfig } from 'vitest/config'

export default defineConfig({
  test: {
    environment: 'node',
    globals: true,
    env: {
      DB_PATH: ':memory:',
      NODE_ENV: 'test',
      JWT_SECRET: 'test-secret',
      ADMIN_PASSWORD: 'admin'
    }
  },
})
