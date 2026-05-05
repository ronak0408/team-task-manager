// frontend/src/pages/Tasks.jsx
import React, { useState, useEffect, useContext } from 'react';
import api from '../api/axios';
import { AuthContext } from '../context/AuthContext';
import { Plus } from 'lucide-react';

const Tasks = () => {
  const { user } = useContext(AuthContext);
  const [tasks, setTasks] = useState([]);
  const [projects, setProjects] = useState([]); // Needed for the dropdown
  const [loading, setLoading] = useState(true);

  // Form State
  const [showForm, setShowForm] = useState(false);
  const [newTask, setNewTask] = useState({ title: '', description: '', projectId: '', assignedTo: '', dueDate: '' });

  const fetchData = async () => {
    try {
      const taskRes = await api.get('/tasks');
      setTasks(taskRes.data);
      
      // If Admin, fetch projects so we can assign tasks to them
      if (user?.role === 'Admin') {
        const projRes = await api.get('/projects');
        setProjects(projRes.data);
      }
    } catch (err) {
      console.error("Error fetching data", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, [user]);

  // Handle Task Creation
  const handleCreateTask = async (e) => {
    e.preventDefault();
    try {
      await api.post('/tasks', newTask);
      setNewTask({ title: '', description: '', projectId: '', assignedTo: '', dueDate: '' });
      setShowForm(false);
      fetchData(); // Refresh tasks
    } catch (err) {
      alert(err.response?.data?.message || 'Failed to create task. Make sure the user is added to the project first!');
    }
  };

  const handleStatusUpdate = async (taskId, newStatus) => {
    try {
      await api.put(`/tasks/${taskId}/status`, { status: newStatus });
      fetchData();
    } catch (err) {
      alert('Failed to update status');
    }
  };

  const TaskCard = ({ task }) => (
    <div className="bg-white p-4 rounded-lg shadow-sm border border-gray-200 mb-3">
      <h4 className="font-bold text-gray-800 mb-1">{task.title}</h4>
      <p className="text-xs text-gray-500 mb-2">{task.description}</p>
      <div className="flex flex-wrap gap-2 mb-3">
        <span className="text-xs bg-gray-100 px-2 py-1 rounded">Project: {task.projectId?.name || 'Unknown'}</span>
        <span className="text-xs bg-purple-100 text-purple-700 px-2 py-1 rounded">Assigned: {task.assignedTo?.name || 'Unassigned'}</span>
      </div>
      
      <div className="flex gap-2 mt-2 border-t pt-3">
        {task.status === 'todo' && <button onClick={() => handleStatusUpdate(task._id, 'in-progress')} className="text-xs bg-blue-100 text-blue-700 px-3 py-1 rounded w-full">Start Task</button>}
        {task.status === 'in-progress' && <button onClick={() => handleStatusUpdate(task._id, 'done')} className="text-xs bg-green-100 text-green-700 px-3 py-1 rounded w-full">Mark Complete</button>}
        {task.status === 'done' && <span className="text-xs text-center w-full text-green-600">Completed ✅</span>}
      </div>
    </div>
  );

  if (loading) return <div className="p-8 text-center">Loading Tasks...</div>;

  return (
    <div className="max-w-7xl mx-auto px-4 py-8 h-full">
      <div className="flex justify-between items-center mb-8">
        <h2 className="text-3xl font-bold text-gray-800">Task Board</h2>
        
        {user?.role === 'Admin' && (
          <button onClick={() => setShowForm(!showForm)} className="bg-blue-600 text-white px-4 py-2 rounded-lg flex items-center hover:bg-blue-700">
            <Plus size={20} className="mr-1" /> {showForm ? 'Cancel' : 'New Task'}
          </button>
        )}
      </div>

      {/* Admin Task Creation Form */}
      {showForm && (
        <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-200 mb-8">
          <form onSubmit={handleCreateTask} className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm text-gray-700 mb-1">Title</label>
              <input type="text" required value={newTask.title} onChange={e => setNewTask({...newTask, title: e.target.value})} className="w-full px-3 py-2 border rounded" />
            </div>
            <div>
              <label className="block text-sm text-gray-700 mb-1">Project</label>
              <select required value={newTask.projectId} onChange={e => setNewTask({...newTask, projectId: e.target.value})} className="w-full px-3 py-2 border rounded">
                <option value="">Select Project</option>
                {projects.map(p => <option key={p._id} value={p._id}>{p.name}</option>)}
              </select>
            </div>
            <div>
              <label className="block text-sm text-gray-700 mb-1">Assign To (Member ID for now)</label>
              {/* Note: For a fully polished app, this would be a dropdown of the selected project's members. For now, pasting the Member ID works perfectly with our backend API! */}
              <input type="text" placeholder="Paste Member ID here" required value={newTask.assignedTo} onChange={e => setNewTask({...newTask, assignedTo: e.target.value})} className="w-full px-3 py-2 border rounded" />
            </div>
            <div>
              <label className="block text-sm text-gray-700 mb-1">Due Date</label>
              <input type="date" value={newTask.dueDate} onChange={e => setNewTask({...newTask, dueDate: e.target.value})} className="w-full px-3 py-2 border rounded" />
            </div>
            <div className="md:col-span-2">
              <button type="submit" className="bg-green-600 text-white px-4 py-2 rounded hover:bg-green-700">Create Task</button>
            </div>
          </form>
        </div>
      )}

      {/* Kanban Board */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-gray-50 rounded-xl p-4">
          <h3 className="font-bold text-gray-600 mb-4">To Do</h3>
          {tasks.filter(t => t.status === 'todo').map(task => <TaskCard key={task._id} task={task} />)}
        </div>
        <div className="bg-blue-50 rounded-xl p-4">
          <h3 className="font-bold text-blue-800 mb-4">In Progress</h3>
          {tasks.filter(t => t.status === 'in-progress').map(task => <TaskCard key={task._id} task={task} />)}
        </div>
        <div className="bg-green-50 rounded-xl p-4">
          <h3 className="font-bold text-green-800 mb-4">Done</h3>
          {tasks.filter(t => t.status === 'done').map(task => <TaskCard key={task._id} task={task} />)}
        </div>
      </div>
    </div>
  );
};

export default Tasks;
