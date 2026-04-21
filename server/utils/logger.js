/**
 * Logger Utility Object
 * Compliant with project constitution: timestamped, categorized, no raw console.log
 */
const logger = {
  info: (category, message, data = '') => {
    const timestamp = new Date().toISOString();
    process.stdout.write(`[${timestamp}] [INFO] [${category}] ${message} ${data ? JSON.stringify(data) : ''}\n`);
  },
  warn: (category, message, data = '') => {
    const timestamp = new Date().toISOString();
    process.stdout.write(`[${timestamp}] [WARN] [${category}] ${message} ${data ? JSON.stringify(data) : ''}\n`);
  },
  error: (category, message, error = '') => {
    const timestamp = new Date().toISOString();
    const errorMessage = error instanceof Error ? error.stack : JSON.stringify(error);
    process.stderr.write(`[${timestamp}] [ERROR] [${category}] ${message} ${errorMessage}\n`);
  },
  security: (category, message, data = '') => {
    const timestamp = new Date().toISOString();
    process.stdout.write(`[${timestamp}] [SECURITY] [${category}] ${message} ${data ? JSON.stringify(data) : ''}\n`);
  }
};

module.exports = logger;
