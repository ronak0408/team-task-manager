// backend/controllers/projectController.js
const Project = require('../models/Project');
const User = require('../models/User');

// @desc    Create a new project
// @route   POST /api/projects
// @access  Private/Admin
exports.createProject = async (req, res) => {
  try {
    const { name, description } = req.body;

    const project = await Project.create({
      name,
      description,
      createdBy: req.user._id, // Set automatically from the logged-in user's token
    });

    res.status(201).json(project);
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

// @desc    Get projects
// @route   GET /api/projects
// @access  Private (Admins see all, Members see their assigned projects)
exports.getProjects = async (req, res) => {
  try {
    let projects;

    if (req.user.role === 'Admin') {
      // Admins see everything. .populate() fetches the actual user details instead of just the ID.
      projects = await Project.find()
        .populate('createdBy', 'name email')
        .populate('members', 'name email');
    } else {
      // Members only see projects where their ID is in the 'members' array
      projects = await Project.find({ members: req.user._id })
        .populate('createdBy', 'name email')
        .populate('members', 'name email');
    }

    res.status(200).json(projects);
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

// @desc    Add a member to a project
// @route   PUT /api/projects/:projectId/members
// @access  Private/Admin
exports.addMember = async (req, res) => {
  try {
    const { projectId } = req.params; // From the URL
    const { userId } = req.body;      // From the JSON body

    const project = await Project.findById(projectId);
    
    if (!project) {
      return res.status(404).json({ message: 'Project not found' });
    }

    // Check if user exists in the database
    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    // Check if user is already a member of this project
    if (project.members.includes(userId)) {
      return res.status(400).json({ message: 'User is already a member of this project' });
    }

    // Add user ID to the members array and save
    project.members.push(userId);
    await project.save();

    res.status(200).json({ message: 'Member added successfully', project });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};