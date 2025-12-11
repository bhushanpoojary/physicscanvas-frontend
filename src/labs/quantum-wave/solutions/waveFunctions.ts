// Analytic solutions for quantum systems

import type { WaveFunction, SystemParameters } from '../types';

/**
 * Factorial function
 */
function factorial(n: number): number {
  if (n <= 1) return 1;
  return n * factorial(n - 1);
}

/**
 * Hermite polynomials (first 7 for harmonic oscillator)
 */
const hermitePolynomials = [
  (_x: number) => 1,                                    // H₀
  (x: number) => 2 * x,                                // H₁
  (x: number) => 4 * x * x - 2,                        // H₂
  (x: number) => 8 * x * x * x - 12 * x,               // H₃
  (x: number) => 16 * x**4 - 48 * x**2 + 12,           // H₄
  (x: number) => 32 * x**5 - 160 * x**3 + 120 * x,     // H₅
  (x: number) => 64 * x**6 - 480 * x**4 + 720 * x**2 - 120, // H₆
];

/**
 * Infinite square well wave function
 * ψₙ(x) = √(2/L) sin(nπx/L)
 * For x ∈ [0, L]
 */
export function infiniteWellWaveFunction(
  n: number,
  params: SystemParameters,
  numPoints: number = 500
): WaveFunction {
  const L = params.wellWidth || 1.0; // nm
  const xGrid: number[] = [];
  const potential: number[] = [];
  const psiReal: number[] = [];
  const psiImag: number[] = [];
  const psiProbability: number[] = [];

  // Generate grid from -0.2L to 1.2L to show walls
  const xMin = -0.2 * L;
  const xMax = 1.2 * L;
  const dx = (xMax - xMin) / (numPoints - 1);

  for (let i = 0; i < numPoints; i++) {
    const x = xMin + i * dx;
    xGrid.push(x);

    // Potential: 0 inside, infinite outside
    if (x < 0 || x > L) {
      potential.push(50); // High value to represent infinity
      psiReal.push(0);
      psiImag.push(0);
      psiProbability.push(0);
    } else {
      potential.push(0);
      const norm = Math.sqrt(2 / L);
      const psi = norm * Math.sin((n * Math.PI * x) / L);
      psiReal.push(psi);
      psiImag.push(0); // Real-valued eigenstate
      psiProbability.push(psi * psi);
    }
  }

  // Energy eigenvalue: Eₙ = n²π²ℏ²/(2mL²)
  // Using reduced units where energy is in arbitrary units
  const energy = n * n; // Simplified for visualization

  return {
    xGrid,
    potential,
    psiReal,
    psiImag,
    psiProbability,
    energy,
  };
}

/**
 * Harmonic oscillator wave function
 * ψₙ(x) = (mω/πℏ)^(1/4) * 1/√(2ⁿn!) * Hₙ(ξ) * exp(-ξ²/2)
 * where ξ = √(mω/ℏ) * x
 */
export function harmonicOscillatorWaveFunction(
  n: number,
  _params: SystemParameters,
  numPoints: number = 500
): WaveFunction {
  const xGrid: number[] = [];
  const potential: number[] = [];
  const psiReal: number[] = [];
  const psiImag: number[] = [];
  const psiProbability: number[] = [];

  // Set grid range based on energy level (wider for higher n)
  const xMax = Math.sqrt(2 * n + 1) * 2;
  const xMin = -xMax;
  const dx = (xMax - xMin) / (numPoints - 1);

  // Scaling factor for dimensionless coordinate
  const alpha = 1.0; // √(mω/ℏ) in natural units

  for (let i = 0; i < numPoints; i++) {
    const x = xMin + i * dx;
    xGrid.push(x);

    // Harmonic potential: V(x) = ½mω²x²
    // In natural units: V(x) = ½x²
    potential.push(0.5 * x * x);

    // Calculate wave function
    const xi = alpha * x; // Dimensionless coordinate
    const normalization = Math.pow(alpha / Math.sqrt(Math.PI), 0.5) / 
                          Math.sqrt(Math.pow(2, n) * factorial(n));
    
    let hermite = 0;
    if (n < hermitePolynomials.length) {
      hermite = hermitePolynomials[n](xi);
    }
    
    const gaussian = Math.exp(-xi * xi / 2);
    const psi = normalization * hermite * gaussian;

    psiReal.push(psi);
    psiImag.push(0); // Real-valued eigenstate
    psiProbability.push(psi * psi);
  }

  // Energy eigenvalue: Eₙ = ℏω(n + 1/2)
  // In natural units: Eₙ = (n + 0.5)
  const energy = n + 0.5;

  return {
    xGrid,
    potential,
    psiReal,
    psiImag,
    psiProbability,
    energy,
  };
}

