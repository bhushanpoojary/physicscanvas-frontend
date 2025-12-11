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
    <div style={{ padding: '20px', color: '#e0e0e0' }}>
      <h2 style={{ fontSize: '18px', marginBottom: '20px', color: '#fff' }}>
        Controls
      </h2>

      {/* Playback Controls */}
      <div style={{ marginBottom: '25px' }}>
        <div style={{ display: 'flex', gap: '10px' }}>
          <button
            onClick={onTogglePause}
            style={{
              flex: 1,
              padding: '12px',
              fontSize: '14px',
              fontWeight: 600,
              background: state.isPaused ? '#51cf66' : '#ff6b6b',
              color: '#fff',
              border: 'none',
              borderRadius: '6px',
              cursor: 'pointer',
              transition: 'transform 0.1s',
            }}
            onMouseDown={(e) => e.currentTarget.style.transform = 'scale(0.95)'}
            onMouseUp={(e) => e.currentTarget.style.transform = 'scale(1)'}
          >
            {state.isPaused ? '▶ Play' : '⏸ Pause'}
          </button>
          
          <button
            onClick={onReset}
            style={{
              flex: 1,
              padding: '12px',
              fontSize: '14px',
              fontWeight: 600,
              background: '#4a90e2',
              color: '#fff',
              border: 'none',
              borderRadius: '6px',
              cursor: 'pointer',
              transition: 'transform 0.1s',
            }}
            onMouseDown={(e) => e.currentTarget.style.transform = 'scale(0.95)'}
            onMouseUp={(e) => e.currentTarget.style.transform = 'scale(1)'}
          >
            🔄 Reset
          </button>
        </div>
      </div>

      {/* Collision Type */}
      <div style={{ marginBottom: '25px' }}>
        <label
          style={{
            display: 'block',
            marginBottom: '10px',
            fontSize: '13px',
            fontWeight: 600,
            color: '#bbb',
          }}
        >
          Collision Type
        </label>
        
        <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
          {(['elastic', 'inelastic', 'perfectly-inelastic'] as CollisionType[]).map(type => (
            <button
              key={type}
              onClick={() => onSetCollisionType(type)}
              style={{
                padding: '10px 12px',
                background: state.collisionType === type ? '#ff9f43' : '#2a2a2a',
                border: state.collisionType === type ? '2px solid #ff9f43' : '1px solid #444',
                borderRadius: '6px',
                color: '#e0e0e0',
                fontSize: '12px',
                fontWeight: state.collisionType === type ? 600 : 400,
                cursor: 'pointer',
                textAlign: 'left',
                transition: 'all 0.2s',
              }}
            >
              {type === 'elastic' && '⚡ Elastic'}
              {type === 'inelastic' && '💫 Inelastic'}
              {type === 'perfectly-inelastic' && '🔗 Perfectly Inelastic'}
              <div style={{ fontSize: '10px', color: '#999', marginTop: '4px' }}>
                {type === 'elastic' && 'Energy & momentum conserved'}
                {type === 'inelastic' && 'Some energy lost'}
                {type === 'perfectly-inelastic' && 'Balls stick together'}
              </div>
            </button>
          ))}
        </div>
      </div>

      {/* Presets */}
      <div style={{ marginBottom: '25px' }}>
        <label
          style={{
            display: 'block',
            marginBottom: '10px',
            fontSize: '13px',
            fontWeight: 600,
            color: '#bbb',
          }}
        >
          Scenarios
        </label>
        
        <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
          {COLLISION_PRESETS.map(preset => (
            <button
              key={preset.id}
              onClick={() => onLoadPreset(preset.id)}
              style={{
                padding: '10px 12px',
                background: '#2a2a2a',
                border: '1px solid #444',
                borderRadius: '6px',
                color: '#e0e0e0',
                fontSize: '12px',
                cursor: 'pointer',
                textAlign: 'left',
                transition: 'background 0.2s',
              }}
              onMouseEnter={(e) => e.currentTarget.style.background = '#333'}
              onMouseLeave={(e) => e.currentTarget.style.background = '#2a2a2a'}
            >
              <div style={{ fontWeight: 600, marginBottom: '4px' }}>
                {preset.name}
              </div>
              <div style={{ fontSize: '10px', color: '#999' }}>
                {preset.description}
              </div>
            </button>
          ))}
        </div>
      </div>

      {/* Instructions */}
      <div
        style={{
          padding: '15px',
          background: '#1a2332',
          border: '1px solid #2d3748',
          borderRadius: '6px',
          fontSize: '12px',
          lineHeight: '1.6',
        }}
      >
        <h3 style={{ fontSize: '13px', marginBottom: '10px', color: '#ff9f43' }}>
          How to Use
        </h3>
        <ul style={{ margin: 0, paddingLeft: '20px', color: '#bbb' }}>
          <li style={{ marginBottom: '6px' }}>Click canvas to add new balls</li>
          <li style={{ marginBottom: '6px' }}>Select a ball to edit its properties</li>
          <li style={{ marginBottom: '6px' }}>Press Play to start simulation</li>
          <li>Watch conservation of momentum & energy!</li>
        </ul>
      </div>
    </div>
  );
};
