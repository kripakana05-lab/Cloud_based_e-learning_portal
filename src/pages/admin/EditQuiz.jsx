import React, { useState, useEffect } from 'react';
import AdminLayout from '../../components/AdminLayout';
import { motion, AnimatePresence } from 'framer-motion';
import { Plus, Trash2, Save, ArrowLeft, PlusCircle } from 'lucide-react';
import { useNavigate, useParams } from 'react-router-dom';
import { useQuiz } from '../../context/QuizContext';
import { useCourses } from '../../context/CourseContext';

const EditQuiz = () => {
  const { id } = useParams();
  const { getQuiz, updateQuiz } = useQuiz();
  const { courses, fetchCourses } = useCourses();
  const [title, setTitle] = useState('');
  const [course, setCourse] = useState('');
  const [description, setDescription] = useState('');
  const [questions, setQuestions] = useState([
    { question: '', options: ['', '', '', ''], correctAnswer: 0 }
  ]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    fetchCourses();
    const fetchQuiz = async () => {
      try {
        const data = await getQuiz(id);
        setTitle(data.title);
        setCourse(data.course);
        setDescription(data.description);
        setQuestions(data.questions);
      } catch (err) {
        console.error(err);
        alert('Failed to load quiz');
      } finally {
        setLoading(false);
      }
    };
    fetchQuiz();
  }, [id, getQuiz]);

  const handleAddQuestion = () => {
    setQuestions([...questions, { question: '', options: ['', '', '', ''], correctAnswer: 0 }]);
  };

  const handleQuestionChange = (index, field, value) => {
    const updatedQuestions = [...questions];
    updatedQuestions[index][field] = value;
    setQuestions(updatedQuestions);
  };

  const handleOptionChange = (qIndex, oIndex, value) => {
    const updatedQuestions = [...questions];
    updatedQuestions[qIndex].options[oIndex] = value;
    setQuestions(updatedQuestions);
  };

  const handleRemoveQuestion = (index) => {
    setQuestions(questions.filter((_, i) => i !== index));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (questions.length === 0) return alert('Add at least one question');
    
    try {
      setSaving(true);
      // We need to add updateQuiz to QuizContext or call quizService directly
      // For now, let's assume updateQuiz is available
      await updateQuiz(id, { title, course, description, questions });
      navigate('/admin');
    } catch (err) {
      alert('Failed to update quiz: ' + err.message);
    } finally {
      setSaving(false);
    }
  };

  if (loading) return (
    <AdminLayout>
       <div className="flex justify-center items-center h-full">
         <div className="animate-spin rounded-full h-12 w-12 border-4 border-indigo-600 border-t-transparent"></div>
       </div>
    </AdminLayout>
  );

  return (
    <AdminLayout>
      <div className="max-w-5xl mx-auto px-6 py-10">
        <button 
          onClick={() => navigate('/admin')}
          className="flex items-center text-gray-500 hover:text-indigo-600 font-bold mb-8 transition-colors group"
        >
          <ArrowLeft className="w-5 h-5 mr-2 group-hover:-translate-x-1 transition-transform" />
          Back to Dashboard
        </button>

        <div className="mb-10">
          <h1 className="text-4xl font-extrabold text-gray-900 tracking-tight">Edit Quiz</h1>
          <p className="text-gray-500 mt-2 text-lg">Modify the questions and details for your quiz.</p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-8 pb-32">
          {/* Header Info */}
          <div className="bg-white p-10 rounded-[2.5rem] shadow-sm border border-gray-100 space-y-8">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              <div className="space-y-2">
                <label className="text-sm font-black text-gray-700 uppercase tracking-widest ml-1">Quiz Title</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. React Hooks Masterclass"
                  className="w-full px-6 py-4 bg-gray-50 border-none rounded-2xl focus:ring-2 focus:ring-indigo-500 transition-all font-bold text-gray-900"
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                />
              </div>
              <div className="space-y-2">
                <label className="text-sm font-black text-gray-700 uppercase tracking-widest ml-1">Select Course</label>
                <select 
                  className="w-full px-6 py-4 bg-gray-50 border-none rounded-2xl focus:ring-2 focus:ring-indigo-500 transition-all font-bold text-gray-900 appearance-none cursor-pointer"
                  value={course}
                  onChange={(e) => setCourse(e.target.value)}
                  required
                >
                  <option value="">Choose a course</option>
                  {courses.map(c => (
                    <option key={c.id} value={c.title}>{c.title}</option>
                  ))}
                </select>
              </div>
            </div>
            <div className="space-y-2">
                <label className="text-sm font-black text-gray-700 uppercase tracking-widest ml-1">Quiz Description</label>
                <textarea
                  placeholder="What is this quiz about?"
                  className="w-full px-6 py-4 bg-gray-50 border-none rounded-2xl focus:ring-2 focus:ring-indigo-500 transition-all font-bold text-gray-900 resize-none"
                  rows="3"
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                />
              </div>
          </div>

          {/* Questions Section */}
          <div className="space-y-6">
            <h2 className="text-2xl font-black text-gray-800 flex items-center mb-2">
              Questions
              <span className="ml-3 px-3 py-1 bg-indigo-100 text-indigo-600 text-sm rounded-full">{questions.length}</span>
            </h2>
            
            {questions.map((q, qIndex) => (
              <motion.div 
                key={qIndex}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="bg-white p-8 rounded-[2.5rem] shadow-sm border border-gray-100 relative group"
              >
                <button
                  type="button"
                  onClick={() => handleRemoveQuestion(qIndex)}
                  className="absolute top-6 right-6 text-gray-300 hover:text-red-500 transition-colors p-2"
                >
                  <Trash2 className="w-6 h-6" />
                </button>

                <div className="space-y-6">
                  <div className="space-y-2">
                    <label className="text-sm font-black text-indigo-600 uppercase tracking-widest ml-1">Question {qIndex + 1}</label>
                    <input
                      type="text"
                      required
                      placeholder="Enter your question here..."
                      className="w-full px-6 py-4 bg-gray-50 border-none rounded-2xl focus:ring-2 focus:ring-indigo-500 transition-all font-bold text-gray-900"
                      value={q.question}
                      onChange={(e) => handleQuestionChange(qIndex, 'question', e.target.value)}
                    />
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {q.options.map((option, oIndex) => (
                      <div key={oIndex} className="relative group">
                        <input
                          type="text"
                          required
                          placeholder={`Option ${oIndex + 1}`}
                          className={`w-full pl-6 pr-12 py-4 border-2 rounded-2xl transition-all font-bold 
                            ${q.correctAnswer === oIndex 
                              ? 'bg-emerald-50 border-emerald-500 text-emerald-900 focus:ring-emerald-500' 
                              : 'bg-gray-50 border-transparent focus:bg-white focus:border-indigo-500 text-gray-700'}`}
                          value={option}
                          onChange={(e) => handleOptionChange(qIndex, oIndex, e.target.value)}
                        />
                        <button
                          type="button"
                          onClick={() => handleQuestionChange(qIndex, 'correctAnswer', oIndex)}
                          className={`absolute right-4 top-1/2 -translate-y-1/2 w-6 h-6 rounded-full border-2 transition-all
                            ${q.correctAnswer === oIndex 
                              ? 'bg-emerald-500 border-emerald-500 shadow-lg shadow-emerald-100 scale-110' 
                              : 'border-gray-300 hover:border-indigo-500'}`}
                        />
                      </div>
                    ))}
                  </div>
                </div>
              </motion.div>
            ))}
          </div>

          {/* Action Bar */}
          <div className="fixed bottom-10 left-1/2 -translate-x-1/2 flex items-center space-x-4 bg-white/80 backdrop-blur-xl p-4 rounded-3xl shadow-2xl border border-white/20 scale-110 origin-bottom z-50">
            <button
              type="button"
              onClick={handleAddQuestion}
              className="flex items-center space-x-2 bg-gray-900 hover:bg-black text-white px-6 py-4 rounded-2xl font-black transition-all transform hover:-translate-y-1 active:scale-95"
            >
              <PlusCircle className="w-6 h-6" />
              <span>Add Question</span>
            </button>
            <button
              type="submit"
              disabled={saving}
              className="flex items-center space-x-2 bg-indigo-600 hover:bg-indigo-700 text-white px-10 py-4 rounded-2xl font-black transition-all shadow-xl shadow-indigo-200 transform hover:-translate-y-1 active:scale-95 disabled:opacity-50"
            >
              <Save className="w-6 h-6" />
              <span>{saving ? 'Updating...' : 'Update Quiz'}</span>
            </button>
          </div>
        </form>
      </div>
    </AdminLayout>
  );
};

export default EditQuiz;
