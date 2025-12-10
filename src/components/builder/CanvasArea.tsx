import React from 'react';
import SimulationControls from './SimulationControls';
import type { ToolType, SimulationStatus } from '../../physics/SimulationTypes';

interface CanvasAreaProps {
  canvasRef: React.RefObject<HTMLCanvasElement>;
  status: SimulationStatus;
  gravityEnabled: boolean;
  onStart: () => void;
  onPause: () => void;
  onReset: () => void;
  onStepFrame: () => void;
  onToggleGravity: () => void;
  onAddBody: (toolType: ToolType, x: number, y: number) => void;
  onSelectObjectAtPoint: (x: number, y: number) => void;
}

const CanvasArea: React.FC<CanvasAreaProps> = ({
  canvasRef,
  status,
  gravityEnabled,
  onStart,
  onPause,
  onReset,
  onStepFrame,
  onToggleGravity,
  onAddBody,
  onSelectObjectAtPoint,
}) => {
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
    onAddBody(toolType, x, y);
  };

  const handleCanvasClick: React.MouseEventHandler<HTMLCanvasElement> = (e) => {
    if (!canvasRef.current) return;
    
    const rect = canvasRef.current.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    
    onSelectObjectAtPoint(x, y);
  };

  return (
    <div className="pc-canvas-content">
      <h2 className="pc-canvas-title">Canvas</h2>
      <div 
        className="pc-canvas-workspace"
        onDragOver={handleDragOver}
        onDrop={handleDrop}
      >
        <canvas 
          ref={canvasRef} 
          width={900} 
          height={500} 
          className="pc-canvas-element"
          onClick={handleCanvasClick}
          style={{ cursor: 'pointer' }}
        />
      </div>
      <SimulationControls
        status={status}
        gravityEnabled={gravityEnabled}
        onStart={onStart}
        onPause={onPause}
        onReset={onReset}
        onStepFrame={onStepFrame}
        onToggleGravity={onToggleGravity}
      />
    </div>
  );
};

export default CanvasArea;
