// Types for Chaos Theory Lab

export type ChaosSystemType = 'double-pendulum' | 'lorenz-attractor';

export interface DoublePendulum {
  id: string;
  theta1: number; // Angle of first pendulum (radians)
  theta2: number; // Angle of second pendulum (radians)
  omega1: number; // Angular velocity of first pendulum
  omega2: number; // Angular velocity of second pendulum
  length1: number; // Length of first rod
  length2: number; // Length of second rod
  mass1: number; // Mass of first bob
  mass2: number; // Mass of second bob
  color: string;
  trail: Array<{ x: number; y: number; time: number }>;
}

export interface LorenzPoint {
  id: string;
  x: number;
  y: number;
  z: number;
  color: string;
  trail: Array<{ x: number; y: number; z: number; time: number }>;
}

export interface ChaosState {
  systemType: ChaosSystemType;
  isPaused: boolean;
  time: number;
  gravity: number;
  
  // Double Pendulum
  pendulums: DoublePendulum[];
  
  // Lorenz Attractor
  lorenzPoints: LorenzPoint[];
  sigma: number; // Prandtl number
  rho: number; // Rayleigh number
  beta: number; // Geometric factor
  
  // Display options
  showTrails: boolean;
  showGrid: boolean;
  showEnergy: boolean;
  show3DView: boolean;
  trailLength: number;
  
  // Comparison mode for sensitivity
  comparisonMode: boolean;
  
  // Speed control
  speed: number;
}

export interface ChaosPreset {
  id: string;
  name: string;
  description: string;
  systemType: ChaosSystemType;
  pendulums?: Partial<DoublePendulum>[];
  lorenzPoints?: Partial<LorenzPoint>[];
  sigma?: number;
  rho?: number;
  beta?: number;
  comparisonMode?: boolean;
}

export const CHAOS_PRESETS: ChaosPreset[] = [
  {
    id: 'single-pendulum',
    name: 'Single Double Pendulum',
    description: 'Classic chaotic double pendulum',
    systemType: 'double-pendulum',
    pendulums: [
      {
        theta1: Math.PI / 2,
        theta2: Math.PI / 2,
        omega1: 0,
        omega2: 0,
        length1: 150,
        length2: 150,
        mass1: 1,
        mass2: 1,
        color: '#4a90e2',
      },
    ],
  },
  {
    id: 'sensitivity-demo',
    name: 'Butterfly Effect',
    description: 'Two nearly identical pendulums showing sensitivity to initial conditions',
    systemType: 'double-pendulum',
    comparisonMode: true,
    pendulums: [
      {
        theta1: Math.PI / 2,
        theta2: Math.PI / 2,
        omega1: 0,
        omega2: 0,
        length1: 150,
        length2: 150,
        mass1: 1,
        mass2: 1,
        color: '#4a90e2',
      },
      {
        theta1: Math.PI / 2 + 0.001, // Tiny difference
        theta2: Math.PI / 2,
        omega1: 0,
        omega2: 0,
        length1: 150,
        length2: 150,
        mass1: 1,
        mass2: 1,
        color: '#e74c3c',
      },
    ],
  },
  {
    id: 'lorenz-single',
    name: 'Lorenz Attractor',
    description: 'Classic strange attractor from weather modeling',
    systemType: 'lorenz-attractor',
    sigma: 10,
    rho: 28,
    beta: 8 / 3,
    lorenzPoints: [
      {
        x: 0.1,
        y: 0,
        z: 0,
        color: '#4a90e2',
      },
    ],
  },
  {
    id: 'lorenz-sensitivity',
    name: 'Lorenz Butterfly Effect',
    description: 'Multiple trajectories with slightly different initial conditions',
    systemType: 'lorenz-attractor',
    sigma: 10,
    rho: 28,
    beta: 8 / 3,
    comparisonMode: true,
    lorenzPoints: [
      { x: 0, y: 1, z: 1.05, color: '#4a90e2' },
      { x: 0.001, y: 1, z: 1.05, color: '#e74c3c' },
      { x: -0.001, y: 1, z: 1.05, color: '#2ecc71' },
    ],
  },
];
