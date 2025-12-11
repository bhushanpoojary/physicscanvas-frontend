import React from 'react';
import type { QuantumSystemId } from './types';
import { QUANTUM_SYSTEMS } from './types';

interface QuantumToolsProps {
  systemId: QuantumSystemId;
  energyLevel: number;
  maxLevels: number;
  onSystemChange: (id: QuantumSystemId) => void;
  onEnergyChange: (n: number) => void;
  onLoadPreset: (presetId: string) => void;
}

export const QuantumTools: React.FC<QuantumToolsProps> = ({
  systemId,
  energyLevel,
  maxLevels,
  onSystemChange,
  onEnergyChange,
  onLoadPreset,
}) => {
  return (
    <div style={{ padding: '20px', color: '#e0e0e0' }}>
      <h2 style={{ fontSize: '18px', marginBottom: '20px', color: '#fff' }}>
        Quantum Systems
      </h2>

      {/* System Selector */}
      <div style={{ marginBottom: '25px' }}>
        <label
          style={{
            display: 'block',
            marginBottom: '8px',
            fontSize: '13px',
            fontWeight: 600,
            color: '#bbb',
          }}
        >
          Quantum System
        </label>
        <select
          value={systemId}
          onChange={(e) => onSystemChange(e.target.value as QuantumSystemId)}
          style={{
            width: '100%',
            padding: '8px',
            background: '#2a2a2a',
            border: '1px solid #444',
            borderRadius: '4px',
            color: '#e0e0e0',
            fontSize: '13px',
          }}
        >
          {QUANTUM_SYSTEMS.map((system) => (
            <option key={system.id} value={system.id}>
              {system.name}
            </option>
          ))}
        </select>
      </div>

      {/* Energy Level Slider */}
      <div style={{ marginBottom: '25px' }}>
        <label
          style={{
            display: 'block',
            marginBottom: '8px',
            fontSize: '13px',
            fontWeight: 600,
            color: '#bbb',
          }}
        >
          Energy Level: n = {energyLevel}
        </label>
        <input
          type="range"
          min="1"
          max={maxLevels}
          value={energyLevel}
          onChange={(e) => onEnergyChange(parseInt(e.target.value))}
          style={{
            width: '100%',
            accentColor: '#4dabf7',
          }}
        />
        <div
          style={{
            display: 'flex',
            justifyContent: 'space-between',
            fontSize: '11px',
            color: '#777',
            marginTop: '4px',
          }}
        >
          <span>1</span>
          <span>{maxLevels}</span>
        </div>
      </div>

      {/* Presets */}
      <div style={{ marginBottom: '25px' }}>
        <label
          style={{
            display: 'block',
            marginBottom: '8px',
            fontSize: '13px',
            fontWeight: 600,
            color: '#bbb',
          }}
        >
          Quick Presets
        </label>
        <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
          <button
            onClick={() => onLoadPreset('groundState')}
            style={{
              padding: '8px 12px',
              background: '#2a2a2a',
              border: '1px solid #444',
              borderRadius: '4px',
              color: '#e0e0e0',
              fontSize: '12px',
              cursor: 'pointer',
              textAlign: 'left',
            }}
          >
            Ground State (n=1)
          </button>
          <button
            onClick={() => onLoadPreset('firstExcited')}
            style={{
              padding: '8px 12px',
              background: '#2a2a2a',
              border: '1px solid #444',
              borderRadius: '4px',
              color: '#e0e0e0',
              fontSize: '12px',
              cursor: 'pointer',
              textAlign: 'left',
            }}
          >
            First Excited (n=2)
          </button>
          <button
            onClick={() => onLoadPreset('harmonicN3')}
            style={{
              padding: '8px 12px',
              background: '#2a2a2a',
              border: '1px solid #444',
              borderRadius: '4px',
              color: '#e0e0e0',
              fontSize: '12px',
              cursor: 'pointer',
              textAlign: 'left',
            }}
          >
            Harmonic Oscillator (n=3)
          </button>
          <button
            onClick={() => onLoadPreset('tunneling')}
            style={{
              padding: '8px 12px',
              background: '#2a2a2a',
              border: '1px solid #444',
              borderRadius: '4px',
              color: '#e0e0e0',
              fontSize: '12px',
              cursor: 'pointer',
              textAlign: 'left',
            }}
          >
            Barrier Tunneling
          </button>
          <button
            onClick={() => onLoadPreset('finiteN4')}
            style={{
              padding: '8px 12px',
              background: '#2a2a2a',
              border: '1px solid #444',
              borderRadius: '4px',
              color: '#e0e0e0',
              fontSize: '12px',
              cursor: 'pointer',
              textAlign: 'left',
            }}
          >
            Finite Well (n=4)
          </button>
        </div>
      </div>

      {/* Description */}
      <div
        style={{
          marginTop: '30px',
          padding: '15px',
          background: '#222',
          border: '1px solid #333',
          borderRadius: '6px',
          fontSize: '12px',
          lineHeight: '1.6',
        }}
      >
        <h3 style={{ fontSize: '13px', marginBottom: '8px', color: '#4dabf7' }}>
          {QUANTUM_SYSTEMS.find((s) => s.id === systemId)?.name}
        </h3>
        <p style={{ margin: 0, color: '#bbb' }}>
          {QUANTUM_SYSTEMS.find((s) => s.id === systemId)?.description}
        </p>
      </div>
    </div>
  );
};
