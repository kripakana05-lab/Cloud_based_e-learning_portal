import React, { useState } from 'react';
import AdminLayout from '../../components/AdminLayout';
import { motion, AnimatePresence } from 'framer-motion';
import { Plus, Trash2, Save, ArrowLeft, PlusCircle } from 'lucide-react';
import { useNavigate, Link } from 'react-router-dom';
import { useQuiz } from '../../context/QuizContext';
import { useCourses } from '../../context/CourseContext';

const CreateQuiz = () => {
  const [title, setTitle] = useState('');
  const [course, setCourse] = useState('');
  const [description, setDescription] = useState('');
  const [questions, setQuestions] = useState([
    { question: '', options: ['', '', '', ''], correctAnswer: 0 }
  ]);
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const { createQuiz } = useQuiz();
  const { courses, fetchCourses } = useCourses();

  React.useEffect(() => {
    fetchCourses();
  }, []);

  const addQuestion = () => {
    setQuestions([...questions, { question: '', options: ['', '', '', ''], correctAnswer: 0 }]);
  };

  const removeQuestion = (index) => {
    if (questions.length > 1) {
      setQuestions(questions.filter((_, i) => i !== index));
    }
  };

  const handleQuestionChange = (index, value) => {
    const newQuestions = [...questions];
    newQuestions[index].question = value;
    setQuestions(newQuestions);
  };

  const handleOptionChange = (qIndex, oIndex, value) => {
    const newQuestions = [...questions];
    newQuestions[qIndex].options[oIndex] = value;
    setQuestions(newQuestions);
  };

  const handleCorrectAnswerChange = (qIndex, value) => {
    const newQuestions = [...questions];
    newQuestions[qIndex].correctAnswer = parseInt(value);
    setQuestions(newQuestions);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!title || !course || questions.some(q => !q.question || q.options.some(o => !o))) {
      alert('Please fill in all fields.');
      return;
    }

    try {
      setLoading(true);
      await createQuiz({
        title,
        course,
        description,
        questions,
      });
      navigate('/admin');
    } catch (err) {
      console.error(err);
      alert('Failed to create quiz: ' + err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <AdminLayout>
      <div className="max-w-5xl mx-auto px-6 py-10">
        <Link to="/admin" className="inline-flex items-center text-gray-500 hover:text-indigo-600 font-bold mb-8 transition-colors group">
          <ArrowLeft className="w-5 h-5 mr-2 group-hover:-translate-x-1 transition-transform" />
          <span>Back to Dashboard</span>
        </Link>

        <div className="bg-white rounded-[2rem] shadow-xl shadow-indigo-100/50 border border-gray-100 overflow-hidden mb-12">
          <div className="p-8 lg:p-12">
            <h1 className="text-3xl font-black text-gray-900 mb-8 flex items-center space-x-3">
              <span className="bg-indigo-600 p-2 rounded-xl text-white">
                <PlusCircle className="w-6 h-6" />
              </span>
              <span>Create New Quiz</span>
            </h1>

            <form onSubmit={handleSubmit} className="space-y-10">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                <div className="space-y-2">
                  <label className="text-sm font-black text-gray-400 uppercase tracking-widest px-1">Quiz Title</label>
                  <input 
                    type="text" 
                    placeholder="e.g., Intro to Javascript" 
                    className="w-full px-6 py-4 bg-gray-50 rounded-2xl border-2 border-transparent focus:border-indigo-500 focus:bg-white outline-none transition-all text-gray-800 font-bold shadow-sm"
                    value={title}
                    onChange={(e) => setTitle(e.target.value)}
                    required
                  />
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-black text-gray-400 uppercase tracking-widest px-1">Select Course</label>
                  <select 
                    className="w-full px-6 py-4 bg-gray-50 rounded-2xl border-2 border-transparent focus:border-indigo-500 focus:bg-white outline-none transition-all text-gray-800 font-bold shadow-sm appearance-none cursor-pointer"
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
                <label className="text-sm font-black text-gray-400 uppercase tracking-widest px-1">Description (Optional)</label>
                <textarea 
                  placeholder="Tell students what this quiz covers..." 
                  className="w-full px-6 py-4 bg-gray-50 rounded-2xl border-2 border-transparent focus:border-indigo-500 focus:bg-white outline-none transition-all text-gray-800 font-bold shadow-sm min-h-[100px]"
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                />
              </div>

              <div className="pt-8 border-t border-gray-100">
                <h2 className="text-2xl font-black text-gray-900 mb-8 flex items-center justify-between">
                  <span>Questions</span>
                  <span className="text-sm text-gray-400 font-bold">{questions.length} total</span>
                </h2>

                <div className="space-y-12">
                  <AnimatePresence>
                    {questions.map((q, qIndex) => (
                      <motion.div 
                        key={qIndex}
                        initial={{ opacity: 0, scale: 0.95 }}
                        animate={{ opacity: 1, scale: 1 }}
                        exit={{ opacity: 0, scale: 0.95 }}
                        className="p-8 rounded-[1.5rem] bg-gray-50 border border-gray-100 relative group"
                      >
                        <button 
                          type="button"
                          onClick={() => removeQuestion(qIndex)}
                          className="absolute -top-4 -right-4 bg-white shadow-lg text-gray-400 hover:text-red-500 p-3 rounded-full opacity-0 group-hover:opacity-100 transition-all transform hover:scale-110 border border-gray-100"
                        >
                          <Trash2 className="w-5 h-5" />
                        </button>

                        <div className="flex items-start space-x-4 mb-6">
                           <div className="bg-indigo-600 text-white w-8 h-8 rounded-full flex items-center justify-center font-black shrink-0 shadow-md">
                             {qIndex + 1}
                           </div>
                           <input 
                            type="text" 
                            placeholder="Enter your question here..." 
                            className="w-full bg-transparent border-b-2 border-gray-200 focus:border-indigo-500 outline-none py-1 text-lg font-bold text-gray-800 transition-colors"
                            value={q.question}
                            onChange={(e) => handleQuestionChange(qIndex, e.target.value)}
                            required
                          />
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 ml-12">
                          {q.options.map((option, oIndex) => (
                            <div key={oIndex} className="flex items-center space-x-3 bg-white p-4 rounded-xl shadow-sm border border-gray-100 focus-within:ring-2 focus-within:ring-indigo-500/20 transition-all">
                              <input 
                                type="radio" 
                                name={`correct-${qIndex}`}
                                checked={q.correctAnswer === oIndex}
                                onChange={() => handleCorrectAnswerChange(qIndex, oIndex)}
                                className="w-5 h-5 text-indigo-600 focus:ring-indigo-500"
                              />
                              <input 
                                type="text" 
                                placeholder={`Option ${oIndex + 1}`} 
                                className="bg-transparent outline-none w-full text-gray-700 font-semibold"
                                value={option}
                                onChange={(e) => handleOptionChange(qIndex, oIndex, e.target.value)}
                                required
                              />
                            </div>
                          ))}
                        </div>
                      </motion.div>
                    ))}
                  </AnimatePresence>
                </div>

                <button 
                  type="button" 
                  onClick={addQuestion}
                  className="w-full mt-10 py-6 border-2 border-dashed border-gray-200 rounded-3xl text-gray-400 font-black hover:border-indigo-400 hover:text-indigo-600 transition-all flex items-center justify-center space-x-3 hover:bg-indigo-50/50"
                >
                  <Plus className="w-6 h-6" />
                  <span>Add Another Question</span>
                </button>
              </div>

              <div className="pt-12 border-t border-gray-100 flex justify-end">
                <button 
                  type="submit" 
                  disabled={loading}
                  className="bg-indigo-600 hover:bg-indigo-700 text-white font-black py-4 px-12 rounded-2xl shadow-xl shadow-indigo-200 transition-all transform hover:-translate-y-1 active:scale-95 disabled:opacity-50 flex items-center space-x-3"
                >
                  {loading ? 'Publishing...' : (
                    <>
                      <Save className="w-6 h-6" />
                      <span>Publish Quiz</span>
                    </>
                  )}
                </button>
              </div>
            </form>
          </div>
        </div>
      </div>
    </AdminLayout>
  );
};

export default CreateQuiz;
