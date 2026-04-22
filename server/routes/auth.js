const express = require('express');
const router = express.Router();
const { authService } = require('../services/authService');
const { generateToken } = require('../services/tokenService');
const authMiddleware = require('../middleware/auth');
const logger = require('../utils/logger');

/**
 * POST /api/auth/login
 * 使用者登入
 */
router.post('/login', async (req, res) => {
  const { username, password } = req.body;

  if (!username || !password) {
    return res.status(400).json({ error: 'Username and password are required' });
  }

  try {
    const user = await authService.login(username, password);
    
    // 簽發 Token
    const token = generateToken({
      id: user.id,
      username: user.username,
      role: user.role
    });

    // 存入 HttpOnly Cookie (FR-004)
    res.cookie('token', token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      maxAge: 24 * 60 * 60 * 1000 // 24h
    });

    res.json({
      message: 'Login successful',
      user: {
        id: user.id,
        username: user.username,
        role: user.role
      }
    });
  } catch (error) {
    logger.error(`Login error for user [${username}]: ${error.message}\n${error.stack}`);
    if (error.message === 'Account is temporarily locked') {
      return res.status(403).json({ error: error.message });
    }
    res.status(401).json({ error: 'Invalid username or password' });
  }
});

/**
 * POST /api/auth/logout
 * 使用者登出 (T015)
 */
router.post('/logout', (req, res) => {
  res.clearCookie('token');
  logger.info('User logged out');
  res.json({ message: 'Logged out successfully' });
});

/**
 * GET /api/auth/me
 * 取得當前使用者資訊 (T014)
 */
router.get('/me', authMiddleware, async (req, res) => {
  res.json(req.user);
});

/**
 * POST /api/auth/register
 * 使用者註冊 (T020)
 */
router.post('/register', async (req, res) => {
  const { username, password } = req.body;

  if (!username || !password) {
    return res.status(400).json({ error: 'Username and password are required' });
  }

  try {
    const user = await authService.register(username, password);
    res.status(201).json({
      message: 'User registered successfully',
      userId: user.id
    });
  } catch (error) {
    if (error.message === 'Username already exists') {
      return res.status(409).json({ error: error.message });
    }
    res.status(500).json({ error: 'Registration failed' });
  }
});

module.exports = router;
