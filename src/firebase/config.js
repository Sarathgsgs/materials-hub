import { initializeApp } from 'firebase/app';
import { getFirestore } from 'firebase/firestore';
import { getStorage } from 'firebase/storage';
import { getAuth } from 'firebase/auth';

const firebaseConfig = {
  apiKey: "AIzaSyD-RPnssWco6qE8PsR8dROM0N1vDDFfFJ",
  authDomain: "materials-hub-d93e2.firebaseapp.com",
  projectId: "materials-hub-d93e2",
  storageBucket: "materials-hub-d93e2.firebasestorage.app",
  messagingSenderId: "94069466916",
  appId: "1:94069466916:web:994f70526e2e4026fdf5b1",
  measurementId: "G-Y2DX6PBL1N"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

// Initialize services
export const db = getFirestore(app);
export const storage = getStorage(app);
export const auth = getAuth(app);

export default app;