import React, { useState } from 'react';
import { ROTATIONAL_PRESETS } from './types';
import type { RotationalState, RotatingObjectType } from './types';

interface RotationalToolsProps {
  state: RotationalState;
  onTogglePause: () => void;
  onReset: () => void;
  onLoadPreset: (presetId: string) => void;
  onSetFriction: (friction: number) => void;
  currentTool: RotatingObjectType | null;
  onSelectTool: (tool: RotatingObjectType | null) => void;
}

export const RotationalTools: React.FC<RotationalToolsProps> = ({
  state,
  onTogglePause,
  onReset,
  onLoadPreset,
  onSetFriction,
  currentTool,
  onSelectTool,
}) => {
  const [frictionValue, setFrictionValue] = useState(state.friction);

  const handleFrictionChange = (value: number) => {
    setFrictionValue(value);
    onSetFriction(value);
  };

  return (
    <div style={{ padding: '20px', color: '#e0e0e0' }}>
      <h2 
        style={{ 
          fontSize: '1.35rem',
          fontWeight: 700,
          background: 'linear-gradient(135deg, #ffffff 0%, #d4d9e8 100%)',
          WebkitBackgroundClip: 'text',
          WebkitTextFillColor: 'transparent',
          marginBottom: '1.5rem'
        }}
      >
        Rotational Controls
      </h2>

      {/* Playback Controls */}
      <div style={{ marginBottom: '25px' }}>
        <div style={{ display: 'flex', gap: '10px' }}>
          <button
            onClick={onTogglePause}
            style={{
              flex: 1,
              padding: '0.625rem 1rem',
              fontSize: '0.9rem',
              fontWeight: 600,
              background: state.isPaused 
                ? 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)'
                : 'linear-gradient(135deg, #10b981 0%, #059669 100%)',
              color: '#fff',
              border: '1px solid rgba(255, 255, 255, 0.12)',
              borderRadius: '8px',
              cursor: 'pointer',
              transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
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
            style={{
              flex: 1,
              padding: '0.625rem 1rem',
              fontSize: '0.9rem',
              fontWeight: 600,
              background: 'linear-gradient(135deg, rgba(255, 255, 255, 0.05) 0%, rgba(255, 255, 255, 0.02) 100%)',
              color: '#d4d9e8',
              border: '1px solid rgba(255, 255, 255, 0.12)',
              borderRadius: '8px',
              cursor: 'pointer',
              transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
              backdropFilter: 'blur(10px)'
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.background = 'linear-gradient(135deg, rgba(102, 126, 234, 0.1) 0%, rgba(118, 75, 162, 0.05) 100%)';
              e.currentTarget.style.borderColor = 'rgba(102, 126, 234, 0.3)';
              e.currentTarget.style.transform = 'translateY(-2px)';
              e.currentTarget.style.boxShadow = '0 6px 16px rgba(102, 126, 234, 0.1)';
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.background = 'linear-gradient(135deg, rgba(255, 255, 255, 0.05) 0%, rgba(255, 255, 255, 0.02) 100%)';
              e.currentTarget.style.borderColor = 'rgba(255, 255, 255, 0.12)';
              e.currentTarget.style.transform = 'translateY(0)';
              e.currentTarget.style.boxShadow = 'none';
            }}
          >
            🔄 Reset
          </button>
        </div>
      </div>

      {/* Object Tools */}
      <div style={{ marginBottom: '25px' }}>
        <label
          style={{
            display: 'block',
            marginBottom: '0.875rem',
            fontSize: '0.9rem',
            fontWeight: 700,
            background: 'linear-gradient(135deg, #ffffff 0%, #d4d9e8 100%)',
            WebkitBackgroundClip: 'text',
            WebkitTextFillColor: 'transparent',
          }}
        >
          Add Object
        </label>
        
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.75rem' }}>
          {(['disk', 'ring', 'rod', 'sphere'] as RotatingObjectType[]).map(type => (
            <button
              key={type}
              onClick={() => onSelectTool(currentTool === type ? null : type)}
              style={{
                padding: '0.625rem 0.75rem',
                background: currentTool === type
                  ? 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)'
                  : 'linear-gradient(135deg, rgba(102, 126, 234, 0.1) 0%, rgba(118, 75, 162, 0.05) 100%)',
                border: currentTool === type
                  ? '1px solid rgba(102, 126, 234, 0.5)'
                  : '1px solid rgba(102, 126, 234, 0.2)',
                borderRadius: '8px',
                color: '#d4d9e8',
                fontSize: '0.85rem',
                fontWeight: 600,
                cursor: 'pointer',
                textAlign: 'center',
                transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
                backdropFilter: 'blur(10px)'
              }}
              onMouseEnter={(e) => {
                if (currentTool !== type) {
                  e.currentTarget.style.background = 'linear-gradient(135deg, rgba(102, 126, 234, 0.2) 0%, rgba(118, 75, 162, 0.15) 100%)';
                  e.currentTarget.style.borderColor = 'rgba(102, 126, 234, 0.4)';
                }
                e.currentTarget.style.transform = 'translateY(-2px)';
                e.currentTarget.style.boxShadow = '0 6px 16px rgba(102, 126, 234, 0.12)';
              }}
              onMouseLeave={(e) => {
                if (currentTool !== type) {
                  e.currentTarget.style.background = 'linear-gradient(135deg, rgba(102, 126, 234, 0.1) 0%, rgba(118, 75, 162, 0.05) 100%)';
                  e.currentTarget.style.borderColor = 'rgba(102, 126, 234, 0.2)';
                }
                e.currentTarget.style.transform = 'translateY(0)';
                e.currentTarget.style.boxShadow = 'none';
              }}
            >
              {type === 'disk' && '⚪ Disk'}
              {type === 'ring' && '⭕ Ring'}
              {type === 'rod' && '📏 Rod'}
              {type === 'sphere' && '🔵 Sphere'}
            </button>
          ))}
        </div>
      </div>

      {/* Friction Control */}
      <div style={{ marginBottom: '25px' }}>
        <label
          style={{
            display: 'block',
            marginBottom: '0.75rem',
            fontSize: '0.9rem',
            fontWeight: 600,
            color: '#d4d9e8'
          }}
        >
          Friction: <span style={{ color: '#667eea' }}>{frictionValue.toFixed(2)}</span>
        </label>
        <input
          type="range"
          min="0"
          max="1"
          step="0.05"
          value={frictionValue}
          onChange={(e) => handleFrictionChange(parseFloat(e.target.value))}
          style={{ 
            width: '100%', 
            accentColor: '#667eea',
            height: '8px',
            background: 'linear-gradient(to right, rgba(102, 126, 234, 0.3), rgba(118, 75, 162, 0.3))',
            borderRadius: '4px'
          }}
        />
      </div>

      {/* Presets */}
      <div style={{ marginBottom: '25px' }}>
        <label
          style={{
            display: 'block',
            marginBottom: '0.875rem',
            fontSize: '0.9rem',
            fontWeight: 700,
            background: 'linear-gradient(135deg, #ffffff 0%, #d4d9e8 100%)',
            WebkitBackgroundClip: 'text',
            WebkitTextFillColor: 'transparent',
          }}
        >
          Scenarios
        </label>
        
        <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
          {ROTATIONAL_PRESETS.map(preset => (
            <button
              key={preset.id}
              onClick={() => onLoadPreset(preset.id)}
              style={{
                padding: '0.75rem 1rem',
                background: 'linear-gradient(135deg, rgba(102, 126, 234, 0.1) 0%, rgba(118, 75, 162, 0.05) 100%)',
                border: '1px solid rgba(102, 126, 234, 0.2)',
                borderRadius: '10px',
                color: '#d4d9e8',
                fontSize: '0.85rem',
                cursor: 'pointer',
                textAlign: 'left',
                transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
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
            >
              <div style={{ fontWeight: 600, marginBottom: '4px', color: '#ffffff' }}>
                {preset.name}
              </div>
              <div style={{ fontSize: '0.75rem', color: '#a8b0c4' }}>
                {preset.description}
              </div>
            </button>
          ))}
        </div>
      </div>

      {/* Instructions */}
      <div
        style={{
          padding: '1rem',
          background: 'linear-gradient(135deg, rgba(102, 126, 234, 0.08) 0%, rgba(118, 75, 162, 0.04) 100%)',
          border: '1px solid rgba(102, 126, 234, 0.2)',
          borderRadius: '10px',
          fontSize: '0.85rem',
          lineHeight: '1.6',
          color: '#a8b0c4'
        }}
      >
        <h3 style={{ fontSize: '0.9rem', marginBottom: '0.75rem', color: '#ffffff', fontWeight: 700 }}>
          How to Use
        </h3>
        <ul style={{ margin: 0, paddingLeft: '20px' }}>
          <li style={{ marginBottom: '6px' }}>Select a shape and click canvas to add</li>
          <li style={{ marginBottom: '6px' }}>Click an object to edit its properties</li>
          <li style={{ marginBottom: '6px' }}>Adjust friction to see damping effects</li>
          <li>Press Play to start rotation!</li>
        </ul>
      </div>
    </div>
  );
};
