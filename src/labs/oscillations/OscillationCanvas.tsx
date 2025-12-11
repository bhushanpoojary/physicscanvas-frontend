import React, { useEffect, useRef } from 'react';
import type { OscillationState, Oscillator, Spring } from './types';
import { calculateTotalSpringForce } from './physics/oscillations';

interface OscillationCanvasProps {
  state: OscillationState;
  canvasRef: React.RefObject<HTMLCanvasElement | null>;
  selectedOscillatorId: string | null;
  onSelectOscillator: (id: string | null) => void;
  onUpdateOscillatorPosition: (id: string, x: number) => void;
}

export const OscillationCanvas: React.FC<OscillationCanvasProps> = ({
  state,
  canvasRef,
  selectedOscillatorId,
  onSelectOscillator,
  onUpdateOscillatorPosition,
}) => {
  const isDragging = useRef(false);
  const draggedOscillatorId = useRef<string | null>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    // Set canvas size
    canvas.width = canvas.offsetWidth;
    canvas.height = canvas.offsetHeight;

    // Clear canvas
    ctx.fillStyle = '#0a0a0a';
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    // Draw grid if enabled
    if (state.showGrid) {
      drawGrid(ctx, canvas.width, canvas.height);
    }

    // Draw springs
    for (const spring of state.springs) {
      drawSpring(ctx, spring, state.oscillators, canvas);
    }

    // Draw trails if enabled
    if (state.showTrails) {
      for (const oscillator of state.oscillators) {
        drawTrail(ctx, oscillator);
      }
    }

    // Draw oscillators
    for (const oscillator of state.oscillators) {
      const isSelected = oscillator.id === selectedOscillatorId;
      drawOscillator(ctx, oscillator, isSelected);
    }

    // Draw velocity vectors if enabled
    if (state.showVelocityVectors) {
      for (const oscillator of state.oscillators) {
        drawVelocityVector(ctx, oscillator);
      }
    }

    // Draw force vectors if enabled
    if (state.showForceVectors) {
      for (const oscillator of state.oscillators) {
        drawForceVector(ctx, oscillator, state);
      }
    }

    // Draw phase space if enabled
    if (state.showPhaseSpace && state.oscillators.length > 0) {
      drawPhaseSpace(ctx, state.oscillators[0], canvas);
    }

    // Draw energy plot if enabled
    if (state.showEnergyPlot) {
      drawEnergyInfo(ctx, state, canvas);
    }

  }, [state, selectedOscillatorId, canvasRef]);

  const handleMouseDown = (e: React.MouseEvent<HTMLCanvasElement>) => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const rect = canvas.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;

    // Check if clicking on an oscillator
    for (const oscillator of state.oscillators) {
      const dx = x - oscillator.x;
      const dy = y - oscillator.y;
      const distance = Math.sqrt(dx * dx + dy * dy);

      if (distance < 20) {
        isDragging.current = true;
        draggedOscillatorId.current = oscillator.id;
        onSelectOscillator(oscillator.id);
        return;
      }
    }

    // Clicked empty space
    onSelectOscillator(null);
  };

  const handleMouseMove = (e: React.MouseEvent<HTMLCanvasElement>) => {
    if (!isDragging.current || !draggedOscillatorId.current) return;

    const canvas = canvasRef.current;
    if (!canvas) return;

    const rect = canvas.getBoundingClientRect();
    const x = e.clientX - rect.left;

    // Constrain to canvas bounds
    const constrainedX = Math.max(50, Math.min(canvas.width - 50, x));
    onUpdateOscillatorPosition(draggedOscillatorId.current, constrainedX);
  };

  const handleMouseUp = () => {
    isDragging.current = false;
    draggedOscillatorId.current = null;
  };

  return (
    <canvas
      ref={canvasRef}
      className="pc-canvas-element"
      onMouseDown={handleMouseDown}
      onMouseMove={handleMouseMove}
      onMouseUp={handleMouseUp}
      onMouseLeave={handleMouseUp}
      style={{ cursor: isDragging.current ? 'grabbing' : 'default' }}
    />
  );
};

