// firebase/auth.ts
import {
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  signOut,
} from 'firebase/auth';
import { auth } from './firebase';

// 🔹 LOGIN
export const firebaseLogin = async (email: string, password: string) => {
  const userCredential = await signInWithEmailAndPassword(
    auth,
    email,
    password
  );
  return userCredential.user;
};

// 🔹 REGISTER
export const firebaseRegister = async (email: string, password: string) => {
  const userCredential = await createUserWithEmailAndPassword(
    auth,
    email,
    password
  );
  return userCredential.user;
};

// 🔹 LOGOUT (future-proof)
export const firebaseLogout = async () => {
  await signOut(auth);
};



