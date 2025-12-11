import React, { useState } from 'react';
import Header from '../../components/layout/Header';
import { RotationalCanvas } from './RotationalCanvas';
import { RotationalTools } from './RotationalTools';
import { RotationalProperties } from './RotationalProperties';
import { useRotationalController } from './useRotationalController';
import type { RotatingObjectType } from './types';

export const RotationalPage: React.FC = () => {
  const controller = useRotationalController();
  const [currentTool, setCurrentTool] = useState<RotatingObjectType | null>(null);

  return (
    <>
      <Header labName="Rotational Dynamics Lab" />
      <div className="pc-builder-layout">
        <aside className="pc-sidebar">
          <RotationalTools
            state={controller.state}
            onTogglePause={controller.togglePause}
            onReset={controller.reset}
            onLoadPreset={controller.loadPreset}
            onSetFriction={controller.setFriction}
            currentTool={currentTool}
            onSelectTool={setCurrentTool}
          />
        </aside>
        <main className="pc-canvas">
          <RotationalCanvas
            state={controller.state}
            canvasRef={controller.canvasRef}
            onAddObject={controller.addObject}
            onSelectObject={controller.selectObject}
            selectedObjectId={controller.selectedObjectId}
            currentTool={currentTool}
          />
        </main>
        <aside className="pc-properties">
          <RotationalProperties
            state={controller.state}
            selectedObjectId={controller.selectedObjectId}
            onToggleDisplay={controller.toggleDisplay}
            onUpdateObjectOmega={controller.updateObjectOmega}
            onUpdateObjectTorque={controller.updateObjectTorque}
            onDeleteObject={controller.deleteObject}
          />
        </aside>
      </div>
    </>
  );
};