// Helper drawing functions

function drawGrid(ctx: CanvasRenderingContext2D, width: number, height: number) {
  ctx.strokeStyle = '#222';
  ctx.lineWidth = 1;

  // Vertical lines
  for (let x = 0; x < width; x += 50) {
    ctx.beginPath();
    ctx.moveTo(x, 0);
    ctx.lineTo(x, height);
    ctx.stroke();
  }

  // Horizontal lines
  for (let y = 0; y < height; y += 50) {
    ctx.beginPath();
    ctx.moveTo(0, y);
    ctx.lineTo(width, y);
    ctx.stroke();
  }
}

function drawSpring(
  ctx: CanvasRenderingContext2D,
  spring: Spring,
  oscillators: Oscillator[],
  canvas: HTMLCanvasElement
) {
  const osc1 = spring.oscillator1Id
    ? oscillators.find(o => o.id === spring.oscillator1Id)
    : null;
  const osc2 = oscillators.find(o => o.id === spring.oscillator2Id);

  if (!osc2) return;

  const x1 = osc1 ? osc1.x : 50; // Wall position
  const y1 = osc1 ? osc1.y : osc2.y;
  const x2 = osc2.x;
  const y2 = osc2.y;

  // Draw wall if spring is attached to wall
  if (!osc1) {
    ctx.fillStyle = '#444';
    ctx.fillRect(40, y1 - 40, 10, 80);
  }

  // Calculate spring extension for visual feedback
  const currentLength = Math.abs(x2 - x1);
  const extension = currentLength - spring.naturalLength;
  const extensionRatio = Math.abs(extension) / spring.naturalLength;

  // Color based on extension
  let springColor = spring.color;
  if (extensionRatio > 0.2) {
    springColor = extension > 0 ? '#ff6b6b' : '#4dabf7';
  }

  // Draw spring coils
  const coils = 12;
  const amplitude = 10;

  ctx.strokeStyle = springColor;
  ctx.lineWidth = 2;
  ctx.beginPath();
  ctx.moveTo(x1, y1);

  for (let i = 0; i <= coils; i++) {
    const t = i / coils;
    const x = x1 + (x2 - x1) * t;
    const y = y1 + (y2 - y1) * t + (i % 2 === 0 ? amplitude : -amplitude);
    ctx.lineTo(x, y);
  }

  ctx.lineTo(x2, y2);
  ctx.stroke();
}

function drawOscillator(
  ctx: CanvasRenderingContext2D,
  oscillator: Oscillator,
  isSelected: boolean
) {
  // Draw equilibrium marker
  ctx.fillStyle = '#444';
  ctx.fillRect(oscillator.equilibriumX - 1, oscillator.y - 30, 2, 60);

  // Draw oscillator mass
  const radius = 20;
  
  ctx.fillStyle = oscillator.color;
  ctx.beginPath();
  ctx.arc(oscillator.x, oscillator.y, radius, 0, Math.PI * 2);
  ctx.fill();

  // Selection highlight
  if (isSelected) {
    ctx.strokeStyle = '#fff';
    ctx.lineWidth = 3;
    ctx.beginPath();
    ctx.arc(oscillator.x, oscillator.y, radius + 5, 0, Math.PI * 2);
    ctx.stroke();
  }

  // Draw border
  ctx.strokeStyle = '#fff';
  ctx.lineWidth = 2;
  ctx.beginPath();
  ctx.arc(oscillator.x, oscillator.y, radius, 0, Math.PI * 2);
  ctx.stroke();
}

function drawTrail(ctx: CanvasRenderingContext2D, oscillator: Oscillator) {
  if (oscillator.trail.length < 2) return;

  ctx.strokeStyle = oscillator.color + '40'; // Add transparency
  ctx.lineWidth = 2;
  ctx.beginPath();
  ctx.moveTo(oscillator.trail[0].x, oscillator.trail[0].y);

  for (let i = 1; i < oscillator.trail.length; i++) {
    ctx.lineTo(oscillator.trail[i].x, oscillator.trail[i].y);
  }

  ctx.stroke();
}

