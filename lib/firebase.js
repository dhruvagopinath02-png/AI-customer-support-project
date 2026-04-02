import { initializeApp, getApps } from 'firebase/app';
import { getAuth, GoogleAuthProvider } from 'firebase/auth';

const firebaseConfig = {
    apiKey: "AIzaSyAtj19qC-LLei798dLyQ-VKlatFhz7UNQs",
    authDomain: "ai-customer-support-agen-19fe5.firebaseapp.com",
    projectId: "ai-customer-support-agen-19fe5",
    storageBucket: "ai-customer-support-agen-19fe5.firebasestorage.app",
    messagingSenderId: "807287566975",
    appId: "1:807287566975:web:18b5a7bf831de34f1d054a",
    measurementId: "G-VZM1P8NSMP"
  };

// Initialize Firebase
const app = getApps().length === 0 ? initializeApp(firebaseConfig) : getApps()[0];
const auth = getAuth(app);
const googleProvider = new GoogleAuthProvider();

export { auth, googleProvider };
