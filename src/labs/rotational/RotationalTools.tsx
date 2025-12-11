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
            marginBottom: '10px',
            fontSize: '13px',
            fontWeight: 600,
            color: '#bbb',
          }}
        >
          Add Object
        </label>
        
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '8px' }}>
          {(['disk', 'ring', 'rod', 'sphere'] as RotatingObjectType[]).map(type => (
            <button
              key={type}
              onClick={() => onSelectTool(currentTool === type ? null : type)}
              style={{
                padding: '10px',
                background: currentTool === type ? '#ff9f43' : '#2a2a2a',
                border: currentTool === type ? '2px solid #ff9f43' : '1px solid #444',
                borderRadius: '6px',
                color: '#e0e0e0',
                fontSize: '12px',
                fontWeight: currentTool === type ? 600 : 400,
                cursor: 'pointer',
                textAlign: 'center',
                transition: 'all 0.2s',
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
            marginBottom: '10px',
            fontSize: '13px',
            fontWeight: 600,
            color: '#bbb',
          }}
        >
          Friction: {frictionValue.toFixed(2)}
        </label>
        <input
          type="range"
          min="0"
          max="1"
          step="0.05"
          value={frictionValue}
          onChange={(e) => handleFrictionChange(parseFloat(e.target.value))}
          style={{ width: '100%', accentColor: '#4dabf7' }}
        />
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
          {ROTATIONAL_PRESETS.map(preset => (
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
          <li style={{ marginBottom: '6px' }}>Select a shape and click canvas to add</li>
          <li style={{ marginBottom: '6px' }}>Click an object to edit its properties</li>
          <li style={{ marginBottom: '6px' }}>Adjust friction to see damping effects</li>
          <li>Press Play to start rotation!</li>
        </ul>
      </div>
    </div>
  );
};
