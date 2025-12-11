// Collision physics calculations

import type { Ball, CollisionType } from '../types';

/**
 * Detect collision between two balls
 */
export function detectCollision(ball1: Ball, ball2: Ball): boolean {
  const dx = ball2.x - ball1.x;
  const dy = ball2.y - ball1.y;
  const distance = Math.sqrt(dx * dx + dy * dy);
  return distance < ball1.radius + ball2.radius;
}

/**
 * Handle elastic collision between two balls
 */
export function handleElasticCollision(ball1: Ball, ball2: Ball): void {
  // Calculate collision normal
  const dx = ball2.x - ball1.x;
  const dy = ball2.y - ball1.y;
  const distance = Math.sqrt(dx * dx + dy * dy);
  
  if (distance === 0) return; // Avoid division by zero
  
  // Unit normal vector
  const nx = dx / distance;
  const ny = dy / distance;
  
  // Unit tangent vector
  const tx = -ny;
  const ty = nx;
  
  // Project velocities onto normal and tangent
  const v1n = ball1.vx * nx + ball1.vy * ny;
  const v1t = ball1.vx * tx + ball1.vy * ty;
  const v2n = ball2.vx * nx + ball2.vy * ny;
  const v2t = ball2.vx * tx + ball2.vy * ty;
  
  // Tangential velocities unchanged
  // Calculate new normal velocities using 1D elastic collision formula
  const m1 = ball1.mass;
  const m2 = ball2.mass;
  
  const v1nNew = ((m1 - m2) * v1n + 2 * m2 * v2n) / (m1 + m2);
  const v2nNew = ((m2 - m1) * v2n + 2 * m1 * v1n) / (m1 + m2);
  
  // Convert back to x,y coordinates
  ball1.vx = v1nNew * nx + v1t * tx;
  ball1.vy = v1nNew * ny + v1t * ty;
  ball2.vx = v2nNew * nx + v2t * tx;
  ball2.vy = v2nNew * ny + v2t * ty;
  
  // Separate balls to avoid overlap
  const overlap = ball1.radius + ball2.radius - distance;
  if (overlap > 0) {
    const separationX = (overlap / 2) * nx;
    const separationY = (overlap / 2) * ny;
    ball1.x -= separationX;
    ball1.y -= separationY;
    ball2.x += separationX;
    ball2.y += separationY;
  }
}

/**
 * Handle inelastic collision (energy is lost but balls separate)
 */
export function handleInelasticCollision(ball1: Ball, ball2: Ball, restitution: number = 0.5): void {
  // Similar to elastic but with coefficient of restitution
  const dx = ball2.x - ball1.x;
  const dy = ball2.y - ball1.y;
  const distance = Math.sqrt(dx * dx + dy * dy);
  
  if (distance === 0) return;
  
  const nx = dx / distance;
  const ny = dy / distance;
  const tx = -ny;
  const ty = nx;
  
  const v1n = ball1.vx * nx + ball1.vy * ny;
  const v1t = ball1.vx * tx + ball1.vy * ty;
  const v2n = ball2.vx * nx + ball2.vy * ny;
  const v2t = ball2.vx * tx + ball2.vy * ty;
  
  const m1 = ball1.mass;
  const m2 = ball2.mass;
  
  // Include coefficient of restitution
  const v1nNew = ((m1 - restitution * m2) * v1n + (1 + restitution) * m2 * v2n) / (m1 + m2);
  const v2nNew = ((m2 - restitution * m1) * v2n + (1 + restitution) * m1 * v1n) / (m1 + m2);
  
  ball1.vx = v1nNew * nx + v1t * tx;
  ball1.vy = v1nNew * ny + v1t * ty;
  ball2.vx = v2nNew * nx + v2t * tx;
  ball2.vy = v2nNew * ny + v2t * ty;
  
  // Separate balls
  const overlap = ball1.radius + ball2.radius - distance;
  if (overlap > 0) {
    const separationX = (overlap / 2) * nx;
    const separationY = (overlap / 2) * ny;
    ball1.x -= separationX;
    ball1.y -= separationY;
    ball2.x += separationX;
    ball2.y += separationY;
  }
}

/**
 * Handle perfectly inelastic collision (balls stick together)
 */
export function handlePerfectlyInelasticCollision(ball1: Ball, ball2: Ball): void {
  // Conservation of momentum: (m1*v1 + m2*v2) / (m1 + m2)
  const totalMass = ball1.mass + ball2.mass;
  const finalVx = (ball1.mass * ball1.vx + ball2.mass * ball2.vx) / totalMass;
  const finalVy = (ball1.mass * ball1.vy + ball2.mass * ball2.vy) / totalMass;
  
  ball1.vx = finalVx;
  ball1.vy = finalVy;
  ball2.vx = finalVx;
  ball2.vy = finalVy;
  
  // Move balls to center of mass
  const cmX = (ball1.mass * ball1.x + ball2.mass * ball2.x) / totalMass;
  const cmY = (ball1.mass * ball1.y + ball2.mass * ball2.y) / totalMass;
  
  ball1.x = cmX;
  ball1.y = cmY;
  ball2.x = cmX;
  ball2.y = cmY;
}

/**
 * Handle collision based on type
 */
export function handleCollision(ball1: Ball, ball2: Ball, type: CollisionType): void {
  switch (type) {
    case 'elastic':
      handleElasticCollision(ball1, ball2);
      break;
    case 'inelastic':
      handleInelasticCollision(ball1, ball2, 0.7); // 70% restitution
      break;
    case 'perfectly-inelastic':
      handlePerfectlyInelasticCollision(ball1, ball2);
      break;
  }
}

/**
 * Calculate total momentum
 */
export function calculateTotalMomentum(balls: Ball[]): { x: number; y: number } {
  let px = 0;
  let py = 0;
  balls.forEach(ball => {
    px += ball.mass * ball.vx;
    py += ball.mass * ball.vy;
  });
  return { x: px, y: py };
}

/**
 * Calculate total kinetic energy
 */
export function calculateTotalEnergy(balls: Ball[]): number {
  let energy = 0;
  balls.forEach(ball => {
    energy += 0.5 * ball.mass * (ball.vx * ball.vx + ball.vy * ball.vy);
  });
  return energy;
}

/**
 * Handle wall collisions
 */
export function handleWallCollision(ball: Ball, width: number, height: number, restitution: number = 1.0): void {
  // Left/right walls
  if (ball.x - ball.radius < 0) {
    ball.x = ball.radius;
    ball.vx = -ball.vx * restitution;
  } else if (ball.x + ball.radius > width) {
    ball.x = width - ball.radius;
    ball.vx = -ball.vx * restitution;
  }
  
  // Top/bottom walls
  if (ball.y - ball.radius < 0) {
    ball.y = ball.radius;
    ball.vy = -ball.vy * restitution;
  } else if (ball.y + ball.radius > height) {
    ball.y = height - ball.radius;
    ball.vy = -ball.vy * restitution;
  }
}
