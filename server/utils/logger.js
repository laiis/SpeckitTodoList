const path = require('path');
const fs = require('fs');

const logDir = path.resolve(__dirname, '../../logs');
if (!fs.existsSync(logDir)) {
  fs.mkdirSync(logDir);
}

const formatMessage = (level, message) => {
  const timestamp = new Date().toISOString();
  return `[${timestamp}] [${level.toUpperCase()}] ${message}`;
};

const logger = {
  info: (message) => {
    const formatted = formatMessage('info', message);
    fs.appendFileSync(path.join(logDir, 'app.log'), formatted + '\n');
  },
  error: (message) => {
    const formatted = formatMessage('error', message);
    fs.appendFileSync(path.join(logDir, 'error.log'), formatted + '\n');
  },
  warn: (message) => {
    const formatted = formatMessage('warn', message);
    fs.appendFileSync(path.join(logDir, 'app.log'), formatted + '\n');
  },
  security: (message) => {
    const formatted = formatMessage('security', message);
    fs.appendFileSync(path.join(logDir, 'security.log'), formatted + '\n');
  }
};

module.exports = logger;
