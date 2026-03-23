import React, { useEffect } from 'react';
import AdminLayout from '../../components/AdminLayout';
import { motion, AnimatePresence } from 'framer-motion';
import { Plus, Trash2, ListChecks, Users, BookMarked, ChevronRight, BarChart3, BookOpen, HelpCircle, Edit } from 'lucide-react';
import { Link, useNavigate } from 'react-router-dom';
import { useQuiz } from '../../context/QuizContext';
import { useAuth } from '../../context/AuthContext';
import { useCourses } from '../../context/CourseContext';

const AdminDashboard = () => {
  const { quizzes, loading: quizzesLoading, fetchQuizzes, deleteQuiz } = useQuiz();
  const { students, fetchStudents } = useAuth();
  const { courses, fetchCourses, loading: coursesLoading } = useCourses();
  const navigate = useNavigate();

  useEffect(() => {
    fetchQuizzes();
    fetchStudents();
    fetchCourses();
  }, []);

  const loading = quizzesLoading || coursesLoading;

  const handleDelete = async (id) => {
    if (window.confirm('Are you sure you want to delete this quiz?')) {
      try {
        await deleteQuiz(id);
      } catch (err) {
        alert('Failed to delete quiz: ' + err.message);
      }
    }
  };

  return (
    <AdminLayout>
      <main className="max-w-7xl mx-auto px-6 py-10">
        <div className="flex justify-between items-end mb-10">
          <div>
            <h1 className="text-4xl font-extrabold text-gray-900 tracking-tight">Admin Dashboard</h1>
            <p className="text-gray-500 mt-2 text-lg">Manage your courses, quizzes and track student performance.</p>
          </div>
          <Link 
            to="/admin/create-quiz"
            className="bg-indigo-600 hover:bg-indigo-700 text-white font-bold py-3 px-6 rounded-2xl shadow-lg shadow-indigo-200 transition-all flex items-center space-x-2 transform hover:-translate-y-1"
          >
            <Plus className="w-6 h-6" />
            <span>Create New Quiz</span>
          </Link>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-12">
          {[
            { label: 'Total Quizzes', value: quizzes.length, icon: ListChecks, color: 'bg-blue-500' },
            { label: 'Total Students', value: students.length, icon: Users, color: 'bg-purple-500' },
            { label: 'Courses Active', value: courses.length, icon: BookMarked, color: 'bg-emerald-500' },
          ].map((stat, i) => (
            <motion.div 
              key={i}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.1 }}
              className="bg-white p-6 rounded-3xl shadow-sm border border-gray-100 flex items-center space-x-6"
            >
              <div className={`${stat.color} p-4 rounded-2xl shadow-lg`}>
                <stat.icon className="text-white w-8 h-8" />
              </div>
              <div>
                <p className="text-gray-500 font-bold uppercase text-xs tracking-wider">{stat.label}</p>
                <p className="text-3xl font-black text-gray-900">{stat.value}</p>
              </div>
            </motion.div>
          ))}
        </div>

        <h2 className="text-2xl font-bold text-gray-800 mb-6 flex items-center space-x-2">
          <span>Your Quizzes</span>
          <span className="bg-indigo-100 text-indigo-600 px-3 py-1 rounded-full text-sm">{quizzes.length}</span>
        </h2>

        {loading ? (
          <div className="flex justify-center py-20">
            <div className="animate-spin rounded-full h-12 w-12 border-4 border-indigo-600 border-t-transparent"></div>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {quizzes.length > 0 ? quizzes.map((quiz, index) => (
              <motion.div 
                key={quiz.id}
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: index * 0.05 }}
                className="bg-white rounded-3xl p-6 border border-gray-100 shadow-sm hover:shadow-xl transition-all group overflow-hidden relative"
              >
                <div className="absolute top-0 right-0 p-4 opacity-0 group-hover:opacity-100 transition-opacity flex space-x-2">
                  <button 
                    onClick={() => navigate(`/admin/edit-quiz/${quiz.id}`)} 
                    className="text-gray-400 hover:text-indigo-600 p-2 bg-white rounded-full shadow-sm border border-gray-100"
                  >
                    <Edit className="w-5 h-5" />
                  </button>
                  <button 
                    onClick={() => handleDelete(quiz.id)} 
                    className="text-gray-400 hover:text-red-500 p-2 bg-white rounded-full shadow-sm border border-gray-100"
                  >
                    <Trash2 className="w-5 h-5" />
                  </button>
                </div>
                <div className="mb-4">
                  <span className="bg-indigo-50 text-indigo-600 text-xs font-black px-3 py-1 rounded-full uppercase tracking-tighter shadow-sm">
                    {quiz.course || 'General'}
                  </span>
                </div>
                <h3 className="text-xl font-bold text-gray-900 mb-2 truncate group-hover:text-indigo-600 transition-colors">{quiz.title}</h3>
                <p className="text-gray-500 text-sm mb-6 line-clamp-2">{quiz.description || 'Practice your skills with this quiz.'}</p>
                <div className="flex items-center justify-between mt-auto">
                  <div className="flex items-center text-gray-400 text-xs font-bold space-x-1">
                    <ListChecks className="w-4 h-4" />
                    <span>{quiz.questions?.length || 0} Questions</span>
                  </div>
                  <div className="flex items-center text-indigo-600 font-bold text-sm group-hover:translate-x-1 transition-transform cursor-pointer">
                    <span>View Details</span>
                    <ChevronRight className="w-4 h-4 ml-1" />
                  </div>
                </div>
              </motion.div>
            )) : (
              <div className="col-span-full bg-white border-2 border-dashed border-gray-200 rounded-3xl p-12 text-center">
                <div className="bg-gray-50 w-20 h-20 rounded-full flex items-center justify-center mx-auto mb-4">
                  <BookMarked className="text-gray-300 w-10 h-10" />
                </div>
                <h3 className="text-xl font-bold text-gray-800">No quizzes found</h3>
                <p className="text-gray-500 mb-6">Start by creating your first quiz to engage with students.</p>
                <Link to="/admin/create-quiz" className="text-indigo-600 font-bold hover:underline">Create a Quiz now &rarr;</Link>
              </div>
            )}
          </div>
        )}
      </main>
    </AdminLayout>
  );
};

export default AdminDashboard;
