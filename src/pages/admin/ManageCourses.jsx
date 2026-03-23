import React, { useEffect, useState } from 'react';
import AdminLayout from '../../components/AdminLayout';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Plus, 
  Search, 
  MoreVertical, 
  Trash2, 
  Edit, 
  BookOpen, 
  Users, 
  FileText 
} from 'lucide-react';
import { Link } from 'react-router-dom';
import { useCourses } from '../../context/CourseContext';

const ManageCourses = () => {
  const { courses, loading, fetchCourses, deleteCourse } = useCourses();
  const [searchTerm, setSearchTerm] = useState('');

  useEffect(() => {
    fetchCourses();
  }, []);

  const handleDelete = async (id) => {
    if (window.confirm('Are you sure you want to delete this course? All associated data might be affected.')) {
      try {
        await deleteCourse(id);
      } catch (err) {
        alert('Failed to delete course: ' + err.message);
      }
    }
  };

  const filteredCourses = courses.filter(course => 
    course.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
    course.category.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <AdminLayout>
      <div className="max-w-7xl mx-auto px-6 py-10">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 mb-12">
          <div>
            <h1 className="text-4xl font-extrabold text-gray-900 tracking-tight">Manage Courses</h1>
            <p className="text-gray-500 mt-2 text-lg">View, edit and organize your curriculum.</p>
          </div>
          <Link 
            to="/admin/add-course"
            className="bg-indigo-600 hover:bg-indigo-700 text-white font-black py-4 px-8 rounded-2xl shadow-lg shadow-indigo-100 transition-all flex items-center space-x-2 transform hover:-translate-y-1 w-fit"
          >
            <Plus className="w-6 h-6" />
            <span>Add New Course</span>
          </Link>
        </div>

        <div className="relative mb-10 group">
          <Search className="absolute left-6 top-1/2 -translate-y-1/2 text-gray-400 w-6 h-6 group-focus-within:text-indigo-600 transition-colors" />
          <input 
            type="text"
            placeholder="Search courses by title or category..."
            className="w-full pl-16 pr-6 py-5 bg-white border border-gray-100 rounded-[2rem] shadow-sm focus:ring-4 focus:ring-indigo-50 focus:border-indigo-200 outline-none transition-all font-bold text-gray-700"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>

        {loading ? (
          <div className="flex justify-center py-20 bg-white rounded-[3rem] border border-gray-100 shadow-sm">
            <div className="animate-spin rounded-full h-12 w-12 border-4 border-indigo-600 border-t-transparent"></div>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            <AnimatePresence>
              {filteredCourses.length > 0 ? filteredCourses.map((course, index) => (
                <motion.div 
                  key={course.id}
                  layout
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.9 }}
                  transition={{ duration: 0.2 }}
                  className="bg-white rounded-[2.5rem] p-8 border border-gray-50 shadow-sm hover:shadow-2xl transition-all group relative overflow-hidden"
                >
                  <div className="absolute top-0 right-0 p-6 flex flex-col space-y-2 translate-x-12 group-hover:translate-x-0 transition-transform duration-300">
                    <button className="bg-white p-3 rounded-full text-gray-400 hover:text-indigo-600 shadow-lg border border-gray-50">
                      <Edit className="w-5 h-5" />
                    </button>
                    <button 
                      onClick={() => handleDelete(course.id)}
                      className="bg-white p-3 rounded-full text-gray-400 hover:text-red-500 shadow-lg border border-gray-50"
                    >
                      <Trash2 className="w-5 h-5" />
                    </button>
                  </div>

                  <div className="mb-6">
                    <span className="bg-indigo-50 text-indigo-600 text-xs font-black px-4 py-1.5 rounded-full uppercase tracking-tighter">
                      {course.category}
                    </span>
                  </div>
                  
                  <h3 className="text-2xl font-black text-gray-900 mb-2 leading-tight group-hover:text-indigo-600 transition-colors truncate">
                    {course.title}
                  </h3>
                  
                  <p className="text-gray-500 font-medium mb-8 line-clamp-2 text-sm">
                    {course.description}
                  </p>

                  <div className="flex items-center justify-between pt-6 border-t border-gray-50 mt-auto">
                    <div className="flex items-center space-x-4">
                        <div className="flex items-center text-gray-400 text-xs font-bold space-x-1">
                          <FileText className="w-4 h-4" />
                          <span>12 Quizzes</span>
                        </div>
                        <div className="flex items-center text-gray-400 text-xs font-bold space-x-1">
                          <Users className="w-4 h-4" />
                          <span>850 Students</span>
                        </div>
                    </div>
                  </div>
                </motion.div>
              )) : (
                <div className="col-span-full py-20 text-center bg-white rounded-[3rem] border-2 border-dashed border-gray-200">
                   <BookOpen className="w-16 h-16 text-gray-200 mx-auto mb-4" />
                   <h3 className="text-xl font-bold text-gray-800">No courses found</h3>
                   <p className="text-gray-500 mt-1">Try a different search term or add a new course.</p>
                </div>
              )}
            </AnimatePresence>
          </div>
        )}
      </div>
    </AdminLayout>
  );
};

export default ManageCourses;
