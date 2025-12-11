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
    <div style={{ padding: '20px', color: '#e0e0e0' }}>
      <h2 style={{ fontSize: '18px', marginBottom: '20px', color: '#fff' }}>
        Wave Packet Parameters
      </h2>

      {/* Width Parameter σ */}
      <div style={{ marginBottom: '25px' }}>
        <label
          style={{
            display: 'block',
            marginBottom: '8px',
            fontSize: '13px',
            fontWeight: 600,
            color: '#bbb',
          }}
        >
          Position Width σ: {sigma.toFixed(2)}
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
            accentColor: '#4dabf7',
          }}
        />
        <div
          style={{
            fontSize: '11px',
            color: '#777',
            marginTop: '4px',
          }}
        >
          Smaller σ → narrower in position → broader in momentum
        </div>
      </div>

      {/* Center Position x0 */}
      <div style={{ marginBottom: '25px' }}>
        <label
          style={{
            display: 'block',
            marginBottom: '8px',
            fontSize: '13px',
            fontWeight: 600,
            color: '#bbb',
          }}
        >
          Center Position x₀: {x0.toFixed(1)}
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
            accentColor: '#ff6b6b',
          }}
        />
      </div>

      {/* Wave Number k0 */}
      <div style={{ marginBottom: '25px' }}>
        <label
          style={{
            display: 'block',
            marginBottom: '8px',
            fontSize: '13px',
            fontWeight: 600,
            color: '#bbb',
          }}
        >
          Wave Number k₀: {k0.toFixed(1)}
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
            accentColor: '#51cf66',
          }}
        />
        <div
          style={{
            fontSize: '11px',
            color: '#777',
            marginTop: '4px',
          }}
        >
          Momentum p₀ = ℏk₀ ≈ {k0.toFixed(1)}
        </div>
      </div>

      {/* Presets */}
      <div style={{ marginBottom: '25px' }}>
        <label
          style={{
            display: 'block',
            marginBottom: '8px',
            fontSize: '13px',
            fontWeight: 600,
            color: '#bbb',
          }}
        >
          Quick Demonstrations
        </label>
        <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
          {UNCERTAINTY_PRESETS.map((preset) => (
            <button
              key={preset.id}
              onClick={() => onLoadPreset(preset.id)}
              style={{
                padding: '10px 12px',
                background: '#2a2a2a',
                border: '1px solid #444',
                borderRadius: '4px',
                color: '#e0e0e0',
                fontSize: '12px',
                cursor: 'pointer',
                textAlign: 'left',
                transition: 'background 0.2s',
              }}
              onMouseEnter={(e) => (e.currentTarget.style.background = '#333')}
              onMouseLeave={(e) => (e.currentTarget.style.background = '#2a2a2a')}
            >
              <div style={{ fontWeight: 600, marginBottom: '2px' }}>{preset.name}</div>
              <div style={{ fontSize: '10px', color: '#999' }}>{preset.description}</div>
            </button>
          ))}
        </div>
      </div>

      {/* Information Box */}
      <div
        style={{
          marginTop: '30px',
          padding: '15px',
          background: '#1a2332',
          border: '1px solid #2d3748',
          borderRadius: '6px',
          fontSize: '12px',
          lineHeight: '1.6',
        }}
      >
        <h3 style={{ fontSize: '13px', marginBottom: '10px', color: '#4dabf7' }}>
          About Uncertainty
        </h3>
        <p style={{ margin: '0 0 10px 0', color: '#bbb' }}>
          The Heisenberg Uncertainty Principle states that you cannot simultaneously know both the position and momentum of a particle with arbitrary precision.
        </p>
        <p style={{ margin: 0, color: '#bbb' }}>
          <strong>Δx · Δp ≥ ℏ/2</strong>
          <br />
          The product of uncertainties is always at least ℏ/2 ≈ 0.5 (in natural units).
        </p>
      </div>
    </div>
  );
};
