// 提取核心邏輯以利測試
// 憲法要求：封裝日誌記錄
const Logger = {
    info: (...args) => console.log(`[INFO] ${new Date().toISOString()}:`, ...args),
    error: (...args) => console.error(`[ERROR] ${new Date().toISOString()}:`, ...args)
};

class TodoService {
    static Status = {
        BACKLOG: 'backlog',
        TODO: 'todo',
        RUNNING: 'running',
        TESTING: 'testing',
        DONE: 'done'
    };

    static migrateLegacyData(data) {
        let modified = false;
        const migrated = data.map(todo => {
            if (!todo.status) {
                todo.status = todo.completed ? TodoService.Status.DONE : TodoService.Status.TODO;
                modified = true;
            }
            if (!todo.createdAt) {
                todo.createdAt = new Date().toISOString();
                modified = true;
            }
            if (!todo.updatedAt) {
                todo.updatedAt = todo.createdAt || new Date().toISOString();
                modified = true;
            }
            return todo;
        });
        
        return { migrated, modified };
    }

    constructor() {
        const rawTodos = JSON.parse(localStorage.getItem('todos')) || [];
        const migrationResult = TodoService.migrateLegacyData(rawTodos);
        this.todos = migrationResult.migrated;
        if (migrationResult.modified) {
            this.save();
        }
        Logger.info(`TodoService initialized with ${this.todos.length} items.`);
    }

    save() {
        localStorage.setItem('todos', JSON.stringify(this.todos));
        Logger.info(`Saved ${this.todos.length} items to storage.`);
    }

    getTodos() {
        return this.todos;
    }

    updateTaskStatus(id, newStatus) {
        this.todos = this.todos.map(todo => {
            if (todo.id === id) {
                const isDone = newStatus === TodoService.Status.DONE;
                const isTesting = newStatus === TodoService.Status.TESTING;
                Logger.info(`Task ${id} status changing from ${todo.status} to ${newStatus}`);
                return {
                    ...todo,
                    status: newStatus,
                    completed: isDone,
                    completedAt: isDone ? (todo.completedAt || new Date().toISOString()) : todo.completedAt,
                    testedAt: isTesting ? (todo.testedAt || new Date().toISOString()) : todo.testedAt,
                    updatedAt: new Date().toISOString()
                };
            }
            return todo;
        });
        this.save();
        return this.todos;
    }

    updateTaskProperty(id, property, value) {
        this.todos = this.todos.map(todo => {
            if (todo.id === id) {
                return { ...todo, [property]: value, updatedAt: new Date().toISOString() };
            }
            return todo;
        });
        this.save();
        return this.todos;
    }

    createNewTodo(text, status = TodoService.Status.TODO, priority = 'medium') {
        if (!text) return null;
        const newTodo = {
            id: Date.now(),
            text: text,
            completed: status === TodoService.Status.DONE,
            status: status,
            priority: priority,
            createdAt: new Date().toISOString(),
            updatedAt: new Date().toISOString(),
            completedAt: status === TodoService.Status.DONE ? new Date().toISOString() : null
        };
        this.todos.push(newTodo);
        this.save();
        Logger.info(`Created new task in status ${status}: ${text}`);
        return newTodo;
    }

    filterTodoList(currentFilter) {
        Logger.info(`Filtering tasks for mode: ${currentFilter}`);
        if (currentFilter === 'active') {
            return this.todos.filter(t => t.status !== TodoService.Status.DONE);
        } else if (currentFilter === 'completed') {
            return this.todos.filter(t => t.status === TodoService.Status.DONE);
        }
        return this.todos;
    }

    getTasksByStatus(status) {
        return this.todos.filter(t => t.status === status);
    }

    deleteTask(id) {
        const taskToDelete = this.todos.find(t => t.id === id);
        if (taskToDelete) {
            Logger.info(`Deleting task ${id}: ${taskToDelete.text}`);
            this.todos = this.todos.filter(t => t.id !== id);
            this.save();
        }
        return this.todos;
    }

    clearCompleted() {
        const completedCount = this.todos.filter(t => t.status === TodoService.Status.DONE).length;
        if (completedCount > 0) {
            Logger.info(`Clearing ${completedCount} completed tasks`);
            this.todos = this.todos.filter(t => t.status !== TodoService.Status.DONE);
            this.save();
        }
        return this.todos;
    }
}

function formatDateTime(date) {
    if (!date) return '';
    const d = new Date(date);
    return `${d.getMonth() + 1}/${d.getDate()} ${d.getHours().toString().padStart(2, '0')}:${d.getMinutes().toString().padStart(2, '0')}`;
}

// 匯出功能供測試使用
if (typeof module !== 'undefined' && module.exports) {
    module.exports = { TodoService, formatDateTime };
}

