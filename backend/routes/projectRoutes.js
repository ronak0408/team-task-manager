// backend/routes/projectRoutes.js
const express = require('express');
const router = express.Router();
const { protect } = require('../middleware/authMiddleware');
const { authorizeRoles } = require('../middleware/roleMiddleware');
const { 
  createProject, 
  getProjects, 
  addMember 
} = require('../controllers/projectController');

// Route Setup

// GET /api/projects - Both Admin and Member can view (controller handles logic on who sees what)
router.get('/', protect, authorizeRoles('Admin', 'Member'), getProjects);

// POST /api/projects - Only Admin can create
router.post('/', protect, authorizeRoles('Admin'), createProject);

// PUT /api/projects/:projectId/members - Only Admin can add members
router.put('/:projectId/members', protect, authorizeRoles('Admin'), addMember);

module.exports = router;