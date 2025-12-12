import React from 'react';
import { useNavigate } from 'react-router-dom';

interface HeaderProps {
  labName?: string;
}

const Header: React.FC<HeaderProps> = ({ labName = 'Mechanics Lab' }) => {
  const navigate = useNavigate();

  return (
    <header className="pc-header">
      <div className="pc-header-left">
        <button 
          className="pc-header-home-btn"
          onClick={() => navigate('/')}
          title="Back to Home"
        >
          <h1 className="pc-header-title">PhysicsCanvas</h1>
        </button>
      </div>
      <div className="pc-header-middle">
        <span className="pc-header-subtitle">{labName}</span>
      </div>
      <div className="pc-header-right">
        <button className="pc-btn pc-btn-secondary" onClick={() => navigate('/')}>
          ← Home
        </button>
        <button className="pc-btn pc-btn-secondary" disabled title="Share coming soon">
          Share
        </button>
      </div>
    </header>
  );
};

export default Header;
