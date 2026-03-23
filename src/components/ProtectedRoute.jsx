import React from 'react';
import { Navigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const ProtectedRoute = ({ children, role }) => {
  const { currentUser, userData, loading } = useAuth();

  if (loading) {
     return <div className="min-h-screen flex items-center justify-center bg-gray-50 text-indigo-600 font-bold text-xl animate-pulse">Loading...</div>;
  }

  if (!currentUser) {
    return <Navigate to="/" />;
  }

  // If a specific role is required, and we have user data, verify it matches
  if (role && userData && userData.role !== role) {
    return <Navigate to="/" />;
  }

  return children;
};

export default ProtectedRoute;
