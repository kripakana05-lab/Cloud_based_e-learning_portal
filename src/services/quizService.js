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
  where,
  orderBy 
} from 'firebase/firestore';

export const quizService = {
  async createQuiz(quizData) {
    const docRef = await addDoc(collection(db, 'quizzes'), {
      ...quizData,
      createdAt: new Date(),
    });
    return docRef.id;
  },

  async getAllQuizzes() {
    const q = query(collection(db, 'quizzes'), orderBy('createdAt', 'desc'));
    const querySnapshot = await getDocs(q);
    return querySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
  },

  async getQuizById(id) {
    const docRef = doc(db, 'quizzes', id);
    const docSnap = await getDoc(docRef);
    if (docSnap.exists()) {
      return { id: docSnap.id, ...docSnap.data() };
    }
    throw new Error('Quiz not found');
  },

  async deleteQuiz(id) {
    await deleteDoc(doc(db, 'quizzes', id));
  },

  async updateQuiz(id, quizData) {
    const docRef = doc(db, 'quizzes', id);
    await updateDoc(docRef, quizData);
  },

  async saveQuizAttempt(attemptData) {
    const docRef = await addDoc(collection(db, 'attempts'), {
      ...attemptData,
      completedAt: new Date(),
    });
    return docRef.id;
  },

  async getStudentAttempts(uid) {
    const q = query(
      collection(db, 'attempts'), 
      where('studentId', '==', uid)
    );
    const querySnapshot = await getDocs(q);
    return querySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
  }
};
