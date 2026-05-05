// backend/controllers/taskController.js
const Task = require('../models/Task');
const Project = require('../models/Project');

// @desc    Create a new task and assign it
// @route   POST /api/tasks
// @access  Private/Admin
exports.createTask = async (req, res) => {
  try {
    const { title, description, projectId, assignedTo, dueDate } = req.body;

    // 1. Verify the project exists
    const project = await Project.findById(projectId);
    if (!project) {
      return res.status(404).json({ message: 'Project not found' });
    }

    // 2. Verify the assigned user is actually a member of the project
    if (assignedTo && !project.members.includes(assignedTo)) {
      return res.status(400).json({ message: 'Assigned user is not a member of this project' });
    }

    // 3. Create the task
    const task = await Task.create({
      title,
      description,
      projectId,
      assignedTo,
      dueDate,
    });

    res.status(201).json(task);
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

// @desc    Get tasks (filter by project optional)
// @route   GET /api/tasks
// @access  Private
exports.getTasks = async (req, res) => {
  try {
    const { projectId } = req.query; // e.g., /api/tasks?projectId=123
    let query = {};

    // If a specific project was requested, add it to the search query
    if (projectId) {
      query.projectId = projectId;
    }

    // 🔴 RBAC Logic: If user is a Member, ONLY show their assigned tasks
    if (req.user.role === 'Member') {
      query.assignedTo = req.user._id;
    }

    // Fetch tasks and populate related Project and User data
    const tasks = await Task.find(query)
      .populate('projectId', 'name')
      .populate('assignedTo', 'name email')
      .sort({ createdAt: -1 }); // Newest tasks first

    res.status(200).json(tasks);
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

// @desc    Update task status
// @route   PUT /api/tasks/:taskId/status
// @access  Private (Admin or Assigned Member)
exports.updateTaskStatus = async (req, res) => {
  try {
    const { taskId } = req.params;
    const { status } = req.body;

    // Ensure status is valid
    const validStatuses = ['todo', 'in-progress', 'done'];
    if (!validStatuses.includes(status)) {
      return res.status(400).json({ message: 'Invalid status' });
    }

    const task = await Task.findById(taskId);
    if (!task) {
      return res.status(404).json({ message: 'Task not found' });
    }

    // 🔴 RBAC Logic: If it's a Member, ensure they are the one assigned to this task
    if (req.user.role === 'Member' && task.assignedTo.toString() !== req.user._id.toString()) {
      return res.status(403).json({ message: 'Not authorized to update this task' });
    }

    // Update status and save
    task.status = status;
    await task.save();

    res.status(200).json({ message: 'Task status updated', task });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};