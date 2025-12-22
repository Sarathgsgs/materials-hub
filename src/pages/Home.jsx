import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import SubjectCard from '../components/SubjectCard';
import SearchBar from '../components/SearchBar';
import { semesterData } from '../data/materialsData';
import { FaBook, FaFolder, FaFilePdf } from 'react-icons/fa';

const Home = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const [materials, setMaterials] = useState(semesterData);

  // Load materials from localStorage on mount
  useEffect(() => {
    const savedMaterials = localStorage.getItem('materialsData');
    if (savedMaterials) {
      setMaterials(JSON.parse(savedMaterials));
    }
  }, []);

  const filteredSubjects = materials.subjects.filter(subject =>
    subject.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    subject.code.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const totalFiles = materials.subjects.reduce((acc, subject) => 
    acc + subject.units.reduce((sum, unit) => sum + unit.files.length, 0), 0
  );

  return (
    <div className="home-page">
      {/* Rest of your code stays the same */}
      <div className="hero-section">
        <motion.div 
          className="hero-content"
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
        >
          <h1 className="hero-title">{materials.semesterName}</h1>
          <p className="hero-subtitle">Academic Year {materials.academicYear}</p>
          
          <div className="stats-grid">
            <div className="stat-card">
              <FaBook className="stat-icon" />
              <h3>{materials.subjects.length}</h3>
              <p>Subjects</p>
            </div>
            <div className="stat-card">
              <FaFolder className="stat-icon" />
              <h3>{materials.subjects.length * 6}</h3>
              <p>Units</p>
            </div>
            <div className="stat-card">
              <FaFilePdf className="stat-icon" />
              <h3>{totalFiles}</h3>
              <p>Files</p>
            </div>
          </div>
        </motion.div>
      </div>

      <div className="container">
        <div className="search-section">
          <SearchBar 
            value={searchQuery} 
            onChange={setSearchQuery}
            placeholder="Search subjects by name or code..."
          />
        </div>

        <div className="subjects-grid">
          {filteredSubjects.length > 0 ? (
            filteredSubjects.map((subject, index) => (
              <SubjectCard key={subject.id} subject={subject} index={index} />
            ))
          ) : (
            <div className="no-results">
              <p>No subjects found matching "{searchQuery}"</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Home;