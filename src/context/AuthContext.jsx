import React, { createContext, useContext, useEffect, useState } from 'react';
import { authService } from '../services/authService';

const AuthContext = createContext();

export const useAuth = () => useContext(AuthContext);

export const AuthProvider = ({ children }) => {
  const [currentUser, setCurrentUser] = useState(null);
  const [userData, setUserData] = useState(null);
  const [loading, setLoading] = useState(true);

  const signup = (email, password, role, name) => {
    return authService.signup(email, password, role, name);
  };

  const login = (email, password) => {
    return authService.login(email, password);
  };

  const logout = () => {
    return authService.logout();
  };

  const [students, setStudents] = useState([]);
  const fetchStudents = async () => {
    try {
      const data = await authService.getAllStudents();
      setStudents(data);
    } catch (err) {
      console.error(err);
    }
  };

  useEffect(() => {
    const unsubscribe = authService.subscribeToAuthChanges(async (user) => {
      if (user) {
        setCurrentUser(user);
        const profile = await authService.getUserProfile(user.uid);
        if (profile) {
          setUserData(profile);
        } else {
          setUserData({ error: 'User profile not found. Logging out to allow re-registration.' });
          // Automatically log out so they can sign up again
          await authService.logout();
        }
      } else {
        setCurrentUser(null);
        setUserData(null);
      }
      setLoading(false);
    });
    return unsubscribe;
  }, []);

  const value = {
    currentUser,
    userData,
    loading,
    signup,
    login,
    logout,
    fetchStudents,
    students
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};
