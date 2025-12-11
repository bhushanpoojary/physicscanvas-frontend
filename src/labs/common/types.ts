// Lab definition types for PhysicsCanvas multi-lab architecture

export type LabId = 'mechanics' | 'relativity' | 'quantum-wave' | 'uncertainty';

export interface LabDefinition {
  id: LabId;
  name: string;
  description: string;
  icon: string;
  route: string;
  color: string; // Theme color for the lab
  isAvailable: boolean; // For phased rollout
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
  },
  {
    id: 'relativity',
    name: 'Relativity Lab',
    description: 'Explore Minkowski diagrams & time dilation',
    icon: '🌌',
    route: '/relativity',
    color: '#9b59b6',
    isAvailable: true,
  },
  {
    id: 'quantum-wave',
    name: 'Quantum Wave Lab',
    description: 'Visualize Schrödinger wave functions',
    icon: '🌊',
    route: '/quantum-wave',
    color: '#1abc9c',
    isAvailable: true,
  },
  {
    id: 'uncertainty',
    name: 'Uncertainty Lab',
    description: 'Explore the Heisenberg uncertainty principle',
    icon: '📊',
    route: '/uncertainty',
    color: '#e74c3c',
    isAvailable: true,
  },
];

export function getLabById(id: LabId): LabDefinition | undefined {
  return LABS.find(lab => lab.id === id);
}

export function getAvailableLabs(): LabDefinition[] {
  return LABS.filter(lab => lab.isAvailable);
}
