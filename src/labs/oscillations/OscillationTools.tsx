import React from 'react';
import type { OscillationState, OscillatorType, CouplingType, DampingType } from './types';
import { OSCILLATION_PRESETS } from './types';

interface OscillationToolsProps {
  state: OscillationState;
  onTogglePause: () => void;
  onReset: () => void;
  onSetOscillatorType: (type: OscillatorType) => void;
  onSetCouplingType: (type: CouplingType) => void;
  onSetDampingType: (type: DampingType) => void;
  onLoadPreset: (presetId: string) => void;
  onToggleDrivingForce: () => void;
  onSetDrivingAmplitude: (amplitude: number) => void;
  onSetDrivingFrequency: (frequency: number) => void;
}

export const OscillationTools: React.FC<OscillationToolsProps> = ({
  state,
  onTogglePause,
  onReset,
  onSetOscillatorType,
  onSetCouplingType,
  onSetDampingType,
  onLoadPreset,
  onToggleDrivingForce,
  onSetDrivingAmplitude,
  onSetDrivingFrequency,
}) => {
  return (
    <div className="pc-sidebar-content">
      <h2 
        className="pc-sidebar-title" 
        style={{
          fontSize: '1.35rem',
          color: '#fff',
          fontWeight: 700,
          background: 'linear-gradient(135deg, #ffffff 0%, #d4d9e8 100%)',
          WebkitBackgroundClip: 'text',
          WebkitTextFillColor: 'transparent',
          marginBottom: '1.5rem',
          letterSpacing: '-0.5px'
        }}
      >
        Oscillation Controls
      </h2>

      {/* Simulation Controls */}
      <section className="pc-sidebar-section">
        <h3 className="pc-sidebar-section-title">⚙️ Simulation</h3>
        <div className="pc-button-row">
          <button
            className={`pc-button pc-button-primary ${!state.isPaused ? 'pc-button-active' : ''}`}
            onClick={onTogglePause}
            style={{ flex: 1 }}
          >
            {state.isPaused ? '▶️ Play' : '⏸️ Pause'}
          </button>
          <button
            className="pc-button pc-button-secondary"
            onClick={onReset}
            style={{ flex: 1 }}
          >
            🔄 Reset
          </button>
        </div>
      </section>

      {/* Presets */}
      <section className="pc-sidebar-section">
        <h3 className="pc-sidebar-section-title">📋 Presets</h3>
        <select
          className="pc-select"
          onChange={(e) => onLoadPreset(e.target.value)}
          defaultValue=""
        >
          <option value="" disabled>
            Select a preset...
          </option>
          {OSCILLATION_PRESETS.map((preset) => (
            <option key={preset.id} value={preset.id}>
              {preset.name}
            </option>
          ))}
        </select>
        <p className="pc-sidebar-hint">
          {OSCILLATION_PRESETS.find(p => {
            // Find current preset based on state
            return p.oscillators.length === state.oscillators.length;
          })?.description || 'Choose a preset to get started'}
        </p>
      </section>

      {/* System Type */}
      <section className="pc-sidebar-section">
        <h3 className="pc-sidebar-section-title">🔧 System Type</h3>
        <div className="pc-button-group">
          <button
            className={`pc-button ${state.oscillatorType === 'single' ? 'pc-button-active' : ''}`}
            onClick={() => onSetOscillatorType('single')}
            title="Single oscillator"
          >
            Single
          </button>
          <button
            className={`pc-button ${state.oscillatorType === 'coupled-two' ? 'pc-button-active' : ''}`}
            onClick={() => onSetOscillatorType('coupled-two')}
            title="Two coupled oscillators"
          >
            Coupled (2)
          </button>
          <button
            className={`pc-button ${state.oscillatorType === 'coupled-three' ? 'pc-button-active' : ''}`}
            onClick={() => onSetOscillatorType('coupled-three')}
            title="Three coupled oscillators"
          >
            Coupled (3)
          </button>
        </div>
      </section>

      {/* Coupling Strength */}
      {state.oscillatorType !== 'single' && (
        <section className="pc-sidebar-section">
          <h3 className="pc-sidebar-section-title">🔗 Coupling Strength</h3>
          <div className="pc-button-group">
            <button
              className={`pc-button ${state.couplingType === 'weak' ? 'pc-button-active' : ''}`}
              onClick={() => onSetCouplingType('weak')}
            >
              Weak
            </button>
            <button
              className={`pc-button ${state.couplingType === 'spring' ? 'pc-button-active' : ''}`}
              onClick={() => onSetCouplingType('spring')}
            >
              Normal
            </button>
            <button
              className={`pc-button ${state.couplingType === 'strong' ? 'pc-button-active' : ''}`}
              onClick={() => onSetCouplingType('strong')}
            >
              Strong
            </button>
          </div>
        </section>
      )}

      {/* Damping */}
      <section className="pc-sidebar-section">
        <h3 className="pc-sidebar-section-title">💨 Damping</h3>
        <div className="pc-button-group">
          <button
            className={`pc-button ${state.dampingType === 'none' ? 'pc-button-active' : ''}`}
            onClick={() => onSetDampingType('none')}
          >
            None
          </button>
          <button
            className={`pc-button ${state.dampingType === 'light' ? 'pc-button-active' : ''}`}
            onClick={() => onSetDampingType('light')}
          >
            Light
          </button>
          <button
            className={`pc-button ${state.dampingType === 'critical' ? 'pc-button-active' : ''}`}
            onClick={() => onSetDampingType('critical')}
          >
            Critical
          </button>
          <button
            className={`pc-button ${state.dampingType === 'heavy' ? 'pc-button-active' : ''}`}
            onClick={() => onSetDampingType('heavy')}
          >
            Heavy
          </button>
        </div>
      </section>

      {/* Driving Force (Resonance) */}
      <section className="pc-sidebar-section">
        <h3 className="pc-sidebar-section-title">🎵 Driving Force</h3>
        <label className="pc-checkbox-label">
          <input
            type="checkbox"
            checked={state.hasDrivingForce}
            onChange={onToggleDrivingForce}
          />
          <span>Enable Driving Force</span>
        </label>
        
        {state.hasDrivingForce && (
          <>
            <div className="pc-control-group">
              <label className="pc-label">
                Amplitude: {state.drivingAmplitude.toFixed(1)}
              </label>
              <input
                type="range"
                min="0"
                max="50"
                step="1"
                value={state.drivingAmplitude}
                onChange={(e) => onSetDrivingAmplitude(parseFloat(e.target.value))}
                className="pc-slider"
              />
            </div>

            <div className="pc-control-group">
              <label className="pc-label">
                Frequency: {state.drivingFrequency.toFixed(2)} Hz
              </label>
              <input
                type="range"
                min="0.1"
                max="5"
                step="0.1"
                value={state.drivingFrequency}
                onChange={(e) => onSetDrivingFrequency(parseFloat(e.target.value))}
                className="pc-slider"
              />
            </div>
            
            <p className="pc-sidebar-hint">
              💡 Adjust frequency near natural frequency to observe resonance
            </p>
          </>
        )}
      </section>

      {/* Metrics */}
      <section className="pc-sidebar-section">
        <h3 className="pc-sidebar-section-title">📊 System Metrics</h3>
        <div className="pc-metrics">
          <div className="pc-metric">
            <span className="pc-metric-label">Time:</span>
            <span className="pc-metric-value">{state.time.toFixed(2)} s</span>
          </div>
          <div className="pc-metric">
            <span className="pc-metric-label">Frequency:</span>
            <span className="pc-metric-value">{state.frequency.toFixed(3)} Hz</span>
          </div>
          <div className="pc-metric">
            <span className="pc-metric-label">Period:</span>
            <span className="pc-metric-value">{state.period.toFixed(3)} s</span>
          </div>
          <div className="pc-metric">
            <span className="pc-metric-label">Amplitude:</span>
            <span className="pc-metric-value">{state.amplitude.toFixed(1)} px</span>
          </div>
        </div>
      </section>

      {/* Energy Conservation */}
      <section className="pc-sidebar-section">
        <h3 className="pc-sidebar-section-title">⚡ Energy</h3>
        <div className="pc-metrics">
          <div className="pc-metric">
            <span className="pc-metric-label">Kinetic:</span>
            <span className="pc-metric-value" style={{ color: '#4dabf7' }}>
              {state.kineticEnergy.toFixed(2)} J
            </span>
          </div>
          <div className="pc-metric">
            <span className="pc-metric-label">Potential:</span>
            <span className="pc-metric-value" style={{ color: '#ffa500' }}>
              {state.potentialEnergy.toFixed(2)} J
            </span>
          </div>
          <div className="pc-metric">
            <span className="pc-metric-label">Total:</span>
            <span className="pc-metric-value" style={{ color: '#2ecc71' }}>
              {state.totalEnergy.toFixed(2)} J
            </span>
          </div>
        </div>
      </section>
    </div>
  );
};
