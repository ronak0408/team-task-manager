// backend/models/Project.js
const mongoose = require('mongoose');

const projectSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
  },
  description: {
    type: String,
  },
  createdBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User', // Links this field to the User model (Who created it?)
    required: true,
  },
  members: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User', // Array of ObjectIds linking to Users (Who is working on it?)
  }],
}, {
  timestamps: true,
});

module.exports = mongoose.model('Project', projectSchema);