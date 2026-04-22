const logger = require('../utils/logger');

const config = {
  env: process.env.NODE_ENV || 'development',
  port: process.env.PORT || 3000,
  jwt: {
    secret: process.env.JWT_SECRET,
    expiresIn: process.env.JWT_EXPIRES_IN || '24h',
  },
  database: {
    path: process.env.DB_PATH || 'database.sqlite',
  },
  admin: {
    password: process.env.ADMIN_PASSWORD,
  },
};

// --- 驗證與預設值 ---
const isProduction = config.env === 'production';

// 非生產環境下的預設值
if (!isProduction) {
  if (!config.jwt.secret) {
    logger.warn('JWT_SECRET is not set. Using default value for non-production environment.');
    config.jwt.secret = 'your-default-secure-secret-key-for-dev';
  }
  if (!config.admin.password) {
    logger.warn('ADMIN_PASSWORD is not set. Using default value "admin" for non-production environment.');
    config.admin.password = 'admin';
  }
}

// 生產環境下的驗證
if (isProduction) {
  if (!config.jwt.secret) {
    logger.error('FATAL: JWT_SECRET is not defined in production environment.');
    throw new Error('JWT_SECRET must be set in production.');
  }

  if (config.admin.password === 'admin') {
    logger.warn('SECURITY WARNING: Default admin password is being used in a production-like environment.');
  }
}


module.exports = config;
