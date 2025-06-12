import { initializeApp } from 'firebase/app';
import { getAuth } from 'firebase/auth';
import { getFirestore } from 'firebase/firestore';

const firebaseConfig = {
  // Replace with your Firebase config
  apiKey: "AIzaSyBhNVQqSKiQsIek6C0Z1-nB5Yavbk4Lopo",
  authDomain: "waterstreet-ced90.firebaseapp.com",
  projectId: "waterstreet-ced90",
  storageBucket: "waterstreet-ced90.firebasestorage.app",
  messagingSenderId: "292812131248",
  appId: "1:292812131248:web:724d2cdfbc345cc483e475",
  measurementId: "G-4VNRYTKEJZ"
};

const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);
export const db = getFirestore(app);
