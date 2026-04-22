const express = require('express');
const router = express.Router();
const taskService = require('../services/taskService');
const auth = require('../middleware/auth');
const authorize = require('../middleware/rbac');

// 所有任務路由皆需登入
router.use(auth);

/**
 * GET /api/tasks
 * 取得當前使用者的任務 (Viewer, Editor, Admin 皆可)
 */
router.get('/', async (req, res) => {
  try {
    const tasks = await taskService.getTasks(req.user.id);
    res.json(tasks);
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch tasks' });
  }
});

/**
 * POST /api/tasks
 * 建立新任務 (僅限 Editor, Admin)
 */
router.post('/', authorize(['editor', 'admin']), async (req, res) => {
  const { content, status } = req.body;
  if (!content) {
    return res.status(400).json({ error: 'Content is required' });
  }

  try {
    const newTask = await taskService.createTask(req.user.id, content, status);
    res.status(201).json(newTask);
  } catch (error) {
    res.status(500).json({ error: 'Failed to create task' });
  }
});

/**
 * PATCH /api/tasks/:id
 * 更新任務 (僅限 Editor, Admin)
 */
router.patch('/:id', authorize(['editor', 'admin']), async (req, res) => {
  try {
    const updatedTask = await taskService.updateTask(req.user.id, parseInt(req.params.id), req.body);
    res.json(updatedTask);
  } catch (error) {
    if (error.message === 'Task not found or unauthorized') {
      return res.status(404).json({ error: error.message });
    }
    res.status(500).json({ error: 'Failed to update task' });
  }
});

/**
 * DELETE /api/tasks/:id
 * 刪除任務 (僅限 Editor, Admin)
 */
router.delete('/:id', authorize(['editor', 'admin']), async (req, res) => {
  try {
    await taskService.deleteTask(req.user.id, parseInt(req.params.id));
    res.json({ message: 'Task deleted successfully' });
  } catch (error) {
    if (error.message === 'Task not found or unauthorized') {
      return res.status(404).json({ error: error.message });
    }
    res.status(500).json({ error: 'Failed to delete task' });
  }
});

module.exports = router;
