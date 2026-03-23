import React, { createContext, useContext, useState, useEffect } from 'react';
import { courseService } from '../services/courseService';

const CourseContext = createContext();

export const useCourses = () => useContext(CourseContext);

export const CourseProvider = ({ children }) => {
  const [courses, setCourses] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const fetchCourses = async () => {
    setLoading(true);
    try {
      const data = await courseService.getAllCourses();
      setCourses(data);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const addCourse = async (courseData) => {
    try {
      const id = await courseService.createCourse(courseData);
      await fetchCourses();
      return id;
    } catch (err) {
      throw err;
    }
  };

  const updateCourse = async (id, courseData) => {
    try {
      await courseService.updateCourse(id, courseData);
      await fetchCourses();
    } catch (err) {
      throw err;
    }
  };

  const deleteCourse = async (id) => {
    try {
      await courseService.deleteCourse(id);
      setCourses(courses.filter(c => c.id !== id));
    } catch (err) {
      throw err;
    }
  };

  const value = {
    courses,
    loading,
    error,
    fetchCourses,
    addCourse,
    updateCourse,
    deleteCourse
  };

  return (
    <CourseContext.Provider value={value}>
      {children}
    </CourseContext.Provider>
  );
};
