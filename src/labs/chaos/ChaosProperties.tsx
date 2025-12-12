import React from 'react';
import type { ChaosState } from './types';
import { calculateDoublePendulumEnergy } from './physics/chaos';

interface ChaosPropertiesProps {
  state: ChaosState;
  onToggleDisplay: (
    key: keyof Pick<ChaosState, 'showTrails' | 'showGrid' | 'showEnergy' | 'show3DView'>
  ) => void;
  onSetSpeed: (speed: number) => void;
  onSetGravity: (gravity: number) => void;
  onSetSigma: (sigma: number) => void;
  onSetRho: (rho: number) => void;
  onSetBeta: (beta: number) => void;
  onSetTrailLength: (length: number) => void;
}

export const ChaosProperties: React.FC<ChaosPropertiesProps> = ({
  state,
  onToggleDisplay,
  onSetSpeed,
  onSetGravity,
  onSetSigma,
  onSetRho,
  onSetBeta,
  onSetTrailLength,
}) => {
  return (
    <div className="pc-properties">
      <h2 className="pc-properties-title">⚙️ Properties</h2>

      {/* Display Options */}
      <section className="pc-properties-section">
        <h3 className="pc-properties-section-title">👁️ Display</h3>
        <div className="pc-checkbox-group">
          <label className="pc-checkbox-label">
            <input
              type="checkbox"
              checked={state.showTrails}
              onChange={() => onToggleDisplay('showTrails')}
            />
            <span>Show Trails</span>
          </label>
          <label className="pc-checkbox-label">
            <input
              type="checkbox"
              checked={state.showGrid}
              onChange={() => onToggleDisplay('showGrid')}
            />
            <span>Show Grid</span>
          </label>
          <label className="pc-checkbox-label">
            <input
              type="checkbox"
              checked={state.showEnergy}
              onChange={() => onToggleDisplay('showEnergy')}
            />
            <span>Show Energy</span>
          </label>
          {state.systemType === 'lorenz-attractor' && (
            <label className="pc-checkbox-label">
              <input
                type="checkbox"
                checked={state.show3DView}
                onChange={() => onToggleDisplay('show3DView')}
              />
              <span>3D View</span>
            </label>
          )}
        </div>
      </section>

      {/* Simulation Parameters */}
      <section className="pc-properties-section">
        <h3 className="pc-properties-section-title">🎛️ Parameters</h3>

        <div className="pc-property-item">
          <label className="pc-property-label">
            Speed: {state.speed.toFixed(1)}x
          </label>
          <input
            type="range"
            min="0.1"
            max="3"
            step="0.1"
            value={state.speed}
            onChange={(e) => onSetSpeed(parseFloat(e.target.value))}
            className="pc-slider"
          />
        </div>

        <div className="pc-property-item">
          <label className="pc-property-label">
            Trail Length: {state.trailLength}
          </label>
          <input
            type="range"
            min="50"
            max="2000"
            step="50"
            value={state.trailLength}
            onChange={(e) => onSetTrailLength(parseInt(e.target.value))}
            className="pc-slider"
          />
        </div>

        {state.systemType === 'double-pendulum' && (
          <div className="pc-property-item">
            <label className="pc-property-label">
              Gravity: {state.gravity.toFixed(2)} m/s²
            </label>
            <input
              type="range"
              min="0"
              max="20"
              step="0.1"
              value={state.gravity}
              onChange={(e) => onSetGravity(parseFloat(e.target.value))}
              className="pc-slider"
            />
          </div>
        )}

        {state.systemType === 'lorenz-attractor' && (
          <>
            <div className="pc-property-item">
              <label className="pc-property-label">
                σ (Sigma): {state.sigma.toFixed(2)}
              </label>
              <input
                type="range"
                min="0"
                max="30"
                step="0.5"
                value={state.sigma}
                onChange={(e) => onSetSigma(parseFloat(e.target.value))}
                className="pc-slider"
              />
            </div>

            <div className="pc-property-item">
              <label className="pc-property-label">
                ρ (Rho): {state.rho.toFixed(2)}
              </label>
              <input
                type="range"
                min="0"
                max="50"
                step="0.5"
                value={state.rho}
                onChange={(e) => onSetRho(parseFloat(e.target.value))}
                className="pc-slider"
              />
            </div>

            <div className="pc-property-item">
              <label className="pc-property-label">
                β (Beta): {state.beta.toFixed(2)}
              </label>
              <input
                type="range"
                min="0"
                max="10"
                step="0.1"
                value={state.beta}
                onChange={(e) => onSetBeta(parseFloat(e.target.value))}
                className="pc-slider"
              />
            </div>
          </>
        )}
      </section>

      {/* System Info */}
      <section className="pc-properties-section">
        <h3 className="pc-properties-section-title">📊 System Info</h3>
        <div className="pc-info-grid">
          <div className="pc-info-item">
            <span className="pc-info-label">Time:</span>
            <span className="pc-info-value">{state.time.toFixed(2)} s</span>
          </div>

          {state.systemType === 'double-pendulum' && state.pendulums.length > 0 && (
            <>
              <div className="pc-info-item">
                <span className="pc-info-label">Pendulums:</span>
                <span className="pc-info-value">{state.pendulums.length}</span>
              </div>
              {state.showEnergy && state.pendulums[0] && (
                <>
                  {(() => {
                    const energy = calculateDoublePendulumEnergy(state.pendulums[0], state.gravity);
                    return (
                      <>
                        <div className="pc-info-item">
                          <span className="pc-info-label">Kinetic:</span>
                          <span className="pc-info-value">{energy.kinetic.toFixed(2)} J</span>
                        </div>
                        <div className="pc-info-item">
                          <span className="pc-info-label">Potential:</span>
                          <span className="pc-info-value">{energy.potential.toFixed(2)} J</span>
                        </div>
                        <div className="pc-info-item">
                          <span className="pc-info-label">Total:</span>
                          <span className="pc-info-value">{energy.total.toFixed(2)} J</span>
                        </div>
                      </>
                    );
                  })()}
                </>
              )}
            </>
          )}

          {state.systemType === 'lorenz-attractor' && (
            <div className="pc-info-item">
              <span className="pc-info-label">Trajectories:</span>
              <span className="pc-info-value">{state.lorenzPoints.length}</span>
            </div>
          )}
        </div>
      </section>

      {/* Chaos Metrics */}
      {state.comparisonMode && (
        <section className="pc-properties-section">
          <h3 className="pc-properties-section-title">🦋 Sensitivity</h3>
          <div className="pc-tools-info">
            <p>
              <strong>Butterfly Effect in Action:</strong> Watch how tiny differences in initial
              conditions lead to vastly different outcomes over time.
            </p>
            {state.systemType === 'double-pendulum' && state.pendulums.length >= 2 && (
              <p>
                Initial angle difference:{' '}
                <strong>
                  {Math.abs(state.pendulums[0].theta1 - state.pendulums[1].theta1).toFixed(6)} rad
                </strong>
              </p>
            )}
          </div>
        </section>
      )}
    </div>
  );
};