function drawVelocityVector(
  ctx: CanvasRenderingContext2D,
  oscillator: Oscillator
) {
  const scale = 2;
  const vx = oscillator.vx * scale;

  if (Math.abs(vx) < 1) return;

  ctx.strokeStyle = '#00ff00';
  ctx.fillStyle = '#00ff00';
  ctx.lineWidth = 2;

  // Arrow shaft
  ctx.beginPath();
  ctx.moveTo(oscillator.x, oscillator.y);
  ctx.lineTo(oscillator.x + vx, oscillator.y);
  ctx.stroke();

  // Arrow head
  const headSize = 8;
  const angle = vx > 0 ? 0 : Math.PI;
  ctx.beginPath();
  ctx.moveTo(oscillator.x + vx, oscillator.y);
  ctx.lineTo(
    oscillator.x + vx - headSize * Math.cos(angle - Math.PI / 6),
    oscillator.y - headSize * Math.sin(angle - Math.PI / 6)
  );
  ctx.lineTo(
    oscillator.x + vx - headSize * Math.cos(angle + Math.PI / 6),
    oscillator.y - headSize * Math.sin(angle + Math.PI / 6)
  );
  ctx.closePath();
  ctx.fill();

  // Label
  ctx.fillStyle = '#00ff00';
  ctx.font = '12px monospace';
  ctx.fillText(
    `v: ${oscillator.vx.toFixed(1)}`,
    oscillator.x + vx + 10,
    oscillator.y - 10
  );
}

function drawForceVector(
  ctx: CanvasRenderingContext2D,
  oscillator: Oscillator,
  state: OscillationState
) {
  const force = calculateTotalSpringForce(oscillator, state.springs, state.oscillators);
  const scale = 0.5;
  const fx = force * scale;

  if (Math.abs(fx) < 1) return;

  ctx.strokeStyle = '#ff6b6b';
  ctx.fillStyle = '#ff6b6b';
  ctx.lineWidth = 2;

  // Arrow shaft
  ctx.beginPath();
  ctx.moveTo(oscillator.x, oscillator.y);
  ctx.lineTo(oscillator.x + fx, oscillator.y);
  ctx.stroke();

  // Arrow head
  const headSize = 8;
  const angle = fx > 0 ? 0 : Math.PI;
  ctx.beginPath();
  ctx.moveTo(oscillator.x + fx, oscillator.y);
  ctx.lineTo(
    oscillator.x + fx - headSize * Math.cos(angle - Math.PI / 6),
    oscillator.y - headSize * Math.sin(angle - Math.PI / 6)
  );
  ctx.lineTo(
    oscillator.x + fx - headSize * Math.cos(angle + Math.PI / 6),
    oscillator.y - headSize * Math.sin(angle + Math.PI / 6)
  );
  ctx.closePath();
  ctx.fill();

  // Label
  ctx.fillStyle = '#ff6b6b';
  ctx.font = '12px monospace';
  ctx.fillText(
    `F: ${force.toFixed(1)}`,
    oscillator.x + fx + 10,
    oscillator.y + 20
  );
}

