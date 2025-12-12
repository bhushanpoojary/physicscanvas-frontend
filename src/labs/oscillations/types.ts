// Types for Oscillations Lab

export type OscillatorType = 'single' | 'coupled-two' | 'coupled-three' | 'chain';
export type CouplingType = 'spring' | 'weak' | 'strong';
export type DampingType = 'none' | 'light' | 'critical' | 'heavy';

export interface Oscillator {
  id: string;
  x: number; // Current position
  y: number; // Fixed vertical position (for display)
  vx: number; // Velocity
  equilibriumX: number; // Rest position
  mass: number;
  color: string;
  trail: Array<{ x: number; y: number; time: number }>; // For visualization
}

export interface Spring {
  id: string;
  oscillator1Id: string | null; // null means wall
  oscillator2Id: string | null;
  k: number; // Spring constant
  naturalLength: number;
  color: string;
}

export interface OscillationState {
  oscillators: Oscillator[];
  springs: Spring[];
  oscillatorType: OscillatorType;
  couplingType: CouplingType;
  dampingType: DampingType;
  dampingCoefficient: number;
  isPaused: boolean;
  time: number;
  
  // Display options
  showVelocityVectors: boolean;
  showForceVectors: boolean;
  showTrails: boolean;
  showGrid: boolean;
  showPhaseSpace: boolean;
  showEnergyPlot: boolean;
  
  // Driving force (for resonance)
  hasDrivingForce: boolean;
  drivingAmplitude: number;
  drivingFrequency: number;
  
  // Calculated metrics
  totalEnergy: number;
  kineticEnergy: number;
  potentialEnergy: number;
  frequency: number; // Measured frequency
  period: number; // Measured period
  amplitude: number; // Measured amplitude
}

export interface OscillationPreset {
  id: string;
  name: string;
  description: string;
  oscillatorType: OscillatorType;
  couplingType: CouplingType;
  dampingType: DampingType;
  oscillators: Omit<Oscillator, 'id' | 'trail'>[];
  springs: Omit<Spring, 'id'>[];
  hasDrivingForce?: boolean;
  drivingAmplitude?: number;
  drivingFrequency?: number;
}

