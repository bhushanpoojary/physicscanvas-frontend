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
  onMoveSelected: (x: number, y: number) => void;
}

interface ContextMenuState {
  visible: boolean;
  x: number;
  y: number;
}

interface DragState {
  isDragging: boolean;
  objectId: string | null;
  startX: number;
  startY: number;
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
  onMoveSelected,
}) => {
  const [contextMenu, setContextMenu] = useState<ContextMenuState>({
    visible: false,
    x: 0,
    y: 0,
  });
  const contextMenuRef = useRef<HTMLDivElement>(null);
  
  const [dragState, setDragState] = useState<DragState>({
    isDragging: false,
    objectId: null,
    startX: 0,
    startY: 0,
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
    onAddBody(toolType, x, y);
  };

  const handleMouseDown: React.MouseEventHandler<HTMLCanvasElement> = (e) => {
    if (e.button !== 0) return; // Only handle left click
    if (!canvasRef.current) return;
    
    const rect = canvasRef.current.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    
    onSelectObjectAtPoint(x, y);
    setContextMenu({ visible: false, x: 0, y: 0 }); // Hide context menu on click
    
    // Start drag state
    setDragState({
      isDragging: true,
      objectId: null, // Will be set if an object is selected
      startX: x,
      startY: y,
    });
  };

  const handleMouseMove: React.MouseEventHandler<HTMLCanvasElement> = (e) => {
    if (!dragState.isDragging || !canvasRef.current) return;
    
    const rect = canvasRef.current.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    
    // Move the selected object
    onMoveSelected(x, y);
  };

  const handleMouseUp: React.MouseEventHandler<HTMLCanvasElement> = () => {
    setDragState({
      isDragging: false,
      objectId: null,
      startX: 0,
      startY: 0,
    });
  };

  const handleCanvasClick: React.MouseEventHandler<HTMLCanvasElement> = (e) => {
    // Click is handled by mouseDown for drag functionality
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
          onMouseDown={handleMouseDown}
          onMouseMove={handleMouseMove}
          onMouseUp={handleMouseUp}
          onMouseLeave={handleMouseUp}
          onContextMenu={handleContextMenu}
          style={{ cursor: dragState.isDragging ? 'grabbing' : 'grab' }}
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
