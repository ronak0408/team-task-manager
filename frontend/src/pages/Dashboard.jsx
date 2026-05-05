// frontend/src/pages/Dashboard.jsx
import React, { useState, useEffect } from 'react';
import api from '../api/axios';
import { CheckCircle, Clock, AlertCircle, ListTodo } from 'lucide-react';

const Dashboard = () => {
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const response = await api.get('/dashboard');
        setStats(response.data);
      } catch (err) {
        setError('Failed to load dashboard statistics.');
      } finally {
        setLoading(false);
      }
    };
    fetchStats();
  }, []);

  if (loading) return <div className="p-8 text-center text-gray-500">Loading Dashboard...</div>;
  if (error) return <div className="p-8 text-center text-red-500">{error}</div>;

  const cards = [
    { title: 'Total Tasks', value: stats.totalTasks, icon: <ListTodo size={32} className="text-blue-500" />, bg: 'bg-blue-50' },
    { title: 'Completed', value: stats.completedTasks, icon: <CheckCircle size={32} className="text-green-500" />, bg: 'bg-green-50' },
    { title: 'Pending', value: stats.pendingTasks, icon: <Clock size={32} className="text-yellow-500" />, bg: 'bg-yellow-50' },
    { title: 'Overdue', value: stats.overdueTasks, icon: <AlertCircle size={32} className="text-red-500" />, bg: 'bg-red-50' },
  ];

  return (
    <div className="max-w-7xl mx-auto px-4 py-8">
      <h2 className="text-3xl font-bold text-gray-800 mb-8">Dashboard Overview</h2>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {cards.map((card, index) => (
          <div key={index} className={`p-6 rounded-xl shadow-sm border border-gray-100 flex items-center justify-between bg-white`}>
            <div>
              <p className="text-sm font-medium text-gray-500 mb-1">{card.title}</p>
              <h3 className="text-3xl font-bold text-gray-800">{card.value}</h3>
            </div>
            <div className={`p-3 rounded-full ${card.bg}`}>
              {card.icon}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Dashboard;