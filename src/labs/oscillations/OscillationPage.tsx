import React from 'react';
import Header from '../../components/layout/Header';
import { OscillationCanvas } from './OscillationCanvas';
import { OscillationTools } from './OscillationTools';
import { OscillationProperties } from './OscillationProperties';
import { useOscillationController } from './useOscillationController';

export const OscillationPage: React.FC = () => {
  const controller = useOscillationController();

  return (
    <>
      <Header labName="Oscillations Lab" />
      <div className="pc-builder-layout">
        <aside className="pc-sidebar">
          <OscillationTools
            state={controller.state}
            onTogglePause={controller.togglePause}
            onReset={controller.reset}
            onSetOscillatorType={controller.setOscillatorType}
            onSetCouplingType={controller.setCouplingType}
            onSetDampingType={controller.setDampingType}
            onLoadPreset={controller.loadPreset}
            onToggleDrivingForce={controller.toggleDrivingForce}
            onSetDrivingAmplitude={controller.setDrivingAmplitude}
            onSetDrivingFrequency={controller.setDrivingFrequency}
          />
        </aside>
        <main className="pc-canvas">
          <OscillationCanvas
            state={controller.state}
            canvasRef={controller.canvasRef}
            selectedOscillatorId={controller.selectedOscillatorId}
            onSelectOscillator={controller.selectOscillator}
            onUpdateOscillatorPosition={controller.updateOscillatorPosition}
          />
        </main>
        <aside className="pc-properties">
          <OscillationProperties
            state={controller.state}
            selectedOscillatorId={controller.selectedOscillatorId}
            onToggleDisplay={controller.toggleDisplay}
            onUpdateOscillatorVelocity={controller.updateOscillatorVelocity}
            onUpdateSpringConstant={controller.updateSpringConstant}
          />
        </aside>
      </div>
    </>
  );
};
