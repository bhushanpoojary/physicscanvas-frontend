import React from 'react';
import type { QuantumState, SystemParameters } from './types';
import { QUANTUM_SYSTEMS } from './types';

interface QuantumPropertiesProps {
  state: QuantumState;
  onToggleDisplay: (key: 'showReal' | 'showImaginary' | 'showProbability') => void;
  onParameterChange: (params: Partial<SystemParameters>) => void;
}

export const QuantumProperties: React.FC<QuantumPropertiesProps> = ({
  state,
  onToggleDisplay,
  onParameterChange,
}) => {
  const currentSystem = QUANTUM_SYSTEMS.find((s) => s.id === state.system.id);

  return (
    <div style={{ padding: '20px', color: '#e0e0e0' }}>
      <h2 style={{ fontSize: '18px', marginBottom: '20px', color: '#fff' }}>
        Properties
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
              checked={state.showReal}
              onChange={() => onToggleDisplay('showReal')}
              style={{ accentColor: '#51cf66' }}
            />
            <span style={{ color: '#51cf66', fontWeight: 600 }}>Re(ψ)</span>
            <span style={{ color: '#999' }}>Real part</span>
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
              checked={state.showImaginary}
              onChange={() => onToggleDisplay('showImaginary')}
              style={{ accentColor: '#ffd43b' }}
            />
            <span style={{ color: '#ffd43b', fontWeight: 600 }}>Im(ψ)</span>
            <span style={{ color: '#999' }}>Imaginary part</span>
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
              checked={state.showProbability}
              onChange={() => onToggleDisplay('showProbability')}
              style={{ accentColor: '#9333ea' }}
            />
            <span style={{ color: '#9333ea', fontWeight: 600 }}>|ψ|²</span>
            <span style={{ color: '#999' }}>Probability density</span>
          </label>
        </div>
      </div>

      {/* Energy Information */}
      <div style={{ marginBottom: '25px' }}>
        <h3
          style={{
            fontSize: '14px',
            marginBottom: '12px',
            fontWeight: 600,
            color: '#bbb',
          }}
        >
          Energy Eigenvalue
        </h3>
        <div
          style={{
            padding: '12px',
            background: '#222',
            border: '1px solid #333',
            borderRadius: '6px',
            fontSize: '13px',
          }}
        >
          <div style={{ marginBottom: '6px' }}>
            <strong style={{ color: '#4dabf7' }}>E =</strong>{' '}
            <span style={{ color: '#fff', fontFamily: 'monospace' }}>
              {state.waveFunction.energy.toFixed(4)}
            </span>
          </div>
          <div style={{ fontSize: '11px', color: '#888' }}>
            Energy of quantum state n = {state.energyLevel}
          </div>
        </div>
      </div>

      {/* System Parameters */}
      {currentSystem && (
        <div style={{ marginBottom: '25px' }}>
          <h3
            style={{
              fontSize: '14px',
              marginBottom: '12px',
              fontWeight: 600,
              color: '#bbb',
            }}
          >
            System Parameters
          </h3>

          {/* Well Width (for well systems) */}
          {(state.system.id === 'infiniteWell' || state.system.id === 'finiteWell') && (
            <div style={{ marginBottom: '15px' }}>
              <label
                style={{
                  display: 'block',
                  marginBottom: '6px',
                  fontSize: '12px',
                  color: '#999',
                }}
              >
                Well Width (nm)
              </label>
              <input
                type="number"
                value={state.system.parameters.wellWidth || 1.0}
                onChange={(e) =>
                  onParameterChange({ wellWidth: parseFloat(e.target.value) })
                }
                step="0.1"
                min="0.1"
                max="10"
                style={{
                  width: '100%',
                  padding: '6px',
                  background: '#2a2a2a',
                  border: '1px solid #444',
                  borderRadius: '4px',
                  color: '#e0e0e0',
                  fontSize: '12px',
                }}
              />
            </div>
          )}

          {/* Barrier Height (for finite well and barrier) */}
          {(state.system.id === 'finiteWell' || state.system.id === 'barrier') && (
            <div style={{ marginBottom: '15px' }}>
              <label
                style={{
                  display: 'block',
                  marginBottom: '6px',
                  fontSize: '12px',
                  color: '#999',
                }}
              >
                Barrier Height (eV)
              </label>
              <input
                type="number"
                value={state.system.parameters.barrierHeight || 10.0}
                onChange={(e) =>
                  onParameterChange({ barrierHeight: parseFloat(e.target.value) })
                }
                step="1"
                min="1"
                max="50"
                style={{
                  width: '100%',
                  padding: '6px',
                  background: '#2a2a2a',
                  border: '1px solid #444',
                  borderRadius: '4px',
                  color: '#e0e0e0',
                  fontSize: '12px',
                }}
              />
            </div>
          )}

          {/* Barrier Width (for barrier tunneling) */}
          {state.system.id === 'barrier' && (
            <div style={{ marginBottom: '15px' }}>
              <label
                style={{
                  display: 'block',
                  marginBottom: '6px',
                  fontSize: '12px',
                  color: '#999',
                }}
              >
                Barrier Width (nm)
              </label>
              <input
                type="number"
                value={state.system.parameters.barrierWidth || 0.5}
                onChange={(e) =>
                  onParameterChange({ barrierWidth: parseFloat(e.target.value) })
                }
                step="0.1"
                min="0.1"
                max="5"
                style={{
                  width: '100%',
                  padding: '6px',
                  background: '#2a2a2a',
                  border: '1px solid #444',
                  borderRadius: '4px',
                  color: '#e0e0e0',
                  fontSize: '12px',
                }}
              />
            </div>
          )}

          {/* Omega (for harmonic oscillator) */}
          {state.system.id === 'harmonicOscillator' && (
            <div style={{ marginBottom: '15px' }}>
              <label
                style={{
                  display: 'block',
                  marginBottom: '6px',
                  fontSize: '12px',
                  color: '#999',
                }}
              >
                Angular Frequency ω
              </label>
              <input
                type="number"
                value={state.system.parameters.omega || 1.0}
                onChange={(e) =>
                  onParameterChange({ omega: parseFloat(e.target.value) })
                }
                step="0.1"
                min="0.1"
                max="5"
                style={{
                  width: '100%',
                  padding: '6px',
                  background: '#2a2a2a',
                  border: '1px solid #444',
                  borderRadius: '4px',
                  color: '#e0e0e0',
                  fontSize: '12px',
                }}
              />
            </div>
          )}
        </div>
      )}

      {/* Information Panel */}
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
          About This System
        </h3>
        <div style={{ color: '#bbb' }}>
          {state.system.id === 'infiniteWell' && (
            <>
              <p style={{ marginBottom: '8px' }}>
                The infinite square well is the simplest quantum system. The particle
                is confined to a box with impenetrable walls.
              </p>
              <p style={{ margin: 0 }}>
                Energy levels: E<sub>n</sub> ∝ n²
              </p>
            </>
          )}
          {state.system.id === 'harmonicOscillator' && (
            <>
              <p style={{ marginBottom: '8px' }}>
                The quantum harmonic oscillator models atoms in molecules and
                electromagnetic field modes.
              </p>
              <p style={{ margin: 0 }}>
                Energy levels: E<sub>n</sub> = ℏω(n + ½)
              </p>
            </>
          )}
          {state.system.id === 'finiteWell' && (
            <>
              <p style={{ marginBottom: '8px' }}>
                Similar to the infinite well, but the particle can penetrate into the
                barrier region due to quantum tunneling.
              </p>
              <p style={{ margin: 0 }}>Finite number of bound states.</p>
            </>
          )}
          {state.system.id === 'barrier' && (
            <>
              <p style={{ marginBottom: '8px' }}>
                Demonstrates quantum tunneling: a wave packet can pass through a
                potential barrier even when classically forbidden.
              </p>
              <p style={{ margin: 0 }}>Key to radioactive decay and scanning tunneling microscopy.</p>
            </>
          )}
        </div>
      </div>
    </div>
  );
};
