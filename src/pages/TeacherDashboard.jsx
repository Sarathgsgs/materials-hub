import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { FaUpload, FaHistory, FaTrash, FaFilePdf, FaTimes, FaCheckCircle } from 'react-icons/fa';
import { useAuth } from '../context/AuthContext';
import { semesterData } from '../data/materialsData';
import '../styles/TeacherDashboard.css';

const TeacherDashboard = () => {
  const { user } = useAuth();
  const [showUploadModal, setShowUploadModal] = useState(false);
  const [selectedSubject, setSelectedSubject] = useState('');
  const [selectedUnit, setSelectedUnit] = useState('');
  const [fileName, setFileName] = useState('');
  const [fileSize, setFileSize] = useState('');
  const [selectedFile, setSelectedFile] = useState(null);
  const [uploadHistory, setUploadHistory] = useState([]);
  const [showSuccessMessage, setShowSuccessMessage] = useState(false);
  const [activeTab, setActiveTab] = useState('upload'); // 'upload' or 'history'

  // Load upload history from localStorage
  useEffect(() => {
    const saved = localStorage.getItem('uploadHistory');
    if (saved) {
      setUploadHistory(JSON.parse(saved));
    }
  }, []);

  // Get units for selected subject
  const getUnits = () => {
    if (!selectedSubject) return [];
    const subject = semesterData.subjects.find(s => s.id === selectedSubject);
    return subject ? subject.units : [];
  };

  // Handle file selection
  const handleFileSelect = (e) => {
    const file = e.target.files[0];
    if (file) {
      setSelectedFile(file);
      setFileName(file.name);
      
      // Calculate file size
      const sizeInMB = (file.size / (1024 * 1024)).toFixed(2);
      setFileSize(`${sizeInMB} MB`);
    }
  };

  // Handle upload
  const handleUpload = (e) => {
    e.preventDefault();

    if (!selectedSubject || !selectedUnit || !selectedFile) {
      alert('Please fill all fields and select a file');
      return;
    }

    const subject = semesterData.subjects.find(s => s.id === selectedSubject);
    const unit = subject?.units.find(u => u.id === selectedUnit);

    // Create upload record
    const uploadRecord = {
      id: Date.now(),
      fileName: fileName,
      fileSize: fileSize,
      subject: subject.name,
      subjectId: selectedSubject,
      unit: unit.name,
      unitId: selectedUnit,
      uploadedBy: user.name,
      uploadDate: new Date().toISOString(),
      fileType: selectedFile.name.split('.').pop().toLowerCase()
    };

    // In a real app, you would upload to server here
    // For now, we'll simulate by adding to localStorage

    // Add to upload history
    const newHistory = [uploadRecord, ...uploadHistory];
    setUploadHistory(newHistory);
    localStorage.setItem('uploadHistory', JSON.stringify(newHistory));

    // Also add to materialsData (in localStorage)
    const savedMaterials = localStorage.getItem('materialsData');
    let materials = savedMaterials ? JSON.parse(savedMaterials) : { ...semesterData };
    
    const subjectIndex = materials.subjects.findIndex(s => s.id === selectedSubject);
    const unitIndex = materials.subjects[subjectIndex].units.findIndex(u => u.id === selectedUnit);
    
    const newFile = {
      name: fileName,
      type: uploadRecord.fileType === 'pdf' ? 'pdf' : uploadRecord.fileType === 'pptx' ? 'ppt' : 'doc',
      size: fileSize,
      path: `/materials/${selectedSubject}/${selectedUnit}/${fileName}`,
      uploadDate: uploadRecord.uploadDate,
      uploadedBy: user.name
    };

    materials.subjects[subjectIndex].units[unitIndex].files.push(newFile);
    localStorage.setItem('materialsData', JSON.stringify(materials));

    // Show success message
    setShowSuccessMessage(true);
    setTimeout(() => setShowSuccessMessage(false), 3000);

    // Reset form
    resetForm();
    setShowUploadModal(false);
  };

  // Reset form
  const resetForm = () => {
    setSelectedSubject('');
    setSelectedUnit('');
    setFileName('');
    setFileSize('');
    setSelectedFile(null);
  };

  // Delete from history
  const handleDelete = (id) => {
    if (window.confirm('Are you sure you want to delete this record?')) {
      const newHistory = uploadHistory.filter(item => item.id !== id);
      setUploadHistory(newHistory);
      localStorage.setItem('uploadHistory', JSON.stringify(newHistory));
    }
  };

  // Clear all history
  const handleClearHistory = () => {
    if (window.confirm('Are you sure you want to clear all upload history?')) {
      setUploadHistory([]);
      localStorage.removeItem('uploadHistory');
    }
  };

  return (
    <div className="teacher-dashboard">
      <div className="container">
        {/* Success Message */}
        <AnimatePresence>
          {showSuccessMessage && (
            <motion.div
              className="success-toast"
              initial={{ opacity: 0, y: -50 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -50 }}
            >
              <FaCheckCircle /> File uploaded successfully!
            </motion.div>
          )}
        </AnimatePresence>

        {/* Header */}
        <motion.div
          className="dashboard-header"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
        >
          <div>
            <h1>Teacher Dashboard</h1>
            <p>Welcome back, {user?.name}</p>
          </div>
          <button className="upload-btn" onClick={() => setShowUploadModal(true)}>
            <FaUpload /> Upload Material
          </button>
        </motion.div>

        {/* Tabs */}
        <div className="dashboard-tabs">
          <button
            className={`tab ${activeTab === 'upload' ? 'active' : ''}`}
            onClick={() => setActiveTab('upload')}
          >
            <FaUpload /> Quick Upload
          </button>
          <button
            className={`tab ${activeTab === 'history' ? 'active' : ''}`}
            onClick={() => setActiveTab('history')}
          >
            <FaHistory /> Upload History ({uploadHistory.length})
          </button>
        </div>

        {/* Quick Upload Section */}
        {activeTab === 'upload' && (
          <motion.div
            className="quick-upload-section"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
          >
            <div className="upload-card">
              <h3>Quick Upload</h3>
              <form onSubmit={handleUpload}>
                <div className="form-row">
                  <div className="form-group">
                    <label>Subject</label>
                    <select
                      value={selectedSubject}
                      onChange={(e) => {
                        setSelectedSubject(e.target.value);
                        setSelectedUnit('');
                      }}
                      required
                    >
                      <option value="">Select Subject</option>
                      {semesterData.subjects.map(subject => (
                        <option key={subject.id} value={subject.id}>
                          {subject.name} ({subject.code})
                        </option>
                      ))}
                    </select>
                  </div>

                  <div className="form-group">
                    <label>Unit</label>
                    <select
                      value={selectedUnit}
                      onChange={(e) => setSelectedUnit(e.target.value)}
                      disabled={!selectedSubject}
                      required
                    >
                      <option value="">Select Unit</option>
                      {getUnits().map(unit => (
                        <option key={unit.id} value={unit.id}>
                          {unit.name}
                        </option>
                      ))}
                    </select>
                  </div>
                </div>

                <div className="form-group">
                  <label>File Name (Optional - will use original if empty)</label>
                  <input
                    type="text"
                    placeholder="e.g., Chapter 1 Notes.pdf"
                    value={fileName}
                    onChange={(e) => setFileName(e.target.value)}
                  />
                </div>

                <div className="file-upload-area">
                  <input
                    type="file"
                    id="file-input"
                    accept=".pdf,.ppt,.pptx,.doc,.docx"
                    onChange={handleFileSelect}
                    required
                  />
                  <label htmlFor="file-input" className="file-upload-label">
                    {selectedFile ? (
                      <div className="file-selected">
                        <FaFilePdf size={30} />
                        <div>
                          <p>{selectedFile.name}</p>
                          <span>{fileSize}</span>
                        </div>
                      </div>
                    ) : (
                      <>
                        <FaUpload size={30} />
                        <p>Click to select file</p>
                        <span>PDF, PPT, DOC (Max 50MB)</span>
                      </>
                    )}
                  </label>
                </div>

                <button type="submit" className="submit-upload-btn">
                  <FaUpload /> Upload File
                </button>
              </form>
            </div>
          </motion.div>
        )}

        {/* Upload History */}
        {activeTab === 'history' && (
          <motion.div
            className="history-section"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
          >
            <div className="history-header">
              <h3>Upload History</h3>
              {uploadHistory.length > 0 && (
                <button className="clear-history-btn" onClick={handleClearHistory}>
                  <FaTrash /> Clear All
                </button>
              )}
            </div>

            {uploadHistory.length === 0 ? (
              <div className="empty-history">
                <FaHistory size={60} color="#ccc" />
                <p>No uploads yet</p>
                <span>Your upload history will appear here</span>
              </div>
            ) : (
              <div className="history-list">
                {uploadHistory.map((item) => (
                  <motion.div
                    key={item.id}
                    className="history-item"
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                  >
                    <div className="history-icon">
                      <FaFilePdf size={24} color="#e74c3c" />
                    </div>
                    <div className="history-details">
                      <h4>{item.fileName}</h4>
                      <div className="history-meta">
                        <span>{item.subject} - {item.unit}</span>
                        <span>•</span>
                        <span>{item.fileSize}</span>
                        <span>•</span>
                        <span>{new Date(item.uploadDate).toLocaleDateString()}</span>
                      </div>
                    </div>
                    <button
                      className="delete-btn"
                      onClick={() => handleDelete(item.id)}
                    >
                      <FaTrash />
                    </button>
                  </motion.div>
                ))}
              </div>
            )}
          </motion.div>
        )}
      </div>

      {/* Upload Modal */}
      <AnimatePresence>
        {showUploadModal && (
          <motion.div
            className="modal-overlay"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setShowUploadModal(false)}
          >
            <motion.div
              className="upload-modal"
              initial={{ scale: 0.8, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.8, opacity: 0 }}
              onClick={(e) => e.stopPropagation()}
            >
              <div className="modal-header">
                <h2><FaUpload /> Upload Material</h2>
                <button onClick={() => setShowUploadModal(false)}>
                  <FaTimes />
                </button>
              </div>

              <form onSubmit={handleUpload} className="modal-form">
                <div className="form-group">
                  <label>Subject *</label>
                  <select
                    value={selectedSubject}
                    onChange={(e) => {
                      setSelectedSubject(e.target.value);
                      setSelectedUnit('');
                    }}
                    required
                  >
                    <option value="">Select Subject</option>
                    {semesterData.subjects.map(subject => (
                      <option key={subject.id} value={subject.id}>
                        {subject.name} ({subject.code})
                      </option>
                    ))}
                  </select>
                </div>

                <div className="form-group">
                  <label>Unit *</label>
                  <select
                    value={selectedUnit}
                    onChange={(e) => setSelectedUnit(e.target.value)}
                    disabled={!selectedSubject}
                    required
                  >
                    <option value="">Select Unit</option>
                    {getUnits().map(unit => (
                      <option key={unit.id} value={unit.id}>
                        {unit.name}
                      </option>
                    ))}
                  </select>
                </div>

                <div className="form-group">
                  <label>Custom File Name (Optional)</label>
                  <input
                    type="text"
                    placeholder="Leave empty to use original filename"
                    value={fileName}
                    onChange={(e) => setFileName(e.target.value)}
                  />
                </div>

                <div className="file-upload-area">
                  <input
                    type="file"
                    id="modal-file-input"
                    accept=".pdf,.ppt,.pptx,.doc,.docx"
                    onChange={handleFileSelect}
                    required
                  />
                  <label htmlFor="modal-file-input" className="file-upload-label">
                    {selectedFile ? (
                      <div className="file-selected">
                        <FaFilePdf size={30} />
                        <div>
                          <p>{selectedFile.name}</p>
                          <span>{fileSize}</span>
                        </div>
                      </div>
                    ) : (
                      <>
                        <FaUpload size={30} />
                        <p>Click to select file</p>
                        <span>PDF, PPT, DOC (Max 50MB)</span>
                      </>
                    )}
                  </label>
                </div>

                <div className="modal-actions">
                  <button
                    type="button"
                    className="cancel-btn"
                    onClick={() => setShowUploadModal(false)}
                  >
                    Cancel
                  </button>
                  <button type="submit" className="submit-btn">
                    <FaUpload /> Upload
                  </button>
                </div>
              </form>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default TeacherDashboard;