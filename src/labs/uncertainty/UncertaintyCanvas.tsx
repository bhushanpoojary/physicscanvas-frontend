import React, { useEffect, useRef } from 'react';
import type { UncertaintyState } from './types';
import { MIN_UNCERTAINTY_PRODUCT } from './types';

interface UncertaintyCanvasProps {
  state: UncertaintyState;
}

export const UncertaintyCanvas: React.FC<UncertaintyCanvasProps> = ({ state }) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    // Set canvas size
    const rect = canvas.getBoundingClientRect();
    canvas.width = rect.width * window.devicePixelRatio;
    canvas.height = rect.height * window.devicePixelRatio;
    ctx.scale(window.devicePixelRatio, window.devicePixelRatio);

    const width = rect.width;
    const height = rect.height;

    // Clear canvas
    ctx.fillStyle = '#1a1a1a';
    ctx.fillRect(0, 0, width, height);

    const wp = state.wavePacket;

    // Split canvas vertically: top for position space, bottom for momentum space
    const splitY = height / 2;
    const padding = 50;

    // Draw separator
    ctx.strokeStyle = '#555';
    ctx.lineWidth = 1;
    ctx.beginPath();
    ctx.moveTo(0, splitY);
    ctx.lineTo(width, splitY);
    ctx.stroke();

    // === POSITION SPACE (TOP) ===
    if (state.showPositionSpace) {
      const plotHeight = splitY - 60;
      const plotWidth = width - 2 * padding;

      // Labels
      ctx.fillStyle = '#ccc';
      ctx.font = '14px monospace';
      ctx.fillText('Position Space |ψ(x)|²', padding, 25);
      
      // Uncertainty info
      ctx.font = '12px monospace';
      ctx.fillStyle = '#4dabf7';
      ctx.fillText(`Δx = ${wp.deltaX.toFixed(3)}`, width - padding - 120, 25);

      // Find max probability for scaling
      const maxProbX = Math.max(...wp.probabilityX);
      const xMin = Math.min(...wp.xGrid);
      const xMax = Math.max(...wp.xGrid);

      const xToPixel = (x: number) => padding + ((x - xMin) / (xMax - xMin)) * plotWidth;
      const probXToPixel = (prob: number) => splitY - 40 - (prob / (maxProbX * 1.1)) * plotHeight;

      // Draw probability density
      ctx.fillStyle = 'rgba(74, 144, 226, 0.4)';
      ctx.strokeStyle = 'rgba(74, 144, 226, 0.9)';
      ctx.lineWidth = 2;
      ctx.beginPath();
      
      for (let i = 0; i < wp.xGrid.length; i++) {
        const x = xToPixel(wp.xGrid[i]);
        const y = probXToPixel(wp.probabilityX[i]);
        if (i === 0) ctx.moveTo(x, y);
        else ctx.lineTo(x, y);
      }
      
      // Close path for fill
      const zeroY = probXToPixel(0);
      ctx.lineTo(xToPixel(wp.xGrid[wp.xGrid.length - 1]), zeroY);
      ctx.lineTo(xToPixel(wp.xGrid[0]), zeroY);
      ctx.closePath();
      ctx.fill();
      ctx.stroke();

      // Draw mean position marker
      ctx.strokeStyle = '#ff6b6b';
      ctx.lineWidth = 2;
      ctx.setLineDash([5, 5]);
      const meanXPixel = xToPixel(wp.meanX);
      ctx.beginPath();
      ctx.moveTo(meanXPixel, splitY - 40);
      ctx.lineTo(meanXPixel, 40);
      ctx.stroke();
      ctx.setLineDash([]);

      // Draw axes
      ctx.strokeStyle = '#999';
      ctx.lineWidth = 2;
      ctx.beginPath();
      ctx.moveTo(padding, zeroY);
      ctx.lineTo(width - padding, zeroY);
      ctx.stroke();
      
      ctx.beginPath();
      ctx.moveTo(padding, 40);
      ctx.lineTo(padding, splitY - 40);
      ctx.stroke();

      // Axis labels
      ctx.fillStyle = '#999';
      ctx.font = '11px monospace';
      ctx.fillText('x', width - padding + 5, zeroY + 5);
      ctx.fillText('P(x)', padding - 35, 45);
    }

    // === MOMENTUM SPACE (BOTTOM) ===
    if (state.showMomentumSpace) {
      const plotHeight = splitY - 60;
      const plotWidth = width - 2 * padding;
      const offsetY = splitY;

      // Labels
      ctx.fillStyle = '#ccc';
      ctx.font = '14px monospace';
      ctx.fillText('Momentum Space |φ(p)|²', padding, offsetY + 25);
      
      // Uncertainty info
      ctx.font = '12px monospace';
      ctx.fillStyle = '#51cf66';
      ctx.fillText(`Δp = ${wp.deltaP.toFixed(3)}`, width - padding - 120, offsetY + 25);

      // Find max probability for scaling
      const maxProbP = Math.max(...wp.probabilityP);
      const pMin = Math.min(...wp.pGrid);
      const pMax = Math.max(...wp.pGrid);

      const pToPixel = (p: number) => padding + ((p - pMin) / (pMax - pMin)) * plotWidth;
      const probPToPixel = (prob: number) => height - 40 - (prob / (maxProbP * 1.1)) * plotHeight;

      // Draw probability density
      ctx.fillStyle = 'rgba(81, 207, 102, 0.4)';
      ctx.strokeStyle = 'rgba(81, 207, 102, 0.9)';
      ctx.lineWidth = 2;
      ctx.beginPath();
      
      for (let i = 0; i < wp.pGrid.length; i++) {
        const x = pToPixel(wp.pGrid[i]);
        const y = probPToPixel(wp.probabilityP[i]);
        if (i === 0) ctx.moveTo(x, y);
        else ctx.lineTo(x, y);
      }
      
      // Close path for fill
      const zeroY = probPToPixel(0);
      ctx.lineTo(pToPixel(wp.pGrid[wp.pGrid.length - 1]), zeroY);
      ctx.lineTo(pToPixel(wp.pGrid[0]), zeroY);
      ctx.closePath();
      ctx.fill();
      ctx.stroke();

      // Draw mean momentum marker
      ctx.strokeStyle = '#ffd43b';
      ctx.lineWidth = 2;
      ctx.setLineDash([5, 5]);
      const meanPPixel = pToPixel(wp.meanP);
      ctx.beginPath();
      ctx.moveTo(meanPPixel, height - 40);
      ctx.lineTo(meanPPixel, offsetY + 40);
      ctx.stroke();
      ctx.setLineDash([]);

      // Draw axes
      ctx.strokeStyle = '#999';
      ctx.lineWidth = 2;
      ctx.beginPath();
      ctx.moveTo(padding, zeroY);
      ctx.lineTo(width - padding, zeroY);
      ctx.stroke();
      
      ctx.beginPath();
      ctx.moveTo(padding, offsetY + 40);
      ctx.lineTo(padding, height - 40);
      ctx.stroke();

      // Axis labels
      ctx.fillStyle = '#999';
      ctx.font = '11px monospace';
      ctx.fillText('p', width - padding + 5, zeroY + 5);
      ctx.fillText('P(p)', padding - 35, offsetY + 45);
    }

    // === UNCERTAINTY PRODUCT DISPLAY ===
    if (state.showUncertaintyProduct) {
      const boxWidth = 280;
      const boxHeight = 90;
      const boxX = (width - boxWidth) / 2;
      const boxY = splitY - boxHeight / 2;

      // Background box
      ctx.fillStyle = 'rgba(26, 26, 26, 0.95)';
      ctx.strokeStyle = wp.product >= MIN_UNCERTAINTY_PRODUCT - 0.001 ? '#51cf66' : '#ff6b6b';
      ctx.lineWidth = 3;
      ctx.fillRect(boxX, boxY, boxWidth, boxHeight);
      ctx.strokeRect(boxX, boxY, boxWidth, boxHeight);

      // Title
      ctx.fillStyle = '#fff';
      ctx.font = 'bold 14px monospace';
      ctx.fillText('Heisenberg Uncertainty', boxX + 15, boxY + 25);

      // Uncertainty product
      ctx.font = '16px monospace';
      ctx.fillStyle = '#4dabf7';
      const productText = `Δx · Δp = ${wp.product.toFixed(4)}`;
      ctx.fillText(productText, boxX + 30, boxY + 50);

      // Minimum value reference
      ctx.font = '12px monospace';
      ctx.fillStyle = '#888';
      const minText = `(minimum: ℏ/2 ≈ ${MIN_UNCERTAINTY_PRODUCT.toFixed(4)})`;
      ctx.fillText(minText, boxX + 30, boxY + 70);
    }

  }, [state]);

  return (
    <canvas
      ref={canvasRef}
      style={{
        width: '100%',
        height: '100%',
        display: 'block',
        background: '#1a1a1a',
      }}
    />
  );
};
