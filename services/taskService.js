// T024: 前端 Task 服務邏輯 (符合憲法 IV)
export const taskService = {
    /**
     * 驗證日期範圍是否合法 (start_date <= due_date)
     * @param {string|null} start 
     * @param {string|null} end 
     * @returns {boolean}
     */
    validateDateRange(start, end) {
        if (!start || !end) return true;
        const startDate = new Date(start);
        const endDate = new Date(end);
        
        // 確保日期物件有效
        if (isNaN(startDate.getTime()) || isNaN(endDate.getTime())) return true;
        
        // 僅比較日期部分，忽略時間 (雖然 input type="date" 本身就不含時間)
        startDate.setHours(0, 0, 0, 0);
        endDate.setHours(0, 0, 0, 0);
        
        return startDate <= endDate;
    }
};
