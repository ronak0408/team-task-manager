// frontend/src/components/Navbar.jsx
import React, { useContext } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';
import { LayoutDashboard, FolderKanban, CheckSquare, LogOut } from 'lucide-react';

const Navbar = () => {
  const { user, logout } = useContext(AuthContext);
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  return (
    <nav className="bg-white shadow-sm border-b border-gray-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16">
          <div className="flex items-center space-x-8">
            <h1 className="text-xl font-bold text-blue-600">TeamTask</h1>
            <div className="flex space-x-4">
              <Link to="/dashboard" className="flex items-center text-gray-600 hover:text-blue-600 px-3 py-2 rounded-md font-medium">
                <LayoutDashboard className="w-5 h-5 mr-2" /> Dashboard
              </Link>
              <Link to="/projects" className="flex items-center text-gray-600 hover:text-blue-600 px-3 py-2 rounded-md font-medium">
                <FolderKanban className="w-5 h-5 mr-2" /> Projects
              </Link>
              <Link to="/tasks" className="flex items-center text-gray-600 hover:text-blue-600 px-3 py-2 rounded-md font-medium">
                <CheckSquare className="w-5 h-5 mr-2" /> Tasks
              </Link>
            </div>
          </div>
          <div className="flex items-center space-x-4">
            <span className="text-sm text-gray-500">Hello, <span className="font-semibold text-gray-700">{user?.name}</span></span>
            <button 
              onClick={handleLogout}
              className="flex items-center text-red-500 hover:text-red-700 font-medium"
            >
              <LogOut className="w-5 h-5 mr-1" /> Logout
            </button>
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;