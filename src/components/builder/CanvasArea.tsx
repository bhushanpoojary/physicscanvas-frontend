import React from 'react';

const CanvasArea: React.FC = () => {
  return (
    <div className="pc-canvas-content">
      <h2 className="pc-canvas-title">Canvas</h2>
      <div className="pc-canvas-workspace">
        <p className="pc-canvas-placeholder">Drop objects here (MVP placeholder)</p>
      </div>
      <div className="pc-canvas-controls">
        <button className="pc-btn pc-btn-primary" disabled>
          Play
        </button>
        <button className="pc-btn pc-btn-secondary" disabled>
          Reset
        </button>
      </div>
    </div>
  );
};

export default CanvasArea;
