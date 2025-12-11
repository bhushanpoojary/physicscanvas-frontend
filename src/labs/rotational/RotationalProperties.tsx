import React from 'react';
import type { RotationalState } from './types';
import { calculateAngularMomentum, calculateRotationalEnergy } from './physics/rotational';

interface RotationalPropertiesProps {
  state: RotationalState;
  selectedObjectId: string | null;
  onToggleDisplay: (key: 'showAngularVelocity' | 'showAngularMomentum' | 'showTorque' | 'showGrid') => void;
  onUpdateObjectOmega: (id: string, omega: number) => void;
  onUpdateObjectTorque: (id: string, torque: number) => void;
  onDeleteObject: (id: string) => void;
}

export const RotationalProperties: React.FC<RotationalPropertiesProps> = ({
  state,
  selectedObjectId,
  onToggleDisplay,
  onUpdateObjectOmega,
  onUpdateObjectTorque,
  onDeleteObject,
}) => {
  const selectedObject = state.objects.find(obj => obj.id === selectedObjectId);

  // Calculate conservation percentages
  const momentumConservation = state.initialAngularMomentum !== 0
    ? 100 * Math.abs(state.totalAngularMomentum / state.initialAngularMomentum)
    : 100;

  const energyRatio = state.initialRotationalEnergy !== 0
    ? 100 * (state.totalRotationalEnergy / state.initialRotationalEnergy)
    : 100;

  return (
    <div style={{ padding: '20px', color: '#e0e0e0', overflowY: 'auto', height: '100%' }}>
      <h2 style={{ fontSize: '18px', marginBottom: '20px', color: '#fff' }}>
        Properties
      </h2>

      {/* Display Options */}
      <div style={{ marginBottom: '25px' }}>
        <h3 style={{ fontSize: '14px', marginBottom: '12px', fontWeight: 600, color: '#bbb' }}>
          Display
        </h3>
        <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
          <label style={{ display: 'flex', alignItems: 'center', gap: '10px', cursor: 'pointer', fontSize: '13px' }}>
            <input
              type="checkbox"
              checked={state.showAngularVelocity}
              onChange={() => onToggleDisplay('showAngularVelocity')}
              style={{ accentColor: '#4dabf7' }}
            />
            <span style={{ color: '#4dabf7', fontWeight: 600 }}>Angular Velocity (ω)</span>
          </label>
          <label style={{ display: 'flex', alignItems: 'center', gap: '10px', cursor: 'pointer', fontSize: '13px' }}>
            <input
              type="checkbox"
              checked={state.showAngularMomentum}
              onChange={() => onToggleDisplay('showAngularMomentum')}
              style={{ accentColor: '#51cf66' }}
            />
            <span style={{ color: '#51cf66', fontWeight: 600 }}>Angular Momentum (L)</span>
          </label>
          <label style={{ display: 'flex', alignItems: 'center', gap: '10px', cursor: 'pointer', fontSize: '13px' }}>
            <input
              type="checkbox"
              checked={state.showTorque}
              onChange={() => onToggleDisplay('showTorque')}
              style={{ accentColor: '#ff6b6b' }}
            />
            <span style={{ color: '#ff6b6b', fontWeight: 600 }}>Torque (τ)</span>
          </label>
          <label style={{ display: 'flex', alignItems: 'center', gap: '10px', cursor: 'pointer', fontSize: '13px' }}>
            <input
              type="checkbox"
              checked={state.showGrid}
              onChange={() => onToggleDisplay('showGrid')}
              style={{ accentColor: '#666' }}
            />
            <span style={{ color: '#888', fontWeight: 600 }}>Grid</span>
          </label>
        </div>
      </div>

      {/* Conservation Laws */}
      <div style={{ marginBottom: '25px' }}>
        <h3 style={{ fontSize: '14px', marginBottom: '12px', fontWeight: 600, color: '#bbb' }}>
          Conservation Laws
        </h3>
        
        {/* Total Angular Momentum */}
        <div style={{
          padding: '12px',
          background: '#222',
          border: '1px solid #333',
          borderRadius: '6px',
          fontSize: '13px',
          marginBottom: '10px',
        }}>
          <div style={{ marginBottom: '8px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <strong style={{ color: '#51cf66' }}>Angular Momentum</strong>
            <span style={{
              fontSize: '11px',
              padding: '2px 6px',
              background: state.friction === 0 && momentumConservation > 95 ? '#1a3a1a' : '#3a3a1a',
              color: state.friction === 0 && momentumConservation > 95 ? '#51cf66' : '#ffd43b',
              borderRadius: '4px',
            }}>
              {state.friction === 0 ? (momentumConservation > 95 ? '✓ Conserved' : '~Conserved') : 'Damped'}
            </span>
          </div>
          <div style={{ fontSize: '12px', color: '#bbb' }}>
            L = {state.totalAngularMomentum.toFixed(1)} kg⋅m²/s
          </div>
        </div>

        {/* Total Energy */}
        <div style={{
          padding: '12px',
          background: '#222',
          border: '1px solid #333',
          borderRadius: '6px',
          fontSize: '13px',
        }}>
          <div style={{ marginBottom: '8px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <strong style={{ color: '#ffd43b' }}>Rotational Energy</strong>
            <span style={{
              fontSize: '11px',
              padding: '2px 6px',
              background: state.friction === 0 && energyRatio > 95 ? '#1a3a1a' : '#3a3a1a',
              color: state.friction === 0 && energyRatio > 95 ? '#51cf66' : '#ffd43b',
              borderRadius: '4px',
            }}>
              {energyRatio.toFixed(0)}%
            </span>
          </div>
          <div style={{ fontSize: '12px', color: '#bbb' }}>
            KE = {state.totalRotationalEnergy.toFixed(1)} J
            {state.friction > 0 && (
              <div style={{ fontSize: '10px', color: '#888', marginTop: '4px' }}>
                Energy loss due to friction
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Selected Object Properties */}
      {selectedObject ? (
        <div style={{ marginBottom: '25px' }}>
          <h3 style={{ fontSize: '14px', marginBottom: '12px', fontWeight: 600, color: '#bbb' }}>
            Selected Object
          </h3>
          
          <div style={{
            padding: '15px',
            background: '#222',
            border: `2px solid ${selectedObject.color}`,
            borderRadius: '6px',
          }}>
            <div style={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              marginBottom: '15px',
            }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                <div style={{
                  width: '30px',
                  height: '30px',
                  borderRadius: '50%',
                  background: selectedObject.color,
                  border: '2px solid #000',
                }} />
                <div>
                  <div style={{ fontSize: '13px', fontWeight: 600, textTransform: 'capitalize' }}>
                    {selectedObject.type}
                  </div>
                  <div style={{ fontSize: '11px', color: '#999' }}>
                    {selectedObject.mass.toFixed(1)} kg
                  </div>
                </div>
              </div>
              <button
                onClick={() => onDeleteObject(selectedObject.id)}
                style={{
                  padding: '6px 12px',
                  background: '#ff6b6b',
                  border: 'none',
                  borderRadius: '4px',
                  color: '#fff',
                  fontSize: '11px',
                  fontWeight: 600,
                  cursor: 'pointer',
                }}
              >
                🗑️ Delete
              </button>
            </div>

            {/* Angular Velocity Control */}
            <div style={{ marginBottom: '12px' }}>
              <label style={{
                display: 'block',
                fontSize: '11px',
                color: '#999',
                marginBottom: '6px',
              }}>
                Angular Velocity (ω): {selectedObject.omega.toFixed(2)} rad/s
              </label>
              <input
                type="range"
                min="-10"
                max="10"
                step="0.1"
                value={selectedObject.omega}
                onChange={(e) => onUpdateObjectOmega(
                  selectedObject.id,
                  parseFloat(e.target.value)
                )}
                style={{ width: '100%', accentColor: '#4dabf7' }}
              />
            </div>

            {/* Applied Torque Control */}
            <div>
              <label style={{
                display: 'block',
                fontSize: '11px',
                color: '#999',
                marginBottom: '6px',
              }}>
                Applied Torque (τ): {selectedObject.appliedTorque.toFixed(1)} N⋅m
              </label>
              <input
                type="range"
                min="-100"
                max="100"
                step="5"
                value={selectedObject.appliedTorque}
                onChange={(e) => onUpdateObjectTorque(
                  selectedObject.id,
                  parseFloat(e.target.value)
                )}
                style={{ width: '100%', accentColor: '#ff6b6b' }}
              />
            </div>

            {/* Object Stats */}
            <div style={{
              marginTop: '12px',
              padding: '10px',
              background: '#1a1a1a',
              borderRadius: '4px',
              fontSize: '11px',
              color: '#888',
            }}>
              <div>I: {selectedObject.momentOfInertia.toFixed(1)} kg⋅m²</div>
              <div>α: {selectedObject.alpha.toFixed(2)} rad/s²</div>
              <div>L: {calculateAngularMomentum(selectedObject).toFixed(1)} kg⋅m²/s</div>
              <div>KE: {calculateRotationalEnergy(selectedObject).toFixed(1)} J</div>
            </div>
          </div>
        </div>
      ) : (
        <div style={{
          padding: '20px',
          background: '#222',
          border: '1px solid #333',
          borderRadius: '6px',
          textAlign: 'center',
          color: '#666',
          fontSize: '12px',
        }}>
          Click an object to edit its properties
        </div>
      )}

      {/* System Info */}
      <div style={{
        padding: '15px',
        background: '#1a2332',
        border: '1px solid #2d3748',
        borderRadius: '6px',
        fontSize: '11px',
        lineHeight: '1.6',
        color: '#bbb',
      }}>
        <strong style={{ color: '#ff9f43' }}>Total Objects:</strong> {state.objects.length}<br />
        <strong style={{ color: '#ff9f43' }}>Friction:</strong> {state.friction.toFixed(2)}<br />
        <strong style={{ color: '#ff9f43' }}>Status:</strong> {state.isPaused ? 'Paused' : 'Running'}
      </div>
    </div>
  );
};
