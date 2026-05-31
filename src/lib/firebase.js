'use client';

import { initializeApp, getApps, getApp } from 'firebase/app';
import {
  getAuth,
  signInWithEmailAndPassword,
  signInWithPopup,
  GoogleAuthProvider,
  signOut,
  onAuthStateChanged,
} from 'firebase/auth';
import {
  getFirestore,
  collection,
  addDoc,
  getDocs,
  serverTimestamp,
  orderBy,
  query,
} from 'firebase/firestore';
import firebaseConfig from './firebaseConfig';

// Initialize Firebase (singleton)
const app = getApps().length ? getApp() : initializeApp(firebaseConfig);
const auth = getAuth(app);
const db = getFirestore(app);
const googleProvider = new GoogleAuthProvider();

// ─── Auth Helpers ─────────────────────────────────────────────
export const loginWithEmail = (email, password) =>
  signInWithEmailAndPassword(auth, email, password);

export const loginWithGoogle = () =>
  signInWithPopup(auth, googleProvider);

export const logout = () => signOut(auth);

export const onAuthChange = (callback) =>
  onAuthStateChanged(auth, callback);

// ─── Firestore Helpers ────────────────────────────────────────
export const submitContactMessage = async ({ name, email, message }) => {
  const docRef = await addDoc(collection(db, 'contacts'), {
    name,
    email,
    message,
    timestamp: serverTimestamp(),
  });
  return docRef.id;
};

export const getContactMessages = async () => {
  const q = query(collection(db, 'contacts'), orderBy('timestamp', 'desc'));
  const snapshot = await getDocs(q);
  return snapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() }));
};

export { auth, db };
