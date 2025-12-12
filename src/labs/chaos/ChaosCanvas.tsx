import React, { useEffect, useRef } from 'react';
import type { ChaosState, DoublePendulum, LorenzPoint } from './types';

interface ChaosCanvasProps {
  state: ChaosState;
  canvasRef: React.RefObject<HTMLCanvasElement | null>;
  selectedItemId: string | null;
  onSelectItem: (id: string | null) => void;
}

export const ChaosCanvas: React.FC<ChaosCanvasProps> = ({
  state,
  canvasRef,
  selectedItemId,
  onSelectItem,
}) => {
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    // Set canvas size
    const container = containerRef.current;
    if (container) {
      canvas.width = container.clientWidth;
      canvas.height = container.clientHeight;
    }

    // Clear canvas
    ctx.fillStyle = '#0a0a0a';
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    const centerX = canvas.width / 2;
    const centerY = canvas.height / 3;

    // Draw grid if enabled
    if (state.showGrid) {
      drawGrid(ctx, canvas.width, canvas.height);
    }

    // Draw based on system type
    if (state.systemType === 'double-pendulum') {
      state.pendulums.forEach((pendulum) => {
        drawDoublePendulum(ctx, pendulum, centerX, centerY, state.showTrails, selectedItemId);
      });
    } else if (state.systemType === 'lorenz-attractor') {
      drawLorenzAttractor(ctx, state.lorenzPoints, canvas.width, canvas.height, state.showTrails, state.show3DView);
    }

    // Draw info overlay
    ctx.fillStyle = '#fff';
    ctx.font = '14px monospace';
    ctx.fillText(`Time: ${state.time.toFixed(2)}s`, 10, 20);
    ctx.fillText(state.isPaused ? '⏸️ PAUSED' : '▶️ RUNNING', 10, 40);

  }, [state, canvasRef, selectedItemId]);

  const handleCanvasClick = (e: React.MouseEvent<HTMLCanvasElement>) => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const rect = canvas.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;

    // Check if clicking on a pendulum bob
    const centerX = canvas.width / 2;
    const centerY = canvas.height / 3;

    for (const pendulum of state.pendulums) {
      const x2 = centerX + pendulum.length1 * Math.sin(pendulum.theta1) + 
                  pendulum.length2 * Math.sin(pendulum.theta2);
      const y2 = centerY + pendulum.length1 * Math.cos(pendulum.theta1) + 
                  pendulum.length2 * Math.cos(pendulum.theta2);
      
      const dist = Math.sqrt((x - x2) ** 2 + (y - y2) ** 2);
      if (dist < 15) {
        onSelectItem(pendulum.id);
        return;
      }
    }

    onSelectItem(null);
  };

  return (
    <div ref={containerRef} className="pc-canvas-container" onClick={handleCanvasClick}>
      <canvas ref={canvasRef} className="pc-canvas-element" />
    </div>
  );
};

function drawGrid(ctx: CanvasRenderingContext2D, width: number, height: number) {
  ctx.strokeStyle = '#1a1a1a';
  ctx.lineWidth = 1;

  const gridSize = 50;

  for (let x = 0; x < width; x += gridSize) {
    ctx.beginPath();
    ctx.moveTo(x, 0);
    ctx.lineTo(x, height);
    ctx.stroke();
  }

  for (let y = 0; y < height; y += gridSize) {
    ctx.beginPath();
    ctx.moveTo(0, y);
    ctx.lineTo(width, y);
    ctx.stroke();
  }
}

