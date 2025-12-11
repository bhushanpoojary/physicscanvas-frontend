// Physics calculations for Oscillations Lab

import type { Oscillator, Spring, DampingType } from '../types';

/**
 * Calculate spring force on an oscillator
 */
export function calculateSpringForce(
  oscillator: Oscillator,
  spring: Spring,
  otherOscillator: Oscillator | null
): number {
  // Hooke's Law: F = -k * (x - x0)
  const otherX = otherOscillator ? otherOscillator.x : getWallPosition(spring, oscillator);
  const displacement = oscillator.x - otherX;
  const extension = Math.abs(displacement) - spring.naturalLength;
  
  // Force is negative if oscillator is stretched away from equilibrium
  return -spring.k * extension * Math.sign(displacement);
}

/**
 * Get wall position for springs attached to walls
 */
function getWallPosition(spring: Spring, oscillator: Oscillator): number {
  // Wall is at the natural length distance from equilibrium
  if (spring.oscillator1Id === null) {
    // Wall on the left
    return oscillator.equilibriumX - spring.naturalLength;
  } else {
    // Wall on the right
    return oscillator.equilibriumX + spring.naturalLength;
  }
}

/**
 * Calculate damping force
 */
export function calculateDampingForce(
  velocity: number,
  dampingCoefficient: number
): number {
  // F_damping = -b * v
  return -dampingCoefficient * velocity;
}

/**
 * Calculate driving force (for resonance experiments)
 */
export function calculateDrivingForce(
  amplitude: number,
  frequency: number,
  time: number
): number {
  // F_driving = A * cos(ω * t)
  return amplitude * Math.cos(frequency * time);
}

/**
 * Get damping coefficient based on damping type
 */
export function getDampingCoefficient(
  dampingType: DampingType,
  mass: number,
  k: number
): number {
  const omega0 = Math.sqrt(k / mass); // Natural frequency
  
  switch (dampingType) {
    case 'none':
      return 0;
    case 'light':
      return 0.1 * mass * omega0; // Underdamped
    case 'critical':
      return 2 * mass * omega0; // Critically damped
    case 'heavy':
      return 3 * mass * omega0; // Overdamped
    default:
      return 0;
  }
}

/**
 * Calculate total force on an oscillator from all springs
 */
export function calculateTotalSpringForce(
  oscillator: Oscillator,
  springs: Spring[],
  oscillators: Oscillator[]
): number {
  let totalForce = 0;
  
  for (const spring of springs) {
    if (spring.oscillator1Id === oscillator.id) {
      // Spring attached to left side of oscillator
      const otherOscillator = oscillators.find(o => o.id === spring.oscillator2Id) || null;
      totalForce -= calculateSpringForce(oscillator, spring, otherOscillator);
    } else if (spring.oscillator2Id === oscillator.id) {
      // Spring attached to right side of oscillator
      const otherOscillator = spring.oscillator1Id 
        ? oscillators.find(o => o.id === spring.oscillator1Id) || null
        : null;
      totalForce += calculateSpringForce(oscillator, spring, otherOscillator);
    }
  }
  
  return totalForce;
}

/**
 * Calculate kinetic energy of an oscillator
 */
export function calculateKineticEnergy(oscillator: Oscillator): number {
  return 0.5 * oscillator.mass * oscillator.vx * oscillator.vx;
}

/**
 * Calculate potential energy stored in a spring
 */
export function calculateSpringPotentialEnergy(
  spring: Spring,
  oscillator1: Oscillator | null,
  oscillator2: Oscillator
): number {
  const x1 = oscillator1 ? oscillator1.x : getWallPosition(spring, oscillator2);
  const x2 = oscillator2.x;
  const currentLength = Math.abs(x2 - x1);
  const extension = currentLength - spring.naturalLength;
  
  // U = (1/2) * k * x^2
  return 0.5 * spring.k * extension * extension;
}

/**
 * Calculate total energy of the system
 */
