import React from 'react';
import { Link } from 'react-router-dom';
import { FaHome, FaChevronRight } from 'react-icons/fa';

const Breadcrumb = ({ items }) => {
  return (
    <nav className="breadcrumb">
      <Link to="/" className="breadcrumb-item">
        <FaHome /> Home
      </Link>
      {items.map((item, index) => (
        <React.Fragment key={index}>
          <FaChevronRight className="breadcrumb-separator" />
          {item.link ? (
            <Link to={item.link} className="breadcrumb-item">
              {item.label}
            </Link>
          ) : (
            <span className="breadcrumb-item active">{item.label}</span>
          )}
        </React.Fragment>
      ))}
    </nav>
  );
};

export default Breadcrumb;