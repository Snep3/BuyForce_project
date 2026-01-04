import { initializeApp, getApps, getApp } from "firebase/app";
import { getAuth } from "firebase/auth";

const firebaseConfig = {
  apiKey: "AIzaSyCFyR4UvLWlq3CrzOKIg_T3l9THj7RznOU",
  authDomain: "buyforce-a79a2.firebaseapp.com",
  projectId: "buyforce-a79a2",
  storageBucket: "buyforce-a79a2.firebasestorage.app",
  messagingSenderId: "220068718978",
  appId: "1:220068718978:web:db5382d0bfe69e299d879b",
  measurementId: "G-1TTWG3WLK0",
};

const app = getApps().length ? getApp() : initializeApp(firebaseConfig);

export const auth = getAuth(app);
