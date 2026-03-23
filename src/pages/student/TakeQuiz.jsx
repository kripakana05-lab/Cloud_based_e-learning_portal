import React, { useEffect, useState } from 'react';
import { useAuth } from '../../context/AuthContext';
import { useQuiz } from '../../context/QuizContext';
import { useParams, useNavigate } from 'react-router-dom';
import Navbar from '../../components/Navbar';
import { motion, AnimatePresence } from 'framer-motion';
import { ChevronRight, ChevronLeft, CheckCircle2, Clock, Play, Flag, Trophy, ArrowRight } from 'lucide-react';

const TakeQuiz = () => {
  const { id } = useParams();
  const { userData } = useAuth();
  const { getQuiz, submitAttempt } = useQuiz();
  const navigate = useNavigate();
  const [quiz, setQuiz] = useState(null);
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [selectedOptions, setSelectedOptions] = useState({});
  const [showResult, setShowResult] = useState(false);
  const [score, setScore] = useState(0);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchQuiz = async () => {
      try {
        const data = await getQuiz(id);
        setQuiz(data);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    fetchQuiz();
  }, [id, getQuiz]);

  const handleOptionSelect = (optionIndex) => {
    setSelectedOptions({ ...selectedOptions, [currentQuestion]: optionIndex });
  };

  const nextQuestion = () => {
    if (currentQuestion < quiz.questions.length - 1) {
      setCurrentQuestion(currentQuestion + 1);
    }
  };

  const prevQuestion = () => {
    if (currentQuestion > 0) {
      setCurrentQuestion(currentQuestion - 1);
    }
  };

  const calculateScore = () => {
    let s = 0;
    quiz.questions.forEach((q, index) => {
      const selected = selectedOptions[index];
      // Only count as correct if the user selected an option AND it matches the correct answer
      // Using == to handle potential string/number mismatches from Firestore
      if (selected !== undefined && q.correctAnswer !== undefined && selected == q.correctAnswer) {
        s++;
      }
    });
    return s;
  };

  const handleSubmit = async () => {
    const s = calculateScore();
    setScore(s);
    setShowResult(true);
    
    // Save attempt using QuizContext
    try {
      await submitAttempt(id, s, quiz.questions.length, selectedOptions);
    } catch (err) {
      console.error("Error saving attempt:", err);
    }
  };

  if (loading) return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center">
      <div className="animate-spin rounded-full h-12 w-12 border-4 border-indigo-600 border-t-transparent"></div>
    </div>
  );

  if (!quiz) return <div className="p-10 text-center font-bold">Quiz not found</div>;

  if (showResult) {
    return (
      <div className="min-h-screen bg-indigo-600 flex items-center justify-center p-6 overflow-hidden relative">
        <div className="absolute top-0 left-0 w-full h-full opacity-10">
          <svg className="w-full h-full" viewBox="0 0 100 100" preserveAspectRatio="none">
            <defs>
              <pattern id="grid" width="10" height="10" patternUnits="userSpaceOnUse">
                <path d="M 10 0 L 0 0 0 10" fill="none" stroke="white" strokeWidth="0.5"/>
              </pattern>
            </defs>
            <rect width="100" height="100" fill="url(#grid)" />
          </svg>
        </div>
        
        <motion.div 
          initial={{ opacity: 0, scale: 0.8, y: 50 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          className="bg-white rounded-[3rem] p-12 max-w-lg w-full text-center shadow-2xl relative z-10"
        >
          <div className="bg-amber-100 w-24 h-24 rounded-full flex items-center justify-center mx-auto mb-8 shadow-inner">
            <Trophy className="text-amber-500 w-12 h-12" />
          </div>
          <h1 className="text-4xl font-black text-gray-900 mb-2 tracking-tight">Quiz Complete!</h1>
          <p className="text-gray-500 font-bold mb-10 text-lg">Amazing effort. Here's how you performed:</p>
          
          <div className="bg-gray-50 rounded-3xl p-8 mb-10 border border-indigo-100 shadow-sm">
            <div className="text-6xl font-black text-indigo-600 mb-2">
              {score} / {quiz.questions.length}
            </div>
            <p className="text-indigo-400 font-black uppercase text-xs tracking-[0.2em]">Correct Answers</p>
            
            <div className="mt-8 h-3 w-full bg-indigo-100 rounded-full overflow-hidden">
               <motion.div 
                 initial={{ width: 0 }}
                 animate={{ width: `${(score / quiz.questions.length) * 100}%` }}
                 transition={{ duration: 1, ease: "easeOut" }}
                 className="h-full bg-gradient-to-r from-indigo-500 to-indigo-700"
               />
            </div>
          </div>

          <button 
            onClick={() => navigate('/student')}
            className="w-full bg-indigo-600 hover:bg-indigo-700 text-white font-black py-4 rounded-2xl shadow-xl shadow-indigo-100 transition-all flex items-center justify-center space-x-2"
          >
            <span>Finish and Go Back</span>
            <ArrowRight className="w-5 h-5" />
          </button>
        </motion.div>
      </div>
    );
  }

  const currentQ = quiz.questions[currentQuestion];

  return (
    <div className="min-h-screen bg-gray-50/50 flex flex-col">
      <Navbar />
      <div className="max-w-4xl mx-auto px-6 py-12 w-full flex-grow">
        <div className="flex justify-between items-center mb-10">
          <div>
            <span className="bg-indigo-600 px-4 py-1.5 rounded-full text-white font-black text-xs uppercase tracking-widest shadow-md">
              Question {currentQuestion + 1} of {quiz.questions.length}
            </span>
          </div>
          <div className="flex items-center space-x-2 text-indigo-600 font-bold">
            <Clock className="w-5 h-5" />
            <span className="font-mono text-xl">15:00</span>
          </div>
        </div>

        <div className="bg-white rounded-[2.5rem] shadow-xl shadow-indigo-100/30 border border-gray-100 overflow-hidden relative">
          <div className="h-2 w-full bg-gray-50">
            <motion.div 
               className="h-full bg-indigo-600"
               initial={{ width: 0 }}
               animate={{ width: `${((currentQuestion + 1) / quiz.questions.length) * 100}%` }}
            />
          </div>

          <div className="p-10 lg:p-14">
            <AnimatePresence mode='wait'>
              <motion.div 
                key={currentQuestion}
                initial={{ opacity: 0, x: 50 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -50 }}
                transition={{ duration: 0.3 }}
              >
                <h2 className="text-3xl font-black text-gray-900 mb-12 flex items-start gap-4">
                  <span className="shrink-0 text-indigo-100 italic">"</span>
                  <span className="leading-tight">{currentQ.question}</span>
                  <span className="shrink-0 text-indigo-100 italic">"</span>
                </h2>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {currentQ.options.map((option, index) => (
                    <motion.button 
                      key={index}
                      whileHover={{ scale: 1.02 }}
                      whileTap={{ scale: 0.98 }}
                      onClick={() => handleOptionSelect(index)}
                      className={`p-6 rounded-2xl border-2 text-left transition-all font-bold flex items-center justify-between group
                        ${selectedOptions[currentQuestion] === index 
                          ? 'bg-indigo-600 border-indigo-600 text-white shadow-xl shadow-indigo-200' 
                          : 'bg-white border-gray-100 text-gray-700 hover:border-indigo-300 hover:bg-indigo-50/30 shadow-sm'}`}
                    >
                      <span className="flex items-center">
                        <span className={`w-8 h-8 rounded-full flex items-center justify-center mr-4 shrink-0 transition-colors
                          ${selectedOptions[currentQuestion] === index ? 'bg-indigo-500' : 'bg-gray-50 text-indigo-600 font-black'}`}>
                          {String.fromCharCode(65 + index)}
                        </span>
                        {option}
                      </span>
                      {selectedOptions[currentQuestion] === index && (
                        <CheckCircle2 className="w-6 h-6 text-white" />
                      )}
                    </motion.button>
                  ))}
                </div>
              </motion.div>
            </AnimatePresence>
          </div>
        </div>

        <div className="mt-10 flex justify-between items-center px-4">
          <button 
            onClick={prevQuestion}
            disabled={currentQuestion === 0}
            className="flex items-center space-x-2 text-gray-400 hover:text-indigo-600 font-black disabled:opacity-0 transition-all uppercase tracking-widest text-sm"
          >
            <ChevronLeft className="w-5 h-5" />
            <span>Previous</span>
          </button>

          {currentQuestion < quiz.questions.length - 1 ? (
            <button 
              onClick={nextQuestion}
              className="bg-indigo-600 hover:bg-indigo-700 text-white font-black py-4 px-10 rounded-2xl shadow-xl shadow-indigo-100 transition-all flex items-center space-x-3 transform hover:-translate-y-1 active:scale-95"
            >
              <span>Next Step</span>
              <ChevronRight className="w-5 h-5" />
            </button>
          ) : (
             <button 
              onClick={handleSubmit}
              className="bg-emerald-500 hover:bg-emerald-600 text-white font-black py-4 px-10 rounded-2xl shadow-xl shadow-emerald-100 transition-all flex items-center space-x-3 transform hover:-translate-y-1 active:scale-95"
            >
              <Flag className="w-5 h-5" />
              <span>Submit Quiz</span>
            </button>
          )}
        </div>
      </div>
    </div>
  );
};

export default TakeQuiz;
