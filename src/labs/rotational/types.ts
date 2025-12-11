// Types for Rotational Dynamics Lab

export type RotatingObjectType = 'disk' | 'rod' | 'ring' | 'sphere';

export interface RotatingObject {
  id: string;
  type: RotatingObjectType;
  x: number; // Center x position
  y: number; // Center y position
  radius: number; // Visual radius
  mass: number; // Mass in kg
  angle: number; // Current rotation angle in radians
  omega: number; // Angular velocity in rad/s
  alpha: number; // Angular acceleration in rad/s²
  momentOfInertia: number; // Moment of inertia in kg⋅m²
  appliedTorque: number; // Applied torque in N⋅m
  color: string;
}

export interface RotationalState {
  objects: RotatingObject[];
  isPaused: boolean;
  showAngularVelocity: boolean;
  showAngularMomentum: boolean;
  showTorque: boolean;
  showGrid: boolean;
  friction: number; // Friction coefficient (0-1)
  totalAngularMomentum: number;
  totalRotationalEnergy: number;
  initialAngularMomentum: number;
  initialRotationalEnergy: number;
}

export interface RotationalPreset {
  id: string;
  name: string;
  description: string;
  objects: Omit<RotatingObject, 'id' | 'angle'>[];
}

// Moment of inertia formulas:
// Disk (solid cylinder): I = (1/2) * m * r²
// Rod (rotating about center): I = (1/12) * m * L²
// Ring (hollow cylinder): I = m * r²
// Sphere: I = (2/5) * m * r²

export function calculateMomentOfInertia(type: RotatingObjectType, mass: number, radius: number): number {
  switch (type) {
    case 'disk':
      return 0.5 * mass * radius * radius;
    case 'rod':
      // For rod, radius represents half-length
      const length = radius * 2;
      return (1 / 12) * mass * length * length;
    case 'ring':
      return mass * radius * radius;
    case 'sphere':
      return 0.4 * mass * radius * radius;
    default:
      return 0.5 * mass * radius * radius;
  }
}

export const ROTATIONAL_PRESETS: RotationalPreset[] = [
  {
    id: 'single-disk',
    name: 'Single Spinning Disk',
    description: 'One disk with initial angular velocity',
    objects: [
      {
        type: 'disk',
        x: 400,
        y: 300,
        radius: 80,
        mass: 2.0,
        omega: 5.0,
        alpha: 0,
        appliedTorque: 0,
        momentOfInertia: 0.5 * 2.0 * 80 * 80,
        color: '#4dabf7',
      },
    ],
  },
  {
    id: 'torque-demo',
    name: 'Applied Torque',
    description: 'Disk with constant applied torque',
    objects: [
      {
        type: 'disk',
        x: 400,
        y: 300,
        radius: 70,
        mass: 1.5,
        omega: 0,
        alpha: 0,
        appliedTorque: 50,
        momentOfInertia: 0.5 * 1.5 * 70 * 70,
        color: '#ff6b6b',
      },
    ],
  },
  {
    id: 'different-shapes',
    name: 'Shape Comparison',
    description: 'Compare different rotating shapes',
    objects: [
      {
        type: 'disk',
        x: 250,
        y: 200,
        radius: 50,
        mass: 1.0,
        omega: 3.0,
        alpha: 0,
        appliedTorque: 0,
        momentOfInertia: 0.5 * 1.0 * 50 * 50,
        color: '#4dabf7',
      },
      {
        type: 'ring',
        x: 550,
        y: 200,
        radius: 50,
        mass: 1.0,
        omega: 3.0,
        alpha: 0,
        appliedTorque: 0,
        momentOfInertia: 1.0 * 50 * 50,
        color: '#51cf66',
      },
      {
        type: 'sphere',
        x: 400,
        y: 400,
        radius: 50,
        mass: 1.0,
        omega: 3.0,
        alpha: 0,
        appliedTorque: 0,
        momentOfInertia: 0.4 * 1.0 * 50 * 50,
        color: '#ffd43b',
      },
    ],
  },
  {
    id: 'conservation',
    name: 'Angular Momentum Conservation',
    description: 'Two counter-rotating objects',
    objects: [
      {
        type: 'disk',
        x: 300,
        y: 300,
        radius: 60,
        mass: 1.5,
        omega: 4.0,
        alpha: 0,
        appliedTorque: 0,
        momentOfInertia: 0.5 * 1.5 * 60 * 60,
        color: '#4dabf7',
      },
      {
        type: 'disk',
        x: 500,
        y: 300,
        radius: 80,
        mass: 1.2,
        omega: -3.0,
        alpha: 0,
        appliedTorque: 0,
        momentOfInertia: 0.5 * 1.2 * 80 * 80,
        color: '#ff6b6b',
      },
    ],
  },
];
