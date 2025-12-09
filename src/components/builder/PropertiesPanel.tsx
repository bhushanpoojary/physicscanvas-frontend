import React, { useState } from 'react';

const PropertiesPanel: React.FC = () => {
  // These are just for UI demonstration - not wired to any real state yet
  const [mass, setMass] = useState(5);
  const [friction, setFriction] = useState(0.3);
  const [velocity, setVelocity] = useState(0);

  return (
    <div className="pc-properties-content">
      <h2 className="pc-properties-title">Object Properties</h2>
      <p className="pc-properties-subtitle">Select an object on the canvas to edit its properties.</p>
      
      <div className="pc-properties-example">
        <h3 className="pc-property-object-name">Block #1 (example)</h3>
        
        <div className="pc-property-control">
          <label className="pc-property-label">
            Mass (kg): <span className="pc-property-value">{mass}</span>
          </label>
          <input
            type="range"
            min="0.1"
            max="20"
            step="0.1"
            value={mass}
            onChange={(e) => setMass(parseFloat(e.target.value))}
            className="pc-property-slider"
          />
        </div>

        <div className="pc-property-control">
          <label className="pc-property-label">
            Friction coefficient μ: <span className="pc-property-value">{friction.toFixed(2)}</span>
          </label>
          <input
            type="range"
            min="0"
            max="1"
            step="0.01"
            value={friction}
            onChange={(e) => setFriction(parseFloat(e.target.value))}
            className="pc-property-slider"
          />
        </div>

        <div className="pc-property-control">
          <label className="pc-property-label">
            Initial velocity (m/s): <span className="pc-property-value">{velocity}</span>
          </label>
          <input
            type="range"
            min="-10"
            max="10"
            step="0.5"
            value={velocity}
            onChange={(e) => setVelocity(parseFloat(e.target.value))}
            className="pc-property-slider"
          />
        </div>
      </div>
    </div>
  );
};

export default PropertiesPanel;
