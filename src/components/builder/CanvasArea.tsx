import React, { useState, useEffect, useRef } from 'react';
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
  onDeleteSelected: () => void;
}

interface ContextMenuState {
  visible: boolean;
  x: number;
  y: number;
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
  onDeleteSelected,
}) => {
  const [contextMenu, setContextMenu] = useState<ContextMenuState>({
    visible: false,
    x: 0,
    y: 0,
  });
  const contextMenuRef = useRef<HTMLDivElement>(null);

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
    setContextMenu({ visible: false, x: 0, y: 0 }); // Hide context menu on click
  };

  const handleContextMenu: React.MouseEventHandler<HTMLCanvasElement> = (e) => {
    e.preventDefault();
    
    if (!canvasRef.current) return;
    
    const rect = canvasRef.current.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    
    // Select the object at this point
    onSelectObjectAtPoint(x, y);
    
    // Show context menu at cursor position
    setContextMenu({
      visible: true,
      x: e.clientX,
      y: e.clientY,
    });
  };

  const handleDelete = () => {
    onDeleteSelected();
    setContextMenu({ visible: false, x: 0, y: 0 });
  };

  // Close context menu when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (contextMenuRef.current && !contextMenuRef.current.contains(event.target as Node)) {
        setContextMenu({ visible: false, x: 0, y: 0 });
      }
    };

    if (contextMenu.visible) {
      document.addEventListener('mousedown', handleClickOutside);
      return () => document.removeEventListener('mousedown', handleClickOutside);
    }
  }, [contextMenu.visible]);

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
          onContextMenu={handleContextMenu}
          style={{ cursor: 'pointer' }}
        />
        
        {/* Context Menu */}
        {contextMenu.visible && (
          <div
            ref={contextMenuRef}
            className="pc-context-menu"
            style={{
              position: 'fixed',
              left: `${contextMenu.x}px`,
              top: `${contextMenu.y}px`,
            }}
          >
            <button
              className="pc-context-menu-item"
              onClick={handleDelete}
            >
              🗑️ Delete
            </button>
          </div>
        )}
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
