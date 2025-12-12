import React from 'react';
import { UNCERTAINTY_PRESETS } from './types';

interface UncertaintyToolsProps {
  sigma: number;
  x0: number;
  k0: number;
  onSigmaChange: (sigma: number) => void;
  onX0Change: (x0: number) => void;
  onK0Change: (k0: number) => void;
  onLoadPreset: (presetId: string) => void;
}

export const UncertaintyTools: React.FC<UncertaintyToolsProps> = ({
  sigma,
  x0,
  k0,
  onSigmaChange,
  onX0Change,
  onK0Change,
  onLoadPreset,
}) => {
  return (
    <div style={{ padding: '1.75rem 1.5rem', color: '#d4d9e8' }}>
      <h2 style={{ fontSize: '1.35rem', marginBottom: '1.75rem', color: '#fff', fontWeight: 700, background: 'linear-gradient(135deg, #ffffff 0%, #d4d9e8 100%)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent', letterSpacing: '-0.3px' }}>
        Wave Packet Parameters
      </h2>

      {/* Width Parameter σ */}
      <div style={{ marginBottom: '1.5rem' }}>
        <label
          style={{
            display: 'block',
            marginBottom: '0.75rem',
            fontSize: '0.9rem',
            fontWeight: 700,
            color: '#d4d9e8',
            letterSpacing: '-0.2px',
          }}
        >
          Position Width σ: <strong style={{ color: '#667eea' }}>{sigma.toFixed(2)}</strong>
        </label>
        <input
          type="range"
          min="0.1"
          max="5.0"
          step="0.1"
          value={sigma}
          onChange={(e) => onSigmaChange(parseFloat(e.target.value))}
          style={{
            width: '100%',
            accentColor: '#667eea',
            height: '8px',
            borderRadius: '4px',
            background: 'linear-gradient(to right, rgba(102, 126, 234, 0.3), rgba(118, 75, 162, 0.3))',
            cursor: 'pointer',
          }}
        />
        <div
          style={{
            fontSize: '0.85rem',
            color: '#8b95b2',
            marginTop: '0.5rem',
            fontStyle: 'italic',
          }}
        >
          Smaller σ → narrower in position → broader in momentum
        </div>
      </div>

      {/* Center Position x0 */}
      <div style={{ marginBottom: '1.5rem' }}>
        <label
          style={{
            display: 'block',
            marginBottom: '0.75rem',
            fontSize: '0.9rem',
            fontWeight: 700,
            color: '#d4d9e8',
            letterSpacing: '-0.2px',
          }}
        >
          Center Position x₀: <strong style={{ color: '#ef4444' }}>{x0.toFixed(1)}</strong>
        </label>
        <input
          type="range"
          min="-10"
          max="10"
          step="0.5"
          value={x0}
          onChange={(e) => onX0Change(parseFloat(e.target.value))}
          style={{
            width: '100%',
            accentColor: '#ef4444',
            height: '8px',
            borderRadius: '4px',
            background: 'linear-gradient(to right, rgba(239, 68, 68, 0.3), rgba(220, 38, 38, 0.3))',
            cursor: 'pointer',
          }}
        />
      </div>

      {/* Wave Number k0 */}
      <div style={{ marginBottom: '1.75rem' }}>
        <label
          style={{
            display: 'block',
            marginBottom: '0.75rem',
            fontSize: '0.9rem',
            fontWeight: 700,
            color: '#d4d9e8',
            letterSpacing: '-0.2px',
          }}
        >
          Wave Number k₀: <strong style={{ color: '#10b981' }}>{k0.toFixed(1)}</strong>
        </label>
        <input
          type="range"
          min="0"
          max="15"
          step="0.5"
          value={k0}
          onChange={(e) => onK0Change(parseFloat(e.target.value))}
          style={{
            width: '100%',
            accentColor: '#10b981',
            height: '8px',
            borderRadius: '4px',
            background: 'linear-gradient(to right, rgba(16, 185, 129, 0.3), rgba(5, 150, 105, 0.3))',
            cursor: 'pointer',
          }}
        />
        <div
          style={{
            fontSize: '0.85rem',
            color: '#8b95b2',
            marginTop: '0.5rem',
            fontStyle: 'italic',
          }}
        >
          Momentum p₀ = ℏk₀ ≈ {k0.toFixed(1)}
        </div>
      </div>

      {/* Presets */}
      <div style={{ marginBottom: '1.75rem' }}>
        <label
          style={{
            display: 'block',
            marginBottom: '1rem',
            fontSize: '0.95rem',
            fontWeight: 700,
            color: '#d4d9e8',
            letterSpacing: '-0.2px',
          }}
        >
          Quick Demonstrations
        </label>
        <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
          {UNCERTAINTY_PRESETS.map((preset) => (
            <button
              key={preset.id}
              onClick={() => onLoadPreset(preset.id)}
              style={{
                padding: '1rem',
                background: 'linear-gradient(135deg, rgba(255, 255, 255, 0.05) 0%, rgba(255, 255, 255, 0.02) 100%)',
                border: '1px solid rgba(255, 255, 255, 0.08)',
                borderRadius: '12px',
                color: '#d4d9e8',
                fontSize: '0.9rem',
                cursor: 'pointer',
                textAlign: 'left',
                transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
                backdropFilter: 'blur(10px)',
                boxShadow: '0 4px 12px rgba(0, 0, 0, 0.1)',
                fontFamily: 'inherit',
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.background = 'linear-gradient(135deg, rgba(102, 126, 234, 0.12) 0%, rgba(118, 75, 162, 0.08) 100%)';
                e.currentTarget.style.border = '1px solid rgba(102, 126, 234, 0.3)';
                e.currentTarget.style.transform = 'translateY(-2px)';
                e.currentTarget.style.boxShadow = '0 6px 16px rgba(102, 126, 234, 0.15)';
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.background = 'linear-gradient(135deg, rgba(255, 255, 255, 0.05) 0%, rgba(255, 255, 255, 0.02) 100%)';
                e.currentTarget.style.border = '1px solid rgba(255, 255, 255, 0.08)';
                e.currentTarget.style.transform = 'translateY(0)';
                e.currentTarget.style.boxShadow = '0 4px 12px rgba(0, 0, 0, 0.1)';
              }}
            >
              <div style={{ fontWeight: 700, marginBottom: '0.375rem', letterSpacing: '-0.2px' }}>{preset.name}</div>
              <div style={{ fontSize: '0.85rem', color: '#8b95b2' }}>{preset.description}</div>
            </button>
          ))}
        </div>
      </div>

      {/* Information Box */}
      <div
        style={{
          marginTop: '1.75rem',
          padding: '1.25rem',
          background: 'linear-gradient(135deg, rgba(255, 255, 255, 0.05) 0%, rgba(255, 255, 255, 0.02) 100%)',
          border: '1px solid rgba(255, 255, 255, 0.08)',
          borderRadius: '12px',
          fontSize: '0.9rem',
          lineHeight: '1.8',
          backdropFilter: 'blur(10px)',
          boxShadow: '0 4px 12px rgba(0, 0, 0, 0.1)',
        }}
      >
        <h3 style={{ fontSize: '0.95rem', marginBottom: '0.875rem', color: '#667eea', fontWeight: 700, letterSpacing: '-0.2px' }}>
          📐 About Uncertainty
        </h3>
        <p style={{ margin: '0 0 0.75rem 0', color: '#8b95b2' }}>
          The Heisenberg Uncertainty Principle states that you cannot simultaneously know both the position and momentum of a particle with arbitrary precision.
        </p>
        <p style={{ margin: 0, color: '#8b95b2' }}>
          <strong style={{ color: '#d4d9e8' }}>Δx · Δp ≥ ℏ/2</strong>
          <br />
          The product of uncertainties is always at least ℏ/2 ≈ 0.5 (in natural units).
        </p>
      </div>
    </div>
  );
};
