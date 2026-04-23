import { authService } from './services/auth.js';
import { taskService } from './services/taskService.js';

// 提取核心邏輯以利測試
// 憲法要求：封裝日誌記錄，嚴禁使用 console.log
const Logger = {
    info: (...args) => {},
    error: (...args) => {}
};

// T004: 封裝 requestAnimationFrame 基礎同步函數以確保 60fps 效能
const UISync = {
    isSyncing: false,
    sync: (source, target) => {
        if (!UISync.isSyncing) {
            UISync.isSyncing = true;
            target.scrollLeft = source.scrollLeft;
            window.requestAnimationFrame(() => UISync.isSyncing = false);
        }
    }
};

export class TodoService {
    static Status = {
        BACKLOG: 'backlog',
        TODO: 'todo',
        RUNNING: 'running',
        TESTING: 'testing',
        DONE: 'done'
    };

    constructor() {
        this.todos = [];
        Logger.info(`TodoService initialized.`);
    }

    async loadTodos() {
        try {
            const response = await fetch('/api/tasks');
            if (response.ok) {
                this.todos = await response.json();
                Logger.info(`Loaded ${this.todos.length} items from backend.`);
            } else if (response.status === 401 || response.status === 403) {
                window.location.href = 'pages/login.html';
            }
        } catch (error) {
            Logger.error('Failed to load todos:', error);
        }
        return this.todos;
    }

    getTodos() {
        return this.todos;
    }

    async updateTask(id, updates) {
        try {
            const response = await fetch(`/api/tasks/${id}`, {
                method: 'PATCH',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(updates)
            });
            if (response.ok) {
                const updated = await response.json();
                this.todos = this.todos.map(t => t.id === id ? { ...t, ...updated } : t);
                this.sortTodos();
                Logger.info(`Task ${id} updated.`);
            }
        } catch (error) {
            Logger.error('Failed to update task:', error);
        }
        return this.todos;
    }

    async updateTaskStatus(id, newStatus) {
        return this.updateTask(id, { status: newStatus });
    }

    async updateTaskContent(id, content) {
        return this.updateTask(id, { content });
    }

    async updateTaskPriority(id, priority) {
        return this.updateTask(id, { priority });
    }

    async createNewTodo(text, status = TodoService.Status.TODO, priority = 2, dueDate = null, startDate = null) {
        if (!text) return null;
        try {
            const response = await fetch('/api/tasks', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ content: text, status, priority, due_date: dueDate, start_date: startDate })
            });
            if (response.ok) {
                const newTask = await response.json();
                this.todos.push(newTask);
                this.sortTodos();
                Logger.info(`Created new task: ${text} with priority ${priority}, start date ${startDate} and due date ${dueDate}`);
                return newTask;
            }
        } catch (error) {
            Logger.error('Failed to create task:', error);
        }
        return null;
    }

    sortTodos() {
        // 按 priority 昇冪 (1 高 > 2 中 > 3 低) 及 created_at 降冪 (新 > 舊) 排序 (FR-010)
        this.todos.sort((a, b) => {
            if (a.priority !== b.priority) {
                return (a.priority || 2) - (b.priority || 2);
            }
            return new Date(b.created_at) - new Date(a.created_at);
        });
    }

    getTasksByStatus(status) {
        return this.todos.filter(t => t.status === status);
    }

    async deleteTask(id) {
        try {
            const response = await fetch(`/api/tasks/${id}`, { method: 'DELETE' });
            if (response.ok) {
                this.todos = this.todos.filter(t => t.id !== id);
                Logger.info(`Deleted task ${id}`);
            }
        } catch (error) {
            Logger.error('Failed to delete task:', error);
        }
        return this.todos;
    }

    async clearCompleted() {
        const completedTasks = this.todos.filter(t => t.status === TodoService.Status.DONE);
        for (const task of completedTasks) {
            await this.deleteTask(task.id);
        }
        return this.todos;
    }

    // For todo.test.js compatibility
    static migrateLegacyData(todos) {
        return { migrated: todos.map(t => ({ ...t, status: t.completed ? TodoService.Status.DONE : TodoService.Status.TODO, createdAt: new Date().toISOString() })), modified: true };
    }

    filterTodoList(filter) {
        if (filter === 'active') return this.todos.filter(t => t.status !== TodoService.Status.DONE);
        if (filter === 'completed') return this.todos.filter(t => t.status === TodoService.Status.DONE);
        return this.todos;
    }
}

