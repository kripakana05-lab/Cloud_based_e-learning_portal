import React from 'react';
import { NavLink, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { 
  LayoutDashboard, 
  BookOpen, 
  PlusCircle, 
  FileText, 
  LogOut, 
  Settings,
  ChevronLeft,
  GraduationCap
} from 'lucide-react';
import { motion } from 'framer-motion';

const AdminSidebar = () => {
  const { logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = async () => {
    try {
      await logout();
      navigate('/');
    } catch (err) {
      console.error('Failed to logout', err);
    }
  };

  const menuItems = [
    { icon: LayoutDashboard, label: 'Dashboard', path: '/admin' },
    { icon: BookOpen, label: 'Manage Courses', path: '/admin/courses' },
    { icon: PlusCircle, label: 'Add Course', path: '/admin/add-course' },
    { icon: FileText, label: 'Add Quiz', path: '/admin/create-quiz' },
  ];

  return (
    <aside className="w-72 bg-white border-r border-gray-100 flex flex-col h-screen sticky top-0 shadow-sm">
      <div className="p-8 flex items-center space-x-3">
        <div className="bg-indigo-600 p-2.5 rounded-2xl shadow-lg shadow-indigo-100">
          <GraduationCap className="text-white w-7 h-7" />
        </div>
        <span className="text-2xl font-black text-gray-900 tracking-tighter">E-Learn</span>
      </div>

      <nav className="flex-grow px-4 space-y-2 mt-4">
        {menuItems.map((item) => (
          <NavLink
            key={item.path}
            to={item.path}
            end={item.path === '/admin'}
            className={({ isActive }) => `
              flex items-center space-x-3 px-6 py-4 rounded-2xl font-bold transition-all duration-300
              ${isActive 
                ? 'bg-indigo-50 text-indigo-600 shadow-sm' 
                : 'text-gray-500 hover:bg-gray-50 hover:text-gray-900'}
            `}
          >
            <item.icon className="w-5 h-5" />
            <span>{item.label}</span>
          </NavLink>
        ))}
      </nav>

      <div className="p-4 mt-auto border-t border-gray-100">
        <button
          onClick={handleLogout}
          className="w-full flex items-center space-x-3 px-6 py-4 rounded-2xl font-bold text-red-500 hover:bg-red-50 transition-all duration-300"
        >
          <LogOut className="w-5 h-5" />
          <span>Logout</span>
        </button>
      </div>
    </aside>
  );
};

export default AdminSidebar;
