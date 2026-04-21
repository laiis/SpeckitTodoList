const { verifyToken } = require('../services/tokenService');
const logger = require('../utils/logger');

/**
 * 身份驗證中間件 (JWT & HttpOnly Cookie)
 */
const authMiddleware = (req, res, next) => {
  // 從 Cookie 或 Authorization Header 獲取 Token
  const token = req.cookies?.token || req.headers.authorization?.split(' ')[1];

  if (!token) {
    logger.warn('Authentication failed: Missing token');
    return res.status(401).json({ error: '未經授權，請先登入' });
  }

  try {
    const decoded = verifyToken(token);
    // 將使用者資訊存入 Request，供後續路由使用
    req.user = {
      id: decoded.id,
      username: decoded.username,
      role: decoded.role
    };
    next();
  } catch (error) {
    logger.error('Authentication failed: Invalid or expired token', error.message);
    return res.status(401).json({ error: '會話已過期或無效，請重新登入' });
  }
};

module.exports = authMiddleware;
