import React from 'react';
import { useNavigate } from 'react-router-dom';

const Header: React.FC = () => {
  const navigate = useNavigate();

  return (
    <header className="pc-header">
      <div className="pc-header-left">
        <h1 className="pc-header-title">PhysicsCanvas</h1>
      </div>
      <div className="pc-header-middle">
        <span className="pc-header-subtitle">Simulation Builder (MVP)</span>
      </div>
      <div className="pc-header-right">
        <button className="pc-btn pc-btn-secondary" onClick={() => navigate('/')}>
          Home
        </button>
        <button className="pc-btn pc-btn-secondary" disabled>
          Share
        </button>
      </div>
    </header>
  );
};

export default Header;
