import React, { useState } from 'react';
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

      <div style={{ marginTop: '2rem' }}>
        <h3 className="pc-sidebar-title" style={{ fontSize: '1rem', marginBottom: '0.75rem' }}>
          Scene Presets
        </h3>
        <select
          value={currentPreset}
          onChange={(e) => onLoadPreset(e.target.value as ScenePresetId)}
          className="pc-preset-select"
          style={{ width: '100%' }}
        >
          {PRESETS.map(preset => (
            <option key={preset.id} value={preset.id}>
              {preset.label}
            </option>
          ))}
        </select>
      </div>

      <div style={{ marginTop: '2rem', padding: '1rem', backgroundColor: '#f0f7ff', borderRadius: '6px' }}>
        <p style={{ margin: 0, fontSize: '0.85rem', color: '#555', lineHeight: 1.5 }}>
          <strong>Tip:</strong> Click on the canvas to add objects. Select objects to view their properties.
        </p>
      </div>
    </div>
  );
};

export default RelativityTools;
