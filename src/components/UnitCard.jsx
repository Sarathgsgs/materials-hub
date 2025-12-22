import React from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { FaFolder, FaFilePdf, FaStar } from 'react-icons/fa';

const UnitCard = ({ unit, subjectId, color }) => {
  const fileCount = unit.files.length;

  return (
    <motion.div
      whileHover={{ scale: 1.02 }}
      whileTap={{ scale: 0.98 }}
      initial={{ opacity: 0, x: -20 }}
      animate={{ opacity: 1, x: 0 }}
    >
      <Link 
        to={`/subject/${subjectId}/unit/${unit.id}`} 
        className={`unit-card ${unit.isMiniQB ? 'mini-qb-card' : ''}`}
      >
        <div className="unit-icon" style={{ color: unit.isMiniQB ? '#ff6b6b' : color }}>
          {unit.isMiniQB ? <FaStar size={24} /> : <FaFolder size={24} />}
        </div>
        
        <div className="unit-content">
          <h4>{unit.name}</h4>
          <div className="unit-meta">
            <span className="file-count">
              <FaFilePdf /> {fileCount} {fileCount === 1 ? 'File' : 'Files'}
            </span>
            {fileCount === 0 && <span className="empty-badge">Coming Soon</span>}
          </div>
        </div>

        <div className="unit-arrow">→</div>
      </Link>
    </motion.div>
  );
};

export default UnitCard;