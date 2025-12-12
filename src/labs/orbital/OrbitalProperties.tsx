import React from 'react';
import type { OrbitalState } from './types';
import { calculateOrbitalElements } from './physics/orbital';
import '../orbital/OrbitalLab.css';

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
    <div className="orbital-properties">
      <h2 className="orbital-properties-title">Configuration</h2>

      {/* Display Options */}
      <section className="orbital-section">
        <h3 className="orbital-section-header">
          <span className="orbital-section-icon">👁️</span>
          Display
        </h3>
        <div className="orbital-toggle-group">
          <label className="orbital-toggle">
            <span className="orbital-toggle-label">
              <span className="orbital-toggle-icon">📍</span>
              Show Trails
            </span>
            <div
              className={`orbital-switch ${state.showTrails ? 'active' : ''}`}
              onClick={() => onToggleDisplay('showTrails')}
            />
          </label>
          <label className="orbital-toggle">
            <span className="orbital-toggle-label">
              <span className="orbital-toggle-icon">➡️</span>
              Velocity Vectors
            </span>
            <div
              className={`orbital-switch ${state.showVelocityVectors ? 'active' : ''}`}
              onClick={() => onToggleDisplay('showVelocityVectors')}
            />
          </label>
          <label className="orbital-toggle">
            <span className="orbital-toggle-label">
              <span className="orbital-toggle-icon">📊</span>
              Show Grid
            </span>
            <div
              className={`orbital-switch ${state.showGrid ? 'active' : ''}`}
              onClick={() => onToggleDisplay('showGrid')}
            />
          </label>
          <label className="orbital-toggle">
            <span className="orbital-toggle-label">
              <span className="orbital-toggle-icon">🌐</span>
              Orbital Elements
            </span>
            <div
              className={`orbital-switch ${state.showOrbitalElements ? 'active' : ''}`}
              onClick={() => onToggleDisplay('showOrbitalElements')}
            />
          </label>
          {state.bodies.length >= 2 && (
            <label className="orbital-toggle">
              <span className="orbital-toggle-label">
                <span className="orbital-toggle-icon">🎯</span>
                Lagrange Points
              </span>
              <div
                className={`orbital-switch ${state.showLagrangePoints ? 'active' : ''}`}
                onClick={() => onToggleDisplay('showLagrangePoints')}
              />
            </label>
          )}
        </div>
      </section>

      {/* Simulation Parameters */}
      <section className="orbital-section">
        <h3 className="orbital-section-header">
          <span className="orbital-section-icon">⚡</span>
          Parameters
        </h3>

        <div className="orbital-slider-group">
          <div className="orbital-slider-header">
            <label className="orbital-slider-label">Simulation Speed</label>
            <span className="orbital-slider-value">{state.speed.toFixed(1)}x</span>
          </div>
          <input
            type="range"
            min="0.1"
            max="10"
            step="0.1"
            value={state.speed}
            onChange={(e) => onSetSpeed(parseFloat(e.target.value))}
            className="orbital-slider"
          />
        </div>

        <div className="orbital-slider-group">
          <div className="orbital-slider-header">
            <label className="orbital-slider-label">Trail Length</label>
            <span className="orbital-slider-value">{state.trailLength}</span>
          </div>
          <input
            type="range"
            min="100"
            max="5000"
            step="100"
            value={state.trailLength}
            onChange={(e) => onSetTrailLength(parseInt(e.target.value))}
            className="orbital-slider"
          />
        </div>
      </section>

      {/* System Info */}
      <section className="orbital-section">
        <h3 className="orbital-section-header">
          <span className="orbital-section-icon">📊</span>
          System Info
        </h3>
        <div className="orbital-info-display">
          <div className="orbital-info-row">
            <span className="orbital-info-key">Time Elapsed</span>
            <span className="orbital-info-val">{(state.time / 86400).toFixed(2)} days</span>
          </div>
          <div className="orbital-info-row">
            <span className="orbital-info-key">Status</span>
            <span className={`orbital-info-val ${state.isPaused ? '' : 'highlight'}`}>
              {state.isPaused ? '⏸️ Paused' : '▶️ Running'}
            </span>
          </div>
          <div className="orbital-info-row">
            <span className="orbital-info-key">Bodies</span>
            <span className="orbital-info-val">{state.bodies.length}</span>
          </div>
          {state.spacecraft.length > 0 && (
            <div className="orbital-info-row">
              <span className="orbital-info-key">Spacecraft</span>
              <span className="orbital-info-val">{state.spacecraft.length}</span>
            </div>
          )}
        </div>
      </section>

      {/* Orbital Elements */}
      {state.showOrbitalElements && state.bodies.length >= 2 && (
        <section className="orbital-section">
          <h3 className="orbital-section-header">
            <span className="orbital-section-icon">🌐</span>
            Orbital Elements
          </h3>
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
              <div className="orbital-elements">
                <div className="orbital-element-row">
                  <span className="orbital-element-name">Semi-major axis</span>
                  <span className="orbital-element-value">
                    {(elements.semiMajorAxis / 1000).toFixed(0)} km
                  </span>
                </div>
                <div className="orbital-element-row">
                  <span className="orbital-element-name">Eccentricity</span>
                  <span className="orbital-element-value">{elements.eccentricity.toFixed(3)}</span>
                </div>
                <div className="orbital-element-row">
                  <span className="orbital-element-name">Period</span>
                  <span className="orbital-element-value">
                    {(elements.period / 3600).toFixed(2)} hrs
                  </span>
                </div>
                <div className="orbital-element-row">
                  <span className="orbital-element-name">Apoapsis</span>
                  <span className="orbital-element-value">
                    {(elements.apoapsis / 1000).toFixed(0)} km
                  </span>
                </div>
                <div className="orbital-element-row">
                  <span className="orbital-element-name">Periapsis</span>
                  <span className="orbital-element-value">
                    {(elements.periapsis / 1000).toFixed(0)} km
                  </span>
                </div>
                <div className="orbital-element-row">
                  <span className="orbital-element-name">Velocity</span>
                  <span className="orbital-element-value">{(elements.velocity / 1000).toFixed(1)} km/s</span>
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
