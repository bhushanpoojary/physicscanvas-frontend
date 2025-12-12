import React from 'react';
import type { RelativityToolType, ScenePresetId } from './types';

const TOOLS: { type: RelativityToolType; name: string; icon: string; description: string }[] = [
  { type: 'observer', name: 'Observer', icon: '👤', description: 'Add inertial reference frame' },
  { type: 'event', name: 'Event', icon: '⭐', description: 'Add spacetime event' },
  { type: 'light-pulse', name: 'Light Pulse', icon: '💡', description: 'Add photon worldline' },
];

const PRESETS: { id: ScenePresetId; label: string }[] = [
  { id: 'empty', label: 'Empty Scene' },
  { id: 'simultaneity', label: 'Relativity of Simultaneity' },
  { id: 'timeDilation', label: 'Time Dilation' },
  { id: 'lengthContraction', label: 'Length Contraction' },
  { id: 'lightClock', label: 'Light Clock' },
];

interface RelativityToolsProps {
  currentTool: RelativityToolType | null;
  onSelectTool: (tool: RelativityToolType | null) => void;
  onLoadPreset: (presetId: ScenePresetId) => void;
  currentPreset: ScenePresetId;
}

const RelativityTools: React.FC<RelativityToolsProps> = ({
  currentTool,
  onSelectTool,
  onLoadPreset,
  currentPreset,
}) => {
  return (
    <div className="pc-sidebar-content">
      <h2 className="pc-sidebar-title">Tools</h2>
      
      <div className="pc-tools-list">
        {TOOLS.map(tool => (
          <button
            key={tool.type}
            className={`pc-tool-card ${currentTool === tool.type ? 'pc-tool-card-active' : ''}`}
            onClick={() => onSelectTool(currentTool === tool.type ? null : tool.type)}
          >
            <div className="pc-tool-card-header">
              <div className="pc-tool-icon">
                <span style={{ fontSize: '24px' }}>{tool.icon}</span>
              </div>
              <div className="pc-tool-info">
                <div className="pc-tool-name">{tool.name}</div>
                <div className="pc-tool-description">{tool.description}</div>
              </div>
            </div>
          </button>
        ))}
      </div>

      <div style={{ marginTop: '1.5rem' }}>
        <h3 className="pc-sidebar-title" style={{ fontSize: '0.95rem', marginBottom: '1rem', fontWeight: 700, color: '#d4d9e8', letterSpacing: '-0.2px' }}>
          Scene Presets
        </h3>
        <select
          value={currentPreset}
          onChange={(e) => onLoadPreset(e.target.value as ScenePresetId)}
          className="pc-preset-select"
          style={{ width: '100%', padding: '0.75rem 1rem', background: 'linear-gradient(135deg, rgba(255, 255, 255, 0.08) 0%, rgba(255, 255, 255, 0.03) 100%)', border: '1px solid rgba(255, 255, 255, 0.12)', borderRadius: '10px', color: '#ffffff', fontSize: '0.9rem', fontWeight: 600, cursor: 'pointer', transition: 'all 0.2s ease', backdropFilter: 'blur(10px)', fontFamily: 'inherit' }}
        >
          {PRESETS.map(preset => (
            <option key={preset.id} value={preset.id} style={{ background: '#1a1f2e', color: '#ffffff' }}>
              {preset.label}
            </option>
          ))}
        </select>
      </div>

      <div style={{ marginTop: '1.5rem', padding: '1.25rem', background: 'linear-gradient(135deg, rgba(255, 255, 255, 0.05) 0%, rgba(255, 255, 255, 0.02) 100%)', borderRadius: '12px', border: '1px solid rgba(255, 255, 255, 0.08)', backdropFilter: 'blur(10px)', boxShadow: '0 4px 12px rgba(0, 0, 0, 0.1)' }}>
        <p style={{ margin: 0, fontSize: '0.9rem', color: '#8b95b2', lineHeight: 1.6 }}>
          <strong style={{ color: '#667eea', fontWeight: 700 }}>💡 Tip:</strong> Click on the canvas to add objects. Select objects to view their properties.
        </p>
      </div>
    </div>
  );
};

export default RelativityTools;
