const formatMessage = (level, message) => {
  const timestamp = new Date().toISOString();
  return `[${timestamp}] [${level.toUpperCase()}] ${message}`;
};

const logger = {
  info: (message) => {
    console.info(formatMessage('info', message));
  },
  error: (message) => {
    console.error(formatMessage('error', message));
  },
  warn: (message) => {
    console.warn(formatMessage('warn', message));
  },
  security: (message) => {
    console.info(formatMessage('security', message));
  }
};

export default logger;
