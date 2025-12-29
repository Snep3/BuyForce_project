// firebase/firebase.ts
import { initializeApp } from 'firebase/app';
import { getAuth } from 'firebase/auth';

// 🔁 TEMP FIREBASE CONFIG
// 👉 when you get the real project, replace ONLY this object
const firebaseConfig = {
  apiKey: "AIzaSyAvXVuDlVRudJynso0cD96gJR69ItWNmzg",
  authDomain: "buyforce-v1.firebaseapp.com",
  projectId: "buyforce-v1",
  storageBucket: "buyforce-v1.firebasestorage.app",
  messagingSenderId: "999606949860",
  appId: "1:999606949860:web:9b10ecb43b7040078619f1"
};

const app = initializeApp(firebaseConfig);

// 🔹 Firebase Auth instance
export const auth = getAuth(app);

export const GOOGLE_WEB_CLIENT_ID ='999606949860-r6nao63m8crlrbfftu3pjks31gd6g658.apps.googleusercontent.com';