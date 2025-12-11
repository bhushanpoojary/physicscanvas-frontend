// Lab definition types for PhysicsCanvas multi-lab architecture

export type LabId = 
  | 'mechanics' 
  | 'relativity' 
  | 'quantum-wave' 
  | 'uncertainty'
  | 'collisions'
  | 'rotational'
  | 'oscillations'
  | 'chaos'
  | 'orbital';

export interface LabDefinition {
  id: LabId;
  name: string;
  description: string;
  icon: string;
  route: string;
  color: string; // Theme color for the lab
  isAvailable: boolean; // For phased rollout
  tags: string[]; // For search functionality
}

export const LABS: LabDefinition[] = [
  {
    id: 'mechanics',
    name: 'Mechanics Lab',
    description: 'Build forces & motion simulations using Newton\'s laws',
    icon: '⚙️',
    route: '/mechanics',
    color: '#4a90e2',
    isAvailable: true,
    tags: ['classical', 'forces', 'motion', 'newton', 'dynamics'],
  },
  {
    id: 'collisions',
    name: 'Collision Lab',
    description: 'Elastic/inelastic collisions, conservation laws, 2D billiards',
    icon: '💥',
    route: '/collisions',
    color: '#ff9f43',
    isAvailable: true,
    tags: ['classical', 'momentum', 'conservation', 'energy', 'collisions'],
  },
  {
    id: 'rotational',
    name: 'Rotational Dynamics',
    description: 'Torque, angular momentum, gyroscopes, precession',
    icon: '🔄',
    route: '/rotational',
    color: '#ee5a6f',
    isAvailable: true,
    tags: ['classical', 'rotation', 'torque', 'angular', 'gyroscope'],
  },
  {
    id: 'oscillations',
    name: 'Oscillations Lab',
    description: 'Spring systems, coupled oscillators, normal modes, resonance',
    icon: '〰️',
    route: '/oscillations',
    color: '#00d2d3',
    isAvailable: true,
    tags: ['classical', 'waves', 'springs', 'harmonic', 'resonance'],
  },
  {
    id: 'chaos',
    name: 'Chaos Theory',
    description: 'Double pendulum, Lorenz attractor, sensitivity to initial conditions',
    icon: '🌀',
    route: '/chaos',
    color: '#c44569',
    isAvailable: true,
    tags: ['classical', 'chaos', 'nonlinear', 'pendulum', 'butterfly effect'],
  },
  {
    id: 'orbital',
    name: 'Orbital Mechanics',
    description: 'Kepler\'s laws, gravitational orbits, Lagrange points, spacecraft trajectories',
    icon: '🛰️',
    route: '/orbital',
    color: '#5f27cd',
    isAvailable: true,
    tags: ['classical', 'gravity', 'orbits', 'kepler', 'space', 'planets'],
  },
  {
    id: 'relativity',
    name: 'Relativity Lab',
    description: 'Explore Minkowski diagrams & time dilation',
    icon: '🌌',
    route: '/relativity',
    color: '#9b59b6',
    isAvailable: true,
    tags: ['relativity', 'spacetime', 'einstein', 'lorentz', 'minkowski'],
  },
  {
    id: 'quantum-wave',
    name: 'Quantum Wave Lab',
    description: 'Visualize Schrödinger wave functions',
    icon: '🌊',
    route: '/quantum-wave',
    color: '#1abc9c',
    isAvailable: true,
    tags: ['quantum', 'wave function', 'schrödinger', 'eigenstate', 'particle'],
  },
  {
    id: 'uncertainty',
    name: 'Uncertainty Lab',
    description: 'Explore the Heisenberg uncertainty principle',
    icon: '📊',
    route: '/uncertainty',
    color: '#e74c3c',
    isAvailable: true,
    tags: ['quantum', 'heisenberg', 'momentum', 'position', 'fourier'],
  },
];

export function getLabById(id: LabId): LabDefinition | undefined {
  return LABS.find(lab => lab.id === id);
}

export function getAvailableLabs(): LabDefinition[] {
  return LABS.filter(lab => lab.isAvailable);
}
