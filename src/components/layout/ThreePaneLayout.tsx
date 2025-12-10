import React from 'react';
import SidebarTools from '../builder/SidebarTools';
import CanvasArea from '../builder/CanvasArea';
import PropertiesPanel from '../builder/PropertiesPanel';
import type { useSimulationController } from '../../physics/useSimulationController';

interface ThreePaneLayoutProps {
  simulation: ReturnType<typeof useSimulationController>;
}

const ThreePaneLayout: React.FC<ThreePaneLayoutProps> = ({ simulation }) => {
  return (
    <div className="pc-builder-layout">
      <aside className="pc-sidebar">
        <SidebarTools />
      </aside>
      <main className="pc-canvas">
        <CanvasArea
          canvasRef={simulation.canvasRef}
          status={simulation.status}
          gravityEnabled={simulation.gravityEnabled}
          onStart={simulation.start}
          onPause={simulation.pause}
          onReset={simulation.reset}
          onStepFrame={simulation.stepFrame}
          onToggleGravity={simulation.toggleGravity}
          onAddBody={simulation.addBody}
        />
      </main>
      <aside className="pc-properties">
        <PropertiesPanel
          selectedProps={simulation.selectedProps}
          onChange={simulation.updateSelectedProperties}
          onApplyForce={simulation.applyForceToSelected}
        />
      </aside>
    </div>
  );
};

export default ThreePaneLayout;
