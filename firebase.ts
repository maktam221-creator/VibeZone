import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";
import { getStorage } from "firebase/storage";

// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyDigKrx3vGUjj1PY9wkZaUyRPv4gin_QyY",
  authDomain: "vibe-2f27b.firebaseapp.com",
  projectId: "vibe-2f27b",
  storageBucket: "vibe-2f27b.firebasestorage.app",
  messagingSenderId: "1052204016227",
  appId: "1:1052204016227:web:f78e24ea0f40272a4e8e56",
  measurementId: "G-C7SE3KGGPT"
};


// تهيئة Firebase
const app = initializeApp(firebaseConfig);

// تهيئة خدمات Firebase وتصديرها
const auth = getAuth(app);
const db = getFirestore(app);
const storage = getStorage(app);

// يمكنك تصدير خدمات أخرى هنا مثل getStorage, getFunctions, etc.

export { app, auth, db, storage };