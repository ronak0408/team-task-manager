// backend/routes/dashboardRoutes.js
const express = require('express');
const router = express.Router();
const { protect } = require('../middleware/authMiddleware');
const { getDashboardStats } = require('../controllers/dashboardController');

// Route Setup

// GET /api/dashboard - Both Admins and Members can access their stats
router.get('/', protect, getDashboardStats);

module.exports = router;