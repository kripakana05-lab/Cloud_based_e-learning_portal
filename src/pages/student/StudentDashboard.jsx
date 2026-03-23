import React, { useEffect } from 'react';
import Navbar from '../../components/Navbar';
import { motion } from 'framer-motion';
import { BookOpen, Calendar, HelpCircle, ArrowRight, BookMarked, Layers } from 'lucide-react';
import { Link } from 'react-router-dom';
import { useQuiz } from '../../context/QuizContext';

const StudentDashboard = () => {
  const { quizzes, loading, fetchQuizzes } = useQuiz();

  useEffect(() => {
    fetchQuizzes();
  }, []);

  return (
    <div className="min-h-screen bg-gray-50/50">
      <Navbar />
      <main className="max-w-7xl mx-auto px-6 py-10">
        <div className="mb-12">
          <motion.h1 
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            className="text-4xl font-extrabold text-gray-900 tracking-tight"
          >
            Welcome back, Learner!
          </motion.h1>
          <p className="text-gray-500 mt-2 text-lg">Your learning journey continues. Choose a course and start a quiz.</p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-4 gap-8 mb-12">
            <motion.div 
               initial={{ opacity: 0, scale: 0.95 }}
               animate={{ opacity: 1, scale: 1 }}
               className="lg:col-span-3"
            >
              <h2 className="text-2xl font-bold text-gray-800 mb-6 flex items-center space-x-2">
                <Layers className="text-indigo-600 w-6 h-6" />
                <span>Available Quizzes</span>
              </h2>

              {loading ? (
                <div className="flex justify-center py-20 bg-white rounded-3xl border border-gray-100 shadow-sm">
                  <div className="animate-spin rounded-full h-12 w-12 border-4 border-indigo-600 border-t-transparent"></div>
                </div>
              ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {quizzes.length > 0 ? quizzes.map((quiz, index) => (
                    <motion.div 
                      key={quiz.id}
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: index * 0.1 }}
                      className="bg-white rounded-3xl p-6 border border-gray-100 shadow-sm hover:shadow-xl transition-all group border-b-4 border-b-transparent hover:border-b-indigo-500"
                    >
                      <div className="flex justify-between items-start mb-4">
                        <span className="bg-indigo-50 text-indigo-600 text-xs font-black px-3 py-1 rounded-full uppercase tracking-tighter shadow-sm">
                          {quiz.course || 'General'}
                        </span>
                        <div className="flex items-center text-gray-400 text-xs font-bold space-x-1">
                          <HelpCircle className="w-4 h-4" />
                          <span>{quiz.questions?.length || 0} Questions</span>
                        </div>
                      </div>
                      <h3 className="text-xl font-bold text-gray-900 mb-2 truncate group-hover:text-indigo-600 transition-colors">{quiz.title}</h3>
                      <p className="text-gray-500 text-sm mb-6 line-clamp-2">{quiz.description || 'Practice your skills with this quiz.'}</p>
                      <Link 
                        to={`/student/quiz/${quiz.id}`}
                        className="w-full bg-gray-50 hover:bg-indigo-600 hover:text-white text-indigo-600 font-black py-3 rounded-2xl transition-all flex items-center justify-center space-x-2 border-2 border-indigo-50 group-hover:border-indigo-600"
                      >
                        <span>Take Quiz</span>
                        <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
                      </Link>
                    </motion.div>
                  )) : (
                    <div className="col-span-full bg-white border-2 border-dashed border-gray-200 rounded-3xl p-12 text-center shadow-sm">
                      <BookMarked className="text-gray-300 w-12 h-12 mx-auto mb-4" />
                      <h3 className="text-xl font-bold text-gray-800">No quizzes available</h3>
                      <p className="text-gray-500">Check back later for new courses and quizzes.</p>
                    </div>
                  )}
                </div>
              )}
            </motion.div>

            <motion.div 
               initial={{ opacity: 0, x: 20 }}
               animate={{ opacity: 1, x: 0 }}
               className="space-y-6"
            >
               <div className="bg-indigo-600 rounded-3xl p-8 text-white shadow-xl shadow-indigo-200 relative overflow-hidden">
                  <div className="absolute top-0 right-0 p-4 opacity-10">
                    <BookOpen className="w-40 h-40 transform translate-x-10 -translate-y-10" />
                  </div>
                  <h3 className="text-xl font-bold mb-2">My Progress</h3>
                  <div className="mt-4 space-y-4">
                    <div className="flex justify-between items-end">
                      <span className="text-indigo-100 font-bold opacity-80 text-sm uppercase">Quizzes Taken</span>
                      <span className="text-3xl font-black">12</span>
                    </div>
                    <div className="w-full bg-indigo-500/50 rounded-full h-2 overflow-hidden">
                      <div className="bg-white h-full transition-all duration-1000" style={{ width: '65%' }}></div>
                    </div>
                    <p className="text-indigo-100 text-xs font-bold leading-relaxed">
                      You're in the top 15% of students this week! Keep it up.
                    </p>
                  </div>
               </div>

               <div className="bg-white rounded-3xl p-6 border border-gray-100 shadow-sm">
                  <h3 className="text-lg font-black text-gray-800 mb-6 flex items-center space-x-2">
                    <Calendar className="text-indigo-600 w-5 h-5" />
                    <span>Upcoming Events</span>
                  </h3>
                  <div className="space-y-4">
                    {[
                      { title: 'React Masterclass', date: 'Tomorrow, 10 AM', color: 'bg-emerald-500' },
                      { title: 'UI Design Review', date: 'Mar 25, 4 PM', color: 'bg-amber-500' },
                    ].map((event, i) => (
                      <div key={i} className="flex items-center space-x-4 group cursor-pointer">
                        <div className={`w-12 h-12 shrink-0 ${event.color} rounded-2xl shadow-lg flex flex-col items-center justify-center text-white scale-90 group-hover:scale-100 transition-transform`}>
                          <span className="font-black text-lg leading-none">!</span>
                        </div>
                        <div>
                          <h4 className="font-bold text-gray-900 text-sm group-hover:text-indigo-600 transition-colors">{event.title}</h4>
                          <p className="text-gray-400 text-xs font-bold uppercase tracking-widest">{event.date}</p>
                        </div>
                      </div>
                    ))}
                  </div>
               </div>
            </motion.div>
        </div>
      </main>
    </div>
  );
};

export default StudentDashboard;
