import React from 'react';
import { useAuth } from '../context/AuthContext';
import { useNavigate, Link } from 'react-router-dom';
import { LogOut, User, LayoutDashboard, BookOpen } from 'lucide-react';

const Navbar = () => {
  const { userData, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = async () => {
    try {
      await logout();
      navigate('/');
    } catch (err) {
      console.error("Failed to log out", err);
    }
  };

  return (
    <nav className="bg-white border-b border-gray-100 shadow-sm px-6 py-4 flex justify-between items-center sticky top-0 z-50">
      <div className="flex items-center space-x-2">
        <div className="bg-indigo-600 p-2 rounded-lg">
          <BookOpen className="text-white w-6 h-6" />
        </div>
        <span className="text-xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-indigo-600 to-purple-600">E-Learn</span>
      </div>
      
      <div className="flex items-center space-x-6">
        <div className="flex items-center space-x-2 text-gray-700 font-medium">
          <div className="w-8 h-8 bg-gray-100 rounded-full flex items-center justify-center border border-gray-200">
            <User className="w-5 h-5 text-indigo-600" />
          </div>
          <span>{userData?.name || 'User'}</span>
          <span className="text-xs bg-indigo-100 text-indigo-600 px-2 py-0.5 rounded-full uppercase font-bold">{userData?.role}</span>
        </div>
        
        <button 
          onClick={handleLogout}
          className="flex items-center space-x-1 text-gray-500 hover:text-red-600 transition-colors font-semibold"
        >
          <LogOut className="w-5 h-5" />
          <span>Logout</span>
        </button>
      </div>
    </nav>
  );
};

export default Navbar;