export function calculateTotalEnergy(
  oscillators: Oscillator[],
  springs: Spring[]
): { total: number; kinetic: number; potential: number } {
  let kinetic = 0;
  let potential = 0;
  
  // Sum kinetic energy
  for (const oscillator of oscillators) {
    kinetic += calculateKineticEnergy(oscillator);
  }
  
  // Sum potential energy
  for (const spring of springs) {
    const osc1 = spring.oscillator1Id 
      ? oscillators.find(o => o.id === spring.oscillator1Id) || null
      : null;
    const osc2 = oscillators.find(o => o.id === spring.oscillator2Id);
    
    if (osc2) {
      potential += calculateSpringPotentialEnergy(spring, osc1, osc2);
    }
  }
  
  return {
    kinetic,
    potential,
    total: kinetic + potential,
  };
}

/**
 * Estimate the frequency of oscillation from motion data
 */
export function estimateFrequency(
  positions: number[],
  dt: number
): number {
  if (positions.length < 3) return 0;
  
  // Count zero crossings
  let crossings = 0;
  const mean = positions.reduce((a, b) => a + b, 0) / positions.length;
  
  for (let i = 1; i < positions.length; i++) {
    if ((positions[i] - mean) * (positions[i - 1] - mean) < 0) {
      crossings++;
    }
  }
  
  // Frequency = crossings / (2 * total_time)
  const totalTime = positions.length * dt;
  return crossings / (2 * totalTime);
}

/**
 * Estimate amplitude from recent motion data
 */
export function estimateAmplitude(
  oscillator: Oscillator
): number {
  return Math.abs(oscillator.x - oscillator.equilibriumX);
}

/**
 * Update oscillator positions using velocity Verlet integration
 */
export function updateOscillators(
  oscillators: Oscillator[],
  springs: Spring[],
  dampingCoefficient: number,
  hasDrivingForce: boolean,
  drivingAmplitude: number,
  drivingFrequency: number,
  time: number,
  dt: number
): Oscillator[] {
  // Calculate forces for all oscillators
  const forces = oscillators.map(oscillator => {
    let force = calculateTotalSpringForce(oscillator, springs, oscillators);
    force += calculateDampingForce(oscillator.vx, dampingCoefficient);
    
    if (hasDrivingForce) {
      force += calculateDrivingForce(drivingAmplitude, drivingFrequency, time);
    }
    
    return force;
  });
  
  // Update positions and velocities
  return oscillators.map((oscillator, i) => {
    const acceleration = forces[i] / oscillator.mass;
    
    // Velocity Verlet: v(t + dt/2) = v(t) + a(t) * dt/2
    const vHalf = oscillator.vx + acceleration * dt * 0.5;
    
    // Position: x(t + dt) = x(t) + v(t + dt/2) * dt
    const newX = oscillator.x + vHalf * dt;
    
    // Final velocity: v(t + dt) = v(t + dt/2) + a(t + dt) * dt/2
    // For simplicity, using same acceleration (can improve with recalculation)
    const newVx = vHalf + acceleration * dt * 0.5;
    
    // Update trail
    const newTrail = [...oscillator.trail];
    if (newTrail.length > 200) {
      newTrail.shift();
    }
    newTrail.push({ x: newX, y: oscillator.y, time });
    
    return {
      ...oscillator,
      x: newX,
      vx: newVx,
      trail: newTrail,
    };
  });
}

/**
 * Calculate normal mode frequencies for coupled oscillators
 */
export function calculateNormalModeFrequencies(
  oscillators: Oscillator[],
  springs: Spring[]
): number[] {
  if (oscillators.length === 2) {
    // For two coupled oscillators
    const m1 = oscillators[0].mass;
    const m2 = oscillators[1].mass;
    const k1 = springs[0]?.k || 0;
    const k2 = springs[1]?.k || 0; // Coupling spring
    const k3 = springs[2]?.k || 0;
    
    // Symmetric mode: ω₁ = √(k/m)
    const omega1 = Math.sqrt((k1 + k3) / ((m1 + m2) / 2));
    
    // Antisymmetric mode: ω₂ = √((k + 2k_c)/m)
    const omega2 = Math.sqrt((k1 + k3 + 2 * k2) / ((m1 + m2) / 2));
    
    return [omega1 / (2 * Math.PI), omega2 / (2 * Math.PI)];
  }
  
  return [];
}
