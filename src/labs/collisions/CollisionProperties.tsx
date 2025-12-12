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
    <div style={{ padding: '1.75rem 1.5rem', color: '#d4d9e8', overflowY: 'auto', height: '100%' }}>
      <h2 style={{ fontSize: '1.35rem', marginBottom: '1.75rem', color: '#fff', fontWeight: 700, background: 'linear-gradient(135deg, #ffffff 0%, #d4d9e8 100%)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent', letterSpacing: '-0.3px' }}>
        Properties
      </h2>

      {/* Display Options */}
      <div style={{ marginBottom: '1.75rem' }}>
        <h3 style={{ fontSize: '0.95rem', marginBottom: '1rem', fontWeight: 700, color: '#d4d9e8', letterSpacing: '-0.2px' }}>
          Display
        </h3>
        <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
          <label style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', cursor: 'pointer', fontSize: '0.9rem', padding: '0.75rem 1rem', background: 'linear-gradient(135deg, rgba(255, 255, 255, 0.05) 0%, rgba(255, 255, 255, 0.02) 100%)', border: '1px solid rgba(255, 255, 255, 0.08)', borderRadius: '10px', transition: 'all 0.2s ease', backdropFilter: 'blur(10px)' }}>
            <input
              type="checkbox"
              checked={state.showVelocityVectors}
              onChange={() => onToggleDisplay('showVelocityVectors')}
              style={{ accentColor: '#667eea', width: '18px', height: '18px', cursor: 'pointer' }}
            />
            <span style={{ color: '#667eea', fontWeight: 700 }}>Velocity Vectors</span>
          </label>
          <label style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', cursor: 'pointer', fontSize: '0.9rem', padding: '0.75rem 1rem', background: 'linear-gradient(135deg, rgba(255, 255, 255, 0.05) 0%, rgba(255, 255, 255, 0.02) 100%)', border: '1px solid rgba(255, 255, 255, 0.08)', borderRadius: '10px', transition: 'all 0.2s ease', backdropFilter: 'blur(10px)' }}>
            <input
              type="checkbox"
              checked={state.showMomentumVectors}
              onChange={() => onToggleDisplay('showMomentumVectors')}
              style={{ accentColor: '#10b981', width: '18px', height: '18px', cursor: 'pointer' }}
            />
            <span style={{ color: '#10b981', fontWeight: 700 }}>Momentum Vectors</span>
          </label>
          <label style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', cursor: 'pointer', fontSize: '0.9rem', padding: '0.75rem 1rem', background: 'linear-gradient(135deg, rgba(255, 255, 255, 0.05) 0%, rgba(255, 255, 255, 0.02) 100%)', border: '1px solid rgba(255, 255, 255, 0.08)', borderRadius: '10px', transition: 'all 0.2s ease', backdropFilter: 'blur(10px)' }}>
            <input
              type="checkbox"
              checked={state.showTrails}
              onChange={() => onToggleDisplay('showTrails')}
              style={{ accentColor: '#a855f7', width: '18px', height: '18px', cursor: 'pointer' }}
            />
            <span style={{ color: '#a855f7', fontWeight: 700 }}>Motion Trails</span>
          </label>
          <label style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', cursor: 'pointer', fontSize: '0.9rem', padding: '0.75rem 1rem', background: 'linear-gradient(135deg, rgba(255, 255, 255, 0.05) 0%, rgba(255, 255, 255, 0.02) 100%)', border: '1px solid rgba(255, 255, 255, 0.08)', borderRadius: '10px', transition: 'all 0.2s ease', backdropFilter: 'blur(10px)' }}>
            <input
              type="checkbox"
              checked={state.showGrid}
              onChange={() => onToggleDisplay('showGrid')}
              style={{ accentColor: '#6b7280', width: '18px', height: '18px', cursor: 'pointer' }}
            />
            <span style={{ color: '#8b95b2', fontWeight: 700 }}>Grid</span>
          </label>
        </div>
      </div>

      {/* Conservation Laws */}
      <div style={{ marginBottom: '1.75rem' }}>
        <h3 style={{ fontSize: '0.95rem', marginBottom: '1rem', fontWeight: 700, color: '#d4d9e8', letterSpacing: '-0.2px' }}>
          Conservation Laws
        </h3>
        
        {/* Total Momentum */}
        <div style={{
          padding: '1.25rem',
          background: 'linear-gradient(135deg, rgba(255, 255, 255, 0.05) 0%, rgba(255, 255, 255, 0.02) 100%)',
          border: '1px solid rgba(255, 255, 255, 0.08)',
          borderRadius: '12px',
          fontSize: '0.9rem',
          marginBottom: '0.875rem',
          backdropFilter: 'blur(10px)',
          boxShadow: '0 4px 12px rgba(0, 0, 0, 0.1)',
        }}>
          <div style={{ marginBottom: '0.75rem', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <strong style={{ color: '#10b981', fontWeight: 700 }}>Total Momentum</strong>
            <span style={{
              fontSize: '0.85rem',
              padding: '0.375rem 0.75rem',
              background: momentumConservation > 95 ? 'linear-gradient(135deg, rgba(16, 185, 129, 0.2) 0%, rgba(16, 185, 129, 0.1) 100%)' : 'linear-gradient(135deg, rgba(239, 68, 68, 0.2) 0%, rgba(239, 68, 68, 0.1) 100%)',
              color: momentumConservation > 95 ? '#10b981' : '#ef4444',
              borderRadius: '8px',
              fontWeight: 700,
              border: momentumConservation > 95 ? '1px solid rgba(16, 185, 129, 0.3)' : '1px solid rgba(239, 68, 68, 0.3)',
            }}>
              {momentumConservation > 95 ? '✓ Conserved' : '✗ Not Conserved'}
            </span>
          </div>
          <div style={{ fontSize: '0.85rem', color: '#8b95b2', lineHeight: '1.6' }}>
            px = {state.totalMomentumX.toFixed(1)} kg·m/s<br />
            py = {state.totalMomentumY.toFixed(1)} kg·m/s
          </div>
        </div>

        {/* Total Energy */}
        <div style={{
          padding: '1.25rem',
          background: 'linear-gradient(135deg, rgba(255, 255, 255, 0.05) 0%, rgba(255, 255, 255, 0.02) 100%)',
          border: '1px solid rgba(255, 255, 255, 0.08)',
          borderRadius: '12px',
          fontSize: '0.9rem',
          backdropFilter: 'blur(10px)',
          boxShadow: '0 4px 12px rgba(0, 0, 0, 0.1)',
        }}>
          <div style={{ marginBottom: '0.75rem', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <strong style={{ color: '#f59e0b', fontWeight: 700 }}>Kinetic Energy</strong>
            <span style={{
              fontSize: '0.85rem',
              padding: '0.375rem 0.75rem',
              background: energyConservation > 95 ? 'linear-gradient(135deg, rgba(16, 185, 129, 0.2) 0%, rgba(16, 185, 129, 0.1) 100%)' : 'linear-gradient(135deg, rgba(245, 158, 11, 0.2) 0%, rgba(245, 158, 11, 0.1) 100%)',
              color: energyConservation > 95 ? '#10b981' : '#f59e0b',
              borderRadius: '8px',
              fontWeight: 700,
              border: energyConservation > 95 ? '1px solid rgba(16, 185, 129, 0.3)' : '1px solid rgba(245, 158, 11, 0.3)',
            }}>
              {energyConservation.toFixed(0)}%
            </span>
          </div>
          <div style={{ fontSize: '0.85rem', color: '#8b95b2', lineHeight: '1.6' }}>
            E = {state.totalEnergy.toFixed(1)} J
            {state.collisionType !== 'elastic' && (
              <div style={{ fontSize: '0.8rem', color: '#667eea', marginTop: '0.5rem', fontStyle: 'italic' }}>
                ℹ️ Energy loss expected in {state.collisionType} collisions
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Selected Ball Properties */}
      {selectedBall ? (
        <div style={{ marginBottom: '1.75rem' }}>
          <h3 style={{ fontSize: '0.95rem', marginBottom: '1rem', fontWeight: 700, color: '#d4d9e8', letterSpacing: '-0.2px' }}>
            Selected Ball
          </h3>
          
          <div style={{
            padding: '1.25rem',
            background: 'linear-gradient(135deg, rgba(255, 255, 255, 0.05) 0%, rgba(255, 255, 255, 0.02) 100%)',
            border: `2px solid ${selectedBall.color}`,
            borderRadius: '12px',
            backdropFilter: 'blur(10px)',
            boxShadow: `0 8px 24px ${selectedBall.color}33`,
          }}>
            <div style={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              marginBottom: '1.25rem',
            }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                <div style={{
                  width: '40px',
                  height: '40px',
                  borderRadius: '50%',
                  background: selectedBall.color,
                  border: '2px solid rgba(255, 255, 255, 0.2)',
                  boxShadow: `0 4px 12px ${selectedBall.color}66`,
                }} />
                <span style={{ fontSize: '0.95rem', fontWeight: 700, color: '#ffffff' }}>
                  {selectedBall.mass.toFixed(1)} kg
                </span>
              </div>
              <button
                onClick={() => onDeleteBall(selectedBall.id)}
                style={{
                  padding: '0.5rem 1rem',
                  background: 'linear-gradient(135deg, #ef4444 0%, #dc2626 100%)',
                  border: 'none',
                  borderRadius: '8px',
                  color: '#fff',
                  fontSize: '0.85rem',
                  fontWeight: 700,
                  cursor: 'pointer',
                  transition: 'all 0.2s ease',
                  boxShadow: '0 4px 12px rgba(239, 68, 68, 0.3)',
                  fontFamily: 'inherit',
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.transform = 'translateY(-2px)';
                  e.currentTarget.style.boxShadow = '0 6px 16px rgba(239, 68, 68, 0.4)';
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.transform = 'translateY(0)';
                  e.currentTarget.style.boxShadow = '0 4px 12px rgba(239, 68, 68, 0.3)';
                }}
              >
                🗑️ Delete
              </button>
            </div>

            {/* Velocity Controls */}
            <div style={{ marginBottom: '1rem' }}>
              <label style={{
                display: 'block',
                fontSize: '0.85rem',
                color: '#8b95b2',
                marginBottom: '0.5rem',
                fontWeight: 600,
              }}>
                Velocity X: <strong style={{ color: '#667eea' }}>{selectedBall.vx.toFixed(0)} m/s</strong>
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
                style={{ width: '100%', accentColor: '#667eea', height: '8px', borderRadius: '4px', background: 'linear-gradient(to right, rgba(102, 126, 234, 0.3), rgba(118, 75, 162, 0.3))', cursor: 'pointer' }}
              />
            </div>

            <div style={{ marginBottom: '1.25rem' }}>
              <label style={{
                display: 'block',
                fontSize: '0.85rem',
                color: '#8b95b2',
                marginBottom: '0.5rem',
                fontWeight: 600,
              }}>
                Velocity Y: <strong style={{ color: '#667eea' }}>{selectedBall.vy.toFixed(0)} m/s</strong>
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
                style={{ width: '100%', accentColor: '#667eea', height: '8px', borderRadius: '4px', background: 'linear-gradient(to right, rgba(102, 126, 234, 0.3), rgba(118, 75, 162, 0.3))', cursor: 'pointer' }}
              />
            </div>

            <div style={{
              marginTop: '1rem',
              padding: '1rem',
              background: 'linear-gradient(135deg, rgba(102, 126, 234, 0.1) 0%, rgba(118, 75, 162, 0.05) 100%)',
              borderRadius: '8px',
              fontSize: '0.85rem',
              color: '#d4d9e8',
              border: '1px solid rgba(102, 126, 234, 0.2)',
            }}>
              <div style={{ marginBottom: '0.5rem' }}><strong>Speed:</strong> {Math.sqrt(selectedBall.vx ** 2 + selectedBall.vy ** 2).toFixed(1)} m/s</div>
              <div style={{ marginBottom: '0.5rem' }}><strong>Momentum:</strong> {(selectedBall.mass * Math.sqrt(selectedBall.vx ** 2 + selectedBall.vy ** 2)).toFixed(1)} kg·m/s</div>
              <div><strong>KE:</strong> {(0.5 * selectedBall.mass * (selectedBall.vx ** 2 + selectedBall.vy ** 2)).toFixed(1)} J</div>
            </div>
          </div>
        </div>
      ) : (
        <div style={{
          padding: '1.5rem',
          background: 'linear-gradient(135deg, rgba(255, 255, 255, 0.05) 0%, rgba(255, 255, 255, 0.02) 100%)',
          border: '1px solid rgba(255, 255, 255, 0.08)',
          borderRadius: '12px',
          textAlign: 'center',
          color: '#8b95b2',
          fontSize: '0.9rem',
          backdropFilter: 'blur(10px)',
          boxShadow: '0 4px 12px rgba(0, 0, 0, 0.1)',
          marginBottom: '1.75rem',
        }}>
          Click a ball to edit its properties
        </div>
      )}

      {/* System Info */}
      <div style={{
        padding: '1.25rem',
        background: 'linear-gradient(135deg, rgba(255, 255, 255, 0.05) 0%, rgba(255, 255, 255, 0.02) 100%)',
        border: '1px solid rgba(255, 255, 255, 0.08)',
        borderRadius: '12px',
        fontSize: '0.9rem',
        lineHeight: '1.8',
        color: '#d4d9e8',
        backdropFilter: 'blur(10px)',
        boxShadow: '0 4px 12px rgba(0, 0, 0, 0.1)',
      }}>
        <strong style={{ color: '#667eea', fontWeight: 700 }}>📊 Total Balls:</strong> {state.balls.length}<br />
        <strong style={{ color: '#667eea', fontWeight: 700 }}>⚛️ Collision Type:</strong> {state.collisionType.charAt(0).toUpperCase() + state.collisionType.slice(1).replace('-', ' ')}<br />
        <strong style={{ color: '#667eea', fontWeight: 700 }}>▶️ Status:</strong> <span style={{ color: state.isPaused ? '#f59e0b' : '#10b981', fontWeight: 700 }}>{state.isPaused ? '⏸ Paused' : '▶ Running'}</span>
      </div>
    </div>
  );
};
