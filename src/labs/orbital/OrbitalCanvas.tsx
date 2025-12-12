import React, { useEffect, useRef } from 'react';
import type { OrbitalState, CelestialBody, Spacecraft, LagrangePoint } from './types';

interface OrbitalCanvasProps {
  state: OrbitalState;
  canvasRef: React.RefObject<HTMLCanvasElement | null>;
  onSelectObject: (id: string | null) => void;
}

export const OrbitalCanvas: React.FC<OrbitalCanvasProps> = ({
  state,
  canvasRef,
  onSelectObject,
}) => {
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    // Set canvas size only when dimensions change
    const container = containerRef.current;
    if (container && (canvas.width !== container.clientWidth || canvas.height !== container.clientHeight)) {
      canvas.width = container.clientWidth;
      canvas.height = container.clientHeight;
    }

    // Clear canvas
    ctx.fillStyle = '#0a0a0a';
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    const centerX = canvas.width / 2;
    const centerY = canvas.height / 2;

    // Calculate scale based on bodies (memoize if possible)
    const scale = calculateScale(state.bodies, canvas.width, canvas.height);

    // Draw grid if enabled
    if (state.showGrid) {
      drawGrid(ctx, canvas.width, canvas.height, centerX, centerY, scale);
    }

    // Draw Lagrange points if enabled
    if (state.showLagrangePoints && state.lagrangePoints.length > 0) {
      state.lagrangePoints.forEach((point) => {
        drawLagrangePoint(ctx, point, centerX, centerY, scale);
      });
    }

    // Draw trails
    if (state.showTrails) {
      state.bodies.forEach((body) => {
        if (body.trail.length > 1) {
          drawTrail(ctx, body.trail, body.color, centerX, centerY, scale);
        }
      });
      state.spacecraft.forEach((sc) => {
        if (sc.trail.length > 1) {
          drawTrail(ctx, sc.trail, sc.color, centerX, centerY, scale);
        }
      });
    }

    // Draw bodies
    state.bodies.forEach((body) => {
      drawCelestialBody(ctx, body, centerX, centerY, scale, state.selectedId);
    });

    // Draw spacecraft
    state.spacecraft.forEach((sc) => {
      drawSpacecraft(ctx, sc, centerX, centerY, scale, state.selectedId);
    });

    // Draw velocity vectors if enabled
    if (state.showVelocityVectors) {
      state.bodies.forEach((body) => {
        if (!body.isFixed) {
          drawVelocityVector(ctx, body, centerX, centerY, scale);
        }
      });
      state.spacecraft.forEach((sc) => {
        drawVelocityVector(ctx, sc, centerX, centerY, scale);
      });
    }

    // Draw info overlay
    ctx.fillStyle = '#fff';
    ctx.font = '14px monospace';
    ctx.fillText(`Time: ${(state.time / 86400).toFixed(2)} days`, 10, 20);
    ctx.fillText(state.isPaused ? '⏸️ PAUSED' : '▶️ RUNNING', 10, 40);
  }, [
    state.bodies,
    state.spacecraft,
    state.lagrangePoints,
    state.time,
    state.isPaused,
    state.showVelocityVectors,
    state.showOrbitalElements,
    state.showLagrangePoints,
    state.selectedId,
    canvasRef
  ]);

  const handleCanvasClick = (e: React.MouseEvent<HTMLDivElement>) => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const rect = canvas.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;

    const centerX = canvas.width / 2;
    const centerY = canvas.height / 2;
    const scale = calculateScale(state.bodies, canvas.width, canvas.height);

    // Check if clicking on a body
    for (const body of state.bodies) {
      const screenX = centerX + body.x * scale;
      const screenY = centerY - body.y * scale;
      const dist = Math.sqrt((x - screenX) ** 2 + (y - screenY) ** 2);

      if (dist < body.radius) {
        onSelectObject(body.id);
        return;
      }
    }

    // Check if clicking on spacecraft
    for (const sc of state.spacecraft) {
      const screenX = centerX + sc.x * scale;
      const screenY = centerY - sc.y * scale;
      const dist = Math.sqrt((x - screenX) ** 2 + (y - screenY) ** 2);

      if (dist < 8) {
        onSelectObject(sc.id);
        return;
      }
    }

    onSelectObject(null);
  };

  return (
    <div ref={containerRef} className="pc-canvas-container" onClick={handleCanvasClick}>
      <canvas ref={canvasRef} className="pc-canvas-element" />
    </div>
  );
};

