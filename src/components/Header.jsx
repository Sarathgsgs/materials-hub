import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { FaMoon, FaSun, FaGraduationCap, FaSignOutAlt, FaUserCircle, FaTachometerAlt } from 'react-icons/fa';
import { useAuth } from '../context/AuthContext';
import '../styles/Header.css';

const Header = ({ darkMode, toggleDarkMode }) => {
  const { user, logout, isTeacher } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  return (
    <header className="header">
      <div className="header-container">
        <Link to="/" className="logo">
          <FaGraduationCap className="logo-icon" />
          <div>
            <h1>Materials Hub</h1>
            <p>Your Academic Hub</p>
          </div>
        </Link>
        
        <nav className="nav-menu">
          <Link to="/" className="nav-link">Home</Link>
          
          {/* Teacher Dashboard Link */}
          {isTeacher && (
            <Link to="/teacher-dashboard" className="nav-link dashboard-link">
              <FaTachometerAlt /> Dashboard
            </Link>
          )}

          <div className="user-info">
            <FaUserCircle />
            <span>{user?.name}</span>
            <span className={`role-badge ${user?.role}`}>{user?.role}</span>
          </div>

          <button className="theme-toggle" onClick={toggleDarkMode}>
            {darkMode ? <FaSun /> : <FaMoon />}
          </button>

          <button className="logout-btn" onClick={handleLogout}>
            <FaSignOutAlt /> <span>Logout</span>
          </button>
        </nav>
      </div>
    </header>
  );
};

export default Header;