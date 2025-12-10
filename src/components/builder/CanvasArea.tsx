import React, { useState, useEffect, useRef } from 'react';
import SimulationControls from './SimulationControls';
import type { ToolType, SimulationStatus, ScenePresetId } from '../../physics/SimulationTypes';
import { getCurrentDraggingTool } from './SidebarTools';

interface CanvasAreaProps {
  canvasRef: React.RefObject<HTMLCanvasElement>;
  status: SimulationStatus;
  gravityEnabled: boolean;
  currentPreset: ScenePresetId;
  onStart: () => void;
  onPause: () => void;
  onReset: () => void;
  onStepFrame: () => void;
  onToggleGravity: () => void;
  onAddBody: (toolType: ToolType, x: number, y: number) => void;
  onSelectObjectAtPoint: (x: number, y: number) => void;
  onDeleteSelected: () => void;
  onMoveSelected: (x: number, y: number) => void;
  onLoadPreset: (preset: ScenePresetId) => void;
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

interface DragOverState {
  isActive: boolean;
  toolType: ToolType | null;
  x: number;
  y: number;
}

const CanvasArea: React.FC<CanvasAreaProps> = ({
  canvasRef,
  status,
  gravityEnabled,
  currentPreset,
  onStart,
  onPause,
  onReset,
  onStepFrame,
  onToggleGravity,
  onAddBody,
  onSelectObjectAtPoint,
  onDeleteSelected,
  onMoveSelected,
  onLoadPreset,
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

  const [dragOverState, setDragOverState] = useState<DragOverState>({
    isActive: false,
    toolType: null,
    x: 0,
    y: 0,
  });

  const dragOverlayRef = useRef<HTMLCanvasElement>(null);

  // Draw drag preview overlay
  useEffect(() => {
    if (!dragOverState.isActive || !dragOverlayRef.current || !dragOverState.toolType) return;

    const canvas = dragOverlayRef.current;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    // Clear canvas
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    // Draw preview shape at cursor position
    ctx.save();
    ctx.globalAlpha = 0.4;
    ctx.translate(dragOverState.x, dragOverState.y);

    switch (dragOverState.toolType) {
      case 'block':
        ctx.fillStyle = '#4a90e2';
        ctx.fillRect(-40, -40, 80, 80);
        ctx.strokeStyle = '#2c5aa0';
        ctx.lineWidth = 2;
        ctx.strokeRect(-40, -40, 80, 80);
        break;
      case 'spring':
        ctx.fillStyle = '#e74c3c';
        ctx.fillRect(-50, -20, 40, 40);
        ctx.fillRect(10, -20, 40, 40);
        break;
      case 'inclined-plane':
        ctx.fillStyle = '#95a5a6';
        ctx.beginPath();
        ctx.moveTo(-100, 10);
        ctx.lineTo(100, 10);
        ctx.lineTo(100, -10);
        ctx.closePath();
        ctx.fill();
        break;
      case 'pendulum':
        ctx.strokeStyle = '#34495e';
        ctx.lineWidth = 2;
        ctx.beginPath();
        ctx.moveTo(0, -100);
        ctx.lineTo(0, 50);
        ctx.stroke();
        ctx.fillStyle = '#f39c12';
        ctx.beginPath();
        ctx.arc(0, 50, 25, 0, Math.PI * 2);
        ctx.fill();
        break;
      case 'force-arrow':
        ctx.fillStyle = '#27ae60';
        ctx.fillRect(-30, -5, 60, 10);
        break;
    }

    ctx.restore();
  }, [dragOverState]);

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    e.dataTransfer.dropEffect = 'copy';

    if (!canvasRef.current) return;

    // Get the current dragging tool type
    const toolType = getCurrentDraggingTool();
    
    if (!toolType) return;

    const rect = canvasRef.current.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;

    setDragOverState({
      isActive: true,
      toolType,
      x,
      y,
    });
  };

  const handleDragEnter = (e: React.DragEvent) => {
    e.preventDefault();
  };

  const handleDragLeave = (e: React.DragEvent) => {
    // Only clear if we're actually leaving the canvas area
    if (e.currentTarget === e.target) {
      setDragOverState({
        isActive: false,
        toolType: null,
        x: 0,
        y: 0,
      });
    }
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

    // Clear drag over state
    setDragOverState({
      isActive: false,
      toolType: null,
      x: 0,
      y: 0,
    });
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
      <div className="pc-canvas-header">
        <h2 className="pc-canvas-title">Canvas</h2>
        <div className="pc-canvas-presets">
          <label>
            Scene:
            <select
              value={currentPreset}
              onChange={(e) => onLoadPreset(e.target.value as ScenePresetId)}
              className="pc-preset-select"
            >
              <option value="empty">Empty Scene</option>
              <option value="freeFall">Free-fall</option>
              <option value="projectile">Projectile</option>
              <option value="pendulum">Pendulum</option>
              <option value="blocksOnRamp">Blocks on ramp</option>
              <option value="springMass">Spring-mass</option>
            </select>
          </label>
        </div>
      </div>
      <div 
        className="pc-canvas-workspace"
        onDragEnter={handleDragEnter}
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
        onDrop={handleDrop}
      >
        <div style={{ position: 'relative' }}>
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
          {/* Drag preview overlay canvas */}
          <canvas
            ref={dragOverlayRef}
            width={900}
            height={500}
            style={{
              position: 'absolute',
              top: 0,
              left: 0,
              pointerEvents: 'none',
              opacity: dragOverState.isActive ? 1 : 0,
            }}
          />
        </div>
        
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
