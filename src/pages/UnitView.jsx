import React, { useState, useEffect } from 'react';
import { useParams, Navigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import FileCard from '../components/FileCard';
import Breadcrumb from '../components/Breadcrumb';
import { semesterData } from '../data/materialsData';
import { getFilesByUnit } from '../services/fileService';
import { FaFolder, FaFilePdf } from 'react-icons/fa';

const UnitView = () => {
  const { subjectId, unitId } = useParams();
  const [files, setFiles] = useState([]);
  const [loading, setLoading] = useState(true);

  const subject = semesterData.subjects.find(s => s.id === subjectId);
  const unit = subject?.units.find(u => u.id === unitId);

  useEffect(() => {
    loadFiles();
  }, [subjectId, unitId]);

  const loadFiles = async () => {
    setLoading(true);
    try {
      const fetchedFiles = await getFilesByUnit(subjectId, unitId);
      // Transform to match FileCard expected format
      const transformedFiles = fetchedFiles.map(file => ({
        name: file.name,
        type: file.fileType,
        size: formatFileSize(file.size),
        path: file.downloadURL, // Use Firebase download URL
        uploadDate: file.uploadDate,
        uploadedBy: file.uploadedBy
      }));
      setFiles(transformedFiles);
    } catch (error) {
      console.error('Error loading files:', error);
    } finally {
      setLoading(false);
    }
  };

  const formatFileSize = (bytes) => {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return Math.round(bytes / Math.pow(k, i) * 100) / 100 + ' ' + sizes[i];
  };

  if (!subject || !unit) {
    return <Navigate to="/" />;
  }

  return (
    <div className="unit-view">
      <div className="container">
        <Breadcrumb 
          items={[
            { label: subject.name, link: `/subject/${subjectId}` },
            { label: unit.name }
          ]} 
        />

        <motion.div 
          className="unit-header-section"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
        >
          <div className="unit-title-row">
            <div className="unit-icon-large" style={{ color: subject.color }}>
              <FaFolder size={40} />
            </div>
            <div>
              <h1>{unit.name}</h1>
              <p className="unit-subject-name">{subject.name} ({subject.code})</p>
            </div>
          </div>

          <div className="unit-stats">
            <div className="stat-badge">
              <FaFilePdf />
              <span>{files.length} Files Available</span>
            </div>
          </div>
        </motion.div>

        <section className="files-section">
          {loading ? (
            <div className="loading-state">
              <p>Loading files...</p>
            </div>
          ) : files.length > 0 ? (
            <div className="files-grid">
              {files.map((file, index) => (
                <FileCard 
                  key={index} 
                  file={file}
                />
              ))}
            </div>
          ) : (
            <div className="empty-state">
              <FaFolder size={64} color="#ccc" />
              <h3>No Files Yet</h3>
              <p>Files for this unit will be uploaded soon.</p>
            </div>
          )}
        </section>
      </div>
    </div>
  );
};

export default UnitView;