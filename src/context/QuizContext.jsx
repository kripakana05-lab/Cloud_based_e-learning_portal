import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import { quizService } from '../services/quizService';
import { useAuth } from './AuthContext';

const QuizContext = createContext();

export const useQuiz = () => useContext(QuizContext);

export const QuizProvider = ({ children }) => {
  const [quizzes, setQuizzes] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const { currentUser } = useAuth();

  const fetchQuizzes = useCallback(async () => {
    setLoading(true);
    try {
      const data = await quizService.getAllQuizzes();
      setQuizzes(data);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }, []);

  const createQuiz = useCallback(async (quizData) => {
    try {
      const id = await quizService.createQuiz(quizData);
      await fetchQuizzes(); // Refresh list
      return id;
    } catch (err) {
      throw err;
    }
  }, [fetchQuizzes]);

  const updateQuiz = useCallback(async (id, quizData) => {
    try {
      await quizService.updateQuiz(id, quizData);
      await fetchQuizzes();
    } catch (err) {
      throw err;
    }
  }, [fetchQuizzes]);

  const deleteQuiz = useCallback(async (id) => {
    try {
      await quizService.deleteQuiz(id);
      setQuizzes(quizzes.filter(q => q.id !== id));
    } catch (err) {
      throw err;
    }
  }, [quizzes]);

  const submitAttempt = useCallback(async (quizId, score, totalQuestions, answers) => {
    if (!currentUser) return;
    try {
      await quizService.saveQuizAttempt({
        quizId,
        studentId: currentUser.uid,
        studentEmail: currentUser.email,
        score,
        totalQuestions,
        answers,
      });
    } catch (err) {
      throw err;
    }
  }, [currentUser]);

  const fetchStudentAttempts = useCallback(async () => {
    if (!currentUser) return [];
    try {
      return await quizService.getStudentAttempts(currentUser.uid);
    } catch (err) {
      console.error("Failed to fetch attempts", err);
      return [];
    }
  }, [currentUser]);

  const getQuiz = useCallback(async (id) => {
    return await quizService.getQuizById(id);
  }, []);

  const value = {
    quizzes,
    loading,
    error,
    fetchQuizzes,
    createQuiz,
    updateQuiz,
    deleteQuiz,
    submitAttempt,
    fetchStudentAttempts,
    getQuiz
  };

  return (
    <QuizContext.Provider value={value}>
      {children}
    </QuizContext.Provider>
  );
};