function calculateScale(bodies: CelestialBody[], width: number, height: number): number {
  if (bodies.length === 0) return 0.001;

  let maxDistance = 0;
  for (const body of bodies) {
    const distance = Math.sqrt(body.x * body.x + body.y * body.y);
    if (distance > maxDistance) {
      maxDistance = distance;
    }
  }

  if (maxDistance === 0) return 0.001;

  const margin = 100;
  const availableSize = Math.min(width, height) - margin * 2;
  return availableSize / (maxDistance * 2.5);
}

function drawGrid(
  ctx: CanvasRenderingContext2D,
  width: number,
  height: number,
  centerX: number,
  centerY: number,
  scale: number
) {
  ctx.strokeStyle = '#1a1a1a';
  ctx.lineWidth = 1;

  const gridSpacing = 50000 * scale; // 50,000 km in screen units
  
  // Safety check: if gridSpacing is too small, skip drawing grid
  if (gridSpacing < 10) {
    return;
  }

  // Vertical lines (limit iterations)
  let iterations = 0;
  for (let x = centerX % gridSpacing; x < width; x += gridSpacing) {
    if (iterations++ > 100) break; // Safety limit
    ctx.beginPath();
    ctx.moveTo(x, 0);
    ctx.lineTo(x, height);
    ctx.stroke();
  }

  // Horizontal lines (limit iterations)
  iterations = 0;
  for (let y = centerY % gridSpacing; y < height; y += gridSpacing) {
    if (iterations++ > 100) break; // Safety limit
    ctx.beginPath();
    ctx.moveTo(0, y);
    ctx.lineTo(width, y);
    ctx.stroke();
  }

  // Center axes
  ctx.strokeStyle = '#333';
  ctx.lineWidth = 2;
  ctx.beginPath();
  ctx.moveTo(centerX, 0);
  ctx.lineTo(centerX, height);
  ctx.stroke();

  ctx.beginPath();
  ctx.moveTo(0, centerY);
  ctx.lineTo(width, centerY);
  ctx.stroke();
}

function drawTrail(
  ctx: CanvasRenderingContext2D,
  trail: Array<{ x: number; y: number }>,
  color: string,
  centerX: number,
  centerY: number,
  scale: number
) {
  ctx.strokeStyle = color;
  ctx.lineWidth = 2;
  ctx.globalAlpha = 0.5;
  ctx.beginPath();

  for (let i = 0; i < trail.length; i++) {
    const point = trail[i];
    const screenX = centerX + point.x * scale;
    const screenY = centerY - point.y * scale;

    if (i === 0) {
      ctx.moveTo(screenX, screenY);
    } else {
      ctx.lineTo(screenX, screenY);
    }
  }

  ctx.stroke();
  ctx.globalAlpha = 1;
}

function drawCelestialBody(
  ctx: CanvasRenderingContext2D,
  body: CelestialBody,
  centerX: number,
  centerY: number,
  scale: number,
  selectedId: string | null
) {
  const screenX = centerX + body.x * scale;
  const screenY = centerY - body.y * scale;

  // Draw body
  ctx.fillStyle = body.color;
  ctx.beginPath();
  ctx.arc(screenX, screenY, body.radius, 0, Math.PI * 2);
  ctx.fill();

  // Draw selection highlight
  if (selectedId === body.id) {
    ctx.strokeStyle = '#fff';
    ctx.lineWidth = 3;
    ctx.stroke();
  }

  // Draw label
  ctx.fillStyle = '#fff';
  ctx.font = '12px sans-serif';
  ctx.textAlign = 'center';
  ctx.fillText(body.name, screenX, screenY - body.radius - 5);

  // Draw fixed indicator
  if (body.isFixed) {
    ctx.fillStyle = '#ffa500';
    ctx.font = '16px sans-serif';
    ctx.fillText('⊙', screenX, screenY + body.radius + 15);
  }
}

