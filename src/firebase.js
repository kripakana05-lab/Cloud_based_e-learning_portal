import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyDG-AZP1p6nn-gGBCBtxRjKiN-0eU4abyI",
  authDomain: "cloud-based-e-learning-portal.firebaseapp.com",
  projectId: "cloud-based-e-learning-portal",
  storageBucket: "cloud-based-e-learning-portal.firebasestorage.app",
  messagingSenderId: "140283619432",
  appId: "1:140283619432:web:d4ee3bb237586507dd73dd"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);
export const db = getFirestore(app);
