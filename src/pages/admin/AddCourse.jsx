import React, { useState } from 'react';
import AdminLayout from '../../components/AdminLayout';
import { motion } from 'framer-motion';
import { Save, ArrowLeft, BookOpen, Clock, Tag } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { useCourses } from '../../context/CourseContext';

const AddCourse = () => {
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [category, setCategory] = useState('');
  const [duration, setDuration] = useState('');
  const [loading, setLoading] = useState(false);
  const { addCourse } = useCourses();
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      setLoading(true);
      await addCourse({ 
        title, 
        description, 
        category, 
        duration,
        status: 'active'
      });
      navigate('/admin/courses');
    } catch (err) {
      alert('Failed to add course: ' + err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <AdminLayout>
      <div className="max-w-4xl mx-auto px-6 py-10">
        <button 
          onClick={() => navigate(-1)}
          className="flex items-center text-gray-500 hover:text-indigo-600 font-bold mb-8 transition-colors group"
        >
          <ArrowLeft className="w-5 h-5 mr-2 group-hover:-translate-x-1 transition-transform" />
          Back
        </button>

        <div className="mb-10">
          <h1 className="text-4xl font-extrabold text-gray-900 tracking-tight">Add New Course</h1>
          <p className="text-gray-500 mt-2 text-lg">Create a new course to organize your quizzes and materials.</p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-8 bg-white p-10 rounded-[2.5rem] shadow-sm border border-gray-100">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <div className="space-y-2">
              <label className="text-sm font-black text-gray-700 uppercase tracking-widest ml-1">Course Title</label>
              <div className="relative">
                <BookOpen className="absolute left-4 top-4 text-gray-400 w-5 h-5" />
                <input
                  type="text"
                  required
                  placeholder="e.g. Advanced React Architecture"
                  className="w-full pl-12 pr-4 py-4 bg-gray-50 border-none rounded-2xl focus:ring-2 focus:ring-indigo-500 transition-all font-bold text-gray-900"
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                />
              </div>
            </div>

            <div className="space-y-2">
              <label className="text-sm font-black text-gray-700 uppercase tracking-widest ml-1">Category</label>
              <div className="relative">
                <Tag className="absolute left-4 top-4 text-gray-400 w-5 h-5" />
                <input
                  type="text"
                  required
                  placeholder="e.g. Web Development"
                  className="w-full pl-12 pr-4 py-4 bg-gray-50 border-none rounded-2xl focus:ring-2 focus:ring-indigo-500 transition-all font-bold text-gray-900"
                  value={category}
                  onChange={(e) => setCategory(e.target.value)}
                />
              </div>
            </div>
          </div>

          <div className="space-y-2">
            <label className="text-sm font-black text-gray-700 uppercase tracking-widest ml-1">Description</label>
            <textarea
              required
              rows="4"
              placeholder="Provide a detailed description of what this course covers..."
              className="w-full px-4 py-4 bg-gray-50 border-none rounded-2xl focus:ring-2 focus:ring-indigo-500 transition-all font-bold text-gray-900 resize-none"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
            />
          </div>

          <div className="space-y-2">
            <label className="text-sm font-black text-gray-700 uppercase tracking-widest ml-1">Estimated Duration</label>
            <div className="relative">
              <Clock className="absolute left-4 top-4 text-gray-400 w-5 h-5" />
              <input
                type="text"
                placeholder="e.g. 4 Weeks or 20 Hours"
                className="w-full pl-12 pr-4 py-4 bg-gray-50 border-none rounded-2xl focus:ring-2 focus:ring-indigo-500 transition-all font-bold text-gray-900"
                value={duration}
                onChange={(e) => setDuration(e.target.value)}
              />
            </div>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full bg-indigo-600 hover:bg-indigo-700 text-white font-black py-5 rounded-2xl shadow-xl shadow-indigo-100 transition-all flex items-center justify-center space-x-3 transform hover:-translate-y-1 active:scale-95 disabled:opacity-50"
          >
            <Save className="w-6 h-6" />
            <span>{loading ? 'Creating Course...' : 'Create Course'}</span>
          </button>
        </form>
      </div>
    </AdminLayout>
  );
};

export default AddCourse;
