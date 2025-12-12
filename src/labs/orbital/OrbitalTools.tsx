import React from 'react';
import type { OrbitalState } from './types';
import { ORBITAL_PRESETS } from './types';

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
    <div className="pc-tools">
      <h2 className="pc-tools-title">🛰️ Orbital Mechanics</h2>

      {/* Simulation Controls */}
      <section className="pc-tools-section">
        <h3 className="pc-tools-section-title">⏯️ Controls</h3>
        <div className="pc-tools-buttons">
          <button onClick={onTogglePause} className="pc-btn pc-btn-primary">
            {state.isPaused ? '▶️ Play' : '⏸️ Pause'}
          </button>
          <button onClick={onReset} className="pc-btn pc-btn-secondary">
            🔄 Reset
          </button>
        </div>
      </section>

      {/* Presets */}
      <section className="pc-tools-section">
        <h3 className="pc-tools-section-title">📋 Scenarios</h3>
        <div className="pc-preset-list">
          {ORBITAL_PRESETS.map((preset) => (
            <button
              key={preset.id}
              onClick={() => onLoadPreset(preset.id)}
              className="pc-preset-item"
              title={preset.description}
            >
              <div className="pc-preset-name">{preset.name}</div>
              <div className="pc-preset-desc">{preset.description}</div>
            </button>
          ))}
        </div>
      </section>

      {/* Kepler's Laws Info */}
      <section className="pc-tools-section">
        <h3 className="pc-tools-section-title">📖 Kepler's Laws</h3>
        <div className="pc-tools-info">
          <p>
            <strong>1st Law:</strong> Planets orbit in ellipses with the Sun at one focus.
          </p>
          <p>
            <strong>2nd Law:</strong> A line from planet to Sun sweeps equal areas in equal times.
          </p>
          <p>
            <strong>3rd Law:</strong> The square of orbital period is proportional to the cube of
            semi-major axis.
          </p>
        </div>
      </section>

      {/* Lagrange Points Info */}
      {state.showLagrangePoints && (
        <section className="pc-tools-section">
          <h3 className="pc-tools-section-title">🎯 Lagrange Points</h3>
          <div className="pc-tools-info">
            <p>
              <strong>L1, L2, L3:</strong> Collinear points (unstable)
            </p>
            <p>
              <strong>L4, L5:</strong> Triangular points (stable) - form equilateral triangles
              with the two bodies
            </p>
            <p>
              <em>Used for spacecraft parking and space telescopes!</em>
            </p>
          </div>
        </section>
      )}

      {/* System Info */}
      <section className="pc-tools-section">
        <h3 className="pc-tools-section-title">ℹ️ System</h3>
        <div className="pc-tools-info">
          <p>
            <strong>Bodies:</strong> {state.bodies.length}
          </p>
          {state.spacecraft.length > 0 && (
            <p>
              <strong>Spacecraft:</strong> {state.spacecraft.length}
            </p>
          )}
          <p>
            <strong>Type:</strong> {state.systemType.replace('-', ' ')}
          </p>
        </div>
      </section>
    </div>
  );
};
