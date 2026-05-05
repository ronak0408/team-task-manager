// frontend/src/pages/Projects.jsx
import React, { useState, useEffect, useContext } from 'react';
import api from '../api/axios';
import { Users, Plus } from 'lucide-react';
import { AuthContext } from '../context/AuthContext';

const Projects = () => {
  const { user } = useContext(AuthContext); // Get the logged-in user to check their role
  const [projects, setProjects] = useState([]);
  const [loading, setLoading] = useState(true);
  
  // Form State
  const [showForm, setShowForm] = useState(false);
  const [name, setName] = useState('');
  const [description, setDescription] = useState('');

  const fetchProjects = async () => {
    try {
      const response = await api.get('/projects');
      setProjects(response.data);
    } catch (err) {
      console.error("Error fetching projects", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProjects();
  }, []);

  // Handle Project Creation
  const handleCreateProject = async (e) => {
    e.preventDefault();
    try {
      await api.post('/projects', { name, description });
      setName('');
      setDescription('');
      setShowForm(false);
      fetchProjects(); // Refresh the list immediately
    } catch (err) {
      alert(err.response?.data?.message || 'Failed to create project');
    }
  };

  if (loading) return <div className="p-8 text-center text-gray-500">Loading Projects...</div>;

  return (
    <div className="max-w-7xl mx-auto px-4 py-8">
      <div className="flex justify-between items-center mb-8">
        <h2 className="text-3xl font-bold text-gray-800">Projects</h2>
        
        {/* Only show the Create button if the user is an Admin */}
        {user?.role === 'Admin' && (
          <button 
            onClick={() => setShowForm(!showForm)}
            className="bg-blue-600 text-white px-4 py-2 rounded-lg flex items-center hover:bg-blue-700 transition"
          >
            <Plus size={20} className="mr-1" /> {showForm ? 'Cancel' : 'New Project'}
          </button>
        )}
      </div>

      {/* The Creation Form */}
      {showForm && (
        <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-200 mb-8">
          <h3 className="text-lg font-bold mb-4">Create New Project</h3>
          <form onSubmit={handleCreateProject} className="space-y-4">
            <div>
              <label className="block text-sm text-gray-700 mb-1">Project Name</label>
              <input type="text" required value={name} onChange={(e) => setName(e.target.value)} className="w-full px-3 py-2 border rounded focus:ring-2 focus:ring-blue-500" />
            </div>
            <div>
              <label className="block text-sm text-gray-700 mb-1">Description</label>
              <textarea value={description} onChange={(e) => setDescription(e.target.value)} className="w-full px-3 py-2 border rounded focus:ring-2 focus:ring-blue-500" rows="3"></textarea>
            </div>
            <button type="submit" className="bg-green-600 text-white px-4 py-2 rounded hover:bg-green-700">Save Project</button>
          </form>
        </div>
      )}

      {/* The Projects Grid */}
      {projects.length === 0 ? (
        <p className="text-gray-500">No projects found.</p>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {projects.map((project) => (
            <div key={project._id} className="bg-white p-6 rounded-xl shadow-sm border border-gray-200 hover:shadow-md transition">
              <h3 className="text-xl font-bold text-gray-800 mb-2">{project.name}</h3>
              <p className="text-gray-600 mb-4 h-12 overflow-hidden">{project.description}</p>
              <div className="flex items-center justify-between pt-4 border-t border-gray-100">
                <span className="text-xs text-gray-400">Created: {new Date(project.createdAt).toLocaleDateString()}</span>
                <span className="flex items-center text-sm font-medium text-blue-600 bg-blue-50 px-2 py-1 rounded-full">
                  <Users size={14} className="mr-1" /> {project.members.length} Members
                </span>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default Projects;
