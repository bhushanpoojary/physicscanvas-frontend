import React, { useRef, useEffect, useCallback } from 'react';
import type { RelativityState, RelativityToolType, RelativityObjectId } from './types';

interface MinkowskiCanvasProps {
  state: RelativityState;
  onAddObject: (toolType: RelativityToolType, x: number, t: number) => void;
  onSelectObject: (type: 'observer' | 'event' | 'light-pulse' | null, id: RelativityObjectId | null) => void;
  currentTool: RelativityToolType | null;
}

const CANVAS_WIDTH = 900;
const CANVAS_HEIGHT = 500;

const MinkowskiCanvas: React.FC<MinkowskiCanvasProps> = ({
  state,
  onAddObject,
  onSelectObject,
  currentTool,
}) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  // Convert canvas coordinates to spacetime coordinates
  const canvasToSpacetime = useCallback((canvasX: number, canvasY: number) => {
    const { centerX, centerT, scale } = state.viewport;
    const x = (canvasX - CANVAS_WIDTH / 2) / scale + centerX;
    const t = (CANVAS_HEIGHT / 2 - canvasY) / scale + centerT; // Flip Y axis
    return { x, t };
  }, [state.viewport]);

  // Convert spacetime coordinates to canvas coordinates
  const spacetimeToCanvas = useCallback((x: number, t: number) => {
    const { centerX, centerT, scale } = state.viewport;
    const canvasX = (x - centerX) * scale + CANVAS_WIDTH / 2;
    const canvasY = CANVAS_HEIGHT / 2 - (t - centerT) * scale; // Flip Y axis
    return { canvasX, canvasY };
  }, [state.viewport]);

  // Draw the canvas
  const draw = useCallback(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    // Clear canvas
    ctx.fillStyle = '#fafafa';
    ctx.fillRect(0, 0, CANVAS_WIDTH, CANVAS_HEIGHT);

    // Draw grid
    if (state.showGrid) {
      ctx.strokeStyle = '#e0e0e0';
      ctx.lineWidth = 1;

      // Vertical lines (constant x)
      for (let x = Math.floor(state.viewport.minX); x <= Math.ceil(state.viewport.maxX); x++) {
        const { canvasX } = spacetimeToCanvas(x, 0);
        ctx.beginPath();
        ctx.moveTo(canvasX, 0);
        ctx.lineTo(canvasX, CANVAS_HEIGHT);
        ctx.stroke();
      }

      // Horizontal lines (constant t)
      for (let t = Math.floor(state.viewport.minT); t <= Math.ceil(state.viewport.maxT); t++) {
        const { canvasY } = spacetimeToCanvas(0, t);
        ctx.beginPath();
        ctx.moveTo(0, canvasY);
        ctx.lineTo(CANVAS_WIDTH, canvasY);
        ctx.stroke();
      }
    }

    // Draw axes
    ctx.strokeStyle = '#333';
    ctx.lineWidth = 2;

    // t-axis (vertical, x=0)
    const { canvasX: tAxisX } = spacetimeToCanvas(0, 0);
    ctx.beginPath();
    ctx.moveTo(tAxisX, 0);
    ctx.lineTo(tAxisX, CANVAS_HEIGHT);
    ctx.stroke();

    // x-axis (horizontal, t=0)
    const { canvasY: xAxisY } = spacetimeToCanvas(0, 0);
    ctx.beginPath();
    ctx.moveTo(0, xAxisY);
    ctx.lineTo(CANVAS_WIDTH, xAxisY);
    ctx.stroke();

    // Axis labels
    ctx.fillStyle = '#333';
    ctx.font = '14px sans-serif';
    ctx.fillText('ct', tAxisX + 10, 20);
    ctx.fillText('x', CANVAS_WIDTH - 30, xAxisY - 10);

    // Draw light cone (45° lines through origin)
    if (state.showLightCone) {
      ctx.strokeStyle = '#ffa726';
      ctx.lineWidth = 2;
      ctx.setLineDash([5, 5]);

      // Future light cone (+45°)
      const { canvasX: lc1x1, canvasY: lc1y1 } = spacetimeToCanvas(-10, 0);
      const { canvasX: lc1x2, canvasY: lc1y2 } = spacetimeToCanvas(0, 10);
      ctx.beginPath();
      ctx.moveTo(lc1x1, lc1y1);
      ctx.lineTo(lc1x2, lc1y2);
      ctx.stroke();

      // Future light cone (-45°)
      const { canvasX: lc2x1, canvasY: lc2y1 } = spacetimeToCanvas(10, 0);
      const { canvasX: lc2x2, canvasY: lc2y2 } = spacetimeToCanvas(0, 10);
      ctx.beginPath();
      ctx.moveTo(lc2x1, lc2y1);
      ctx.lineTo(lc2x2, lc2y2);
      ctx.stroke();

      ctx.setLineDash([]);
    }

    // Draw observer worldlines
    state.observers.forEach(observer => {
      const isSelected = state.selection.type === 'observer' && state.selection.id === observer.id;
      
      ctx.strokeStyle = observer.color;
      ctx.lineWidth = isSelected ? 4 : 2;

      // Worldline: x = x0 + v*t
      const { canvasX: x1, canvasY: y1 } = spacetimeToCanvas(
        observer.x0 + observer.velocity * state.viewport.minT,
        state.viewport.minT
      );
      const { canvasX: x2, canvasY: y2 } = spacetimeToCanvas(
        observer.x0 + observer.velocity * state.viewport.maxT,
        state.viewport.maxT
      );

      ctx.beginPath();
      ctx.moveTo(x1, y1);
      ctx.lineTo(x2, y2);
      ctx.stroke();

      // Arrow at top
      const arrowSize = 10;
      const angle = Math.atan2(y2 - y1, x2 - x1);
      ctx.beginPath();
      ctx.moveTo(x2, y2);
      ctx.lineTo(
        x2 - arrowSize * Math.cos(angle - Math.PI / 6),
        y2 - arrowSize * Math.sin(angle - Math.PI / 6)
      );
      ctx.moveTo(x2, y2);
      ctx.lineTo(
        x2 - arrowSize * Math.cos(angle + Math.PI / 6),
        y2 - arrowSize * Math.sin(angle + Math.PI / 6)
      );
      ctx.stroke();

      // Label
      ctx.fillStyle = observer.color;
      ctx.font = isSelected ? 'bold 12px sans-serif' : '12px sans-serif';
      ctx.fillText(observer.label, x1 + 5, y1 + 15);
    });

    // Draw light pulses
    state.lightPulses.forEach(pulse => {
      const isSelected = state.selection.type === 'light-pulse' && state.selection.id === pulse.id;
      
      ctx.strokeStyle = pulse.color;
      ctx.lineWidth = isSelected ? 3 : 2;
      ctx.setLineDash([3, 3]);

      // Light worldline at 45° from origin
      const slope = pulse.direction; // ±1
      const { canvasX: x1, canvasY: y1 } = spacetimeToCanvas(
        pulse.originX + slope * (state.viewport.minT - pulse.originT),
        state.viewport.minT
      );
      const { canvasX: x2, canvasY: y2 } = spacetimeToCanvas(
        pulse.originX + slope * (state.viewport.maxT - pulse.originT),
        state.viewport.maxT
      );

      ctx.beginPath();
      ctx.moveTo(x1, y1);
      ctx.lineTo(x2, y2);
      ctx.stroke();

      ctx.setLineDash([]);
    });

    // Draw events
    state.events.forEach(event => {
      const isSelected = state.selection.type === 'event' && state.selection.id === event.id;
      const { canvasX, canvasY } = spacetimeToCanvas(event.x, event.t);

      ctx.fillStyle = event.color;
      ctx.strokeStyle = isSelected ? '#1e90ff' : event.color;
      ctx.lineWidth = isSelected ? 3 : 1;

      // Draw event as a circle
      ctx.beginPath();
      ctx.arc(canvasX, canvasY, isSelected ? 8 : 6, 0, 2 * Math.PI);
      ctx.fill();
      ctx.stroke();

      // Label
      ctx.fillStyle = event.color;
      ctx.font = isSelected ? 'bold 12px sans-serif' : '12px sans-serif';
      ctx.fillText(event.label, canvasX + 10, canvasY - 5);
    });
  }, [state, spacetimeToCanvas]);

  // Redraw on state changes
  useEffect(() => {
    draw();
  }, [draw]);

  // Handle canvas click
  const handleClick = (e: React.MouseEvent<HTMLCanvasElement>) => {
    const rect = e.currentTarget.getBoundingClientRect();
    const canvasX = e.clientX - rect.left;
    const canvasY = e.clientY - rect.top;
    const { x, t } = canvasToSpacetime(canvasX, canvasY);

    // Check if clicking on existing object
    const clickRadius = 10;

    // Check events
    for (const event of state.events) {
      const { canvasX: ex, canvasY: ey } = spacetimeToCanvas(event.x, event.t);
      const dist = Math.sqrt((canvasX - ex) ** 2 + (canvasY - ey) ** 2);
      if (dist < clickRadius) {
        onSelectObject('event', event.id);
        return;
      }
    }

    // Check observers (click on worldline)
    for (const observer of state.observers) {
      const { canvasX: ox1, canvasY: oy1 } = spacetimeToCanvas(
        observer.x0 + observer.velocity * state.viewport.minT,
        state.viewport.minT
      );
      const { canvasX: ox2, canvasY: oy2 } = spacetimeToCanvas(
        observer.x0 + observer.velocity * state.viewport.maxT,
        state.viewport.maxT
      );
      
      // Distance from point to line segment
      const dist = pointToSegmentDistance(canvasX, canvasY, ox1, oy1, ox2, oy2);
      if (dist < clickRadius) {
        onSelectObject('observer', observer.id);
        return;
      }
    }

    // If current tool is selected, add new object
    if (currentTool) {
      onAddObject(currentTool, x, t);
    } else {
      onSelectObject(null, null);
    }
  };

  return (
    <div className="pc-minkowski-canvas-container">
      <canvas
        ref={canvasRef}
        width={CANVAS_WIDTH}
        height={CANVAS_HEIGHT}
        className="pc-minkowski-canvas"
        onClick={handleClick}
      />
    </div>
  );
};

// Helper function: distance from point to line segment
function pointToSegmentDistance(
  px: number, py: number,
  x1: number, y1: number,
  x2: number, y2: number
): number {
  const A = px - x1;
  const B = py - y1;
  const C = x2 - x1;
  const D = y2 - y1;

  const dot = A * C + B * D;
  const lenSq = C * C + D * D;
  const param = lenSq !== 0 ? dot / lenSq : -1;

  let xx, yy;

  if (param < 0) {
    xx = x1;
    yy = y1;
  } else if (param > 1) {
    xx = x2;
    yy = y2;
  } else {
    xx = x1 + param * C;
    yy = y1 + param * D;
  }

  const dx = px - xx;
  const dy = py - yy;
  return Math.sqrt(dx * dx + dy * dy);
}

export default MinkowskiCanvas;