function drawDoublePendulum(
  ctx: CanvasRenderingContext2D,
  pendulum: DoublePendulum,
  centerX: number,
  centerY: number,
  showTrails: boolean,
  selectedItemId: string | null
) {
  const { theta1, theta2, length1, length2, mass1, mass2, color, trail } = pendulum;

  // Calculate positions
  const x1 = centerX + length1 * Math.sin(theta1);
  const y1 = centerY + length1 * Math.cos(theta1);
  const x2 = x1 + length2 * Math.sin(theta2);
  const y2 = y1 + length2 * Math.cos(theta2);

  // Draw trail
  if (showTrails && trail.length > 1) {
    ctx.strokeStyle = color;
    ctx.lineWidth = 2;
    ctx.globalAlpha = 0.5;
    ctx.beginPath();
    
    for (let i = 0; i < trail.length; i++) {
      const point = trail[i];
      const px = centerX + point.x;
      const py = centerY + point.y;
      
      if (i === 0) {
        ctx.moveTo(px, py);
      } else {
        ctx.lineTo(px, py);
      }
    }
    ctx.stroke();
    ctx.globalAlpha = 1;
  }

  // Draw pivot point
  ctx.fillStyle = '#666';
  ctx.beginPath();
  ctx.arc(centerX, centerY, 5, 0, Math.PI * 2);
  ctx.fill();

  // Draw rods
  ctx.strokeStyle = '#aaa';
  ctx.lineWidth = 3;
  ctx.beginPath();
  ctx.moveTo(centerX, centerY);
  ctx.lineTo(x1, y1);
  ctx.stroke();

  ctx.beginPath();
  ctx.moveTo(x1, y1);
  ctx.lineTo(x2, y2);
  ctx.stroke();

  // Draw bobs
  const isSelected = selectedItemId === pendulum.id;
  
  // First bob
  ctx.fillStyle = color;
  ctx.beginPath();
  ctx.arc(x1, y1, mass1 * 10 + 5, 0, Math.PI * 2);
  ctx.fill();
  if (isSelected) {
    ctx.strokeStyle = '#fff';
    ctx.lineWidth = 2;
    ctx.stroke();
  }

  // Second bob
  ctx.fillStyle = color;
  ctx.beginPath();
  ctx.arc(x2, y2, mass2 * 10 + 5, 0, Math.PI * 2);
  ctx.fill();
  if (isSelected) {
    ctx.strokeStyle = '#fff';
    ctx.lineWidth = 2;
    ctx.stroke();
  }
}

function drawLorenzAttractor(
  ctx: CanvasRenderingContext2D,
  points: LorenzPoint[],
  width: number,
  height: number,
  showTrails: boolean,
  show3DView: boolean
) {
  const scale = 8;
  const centerX = width / 2;
  const centerY = height / 2;

  points.forEach((point) => {
    const { trail, color } = point;

    // Draw trail
    if (showTrails && trail.length > 1) {
      ctx.strokeStyle = color;
      ctx.lineWidth = 1.5;
      ctx.beginPath();

      for (let i = 0; i < trail.length; i++) {
        const p = trail[i];
        
        let screenX, screenY;
        if (show3DView) {
          // Simple 3D projection
          const perspective = 500;
          const projScale = perspective / (perspective + p.z);
          screenX = centerX + p.x * scale * projScale;
          screenY = centerY + p.y * scale * projScale;
        } else {
          // 2D projection (x-z plane)
          screenX = centerX + p.x * scale;
          screenY = centerY - p.z * scale + 200;
        }

        if (i === 0) {
          ctx.moveTo(screenX, screenY);
        } else {
          // Fade trail
          const alpha = i / trail.length;
          ctx.globalAlpha = alpha * 0.8;
          ctx.lineTo(screenX, screenY);
        }
      }
      ctx.stroke();
      ctx.globalAlpha = 1;
    }

    // Draw current point
    let screenX, screenY;
    if (show3DView) {
      const perspective = 500;
      const projScale = perspective / (perspective + point.z);
      screenX = centerX + point.x * scale * projScale;
      screenY = centerY + point.y * scale * projScale;
    } else {
      screenX = centerX + point.x * scale;
      screenY = centerY - point.z * scale + 200;
    }

    ctx.fillStyle = color;
    ctx.beginPath();
    ctx.arc(screenX, screenY, 4, 0, Math.PI * 2);
    ctx.fill();
  });

  // Draw axes labels
  ctx.fillStyle = '#888';
  ctx.font = '12px monospace';
  ctx.fillText(show3DView ? 'X-Y-Z View' : 'X-Z View', 10, height - 10);
}
