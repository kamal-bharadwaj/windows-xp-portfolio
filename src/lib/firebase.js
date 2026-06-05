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
  getDoc,
  setDoc,
  updateDoc,
  deleteDoc,
  doc,
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

// ─── Contact Message Helpers ──────────────────────────────────
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
  return snapshot.docs.map((d) => ({ id: d.id, ...d.data() }));
};

export const deleteContactMessage = async (id) => {
  await deleteDoc(doc(db, 'contacts', id));
};

// ─── Portfolio Data Helpers ───────────────────────────────────
const PORTFOLIO_DOC = doc(db, 'portfolio', 'data');

export const getPortfolioData = async () => {
  const snap = await getDoc(PORTFOLIO_DOC);
  if (snap.exists()) {
    return snap.data();
  }
  return null; // no data in Firestore yet
};

export const seedPortfolioData = async (defaultData) => {
  // Only seed if the document doesn't exist
  const snap = await getDoc(PORTFOLIO_DOC);
  if (!snap.exists()) {
    await setDoc(PORTFOLIO_DOC, defaultData);
    return true; // seeded
  }
  return false; // already existed
};

export const savePortfolioSection = async (section, data) => {
  await updateDoc(PORTFOLIO_DOC, { [section]: data });
};

export const saveFullPortfolioData = async (data) => {
  await setDoc(PORTFOLIO_DOC, data, { merge: true });
};

export { auth, db };
