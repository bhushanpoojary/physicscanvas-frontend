// Type definitions for Quantum Wave Lab

export type QuantumSystemId = 
  | 'infiniteWell'
  | 'harmonicOscillator'
  | 'finiteWell'
  | 'barrier';

export interface QuantumSystem {
  id: QuantumSystemId;
  name: string;
  description: string;
  maxLevels: number;
  parameters: SystemParameters;
}

export interface SystemParameters {
  // Infinite well
  wellWidth?: number;      // L (in nm)
  
  // Harmonic oscillator
  omega?: number;          // Angular frequency
  
  // Finite well / barrier
  barrierHeight?: number;  // V₀ (in eV)
  barrierWidth?: number;   // Width (in nm)
}

export interface WaveFunction {
  xGrid: number[];           // Position samples (nm)
  potential: number[];       // V(x) at each position (eV)
  psiReal: number[];         // Re[ψ(x)]
  psiImag: number[];         // Im[ψ(x)] - for time evolution
  psiProbability: number[];  // |ψ(x)|²
  energy: number;            // Energy eigenvalue (eV)
}

export interface QuantumState {
  system: QuantumSystem;
  energyLevel: number;       // n = 1, 2, 3, ...
  waveFunction: WaveFunction;
  
  // Display options
  showReal: boolean;
  showImaginary: boolean;
  showProbability: boolean;
  showPotential: boolean;
  
  // Visualization settings
  xMin: number;
  xMax: number;
  numPoints: number;
}

export const QUANTUM_SYSTEMS: QuantumSystem[] = [
  {
    id: 'infiniteWell',
    name: 'Infinite Square Well',
    description: 'Particle in a box with infinite potential walls',
    maxLevels: 8,
    parameters: {
      wellWidth: 1.0, // nm
    },
  },
  {
    id: 'harmonicOscillator',
    name: 'Harmonic Oscillator',
    description: 'Quantum harmonic oscillator (parabolic potential)',
    maxLevels: 6,
    parameters: {
      omega: 1.0,
    },
  },
  {
    id: 'finiteWell',
    name: 'Finite Square Well',
    description: 'Particle in a box with finite potential walls',
    maxLevels: 4,
    parameters: {
      wellWidth: 1.0,
      barrierHeight: 10.0,
    },
  },
  {
    id: 'barrier',
    name: 'Potential Barrier (Tunneling)',
    description: 'Demonstrates quantum tunneling effect',
    maxLevels: 1,
    parameters: {
      barrierWidth: 0.5,
      barrierHeight: 8.0,
    },
  },
];

export function getSystemById(id: QuantumSystemId): QuantumSystem | undefined {
  return QUANTUM_SYSTEMS.find(sys => sys.id === id);
}

// Physical constants (SI units)
export const CONSTANTS = {
  HBAR: 1.054571817e-34,     // Reduced Planck constant (J·s)
  ELECTRON_MASS: 9.1093837e-31, // Electron mass (kg)
  EV_TO_JOULE: 1.602176634e-19, // Conversion factor
  NM_TO_METER: 1e-9,         // Nanometer to meter
};
