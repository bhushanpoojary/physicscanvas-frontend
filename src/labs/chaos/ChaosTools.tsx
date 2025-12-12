import React from 'react';
import type { ChaosState } from './types';
import { CHAOS_PRESETS } from './types';

interface ChaosToolsProps {
  state: ChaosState;
  onTogglePause: () => void;
  onReset: () => void;
  onLoadPreset: (presetId: string) => void;
  onAddPendulum: () => void;
  onAddLorenzPoint: () => void;
}

export const ChaosTools: React.FC<ChaosToolsProps> = ({
  state,
  onTogglePause,
  onReset,
  onLoadPreset,
  onAddPendulum,
  onAddLorenzPoint,
}) => {
  return (
    <div className="pc-tools">
      <h2 className="pc-tools-title">🌀 Chaos Theory Lab</h2>

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
        <h3 className="pc-tools-section-title">📋 Presets</h3>
        <div className="pc-preset-list">
          {CHAOS_PRESETS.map((preset) => (
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

      {/* Add Objects */}
      <section className="pc-tools-section">
        <h3 className="pc-tools-section-title">➕ Add</h3>
        <div className="pc-tools-buttons">
          {state.systemType === 'double-pendulum' && (
            <button onClick={onAddPendulum} className="pc-btn pc-btn-secondary">
              Add Pendulum
            </button>
          )}
          {state.systemType === 'lorenz-attractor' && (
            <button onClick={onAddLorenzPoint} className="pc-btn pc-btn-secondary">
              Add Trajectory
            </button>
          )}
        </div>
      </section>

      {/* Info */}
      <section className="pc-tools-section">
        <h3 className="pc-tools-section-title">ℹ️ About Chaos</h3>
        <div className="pc-tools-info">
          {state.systemType === 'double-pendulum' ? (
            <>
              <p>
                <strong>Double Pendulum:</strong> A classic example of a chaotic system where
                tiny changes in initial conditions lead to dramatically different outcomes.
              </p>
              <p>
                <strong>Butterfly Effect:</strong> Compare two nearly identical pendulums to see
                how their paths diverge over time.
              </p>
            </>
          ) : (
            <>
              <p>
                <strong>Lorenz Attractor:</strong> A strange attractor from weather modeling that
                demonstrates deterministic chaos.
              </p>
              <p>
                <strong>Parameters:</strong> σ (sigma) controls convection, ρ (rho) controls
                temperature difference, β (beta) is geometric.
              </p>
            </>
          )}
        </div>
      </section>
    </div>
  );
};
