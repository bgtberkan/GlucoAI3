import { initializeApp } from 'firebase/app';
import { getAuth } from 'firebase/auth';
import { getFirestore } from 'firebase/firestore';

// Firebase yapılandırması
const firebaseConfig = {
  apiKey: "AIzaSyD8nqdaKyTTAdcPjesgV6Vm9f6Vo7SnCaU",
  authDomain: "myprojectmobilandweb.firebaseapp.com",
  projectId: "myprojectmobilandweb",
  storageBucket: "myprojectmobilandweb.firebasestorage.app",
  messagingSenderId: "846093636298",
  appId: "1:846093636298:web:4d3bd28da592db9439da33",
  measurementId: "G-42V5QSQEV6"
};

// Firebase'i başlat
const app = initializeApp(firebaseConfig);

// Auth ve Firestore servislerini başlat
const auth = getAuth(app);
const db = getFirestore(app);

export { auth, db }; 