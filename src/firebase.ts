import { initializeApp, getApps, getApp } from 'firebase/app';
import { getFirestore } from 'firebase/firestore';
import { getAuth } from 'firebase/auth';

export const firebaseConfig = {
  apiKey: "AIzaSyAMseI4KUxanP8C_u91t3dNJg4D5DDj19M",
  authDomain: "sharestream-2f374.firebaseapp.com",
  projectId: "sharestream-2f374",
  storageBucket: "sharestream-2f374.firebasestorage.app",
  messagingSenderId: "33094694566",
  appId: "1:33094694566:web:47bb1b90db244fc6d3a667",
  measurementId: "G-Y516R9GBC3"
};

const app = getApps().length === 0 ? initializeApp(firebaseConfig) : getApp();

export const db = getFirestore(app);
export const auth = getAuth(app);

export default app;