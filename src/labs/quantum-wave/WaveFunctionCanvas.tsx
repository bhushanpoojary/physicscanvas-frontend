import React, { useEffect, useRef } from 'react';
import type { QuantumState } from './types';

interface WaveFunctionCanvasProps {
  state: QuantumState;
}

export const WaveFunctionCanvas: React.FC<WaveFunctionCanvasProps> = ({ state }) => {
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

    const wf = state.waveFunction;
    if (!wf || wf.xGrid.length === 0) return;

    // Split canvas: top 40% for potential, bottom 60% for wave function
    const potentialHeight = height * 0.35;
    const waveHeight = height * 0.65;
    const waveFunctionY = potentialHeight;

    // Draw separator line
    ctx.strokeStyle = '#555';
    ctx.lineWidth = 1;
    ctx.beginPath();
    ctx.moveTo(0, waveFunctionY);
    ctx.lineTo(width, waveFunctionY);
    ctx.stroke();

    // Draw labels
    ctx.fillStyle = '#ccc';
    ctx.font = '12px monospace';
    ctx.fillText('Potential V(x)', 10, 20);
    ctx.fillText('Wave Function ψ(x)', 10, waveFunctionY + 20);

    // Find data ranges
    const xMin = Math.min(...wf.xGrid);
    const xMax = Math.max(...wf.xGrid);
    const vMax = Math.max(...wf.potential);
    const psiMax = Math.max(
      ...wf.psiReal.map(Math.abs),
      ...wf.psiImag.map(Math.abs),
      ...wf.psiProbability.map(Math.abs)
    );

    // Coordinate transformations
    const padding = 40;
    const plotWidth = width - 2 * padding;
    const xToPixel = (x: number) => padding + ((x - xMin) / (xMax - xMin)) * plotWidth;

    // Draw potential V(x) in top section
    const potentialPlotHeight = potentialHeight - 60;
    const vToPixel = (v: number) => potentialHeight - 30 - (v / (vMax * 1.2)) * potentialPlotHeight;

    ctx.strokeStyle = '#ff6b6b';
    ctx.lineWidth = 2;
    ctx.beginPath();
    for (let i = 0; i < wf.xGrid.length; i++) {
      const x = xToPixel(wf.xGrid[i]);
      const y = vToPixel(wf.potential[i]);
      if (i === 0) ctx.moveTo(x, y);
      else ctx.lineTo(x, y);
    }
    ctx.stroke();

    // Draw energy level line
    ctx.strokeStyle = '#4dabf7';
    ctx.lineWidth = 1;
    ctx.setLineDash([5, 5]);
    const energyY = vToPixel(wf.energy);
    ctx.beginPath();
    ctx.moveTo(padding, energyY);
    ctx.lineTo(width - padding, energyY);
    ctx.stroke();
    ctx.setLineDash([]);

    // Energy label
    ctx.fillStyle = '#4dabf7';
    ctx.fillText(`E = ${wf.energy.toFixed(2)}`, width - padding - 80, energyY - 5);

    // Draw wave function in bottom section
    const wavePlotHeight = waveHeight - 60;
    const psiToPixel = (psi: number) => {
      const center = waveFunctionY + waveHeight / 2;
      return center - (psi / (psiMax * 1.2)) * (wavePlotHeight / 2);
    };

    // Draw zero line
    ctx.strokeStyle = '#555';
    ctx.lineWidth = 1;
    const zeroY = psiToPixel(0);
    ctx.beginPath();
    ctx.moveTo(padding, zeroY);
    ctx.lineTo(width - padding, zeroY);
    ctx.stroke();

    // Draw probability density |ψ|²
    if (state.showProbability) {
      ctx.fillStyle = 'rgba(147, 51, 234, 0.3)'; // Purple fill
      ctx.strokeStyle = 'rgba(147, 51, 234, 0.8)';
      ctx.lineWidth = 2;
      ctx.beginPath();
      for (let i = 0; i < wf.xGrid.length; i++) {
        const x = xToPixel(wf.xGrid[i]);
        const y = psiToPixel(wf.psiProbability[i]);
        if (i === 0) ctx.moveTo(x, y);
        else ctx.lineTo(x, y);
      }
      ctx.lineTo(xToPixel(wf.xGrid[wf.xGrid.length - 1]), zeroY);
      ctx.lineTo(xToPixel(wf.xGrid[0]), zeroY);
      ctx.closePath();
      ctx.fill();
      ctx.stroke();
    }

    // Draw Re(ψ)
    if (state.showReal) {
      ctx.strokeStyle = '#51cf66';
      ctx.lineWidth = 2;
      ctx.beginPath();
      for (let i = 0; i < wf.xGrid.length; i++) {
        const x = xToPixel(wf.xGrid[i]);
        const y = psiToPixel(wf.psiReal[i]);
        if (i === 0) ctx.moveTo(x, y);
        else ctx.lineTo(x, y);
      }
      ctx.stroke();
    }

    // Draw Im(ψ)
    if (state.showImaginary) {
      ctx.strokeStyle = '#ffd43b';
      ctx.lineWidth = 2;
      ctx.beginPath();
      for (let i = 0; i < wf.xGrid.length; i++) {
        const x = xToPixel(wf.xGrid[i]);
        const y = psiToPixel(wf.psiImag[i]);
        if (i === 0) ctx.moveTo(x, y);
        else ctx.lineTo(x, y);
      }
      ctx.stroke();
    }

    // Draw axes
    ctx.strokeStyle = '#999';
    ctx.lineWidth = 2;
    // X-axis for potential
    ctx.beginPath();
    ctx.moveTo(padding, potentialHeight - 30);
    ctx.lineTo(width - padding, potentialHeight - 30);
    ctx.stroke();
    // Y-axis for potential
    ctx.beginPath();
    ctx.moveTo(padding, 30);
    ctx.lineTo(padding, potentialHeight - 30);
    ctx.stroke();
    // X-axis for wave function
    ctx.beginPath();
    ctx.moveTo(padding, waveFunctionY + waveHeight - 30);
    ctx.lineTo(width - padding, waveFunctionY + waveHeight - 30);
    ctx.stroke();
    // Y-axis for wave function
    ctx.beginPath();
    ctx.moveTo(padding, waveFunctionY + 30);
    ctx.lineTo(padding, waveFunctionY + waveHeight - 30);
    ctx.stroke();

    // Axis labels
    ctx.fillStyle = '#999';
    ctx.font = '11px monospace';
    ctx.fillText('x', width - padding + 5, potentialHeight - 25);
    ctx.fillText('V', padding - 15, 35);
    ctx.fillText('x', width - padding + 5, waveFunctionY + waveHeight - 25);
    ctx.fillText('ψ', padding - 15, waveFunctionY + 35);

    // Legend
    const legendX = width - padding - 180;
    const legendY = waveFunctionY + 40;
    let offsetY = 0;

    if (state.showReal) {
      ctx.fillStyle = '#51cf66';
      ctx.fillRect(legendX, legendY + offsetY, 15, 3);
      ctx.fillStyle = '#ccc';
      ctx.fillText('Re(ψ)', legendX + 20, legendY + offsetY + 4);
      offsetY += 15;
    }

    if (state.showImaginary) {
      ctx.fillStyle = '#ffd43b';
      ctx.fillRect(legendX, legendY + offsetY, 15, 3);
      ctx.fillStyle = '#ccc';
      ctx.fillText('Im(ψ)', legendX + 20, legendY + offsetY + 4);
      offsetY += 15;
    }

    if (state.showProbability) {
      ctx.fillStyle = 'rgba(147, 51, 234, 0.8)';
      ctx.fillRect(legendX, legendY + offsetY, 15, 3);
      ctx.fillStyle = '#ccc';
      ctx.fillText('|ψ|²', legendX + 20, legendY + offsetY + 4);
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
