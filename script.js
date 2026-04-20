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
    const themeIcon = themeToggle.querySelector('.theme-icon');

    // 顯示當前日期
    const options = { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' };
    currentDateDisplay.textContent = new Date().toLocaleDateString('zh-TW', options);

    // 主題切換功能
    function initTheme() {
        const savedTheme = localStorage.getItem('theme') || 'light';
        if (savedTheme === 'dark') {
            document.body.classList.add('dark-mode');
            themeIcon.textContent = '☀️';
        } else {
            document.body.classList.remove('dark-mode');
            themeIcon.textContent = '🌙';
        }
    }

    themeToggle.addEventListener('click', () => {
        document.body.classList.toggle('dark-mode');
        const isDark = document.body.classList.contains('dark-mode');
        localStorage.setItem('theme', isDark ? 'dark' : 'light');
        themeIcon.textContent = isDark ? '☀️' : '🌙';
    });

    initTheme();

    let todos = JSON.parse(localStorage.getItem('todos')) || [];
    
    // T001 & T002: 資料遷移邏輯
    function migrateLegacyData(data) {
        let modified = false;
        const migrated = data.map(todo => {
            if (!todo.status) {
                todo.status = todo.completed ? 'done' : 'todo';
                modified = true;
            }
            // 確保所有任務都有 createdAt
            if (!todo.createdAt) {
                todo.createdAt = new Date().toISOString();
                modified = true;
            }
            return todo;
        });
        
        if (modified) {
            localStorage.setItem('todos', JSON.stringify(migrated));
        }
        return migrated;
    }

    // 執行遷移並加載資料
    todos = migrateLegacyData(todos);

    let currentFilter = 'all';

    // 初始化渲染
    renderTodos();

    // 格式化日期與時間
    function formatDateTime(date) {
        if (!date) return '';
        const d = new Date(date);
        return `${d.getMonth() + 1}/${d.getDate()} ${d.getHours().toString().padStart(2, '0')}:${d.getMinutes().toString().padStart(2, '0')}`;
    }

    // 新增任務
    function addTodo() {
        const text = todoInput.value.trim();
        const priority = priorityInput.value;
        if (text === '') return;

        const newTodo = {
            id: Date.now(),
            text: text,
            completed: false,
            status: 'todo', // 預設狀態為 Todo
            priority: priority,
            createdAt: new Date().toISOString(),
            completedAt: null
        };

        todos.push(newTodo);
        saveAndRender();
        todoInput.value = '';
        priorityInput.value = 'medium'; // 重設為中
    }

    // 更新任務內容
    function updateTodo(id, newText) {
        todos = todos.map(todo => 
            todo.id === id ? { ...todo, text: newText } : todo
        );
        saveAndRender();
    }

    // 更新任務狀態
    function updateStatus(id, newStatus) {
        todos = todos.map(todo => {
            if (todo.id === id) {
                const isDone = newStatus === 'done';
                const isTesting = newStatus === 'testing';
                return {
                    ...todo,
                    status: newStatus,
                    completed: isDone,
                    completedAt: isDone ? (todo.completedAt || new Date().toISOString()) : null,
                    testedAt: isTesting ? (todo.testedAt || new Date().toISOString()) : todo.testedAt
                };
            }
            return todo;
        });
        saveAndRender();
    }

    // 刪除任務
    function deleteTodo(id) {
        todos = todos.filter(todo => todo.id !== id);
        saveAndRender();
    }

    // 儲存並重新渲染
    function saveAndRender() {
        localStorage.setItem('todos', JSON.stringify(todos));
        renderTodos();
    }

    // 切換勾選狀態 (與狀態連動)
    function toggleTodo(id) {
        todos = todos.map(todo => {
            if (todo.id === id) {
                const isNowCompleted = !todo.completed;
                return { 
                    ...todo, 
                    completed: isNowCompleted,
                    status: isNowCompleted ? 'done' : 'todo',
                    completedAt: isNowCompleted ? new Date().toISOString() : null,
                    testedAt: isNowCompleted ? todo.testedAt : null // 勾選完成時保留測試時間，取消則清空
                };
            }
            return todo;
        });
        saveAndRender();
    }

    // 事件監聽
    addBtn.addEventListener('click', addTodo);
    todoInput.addEventListener('keypress', (e) => {
        if (e.key === 'Enter') addTodo();
    });

    // 渲染函數
    function renderTodos() {
        let filteredTodos = todos;
        if (currentFilter === 'active') {
            filteredTodos = todos.filter(t => t.status !== 'done');
        } else if (currentFilter === 'completed') {
            filteredTodos = todos.filter(t => t.status === 'done');
        }

        todoList.innerHTML = '';
        
        filteredTodos.forEach(todo => {
            const li = document.createElement('li');
            li.className = `todo-item ${todo.completed ? 'completed' : ''} status-${todo.status}`;
            
            let timeLabel = `建立於: ${formatDateTime(todo.createdAt)}`;
            if (todo.status === 'testing' && todo.testedAt) {
                timeLabel = `測試於: ${formatDateTime(todo.testedAt)}`;
            } else if (todo.completed && todo.completedAt) {
                timeLabel = `完成於: ${formatDateTime(todo.completedAt)}`;
            }
            
            const timeInfo = `<span class="todo-time">${timeLabel}</span>`;

            const priorityLabels = { low: '低', medium: '中', high: '高' };
            const priorityBadge = `<span class="priority-badge priority-${todo.priority || 'medium'}" data-id="${todo.id}">${priorityLabels[todo.priority || 'medium']}</span>`;

            const statusOptions = [
                { value: 'backlog', label: 'Backlog' },
                { value: 'todo', label: 'Todo' },
                { value: 'running', label: 'Running' },
                { value: 'testing', label: 'Testing' },
                { value: 'done', label: 'Done' }
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

            // 事件綁定
            const checkbox = li.querySelector('input[type="checkbox"]');
            checkbox.addEventListener('change', () => toggleTodo(todo.id));

            const statusSelect = li.querySelector('.status-select');
            statusSelect.addEventListener('change', (e) => updateStatus(todo.id, e.target.value));

            const badge = li.querySelector('.priority-badge');
            badge.addEventListener('click', () => {
                const levels = ['low', 'medium', 'high'];
                const currentIdx = levels.indexOf(todo.priority || 'medium');
                const nextIdx = (currentIdx + 1) % levels.length;
                const nextPriority = levels[nextIdx];
                
                todos = todos.map(t => t.id === todo.id ? { ...t, priority: nextPriority } : t);
                saveAndRender();
            });

            const textInput = li.querySelector('.todo-text');
            textInput.addEventListener('blur', () => {
                if (textInput.value.trim() !== todo.text) {
                    updateTodo(todo.id, textInput.value.trim());
                }
            });
            textInput.addEventListener('keypress', (e) => {
                if (e.key === 'Enter') textInput.blur();
            });

            const deleteBtn = li.querySelector('.delete-btn');
            deleteBtn.addEventListener('click', () => deleteTodo(todo.id));

            todoList.appendChild(li);
        });

        // 更新統計
        const activeCount = todos.filter(t => t.status !== 'done').length;
        itemsLeft.textContent = `${activeCount} 個項目待辦`;
    }

    // 過濾功能
    filterBtns.forEach(btn => {
        btn.addEventListener('click', () => {
            filterBtns.forEach(b => b.classList.remove('active'));
            btn.classList.add('active');
            currentFilter = btn.getAttribute('data-filter');
            renderTodos();
        });
    });

    // 清除已完成
    clearCompletedBtn.addEventListener('click', () => {
        todos = todos.filter(t => !t.completed);
        saveAndRender();
    });
});