function unescapeHTML(str) {
    if (!str) return '';
    const doc = new DOMParser().parseFromString(str, 'text/html');
    return doc.documentElement.textContent;
}

export function formatDateTime(date) {
    if (!date) return '';
    const d = new Date(date);
    return `${d.getMonth() + 1}/${d.getDate()} ${d.getHours().toString().padStart(2, '0')}:${d.getMinutes().toString().padStart(2, '0')}`;
}

if (typeof document !== 'undefined') {
document.addEventListener('DOMContentLoaded', async () => {
    const todoService = new TodoService();
    let currentFilter = 'all';
    let activeTabStatus = sessionStorage.getItem('activeTabStatus') || TodoService.Status.TODO;

    const kanbanContainer = document.getElementById('kanban-container');
    const kanbanScrollTop = document.getElementById('kanban-scroll-top');
    const kanbanDummyContent = document.getElementById('kanban-dummy-content');

    if (kanbanScrollTop && kanbanDummyContent && kanbanContainer) {
        // T009: 初始化 ResizeObserver 監聽看板寬度變化
        const resizeObserver = new ResizeObserver(() => {
            const scrollWidth = kanbanContainer.scrollWidth;
            kanbanDummyContent.style.width = scrollWidth + 'px';
            
            // 寬度不足時自動隱藏邏輯
            if (scrollWidth <= kanbanContainer.clientWidth) {
                kanbanScrollTop.style.display = 'none';
            } else {
                kanbanScrollTop.style.display = 'block';
            }
        });
        resizeObserver.observe(kanbanContainer);

        // T010: 實作雙向捲動同步，使用 UISync.sync 確保效能
        kanbanScrollTop.onscroll = () => UISync.sync(kanbanScrollTop, kanbanContainer);
        kanbanContainer.onscroll = () => UISync.sync(kanbanContainer, kanbanScrollTop);
    }

    const mobileTabs = document.getElementById('mobile-tabs');
    const itemsLeft = document.getElementById('items-left');
    const filterBtns = document.querySelectorAll('.filter-btn');
    const clearCompletedBtn = document.getElementById('clear-completed');
    const currentDateDisplay = document.getElementById('current-date');
    const themeToggle = document.getElementById('theme-toggle');
    const themeIcon = themeToggle ? themeToggle.querySelector('.theme-icon') : null;
    const userDisplay = document.getElementById('user-display');
    const logoutBtn = document.getElementById('logout-btn');
    
    // Global inputs for top-level adding
    const inputSection = document.querySelector('.input-section');
    const todoInput = document.getElementById('todo-input');
    const priorityInput = document.getElementById('priority-input');
    const startDateInput = document.getElementById('start-date-input');
    const dueDateInput = document.getElementById('due-date-input');
    const addBtn = document.getElementById('add-btn');
    const saveTodoBtn = document.getElementById('save-todo-btn');

    const priorityMap = {
        'high': 1,
        'medium': 2,
        'low': 3
    };

    const reversePriorityMap = {
        1: 'high',
        2: 'medium',
        3: 'low'
    };

    const priorityLabels = {
        1: '高',
        2: '中',
        3: '低'
    };

    const columnDefinitions = [
        { status: TodoService.Status.BACKLOG, label: '需求池' },
        { status: TodoService.Status.TODO, label: '待辦' },
        { status: TodoService.Status.RUNNING, label: '進行中' },
        { status: TodoService.Status.TESTING, label: '測試中' },
        { status: TodoService.Status.DONE, label: '已完成' }
    ];

    async function init() {
        // 身份驗證檢查
        try {
            const resp = await authService.getMe();
            if (resp.ok) {
                const user = await resp.json();
                if (userDisplay) userDisplay.textContent = `你好, ${user.username} (${user.role})`;
                if (logoutBtn) logoutBtn.style.display = 'block';
            } else {
                window.location.href = 'pages/login.html';
                return;
            }
        } catch (e) {
            window.location.href = 'pages/login.html';
            return;
        }

        if (currentDateDisplay) {
            const options = { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' };
            currentDateDisplay.textContent = new Date().toLocaleDateString('zh-TW', options);
        }
        initTheme();
        await todoService.loadTodos();
        render();
    }

    function initTheme() {
        const savedTheme = localStorage.getItem('theme') || 'light';
        if (savedTheme === 'dark') {
            document.body.classList.add('dark-mode');
            if (themeIcon) themeIcon.textContent = '☀️';
        } else {
            document.body.classList.remove('dark-mode');
            if (themeIcon) themeIcon.textContent = '🌙';
        }
    }

    if (themeToggle) {
        themeToggle.addEventListener('click', () => {
            document.body.classList.toggle('dark-mode');
            const isDark = document.body.classList.contains('dark-mode');
            localStorage.setItem('theme', isDark ? 'dark' : 'light');
            if (themeIcon) themeIcon.textContent = isDark ? '☀️' : '🌙';
        });
    }

    if (logoutBtn) {
        logoutBtn.addEventListener('click', async () => {
            await authService.logout();
            window.location.href = 'pages/login.html';
        });
    }

    function render() {
        renderKanban();
        renderMobileTabs();
        updateStats();
    }

    function renderKanban() {
        if (!kanbanContainer) return;
        kanbanContainer.innerHTML = '';

        const activeColumns = getActiveColumns();
        activeColumns.forEach(colDef => {
            const columnEl = createColumnElement(colDef);
            kanbanContainer.appendChild(columnEl);
        });

        if (currentFilter === 'active') {
            const todoColumn = kanbanContainer.querySelector(`.status-${TodoService.Status.TODO}`);
            if (todoColumn) {
                todoColumn.scrollIntoView({ behavior: 'smooth', block: 'nearest', inline: 'start' });
            }
        }
    }

    function getActiveColumns() {
        if (currentFilter === 'active' || currentFilter === 'all') {
            return columnDefinitions;
        } else if (currentFilter === 'completed') {
            return columnDefinitions.filter(c => c.status === TodoService.Status.DONE);
        }
        return columnDefinitions;
    }

    function createColumnElement(colDef) {
        const tasks = todoService.getTasksByStatus(colDef.status);
        const column = document.createElement('div');
        column.className = `kanban-column status-${colDef.status} ${activeTabStatus === colDef.status ? 'active' : ''}`;
        column.dataset.status = colDef.status;

        column.innerHTML = `
            <div class="column-header">
                <h3>${colDef.label}</h3>
                <span class="task-count">${tasks.length}</span>
            </div>
            <div class="column-content" id="content-${colDef.status}"></div>
            <div class="quick-add">
                <textarea class="quick-add-input" rows="10" placeholder="+ 快速新增任務..." data-status="${colDef.status}"></textarea>
            </div>
        `;

        const content = column.querySelector('.column-content');
        tasks.forEach(task => {
            content.appendChild(createTaskElement(task));
        });

        const quickAddInput = column.querySelector('.quick-add-input');
        quickAddInput.addEventListener('keydown', async (e) => {
            if ((e.ctrlKey || e.metaKey) && e.key === 'Enter' && quickAddInput.value.trim()) {
                e.preventDefault();
                await todoService.createNewTodo(quickAddInput.value.trim(), colDef.status);
                quickAddInput.value = '';
                render();
            }
        });

        return column;
    }

    function createTaskElement(todo) {
        const item = document.createElement('div');
        const priorityClass = `priority-${reversePriorityMap[todo.priority || 2]}`;
        
        // 逾期判定 (FR-011)
        let overdueClass = '';
        if (todo.due_date && todo.status !== TodoService.Status.DONE) {
            const today = new Date();
            today.setHours(0, 0, 0, 0);
            const due = new Date(todo.due_date);
            due.setHours(0, 0, 0, 0);
            if (due < today) {
                overdueClass = 'overdue-highlight';
            }
        }

        item.className = `todo-item ${todo.status === TodoService.Status.DONE ? 'completed' : ''} ${priorityClass} ${overdueClass}`;
        
        let timeLabelText = `建立於: ${formatDateTime(todo.created_at)}`;
        if (todo.start_date || todo.due_date) {
            timeLabelText += ' | ';
            if (todo.start_date) timeLabelText += `起始: ${todo.start_date}`;
            if (todo.start_date && todo.due_date) timeLabelText += ' 至 ';
            if (todo.due_date) timeLabelText += `截止: ${todo.due_date}`;
        }

        const checkbox = document.createElement('input');
        checkbox.type = 'checkbox';
        checkbox.checked = todo.status === TodoService.Status.DONE;

        const todoContent = document.createElement('div');
        todoContent.className = 'todo-content';

        const headerRow = document.createElement('div');
        headerRow.className = 'todo-header-row';

        const statusSelect = document.createElement('select');
        statusSelect.className = 'status-select';
        columnDefinitions.forEach(opt => {
            const option = document.createElement('option');
            option.value = opt.status;
            option.textContent = opt.label;
            option.selected = todo.status === opt.status;
            statusSelect.appendChild(option);
        });

        const prioritySelect = document.createElement('select');
        prioritySelect.className = 'priority-select-item';
        [1, 2, 3].forEach(p => {
            const option = document.createElement('option');
            option.value = p;
            option.textContent = priorityLabels[p];
            option.selected = todo.priority === p;
            prioritySelect.appendChild(option);
        });

        const textDisplay = document.createElement('div');
        textDisplay.className = 'todo-text-display';
        textDisplay.innerHTML = todo.content; // 使用 innerHTML 以解析後端脫逸的字元

        const textInput = document.createElement('textarea');
        textInput.className = 'todo-text edit-mode';
        textInput.value = unescapeHTML(todo.content); // 編輯時還原為原始文字
        textInput.style.display = 'none';

        // T013: 渲染日期編輯器與錯誤訊息容器
        const dateEditRow = document.createElement('div');
        dateEditRow.className = 'todo-date-edit-row';
        dateEditRow.style.display = 'none';
        dateEditRow.innerHTML = `
            <div class="edit-date-inputs">
                <input type="date" class="edit-start-date" value="${todo.start_date || ''}">
                <span>至</span>
                <input type="date" class="edit-due-date" value="${todo.due_date || ''}">
            </div>
            <div class="error-message">起始日期不能晚於截止日期</div>
        `;

        const editStartInput = dateEditRow.querySelector('.edit-start-date');
        const editDueInput = dateEditRow.querySelector('.edit-due-date');
        const errorMsg = dateEditRow.querySelector('.error-message');

        const toggleEditMode = (isEditing) => {
            if (isEditing) {
                textDisplay.style.display = 'none';
                textInput.style.display = 'block';
                dateEditRow.style.display = 'block';
                textInput.rows = 10;
                textInput.focus();
            } else {
                textInput.style.display = 'none';
                dateEditRow.style.display = 'none';
                textDisplay.style.display = '';
                
                // 重置驗證狀態
                editStartInput.classList.remove('invalid');
                editDueInput.classList.remove('invalid');
                errorMsg.style.display = 'none';
            }
        };

        textDisplay.addEventListener('click', () => toggleEditMode(true));

        const timeLabel = document.createElement('span');
        timeLabel.className = 'todo-time';
        timeLabel.textContent = timeLabelText;

        const deleteBtn = document.createElement('button');
        deleteBtn.className = 'delete-btn';
        deleteBtn.innerHTML = '&times;';

        headerRow.appendChild(statusSelect);
        headerRow.appendChild(prioritySelect);
        headerRow.appendChild(textDisplay);
        headerRow.appendChild(textInput);
        
        todoContent.appendChild(headerRow);
        todoContent.appendChild(dateEditRow);
        todoContent.appendChild(timeLabel);

        item.appendChild(checkbox);
        item.appendChild(todoContent);
        item.appendChild(deleteBtn);

        checkbox.addEventListener('change', async () => {
            const newStatus = checkbox.checked ? TodoService.Status.DONE : TodoService.Status.TODO;
            await todoService.updateTaskStatus(todo.id, newStatus);
            render();
        });

        statusSelect.addEventListener('change', async (e) => {
            await todoService.updateTaskStatus(todo.id, e.target.value);
            render();
        });

        prioritySelect.addEventListener('change', async (e) => {
            await todoService.updateTaskPriority(todo.id, parseInt(e.target.value));
            render();
        });

        textInput.addEventListener('blur', async () => {
            // 使用 setTimeout 確保能抓取到新的 focus 元素 (document.activeElement)
            setTimeout(async () => {
                const activeEl = document.activeElement;
                // 如果焦點移到了日期輸入框，則不關閉編輯模式
                if (activeEl === editStartInput || activeEl === editDueInput) {
                    return;
                }

                const newContent = textInput.value.trim();
                const newStart = editStartInput.value || null;
                const newDue = editDueInput.value || null;

                // T015: 調用 taskService.validateDateRange
                if (!taskService.validateDateRange(newStart, newDue)) {
                    editStartInput.classList.add('invalid');
                    editDueInput.classList.add('invalid');
                    errorMsg.style.display = 'block';
                    // 保持編輯模式
                    textInput.focus();
                    return;
                }

                toggleEditMode(false);
                
                const hasContentChanged = newContent !== todo.content;
                const hasStartChanged = (newStart || '') !== (todo.start_date || '');
                const hasDueChanged = (newDue || '') !== (todo.due_date || '');

                if (hasContentChanged || hasStartChanged || hasDueChanged) {
                    // T016: 支援傳送 null (透過 updateTask 統一處理)
                    await todoService.updateTask(todo.id, { 
                        content: newContent,
                        start_date: newStart,
                        due_date: newDue
                    });
                    render();
                }
            }, 200);
        });

        // 防止日期輸入框的點擊事件冒泡，並處理其失去焦點時的儲存邏輯
        const handleInputBlur = () => {
            setTimeout(() => {
                const activeEl = document.activeElement;
                // 如果焦點離開了所有編輯控制項，則觸發 textInput 的 blur 邏輯進行儲存
                if (activeEl !== textInput && activeEl !== editStartInput && activeEl !== editDueInput) {
                    textInput.blur();
                }
            }, 200);
        };

        editStartInput.addEventListener('blur', handleInputBlur);
        editDueInput.addEventListener('blur', handleInputBlur);
        dateEditRow.addEventListener('click', (e) => e.stopPropagation());

        textInput.addEventListener('keydown', async (e) => {
            if ((e.ctrlKey || e.metaKey) && e.key === 'Enter') {
                e.preventDefault();
                textInput.blur(); // 觸發 blur 以儲存
            }
        });

        deleteBtn.addEventListener('click', async () => {
            await todoService.deleteTask(todo.id);
            render();
        });

        return item;
    }

    function renderMobileTabs() {
        if (!mobileTabs) return;
        mobileTabs.innerHTML = '';
        const activeColumns = getActiveColumns();

        activeColumns.forEach(col => {
            const btn = document.createElement('button');
            btn.className = `tab-btn ${activeTabStatus === col.status ? 'active' : ''}`;
            btn.textContent = col.label;
            btn.addEventListener('click', () => {
                activeTabStatus = col.status;
                sessionStorage.setItem('activeTabStatus', activeTabStatus);
                render();
            });
            mobileTabs.appendChild(btn);
        });
    }

    function updateStats() {
        const activeCount = todoService.getTodos().filter(t => t.status !== TodoService.Status.DONE).length;
        if (itemsLeft) itemsLeft.textContent = `${activeCount} 個項目待辦`;
    }

    async function addTodo() {
        if (!todoInput) return;
        const text = todoInput.value.trim();
        const priorityValue = priorityInput ? priorityInput.value : 'medium';
        const priority = priorityMap[priorityValue] || 2;
        const startDate = startDateInput ? startDateInput.value : null;
        const dueDate = dueDateInput ? dueDateInput.value : null;
        
        // 起始日期必填驗證 (US8/FR-013)
        if (!startDate) {
            window.alert('請選擇起始日期');
            if (startDateInput) startDateInput.focus();
            return;
        }

        const success = await todoService.createNewTodo(text, TodoService.Status.TODO, priority, dueDate, startDate);
        if (success) {
            todoInput.value = '';
            if (startDateInput) startDateInput.value = '';
            if (dueDateInput) dueDateInput.value = '';
            if (inputSection) inputSection.style.display = 'none';
            render();
        }
    }

    if (addBtn) {
        addBtn.addEventListener('click', () => {
            if (inputSection) {
                const isHidden = window.getComputedStyle(inputSection).display === 'none';
                inputSection.style.display = isHidden ? 'flex' : 'none';
                if (isHidden && todoInput) todoInput.focus();
            }
        });
    }

    if (saveTodoBtn) saveTodoBtn.addEventListener('click', addTodo);

    if (todoInput) {
        todoInput.addEventListener('keydown', (e) => {
            if ((e.ctrlKey || e.metaKey) && e.key === 'Enter') {
                e.preventDefault();
                addTodo();
            }
        });
    }

    filterBtns.forEach(btn => {
        btn.addEventListener('click', (e) => {
            e.preventDefault(); // T018: 防止預設行為導致的捲動
            filterBtns.forEach(b => b.classList.remove('active'));
            btn.classList.add('active');
            currentFilter = btn.getAttribute('data-filter');
            const availableCols = getActiveColumns();
            if (!availableCols.find(c => c.status === activeTabStatus)) {
                activeTabStatus = availableCols[0].status;
                sessionStorage.setItem('activeTabStatus', activeTabStatus);
            }
            render();
        });
    });

    if (clearCompletedBtn) {
        clearCompletedBtn.addEventListener('click', async () => {
            await todoService.clearCompleted();
            render();
        });
    }

    await init();
});
}
