document.addEventListener('DOMContentLoaded', () => {
    const todoInput = document.getElementById('todo-input');
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
        if (text === '') return;

        const newTodo = {
            id: Date.now(),
            text: text,
            completed: false,
            createdAt: new Date().toISOString(),
            completedAt: null
        };

        todos.push(newTodo);
        saveAndRender();
        todoInput.value = '';
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

            li.innerHTML = `
                <input type="checkbox" ${todo.completed ? 'checked' : ''}>
                <div class="todo-content">
                    <input type="text" class="todo-text" value="${todo.text}">
                    ${timeInfo}
                </div>
                <button class="delete-btn" aria-label="Delete">&times;</button>
            `;

            // 事件綁定
            const checkbox = li.querySelector('input[type="checkbox"]');
            checkbox.addEventListener('change', () => toggleTodo(todo.id));

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
