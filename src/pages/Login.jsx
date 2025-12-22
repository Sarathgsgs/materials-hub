import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { FaGraduationCap, FaUserGraduate, FaChalkboardTeacher, FaLock, FaUser } from 'react-icons/fa';
import { useAuth } from '../context/AuthContext';
import '../styles/Login.css';

const Login = () => {
  const [selectedRole, setSelectedRole] = useState(null); // 'student' or 'teacher'
  const [teacherName, setTeacherName] = useState('');
  const [teacherPassword, setTeacherPassword] = useState('');
  const [error, setError] = useState('');
  const [showPassword, setShowPassword] = useState(false);

  const { loginAsStudent, loginAsTeacher } = useAuth();
  const navigate = useNavigate();

  const handleStudentLogin = () => {
    loginAsStudent();
    navigate('/');
  };

  const handleTeacherLogin = (e) => {
    e.preventDefault();
    setError('');

    if (!teacherName || !teacherPassword) {
      setError('Please enter both name and password');
      return;
    }

    const result = loginAsTeacher(teacherName, teacherPassword);
    
    if (result.success) {
      navigate('/');
    } else {
      setError(result.message);
      setTeacherPassword('');
    }
  };

  const handleBack = () => {
    setSelectedRole(null);
    setTeacherName('');
    setTeacherPassword('');
    setError('');
  };

  return (
    <div className="login-page">
      <div className="login-container">
        {/* Header */}
        <motion.div 
          className="login-header"
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
        >
          <FaGraduationCap className="login-logo" />
          <h1>Materials Hub</h1>
          <p>Your Academic Portal</p>
        </motion.div>

        {/* Role Selection */}
        {!selectedRole && (
          <motion.div 
            className="role-selection"
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.2 }}
          >
            <h2>Select Your Role</h2>
            <p className="role-subtitle">Choose how you want to continue</p>

            <div className="role-cards">
              {/* Student Card */}
              <motion.div
                className="role-card student-card"
                whileHover={{ scale: 1.05, y: -5 }}
                whileTap={{ scale: 0.95 }}
                onClick={handleStudentLogin}
              >
                <div className="role-icon student-icon">
                  <FaUserGraduate size={50} />
                </div>
                <h3>Student</h3>
                <p>Access study materials and resources</p>
                <button className="role-btn student-btn">
                  Continue as Student
                </button>
              </motion.div>

              {/* Teacher Card */}
              <motion.div
                className="role-card teacher-card"
                whileHover={{ scale: 1.05, y: -5 }}
                whileTap={{ scale: 0.95 }}
                onClick={() => setSelectedRole('teacher')}
              >
                <div className="role-icon teacher-icon">
                  <FaChalkboardTeacher size={50} />
                </div>
                <h3>Teacher</h3>
                <p>Upload and manage course materials</p>
                <button className="role-btn teacher-btn">
                  Continue as Teacher
                </button>
              </motion.div>
            </div>
          </motion.div>
        )}

        {/* Teacher Login Form */}
        {selectedRole === 'teacher' && (
          <motion.div 
            className="teacher-login-form"
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
          >
            <button className="back-btn" onClick={handleBack}>
              ← Back
            </button>

            <div className="form-header">
              <FaChalkboardTeacher size={40} className="form-icon" />
              <h2>Teacher Login</h2>
              <p>Enter your credentials to continue</p>
            </div>

            <form onSubmit={handleTeacherLogin}>
              {error && (
                <motion.div 
                  className="error-message"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                >
                  {error}
                </motion.div>
              )}

              <div className="form-group">
                <label htmlFor="name">
                  <FaUser /> Name
                </label>
                <input
                  type="text"
                  id="name"
                  placeholder="Enter your name"
                  value={teacherName}
                  onChange={(e) => setTeacherName(e.target.value)}
                  autoFocus
                />
              </div>

              <div className="form-group">
                <label htmlFor="password">
                  <FaLock /> Password
                </label>
                <div className="password-input-wrapper">
                  <input
                    type={showPassword ? 'text' : 'password'}
                    id="password"
                    placeholder="Enter your password"
                    value={teacherPassword}
                    onChange={(e) => setTeacherPassword(e.target.value)}
                  />
                  <button
                    type="button"
                    className="toggle-password"
                    onClick={() => setShowPassword(!showPassword)}
                  >
                    {showPassword ? '👁️' : '👁️‍🗨️'}
                  </button>
                </div>
              </div>

              <button type="submit" className="submit-btn">
                Login as Teacher
              </button>

              <div className="demo-credentials">
                <p><strong>Demo Credentials:</strong></p>
                <p>Name: <code>admin</code> | Password: <code>admin123</code></p>
                <p>Name: <code>Dr. Smith</code> | Password: <code>smith123</code></p>
              </div>
            </form>
          </motion.div>
        )}
      </div>

      {/* Background Decoration */}
      <div className="login-bg-decoration">
        <div className="circle circle-1"></div>
        <div className="circle circle-2"></div>
        <div className="circle circle-3"></div>
      </div>
    </div>
  );
};

export default Login;