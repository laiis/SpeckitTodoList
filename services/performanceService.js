const STORAGE_KEY = 'performance-mode';

const performanceService = {
  isEnabled: () => {
    return localStorage.getItem(STORAGE_KEY) === 'true';
  },

  toggle: () => {
    const newState = !performanceService.isEnabled();
    localStorage.setItem(STORAGE_KEY, newState.toString());
    return newState;
  },

  shouldSuggestMode: () => {
    // 檢查是否已有設定
    const hasSetting = localStorage.getItem(STORAGE_KEY) !== null;
    if (hasSetting) return false;

    // 檢查硬體 RAM (GiB)
    const ram = navigator.deviceMemory;
    // 如果不支援該 API，則不主動建議
    if (ram === undefined) return false;

    return ram <= 1;
  },

  getMemoryInfo: () => {
    return navigator.deviceMemory || 'unknown';
  }
};

export default performanceService;
