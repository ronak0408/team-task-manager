// backend/controllers/dashboardController.js
const Task = require('../models/Task');

// @desc    Get dashboard statistics
// @route   GET /api/dashboard
// @access  Private (Admin sees all, Member sees only theirs)
exports.getDashboardStats = async (req, res) => {
  try {
    // 1. Determine the base query based on user role
    // Admins query everything (empty object {}), Members only query their assigned tasks
    const baseQuery = req.user.role === 'Admin' ? {} : { assignedTo: req.user._id };

    // Get today's date for the overdue calculation
    const today = new Date();

    // 2. Run all counting queries simultaneously for maximum performance
    const [totalTasks, completedTasks, pendingTasks, overdueTasks] = await Promise.all([
      // Count ALL tasks for this user/admin
      Task.countDocuments(baseQuery),

      // Count tasks where status is 'done'
      Task.countDocuments({ ...baseQuery, status: 'done' }),

      // Count tasks where status is 'todo' or 'in-progress'
      Task.countDocuments({ ...baseQuery, status: { $in: ['todo', 'in-progress'] } }),

      // Count tasks where the due date is in the past AND status is NOT 'done'
      Task.countDocuments({
        ...baseQuery,
        dueDate: { $lt: today }, // $lt means "less than"
        status: { $ne: 'done' }  // $ne means "not equal to"
      })
    ]);

    // 3. Send the formatted results back to the frontend
    res.status(200).json({
      totalTasks,
      completedTasks,
      pendingTasks,
      overdueTasks
    });

  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};