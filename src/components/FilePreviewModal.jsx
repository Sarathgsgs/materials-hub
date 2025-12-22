import React, { useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { FaTimes, FaDownload } from 'react-icons/fa';

const FilePreviewModal = ({ file, onClose }) => {
  useEffect(() => {
    document.body.style.overflow = 'hidden';
    return () => {
      document.body.style.overflow = 'unset';
    };
  }, []);

  const handleDownload = () => {
    const link = document.createElement('a');
    link.href = file.path;
    link.download = file.name;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <AnimatePresence>
      <motion.div 
        className="modal-overlay"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        onClick={onClose}
      >
        <motion.div 
          className="modal-content"
          initial={{ scale: 0.8, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          exit={{ scale: 0.8, opacity: 0 }}
          onClick={(e) => e.stopPropagation()}
        >
          <div className="modal-header">
            <h3>{file.name}</h3>
            <div className="modal-actions">
              <button className="modal-btn download" onClick={handleDownload}>
                <FaDownload /> Download
              </button>
              <button className="modal-btn close" onClick={onClose}>
                <FaTimes />
              </button>
            </div>
          </div>

          <div className="modal-body">
            {file.type === 'pdf' ? (
              <iframe
                src={file.path}
                title={file.name}
                width="100%"
                height="100%"
                frameBorder="0"
              />
            ) : (
              <div className="preview-unavailable">
                <p>Preview not available for this file type.</p>
                <button onClick={handleDownload} className="download-alternative">
                  Download to View
                </button>
              </div>
            )}
          </div>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
};

export default FilePreviewModal;