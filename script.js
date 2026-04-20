// 提取核心邏輯以利測試
// 憲法要求：封裝日誌記錄
const Logger = {
    info: (...args) => console.log(`[INFO] ${new Date().toISOString()}:`, ...args),
    error: (...args) => console.error(`[ERROR] ${new Date().toISOString()}:`, ...args)
};

const Status = {
    BACKLOG: 'backlog',
    TODO: 'todo',
    RUNNING: 'running',
    TESTING: 'testing',
    DONE: 'done'
};

function migrateLegacyData(data) {
    let modified = false;
    const migrated = data.map(todo => {
        if (!todo.status) {
            todo.status = todo.completed ? Status.DONE : Status.TODO;
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

function updateTaskStatus(todos, id, newStatus) {
    return todos.map(todo => {
        if (todo.id === id) {
            const isDone = newStatus === Status.DONE;
            const isTesting = newStatus === Status.TESTING;
            // 審計要求：狀態回退時不清除時間戳記，僅在進入目標狀態時確保有時間
            return {
                ...todo,
                status: newStatus,
                completed: isDone,
                completedAt: isDone ? (todo.completedAt || new Date().toISOString()) : todo.completedAt,
                testedAt: isTesting ? (todo.testedAt || new Date().toISOString()) : todo.testedAt
            };
        }
        return todo;
    });
}

function formatDateTime(date) {
    if (!date) return '';
    const d = new Date(date);
    return `${d.getMonth() + 1}/${d.getDate()} ${d.getHours().toString().padStart(2, '0')}:${d.getMinutes().toString().padStart(2, '0')}`;
}

function createNewTodo(text, priority) {
    if (!text) return null;
    return {
        id: Date.now(),
        text: text,
        completed: false,
        status: Status.TODO,
        priority: priority || 'medium',
        createdAt: new Date().toISOString(),
        completedAt: null
    };
}

function filterTodoList(todos, currentFilter) {
    if (currentFilter === 'active') {
        return todos.filter(t => t.status !== Status.DONE);
    } else if (currentFilter === 'completed') {
        return todos.filter(t => t.status === Status.DONE);
    }
    return todos;
}

// 全域變數以利測試
let todos = [];
let currentFilter = 'all';

// 匯出功能供測試使用
if (typeof module !== 'undefined' && module.exports) {
    module.exports = { Status, migrateLegacyData, updateTaskStatus, formatDateTime, createNewTodo, filterTodoList };
}

document.addEventListener('DOMContentLoaded', () => {
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

    const rawTodos = JSON.parse(localStorage.getItem('todos')) || [];
    const migrationResult = migrateLegacyData(rawTodos);
    todos = migrationResult.migrated;
    if (migrationResult.modified) {
        localStorage.setItem('todos', JSON.stringify(todos));
    }

    function saveAndRender() {
        localStorage.setItem('todos', JSON.stringify(todos));
        renderTodos();
    }

    function addTodo() {
        if (!todoInput) return;
        const text = todoInput.value.trim();
        const priority = priorityInput ? priorityInput.value : 'medium';
        const newTodo = createNewTodo(text, priority);
        if (!newTodo) return;
        todos.push(newTodo);
        saveAndRender();
        todoInput.value = '';
        if (priorityInput) priorityInput.value = 'medium';
    }

    if (addBtn) addBtn.addEventListener('click', addTodo);
    if (todoInput) {
        todoInput.addEventListener('keypress', (e) => {
            if (e.key === 'Enter') addTodo();
        });
    }

    function renderTodos() {
        if (!todoList) return;
        const filteredTodos = filterTodoList(todos, currentFilter);
        todoList.innerHTML = '';
        filteredTodos.forEach(todo => {
            const li = document.createElement('li');
            li.className = `todo-item ${todo.completed ? 'completed' : ''} status-${todo.status}`;
            let timeLabel = `建立於: ${formatDateTime(todo.createdAt)}`;
            if (todo.status === Status.TESTING && todo.testedAt) {
                timeLabel = `測試於: ${formatDateTime(todo.testedAt)}`;
            } else if (todo.completed && todo.completedAt) {
                timeLabel = `完成於: ${formatDateTime(todo.completedAt)}`;
            }
            const timeInfo = `<span class="todo-time">${timeLabel}</span>`;
            const priorityLabels = { low: '低', medium: '中', high: '高' };
            const priorityBadge = `<span class="priority-badge priority-${todo.priority || 'medium'}" data-id="${todo.id}">${priorityLabels[todo.priority || 'medium']}</span>`;
            const statusOptions = [
                { value: Status.BACKLOG, label: 'Backlog' },
                { value: Status.TODO, label: 'Todo' },
                { value: Status.RUNNING, label: 'Running' },
                { value: Status.TESTING, label: 'Testing' },
                { value: Status.DONE, label: 'Done' }
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
                const newStatus = todo.completed ? Status.TODO : Status.DONE;
                todos = updateTaskStatus(todos, todo.id, newStatus);
                saveAndRender();
            });
            const statusSelect = li.querySelector('.status-select');
            statusSelect.addEventListener('change', (e) => {
                todos = updateTaskStatus(todos, todo.id, e.target.value);
                saveAndRender();
            });
            const badge = li.querySelector('.priority-badge');
            badge.addEventListener('click', () => {
                const levels = ['low', 'medium', 'high'];
                const currentIdx = levels.indexOf(todo.priority || 'medium');
                const nextIdx = (currentIdx + 1) % levels.length;
                todos = todos.map(t => t.id === todo.id ? { ...t, priority: levels[nextIdx] } : t);
                saveAndRender();
            });
            const textInput = li.querySelector('.todo-text');
            textInput.addEventListener('blur', () => {
                if (textInput.value.trim() !== todo.text) {
                    todos = todos.map(t => t.id === todo.id ? { ...t, text: textInput.value.trim() } : t);
                    saveAndRender();
                }
            });
            const deleteBtn = li.querySelector('.delete-btn');
            deleteBtn.addEventListener('click', () => {
                todos = todos.filter(t => t.id !== todo.id);
                saveAndRender();
            });
            todoList.appendChild(li);
        });
        const activeCount = todos.filter(t => t.status !== Status.DONE).length;
        if (itemsLeft) itemsLeft.textContent = `${activeCount} 個項目待辦`;
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
            todos = todos.filter(t => !t.completed);
            saveAndRender();
        });
    }

    renderTodos();
});
