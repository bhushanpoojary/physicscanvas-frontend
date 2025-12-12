// Gaussian wave packet and Fourier transform calculations

import type { WavePacket } from '../types';
import { HBAR } from '../types';

/**
 * Compute Gaussian wave packet in position and momentum space
 * ψ(x) = (2πσ²)^(-1/4) * exp(-(x-x0)²/(4σ²)) * exp(ik0x)
 */
export function computeGaussianWavePacket(
  sigma: number,
  x0: number,
  k0: number,
  numPoints: number = 500
): WavePacket {
  const xGrid: number[] = [];
  const psiX: number[] = [];
  const probabilityX: number[] = [];
  
  const pGrid: number[] = [];
  const psiP: number[] = [];
  const probabilityP: number[] = [];
  
  // Position space calculation - expand range to show full context
  const rangeWidth = Math.max(8 * sigma, 15);
  const xMin = x0 - rangeWidth / 2;
  const xMax = x0 + rangeWidth / 2;
  const dx = (xMax - xMin) / (numPoints - 1);
  
  // Normalization constant
  const normX = Math.pow(2 * Math.PI * sigma * sigma, -0.25);
  
  for (let i = 0; i < numPoints; i++) {
    const x = xMin + i * dx;
    xGrid.push(x);
    
    // Gaussian envelope * plane wave
    const envelope = Math.exp(-((x - x0) ** 2) / (4 * sigma * sigma));
    const amplitude = normX * envelope;
    
    // Real part: cos(k0*x), we'll just use amplitude for visualization
    const psi = amplitude; // Simplified for real-valued display
    psiX.push(psi);
    probabilityX.push(psi * psi);
  }
  
  // Momentum space (Fourier transform of Gaussian is also Gaussian)
  // φ(p) = (2πσ²)^(1/4) * exp(-σ²(p-ℏk0)²) * exp(-ip·x0/ℏ)
  const p0 = HBAR * k0; // Central momentum
  const sigmaMomentum = HBAR / (2 * sigma); // Momentum width
  
  const pMin = p0 - 5 * sigmaMomentum;
  const pMax = p0 + 5 * sigmaMomentum;
  const dp = (pMax - pMin) / (numPoints - 1);
  
  const normP = Math.pow(2 * Math.PI * sigma * sigma, 0.25);
  
  for (let i = 0; i < numPoints; i++) {
    const p = pMin + i * dp;
    pGrid.push(p);
    
    const envelope = Math.exp(-(sigma * sigma * (p - p0) * (p - p0)) / (HBAR * HBAR));
    const amplitude = normP * envelope;
    
    psiP.push(amplitude);
    probabilityP.push(amplitude * amplitude);
  }
  
  // Calculate uncertainties (standard deviations)
  const deltaX = sigma * Math.sqrt(2); // For Gaussian: Δx = σ√2
  const deltaP = sigmaMomentum * Math.sqrt(2); // Δp = (ℏ/(2σ))√2
  const product = deltaX * deltaP; // For Gaussian: exactly ℏ/2
  
  // Expectation values
  const meanX = x0;
  const meanP = p0;
  
  return {
    xGrid,
    psiX,
    probabilityX,
    pGrid,
    psiP,
    probabilityP,
    deltaX,
    deltaP,
    product,
    meanX,
    meanP,
  };
}

/**
 * Compute statistics for a custom wave packet
 * (for future expansion with non-Gaussian packets)
 */
export function computeWavePacketStatistics(
  xGrid: number[],
  probabilityX: number[],
  pGrid: number[],
  probabilityP: number[]
): {
  deltaX: number;
  deltaP: number;
  product: number;
  meanX: number;
  meanP: number;
} {
  const dx = xGrid.length > 1 ? xGrid[1] - xGrid[0] : 1;
  const dp = pGrid.length > 1 ? pGrid[1] - pGrid[0] : 1;
  
  // Normalize probabilities
  let normX = 0;
  let normP = 0;
  for (let i = 0; i < probabilityX.length; i++) {
    normX += probabilityX[i] * dx;
  }
  for (let i = 0; i < probabilityP.length; i++) {
    normP += probabilityP[i] * dp;
  }
  
  // Calculate mean values
  let meanX = 0;
  let meanP = 0;
  for (let i = 0; i < xGrid.length; i++) {
    meanX += xGrid[i] * probabilityX[i] * dx / normX;
  }
  for (let i = 0; i < pGrid.length; i++) {
    meanP += pGrid[i] * probabilityP[i] * dp / normP;
  }
  
  // Calculate variances
  let varX = 0;
  let varP = 0;
  for (let i = 0; i < xGrid.length; i++) {
    varX += (xGrid[i] - meanX) ** 2 * probabilityX[i] * dx / normX;
  }
  for (let i = 0; i < pGrid.length; i++) {
    varP += (pGrid[i] - meanP) ** 2 * probabilityP[i] * dp / normP;
  }
  
  const deltaX = Math.sqrt(varX);
  const deltaP = Math.sqrt(varP);
  const product = deltaX * deltaP;
  
  return { deltaX, deltaP, product, meanX, meanP };
}

/**
 * Format uncertainty value for display
 */
export function formatUncertainty(value: number): string {
  return value.toFixed(3);
}

/**
 * Check if uncertainty product satisfies Heisenberg principle
 */
export function satisfiesUncertaintyPrinciple(product: number): boolean {
  return product >= (HBAR / 2 - 0.001); // Small tolerance for numerical errors
}
