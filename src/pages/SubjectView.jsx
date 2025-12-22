import React from 'react';
import { useParams, Navigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import UnitCard from '../components/UnitCard';
import Breadcrumb from '../components/Breadcrumb';
import { semesterData } from '../data/materialsData';
import { FaUserTie, FaStar, FaBook } from 'react-icons/fa';

const SubjectView = () => {
  const { subjectId } = useParams();
  const subject = semesterData.subjects.find(s => s.id === subjectId);

  if (!subject) {
    return <Navigate to="/" />;
  }

  const regularUnits = subject.units.filter(unit => !unit.isMiniQB);
  const miniQB = subject.units.find(unit => unit.isMiniQB);

  return (
    <div className="subject-view">
      <div className="container">
        <Breadcrumb items={[{ label: subject.name }]} />

        <motion.div 
          className="subject-header-section"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          style={{ borderLeftColor: subject.color }}
        >
          <div className="subject-title-row">
            <span className="subject-large-icon">{subject.icon}</span>
            <div>
              <h1>{subject.name}</h1>
              <p className="subject-code-large">{subject.code}</p>
            </div>
          </div>

          <div className="subject-details">
            <div className="detail-item">
              <FaUserTie />
              <span>Professor: {subject.professor}</span>
            </div>
            <div className="detail-item">
              <FaStar />
              <span>Credits: {subject.credits}</span>
            </div>
            <div className="detail-item">
              <FaBook />
              <span>Total Units: {subject.units.length}</span>
            </div>
          </div>
        </motion.div>

        <section className="units-section">
          <h2>Course Units</h2>
          <div className="units-list">
            {regularUnits.map((unit, index) => (
              <UnitCard 
                key={unit.id} 
                unit={unit} 
                subjectId={subjectId}
                color={subject.color}
              />
            ))}
          </div>
        </section>

        {miniQB && (
          <section className="mini-qb-section">
            <h2>📌 Exam Preparation</h2>
            <div className="units-list">
              <UnitCard 
                unit={miniQB} 
                subjectId={subjectId}
                color={subject.color}
              />
            </div>
          </section>
        )}
      </div>
    </div>
  );
};

export default SubjectView;