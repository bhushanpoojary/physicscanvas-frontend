import React, { useEffect, useRef } from 'react';
import type { RotationalState, RotatingObject, RotatingObjectType } from './types';

interface RotationalCanvasProps {
  state: RotationalState;
  canvasRef: React.RefObject<HTMLCanvasElement | null>;
  onAddObject: (x: number, y: number, type: RotatingObjectType) => void;
  onSelectObject: (id: string | null) => void;
  selectedObjectId: string | null;
  currentTool: RotatingObjectType | null;
}

export const RotationalCanvas: React.FC<RotationalCanvasProps> = ({
  state,
  canvasRef,
  onAddObject,
  onSelectObject,
  selectedObjectId,
  currentTool,
}) => {
  const renderLoopRef = useRef<number | undefined>(undefined);

  // Render loop
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const render = () => {
      // Clear canvas
      ctx.fillStyle = '#0a0a0a';
      ctx.fillRect(0, 0, canvas.width, canvas.height);

      // Draw grid
      if (state.showGrid) {
        ctx.strokeStyle = '#1a1a1a';
        ctx.lineWidth = 1;
        const gridSize = 50;
        for (let x = 0; x < canvas.width; x += gridSize) {
          ctx.beginPath();
          ctx.moveTo(x, 0);
          ctx.lineTo(x, canvas.height);
          ctx.stroke();
        }
        for (let y = 0; y < canvas.height; y += gridSize) {
          ctx.beginPath();
          ctx.moveTo(0, y);
          ctx.lineTo(canvas.width, y);
          ctx.stroke();
        }
      }

      // Draw objects
      state.objects.forEach(obj => {
        drawRotatingObject(ctx, obj, selectedObjectId === obj.id, state);
      });

      // Empty state message
      if (state.objects.length === 0) {
        ctx.fillStyle = '#666';
        ctx.font = '16px sans-serif';
        ctx.textAlign = 'center';
        ctx.fillText('Select a tool and click to add rotating objects', canvas.width / 2, canvas.height / 2);
      }

      renderLoopRef.current = requestAnimationFrame(render);
    };

    render();

    return () => {
      if (renderLoopRef.current) {
        cancelAnimationFrame(renderLoopRef.current);
      }
    };
  }, [state, canvasRef, selectedObjectId]);

  // Handle canvas click
  const handleClick = (e: React.MouseEvent<HTMLCanvasElement>) => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const rect = canvas.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;

    // Check if clicking on existing object
    for (const obj of state.objects) {
      const dx = x - obj.x;
      const dy = y - obj.y;
      const distance = Math.sqrt(dx * dx + dy * dy);
      if (distance < obj.radius) {
        onSelectObject(obj.id);
        return;
      }
    }

    // Add new object if tool selected
    if (currentTool) {
      onAddObject(x, y, currentTool);
    } else {
      onSelectObject(null);
    }
  };

  return (
    <canvas
      ref={canvasRef}
      width={800}
      height={600}
      onClick={handleClick}
      style={{
        width: '100%',
        height: '100%',
        cursor: currentTool ? 'crosshair' : 'pointer',
      }}
    />
  );
};

function drawRotatingObject(
  ctx: CanvasRenderingContext2D,
  obj: RotatingObject,
  isSelected: boolean,
  state: RotationalState
) {
  const { x, y, radius, angle, type, color, omega, appliedTorque } = obj;

  ctx.save();
  ctx.translate(x, y);

  // Draw shadow
  if (!isSelected) {
    ctx.shadowColor = 'rgba(0, 0, 0, 0.5)';
    ctx.shadowBlur = 10;
    ctx.shadowOffsetX = 3;
    ctx.shadowOffsetY = 3;
  }

  // Draw object based on type
  ctx.rotate(angle);

  switch (type) {
    case 'disk':
      drawDisk(ctx, radius, color);
      break;
    case 'ring':
      drawRing(ctx, radius, color);
      break;
    case 'rod':
      drawRod(ctx, radius, color);
      break;
    case 'sphere':
      drawSphere(ctx, radius, color);
      break;
  }

  ctx.rotate(-angle);

  // Remove shadow for vectors
  ctx.shadowColor = 'transparent';
  ctx.shadowBlur = 0;
  ctx.shadowOffsetX = 0;
  ctx.shadowOffsetY = 0;

  // Draw selection highlight
  if (isSelected) {
    ctx.strokeStyle = '#fff';
    ctx.lineWidth = 3;
    ctx.beginPath();
    ctx.arc(0, 0, radius + 5, 0, 2 * Math.PI);
    ctx.stroke();
  }

  // Draw angular velocity vector
  if (state.showAngularVelocity && Math.abs(omega) > 0.01) {
    const direction = omega > 0 ? 1 : -1;
    drawAngularVelocityVector(ctx, radius, omega, direction);
  }

  // Draw angular momentum vector
  if (state.showAngularMomentum && Math.abs(omega) > 0.01) {
    const L = obj.momentOfInertia * omega;
    const direction = omega > 0 ? 1 : -1;
    drawAngularMomentumVector(ctx, radius, L, direction);
  }

  // Draw torque vector
  if (state.showTorque && Math.abs(appliedTorque) > 0.01) {
    const direction = appliedTorque > 0 ? 1 : -1;
    drawTorqueVector(ctx, radius, appliedTorque, direction);
  }

  ctx.restore();
}

