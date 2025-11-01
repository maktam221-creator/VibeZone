import { initializeApp } from 'firebase/app';
import { getAuth } from 'firebase/auth';

// إعدادات Firebase - استبدلها بإعدادات مشروعك
const firebaseConfig = {
  apiKey: "your-api-key-here",
  authDomain: "your-project.firebaseapp.com",
  projectId: "your-project-id",
  storageBucket: "your-project.appspot.com",
  messagingSenderId: "123456789",
  appId: "your-app-id"
};

// تهيئة Firebase
export const app = initializeApp(firebaseConfig);

// تهيئة Authentication
export const auth = getAuth(app);