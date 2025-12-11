import React from 'react';
import type { CollisionState } from './types';

interface CollisionPropertiesProps {
  state: CollisionState;
  selectedBallId: string | null;
  onToggleDisplay: (key: 'showVelocityVectors' | 'showMomentumVectors' | 'showTrails' | 'showGrid') => void;
  onUpdateBallVelocity: (id: string, vx: number, vy: number) => void;
  onDeleteBall: (id: string) => void;
}

export const CollisionProperties: React.FC<CollisionPropertiesProps> = ({
  state,
  selectedBallId,
  onToggleDisplay,
  onUpdateBallVelocity,
  onDeleteBall,
}) => {
  const selectedBall = state.balls.find(b => b.id === selectedBallId);

  // Calculate conservation percentages
  const momentumConservation = state.initialMomentumX !== 0 || state.initialMomentumY !== 0
    ? 100 * Math.sqrt(
        (state.totalMomentumX ** 2 + state.totalMomentumY ** 2) /
        (state.initialMomentumX ** 2 + state.initialMomentumY ** 2)
      )
    : 100;

  const energyConservation = state.initialEnergy !== 0
    ? 100 * (state.totalEnergy / state.initialEnergy)
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
              checked={state.showVelocityVectors}
              onChange={() => onToggleDisplay('showVelocityVectors')}
              style={{ accentColor: '#4dabf7' }}
            />
            <span style={{ color: '#4dabf7', fontWeight: 600 }}>Velocity Vectors</span>
          </label>
          <label style={{ display: 'flex', alignItems: 'center', gap: '10px', cursor: 'pointer', fontSize: '13px' }}>
            <input
              type="checkbox"
              checked={state.showMomentumVectors}
              onChange={() => onToggleDisplay('showMomentumVectors')}
              style={{ accentColor: '#51cf66' }}
            />
            <span style={{ color: '#51cf66', fontWeight: 600 }}>Momentum Vectors</span>
          </label>
          <label style={{ display: 'flex', alignItems: 'center', gap: '10px', cursor: 'pointer', fontSize: '13px' }}>
            <input
              type="checkbox"
              checked={state.showTrails}
              onChange={() => onToggleDisplay('showTrails')}
              style={{ accentColor: '#9333ea' }}
            />
            <span style={{ color: '#9333ea', fontWeight: 600 }}>Motion Trails</span>
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
        
        {/* Total Momentum */}
        <div style={{
          padding: '12px',
          background: '#222',
          border: '1px solid #333',
          borderRadius: '6px',
          fontSize: '13px',
          marginBottom: '10px',
        }}>
          <div style={{ marginBottom: '8px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <strong style={{ color: '#51cf66' }}>Total Momentum</strong>
            <span style={{
              fontSize: '11px',
              padding: '2px 6px',
              background: momentumConservation > 95 ? '#1a3a1a' : '#3a1a1a',
              color: momentumConservation > 95 ? '#51cf66' : '#ff6b6b',
              borderRadius: '4px',
            }}>
              {momentumConservation > 95 ? '✓ Conserved' : '✗ Not Conserved'}
            </span>
          </div>
          <div style={{ fontSize: '12px', color: '#bbb' }}>
            px = {state.totalMomentumX.toFixed(1)} kg·m/s<br />
            py = {state.totalMomentumY.toFixed(1)} kg·m/s
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
            <strong style={{ color: '#ffd43b' }}>Kinetic Energy</strong>
            <span style={{
              fontSize: '11px',
              padding: '2px 6px',
              background: energyConservation > 95 ? '#1a3a1a' : '#3a3a1a',
              color: energyConservation > 95 ? '#51cf66' : '#ffd43b',
              borderRadius: '4px',
            }}>
              {energyConservation.toFixed(0)}%
            </span>
          </div>
          <div style={{ fontSize: '12px', color: '#bbb' }}>
            E = {state.totalEnergy.toFixed(1)} J
            {state.collisionType !== 'elastic' && (
              <div style={{ fontSize: '10px', color: '#888', marginTop: '4px' }}>
                Energy loss expected in {state.collisionType} collisions
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Selected Ball Properties */}
      {selectedBall ? (
        <div style={{ marginBottom: '25px' }}>
          <h3 style={{ fontSize: '14px', marginBottom: '12px', fontWeight: 600, color: '#bbb' }}>
            Selected Ball
          </h3>
          
          <div style={{
            padding: '15px',
            background: '#222',
            border: `2px solid ${selectedBall.color}`,
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
                  background: selectedBall.color,
                  border: '2px solid #000',
                }} />
                <span style={{ fontSize: '13px', fontWeight: 600 }}>
                  {selectedBall.mass.toFixed(1)} kg
                </span>
              </div>
              <button
                onClick={() => onDeleteBall(selectedBall.id)}
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

            {/* Velocity Controls */}
            <div style={{ marginBottom: '12px' }}>
              <label style={{
                display: 'block',
                fontSize: '11px',
                color: '#999',
                marginBottom: '6px',
              }}>
                Velocity X: {selectedBall.vx.toFixed(0)} m/s
              </label>
              <input
                type="range"
                min="-150"
                max="150"
                value={selectedBall.vx}
                onChange={(e) => onUpdateBallVelocity(
                  selectedBall.id,
                  parseFloat(e.target.value),
                  selectedBall.vy
                )}
                style={{ width: '100%', accentColor: '#4dabf7' }}
              />
            </div>

            <div>
              <label style={{
                display: 'block',
                fontSize: '11px',
                color: '#999',
                marginBottom: '6px',
              }}>
                Velocity Y: {selectedBall.vy.toFixed(0)} m/s
              </label>
              <input
                type="range"
                min="-150"
                max="150"
                value={selectedBall.vy}
                onChange={(e) => onUpdateBallVelocity(
                  selectedBall.id,
                  selectedBall.vx,
                  parseFloat(e.target.value)
                )}
                style={{ width: '100%', accentColor: '#4dabf7' }}
              />
            </div>

            <div style={{
              marginTop: '12px',
              padding: '10px',
              background: '#1a1a1a',
              borderRadius: '4px',
              fontSize: '11px',
              color: '#888',
            }}>
              <div>Speed: {Math.sqrt(selectedBall.vx ** 2 + selectedBall.vy ** 2).toFixed(1)} m/s</div>
              <div>Momentum: {(selectedBall.mass * Math.sqrt(selectedBall.vx ** 2 + selectedBall.vy ** 2)).toFixed(1)} kg·m/s</div>
              <div>KE: {(0.5 * selectedBall.mass * (selectedBall.vx ** 2 + selectedBall.vy ** 2)).toFixed(1)} J</div>
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
          Click a ball to edit its properties
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
        <strong style={{ color: '#ff9f43' }}>Total Balls:</strong> {state.balls.length}<br />
        <strong style={{ color: '#ff9f43' }}>Collision Type:</strong> {state.collisionType}<br />
        <strong style={{ color: '#ff9f43' }}>Status:</strong> {state.isPaused ? 'Paused' : 'Running'}
      </div>
    </div>
  );
};
