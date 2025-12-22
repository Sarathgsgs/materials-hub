import React from 'react';
import { motion } from 'framer-motion';
import { FaFilePdf, FaFileWord, FaFilePowerpoint, FaDownload, FaEye, FaClock } from 'react-icons/fa';

const FileCard = ({ file }) => {
  const getFileIcon = (type) => {
    switch(type) {
      case 'pdf': return <FaFilePdf color="#e74c3c" />;
      case 'doc': return <FaFileWord color="#2980b9" />;
      case 'ppt': return <FaFilePowerpoint color="#e67e22" />;
      default: return <FaFilePdf />;
    }
  };

  const handleDownload = (e) => {
    e.stopPropagation();
    const link = document.createElement('a');
    link.href = file.path;
    link.download = file.name;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  // ✅ NEW: Open in new tab
  const handlePreview = (e) => {
    e.stopPropagation();
    window.open(file.path, '_blank');
  };

  return (
    <motion.div
      className="file-card"
      whileHover={{ y: -4, boxShadow: "0 8px 16px rgba(0,0,0,0.1)" }}
      initial={{ opacity: 0, scale: 0.9 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ duration: 0.2 }}
    >
      <div className="file-icon">
        {getFileIcon(file.type)}
      </div>

      <div className="file-info">
        <h5 className="file-name">{file.name}</h5>
        <div className="file-meta">
          <span className="file-size">{file.size}</span>
          <span className="file-date">
            <FaClock size={12} /> {new Date(file.uploadDate).toLocaleDateString()}
          </span>
        </div>
      </div>

      <div className="file-actions">
        <button 
          className="action-btn preview-btn" 
          onClick={handlePreview}
          title="Open in New Tab"
        >
          <FaEye />
        </button>
        <button 
          className="action-btn download-btn" 
          onClick={handleDownload}
          title="Download"
        >
          <FaDownload />
        </button>
      </div>
    </motion.div>
  );
};

export default FileCard;