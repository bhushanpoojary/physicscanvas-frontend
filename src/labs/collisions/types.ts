// Types for Collision Lab

export type CollisionType = 'elastic' | 'inelastic' | 'perfectly-inelastic';

export interface Ball {
  id: string;
  x: number;
  y: number;
  vx: number;
  vy: number;
  radius: number;
  mass: number;
  color: string;
  trail: Array<{ x: number; y: number }>; // For visualization
}

export interface CollisionState {
  balls: Ball[];
  collisionType: CollisionType;
  isPaused: boolean;
  showVelocityVectors: boolean;
  showMomentumVectors: boolean;
  showTrails: boolean;
  showGrid: boolean;
  
  // Conservation metrics
  totalMomentumX: number;
  totalMomentumY: number;
  totalEnergy: number;
  initialMomentumX: number;
  initialMomentumY: number;
  initialEnergy: number;
}

export interface CollisionPreset {
  id: string;
  name: string;
  description: string;
  balls: Omit<Ball, 'id' | 'trail'>[];
  collisionType: CollisionType;
}

export const COLLISION_PRESETS: CollisionPreset[] = [
  {
    id: 'head-on',
    name: 'Head-On Collision',
    description: 'Two balls collide head-on with equal mass',
    collisionType: 'elastic',
    balls: [
      { x: 200, y: 300, vx: 50, vy: 0, radius: 30, mass: 1, color: '#4a90e2' },
      { x: 600, y: 300, vx: -50, vy: 0, radius: 30, mass: 1, color: '#e74c3c' },
    ],
  },
  {
    id: 'different-masses',
    name: 'Different Masses',
    description: 'Light ball hits heavy stationary ball',
    collisionType: 'elastic',
    balls: [
      { x: 200, y: 300, vx: 80, vy: 0, radius: 25, mass: 0.5, color: '#4a90e2' },
      { x: 600, y: 300, vx: 0, vy: 0, radius: 40, mass: 2, color: '#e74c3c' },
    ],
  },
  {
    id: 'oblique',
    name: 'Oblique Collision',
    description: 'Angled collision demonstrating 2D momentum',
    collisionType: 'elastic',
    balls: [
      { x: 200, y: 200, vx: 60, vy: 30, radius: 30, mass: 1, color: '#4a90e2' },
      { x: 600, y: 350, vx: -40, vy: -20, radius: 30, mass: 1, color: '#e74c3c' },
    ],
  },
  {
    id: 'pool-break',
    name: 'Pool Break',
    description: 'Multiple ball collision (billiards-style)',
    collisionType: 'elastic',
    balls: [
      { x: 200, y: 300, vx: 100, vy: 0, radius: 20, mass: 1, color: '#4a90e2' },
      { x: 550, y: 280, vx: 0, vy: 0, radius: 20, mass: 1, color: '#e74c3c' },
      { x: 570, y: 300, vx: 0, vy: 0, radius: 20, mass: 1, color: '#f39c12' },
      { x: 550, y: 320, vx: 0, vy: 0, radius: 20, mass: 1, color: '#9b59b6' },
    ],
  },
  {
    id: 'perfectly-inelastic',
    name: 'Perfectly Inelastic',
    description: 'Balls stick together after collision',
    collisionType: 'perfectly-inelastic',
    balls: [
      { x: 200, y: 300, vx: 60, vy: 0, radius: 30, mass: 1, color: '#4a90e2' },
      { x: 600, y: 300, vx: -30, vy: 0, radius: 30, mass: 1, color: '#e74c3c' },
    ],
  },
];
