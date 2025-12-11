// Lorentz transformation math utilities for Special Relativity

// Speed of light (in natural units, c = 1, but we'll keep it explicit for clarity)
export const SPEED_OF_LIGHT = 1;

/**
 * Calculate the Lorentz gamma factor
 * γ = 1 / √(1 - β²)
 * where β = v/c
 */
export function lorentzGamma(beta: number): number {
  if (Math.abs(beta) >= 1) {
    throw new Error('Velocity must be less than speed of light (|β| < 1)');
  }
  return 1 / Math.sqrt(1 - beta * beta);
}

/**
 * Transform spacetime coordinates from lab frame to moving frame
 * t' = γ(t - βx)
 * x' = γ(x - βt)
 * 
 * @param t - Time in lab frame
 * @param x - Position in lab frame
 * @param beta - Velocity as fraction of c (v/c)
 * @returns Transformed coordinates {tPrime, xPrime}
 */
export function lorentzTransform(
  t: number,
  x: number,
  beta: number
): { tPrime: number; xPrime: number } {
  const gamma = lorentzGamma(beta);
  return {
    tPrime: gamma * (t - beta * x),
    xPrime: gamma * (x - beta * t),
  };
}

/**
 * Inverse Lorentz transformation (moving frame to lab frame)
 * Same formula but with -β
 */
export function inverseLorentzTransform(
  tPrime: number,
  xPrime: number,
  beta: number
): { t: number; x: number } {
  const result = lorentzTransform(tPrime, xPrime, -beta);
  return { t: result.tPrime, x: result.xPrime };
}

/**
 * Calculate time dilation factor
 * Δt' = γ Δt
 */
export function timeDilation(properTime: number, beta: number): number {
  return lorentzGamma(beta) * properTime;
}

/**
 * Calculate length contraction factor
 * L' = L / γ
 */
export function lengthContraction(properLength: number, beta: number): number {
  return properLength / lorentzGamma(beta);
}

/**
 * Calculate proper time along a worldline
 * τ = √(Δt² - Δx²) in natural units (c=1)
 */
export function properTime(dt: number, dx: number): number {
  const invariant = dt * dt - dx * dx;
  if (invariant < 0) {
    // Spacelike separation - no proper time
    return 0;
  }
  return Math.sqrt(invariant);
}

/**
 * Calculate spacetime interval (invariant)
 * s² = Δt² - Δx²
 * Returns: { interval, type: 'timelike' | 'lightlike' | 'spacelike' }
 */
export function spacetimeInterval(
  dt: number,
  dx: number
): { interval: number; type: 'timelike' | 'lightlike' | 'spacelike' } {
  const s2 = dt * dt - dx * dx;
  
  if (Math.abs(s2) < 1e-10) {
    return { interval: 0, type: 'lightlike' };
  } else if (s2 > 0) {
    return { interval: Math.sqrt(s2), type: 'timelike' };
  } else {
    return { interval: Math.sqrt(-s2), type: 'spacelike' };
  }
}

/**
 * Calculate rapidity (useful for velocity addition)
 * φ = arctanh(β)
 */
export function rapidity(beta: number): number {
  return Math.atanh(beta);
}

/**
 * Convert rapidity back to velocity
 * β = tanh(φ)
 */
export function rapidityToVelocity(phi: number): number {
  return Math.tanh(phi);
}

/**
 * Relativistic velocity addition
 * β_total = (β₁ + β₂) / (1 + β₁β₂)
 */
export function velocityAddition(beta1: number, beta2: number): number {
  return (beta1 + beta2) / (1 + beta1 * beta2);
}

/**
 * Format velocity as percentage of c
 */
export function formatVelocity(beta: number): string {
  return `${(beta * 100).toFixed(1)}% c`;
}

/**
 * Format gamma factor
 */
export function formatGamma(beta: number): string {
  const gamma = lorentzGamma(beta);
  return gamma.toFixed(3);
}

/**
 * Format time dilation
 */
export function formatTimeDilation(beta: number): string {
  const gamma = lorentzGamma(beta);
  return `Δt' = ${gamma.toFixed(2)}Δt`;
}

/**
 * Format length contraction
 */
export function formatLengthContraction(beta: number): string {
  const gamma = lorentzGamma(beta);
  const factor = 1 / gamma;
  return `L' = ${factor.toFixed(2)}L`;
}
