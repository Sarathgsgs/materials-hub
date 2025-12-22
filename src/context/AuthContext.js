import React, { createContext, useState, useContext, useEffect } from 'react';

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

  // Check if user is already logged in (from localStorage)
  useEffect(() => {
    const savedUser = localStorage.getItem('user');
    if (savedUser) {
      setUser(JSON.parse(savedUser));
    }
    setLoading(false);
  }, []);

  // Login as Student
  const loginAsStudent = () => {
    const studentUser = {
      role: 'student',
      name: 'Student',
      loginTime: new Date().toISOString()
    };
    setUser(studentUser);
    localStorage.setItem('user', JSON.stringify(studentUser));
  };

  // Login as Teacher
  const loginAsTeacher = (name, password) => {
    // Simple validation - You can expand this
    const validTeachers = [
      { name: 'Dr. Smith', password: 'smith123' },
      { name: 'Dr. Johnson', password: 'johnson123' },
      { name: 'Dr. Williams', password: 'williams123' },
      { name: 'admin', password: 'admin123' }
    ];

    const teacher = validTeachers.find(
      t => t.name.toLowerCase() === name.toLowerCase() && t.password === password
    );

    if (teacher) {
      const teacherUser = {
        role: 'teacher',
        name: teacher.name,
        loginTime: new Date().toISOString()
      };
      setUser(teacherUser);
      localStorage.setItem('user', JSON.stringify(teacherUser));
      return { success: true };
    } else {
      return { success: false, message: 'Invalid credentials' };
    }
  };

  // Logout
  const logout = () => {
    setUser(null);
    localStorage.removeItem('user');
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