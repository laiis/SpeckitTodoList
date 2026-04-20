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
                // 審計要求：狀態回退時不清除時間戳記，僅在進入目標狀態時確保有時間
                return {
                    ...todo,
                    status: newStatus,
                    completed: isDone,
                    completedAt: isDone ? (todo.completedAt || new Date().toISOString()) : todo.completedAt,
                    testedAt: isTesting ? (todo.testedAt || new Date().toISOString()) : todo.testedAt,
                    updatedAt: new Date().toISOString() // Update updatedAt on status change
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

    createNewTodo(text, priority) {
        if (!text) return null;
        const newTodo = {
            id: Date.now(),
            text: text,
            completed: false,
            status: TodoService.Status.TODO,
            priority: priority || 'medium',
            createdAt: new Date().toISOString(),
            updatedAt: new Date().toISOString(), // Set updatedAt on creation
            completedAt: null
        };
        this.todos.push(newTodo);
        this.save();
        return newTodo;
    }

    filterTodoList(currentFilter) {
        if (currentFilter === 'active') {
            return this.todos.filter(t => t.status !== TodoService.Status.DONE);
        } else if (currentFilter === 'completed') {
            return this.todos.filter(t => t.status === TodoService.Status.DONE);
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
    // Create an instance of TodoService
    const todoService = new TodoService();
    let currentFilter = 'all'; // Moved from global

    const todoInput = document.getElementById('todo-input');
    const priorityInput = document.getElementById('priority-input');
    const addBtn = document.getElementById('add-btn');
    const todoList = document.getElementById('todo-list');
    const itemsLeft = document.getElementById('items-left');
    const filterBtns = document.querySelectorAll('.filter-btn');
    const clearCompletedBtn = document.getElementById('clear-completed');
    const currentDateDisplay = document.getElementById('current-date');
    const themeToggle = document.getElementById('theme-toggle');
    const themeIcon = themeToggle ? themeToggle.querySelector('.theme-icon') : null;

    if (currentDateDisplay) {
        const options = { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' };
        currentDateDisplay.textContent = new Date().toLocaleDateString('zh-TW', options);
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

    initTheme();

    // Initial load and migration handled by TodoService constructor
    // const rawTodos = JSON.parse(localStorage.getItem('todos')) || [];
    // const migrationResult = TodoService.migrateLegacyData(rawTodos);
    // todos = migrationResult.migrated;
    // if (migrationResult.modified) {
    //     localStorage.setItem('todos', JSON.stringify(todos));
    // }

    function renderTodos() {
        if (!todoList) return;
        const filteredTodos = todoService.filterTodoList(currentFilter); // Use todoService
        todoList.innerHTML = '';
        filteredTodos.forEach(todo => {
            const li = document.createElement('li');
            li.className = `todo-item ${todo.completed ? 'completed' : ''} status-${todo.status}`;
            let timeLabel = `建立於: ${formatDateTime(todo.createdAt)}`;
            if (todo.status === TodoService.Status.TESTING && todo.testedAt) { // Use TodoService.Status
                timeLabel = `測試於: ${formatDateTime(todo.testedAt)}`;
            } else if (todo.completed && todo.completedAt) {
                timeLabel = `完成於: ${formatDateTime(todo.completedAt)}`;
            }
            const timeInfo = `<span class="todo-time">${timeLabel}</span>`;
            const priorityLabels = { low: '低', medium: '中', high: '高' };
            const priorityBadge = `<span class="priority-badge priority-${todo.priority || 'medium'}" data-id="${todo.id}">${priorityLabels[todo.priority || 'medium']}</span>`;
            const statusOptions = [
                { value: TodoService.Status.BACKLOG, label: 'Backlog' }, // Use TodoService.Status
                { value: TodoService.Status.TODO, label: 'Todo' },      // Use TodoService.Status
                { value: TodoService.Status.RUNNING, label: 'Running' }, // Use TodoService.Status
                { value: TodoService.Status.TESTING, label: 'Testing' }, // Use TodoService.Status
                { value: TodoService.Status.DONE, label: 'Done' }       // Use TodoService.Status
            ];
            const statusDropdown = `
                <select class="status-select" data-id="${todo.id}">
                    ${statusOptions.map(opt => `<option value="${opt.value}" ${todo.status === opt.value ? 'selected' : ''}>${opt.label}</option>`).join('')}
                </select>
            `;
            li.innerHTML = `
                <input type="checkbox" ${todo.completed ? 'checked' : ''}>
                <div class="todo-content">
                    <div class="todo-header-row">
                        ${priorityBadge}
                        ${statusDropdown}
                        <input type="text" class="todo-text" value="${todo.text}">
                    </div>
                    ${timeInfo}
                </div>
                <button class="delete-btn" aria-label="Delete">&times;</button>
            `;
            const checkbox = li.querySelector('input[type="checkbox"]');
            checkbox.addEventListener('change', () => {
                const newStatus = todo.completed ? TodoService.Status.TODO : TodoService.Status.DONE; // Use TodoService.Status
                todoService.updateTaskStatus(todo.id, newStatus); // Use todoService
                renderTodos();
            });
            const statusSelect = li.querySelector('.status-select');
            statusSelect.addEventListener('change', (e) => {
                todoService.updateTaskStatus(todo.id, e.target.value); // Use todoService
                renderTodos();
            });
            const badge = li.querySelector('.priority-badge');
            badge.addEventListener('click', () => {
                const levels = ['low', 'medium', 'high'];
                const currentIdx = levels.indexOf(todo.priority || 'medium');
                const nextIdx = (currentIdx + 1) % levels.length;
                todoService.updateTaskProperty(todo.id, 'priority', levels[nextIdx]);
                renderTodos();
            });
            const textInput = li.querySelector('.todo-text');
            textInput.addEventListener('blur', () => {
                if (textInput.value.trim() !== todo.text) {
                    todoService.updateTaskProperty(todo.id, 'text', textInput.value.trim());
                    renderTodos();
                }
            });
            const deleteBtn = li.querySelector('.delete-btn');
            deleteBtn.addEventListener('click', () => {
                todoService.todos = todoService.todos.filter(t => t.id !== todo.id); // Use todoService
                todoService.save(); // Use todoService
                renderTodos();
            });
            todoList.appendChild(li);
        });
        const activeCount = todoService.getTodos().filter(t => t.status !== TodoService.Status.DONE).length; // Use todoService
        if (itemsLeft) itemsLeft.textContent = `${activeCount} 個項目待辦`;
    }

    function addTodo() { // This function also needs to use todoService
        if (!todoInput) return;
        const text = todoInput.value.trim();
        const priority = priorityInput ? priorityInput.value : 'medium';
        todoService.createNewTodo(text, priority); // Use todoService
        renderTodos();
        todoInput.value = '';
        if (priorityInput) priorityInput.value = 'medium';
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
            renderTodos();
        });
    });

    if (clearCompletedBtn) {
        clearCompletedBtn.addEventListener('click', () => {
            todoService.todos = todoService.todos.filter(t => t.status !== TodoService.Status.DONE); // Use todoService and TodoService.Status
            todoService.save(); // Use todoService
            renderTodos();
        });
    }

    renderTodos();
});
