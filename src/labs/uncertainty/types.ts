// Type definitions for Uncertainty Lab

export type UncertaintyMode = 'position-momentum' | 'energy-time';

export interface WavePacket {
  // Position space
  xGrid: number[];           // Position samples
  psiX: number[];           // ψ(x) - wave function in position space
  probabilityX: number[];   // |ψ(x)|² - probability density in x
  
  // Momentum space (Fourier transform)
  pGrid: number[];          // Momentum samples
  psiP: number[];          // φ(p) - wave function in momentum space
  probabilityP: number[];  // |φ(p)|² - probability density in p
  
  // Uncertainties
  deltaX: number;          // Position uncertainty (standard deviation)
  deltaP: number;          // Momentum uncertainty (standard deviation)
  product: number;         // Δx·Δp (should be ≥ ℏ/2)
  
  // Expectation values
  meanX: number;           // <x>
  meanP: number;           // <p>
}

export interface UncertaintyState {
  mode: UncertaintyMode;
  wavePacket: WavePacket;
  
  // Wave packet parameters
  sigma: number;           // Width parameter (controls Δx)
  x0: number;              // Center position
  k0: number;              // Center wave number (momentum p0 = ℏk0)
  
  // Display options
  showPositionSpace: boolean;
  showMomentumSpace: boolean;
  showUncertaintyProduct: boolean;
  
  // Energy-time parameters (for second mode)
  pulseWidth: number;      // Time duration Δt
  centerFrequency: number; // ω0 (energy E0 = ℏω0)
}

export interface PresetConfig {
  id: string;
  name: string;
  description: string;
  sigma: number;
  x0: number;
  k0: number;
}

export const UNCERTAINTY_PRESETS: PresetConfig[] = [
  {
    id: 'narrow-position',
    name: 'Narrow Position',
    description: 'Tightly localized in position → broad momentum distribution',
    sigma: 0.5,
    x0: 0,
    k0: 5,
  },
  {
    id: 'broad-position',
    name: 'Broad Position',
    description: 'Broad in position → narrow momentum distribution',
    sigma: 2.0,
    x0: 0,
    k0: 5,
  },
  {
    id: 'minimum-uncertainty',
    name: 'Minimum Uncertainty',
    description: 'Gaussian packet: Δx·Δp = ℏ/2 (exact minimum)',
    sigma: 1.0,
    x0: 0,
    k0: 3,
  },
  {
    id: 'moving-packet',
    name: 'Moving Wave Packet',
    description: 'Wave packet with non-zero momentum',
    sigma: 1.0,
    x0: -2,
    k0: 8,
  },
];

// Physical constants (natural units where ℏ = 1)
export const HBAR = 1.0;
export const MIN_UNCERTAINTY_PRODUCT = HBAR / 2; // ≈ 0.5
