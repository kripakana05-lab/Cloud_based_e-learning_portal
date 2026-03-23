import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import { QuizProvider } from './context/QuizContext';
import { CourseProvider } from './context/CourseContext';
import Login from './pages/Login';
import Signup from './pages/Signup';
import ProtectedRoute from './components/ProtectedRoute';
import AdminDashboard from './pages/admin/AdminDashboard';
import CreateQuiz from './pages/admin/CreateQuiz';
import EditQuiz from './pages/admin/EditQuiz';
import AddCourse from './pages/admin/AddCourse';
import ManageCourses from './pages/admin/ManageCourses';
import StudentDashboard from './pages/student/StudentDashboard';
import TakeQuiz from './pages/student/TakeQuiz';

function App() {
  return (
    <Router>
      <AuthProvider>
        <QuizProvider>
          <CourseProvider>
            <Routes>
              <Route path="/" element={<Login />} />
              <Route path="/signup" element={<Signup />} />

              {/* Admin Routes */}
              <Route
                path="/admin"
                element={
                  <ProtectedRoute role="admin">
                    <AdminDashboard />
                  </ProtectedRoute>
                }
              />
              <Route
                path="/admin/create-quiz"
                element={
                  <ProtectedRoute role="admin">
                    <CreateQuiz />
                  </ProtectedRoute>
                }
              />
              <Route
                path="/admin/edit-quiz/:id"
                element={
                  <ProtectedRoute role="admin">
                    <EditQuiz />
                  </ProtectedRoute>
                }
              />
              <Route
                path="/admin/add-course"
                element={
                  <ProtectedRoute role="admin">
                    <AddCourse />
                  </ProtectedRoute>
                }
              />
              <Route
                path="/admin/courses"
                element={
                  <ProtectedRoute role="admin">
                    <ManageCourses />
                  </ProtectedRoute>
                }
              />

              {/* Student Routes */}
              <Route
                path="/student"
                element={
                  <ProtectedRoute role="student">
                    <StudentDashboard />
                  </ProtectedRoute>
                }
              />
              <Route
                path="/student/quiz/:id"
                element={
                  <ProtectedRoute role="student">
                    <TakeQuiz />
                  </ProtectedRoute>
                }
              />

              <Route path="*" element={<Navigate to="/" />} />
            </Routes>
          </CourseProvider>
        </QuizProvider>
      </AuthProvider>
    </Router>
  );
}

export default App;
