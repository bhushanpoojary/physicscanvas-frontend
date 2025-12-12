import React from 'react';
import type { OrbitalState } from './types';
import { ORBITAL_PRESETS } from './types';
import '../orbital/OrbitalLab.css';

interface OrbitalToolsProps {
  state: OrbitalState;
  onTogglePause: () => void;
  onReset: () => void;
  onLoadPreset: (presetId: string) => void;
}

export const OrbitalTools: React.FC<OrbitalToolsProps> = ({
  state,
  onTogglePause,
  onReset,
  onLoadPreset,
}) => {
  return (
    <div className="orbital-tools">
      <h2 className="orbital-tools-title">Orbital Mechanics</h2>

      {/* Simulation Controls */}
      <section className="orbital-section">
        <h3 className="orbital-section-header">
          <span className="orbital-section-icon">⏯️</span>
          Controls
        </h3>
        <div className="orbital-controls-row">
          <button onClick={onTogglePause} className={`orbital-btn ${state.isPaused ? 'orbital-btn-play' : 'orbital-btn-pause'}`}>
            {state.isPaused ? '▶️ Play' : '⏸️ Pause'}
          </button>
          <button onClick={onReset} className="orbital-btn orbital-btn-reset">
            🔄 Reset
          </button>
        </div>
      </section>

      {/* Presets */}
      <section className="orbital-section">
        <h3 className="orbital-section-header">
          <span className="orbital-section-icon">📋</span>
          Scenarios
        </h3>
        <div className="orbital-scenarios">
          {ORBITAL_PRESETS.map((preset) => (
            <button
              key={preset.id}
              onClick={() => onLoadPreset(preset.id)}
              className={`orbital-scenario-card ${state.systemType === preset.systemType ? 'active' : ''}`}
              title={preset.description}
            >
              <div className="orbital-scenario-icon">🌍</div>
              <div className="orbital-scenario-content">
                <div className="orbital-scenario-name">{preset.name}</div>
                <div className="orbital-scenario-desc">{preset.description}</div>
              </div>
            </button>
          ))}
        </div>
      </section>

      {/* Kepler's Laws Info */}
      <section className="orbital-section">
        <h3 className="orbital-section-header">
          <span className="orbital-section-icon">📖</span>
          Kepler's Laws
        </h3>
        <div className="orbital-info-card">
          <div className="orbital-info-item">
            <span className="orbital-info-label">1st:</span>
            <span>Planets orbit in ellipses with the Sun at one focus.</span>
          </div>
          <div className="orbital-info-item">
            <span className="orbital-info-label">2nd:</span>
            <span>A line from planet to Sun sweeps equal areas in equal times.</span>
          </div>
          <div className="orbital-info-item">
            <span className="orbital-info-label">3rd:</span>
            <span>The square of orbital period is proportional to the cube of semi-major axis.</span>
          </div>
        </div>
      </section>

      {/* Lagrange Points Info */}
      {state.showLagrangePoints && (
        <section className="orbital-section">
          <h3 className="orbital-section-header">
            <span className="orbital-section-icon">🎯</span>
            Lagrange Points
          </h3>
          <div className="orbital-info-card">
            <div className="orbital-info-item">
              <span className="orbital-info-label">L1-L3:</span>
              <span>Collinear points (unstable)</span>
            </div>
            <div className="orbital-info-item">
              <span className="orbital-info-label">L4-L5:</span>
              <span>Triangular points (stable)</span>
            </div>
            <div className="orbital-info-item">
              <em>Used for spacecraft parking and telescopes!</em>
            </div>
          </div>
        </section>
      )}

      {/* System Info */}
      <section className="orbital-section">
        <h3 className="orbital-section-header">
          <span className="orbital-section-icon">ℹ️</span>
          System
        </h3>
        <div className="orbital-stats">
          <div className="orbital-stat">
            <div className="orbital-stat-value">{state.bodies.length}</div>
            <div className="orbital-stat-label">Bodies</div>
          </div>
          <div className="orbital-stat">
            <div className="orbital-stat-value">{state.spacecraft.length}</div>
            <div className="orbital-stat-label">Craft</div>
          </div>
          <div className="orbital-stat" style={{ gridColumn: '1 / -1' }}>
            <div className="orbital-stat-value" style={{ fontSize: '0.95rem' }}>{state.systemType.replace('-', ' ')}</div>
            <div className="orbital-stat-label">Type</div>
          </div>
        </div>
      </section>
    </div>
  );
};
