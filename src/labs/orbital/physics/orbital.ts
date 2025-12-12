// Physics calculations for Orbital Mechanics

import type { CelestialBody, Spacecraft, OrbitalElements, LagrangePoint } from '../types';

/**
 * Calculate gravitational force between two bodies
 */
export function calculateGravitationalForce(
  body1: { x: number; y: number; mass: number },
  body2: { x: number; y: number; mass: number },
  G: number
): { fx: number; fy: number } {
  // Convert km to meters for proper SI units (positions are in km)
  const dx = (body2.x - body1.x) * 1000;
  const dy = (body2.y - body1.y) * 1000;
  const distanceSquared = dx * dx + dy * dy;
  const distance = Math.sqrt(distanceSquared);

  if (distance < 1000) { // Less than 1 km in meters
    return { fx: 0, fy: 0 };
  }

  const forceMagnitude = (G * body1.mass * body2.mass) / distanceSquared;
  const fx = forceMagnitude * (dx / distance);
  const fy = forceMagnitude * (dy / distance);

  return { fx, fy };
}

/**
 * Update celestial body using Velocity Verlet integration
 */
export function updateCelestialBody(
  body: CelestialBody,
  bodies: CelestialBody[],
  G: number,
  dt: number
): CelestialBody {
  if (body.isFixed) {
    return body;
  }

  // Calculate total force on this body
  let totalFx = 0;
  let totalFy = 0;

  for (const otherBody of bodies) {
    if (otherBody.id === body.id) continue;

    const force = calculateGravitationalForce(body, otherBody, G);
    totalFx += force.fx;
    totalFy += force.fy;
  }

  // Calculate acceleration (m/s²)
  const ax = totalFx / body.mass;
  const ay = totalFy / body.mass;

  // Update velocity (m/s) - semi-implicit Euler for stability
  const newVx = body.vx + ax * dt;
  const newVy = body.vy + ay * dt;

  // Update position (convert m/s to km/s, then multiply by dt)
  // Positions are in km, velocities in m/s, so divide velocity by 1000
  const newX = body.x + (newVx * dt) / 1000;
  const newY = body.y + (newVy * dt) / 1000;

  return {
    ...body,
    x: newX,
    y: newY,
    vx: newVx,
    vy: newVy,
    trail: [...body.trail, { x: newX, y: newY, time: Date.now() }],
  };
}

/**
 * Update spacecraft
 */
export function updateSpacecraft(
  spacecraft: Spacecraft,
  bodies: CelestialBody[],
  G: number,
  dt: number,
  thrustVector?: { x: number; y: number }
): Spacecraft {
  // Calculate gravitational forces
  let totalFx = 0;
  let totalFy = 0;

  for (const body of bodies) {
    const force = calculateGravitationalForce(
      { x: spacecraft.x, y: spacecraft.y, mass: 1000 }, // Assume spacecraft mass
      body,
      G
    );
    totalFx += force.fx;
    totalFy += force.fy;
  }

  // Add thrust if provided
  if (thrustVector && spacecraft.fuel > 0) {
    totalFx += thrustVector.x * spacecraft.thrust;
    totalFy += thrustVector.y * spacecraft.thrust;
  }

  // Calculate acceleration (m/s²)
  const ax = totalFx / 1000;
  const ay = totalFy / 1000;

  // Update velocity (m/s)
  const newVx = spacecraft.vx + ax * dt;
  const newVy = spacecraft.vy + ay * dt;

  // Update position (convert m/s to km/s, then multiply by dt)
  const newX = spacecraft.x + (newVx * dt) / 1000;
  const newY = spacecraft.y + (newVy * dt) / 1000;

  // Update fuel if thrust was used
  const newFuel = thrustVector ? Math.max(0, spacecraft.fuel - 0.1 * dt) : spacecraft.fuel;

  return {
    ...spacecraft,
    x: newX,
    y: newY,
    vx: newVx,
    vy: newVy,
    fuel: newFuel,
    trail: [...spacecraft.trail, { x: newX, y: newY, time: Date.now() }],
  };
}

/**
 * Calculate orbital elements for a two-body system
 */