function drawDisk(ctx: CanvasRenderingContext2D, radius: number, color: string) {
  // Main disk
  const gradient = ctx.createRadialGradient(0, 0, 0, 0, 0, radius);
  gradient.addColorStop(0, color);
  gradient.addColorStop(1, shadeColor(color, -30));
  ctx.fillStyle = gradient;
  ctx.beginPath();
  ctx.arc(0, 0, radius, 0, 2 * Math.PI);
  ctx.fill();

  // Radial line to show rotation
  ctx.strokeStyle = '#fff';
  ctx.lineWidth = 3;
  ctx.beginPath();
  ctx.moveTo(0, 0);
  ctx.lineTo(radius - 5, 0);
  ctx.stroke();

  // Center dot
  ctx.fillStyle = '#fff';
  ctx.beginPath();
  ctx.arc(0, 0, 4, 0, 2 * Math.PI);
  ctx.fill();
}

function drawRing(ctx: CanvasRenderingContext2D, radius: number, color: string) {
  // Outer circle
  ctx.strokeStyle = color;
  ctx.lineWidth = 15;
  ctx.beginPath();
  ctx.arc(0, 0, radius, 0, 2 * Math.PI);
  ctx.stroke();

  // Inner gradient for depth
  const gradient = ctx.createRadialGradient(0, 0, radius - 10, 0, 0, radius);
  gradient.addColorStop(0, 'transparent');
  gradient.addColorStop(1, shadeColor(color, -40));
  ctx.fillStyle = gradient;
  ctx.beginPath();
  ctx.arc(0, 0, radius, 0, 2 * Math.PI);
  ctx.fill();

  // Radial line
  ctx.strokeStyle = '#fff';
  ctx.lineWidth = 3;
  ctx.beginPath();
  ctx.moveTo(0, 0);
  ctx.lineTo(radius, 0);
  ctx.stroke();

  // Center dot
  ctx.fillStyle = '#fff';
  ctx.beginPath();
  ctx.arc(0, 0, 4, 0, 2 * Math.PI);
  ctx.fill();
}

function drawRod(ctx: CanvasRenderingContext2D, radius: number, color: string) {
  const length = radius * 2;
  const width = 12;

  // Rod body
  const gradient = ctx.createLinearGradient(0, -width / 2, 0, width / 2);
  gradient.addColorStop(0, shadeColor(color, 20));
  gradient.addColorStop(0.5, color);
  gradient.addColorStop(1, shadeColor(color, -30));
  ctx.fillStyle = gradient;
  ctx.fillRect(-length / 2, -width / 2, length, width);

  // End caps
  ctx.fillStyle = shadeColor(color, -20);
  ctx.beginPath();
  ctx.arc(-length / 2, 0, width / 2, 0, 2 * Math.PI);
  ctx.arc(length / 2, 0, width / 2, 0, 2 * Math.PI);
  ctx.fill();

  // Center marker
  ctx.fillStyle = '#fff';
  ctx.beginPath();
  ctx.arc(0, 0, 5, 0, 2 * Math.PI);
  ctx.fill();
}

function drawSphere(ctx: CanvasRenderingContext2D, radius: number, color: string) {
  // Sphere with gradient for 3D effect
  const gradient = ctx.createRadialGradient(-radius / 3, -radius / 3, 0, 0, 0, radius);
  gradient.addColorStop(0, shadeColor(color, 40));
  gradient.addColorStop(0.5, color);
  gradient.addColorStop(1, shadeColor(color, -40));
  ctx.fillStyle = gradient;
  ctx.beginPath();
  ctx.arc(0, 0, radius, 0, 2 * Math.PI);
  ctx.fill();

  // Rotation indicator (equator line)
  ctx.strokeStyle = 'rgba(255, 255, 255, 0.6)';
  ctx.lineWidth = 2;
  ctx.beginPath();
  ctx.ellipse(0, 0, radius, radius * 0.3, 0, 0, 2 * Math.PI);
  ctx.stroke();

  // Radial line
  ctx.strokeStyle = '#fff';
  ctx.lineWidth = 3;
  ctx.beginPath();
  ctx.moveTo(0, 0);
  ctx.lineTo(radius - 5, 0);
  ctx.stroke();
}

