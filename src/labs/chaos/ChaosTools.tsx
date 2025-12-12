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
      <h2 
        className="pc-tools-title" 
        style={{
          fontSize: '1.35rem',
          color: '#fff',
          fontWeight: 700,
          background: 'linear-gradient(135deg, #ffffff 0%, #d4d9e8 100%)',
          WebkitBackgroundClip: 'text',
          WebkitTextFillColor: 'transparent',
          marginBottom: '1.5rem',
          letterSpacing: '-0.5px'
        }}
      >
        🌀 Chaos Theory Lab
      </h2>

      {/* Simulation Controls */}
      <section 
        className="pc-tools-section"
        style={{
          marginBottom: '1.5rem',
          paddingBottom: '1.5rem',
          borderBottom: '1px solid rgba(255, 255, 255, 0.08)'
        }}
      >
        <h3 
          className="pc-tools-section-title"
          style={{
            fontSize: '1rem',
            fontWeight: 700,
            background: 'linear-gradient(135deg, #ffffff 0%, #d4d9e8 100%)',
            WebkitBackgroundClip: 'text',
            WebkitTextFillColor: 'transparent',
            marginBottom: '0.875rem'
          }}
        >
          ⏯️ Controls
        </h3>
        <div className="pc-tools-buttons" style={{ display: 'flex', gap: '0.5rem' }}>
          <button 
            onClick={onTogglePause} 
            className="pc-btn pc-btn-primary"
            style={{
              flex: 1,
              padding: '0.625rem 1rem',
              borderRadius: '8px',
              background: state.isPaused 
                ? 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)'
                : 'linear-gradient(135deg, #10b981 0%, #059669 100%)',
              color: '#fff',
              border: '1px solid rgba(255, 255, 255, 0.12)',
              fontWeight: 500,
              cursor: 'pointer',
              transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
              fontSize: '0.9rem'
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.transform = 'translateY(-2px)';
              e.currentTarget.style.boxShadow = '0 6px 16px rgba(102, 126, 234, 0.15)';
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.transform = 'translateY(0)';
              e.currentTarget.style.boxShadow = 'none';
            }}
          >
            {state.isPaused ? '▶️ Play' : '⏸️ Pause'}
          </button>
          <button 
            onClick={onReset} 
            className="pc-btn pc-btn-secondary"
            style={{
              flex: 1,
              padding: '0.625rem 1rem',
              borderRadius: '8px',
              background: 'linear-gradient(135deg, rgba(255, 255, 255, 0.05) 0%, rgba(255, 255, 255, 0.02) 100%)',
              color: '#d4d9e8',
              border: '1px solid rgba(255, 255, 255, 0.12)',
              fontWeight: 500,
              cursor: 'pointer',
              transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
              fontSize: '0.9rem',
              backdropFilter: 'blur(10px)'
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.transform = 'translateY(-2px)';
              e.currentTarget.style.background = 'linear-gradient(135deg, rgba(102, 126, 234, 0.1) 0%, rgba(118, 75, 162, 0.05) 100%)';
              e.currentTarget.style.borderColor = 'rgba(102, 126, 234, 0.3)';
              e.currentTarget.style.boxShadow = '0 6px 16px rgba(102, 126, 234, 0.1)';
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.transform = 'translateY(0)';
              e.currentTarget.style.background = 'linear-gradient(135deg, rgba(255, 255, 255, 0.05) 0%, rgba(255, 255, 255, 0.02) 100%)';
              e.currentTarget.style.borderColor = 'rgba(255, 255, 255, 0.12)';
              e.currentTarget.style.boxShadow = 'none';
            }}
          >
            🔄 Reset
          </button>
        </div>
      </section>

      {/* Presets */}
      <section 
        className="pc-tools-section"
        style={{
          marginBottom: '1.5rem',
          paddingBottom: '1.5rem',
          borderBottom: '1px solid rgba(255, 255, 255, 0.08)'
        }}
      >
        <h3 
          className="pc-tools-section-title"
          style={{
            fontSize: '1rem',
            fontWeight: 700,
            background: 'linear-gradient(135deg, #ffffff 0%, #d4d9e8 100%)',
            WebkitBackgroundClip: 'text',
            WebkitTextFillColor: 'transparent',
            marginBottom: '0.875rem'
          }}
        >
          📋 Presets
        </h3>
        <div className="pc-preset-list" style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
          {CHAOS_PRESETS.map((preset) => (
            <button
              key={preset.id}
              onClick={() => onLoadPreset(preset.id)}
              className="pc-preset-item"
              style={{
                padding: '0.75rem 1rem',
                borderRadius: '10px',
                background: 'linear-gradient(135deg, rgba(102, 126, 234, 0.1) 0%, rgba(118, 75, 162, 0.05) 100%)',
                border: '1px solid rgba(102, 126, 234, 0.2)',
                cursor: 'pointer',
                transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
                textAlign: 'left',
                backdropFilter: 'blur(10px)'
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.background = 'linear-gradient(135deg, rgba(102, 126, 234, 0.2) 0%, rgba(118, 75, 162, 0.15) 100%)';
                e.currentTarget.style.borderColor = 'rgba(102, 126, 234, 0.4)';
                e.currentTarget.style.transform = 'translateY(-2px)';
                e.currentTarget.style.boxShadow = '0 6px 16px rgba(102, 126, 234, 0.12)';
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.background = 'linear-gradient(135deg, rgba(102, 126, 234, 0.1) 0%, rgba(118, 75, 162, 0.05) 100%)';
                e.currentTarget.style.borderColor = 'rgba(102, 126, 234, 0.2)';
                e.currentTarget.style.transform = 'translateY(0)';
                e.currentTarget.style.boxShadow = 'none';
              }}
              title={preset.description}
            >
              <div 
                className="pc-preset-name"
                style={{
                  fontSize: '0.95rem',
                  fontWeight: 600,
                  color: '#ffffff',
                  marginBottom: '0.25rem'
                }}
              >
                {preset.name}
              </div>
              <div 
                className="pc-preset-desc"
                style={{
                  fontSize: '0.8rem',
                  color: '#a8b0c4',
                  lineHeight: '1.3'
                }}
              >
                {preset.description}
              </div>
            </button>
          ))}
        </div>
      </section>

      {/* Add Objects */}
      <section 
        className="pc-tools-section"
        style={{
          marginBottom: '1.5rem',
          paddingBottom: '1.5rem',
          borderBottom: '1px solid rgba(255, 255, 255, 0.08)'
        }}
      >
        <h3 
          className="pc-tools-section-title"
          style={{
            fontSize: '1rem',
            fontWeight: 700,
            background: 'linear-gradient(135deg, #ffffff 0%, #d4d9e8 100%)',
            WebkitBackgroundClip: 'text',
            WebkitTextFillColor: 'transparent',
            marginBottom: '0.875rem'
          }}
        >
          ➕ Add
        </h3>
        <div className="pc-tools-buttons" style={{ display: 'flex', gap: '0.5rem' }}>
          {state.systemType === 'double-pendulum' && (
            <button 
              onClick={onAddPendulum} 
              className="pc-btn pc-btn-secondary"
              style={{
                flex: 1,
                padding: '0.625rem 1rem',
                borderRadius: '8px',
                background: 'linear-gradient(135deg, rgba(255, 255, 255, 0.05) 0%, rgba(255, 255, 255, 0.02) 100%)',
                color: '#d4d9e8',
                border: '1px solid rgba(255, 255, 255, 0.12)',
                fontWeight: 500,
                cursor: 'pointer',
                transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
                fontSize: '0.9rem',
                backdropFilter: 'blur(10px)'
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.transform = 'translateY(-2px)';
                e.currentTarget.style.background = 'linear-gradient(135deg, rgba(102, 126, 234, 0.1) 0%, rgba(118, 75, 162, 0.05) 100%)';
                e.currentTarget.style.borderColor = 'rgba(102, 126, 234, 0.3)';
                e.currentTarget.style.boxShadow = '0 6px 16px rgba(102, 126, 234, 0.1)';
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.transform = 'translateY(0)';
                e.currentTarget.style.background = 'linear-gradient(135deg, rgba(255, 255, 255, 0.05) 0%, rgba(255, 255, 255, 0.02) 100%)';
                e.currentTarget.style.borderColor = 'rgba(255, 255, 255, 0.12)';
                e.currentTarget.style.boxShadow = 'none';
              }}
            >
              Add Pendulum
            </button>
          )}
          {state.systemType === 'lorenz-attractor' && (
            <button 
              onClick={onAddLorenzPoint} 
              className="pc-btn pc-btn-secondary"
              style={{
                flex: 1,
                padding: '0.625rem 1rem',
                borderRadius: '8px',
                background: 'linear-gradient(135deg, rgba(255, 255, 255, 0.05) 0%, rgba(255, 255, 255, 0.02) 100%)',
                color: '#d4d9e8',
                border: '1px solid rgba(255, 255, 255, 0.12)',
                fontWeight: 500,
                cursor: 'pointer',
                transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
                fontSize: '0.9rem',
                backdropFilter: 'blur(10px)'
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.transform = 'translateY(-2px)';
                e.currentTarget.style.background = 'linear-gradient(135deg, rgba(102, 126, 234, 0.1) 0%, rgba(118, 75, 162, 0.05) 100%)';
                e.currentTarget.style.borderColor = 'rgba(102, 126, 234, 0.3)';
                e.currentTarget.style.boxShadow = '0 6px 16px rgba(102, 126, 234, 0.1)';
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.transform = 'translateY(0)';
                e.currentTarget.style.background = 'linear-gradient(135deg, rgba(255, 255, 255, 0.05) 0%, rgba(255, 255, 255, 0.02) 100%)';
                e.currentTarget.style.borderColor = 'rgba(255, 255, 255, 0.12)';
                e.currentTarget.style.boxShadow = 'none';
              }}
            >
              Add Trajectory
            </button>
          )}
        </div>
      </section>

      {/* Info */}
      <section className="pc-tools-section">
        <h3 
          className="pc-tools-section-title"
          style={{
            fontSize: '1rem',
            fontWeight: 700,
            background: 'linear-gradient(135deg, #ffffff 0%, #d4d9e8 100%)',
            WebkitBackgroundClip: 'text',
            WebkitTextFillColor: 'transparent',
            marginBottom: '0.875rem'
          }}
        >
          ℹ️ About Chaos
        </h3>
        <div 
          className="pc-tools-info"
          style={{
            padding: '1rem',
            borderRadius: '10px',
            background: 'linear-gradient(135deg, rgba(102, 126, 234, 0.08) 0%, rgba(118, 75, 162, 0.04) 100%)',
            border: '1px solid rgba(102, 126, 234, 0.2)',
            color: '#a8b0c4',
            fontSize: '0.9rem',
            lineHeight: '1.6'
          }}
        >
          {state.systemType === 'double-pendulum' ? (
            <>
              <p style={{ marginBottom: '0.75rem' }}>
                <strong style={{ color: '#ffffff' }}>Double Pendulum:</strong> A classic example of a chaotic system where
                tiny changes in initial conditions lead to dramatically different outcomes.
              </p>
              <p>
                <strong style={{ color: '#ffffff' }}>Butterfly Effect:</strong> Compare two nearly identical pendulums to see
                how their paths diverge over time.
              </p>
            </>
          ) : (
            <>
              <p style={{ marginBottom: '0.75rem' }}>
                <strong style={{ color: '#ffffff' }}>Lorenz Attractor:</strong> A strange attractor from weather modeling that
                demonstrates deterministic chaos.
              </p>
              <p>
                <strong style={{ color: '#ffffff' }}>Parameters:</strong> σ (sigma) controls convection, ρ (rho) controls
                temperature difference, β (beta) is geometric.
              </p>
            </>
          )}
        </div>
      </section>
    </div>
  );
};
