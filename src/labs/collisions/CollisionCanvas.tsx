import React, { useEffect, useRef } from 'react';
import type { CollisionState, Ball } from './types';

interface CollisionCanvasProps {
  state: CollisionState;
  canvasRef: React.RefObject<HTMLCanvasElement>;
  selectedBallId: string | null;
  onBallClick: (id: string) => void;
  onCanvasClick: (x: number, y: number) => void;
}

export const CollisionCanvas: React.FC<CollisionCanvasProps> = ({
  state,
  canvasRef,
  selectedBallId,
  onBallClick,
  onCanvasClick,
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

    // Animation loop for rendering
    const render = () => {
      // Clear canvas
      ctx.fillStyle = '#0a0a0a';
      ctx.fillRect(0, 0, canvas.width, canvas.height);

      // Draw grid
      if (state.showGrid) {
        ctx.strokeStyle = '#222';
        ctx.lineWidth = 1;
        const gridSize = 50;
        
        for (let x = 0; x <= canvas.width; x += gridSize) {
          ctx.beginPath();
          ctx.moveTo(x, 0);
          ctx.lineTo(x, canvas.height);
          ctx.stroke();
        }
        
        for (let y = 0; y <= canvas.height; y += gridSize) {
          ctx.beginPath();
          ctx.moveTo(0, y);
          ctx.lineTo(canvas.width, y);
          ctx.stroke();
        }
      }

      // Draw trails
      if (state.showTrails) {
        state.balls.forEach(ball => {
          if (ball.trail.length > 1) {
            ctx.strokeStyle = ball.color + '40';
            ctx.lineWidth = 2;
            ctx.beginPath();
            ctx.moveTo(ball.trail[0].x, ball.trail[0].y);
            for (let i = 1; i < ball.trail.length; i++) {
              ctx.lineTo(ball.trail[i].x, ball.trail[i].y);
            }
            ctx.stroke();
          }
        });
      }

      // Draw balls
      state.balls.forEach(ball => {
        // Ball shadow
        ctx.beginPath();
        ctx.arc(ball.x + 2, ball.y + 2, ball.radius, 0, Math.PI * 2);
        ctx.fillStyle = 'rgba(0, 0, 0, 0.3)';
        ctx.fill();

        // Ball body
        ctx.beginPath();
        ctx.arc(ball.x, ball.y, ball.radius, 0, Math.PI * 2);
        ctx.fillStyle = ball.color;
        ctx.fill();

        // Ball outline
        ctx.strokeStyle = selectedBallId === ball.id ? '#fff' : '#000';
        ctx.lineWidth = selectedBallId === ball.id ? 3 : 2;
        ctx.stroke();

        // Ball highlight
        const gradient = ctx.createRadialGradient(
          ball.x - ball.radius * 0.3,
          ball.y - ball.radius * 0.3,
          0,
          ball.x,
          ball.y,
          ball.radius
        );
        gradient.addColorStop(0, 'rgba(255, 255, 255, 0.4)');
        gradient.addColorStop(1, 'rgba(255, 255, 255, 0)');
        ctx.fillStyle = gradient;
        ctx.fill();

        // Mass label
        ctx.fillStyle = '#000';
        ctx.font = 'bold 12px monospace';
        ctx.textAlign = 'center';
        ctx.textBaseline = 'middle';
        ctx.fillText(`${ball.mass.toFixed(1)}kg`, ball.x, ball.y);
      });

      // Draw velocity vectors
      if (state.showVelocityVectors) {
        state.balls.forEach(ball => {
          const scale = 2;
          const vx = ball.vx * scale;
          const vy = ball.vy * scale;
          const length = Math.sqrt(vx * vx + vy * vy);
          
          if (length > 1) {
            ctx.strokeStyle = '#4dabf7';
            ctx.lineWidth = 3;
            ctx.beginPath();
            ctx.moveTo(ball.x, ball.y);
            ctx.lineTo(ball.x + vx, ball.y + vy);
            ctx.stroke();

            // Arrowhead
            const angle = Math.atan2(vy, vx);
            const headLength = 10;
            ctx.beginPath();
            ctx.moveTo(ball.x + vx, ball.y + vy);
            ctx.lineTo(
              ball.x + vx - headLength * Math.cos(angle - Math.PI / 6),
              ball.y + vy - headLength * Math.sin(angle - Math.PI / 6)
            );
            ctx.moveTo(ball.x + vx, ball.y + vy);
            ctx.lineTo(
              ball.x + vx - headLength * Math.cos(angle + Math.PI / 6),
              ball.y + vy - headLength * Math.sin(angle + Math.PI / 6)
            );
            ctx.stroke();
          }
        });
      }

      // Draw momentum vectors
      if (state.showMomentumVectors) {
        state.balls.forEach(ball => {
          const scale = 0.5;
          const px = ball.mass * ball.vx * scale;
          const py = ball.mass * ball.vy * scale;
          const length = Math.sqrt(px * px + py * py);
          
          if (length > 1) {
            ctx.strokeStyle = '#51cf66';
            ctx.lineWidth = 3;
            ctx.beginPath();
            ctx.moveTo(ball.x, ball.y);
            ctx.lineTo(ball.x + px, ball.y + py);
            ctx.stroke();

            // Arrowhead
            const angle = Math.atan2(py, px);
            const headLength = 10;
            ctx.beginPath();
            ctx.moveTo(ball.x + px, ball.y + py);
            ctx.lineTo(
              ball.x + px - headLength * Math.cos(angle - Math.PI / 6),
              ball.y + py - headLength * Math.sin(angle - Math.PI / 6)
            );
            ctx.moveTo(ball.x + px, ball.y + py);
            ctx.lineTo(
              ball.x + px - headLength * Math.cos(angle + Math.PI / 6),
              ball.y + py - headLength * Math.sin(angle + Math.PI / 6)
            );
            ctx.stroke();
          }
        });
      }

      // Legend
      const legendY = 20;
      let offsetY = 0;
      
      if (state.showVelocityVectors) {
        ctx.strokeStyle = '#4dabf7';
        ctx.lineWidth = 3;
        ctx.beginPath();
        ctx.moveTo(20, legendY + offsetY);
        ctx.lineTo(50, legendY + offsetY);
        ctx.stroke();
        
        ctx.fillStyle = '#4dabf7';
        ctx.font = '12px monospace';
        ctx.textAlign = 'left';
        ctx.fillText('Velocity', 60, legendY + offsetY + 4);
        offsetY += 20;
      }
      
      if (state.showMomentumVectors) {
        ctx.strokeStyle = '#51cf66';
        ctx.lineWidth = 3;
        ctx.beginPath();
        ctx.moveTo(20, legendY + offsetY);
        ctx.lineTo(50, legendY + offsetY);
        ctx.stroke();
        
        ctx.fillStyle = '#51cf66';
        ctx.font = '12px monospace';
        ctx.textAlign = 'left';
        ctx.fillText('Momentum', 60, legendY + offsetY + 4);
      }

      requestAnimationFrame(render);
    };

    render();
  }, [state, selectedBallId, canvasRef]);

  const handleClick = (e: React.MouseEvent<HTMLCanvasElement>) => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const rect = canvas.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;

    // Check if clicked on a ball
    let clickedBall: Ball | null = null;
    for (const ball of state.balls) {
      const dx = x - ball.x;
      const dy = y - ball.y;
      if (dx * dx + dy * dy <= ball.radius * ball.radius) {
        clickedBall = ball;
        break;
      }
    }

    if (clickedBall) {
      onBallClick(clickedBall.id);
    } else {
      onCanvasClick(x, y);
    }
  };

  return (
    <div
      ref={containerRef}
      style={{
        width: '100%',
        height: '100%',
        position: 'relative',
        overflow: 'hidden',
      }}
    >
      <canvas
        ref={canvasRef}
        onClick={handleClick}
        style={{
          display: 'block',
          cursor: 'crosshair',
        }}
      />
      
      {state.isPaused && state.balls.length === 0 && (
        <div style={{
          position: 'absolute',
          top: '50%',
          left: '50%',
          transform: 'translate(-50%, -50%)',
          textAlign: 'center',
          color: '#666',
          pointerEvents: 'none',
        }}>
          <div style={{ fontSize: '3rem', marginBottom: '1rem' }}>💥</div>
          <div style={{ fontSize: '1.2rem' }}>Click to add balls or load a preset</div>
        </div>
      )}
    </div>
  );
};
