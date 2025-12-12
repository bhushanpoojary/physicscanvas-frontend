import React from 'react';
import { COLLISION_PRESETS } from './types';
import type { CollisionType, CollisionState } from './types';

interface CollisionToolsProps {
  state: CollisionState;
  onTogglePause: () => void;
  onReset: () => void;
  onSetCollisionType: (type: CollisionType) => void;
  onLoadPreset: (presetId: string) => void;
}

export const CollisionTools: React.FC<CollisionToolsProps> = ({
  state,
  onTogglePause,
  onReset,
  onSetCollisionType,
  onLoadPreset,
}) => {
  return (
    <div style={{ padding: '1.75rem 1.5rem', color: '#d4d9e8' }}>
      <h2 style={{ fontSize: '1.35rem', marginBottom: '1.75rem', color: '#fff', fontWeight: 700, background: 'linear-gradient(135deg, #ffffff 0%, #d4d9e8 100%)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent', letterSpacing: '-0.3px' }}>
        Controls
      </h2>

      {/* Playback Controls */}
      <div style={{ marginBottom: '1.75rem' }}>
        <div style={{ display: 'flex', gap: '0.875rem' }}>
          <button
            onClick={onTogglePause}
            style={{
              flex: 1,
              padding: '0.875rem',
              fontSize: '0.95rem',
              fontWeight: 700,
              background: state.isPaused ? 'linear-gradient(135deg, #10b981 0%, #059669 100%)' : 'linear-gradient(135deg, #ef4444 0%, #dc2626 100%)',
              color: '#fff',
              border: 'none',
              borderRadius: '10px',
              cursor: 'pointer',
              transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
              boxShadow: '0 4px 12px rgba(0, 0, 0, 0.2)',
              fontFamily: 'inherit',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              gap: '0.5rem',
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.transform = 'translateY(-2px)';
              e.currentTarget.style.boxShadow = '0 8px 20px rgba(0, 0, 0, 0.3)';
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.transform = 'translateY(0)';
              e.currentTarget.style.boxShadow = '0 4px 12px rgba(0, 0, 0, 0.2)';
            }}
            onMouseDown={(e) => e.currentTarget.style.transform = 'translateY(-1px)'}
          >
            {state.isPaused ? '▶ Play' : '⏸ Pause'}
          </button>
          
          <button
            onClick={onReset}
            style={{
              flex: 1,
              padding: '0.875rem',
              fontSize: '0.95rem',
              fontWeight: 700,
              background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
              color: '#fff',
              border: 'none',
              borderRadius: '10px',
              cursor: 'pointer',
              transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
              boxShadow: '0 4px 12px rgba(102, 126, 234, 0.4)',
              fontFamily: 'inherit',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              gap: '0.5rem',
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.transform = 'translateY(-2px)';
              e.currentTarget.style.boxShadow = '0 8px 20px rgba(102, 126, 234, 0.5)';
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.transform = 'translateY(0)';
              e.currentTarget.style.boxShadow = '0 4px 12px rgba(102, 126, 234, 0.4)';
            }}
            onMouseDown={(e) => e.currentTarget.style.transform = 'translateY(-1px)'}
          >
            🔄 Reset
          </button>
        </div>
      </div>

      {/* Collision Type */}
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
          Collision Type
        </label>
        
        <div style={{ display: 'flex', flexDirection: 'column', gap: '0.875rem' }}>
          {(['elastic', 'inelastic', 'perfectly-inelastic'] as CollisionType[]).map(type => (
            <button
              key={type}
              onClick={() => onSetCollisionType(type)}
              style={{
                padding: '1rem',
                background: state.collisionType === type ? 'linear-gradient(135deg, rgba(102, 126, 234, 0.2) 0%, rgba(118, 75, 162, 0.15) 100%)' : 'linear-gradient(135deg, rgba(255, 255, 255, 0.05) 0%, rgba(255, 255, 255, 0.02) 100%)',
                border: state.collisionType === type ? '1px solid rgba(102, 126, 234, 0.6)' : '1px solid rgba(255, 255, 255, 0.08)',
                borderRadius: '12px',
                color: '#d4d9e8',
                fontSize: '0.95rem',
                fontWeight: state.collisionType === type ? 700 : 600,
                cursor: 'pointer',
                textAlign: 'left',
                transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
                backdropFilter: 'blur(10px)',
                boxShadow: state.collisionType === type ? '0 0 0 3px rgba(102, 126, 234, 0.1)' : '0 4px 12px rgba(0, 0, 0, 0.1)',
                fontFamily: 'inherit',
              }}
              onMouseEnter={(e) => {
                if (state.collisionType !== type) {
                  e.currentTarget.style.background = 'linear-gradient(135deg, rgba(255, 255, 255, 0.1) 0%, rgba(255, 255, 255, 0.05) 100%)';
                  e.currentTarget.style.transform = 'translateY(-2px)';
                  e.currentTarget.style.boxShadow = '0 6px 16px rgba(102, 126, 234, 0.15)';
                }
              }}
              onMouseLeave={(e) => {
                if (state.collisionType !== type) {
                  e.currentTarget.style.background = 'linear-gradient(135deg, rgba(255, 255, 255, 0.05) 0%, rgba(255, 255, 255, 0.02) 100%)';
                  e.currentTarget.style.transform = 'translateY(0)';
                  e.currentTarget.style.boxShadow = '0 4px 12px rgba(0, 0, 0, 0.1)';
                }
              }}
            >
              {type === 'elastic' && '⚡ Elastic'}
              {type === 'inelastic' && '💫 Inelastic'}
              {type === 'perfectly-inelastic' && '🔗 Perfectly Inelastic'}
              <div style={{ fontSize: '0.85rem', color: '#8b95b2', marginTop: '0.5rem' }}>
                {type === 'elastic' && 'Energy & momentum conserved'}
                {type === 'inelastic' && 'Some energy lost'}
                {type === 'perfectly-inelastic' && 'Balls stick together'}
              </div>
            </button>
          ))}
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
          Scenarios
        </label>
        
        <div style={{ display: 'flex', flexDirection: 'column', gap: '0.875rem' }}>
          {COLLISION_PRESETS.map(preset => (
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
              <div style={{ fontWeight: 700, marginBottom: '0.375rem', letterSpacing: '-0.2px' }}>
                {preset.name}
              </div>
              <div style={{ fontSize: '0.85rem', color: '#8b95b2' }}>
                {preset.description}
              </div>
            </button>
          ))}
        </div>
      </div>

      {/* Instructions */}
      <div
        style={{
          padding: '1.25rem',
          background: 'linear-gradient(135deg, rgba(255, 255, 255, 0.05) 0%, rgba(255, 255, 255, 0.02) 100%)',
          border: '1px solid rgba(255, 255, 255, 0.08)',
          borderRadius: '12px',
          fontSize: '0.9rem',
          lineHeight: '1.6',
          backdropFilter: 'blur(10px)',
          boxShadow: '0 4px 12px rgba(0, 0, 0, 0.1)',
        }}
      >
        <h3 style={{ fontSize: '0.95rem', marginBottom: '0.875rem', color: '#667eea', fontWeight: 700, letterSpacing: '-0.2px' }}>
          💡 How to Use
        </h3>
        <ul style={{ margin: 0, paddingLeft: '1.5rem', color: '#8b95b2' }}>
          <li style={{ marginBottom: '0.5rem' }}>Click canvas to add new balls</li>
          <li style={{ marginBottom: '0.5rem' }}>Select a ball to edit its properties</li>
          <li style={{ marginBottom: '0.5rem' }}>Press Play to start simulation</li>
          <li>Watch conservation of momentum & energy!</li>
        </ul>
      </div>
    </div>
  );
};
