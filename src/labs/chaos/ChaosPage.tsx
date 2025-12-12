import React from 'react';
import Header from '../../components/layout/Header';
import { ChaosCanvas } from './ChaosCanvas';
import { ChaosTools } from './ChaosTools';
import { ChaosProperties } from './ChaosProperties';
import { useChaosController } from './useChaosController';

export const ChaosPage: React.FC = () => {
  const controller = useChaosController();

  return (
    <>
      <Header labName="Chaos Theory Lab" />
      <div className="pc-builder-layout">
        <aside className="pc-sidebar">
          <ChaosTools
            state={controller.state}
            onTogglePause={controller.togglePause}
            onReset={controller.reset}
            onLoadPreset={controller.loadPreset}
            onAddPendulum={controller.addPendulum}
            onAddLorenzPoint={controller.addLorenzPoint}
          />
        </aside>
        <main className="pc-canvas">
          <ChaosCanvas
            state={controller.state}
            canvasRef={controller.canvasRef}
            selectedItemId={controller.selectedItemId}
            onSelectItem={controller.selectItem}
          />
        </main>
        <aside className="pc-properties">
          <ChaosProperties
            state={controller.state}
            onToggleDisplay={controller.toggleDisplay}
            onSetSpeed={controller.setSpeed}
            onSetGravity={controller.setGravity}
            onSetSigma={controller.setSigma}
            onSetRho={controller.setRho}
            onSetBeta={controller.setBeta}
            onSetTrailLength={controller.setTrailLength}
          />
        </aside>
      </div>
    </>
  );
};
