import { db } from '../firebase';
import { 
  collection, 
  addDoc, 
  getDocs, 
  getDoc, 
  doc, 
  deleteDoc, 
  updateDoc,
  query, 
  orderBy 
} from 'firebase/firestore';

export const courseService = {
  async createCourse(courseData) {
    const docRef = await addDoc(collection(db, 'courses'), {
      ...courseData,
      createdAt: new Date(),
    });
    return docRef.id;
  },

  async getAllCourses() {
    const q = query(collection(db, 'courses'), orderBy('createdAt', 'desc'));
    const querySnapshot = await getDocs(q);
    return querySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
  },

  async getCourseById(id) {
    const docRef = doc(db, 'courses', id);
    const docSnap = await getDoc(docRef);
    if (docSnap.exists()) {
      return { id: docSnap.id, ...docSnap.data() };
    }
    throw new Error('Course not found');
  },

  async updateCourse(id, courseData) {
    const docRef = doc(db, 'courses', id);
    await updateDoc(docRef, courseData);
  },

  async deleteCourse(id) {
    await deleteDoc(doc(db, 'courses', id));
  }
};
