import React from 'react';
import Header from '../components/layout/Header';
import { useQuantumController } from '../labs/quantum-wave/useQuantumController';
import { WaveFunctionCanvas } from '../labs/quantum-wave/WaveFunctionCanvas';
import { QuantumTools } from '../labs/quantum-wave/QuantumTools';
import { QuantumProperties } from '../labs/quantum-wave/QuantumProperties';

export const QuantumWavePage: React.FC = () => {
  const controller = useQuantumController();

  return (
    <>
      <Header />
      <div className="pc-builder-layout">
        <aside className="pc-sidebar">
          <QuantumTools
            systemId={controller.state.system.id}
            energyLevel={controller.state.energyLevel}
            maxLevels={controller.state.system.maxLevels}
            onSystemChange={controller.setSystemId}
            onEnergyChange={controller.setEnergyLevel}
            onLoadPreset={controller.loadPreset}
          />
        </aside>
        
        <main className="pc-canvas">
          <div className="pc-canvas-workspace">
            <WaveFunctionCanvas state={controller.state} />
          </div>
        </main>

        <aside className="pc-properties">
          <QuantumProperties
            state={controller.state}
            onToggleDisplay={controller.toggleDisplay}
            onParameterChange={controller.setParameters}
          />
        </aside>
      </div>
    </>
  );
};