function drawPhaseSpace(
  ctx: CanvasRenderingContext2D,
  oscillator: Oscillator,
  canvas: HTMLCanvasElement
) {
  const width = 200;
  const height = 150;
  const padding = 10;
  const x = canvas.width - width - padding;
  const y = padding;

  // Background
  ctx.fillStyle = 'rgba(0, 0, 0, 0.7)';
  ctx.fillRect(x, y, width, height);
  ctx.strokeStyle = '#444';
  ctx.strokeRect(x, y, width, height);

  // Title
  ctx.fillStyle = '#fff';
  ctx.font = '12px monospace';
  ctx.fillText('Phase Space', x + 10, y + 20);

  // Draw axes
  const centerX = x + width / 2;
  const centerY = y + height / 2;
  
  ctx.strokeStyle = '#666';
  ctx.lineWidth = 1;
  ctx.beginPath();
  ctx.moveTo(x + 20, centerY);
  ctx.lineTo(x + width - 20, centerY);
  ctx.moveTo(centerX, y + 30);
  ctx.lineTo(centerX, y + height - 20);
  ctx.stroke();

  // Plot phase space trajectory
  if (oscillator.trail.length > 1) {
    ctx.strokeStyle = oscillator.color;
    ctx.lineWidth = 2;
    ctx.beginPath();

    const xScale = (width - 40) / 200;
    const vScale = (height - 50) / 200;

    for (let i = 0; i < oscillator.trail.length; i++) {
      const point = oscillator.trail[i];
      const displacement = point.x - oscillator.equilibriumX;
      
      // Get velocity (approximate from trail)
      let velocity = 0;
      if (i > 0) {
        const prevPoint = oscillator.trail[i - 1];
        velocity = (point.x - prevPoint.x) / 0.016;
      }

      const px = centerX + displacement * xScale;
      const py = centerY - velocity * vScale;

      if (i === 0) {
        ctx.moveTo(px, py);
      } else {
        ctx.lineTo(px, py);
      }
    }

    ctx.stroke();
  }

  // Current point
  const displacement = oscillator.x - oscillator.equilibriumX;
  const xScale = (width - 40) / 200;
  const vScale = (height - 50) / 200;
  const px = centerX + displacement * xScale;
  const py = centerY - oscillator.vx * vScale;

  ctx.fillStyle = oscillator.color;
  ctx.beginPath();
  ctx.arc(px, py, 4, 0, Math.PI * 2);
  ctx.fill();
}

function drawEnergyInfo(
  ctx: CanvasRenderingContext2D,
  state: OscillationState,
  canvas: HTMLCanvasElement
) {
  const width = 220;
  const height = 100;
  const padding = 10;
  const x = padding;
  const y = canvas.height - height - padding;

  // Background
  ctx.fillStyle = 'rgba(0, 0, 0, 0.7)';
  ctx.fillRect(x, y, width, height);
  ctx.strokeStyle = '#444';
  ctx.strokeRect(x, y, width, height);

  // Energy bars
  const maxEnergy = Math.max(state.totalEnergy, 1);
  const barWidth = 40;
  const barMaxHeight = height - 40;

  const keHeight = (state.kineticEnergy / maxEnergy) * barMaxHeight;
  const peHeight = (state.potentialEnergy / maxEnergy) * barMaxHeight;

  // Kinetic energy
  ctx.fillStyle = '#4dabf7';
  ctx.fillRect(x + 20, y + height - 20 - keHeight, barWidth, keHeight);

  // Potential energy
  ctx.fillStyle = '#ffa500';
  ctx.fillRect(x + 70, y + height - 20 - peHeight, barWidth, peHeight);

  // Total energy
  const teHeight = (state.totalEnergy / maxEnergy) * barMaxHeight;
  ctx.fillStyle = '#2ecc71';
  ctx.fillRect(x + 120, y + height - 20 - teHeight, barWidth, teHeight);

  // Labels
  ctx.fillStyle = '#fff';
  ctx.font = '10px monospace';
  ctx.fillText('KE', x + 30, y + height - 5);
  ctx.fillText('PE', x + 80, y + height - 5);
  ctx.fillText('Total', x + 123, y + height - 5);

  // Values
  ctx.font = '11px monospace';
  ctx.fillStyle = '#4dabf7';
  ctx.fillText(state.kineticEnergy.toFixed(1), x + 20, y + 15);
  ctx.fillStyle = '#ffa500';
  ctx.fillText(state.potentialEnergy.toFixed(1), x + 70, y + 15);
  ctx.fillStyle = '#2ecc71';
  ctx.fillText(state.totalEnergy.toFixed(1), x + 120, y + 15);
}
