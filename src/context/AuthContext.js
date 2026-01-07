import React, { createContext, useState, useContext, useEffect } from 'react';
import { 
  signInWithEmailAndPassword, 
  signOut, 
  onAuthStateChanged 
} from 'firebase/auth';
import { auth, db } from '../firebase/config';
import { doc, getDoc, setDoc } from 'firebase/firestore';

const AuthContext = createContext();

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within AuthProvider');
  }
  return context;
};

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  // Listen to auth state changes
  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (firebaseUser) => {
      if (firebaseUser) {
        // Get user data from Firestore
        const userDoc = await getDoc(doc(db, 'users', firebaseUser.uid));
        
        if (userDoc.exists()) {
          setUser({
            uid: firebaseUser.uid,
            email: firebaseUser.email,
            ...userDoc.data()
          });
        } else {
          // Create default user document
          const userData = {
            email: firebaseUser.email,
            role: 'student',
            name: firebaseUser.email.split('@')[0],
            createdAt: new Date().toISOString()
          };
          await setDoc(doc(db, 'users', firebaseUser.uid), userData);
          setUser({ uid: firebaseUser.uid, email: firebaseUser.email, ...userData });
        }
      } else {
        setUser(null);
      }
      setLoading(false);
    });

    return unsubscribe;
  }, []);

  // Login as Student (Anonymous - no credentials)
  const loginAsStudent = async () => {
    try {
      // Create a temporary student user
      const studentUser = {
        role: 'student',
        name: 'Student',
        email: 'student@local',
        isAnonymous: true,
        loginTime: new Date().toISOString()
      };
      setUser(studentUser);
      localStorage.setItem('anonymousStudent', 'true');
      return { success: true };
    } catch (error) {
      console.error('Student login error:', error);
      return { success: false, message: error.message };
    }
  };

  // Login as Teacher (Firebase Auth)
  const loginAsTeacher = async (email, password) => {
    try {
      const userCredential = await signInWithEmailAndPassword(auth, email, password);
      
      // Check if user is teacher
      const userDoc = await getDoc(doc(db, 'users', userCredential.user.uid));
      
      if (userDoc.exists() && userDoc.data().role === 'teacher') {
        return { success: true };
      } else {
        // Update role to teacher if not set
        await setDoc(doc(db, 'users', userCredential.user.uid), {
          role: 'teacher',
          email: userCredential.user.email,
          name: email.split('@')[0]
        }, { merge: true });
        return { success: true };
      }
    } catch (error) {
      console.error('Teacher login error:', error);
      return { 
        success: false, 
        message: error.code === 'auth/user-not-found' || error.code === 'auth/wrong-password'
          ? 'Invalid email or password'
          : error.message 
      };
    }
  };

  // Logout
  const logout = async () => {
    try {
      if (!user?.isAnonymous) {
        await signOut(auth);
      }
      setUser(null);
      localStorage.removeItem('anonymousStudent');
    } catch (error) {
      console.error('Logout error:', error);
    }
  };

  const value = {
    user,
    loading,
    loginAsStudent,
    loginAsTeacher,
    logout,
    isStudent: user?.role === 'student',
    isTeacher: user?.role === 'teacher',
    isAuthenticated: !!user
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};