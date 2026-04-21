const jwt = require('jsonwebtoken');
const logger = require('../utils/logger');

// TODO: 將 JWT_SECRET 移出程式碼並存放於環境變數中
const JWT_SECRET = process.env.JWT_SECRET || 'your-default-secure-secret-key';
const TOKEN_EXPIRY = '24h';

/**
 * 簽發 JWT Token
 * @param {Object} payload - Token 承載資料 (例如: user id, username, role)
 * @returns {string} JWT Token
 */
const generateToken = (payload) => {
  try {
    return jwt.sign(payload, JWT_SECRET, { expiresIn: TOKEN_EXPIRY });
  } catch (error) {
    logger.error('Error generating JWT token:', error);
    throw error;
  }
};

/**
 * 驗證 JWT Token
 * @param {string} token - JWT Token 
 * @returns {Object} 驗證成功後的 Payload
 */
const verifyToken = (token) => {
  try {
    return jwt.verify(token, JWT_SECRET);
  } catch (error) {
    // 區分權限過期與無效 Token
    if (error.name === 'TokenExpiredError') {
      logger.warn('JWT token has expired');
    } else {
      logger.error('Invalid JWT token:', error.message);
    }
    throw error;
  }
};

module.exports = {
  generateToken,
  verifyToken
};
