import React from 'react';
import type { ObserverProperties, EventProperties, RelativityObjectId } from './types';
import { formatVelocity } from './math/lorentz';

interface RelativityPropertiesProps {
  selectedType: 'observer' | 'event' | 'light-pulse' | null;
  observerProperties: ObserverProperties | null;
  eventProperties: EventProperties | null;
  onUpdateObserverVelocity?: (id: RelativityObjectId, velocity: number) => void;
  onUpdateEventCoordinates?: (id: RelativityObjectId, t: number, x: number) => void;
  onDeleteSelected?: () => void;
}

const RelativityProperties: React.FC<RelativityPropertiesProps> = ({
  selectedType,
  observerProperties,
  eventProperties,
  onUpdateObserverVelocity,
  onUpdateEventCoordinates,
  onDeleteSelected,
}) => {
  if (!selectedType) {
    return (
      <div className="pc-properties-content">
        <h2 className="pc-properties-title">Object Properties</h2>
        <p className="pc-properties-subtitle">
          Select an observer, event, or light pulse to view and edit its properties.
        </p>
      </div>
    );
  }

  if (selectedType === 'observer' && observerProperties) {
    return (
      <div className="pc-properties-content">
        <h2 className="pc-properties-title">Observer Properties</h2>
        <p className="pc-property-object-name">{observerProperties.label}</p>

        <div className="pc-property-control">
          <label className="pc-property-label">
            <span>Velocity (β)</span>
            <span className="pc-property-value">{formatVelocity(observerProperties.velocity)}</span>
          </label>
          <input
            type="range"
            min="-0.99"
            max="0.99"
            step="0.01"
            value={observerProperties.velocity}
            onChange={(e) => onUpdateObserverVelocity?.(observerProperties.id, parseFloat(e.target.value))}
            className="pc-property-slider"
          />
        </div>

        <div style={{ marginTop: '1.5rem', padding: '1rem', backgroundColor: '#f8f9fa', borderRadius: '6px' }}>
          <h4 style={{ margin: '0 0 0.75rem 0', fontSize: '0.9rem' }}>Relativistic Effects</h4>
          
          <div style={{ marginBottom: '0.5rem' }}>
            <strong>Lorentz Factor (γ):</strong>
            <div style={{ fontSize: '1.5rem', color: '#4a90e2', fontWeight: 'bold' }}>
              {observerProperties.gamma.toFixed(3)}
            </div>
          </div>

          <div style={{ marginBottom: '0.5rem' }}>
            <strong>Time Dilation:</strong>
            <div style={{ color: '#666', fontFamily: 'monospace' }}>
              {observerProperties.timeDilation}
            </div>
          </div>

          <div>
            <strong>Length Contraction:</strong>
            <div style={{ color: '#666', fontFamily: 'monospace' }}>
              {observerProperties.lengthContraction}
            </div>
          </div>
        </div>

        <button
          onClick={onDeleteSelected}
          className="pc-btn pc-btn-secondary"
          style={{ width: '100%', marginTop: '1.5rem' }}
        >
          🗑️ Delete Observer
        </button>
      </div>
    );
  }

  if (selectedType === 'event' && eventProperties) {
    return (
      <div className="pc-properties-content">
        <h2 className="pc-properties-title">Event Properties</h2>
        <p className="pc-property-object-name">{eventProperties.label}</p>

        <div style={{ marginBottom: '1.5rem' }}>
          <h4 style={{ margin: '0 0 0.75rem 0', fontSize: '0.9rem' }}>Lab Frame Coordinates</h4>
          
          <div className="pc-property-control">
            <label className="pc-property-label">
              <span>Time (t)</span>
              <span className="pc-property-value">{eventProperties.t.toFixed(2)}</span>
            </label>
            <input
              type="range"
              min="0"
              max="12"
              step="0.1"
              value={eventProperties.t}
              onChange={(e) => onUpdateEventCoordinates?.(eventProperties.id, parseFloat(e.target.value), eventProperties.x)}
              className="pc-property-slider"
            />
          </div>

          <div className="pc-property-control">
            <label className="pc-property-label">
              <span>Position (x)</span>
              <span className="pc-property-value">{eventProperties.x.toFixed(2)}</span>
            </label>
            <input
              type="range"
              min="-10"
              max="10"
              step="0.1"
              value={eventProperties.x}
              onChange={(e) => onUpdateEventCoordinates?.(eventProperties.id, eventProperties.t, parseFloat(e.target.value))}
              className="pc-property-slider"
            />
          </div>
        </div>

        {eventProperties.tPrime !== undefined && eventProperties.xPrime !== undefined && (
          <div style={{ padding: '1rem', backgroundColor: '#f0f7ff', borderRadius: '6px' }}>
            <h4 style={{ margin: '0 0 0.75rem 0', fontSize: '0.9rem' }}>
              {eventProperties.observerFrame} Frame
            </h4>
            <div style={{ fontFamily: 'monospace', fontSize: '0.9rem' }}>
              <div>t' = {eventProperties.tPrime.toFixed(2)}</div>
              <div>x' = {eventProperties.xPrime.toFixed(2)}</div>
            </div>
          </div>
        )}

        <button
          onClick={onDeleteSelected}
          className="pc-btn pc-btn-secondary"
          style={{ width: '100%', marginTop: '1.5rem' }}
        >
          🗑️ Delete Event
        </button>
      </div>
    );
  }

  return (
    <div className="pc-properties-content">
      <h2 className="pc-properties-title">Light Pulse</h2>
      <p className="pc-properties-subtitle">
        Light pulses travel at 45° in spacetime diagrams (c = 1).
      </p>
      <button
        onClick={onDeleteSelected}
        className="pc-btn pc-btn-secondary"
        style={{ width: '100%', marginTop: '1rem' }}
      >
        🗑️ Delete Light Pulse
      </button>
    </div>
  );
};

export default RelativityProperties;
