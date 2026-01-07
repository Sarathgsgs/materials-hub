import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import toast, { Toaster } from 'react-hot-toast';
import { FaUpload, FaHistory, FaTrash, FaFilePdf, FaTimes, FaCheckCircle } from 'react-icons/fa';
import { useAuth } from '../context/AuthContext';
import { semesterData } from '../data/materialsData';
import { uploadFile, getUploadHistory, deleteFile } from '../services/fileService';
import '../styles/TeacherDashboard.css';

const TeacherDashboard = () => {
  const { user } = useAuth();
  const [showUploadModal, setShowUploadModal] = useState(false);
  const [selectedSubject, setSelectedSubject] = useState('');
  const [selectedUnit, setSelectedUnit] = useState('');
  const [selectedFile, setSelectedFile] = useState(null);
  const [uploadHistory, setUploadHistory] = useState([]);
  const [activeTab, setActiveTab] = useState('upload');
  const [uploading, setUploading] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);
  const [loading, setLoading] = useState(false);

  // Load upload history
  useEffect(() => {
    loadUploadHistory();
  }, [user]);

  const loadUploadHistory = async () => {
    if (!user?.email) return;
    
    setLoading(true);
    try {
      const history = await getUploadHistory(user.email);
      setUploadHistory(history);
    } catch (error) {
      console.error('Error loading history:', error);
      toast.error('Failed to load upload history');
    } finally {
      setLoading(false);
    }
  };

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
      // Check file size (max 50MB)
      if (file.size > 50 * 1024 * 1024) {
        toast.error('File size must be less than 50MB');
        return;
      }
      setSelectedFile(file);
    }
  };

  // Handle upload
  const handleUpload = async (e) => {
    e.preventDefault();

    if (!selectedSubject || !selectedUnit || !selectedFile) {
      toast.error('Please fill all fields and select a file');
      return;
    }

    const subject = semesterData.subjects.find(s => s.id === selectedSubject);
    const unit = subject?.units.find(u => u.id === selectedUnit);

    setUploading(true);
    setUploadProgress(0);

    try {
      const metadata = {
        subjectId: selectedSubject,
        subjectName: subject.name,
        unitId: selectedUnit,
        unitName: unit.name,
        uploadedBy: user.name,
        uploadedByEmail: user.email
      };

      await uploadFile(selectedFile, metadata, (progress) => {
        setUploadProgress(Math.round(progress));
      });

      toast.success('File uploaded successfully! 🎉');
      
      // Reload history
      await loadUploadHistory();
      
      // Reset form
      resetForm();
      setShowUploadModal(false);
    } catch (error) {
      console.error('Upload error:', error);
      toast.error('Failed to upload file: ' + error.message);
    } finally {
      setUploading(false);
      setUploadProgress(0);
    }
  };

  // Reset form
  const resetForm = () => {
    setSelectedSubject('');
    setSelectedUnit('');
    setSelectedFile(null);
  };

  // Delete from history
  const handleDelete = async (fileId, storagePath, fileName) => {
    if (!window.confirm(`Are you sure you want to delete "${fileName}"?`)) {
      return;
    }

    try {
      await deleteFile(fileId, storagePath);
      toast.success('File deleted successfully');
      await loadUploadHistory();
    } catch (error) {
      console.error('Delete error:', error);
      toast.error('Failed to delete file');
    }
  };

  // Format file size
  const formatFileSize = (bytes) => {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return Math.round(bytes / Math.pow(k, i) * 100) / 100 + ' ' + sizes[i];
  };

  return (
    <div className="teacher-dashboard">
      <Toaster position="top-right" />
      
      <div className="container">
        {/* Header */}
        <motion.div
          className="dashboard-header"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
        >
          <div>
            <h1>Teacher Dashboard</h1>
            <p>Welcome back, {user?.name || user?.email}</p>
          </div>
          <button 
            className="upload-btn" 
            onClick={() => setShowUploadModal(true)}
            disabled={uploading}
          >
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
                    <label>Subject *</label>
                    <select
                      value={selectedSubject}
                      onChange={(e) => {
                        setSelectedSubject(e.target.value);
                        setSelectedUnit('');
                      }}
                      required
                      disabled={uploading}
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
                      disabled={!selectedSubject || uploading}
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

                <div className="file-upload-area">
                  <input
                    type="file"
                    id="file-input"
                    accept=".pdf,.ppt,.pptx,.doc,.docx"
                    onChange={handleFileSelect}
                    required
                    disabled={uploading}
                  />
                  <label htmlFor="file-input" className="file-upload-label">
                    {selectedFile ? (
                      <div className="file-selected">
                        <FaFilePdf size={30} />
                        <div>
                          <p>{selectedFile.name}</p>
                          <span>{formatFileSize(selectedFile.size)}</span>
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

                {uploading && (
                  <div className="upload-progress">
                    <div className="progress-bar">
                      <div 
                        className="progress-fill" 
                        style={{ width: `${uploadProgress}%` }}
                      />
                    </div>
                    <span>{uploadProgress}% Uploading...</span>
                  </div>
                )}

                <button 
                  type="submit" 
                  className="submit-upload-btn"
                  disabled={uploading}
                >
                  <FaUpload /> {uploading ? 'Uploading...' : 'Upload File'}
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
            </div>

            {loading ? (
              <div className="loading-state">
                <p>Loading history...</p>
              </div>
            ) : uploadHistory.length === 0 ? (
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
                      <h4>{item.name}</h4>
                      <div className="history-meta">
                        <span>{item.subjectName} - {item.unitName}</span>
                        <span>•</span>
                        <span>{formatFileSize(item.size)}</span>
                        <span>•</span>
                        <span>{new Date(item.uploadDate).toLocaleDateString()}</span>
                      </div>
                    </div>
                    <button
                      className="delete-btn"
                      onClick={() => handleDelete(item.id, item.storagePath, item.name)}
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

      {/* Upload Modal (same structure as before) */}
      <AnimatePresence>
        {showUploadModal && (
          <motion.div
            className="modal-overlay"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => !uploading && setShowUploadModal(false)}
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
                <button onClick={() => !uploading && setShowUploadModal(false)} disabled={uploading}>
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
                    disabled={uploading}
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
                    disabled={!selectedSubject || uploading}
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

                <div className="file-upload-area">
                  <input
                    type="file"
                    id="modal-file-input"
                    accept=".pdf,.ppt,.pptx,.doc,.docx"
                    onChange={handleFileSelect}
                    required
                    disabled={uploading}
                  />
                  <label htmlFor="modal-file-input" className="file-upload-label">
                    {selectedFile ? (
                      <div className="file-selected">
                        <FaFilePdf size={30} />
                        <div>
                          <p>{selectedFile.name}</p>
                          <span>{formatFileSize(selectedFile.size)}</span>
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

                {uploading && (
                  <div className="upload-progress">
                    <div className="progress-bar">
                      <div 
                        className="progress-fill" 
                        style={{ width: `${uploadProgress}%` }}
                      />
                    </div>
                    <span>{uploadProgress}% Uploading...</span>
                  </div>
                )}

                <div className="modal-actions">
                  <button
                    type="button"
                    className="cancel-btn"
                    onClick={() => setShowUploadModal(false)}
                    disabled={uploading}
                  >
                    Cancel
                  </button>
                  <button type="submit" className="submit-btn" disabled={uploading}>
                    <FaUpload /> {uploading ? 'Uploading...' : 'Upload'}
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