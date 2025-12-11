// Rotational dynamics physics calculations

import type { RotatingObject } from '../types';

/**
 * Calculate angular momentum: L = I * ω
 */
export function calculateAngularMomentum(object: RotatingObject): number {
  return object.momentOfInertia * object.omega;
}

/**
 * Calculate rotational kinetic energy: KE = (1/2) * I * ω²
 */
export function calculateRotationalEnergy(object: RotatingObject): number {
  return 0.5 * object.momentOfInertia * object.omega * object.omega;
}

/**
 * Calculate total angular momentum of all objects
 */
export function calculateTotalAngularMomentum(objects: RotatingObject[]): number {
  return objects.reduce((sum, obj) => sum + calculateAngularMomentum(obj), 0);
}

/**
 * Calculate total rotational energy of all objects
 */
export function calculateTotalRotationalEnergy(objects: RotatingObject[]): number {
  return objects.reduce((sum, obj) => sum + calculateRotationalEnergy(obj), 0);
}

/**
 * Update object rotation based on applied torque and friction
 * Using: τ = I * α (Newton's second law for rotation)
 */
export function updateRotation(
  object: RotatingObject,
  dt: number,
  friction: number
): void {
  // Calculate friction torque (opposes motion)
  const frictionTorque = -friction * object.omega * 10; // Damping proportional to angular velocity
  
  // Total torque
  const totalTorque = object.appliedTorque + frictionTorque;
  
  // Angular acceleration: α = τ / I
  object.alpha = totalTorque / object.momentOfInertia;
  
  // Update angular velocity: ω = ω + α * dt
  object.omega += object.alpha * dt;
  
  // Update angle: θ = θ + ω * dt
  object.angle += object.omega * dt;
  
  // Normalize angle to [0, 2π]
  object.angle = object.angle % (2 * Math.PI);
  if (object.angle < 0) object.angle += 2 * Math.PI;
}

/**
 * Calculate tangential velocity at a given radius
 * v = ω * r
 */
export function getTangentialVelocity(omega: number, radius: number): number {
  return Math.abs(omega * radius);
}

/**
 * Calculate angular acceleration from torque
 * α = τ / I
 */
export function calculateAngularAcceleration(torque: number, momentOfInertia: number): number {
  return momentOfInertia !== 0 ? torque / momentOfInertia : 0;
}