export function calculateOrbitalElements(
  orbiting: CelestialBody | Spacecraft,
  central: CelestialBody,
  G: number
): OrbitalElements {
  const dx = orbiting.x - central.x;
  const dy = orbiting.y - central.y;
  const distance = Math.sqrt(dx * dx + dy * dy);

  const velocity = Math.sqrt(orbiting.vx * orbiting.vx + orbiting.vy * orbiting.vy);

  // Specific orbital energy
  const mu = G * central.mass;
  const energy = (velocity * velocity) / 2 - mu / distance;

  // Semi-major axis (negative energy for elliptical orbits)
  const semiMajorAxis = energy !== 0 ? -mu / (2 * energy) : Infinity;

  // Angular momentum
  const hx = dy * orbiting.vx - dx * orbiting.vy;
  const h = Math.abs(hx);

  // Eccentricity
  let eccentricity = 0;
  if (semiMajorAxis > 0 && semiMajorAxis !== Infinity) {
    eccentricity = Math.sqrt(1 + (2 * energy * h * h) / (mu * mu));
  }

  // Apoapsis and periapsis
  const apoapsis = semiMajorAxis * (1 + eccentricity);
  const periapsis = semiMajorAxis * (1 - eccentricity);

  // Orbital period (Kepler's Third Law)
  const period = 2 * Math.PI * Math.sqrt((semiMajorAxis * semiMajorAxis * semiMajorAxis) / mu);

  return {
    semiMajorAxis,
    eccentricity,
    period,
    apoapsis,
    periapsis,
    velocity,
    energy,
  };
}

/**
 * Calculate Lagrange points for a two-body system
 */
export function calculateLagrangePoints(
  body1: CelestialBody,
  body2: CelestialBody
): LagrangePoint[] {
  const dx = body2.x - body1.x;
  const dy = body2.y - body1.y;
  const distance = Math.sqrt(dx * dx + dy * dy);

  if (distance === 0) return [];

  const m1 = body1.mass;
  const m2 = body2.mass;
  const totalMass = m1 + m2;

  // Center of mass
  const cmx = (m1 * body1.x + m2 * body2.x) / totalMass;
  const cmy = (m1 * body1.y + m2 * body2.y) / totalMass;

  // Direction vector from body1 to body2
  const dirX = dx / distance;
  const dirY = dy / distance;

  // L1: Between the two bodies
  const r1 = distance * (m2 / (3 * totalMass)) ** (1 / 3);
  const l1x = body1.x + dirX * (distance - r1);
  const l1y = body1.y + dirY * (distance - r1);

  // L2: Beyond body2
  const r2 = distance * (m2 / (3 * totalMass)) ** (1 / 3);
  const l2x = body2.x + dirX * r2;
  const l2y = body2.y + dirY * r2;

  // L3: Beyond body1 (opposite side)
  const r3 = distance * (5 * m2) / (12 * m1);
  const l3x = body1.x - dirX * r3;
  const l3y = body1.y - dirY * r3;

  // L4 and L5: Form equilateral triangles
  // Perpendicular to the line between bodies
  const perpX = -dirY;
  const perpY = dirX;

  const l4x = cmx + perpX * distance / 2;
  const l4y = cmy + perpY * distance / 2;

  const l5x = cmx - perpX * distance / 2;
  const l5y = cmy - perpY * distance / 2;

  return [
    { id: 'L1', type: 'L1', x: l1x, y: l1y },
    { id: 'L2', type: 'L2', x: l2x, y: l2y },
    { id: 'L3', type: 'L3', x: l3x, y: l3y },
    { id: 'L4', type: 'L4', x: l4x, y: l4y },
    { id: 'L5', type: 'L5', x: l5x, y: l5y },
  ];
}

/**
 * Calculate velocity needed for circular orbit at given radius
 */
export function calculateCircularOrbitVelocity(
  radius: number,
  centralMass: number,
  G: number
): number {
  return Math.sqrt((G * centralMass) / radius);
}

/**
 * Calculate escape velocity from a body
 */
export function calculateEscapeVelocity(
  radius: number,
  centralMass: number,
  G: number
): number {
  return Math.sqrt((2 * G * centralMass) / radius);
}
