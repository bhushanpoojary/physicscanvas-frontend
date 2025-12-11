import React from 'react';
import type { UncertaintyState } from './types';
import { MIN_UNCERTAINTY_PRODUCT } from './types';

interface UncertaintyPropertiesProps {
  state: UncertaintyState;
  onToggleDisplay: (key: 'showPositionSpace' | 'showMomentumSpace' | 'showUncertaintyProduct') => void;
}

export const UncertaintyProperties: React.FC<UncertaintyPropertiesProps> = ({
  state,
  onToggleDisplay,
}) => {
  const wp = state.wavePacket;
  const satisfiesPrinciple = wp.product >= MIN_UNCERTAINTY_PRODUCT - 0.001;

  return (
    <div style={{ padding: '20px', color: '#e0e0e0' }}>
      <h2 style={{ fontSize: '18px', marginBottom: '20px', color: '#fff' }}>
        Measurements
      </h2>

      {/* Display Options */}
      <div style={{ marginBottom: '25px' }}>
        <h3
          style={{
            fontSize: '14px',
            marginBottom: '12px',
            fontWeight: 600,
            color: '#bbb',
          }}
        >
          Display Options
        </h3>
        <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
          <label
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '10px',
              cursor: 'pointer',
              fontSize: '13px',
            }}
          >
            <input
              type="checkbox"
              checked={state.showPositionSpace}
              onChange={() => onToggleDisplay('showPositionSpace')}
              style={{ accentColor: '#4dabf7' }}
            />
            <span style={{ color: '#4dabf7', fontWeight: 600 }}>Position Space</span>
          </label>
          <label
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '10px',
              cursor: 'pointer',
              fontSize: '13px',
            }}
          >
            <input
              type="checkbox"
              checked={state.showMomentumSpace}
              onChange={() => onToggleDisplay('showMomentumSpace')}
              style={{ accentColor: '#51cf66' }}
            />
            <span style={{ color: '#51cf66', fontWeight: 600 }}>Momentum Space</span>
          </label>
          <label
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '10px',
              cursor: 'pointer',
              fontSize: '13px',
            }}
          >
            <input
              type="checkbox"
              checked={state.showUncertaintyProduct}
              onChange={() => onToggleDisplay('showUncertaintyProduct')}
              style={{ accentColor: '#9333ea' }}
            />
            <span style={{ color: '#9333ea', fontWeight: 600 }}>Uncertainty Product</span>
          </label>
        </div>
      </div>

      {/* Uncertainties */}
      <div style={{ marginBottom: '25px' }}>
        <h3
          style={{
            fontSize: '14px',
            marginBottom: '12px',
            fontWeight: 600,
            color: '#bbb',
          }}
        >
          Uncertainties
        </h3>
        
        <div
          style={{
            padding: '12px',
            background: '#222',
            border: '1px solid #333',
            borderRadius: '6px',
            fontSize: '13px',
            marginBottom: '10px',
          }}
        >
          <div style={{ marginBottom: '8px' }}>
            <strong style={{ color: '#4dabf7' }}>Δx =</strong>{' '}
            <span style={{ color: '#fff', fontFamily: 'monospace', fontSize: '14px' }}>
              {wp.deltaX.toFixed(4)}
            </span>
          </div>
          <div style={{ fontSize: '11px', color: '#888' }}>
            Position uncertainty (standard deviation)
          </div>
        </div>

        <div
          style={{
            padding: '12px',
            background: '#222',
            border: '1px solid #333',
            borderRadius: '6px',
            fontSize: '13px',
            marginBottom: '10px',
          }}
        >
          <div style={{ marginBottom: '8px' }}>
            <strong style={{ color: '#51cf66' }}>Δp =</strong>{' '}
            <span style={{ color: '#fff', fontFamily: 'monospace', fontSize: '14px' }}>
              {wp.deltaP.toFixed(4)}
            </span>
          </div>
          <div style={{ fontSize: '11px', color: '#888' }}>
            Momentum uncertainty (standard deviation)
          </div>
        </div>

        <div
          style={{
            padding: '12px',
            background: satisfiesPrinciple ? '#1a3a1a' : '#3a1a1a',
            border: satisfiesPrinciple ? '1px solid #51cf66' : '1px solid #ff6b6b',
            borderRadius: '6px',
            fontSize: '13px',
          }}
        >
          <div style={{ marginBottom: '8px' }}>
            <strong style={{ color: satisfiesPrinciple ? '#51cf66' : '#ff6b6b' }}>
              Δx · Δp =
            </strong>{' '}
            <span style={{ color: '#fff', fontFamily: 'monospace', fontSize: '16px', fontWeight: 'bold' }}>
              {wp.product.toFixed(4)}
            </span>
          </div>
          <div style={{ fontSize: '11px', color: '#bbb' }}>
            {satisfiesPrinciple ? (
              <>✓ Satisfies uncertainty principle (≥ {MIN_UNCERTAINTY_PRODUCT.toFixed(4)})</>
            ) : (
              <>✗ Below minimum (numerical error)</>
            )}
          </div>
        </div>
      </div>

      {/* Expectation Values */}
      <div style={{ marginBottom: '25px' }}>
        <h3
          style={{
            fontSize: '14px',
            marginBottom: '12px',
            fontWeight: 600,
            color: '#bbb',
          }}
        >
          Expectation Values
        </h3>
        
        <div
          style={{
            padding: '10px',
            background: '#222',
            border: '1px solid #333',
            borderRadius: '6px',
            fontSize: '12px',
            marginBottom: '8px',
          }}
        >
          <div style={{ color: '#ff6b6b' }}>
            ⟨x⟩ = {wp.meanX.toFixed(3)}
          </div>
        </div>

        <div
          style={{
            padding: '10px',
            background: '#222',
            border: '1px solid #333',
            borderRadius: '6px',
            fontSize: '12px',
          }}
        >
          <div style={{ color: '#ffd43b' }}>
            ⟨p⟩ = {wp.meanP.toFixed(3)}
          </div>
        </div>
      </div>

      {/* Educational Info */}
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
          Interpretation
        </h3>
        <div style={{ color: '#bbb' }}>
          <p style={{ marginBottom: '8px' }}>
            <strong>Gaussian Wave Packet:</strong> A Gaussian wave packet achieves the minimum uncertainty product (Δx·Δp = ℏ/2 exactly).
          </p>
          <p style={{ marginBottom: '8px' }}>
            <strong>Trade-off:</strong> Making the wave packet narrower in position (smaller σ) automatically makes it broader in momentum, and vice versa.
          </p>
          <p style={{ margin: 0 }}>
            <strong>Fourier Relationship:</strong> The momentum-space wave function φ(p) is the Fourier transform of the position-space wave function ψ(x).
          </p>
        </div>
      </div>
    </div>
  );
};
