// backend/routes/taskRoutes.js
const express = require('express');
const router = express.Router();
const { protect } = require('../middleware/authMiddleware');
const { authorizeRoles } = require('../middleware/roleMiddleware');
const { 
  createTask, 
  getTasks, 
  updateTaskStatus 
} = require('../controllers/taskController');

// Route Setup

// GET /api/tasks - Both Admin and Member can view tasks
router.get('/', protect, authorizeRoles('Admin', 'Member'), getTasks);

// POST /api/tasks - Only Admin can create tasks
router.post('/', protect, authorizeRoles('Admin'), createTask);

// PUT /api/tasks/:taskId/status - Both can update status (Controller handles ownership check)
router.put('/:taskId/status', protect, authorizeRoles('Admin', 'Member'), updateTaskStatus);

module.exports = router;