function drawAngularVelocityVector(ctx: CanvasRenderingContext2D, radius: number, omega: number, direction: number) {
  const baseRadius = radius + 30;
  const arrowSize = Math.min(Math.abs(omega) * 5, 40);

  // Circular arrow
  ctx.strokeStyle = '#4dabf7';
  ctx.lineWidth = 3;
  ctx.beginPath();
  ctx.arc(0, 0, baseRadius, 0, direction * Math.PI * 0.8);
  ctx.stroke();

  // Arrowhead
  const angle = direction * Math.PI * 0.8;
  const tipX = baseRadius * Math.cos(angle);
  const tipY = baseRadius * Math.sin(angle);
  
  ctx.fillStyle = '#4dabf7';
  ctx.beginPath();
  ctx.moveTo(tipX, tipY);
  ctx.lineTo(
    tipX + arrowSize * Math.cos(angle - direction * Math.PI / 4),
    tipY + arrowSize * Math.sin(angle - direction * Math.PI / 4)
  );
  ctx.lineTo(
    tipX + arrowSize * 0.5 * Math.cos(angle + direction * Math.PI / 2),
    tipY + arrowSize * 0.5 * Math.sin(angle + direction * Math.PI / 2)
  );
  ctx.closePath();
  ctx.fill();

  // Label
  ctx.fillStyle = '#4dabf7';
  ctx.font = 'bold 12px sans-serif';
  ctx.textAlign = 'center';
  ctx.fillText('ω', 0, -baseRadius - 10);
}

function drawAngularMomentumVector(ctx: CanvasRenderingContext2D, radius: number, _L: number, direction: number) {
  const baseRadius = radius + 50;
  const arrowSize = 30;

  ctx.strokeStyle = '#51cf66';
  ctx.lineWidth = 3;
  ctx.beginPath();
  ctx.arc(0, 0, baseRadius, 0, direction * Math.PI * 0.7);
  ctx.stroke();

  const angle = direction * Math.PI * 0.7;
  const tipX = baseRadius * Math.cos(angle);
  const tipY = baseRadius * Math.sin(angle);
  
  ctx.fillStyle = '#51cf66';
  ctx.beginPath();
  ctx.moveTo(tipX, tipY);
  ctx.lineTo(
    tipX + arrowSize * Math.cos(angle - direction * Math.PI / 4),
    tipY + arrowSize * Math.sin(angle - direction * Math.PI / 4)
  );
  ctx.lineTo(
    tipX + arrowSize * 0.5 * Math.cos(angle + direction * Math.PI / 2),
    tipY + arrowSize * 0.5 * Math.sin(angle + direction * Math.PI / 2)
  );
  ctx.closePath();
  ctx.fill();

  ctx.fillStyle = '#51cf66';
  ctx.font = 'bold 12px sans-serif';
  ctx.textAlign = 'center';
  ctx.fillText('L', 0, -baseRadius - 10);
}

function drawTorqueVector(ctx: CanvasRenderingContext2D, radius: number, _torque: number, direction: number) {
  const baseRadius = radius + 70;
  const arrowSize = 35;

  ctx.strokeStyle = '#ff6b6b';
  ctx.lineWidth = 4;
  ctx.beginPath();
  ctx.arc(0, 0, baseRadius, 0, direction * Math.PI * 0.6);
  ctx.stroke();

  const angle = direction * Math.PI * 0.6;
  const tipX = baseRadius * Math.cos(angle);
  const tipY = baseRadius * Math.sin(angle);
  
  ctx.fillStyle = '#ff6b6b';
  ctx.beginPath();
  ctx.moveTo(tipX, tipY);
  ctx.lineTo(
    tipX + arrowSize * Math.cos(angle - direction * Math.PI / 4),
    tipY + arrowSize * Math.sin(angle - direction * Math.PI / 4)
  );
  ctx.lineTo(
    tipX + arrowSize * 0.5 * Math.cos(angle + direction * Math.PI / 2),
    tipY + arrowSize * 0.5 * Math.sin(angle + direction * Math.PI / 2)
  );
  ctx.closePath();
  ctx.fill();

  ctx.fillStyle = '#ff6b6b';
  ctx.font = 'bold 12px sans-serif';
  ctx.textAlign = 'center';
  ctx.fillText('τ', 0, -baseRadius - 10);
}

function shadeColor(color: string, percent: number): string {
  const num = parseInt(color.replace('#', ''), 16);
  const amt = Math.round(2.55 * percent);
  const R = (num >> 16) + amt;
  const G = ((num >> 8) & 0x00ff) + amt;
  const B = (num & 0x0000ff) + amt;
  return `#${(
    0x1000000 +
    (R < 255 ? (R < 1 ? 0 : R) : 255) * 0x10000 +
    (G < 255 ? (G < 1 ? 0 : G) : 255) * 0x100 +
    (B < 255 ? (B < 1 ? 0 : B) : 255)
  )
    .toString(16)
    .slice(1)}`;
}
