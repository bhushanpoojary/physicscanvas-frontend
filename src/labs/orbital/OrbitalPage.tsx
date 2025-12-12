import React from 'react';
import Header from '../../components/layout/Header';
import { OrbitalCanvas } from './OrbitalCanvas';
import { OrbitalTools } from './OrbitalTools';
import { OrbitalProperties } from './OrbitalProperties';
import { useOrbitalController } from './useOrbitalController';

export const OrbitalPage: React.FC = () => {
  const controller = useOrbitalController();

  return (
    <>
      <Header labName="Orbital Mechanics Lab" />
      <div className="pc-builder-layout">
        <aside className="pc-sidebar">
          <OrbitalTools
            state={controller.state}
            onTogglePause={controller.togglePause}
            onReset={controller.reset}
            onLoadPreset={controller.loadPreset}
          />
        </aside>
        <main className="pc-canvas">
          <OrbitalCanvas
            state={controller.state}
            canvasRef={controller.canvasRef}
            onSelectObject={controller.selectObject}
          />
        </main>
        <aside className="pc-properties">
          <OrbitalProperties
            state={controller.state}
            onToggleDisplay={controller.toggleDisplay}
            onSetSpeed={controller.setSpeed}
            onSetTrailLength={controller.setTrailLength}
          />
        </aside>
      </div>
    </>
  );
};
