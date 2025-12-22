import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider, useAuth } from './context/AuthContext';
import Header from './components/Header';
import Home from './pages/Home';
import SubjectView from './pages/SubjectView';
import UnitView from './pages/UnitView';
import Login from './pages/Login';
import TeacherDashboard from './pages/TeacherDashboard';
import './styles/App.css';
import './styles/components.css';

// Protected Route Component
const ProtectedRoute = ({ children }) => {
  const { isAuthenticated, loading } = useAuth();

  if (loading) {
    return (
      <div style={{ 
        display: 'flex', 
        justifyContent: 'center', 
        alignItems: 'center', 
        height: '100vh' 
      }}>
        <h2>Loading...</h2>
      </div>
    );
  }

  return isAuthenticated ? children : <Navigate to="/login" />;
};

// Teacher Only Route
const TeacherRoute = ({ children }) => {
  const { isTeacher, loading } = useAuth();

  if (loading) return <div>Loading...</div>;

  return isTeacher ? children : <Navigate to="/" />;
};

// App Content (needs to be inside AuthProvider)
function AppContent() {
  const [darkMode, setDarkMode] = useState(false);
  const { isAuthenticated } = useAuth();

  const toggleDarkMode = () => {
    setDarkMode(!darkMode);
  };

  useEffect(() => {
    if (darkMode) {
      document.documentElement.classList.add('dark');
      document.body.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
      document.body.classList.remove('dark');
    }
  }, [darkMode]);

  return (
    <div className={`App ${darkMode ? 'dark' : ''}`}>
      {isAuthenticated && (
        <Header darkMode={darkMode} toggleDarkMode={toggleDarkMode} />
      )}
      <Routes>
        <Route path="/login" element={<Login />} />
        <Route
          path="/"
          element={
            <ProtectedRoute>
              <Home />
            </ProtectedRoute>
          }
        />
        <Route
          path="/teacher-dashboard"
          element={
            <ProtectedRoute>
              <TeacherRoute>
                <TeacherDashboard />
              </TeacherRoute>
            </ProtectedRoute>
          }
        />
        <Route
          path="/subject/:subjectId"
          element={
            <ProtectedRoute>
              <SubjectView />
            </ProtectedRoute>
          }
        />
        <Route
          path="/subject/:subjectId/unit/:unitId"
          element={
            <ProtectedRoute>
              <UnitView />
            </ProtectedRoute>
          }
        />
      </Routes>
    </div>
  );
}

function App() {
  return (
    <Router>
      <AuthProvider>
        <AppContent />
      </AuthProvider>
    </Router>
  );
}

export default App;