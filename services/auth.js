/**
 * 前端身份驗證服務
 */
export const authService = {
  /**
   * 使用者登入
   * @param {string} username 
   * @param {string} password 
   */
  async login(username, password) {
    return fetch('/api/auth/login', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({ username, password })
    });
  },

  /**
   * 使用者登出
   */
  async logout() {
    return fetch('/api/auth/logout', {
      method: 'POST'
    });
  },

  /**
   * 取得當前使用者資訊
   */
  async getMe() {
    return fetch('/api/auth/me');
  },

  /**
   * 使用者註冊 (T021)
   * @param {string} username 
   * @param {string} password 
   */
  async register(username, password) {
    return fetch('/api/auth/register', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({ username, password })
    });
  }
};
