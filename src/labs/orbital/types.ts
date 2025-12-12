// Types for Orbital Mechanics Lab

export type OrbitalSystemType = 'two-body' | 'three-body' | 'lagrange' | 'mission';

export interface CelestialBody {
  id: string;
  name: string;
  x: number;
  y: number;
  vx: number;
  vy: number;
  mass: number;
  radius: number;
  color: string;
  isFixed: boolean; // For central bodies like the Sun
  trail: Array<{ x: number; y: number; time: number }>;
}

export interface Spacecraft {
  id: string;
  name: string;
  x: number;
  y: number;
  vx: number;
  vy: number;
  color: string;
  trail: Array<{ x: number; y: number; time: number }>;
  fuel: number;
  thrust: number;
}

export interface LagrangePoint {
  id: string;
  type: 'L1' | 'L2' | 'L3' | 'L4' | 'L5';
  x: number;
  y: number;
}

export interface OrbitalState {
  systemType: OrbitalSystemType;
  bodies: CelestialBody[];
  spacecraft: Spacecraft[];
  lagrangePoints: LagrangePoint[];
  
  isPaused: boolean;
  time: number;
  gravitationalConstant: number;
  
  // Display options
  showTrails: boolean;
  showVelocityVectors: boolean;
  showForceVectors: boolean;
  showGrid: boolean;
  showOrbitalElements: boolean;
  showLagrangePoints: boolean;
  trailLength: number;
  
  // Simulation settings
  speed: number;
  timeStep: number;
  
  // Selected object
  selectedId: string | null;
}

export interface OrbitalElements {
  semiMajorAxis: number;
  eccentricity: number;
  period: number;
  apoapsis: number;
  periapsis: number;
  velocity: number;
  energy: number;
}

export interface OrbitalPreset {
  id: string;
  name: string;
  description: string;
  systemType: OrbitalSystemType;
  bodies: Partial<CelestialBody>[];
  spacecraft?: Partial<Spacecraft>[];
  showLagrangePoints?: boolean;
  defaultSpeed?: number;
  defaultTimeStep?: number;
}

export const ORBITAL_PRESETS: OrbitalPreset[] = [
  {
    id: 'earth-moon',
    name: 'Earth-Moon System',
    description: 'Simple two-body orbital system',
    systemType: 'two-body',
    defaultSpeed: 200,
    defaultTimeStep: 300,
    bodies: [
      {
        name: 'Earth',
        x: 0,
        y: 0,
        vx: 0,
        vy: 0,
        mass: 5.972e24,
        radius: 30,
        color: '#4a90e2',
        isFixed: true,
      },
      {
        name: 'Moon',
        x: 384400,
        y: 0,
        vx: 0,
        vy: 1022,
        mass: 7.342e22,
        radius: 10,
        color: '#bbb',
        isFixed: false,
      },
    ],
  },
  {
    id: 'circular-orbit',
    name: 'Circular Orbit',
    description: 'Perfect circular orbit around Earth',
    systemType: 'two-body',
    defaultSpeed: 250,
    defaultTimeStep: 300,
    bodies: [
      {
        name: 'Earth',
        x: 0,
        y: 0,
        vx: 0,
        vy: 0,
        mass: 5.972e24,
        radius: 30,
        color: '#4a90e2',
        isFixed: true,
      },
      {
        name: 'Satellite',
        x: 42164,
        y: 0,
        vx: 0,
        vy: 3075,
        mass: 1000,
        radius: 5,
        color: '#e74c3c',
        isFixed: false,
      },
    ],
  },
  {
    id: 'elliptical-orbit',
    name: 'Elliptical Orbit',
    description: 'Highly elliptical orbit (Kepler\'s First Law)',
    systemType: 'two-body',
    defaultSpeed: 200,
    defaultTimeStep: 300,
    bodies: [
      {
        name: 'Sun',
        x: 0,
        y: 0,
        vx: 0,
        vy: 0,
        mass: 1.989e30,
        radius: 40,
        color: '#f39c12',
        isFixed: true,
      },
      {
        name: 'Comet',
        x: 10000000,
        y: 0,
        vx: 0,
        vy: 100000,
        mass: 1e12,
        radius: 8,
        color: '#95a5a6',
        isFixed: false,
      },
    ],
  },
  {
    id: 'lagrange-points',
    name: 'Lagrange Points',
    description: 'Earth-Moon system showing L1-L5 Lagrange points',
    systemType: 'lagrange',
    showLagrangePoints: true,
    defaultSpeed: 200,
    defaultTimeStep: 300,
    bodies: [
      {
        name: 'Earth',
        x: -4671,
        y: 0,
        vx: 0,
        vy: -12.5,
        mass: 5.972e24,
        radius: 30,
        color: '#4a90e2',
        isFixed: false,
      },
      {
        name: 'Moon',
        x: 379729,
        y: 0,
        vx: 0,
        vy: 1009.5,
        mass: 7.342e22,
        radius: 10,
        color: '#bbb',
        isFixed: false,
      },
    ],
  },
];
