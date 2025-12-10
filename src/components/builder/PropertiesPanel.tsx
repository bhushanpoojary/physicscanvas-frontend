import React, { useState } from 'react';
import type { ObjectProperties } from '../../physics/SimulationTypes';

interface PropertiesPanelProps {
  selectedProps: ObjectProperties | null;
  onChange: (changes: Partial<ObjectProperties>) => void;
  onApplyForce: (forceMagnitude: number) => void;
}

const PropertiesPanel: React.FC<PropertiesPanelProps> = ({
  selectedProps,
  onChange,
  onApplyForce,
}) => {
  const [forceInput, setForceInput] = useState(10);

  if (!selectedProps) {
    return (
      <div className="pc-properties-content">
        <h2 className="pc-properties-title">Object Properties</h2>
        <p className="pc-properties-subtitle">
          Select or create an object to edit its properties.
        </p>
      </div>
    );
  }

  return (
    <div className="pc-properties-content">
      <h2 className="pc-properties-title">Object Properties</h2>
      
      <div className="pc-properties-example">
        <h3 className="pc-property-object-name">{selectedProps.label}</h3>
        
        <div className="pc-property-control">
          <label className="pc-property-label">
            Mass (kg): <span className="pc-property-value">{selectedProps.mass.toFixed(2)}</span>
          </label>
          <input
            type="range"
            min="0.5"
            max="20"
            step="0.5"
            value={selectedProps.mass}
            onChange={(e) => onChange({ mass: parseFloat(e.target.value) })}
            className="pc-property-slider"
          />
        </div>

        <div className="pc-property-control">
          <label className="pc-property-label">
            Velocity (m/s): <span className="pc-property-value">{selectedProps.velocity.toFixed(1)}</span>
          </label>
          <input
            type="range"
            min="-20"
            max="20"
            step="1"
            value={selectedProps.velocity}
            onChange={(e) => onChange({ velocity: parseFloat(e.target.value) })}
            className="pc-property-slider"
          />
        </div>

        <div className="pc-property-control">
          <label className="pc-property-label">
            Friction: <span className="pc-property-value">{selectedProps.friction.toFixed(2)}</span>
          </label>
          <input
            type="range"
            min="0"
            max="1"
            step="0.05"
            value={selectedProps.friction}
            onChange={(e) => onChange({ friction: parseFloat(e.target.value) })}
            className="pc-property-slider"
          />
        </div>

        <div className="pc-property-control">
          <label className="pc-property-label">
            Restitution: <span className="pc-property-value">{selectedProps.restitution.toFixed(2)}</span>
          </label>
          <input
            type="range"
            min="0"
            max="1"
            step="0.05"
            value={selectedProps.restitution}
            onChange={(e) => onChange({ restitution: parseFloat(e.target.value) })}
            className="pc-property-slider"
          />
        </div>

        <div className="pc-property-control">
          <label className="pc-property-label">
            Angle (deg): <span className="pc-property-value">{selectedProps.angle.toFixed(1)}°</span>
          </label>
          <input
            type="range"
            min="-90"
            max="90"
            step="5"
            value={selectedProps.angle}
            onChange={(e) => onChange({ angle: parseFloat(e.target.value) })}
            className="pc-property-slider"
          />
        </div>

        <div className="pc-property-control" style={{ marginTop: '1.5rem' }}>
          <label className="pc-property-label">
            Force (N): <span className="pc-property-value">{forceInput}</span>
          </label>
          <input
            type="range"
            min="-100"
            max="100"
            step="5"
            value={forceInput}
            onChange={(e) => setForceInput(parseFloat(e.target.value))}
            className="pc-property-slider"
          />
          <button
            className="pc-btn pc-btn-primary"
            onClick={() => onApplyForce(forceInput)}
            style={{ width: '100%', marginTop: '0.5rem' }}
          >
            Apply Force →
          </button>
        </div>
      </div>
    </div>
  );
};

export default PropertiesPanel;