export const OSCILLATION_PRESETS: OscillationPreset[] = [
  {
    id: 'simple-harmonic',
    name: 'Simple Harmonic Motion',
    description: 'Single mass-spring system',
    oscillatorType: 'single',
    couplingType: 'spring',
    dampingType: 'none',
    oscillators: [
      { 
        x: 450, 
        y: 300, 
        vx: 0, 
        equilibriumX: 400, 
        mass: 1, 
        color: '#4a90e2' 
      },
    ],
    springs: [
      { 
        oscillator1Id: null, 
        oscillator2Id: '0', 
        k: 50, 
        naturalLength: 100, 
        color: '#888' 
      },
    ],
  },
  {
    id: 'damped-oscillator',
    name: 'Damped Oscillator',
    description: 'Mass-spring with damping force',
    oscillatorType: 'single',
    couplingType: 'spring',
    dampingType: 'light',
    oscillators: [
      { 
        x: 500, 
        y: 300, 
        vx: 0, 
        equilibriumX: 400, 
        mass: 1, 
        color: '#4a90e2' 
      },
    ],
    springs: [
      { 
        oscillator1Id: null, 
        oscillator2Id: '0', 
        k: 50, 
        naturalLength: 100, 
        color: '#888' 
      },
    ],
  },
  {
    id: 'driven-resonance',
    name: 'Driven Resonance',
    description: 'Oscillator with external driving force',
    oscillatorType: 'single',
    couplingType: 'spring',
    dampingType: 'light',
    oscillators: [
      { 
        x: 400, 
        y: 300, 
        vx: 0, 
        equilibriumX: 400, 
        mass: 1, 
        color: '#4a90e2' 
      },
    ],
    springs: [
      { 
        oscillator1Id: null, 
        oscillator2Id: '0', 
        k: 50, 
        naturalLength: 100, 
        color: '#888' 
      },
    ],
    hasDrivingForce: true,
    drivingAmplitude: 20,
    drivingFrequency: 1.0,
  },
  {
    id: 'coupled-equal',
    name: 'Coupled Oscillators (Equal Mass)',
    description: 'Two identical masses connected by springs',
    oscillatorType: 'coupled-two',
    couplingType: 'weak',
    dampingType: 'none',
    oscillators: [
      { 
        x: 300, 
        y: 250, 
        vx: 0, 
        equilibriumX: 300, 
        mass: 1, 
        color: '#4a90e2' 
      },
      { 
        x: 500, 
        y: 250, 
        vx: 0, 
        equilibriumX: 500, 
        mass: 1, 
        color: '#e74c3c' 
      },
    ],
    springs: [
      { 
        oscillator1Id: null, 
        oscillator2Id: '0', 
        k: 50, 
        naturalLength: 100, 
        color: '#888' 
      },
      { 
        oscillator1Id: '0', 
        oscillator2Id: '1', 
        k: 20, 
        naturalLength: 200, 
        color: '#ffa500' 
      },
      { 
        oscillator1Id: '1', 
        oscillator2Id: null, 
        k: 50, 
        naturalLength: 100, 
        color: '#888' 
      },
    ],
  },
  {
    id: 'normal-modes',
    name: 'Normal Modes',
    description: 'Symmetric and antisymmetric oscillation modes',
    oscillatorType: 'coupled-two',
    couplingType: 'weak',
    dampingType: 'none',
    oscillators: [
      { 
        x: 320, 
        y: 250, 
        vx: 30, 
        equilibriumX: 300, 
        mass: 1, 
        color: '#4a90e2' 
      },
      { 
        x: 480, 
        y: 250, 
        vx: 30, 
        equilibriumX: 500, 
        mass: 1, 
        color: '#e74c3c' 
      },
    ],
    springs: [
      { 
        oscillator1Id: null, 
        oscillator2Id: '0', 
        k: 50, 
        naturalLength: 100, 
        color: '#888' 
      },
      { 
        oscillator1Id: '0', 
        oscillator2Id: '1', 
        k: 30, 
        naturalLength: 200, 
        color: '#ffa500' 
      },
      { 
        oscillator1Id: '1', 
        oscillator2Id: null, 
        k: 50, 
        naturalLength: 100, 
        color: '#888' 
      },
    ],
  },
  {
    id: 'three-coupled',
    name: 'Three Coupled Oscillators',
    description: 'Three masses showing mode structure',
    oscillatorType: 'coupled-three',
    couplingType: 'weak',
    dampingType: 'none',
    oscillators: [
      { 
        x: 250, 
        y: 300, 
        vx: 0, 
        equilibriumX: 250, 
        mass: 1, 
        color: '#4a90e2' 
      },
      { 
        x: 420, 
        y: 300, 
        vx: 0, 
        equilibriumX: 400, 
        mass: 1, 
        color: '#e74c3c' 
      },
      { 
        x: 550, 
        y: 300, 
        vx: 0, 
        equilibriumX: 550, 
        mass: 1, 
        color: '#2ecc71' 
      },
    ],
    springs: [
      { 
        oscillator1Id: null, 
        oscillator2Id: '0', 
        k: 50, 
        naturalLength: 100, 
        color: '#888' 
      },
      { 
        oscillator1Id: '0', 
        oscillator2Id: '1', 
        k: 30, 
        naturalLength: 150, 
        color: '#ffa500' 
      },
      { 
        oscillator1Id: '1', 
        oscillator2Id: '2', 
        k: 30, 
        naturalLength: 150, 
        color: '#ffa500' 
      },
      { 
        oscillator1Id: '2', 
        oscillator2Id: null, 
        k: 50, 
        naturalLength: 100, 
        color: '#888' 
      },
    ],
  },
];