/**
 * Finite square well (approximate bound states)
 * For simplicity, using infinite well solution with scaled amplitude
 */
export function finiteWellWaveFunction(
  n: number,
  params: SystemParameters,
  numPoints: number = 500
): WaveFunction {
  const L = params.wellWidth || 1.0;
  const V0 = params.barrierHeight || 10.0;
  const xGrid: number[] = [];
  const potential: number[] = [];
  const psiReal: number[] = [];
  const psiImag: number[] = [];
  const psiProbability: number[] = [];

  // Generate grid
  const xMin = -0.5 * L;
  const xMax = 1.5 * L;
  const dx = (xMax - xMin) / (numPoints - 1);

  for (let i = 0; i < numPoints; i++) {
    const x = xMin + i * dx;
    xGrid.push(x);

    // Potential: V0 outside, 0 inside
    if (x < 0 || x > L) {
      potential.push(V0);
      // Exponential decay outside well
      const decayLength = 0.1 * L;
      let psi = 0;
      if (x < 0) {
        psi = Math.exp(x / decayLength) * Math.sin(n * Math.PI * 0.01);
      } else {
        psi = Math.exp(-(x - L) / decayLength) * Math.sin(n * Math.PI * 0.99);
      }
      psiReal.push(psi * 0.3);
      psiImag.push(0);
      psiProbability.push(psi * psi * 0.09);
    } else {
      potential.push(0);
      const norm = Math.sqrt(2 / L);
      const psi = norm * Math.sin((n * Math.PI * x) / L);
      psiReal.push(psi);
      psiImag.push(0);
      psiProbability.push(psi * psi);
    }
  }

  // Energy: slightly less than infinite well due to finite barriers
  const energy = n * n * 0.9;

  return {
    xGrid,
    potential,
    psiReal,
    psiImag,
    psiProbability,
    energy,
  };
}

/**
 * Barrier tunneling (incident wave packet)
 * Simplified visualization showing tunneling through barrier
 */
export function barrierWaveFunction(
  _n: number,
  params: SystemParameters,
  numPoints: number = 500
): WaveFunction {
  const barrierWidth = params.barrierWidth || 0.5;
  const V0 = params.barrierHeight || 8.0;
  const xGrid: number[] = [];
  const potential: number[] = [];
  const psiReal: number[] = [];
  const psiImag: number[] = [];
  const psiProbability: number[] = [];

  const xMin = -2;
  const xMax = 3;
  const dx = (xMax - xMin) / (numPoints - 1);

  // Barrier location
  const barrierStart = 0;
  const barrierEnd = barrierWidth;

  // Wave packet parameters
  const k = 3; // Wave number
  const sigma = 0.3; // Packet width
  const x0 = -1; // Packet center

  for (let i = 0; i < numPoints; i++) {
    const x = xMin + i * dx;
    xGrid.push(x);

    // Potential barrier
    if (x >= barrierStart && x <= barrierEnd) {
      potential.push(V0);
    } else {
      potential.push(0);
    }

    // Gaussian wave packet
    const envelope = Math.exp(-((x - x0) ** 2) / (2 * sigma * sigma));
    const waveReal = Math.cos(k * x);
    const waveImag = Math.sin(k * x);

    let amplitude = envelope;
    // Reduce amplitude in barrier (tunneling)
    if (x >= barrierStart && x <= barrierEnd) {
      amplitude *= 0.3;
    }
    // Further reduce amplitude after barrier (transmitted part)
    if (x > barrierEnd) {
      amplitude *= 0.4;
    }

    const psiR = amplitude * waveReal;
    const psiI = amplitude * waveImag;

    psiReal.push(psiR);
    psiImag.push(psiI);
    psiProbability.push(psiR * psiR + psiI * psiI);
  }

  // Energy of incident packet
  const energy = k * k / 2; // E = ℏ²k²/(2m) in natural units

  return {
    xGrid,
    potential,
    psiReal,
    psiImag,
    psiProbability,
    energy,
  };
}

/**
 * Main function to compute wave function based on system type
 */
export function computeWaveFunction(
  systemId: string,
  n: number,
  params: SystemParameters,
  numPoints: number = 500
): WaveFunction {
  switch (systemId) {
    case 'infiniteWell':
      return infiniteWellWaveFunction(n, params, numPoints);
    case 'harmonicOscillator':
      return harmonicOscillatorWaveFunction(n, params, numPoints);
    case 'finiteWell':
      return finiteWellWaveFunction(n, params, numPoints);
    case 'barrier':
      return barrierWaveFunction(n, params, numPoints);
    default:
      return infiniteWellWaveFunction(1, params, numPoints);
  }
}
