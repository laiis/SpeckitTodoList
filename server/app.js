require('dotenv').config();
const express = require('express');
const path = require('path');
const authRoutes = require('./routes/auth');
const taskRoutes = require('./routes/tasks');
const adminRoutes = require('./routes/admin');
const config = require('./config');
const logger = require('./utils/logger');

const app = express();
const PORT = config.port;

// 簡單的自定義 cookie 解析與設定中間件
app.use((req, res, next) => {
  // 解析 Cookie
  const cookieHeader = req.headers.cookie;
  req.cookies = {};
  if (cookieHeader) {
    cookieHeader.split(';').forEach(cookie => {
      const [name, ...rest] = cookie.split('=');
      req.cookies[name.trim()] = rest.join('=').trim();
    });
  }

  // 實作 res.cookie (因為沒有安裝 cookie-parser)
  res.cookie = (name, value, options = {}) => {
    let cookieStr = `${name}=${value}`;
    
    if (options.maxAge) {
      cookieStr += `; Max-Age=${Math.floor(options.maxAge / 1000)}`;
    }
    if (options.httpOnly) {
      cookieStr += '; HttpOnly';
    }
    if (options.secure) {
      cookieStr += '; Secure';
    }
    if (options.path) {
      cookieStr += `; Path=${options.path}`;
    } else {
      cookieStr += '; Path=/';
    }
    if (options.sameSite) {
      cookieStr += `; SameSite=${options.sameSite}`;
    }

    res.append('Set-Cookie', cookieStr);
    return res;
  };

  next();
});

app.use(express.json());
app.use(express.static(path.join(__dirname, '../public')));
app.use('/services', express.static(path.join(__dirname, '../services')));
app.use('/script.js', express.static(path.join(__dirname, '../script.js')));
app.use('/style.css', express.static(path.join(__dirname, '../style.css')));

// 路由
app.use('/api/auth', authRoutes);
app.use('/api/tasks', taskRoutes);
app.use('/api/admin', adminRoutes);

// 啟動伺服器
if (require.main === module) {
  app.listen(PORT, () => {
    logger.info(`Server is running on http://localhost:${PORT}`);
  });
}

module.exports = app;
