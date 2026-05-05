// frontend/src/pages/Tasks.jsx
import React, { useState, useEffect } from 'react';
import api from '../api/axios';

const Tasks = () => {
  const [tasks, setTasks] = useState([]);
  const [loading, setLoading] = useState(true);

  // Fetch tasks on load
  const fetchTasks = async () => {
    try {
      const response = await api.get('/tasks');
      setTasks(response.data);
    } catch (err) {
      console.error("Error fetching tasks", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchTasks();
  }, []);

  // Function to update status
  const handleStatusUpdate = async (taskId, newStatus) => {
    try {
      await api.put(`/tasks/${taskId}/status`, { status: newStatus });
      fetchTasks(); // Refresh list to show changes
    } catch (err) {
      alert(err.response?.data?.message || 'Failed to update status');
    }
  };

  // Helper component for Task Cards
  const TaskCard = ({ task }) => (
    <div className="bg-white p-4 rounded-lg shadow-sm border border-gray-200 mb-3 hover:shadow-md transition">
      <h4 className="font-bold text-gray-800 mb-1">{task.title}</h4>
      <p className="text-xs text-gray-500 mb-3 bg-gray-100 inline-block px-2 py-1 rounded">
        Project: {task.projectId?.name || 'Unknown'}
      </p>
      
      {/* Action Buttons based on current status */}
      <div className="flex gap-2 mt-2 border-t pt-3">
        {task.status === 'todo' && (
          <button onClick={() => handleStatusUpdate(task._id, 'in-progress')} className="text-xs bg-blue-100 text-blue-700 px-3 py-1 rounded hover:bg-blue-200 w-full font-medium">Start Task</button>
        )}
        {task.status === 'in-progress' && (
          <button onClick={() => handleStatusUpdate(task._id, 'done')} className="text-xs bg-green-100 text-green-700 px-3 py-1 rounded hover:bg-green-200 w-full font-medium">Mark Complete</button>
        )}
        {task.status === 'done' && (
          <span className="text-xs text-center w-full text-green-600 font-medium">Completed ✅</span>
        )}
      </div>
    </div>
  );

  if (loading) return <div className="p-8 text-center text-gray-500">Loading Tasks...</div>;

  return (
    <div className="max-w-7xl mx-auto px-4 py-8 h-full">
      <h2 className="text-3xl font-bold text-gray-800 mb-8">Task Board</h2>
      
      {/* Kanban Grid Layout */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        
        {/* TODO Column */}
        <div className="bg-gray-50 rounded-xl p-4">
          <h3 className="font-bold text-gray-600 mb-4 flex items-center justify-between">
            To Do <span className="bg-gray-200 text-gray-600 text-xs px-2 py-1 rounded-full">{tasks.filter(t => t.status === 'todo').length}</span>
          </h3>
          {tasks.filter(t => t.status === 'todo').map(task => <TaskCard key={task._id} task={task} />)}
        </div>

        {/* IN PROGRESS Column */}
        <div className="bg-blue-50 rounded-xl p-4">
          <h3 className="font-bold text-blue-800 mb-4 flex items-center justify-between">
            In Progress <span className="bg-blue-200 text-blue-800 text-xs px-2 py-1 rounded-full">{tasks.filter(t => t.status === 'in-progress').length}</span>
          </h3>
          {tasks.filter(t => t.status === 'in-progress').map(task => <TaskCard key={task._id} task={task} />)}
        </div>

        {/* DONE Column */}
        <div className="bg-green-50 rounded-xl p-4">
          <h3 className="font-bold text-green-800 mb-4 flex items-center justify-between">
            Done <span className="bg-green-200 text-green-800 text-xs px-2 py-1 rounded-full">{tasks.filter(t => t.status === 'done').length}</span>
          </h3>
          {tasks.filter(t => t.status === 'done').map(task => <TaskCard key={task._id} task={task} />)}
        </div>

      </div>
    </div>
  );
};

export default Tasks;