document.addEventListener('DOMContentLoaded', () => {
    const todoService = new TodoService();
    let currentFilter = 'all';
    let activeTabStatus = sessionStorage.getItem('activeTabStatus') || TodoService.Status.TODO;

    const kanbanContainer = document.getElementById('kanban-container');
    const mobileTabs = document.getElementById('mobile-tabs');
    const itemsLeft = document.getElementById('items-left');
    const filterBtns = document.querySelectorAll('.filter-btn');
    const clearCompletedBtn = document.getElementById('clear-completed');
    const currentDateDisplay = document.getElementById('current-date');
    const themeToggle = document.getElementById('theme-toggle');
    const themeIcon = themeToggle ? themeToggle.querySelector('.theme-icon') : null;
    
    // Global inputs for top-level adding
    const todoInput = document.getElementById('todo-input');
    const priorityInput = document.getElementById('priority-input');
    const addBtn = document.getElementById('add-btn');

    const columnDefinitions = [
        { status: TodoService.Status.BACKLOG, label: '需求池' },
        { status: TodoService.Status.TODO, label: '待辦' },
        { status: TodoService.Status.RUNNING, label: '進行中' },
        { status: TodoService.Status.TESTING, label: '測試中' },
        { status: TodoService.Status.DONE, label: '已完成' }
    ];

    function init() {
        if (currentDateDisplay) {
            const options = { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' };
            currentDateDisplay.textContent = new Date().toLocaleDateString('zh-TW', options);
        }
        initTheme();
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

        // A1: Visual Focus Alignment
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
                <input type="text" class="quick-add-input" placeholder="+ 快速新增任務..." data-status="${colDef.status}">
            </div>
        `;

        const content = column.querySelector('.column-content');
        tasks.forEach(task => {
            content.appendChild(createTaskElement(task));
        });

        // Event: Quick Add
        const quickAddInput = column.querySelector('.quick-add-input');
        quickAddInput.addEventListener('keypress', (e) => {
            if (e.key === 'Enter' && quickAddInput.value.trim()) {
                todoService.createNewTodo(quickAddInput.value.trim(), colDef.status);
                quickAddInput.value = '';
                render();
            }
        });

        return column;
    }

    function createTaskElement(todo) {
        const item = document.createElement('div');
        item.className = `todo-item ${todo.completed ? 'completed' : ''}`;
        
        let timeLabelText = `建立於: ${formatDateTime(todo.createdAt)}`;
        if (todo.status === TodoService.Status.TESTING && todo.testedAt) {
            timeLabelText = `測試於: ${formatDateTime(todo.testedAt)}`;
        } else if (todo.completed && todo.completedAt) {
            timeLabelText = `完成於: ${formatDateTime(todo.completedAt)}`;
        }

        const priorityLabels = { low: '低', medium: '中', high: '高' };
        
        // Create components safely
        const checkbox = document.createElement('input');
        checkbox.type = 'checkbox';
        checkbox.checked = todo.completed;

        const todoContent = document.createElement('div');
        todoContent.className = 'todo-content';

        const headerRow = document.createElement('div');
        headerRow.className = 'todo-header-row';

        const priorityBadge = document.createElement('span');
        priorityBadge.className = `priority-badge priority-${todo.priority || 'medium'}`;
        priorityBadge.textContent = priorityLabels[todo.priority || 'medium'];

        const statusSelect = document.createElement('select');
        statusSelect.className = 'status-select';
        columnDefinitions.forEach(opt => {
            const option = document.createElement('option');
            option.value = opt.status;
            option.textContent = opt.label;
            option.selected = todo.status === opt.status;
            statusSelect.appendChild(option);
        });

        const textInput = document.createElement('input');
        textInput.type = 'text';
        textInput.className = 'todo-text';
        textInput.value = todo.text;

        const timeLabel = document.createElement('span');
        timeLabel.className = 'todo-time';
        timeLabel.textContent = timeLabelText;

        const deleteBtn = document.createElement('button');
        deleteBtn.className = 'delete-btn';
        deleteBtn.innerHTML = '&times;'; // Safe for static entities

        // Assembly
        headerRow.appendChild(priorityBadge);
        headerRow.appendChild(statusSelect);
        headerRow.appendChild(textInput);
        
        todoContent.appendChild(headerRow);
        todoContent.appendChild(timeLabel);

        item.appendChild(checkbox);
        item.appendChild(todoContent);
        item.appendChild(deleteBtn);

        // Listeners
        checkbox.addEventListener('change', () => {
            const newStatus = checkbox.checked ? TodoService.Status.DONE : TodoService.Status.TODO;
            todoService.updateTaskStatus(todo.id, newStatus);
            render();
        });

        statusSelect.addEventListener('change', (e) => {
            todoService.updateTaskStatus(todo.id, e.target.value);
            render();
        });

        textInput.addEventListener('blur', () => {
            if (textInput.value.trim() !== todo.text) {
                todoService.updateTaskProperty(todo.id, 'text', textInput.value.trim());
                render();
            }
        });

        deleteBtn.addEventListener('click', () => {
            todoService.deleteTask(todo.id);
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

    // Top-level Adding
    function addTodo() {
        if (!todoInput) return;
        const text = todoInput.value.trim();
        const priority = priorityInput ? priorityInput.value : 'medium';
        todoService.createNewTodo(text, TodoService.Status.TODO, priority);
        todoInput.value = '';
        if (priorityInput) priorityInput.value = 'medium';
        render();
    }

    if (addBtn) addBtn.addEventListener('click', addTodo);
    if (todoInput) {
        todoInput.addEventListener('keypress', (e) => {
            if (e.key === 'Enter') addTodo();
        });
    }

    filterBtns.forEach(btn => {
        btn.addEventListener('click', () => {
            filterBtns.forEach(b => b.classList.remove('active'));
            btn.classList.add('active');
            currentFilter = btn.getAttribute('data-filter');
            // Reset active tab for mobile when changing filters (A6)
            const availableCols = getActiveColumns();
            if (!availableCols.find(c => c.status === activeTabStatus)) {
                activeTabStatus = availableCols[0].status;
                sessionStorage.setItem('activeTabStatus', activeTabStatus);
            }
            render();
        });
    });

    if (clearCompletedBtn) {
        clearCompletedBtn.addEventListener('click', () => {
            todoService.clearCompleted();
            render();
        });
    }

    init();
});
