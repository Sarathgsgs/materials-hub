import React from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { FaBook, FaUserTie, FaStar } from 'react-icons/fa';

const SubjectCard = ({ subject }) => {
  const totalFiles = subject.units.reduce((acc, unit) => acc + unit.files.length, 0);

  return (
    <motion.div
      whileHover={{ y: -8, boxShadow: "0 20px 40px rgba(0,0,0,0.1)" }}
      whileTap={{ scale: 0.98 }}
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
    >
      <Link to={`/subject/${subject.id}`} className="subject-card" style={{ borderTopColor: subject.color }}>
        <div className="subject-icon" style={{ background: `linear-gradient(135deg, ${subject.color}22, ${subject.color}44)` }}>
          <span style={{ fontSize: '3rem' }}>{subject.icon}</span>
        </div>
        
        <div className="subject-header">
          <h3>{subject.name}</h3>
          <span className="subject-code">{subject.code}</span>
        </div>

        <div className="subject-info">
          <div className="info-item">
            <FaUserTie />
            <span>{subject.professor}</span>
          </div>
          <div className="info-item">
            <FaStar />
            <span>{subject.credits} Credits</span>
          </div>
          <div className="info-item">
            <FaBook />
            <span>{totalFiles} Files</span>
          </div>
        </div>

        <div className="subject-footer">
          <span className="unit-count">{subject.units.length} Units</span>
          <button className="explore-btn" style={{ background: subject.color }}>
            Explore →
          </button>
        </div>
      </Link>
    </motion.div>
  );
};

export default SubjectCard;