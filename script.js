document.addEventListener('DOMContentLoaded', () => {
    const todoInput = document.getElementById('todo-input');
    const priorityInput = document.getElementById('priority-input');
    const addBtn = document.getElementById('add-btn');
    const todoList = document.getElementById('todo-list');
    const itemsLeft = document.getElementById('items-left');
    const filterBtns = document.querySelectorAll('.filter-btn');
    const clearCompletedBtn = document.getElementById('clear-completed');
    const currentDateDisplay = document.getElementById('current-date');

    // 顯示當前日期
    const options = { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' };
    currentDateDisplay.textContent = new Date().toLocaleDateString('zh-TW', options);

    let todos = JSON.parse(localStorage.getItem('todos')) || [];
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

    // 切換狀態
    function toggleTodo(id) {
        todos = todos.map(todo => {
            if (todo.id === id) {
                const isCompleted = !todo.completed;
                return { 
                    ...todo, 
                    completed: isCompleted,
                    completedAt: isCompleted ? new Date().toISOString() : null
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
            filteredTodos = todos.filter(t => !t.completed);
        } else if (currentFilter === 'completed') {
            filteredTodos = todos.filter(t => t.completed);
        }

        todoList.innerHTML = '';
        
        filteredTodos.forEach(todo => {
            const li = document.createElement('li');
            li.className = `todo-item ${todo.completed ? 'completed' : ''}`;
            
            const timeInfo = todo.completed 
                ? `<span class="todo-time">完成於: ${formatDateTime(todo.completedAt)}</span>`
                : `<span class="todo-time">建立於: ${formatDateTime(todo.createdAt)}</span>`;

            const priorityLabels = { low: '低', medium: '中', high: '高' };
            const priorityBadge = `<span class="priority-badge priority-${todo.priority || 'medium'}" data-id="${todo.id}">${priorityLabels[todo.priority || 'medium']}</span>`;

            li.innerHTML = `
                <input type="checkbox" ${todo.completed ? 'checked' : ''}>
                <div class="todo-content">
                    <div style="display: flex; align-items: center;">
                        ${priorityBadge}
                        <input type="text" class="todo-text" value="${todo.text}">
                    </div>
                    ${timeInfo}
                </div>
                <button class="delete-btn" aria-label="Delete">&times;</button>
            `;

            // 事件綁定
            const checkbox = li.querySelector('input[type="checkbox"]');
            checkbox.addEventListener('change', () => toggleTodo(todo.id));

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
        const activeCount = todos.filter(t => !t.completed).length;
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