function drawSpacecraft(
  ctx: CanvasRenderingContext2D,
  spacecraft: Spacecraft,
  centerX: number,
  centerY: number,
  scale: number,
  selectedId: string | null
) {
  const screenX = centerX + spacecraft.x * scale;
  const screenY = centerY - spacecraft.y * scale;

  // Draw spacecraft as triangle
  const size = 8;
  const angle = Math.atan2(spacecraft.vy, spacecraft.vx) - Math.PI / 2;

  ctx.save();
  ctx.translate(screenX, screenY);
  ctx.rotate(angle);

  ctx.fillStyle = spacecraft.color;
  ctx.beginPath();
  ctx.moveTo(0, -size);
  ctx.lineTo(-size * 0.7, size);
  ctx.lineTo(size * 0.7, size);
  ctx.closePath();
  ctx.fill();

  // Selection highlight
  if (selectedId === spacecraft.id) {
    ctx.strokeStyle = '#fff';
    ctx.lineWidth = 2;
    ctx.stroke();
  }

  ctx.restore();

  // Draw label
  ctx.fillStyle = '#fff';
  ctx.font = '11px sans-serif';
  ctx.textAlign = 'center';
  ctx.fillText(spacecraft.name, screenX, screenY - 15);
}

function drawVelocityVector(
  ctx: CanvasRenderingContext2D,
  object: { x: number; y: number; vx: number; vy: number; color: string },
  centerX: number,
  centerY: number,
  scale: number
) {
  const screenX = centerX + object.x * scale;
  const screenY = centerY - object.y * scale;

  const velocityScale = 0.1;
  const endX = screenX + object.vx * velocityScale;
  const endY = screenY - object.vy * velocityScale;

  ctx.strokeStyle = object.color;
  ctx.lineWidth = 2;
  ctx.globalAlpha = 0.7;

  // Arrow line
  ctx.beginPath();
  ctx.moveTo(screenX, screenY);
  ctx.lineTo(endX, endY);
  ctx.stroke();

  // Arrow head
  const angle = Math.atan2(-(object.vy * velocityScale), object.vx * velocityScale);
  const arrowLength = 8;

  ctx.beginPath();
  ctx.moveTo(endX, endY);
  ctx.lineTo(
    endX - arrowLength * Math.cos(angle - Math.PI / 6),
    endY - arrowLength * Math.sin(angle - Math.PI / 6)
  );
  ctx.moveTo(endX, endY);
  ctx.lineTo(
    endX - arrowLength * Math.cos(angle + Math.PI / 6),
    endY - arrowLength * Math.sin(angle + Math.PI / 6)
  );
  ctx.stroke();

  ctx.globalAlpha = 1;
}

function drawLagrangePoint(
  ctx: CanvasRenderingContext2D,
  point: LagrangePoint,
  centerX: number,
  centerY: number,
  scale: number
) {
  const screenX = centerX + point.x * scale;
  const screenY = centerY - point.y * scale;

  // Draw point
  ctx.strokeStyle = '#ffa500';
  ctx.lineWidth = 2;
  ctx.beginPath();
  ctx.arc(screenX, screenY, 6, 0, Math.PI * 2);
  ctx.stroke();

  // Draw label
  ctx.fillStyle = '#ffa500';
  ctx.font = '12px monospace';
  ctx.textAlign = 'center';
  ctx.fillText(point.type, screenX, screenY - 12);
}
