const express = require('express');
const router = express.Router();
const { adminService } = require('../services/adminService');
const authMiddleware = require('../middleware/auth');
const authorize = require('../middleware/rbac');

// 所有管理員路由均需經過身份驗證與角色檢查
router.use(authMiddleware, authorize(['admin']));

/**
 * GET /api/admin/users
 * 獲取所有使用者 (T028)
 */
router.get('/users', async (req, res) => {
  try {
    const users = await adminService.getAllUsers();
    res.json(users);
  } catch (err) {
    res.status(500).json({ error: '獲取使用者清單失敗' });
  }
});

/**
 * POST /api/admin/users/:id/unlock
 * 手動解鎖使用者 (T028b)
 */
router.post('/users/:id/unlock', async (req, res) => {
  try {
    await adminService.unlockUser(req.params.id);
    res.json({ message: '使用者已成功解鎖' });
  } catch (err) {
    res.status(500).json({ error: '解鎖使用者失敗' });
  }
});

/**
 * POST /api/admin/users/:id/password-reset
 * 手動重設密碼 (T029)
 */
router.post('/users/:id/password-reset', async (req, res) => {
  const { newPassword } = req.body;
  if (!newPassword) {
    return res.status(400).json({ error: '需提供新密碼' });
  }
  try {
    await adminService.resetUserPassword(req.params.id, newPassword);
    res.json({ message: '密碼已成功重設' });
  } catch (err) {
    res.status(500).json({ error: '重設密碼失敗' });
  }
});

/**
 * PATCH /api/admin/users/:id/role
 * 變更使用者角色 (T029b)
 */
router.patch('/users/:id/role', async (req, res) => {
  const { roleId } = req.body;
  if (!roleId) {
    return res.status(400).json({ error: '需提供角色 ID' });
  }
  try {
    await adminService.updateUserRole(req.params.id, roleId);
    res.json({ message: '角色已成功變更' });
  } catch (err) {
    res.status(500).json({ error: '變更角色失敗' });
  }
});

/**
 * GET /api/admin/logs
 * 獲取安全日誌 (T030)
 */
router.get('/logs', async (req, res) => {
  try {
    const logs = await adminService.getSecurityLogs();
    res.json(logs);
  } catch (err) {
    res.status(500).json({ error: '獲取日誌失敗' });
  }
});

module.exports = router;
