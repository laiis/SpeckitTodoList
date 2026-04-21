const bcrypt = require('bcryptjs');
const logger = require('./logger');

/**
 * 雜湊密碼
 * @param {string} password - 明文密碼
 * @returns {Promise<string>} 雜湊後的密碼
 */
const hashPassword = async (password) => {
  try {
    const salt = await bcrypt.genSalt(10);
    return await bcrypt.hash(password, salt);
  } catch (error) {
    logger.error('Error hashing password:', error);
    throw error;
  }
};

/**
 * 驗證密碼
 * @param {string} password - 明文密碼
 * @param {string} hashedPassword - 雜湊後的密碼
 * @returns {Promise<boolean>} 是否相符
 */
const comparePassword = async (password, hashedPassword) => {
  try {
    return await bcrypt.compare(password, hashedPassword);
  } catch (error) {
    logger.error('Error comparing password:', error);
    throw error;
  }
};

module.exports = {
  hashPassword,
  comparePassword
};
