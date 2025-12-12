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
    <div style={{ padding: '1.75rem 1.5rem', color: '#d4d9e8' }}>
      <h2 style={{ fontSize: '1.35rem', marginBottom: '1.75rem', color: '#fff', fontWeight: 700, background: 'linear-gradient(135deg, #ffffff 0%, #d4d9e8 100%)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent', letterSpacing: '-0.3px' }}>
        Quantum Systems
      </h2>

      {/* System Selector */}
      <div style={{ marginBottom: '1.5rem' }}>
        <label
          style={{
            display: 'block',
            marginBottom: '0.75rem',
            fontSize: '0.9rem',
            fontWeight: 700,
            color: '#d4d9e8',
            letterSpacing: '-0.2px',
          }}
        >
          Quantum System
        </label>
        <select
          value={systemId}
          onChange={(e) => onSystemChange(e.target.value as QuantumSystemId)}
          style={{
            width: '100%',
            padding: '0.75rem 1rem',
            background: 'linear-gradient(135deg, rgba(255, 255, 255, 0.08) 0%, rgba(255, 255, 255, 0.03) 100%)',
            border: '1px solid rgba(255, 255, 255, 0.12)',
            borderRadius: '10px',
            color: '#ffffff',
            fontSize: '0.9rem',
            fontWeight: 600,
            cursor: 'pointer',
            transition: 'all 0.2s ease',
            backdropFilter: 'blur(10px)',
            fontFamily: 'inherit',
          }}
        >
          {QUANTUM_SYSTEMS.map((system) => (
            <option key={system.id} value={system.id} style={{ background: '#1a1f2e', color: '#ffffff' }}>
              {system.name}
            </option>
          ))}
        </select>
      </div>

      {/* Energy Level Slider */}
      <div style={{ marginBottom: '1.75rem' }}>
        <label
          style={{
            display: 'block',
            marginBottom: '0.75rem',
            fontSize: '0.9rem',
            fontWeight: 700,
            color: '#d4d9e8',
            letterSpacing: '-0.2px',
          }}
        >
          Energy Level: <strong style={{ color: '#667eea' }}>n = {energyLevel}</strong>
        </label>
        <input
          type="range"
          min="1"
          max={maxLevels}
          value={energyLevel}
          onChange={(e) => onEnergyChange(parseInt(e.target.value))}
          style={{
            width: '100%',
            accentColor: '#667eea',
            height: '8px',
            borderRadius: '4px',
            background: 'linear-gradient(to right, rgba(102, 126, 234, 0.3), rgba(118, 75, 162, 0.3))',
            cursor: 'pointer',
          }}
        />
        <div
          style={{
            display: 'flex',
            justifyContent: 'space-between',
            fontSize: '0.85rem',
            color: '#8b95b2',
            marginTop: '0.5rem',
          }}
        >
          <span>1</span>
          <span>{maxLevels}</span>
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
          Quick Presets
        </label>
        <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
          {[
            { id: 'groundState', name: 'Ground State (n=1)' },
            { id: 'firstExcited', name: 'First Excited (n=2)' },
            { id: 'harmonicN3', name: 'Harmonic Oscillator (n=3)' },
            { id: 'tunneling', name: 'Barrier Tunneling' },
            { id: 'finiteN4', name: 'Finite Well (n=4)' },
          ].map(preset => (
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
                fontWeight: 600,
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
              {preset.name}
            </button>
          ))}
        </div>
      </div>

      {/* Description */}
      <div
        style={{
          marginTop: '1.75rem',
          padding: '1.25rem',
          background: 'linear-gradient(135deg, rgba(255, 255, 255, 0.05) 0%, rgba(255, 255, 255, 0.02) 100%)',
          border: '1px solid rgba(255, 255, 255, 0.08)',
          borderRadius: '12px',
          fontSize: '0.9rem',
          lineHeight: '1.8',
          backdropFilter: 'blur(10px)',
          boxShadow: '0 4px 12px rgba(0, 0, 0, 0.1)',
        }}
      >
        <h3 style={{ fontSize: '0.95rem', marginBottom: '0.75rem', color: '#667eea', fontWeight: 700, letterSpacing: '-0.2px' }}>
          ⚛️ {QUANTUM_SYSTEMS.find((s) => s.id === systemId)?.name}
        </h3>
        <p style={{ margin: 0, color: '#8b95b2' }}>
          {QUANTUM_SYSTEMS.find((s) => s.id === systemId)?.description}
        </p>
      </div>
    </div>
  );
};
