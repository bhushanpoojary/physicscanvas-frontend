import React from 'react';
import type { OrbitalState } from './types';
import { calculateOrbitalElements } from './physics/orbital';

interface OrbitalPropertiesProps {
  state: OrbitalState;
  onToggleDisplay: (
    key: keyof Pick<
      OrbitalState,
      | 'showTrails'
      | 'showVelocityVectors'
      | 'showForceVectors'
      | 'showGrid'
      | 'showOrbitalElements'
      | 'showLagrangePoints'
    >
  ) => void;
  onSetSpeed: (speed: number) => void;
  onSetTrailLength: (length: number) => void;
}

export const OrbitalProperties: React.FC<OrbitalPropertiesProps> = ({
  state,
  onToggleDisplay,
  onSetSpeed,
  onSetTrailLength,
}) => {
  return (
    <div className="pc-properties">
      <h2 className="pc-properties-title">⚙️ Properties</h2>

      {/* Display Options */}
      <section className="pc-properties-section">
        <h3 className="pc-properties-section-title">👁️ Display</h3>
        <div className="pc-checkbox-group">
          <label className="pc-checkbox-label">
            <input
              type="checkbox"
              checked={state.showTrails}
              onChange={() => onToggleDisplay('showTrails')}
            />
            <span>Show Trails</span>
          </label>
          <label className="pc-checkbox-label">
            <input
              type="checkbox"
              checked={state.showVelocityVectors}
              onChange={() => onToggleDisplay('showVelocityVectors')}
            />
            <span>Velocity Vectors</span>
          </label>
          <label className="pc-checkbox-label">
            <input
              type="checkbox"
              checked={state.showGrid}
              onChange={() => onToggleDisplay('showGrid')}
            />
            <span>Show Grid</span>
          </label>
          <label className="pc-checkbox-label">
            <input
              type="checkbox"
              checked={state.showOrbitalElements}
              onChange={() => onToggleDisplay('showOrbitalElements')}
            />
            <span>Orbital Elements</span>
          </label>
          {state.bodies.length >= 2 && (
            <label className="pc-checkbox-label">
              <input
                type="checkbox"
                checked={state.showLagrangePoints}
                onChange={() => onToggleDisplay('showLagrangePoints')}
              />
              <span>Lagrange Points</span>
            </label>
          )}
        </div>
      </section>

      {/* Simulation Parameters */}
      <section className="pc-properties-section">
        <h3 className="pc-properties-section-title">🎛️ Parameters</h3>

        <div className="pc-property-item">
          <label className="pc-property-label">Speed: {state.speed.toFixed(1)}x</label>
          <input
            type="range"
            min="0.1"
            max="5"
            step="0.1"
            value={state.speed}
            onChange={(e) => onSetSpeed(parseFloat(e.target.value))}
            className="pc-slider"
          />
        </div>

        <div className="pc-property-item">
          <label className="pc-property-label">Trail Length: {state.trailLength}</label>
          <input
            type="range"
            min="50"
            max="2000"
            step="50"
            value={state.trailLength}
            onChange={(e) => onSetTrailLength(parseInt(e.target.value))}
            className="pc-slider"
          />
        </div>
      </section>

      {/* System Info */}
      <section className="pc-properties-section">
        <h3 className="pc-properties-section-title">📊 System Info</h3>
        <div className="pc-info-grid">
          <div className="pc-info-item">
            <span className="pc-info-label">Time:</span>
            <span className="pc-info-value">{(state.time / 3600).toFixed(2)} hrs</span>
          </div>
          <div className="pc-info-item">
            <span className="pc-info-label">Days:</span>
            <span className="pc-info-value">{(state.time / 86400).toFixed(2)}</span>
          </div>
        </div>
      </section>

      {/* Orbital Elements */}
      {state.showOrbitalElements && state.bodies.length >= 2 && (
        <section className="pc-properties-section">
          <h3 className="pc-properties-section-title">🎯 Orbital Elements</h3>
          {(() => {
            const centralBody = state.bodies.find((b) => b.isFixed) || state.bodies[0];
            const orbitingBody = state.bodies.find((b) => !b.isFixed && b.id !== centralBody.id);

            if (!orbitingBody) return null;

            const elements = calculateOrbitalElements(
              orbitingBody,
              centralBody,
              state.gravitationalConstant
            );

            return (
              <div className="pc-info-grid">
                <div className="pc-info-item">
                  <span className="pc-info-label">Semi-major axis:</span>
                  <span className="pc-info-value">
                    {(elements.semiMajorAxis / 1000).toFixed(0)} km
                  </span>
                </div>
                <div className="pc-info-item">
                  <span className="pc-info-label">Eccentricity:</span>
                  <span className="pc-info-value">{elements.eccentricity.toFixed(3)}</span>
                </div>
                <div className="pc-info-item">
                  <span className="pc-info-label">Period:</span>
                  <span className="pc-info-value">
                    {(elements.period / 3600).toFixed(2)} hrs
                  </span>
                </div>
                <div className="pc-info-item">
                  <span className="pc-info-label">Apoapsis:</span>
                  <span className="pc-info-value">
                    {(elements.apoapsis / 1000).toFixed(0)} km
                  </span>
                </div>
                <div className="pc-info-item">
                  <span className="pc-info-label">Periapsis:</span>
                  <span className="pc-info-value">
                    {(elements.periapsis / 1000).toFixed(0)} km
                  </span>
                </div>
                <div className="pc-info-item">
                  <span className="pc-info-label">Velocity:</span>
                  <span className="pc-info-value">{elements.velocity.toFixed(0)} m/s</span>
                </div>
              </div>
            );
          })()}
        </section>
      )}

      {/* Spacecraft Info */}
      {state.spacecraft.length > 0 && (
        <section className="pc-properties-section">
          <h3 className="pc-properties-section-title">🚀 Spacecraft</h3>
          {state.spacecraft.map((sc) => (
            <div key={sc.id} className="pc-info-grid">
              <div className="pc-info-item">
                <span className="pc-info-label">{sc.name}:</span>
              </div>
              <div className="pc-info-item">
                <span className="pc-info-label">Fuel:</span>
                <span className="pc-info-value">{sc.fuel.toFixed(1)}%</span>
              </div>
              <div className="pc-info-item">
                <span className="pc-info-label">Velocity:</span>
                <span className="pc-info-value">
                  {Math.sqrt(sc.vx * sc.vx + sc.vy * sc.vy).toFixed(0)} m/s
                </span>
              </div>
            </div>
          ))}
        </section>
      )}
    </div>
  );
};
