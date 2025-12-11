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

  // Create lighter version of color for gradient
  const getLighterColor = (color: string) => {
    // Simple lightening by adding transparency
    return `${color}88`;
  };

  return (
    <button
      className={`pc-lab-card ${!lab.isAvailable ? 'pc-lab-card-disabled' : ''}`}
      onClick={handleClick}
      disabled={!lab.isAvailable}
      style={{ 
        '--card-color': lab.isAvailable ? lab.color : '#ccc',
        '--card-color-light': lab.isAvailable ? getLighterColor(lab.color) : '#ddd'
      } as React.CSSProperties}
    >
      <div 
        className="pc-lab-card-icon" 
        style={{ 
          color: lab.isAvailable ? lab.color : '#999',
          background: lab.isAvailable 
            ? `linear-gradient(135deg, ${lab.color}15 0%, ${lab.color}08 100%)`
            : '#f0f0f0'
        }}
      >
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
