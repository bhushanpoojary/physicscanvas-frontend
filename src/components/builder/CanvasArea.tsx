import React from 'react';
import { useSimulationController } from '../../physics/useSimulationController';
import SimulationControls from './SimulationControls';

const CanvasArea: React.FC = () => {
  const {
    canvasRef,
    status,
    gravityEnabled,
    start,
    pause,
    reset,
    stepFrame,
    toggleGravity,
  } = useSimulationController({
    width: 900,
    height: 500,
    gravityEnabled: true,
  });

  return (
    <div className="pc-canvas-content">
      <h2 className="pc-canvas-title">Canvas</h2>
      <div className="pc-canvas-workspace">
        <canvas ref={canvasRef} width={900} height={500} className="pc-canvas-element" />
      </div>
      <SimulationControls
        status={status}
        gravityEnabled={gravityEnabled}
        onStart={start}
        onPause={pause}
        onReset={reset}
        onStepFrame={stepFrame}
        onToggleGravity={toggleGravity}
      />
    </div>
  );
};

export default CanvasArea;
