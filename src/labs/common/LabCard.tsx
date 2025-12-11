import React from 'react';
import { useNavigate } from 'react-router-dom';
import type { LabDefinition } from './types';

interface LabCardProps {
  lab: LabDefinition;
}

const LabCard: React.FC<LabCardProps> = ({ lab }) => {
  const navigate = useNavigate();

  const handleClick = () => {
    if (lab.isAvailable) {
      navigate(lab.route);
    }
  };

  return (
    <button
      className={`pc-lab-card ${!lab.isAvailable ? 'pc-lab-card-disabled' : ''}`}
      onClick={handleClick}
      disabled={!lab.isAvailable}
      style={{ borderColor: lab.isAvailable ? lab.color : '#ccc' }}
    >
      <div className="pc-lab-card-icon" style={{ color: lab.isAvailable ? lab.color : '#999' }}>
        {lab.icon}
      </div>
      <h3 className="pc-lab-card-title">{lab.name}</h3>
      <p className="pc-lab-card-description">{lab.description}</p>
      {!lab.isAvailable && (
        <span className="pc-lab-card-badge">Coming Soon</span>
      )}
    </button>
  );
};

export default LabCard;
