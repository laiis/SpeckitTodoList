const logger = require('../utils/logger');

/**
 * 角色權限檢查中間件 (RBAC)
 * @param {Array<string>} roles - 具備權限存取的角色列表 (例如: ['admin', 'editor'])
 */
const authorize = (roles = []) => {
  // 將傳入的角色名稱正規化為陣列
  if (typeof roles === 'string') {
    roles = [roles];
  }

  return (req, res, next) => {
    // 此中間件應接在 authMiddleware 之後
    if (!req.user || !req.user.role) {
      logger.error('Authorization failed: No user context found. req.user: ' + JSON.stringify(req.user));
      return res.status(500).json({ error: '內部錯誤：未正確執行身份驗證中間件' });
    }

    const { role, username } = req.user;

    // 檢查目前使用者的角色是否在允許存取的名單中
    if (roles.length && !roles.includes(role)) {
      logger.warn(`Access denied for user [${username}] with role [${role}]. Required roles: [${roles.join(', ')}]`);
      return res.status(403).json({ error: '權限不足，無法執行此操作' });
    }

    // 權限通過，進入下一個中間件
    next();
  };
};

module.exports = authorize;
