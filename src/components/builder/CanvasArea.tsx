import React from 'react';
import { useSimulationController } from '../../physics/useSimulationController';
import SimulationControls from './SimulationControls';
import type { ToolType } from '../../physics/SimulationTypes';

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
    addBody,
  } = useSimulationController({
    width: 900,
    height: 500,
    gravityEnabled: true,
  });

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    e.dataTransfer.dropEffect = 'copy';
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    
    const toolType = e.dataTransfer.getData('toolType') as ToolType;
    if (!toolType || !canvasRef.current) return;

    // Get canvas position relative to viewport
    const rect = canvasRef.current.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;

    // Add the body at the drop position
    addBody(toolType, x, y);
  };

  return (
    <div className="pc-canvas-content">
      <h2 className="pc-canvas-title">Canvas</h2>
      <div 
        className="pc-canvas-workspace"
        onDragOver={handleDragOver}
        onDrop={handleDrop}
      >
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
