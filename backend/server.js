// backend/server.js
require('dotenv').config();
const express = require('express');
const cors = require('cors');
const connectDB = require('./config/db'); // IMPORT DB CONNECTION

const app = express();

app.use(cors());
app.use(express.json());

// CONNECT TO DATABASE
connectDB();

app.get('/api/health', (req, res) => {
  res.status(200).json({ status: 'success', message: 'Task Manager API is running!' });
});


app.use('/api/auth', require('./routes/authRoutes'));


app.use('/api/projects', require('./routes/projectRoutes'));

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`🚀 Backend Server running on port ${PORT}`);
});

app.use('/api/tasks', require('./routes/taskRoutes'));

app.use('/api/dashboard', require('./routes/dashboardRoutes'));