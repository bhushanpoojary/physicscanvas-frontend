import React from 'react';
import type { OscillationState } from './types';

interface OscillationPropertiesProps {
  state: OscillationState;
  selectedOscillatorId: string | null;
  onToggleDisplay: (key: keyof Pick<OscillationState, 'showVelocityVectors' | 'showForceVectors' | 'showTrails' | 'showGrid' | 'showPhaseSpace' | 'showEnergyPlot'>) => void;
  onUpdateOscillatorVelocity: (id: string, vx: number) => void;
  onUpdateSpringConstant: (id: string, k: number) => void;
}

export const OscillationProperties: React.FC<OscillationPropertiesProps> = ({
  state,
  selectedOscillatorId,
  onToggleDisplay,
  onUpdateOscillatorVelocity,
  onUpdateSpringConstant,
}) => {
  const selectedOscillator = selectedOscillatorId
    ? state.oscillators.find((o) => o.id === selectedOscillatorId)
    : null;

  return (
    <div className="pc-properties-content">
      <h2 className="pc-properties-title">Properties</h2>

      {/* Display Options */}
      <section className="pc-properties-section">
        <h3 className="pc-properties-section-title">👁️ Display</h3>
        
        <label className="pc-checkbox-label">
          <input
            type="checkbox"
            checked={state.showVelocityVectors}
            onChange={() => onToggleDisplay('showVelocityVectors')}
          />
          <span>Velocity Vectors</span>
        </label>

        <label className="pc-checkbox-label">
          <input
            type="checkbox"
            checked={state.showForceVectors}
            onChange={() => onToggleDisplay('showForceVectors')}
          />
          <span>Force Vectors</span>
        </label>

        <label className="pc-checkbox-label">
          <input
            type="checkbox"
            checked={state.showTrails}
            onChange={() => onToggleDisplay('showTrails')}
          />
          <span>Motion Trails</span>
        </label>

        <label className="pc-checkbox-label">
          <input
            type="checkbox"
            checked={state.showGrid}
            onChange={() => onToggleDisplay('showGrid')}
          />
          <span>Grid</span>
        </label>

        <label className="pc-checkbox-label">
          <input
            type="checkbox"
            checked={state.showPhaseSpace}
            onChange={() => onToggleDisplay('showPhaseSpace')}
          />
          <span>Phase Space Diagram</span>
        </label>

        <label className="pc-checkbox-label">
          <input
            type="checkbox"
            checked={state.showEnergyPlot}
            onChange={() => onToggleDisplay('showEnergyPlot')}
          />
          <span>Energy Plot</span>
        </label>
      </section>

      {/* Selected Oscillator Properties */}
      {selectedOscillator ? (
        <section className="pc-properties-section">
          <h3 className="pc-properties-section-title">
            🎯 Selected Oscillator
          </h3>
          
          <div className="pc-property-group">
            <div className="pc-property">
              <span className="pc-property-label">ID:</span>
              <span className="pc-property-value">{selectedOscillator.id}</span>
            </div>
            
            <div className="pc-property">
              <span className="pc-property-label">Mass:</span>
              <span className="pc-property-value">{selectedOscillator.mass.toFixed(2)} kg</span>
            </div>

            <div className="pc-property">
              <span className="pc-property-label">Position:</span>
              <span className="pc-property-value">{selectedOscillator.x.toFixed(1)} px</span>
            </div>

            <div className="pc-property">
              <span className="pc-property-label">Displacement:</span>
              <span className="pc-property-value">
                {(selectedOscillator.x - selectedOscillator.equilibriumX).toFixed(1)} px
              </span>
            </div>
          </div>

          <div className="pc-control-group">
            <label className="pc-label">
              Velocity: {selectedOscillator.vx.toFixed(1)} px/s
            </label>
            <input
              type="range"
              min="-100"
              max="100"
              step="1"
              value={selectedOscillator.vx}
              onChange={(e) =>
                onUpdateOscillatorVelocity(
                  selectedOscillator.id,
                  parseFloat(e.target.value)
                )
              }
              className="pc-slider"
            />
          </div>

          <p className="pc-properties-hint">
            💡 Drag the oscillator to change its position
          </p>
        </section>
      ) : (
        <section className="pc-properties-section">
          <p className="pc-properties-hint">
            Click an oscillator to view and edit its properties
          </p>
        </section>
      )}

      {/* Spring Properties */}
      <section className="pc-properties-section">
        <h3 className="pc-properties-section-title">🔩 Springs</h3>
        
        {state.springs.map((spring, index) => {
          const osc1 = spring.oscillator1Id
            ? state.oscillators.find((o) => o.id === spring.oscillator1Id)
            : null;
          const osc2 = state.oscillators.find((o) => o.id === spring.oscillator2Id);

          const springName = osc1
            ? `${osc1.id} ↔ ${osc2?.id || '?'}`
            : `Wall ↔ ${osc2?.id || '?'}`;

          return (
            <div key={spring.id} className="pc-spring-config">
              <h4 className="pc-spring-name">{springName}</h4>
              
              <div className="pc-property">
                <span className="pc-property-label">Natural Length:</span>
                <span className="pc-property-value">{spring.naturalLength.toFixed(0)} px</span>
              </div>

              <div className="pc-control-group">
                <label className="pc-label">
                  Spring Constant (k): {spring.k.toFixed(1)} N/m
                </label>
                <input
                  type="range"
                  min="10"
                  max="100"
                  step="5"
                  value={spring.k}
                  onChange={(e) =>
                    onUpdateSpringConstant(spring.id, parseFloat(e.target.value))
                  }
                  className="pc-slider"
                />
              </div>
            </div>
          );
        })}
      </section>

      {/* Theory Section */}
      <section className="pc-properties-section">
        <h3 className="pc-properties-section-title">📚 Theory</h3>
        
        <div className="pc-theory">
          <h4>Hooke's Law</h4>
          <p className="pc-equation">F = -kx</p>
          <p className="pc-theory-text">
            The restoring force is proportional to displacement
          </p>

          <h4>Natural Frequency</h4>
          <p className="pc-equation">ω₀ = √(k/m)</p>
          <p className="pc-theory-text">
            For a simple harmonic oscillator
          </p>

          {state.oscillatorType !== 'single' && (
            <>
              <h4>Normal Modes</h4>
              <p className="pc-theory-text">
                Coupled oscillators have characteristic frequencies where all masses 
                oscillate with the same frequency and fixed phase relationships
              </p>
            </>
          )}

          {state.dampingType !== 'none' && (
            <>
              <h4>Damped Motion</h4>
              <p className="pc-equation">F_d = -bv</p>
              <p className="pc-theory-text">
                Damping force opposes motion, causing amplitude decay
              </p>
            </>
          )}

          {state.hasDrivingForce && (
            <>
              <h4>Resonance</h4>
              <p className="pc-theory-text">
                When driving frequency matches natural frequency, amplitude increases 
                dramatically. This is resonance.
              </p>
            </>
          )}
        </div>
      </section>

      {/* System Information */}
      <section className="pc-properties-section">
        <h3 className="pc-properties-section-title">ℹ️ System Info</h3>
        
        <div className="pc-property-group">
          <div className="pc-property">
            <span className="pc-property-label">Oscillators:</span>
            <span className="pc-property-value">{state.oscillators.length}</span>
          </div>

          <div className="pc-property">
            <span className="pc-property-label">Springs:</span>
            <span className="pc-property-value">{state.springs.length}</span>
          </div>

          <div className="pc-property">
            <span className="pc-property-label">Type:</span>
            <span className="pc-property-value">
              {state.oscillatorType === 'single' 
                ? 'Single Oscillator' 
                : state.oscillatorType === 'coupled-two'
                ? 'Two Coupled'
                : 'Three Coupled'}
            </span>
          </div>

          <div className="pc-property">
            <span className="pc-property-label">Damping:</span>
            <span className="pc-property-value">
              {state.dampingType.charAt(0).toUpperCase() + state.dampingType.slice(1)}
            </span>
          </div>

          {state.hasDrivingForce && (
            <div className="pc-property">
              <span className="pc-property-label">Driven:</span>
              <span className="pc-property-value">Yes</span>
            </div>
          )}
        </div>
      </section>
    </div>
  );
};
