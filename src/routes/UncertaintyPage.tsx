import React from 'react';
import Header from '../components/layout/Header';
import { useUncertaintyController } from '../labs/uncertainty/useUncertaintyController';
import { UncertaintyCanvas } from '../labs/uncertainty/UncertaintyCanvas';
import { UncertaintyTools } from '../labs/uncertainty/UncertaintyTools';
import { UncertaintyProperties } from '../labs/uncertainty/UncertaintyProperties';

export const UncertaintyPage: React.FC = () => {
  const controller = useUncertaintyController();

  return (
    <>
      <Header />
      <div className="pc-builder-layout">
        <aside className="pc-sidebar">
          <UncertaintyTools
            sigma={controller.state.sigma}
            x0={controller.state.x0}
            k0={controller.state.k0}
            onSigmaChange={controller.setSigma}
            onX0Change={controller.setX0}
            onK0Change={controller.setK0}
            onLoadPreset={controller.loadPreset}
          />
        </aside>
        
        <main className="pc-canvas">
          <div className="pc-canvas-workspace">
            <UncertaintyCanvas state={controller.state} />
          </div>
        </main>

        <aside className="pc-properties">
          <UncertaintyProperties
            state={controller.state}
            onToggleDisplay={controller.toggleDisplay}
          />
        </aside>
      </div>
    </>
  );
};
