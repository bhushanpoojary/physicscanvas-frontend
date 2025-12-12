// Physics calculations for Chaos Theory Lab

import type { DoublePendulum, LorenzPoint } from '../types';

/**
 * Update double pendulum using Runge-Kutta 4th order method
 */
export function updateDoublePendulum(
  pendulum: DoublePendulum,
  gravity: number,
  dt: number
): DoublePendulum {
  const { theta1, theta2, omega1, omega2, length1, length2, mass1, mass2 } = pendulum;

  // Use RK4 for better accuracy with chaotic systems
  const k1 = derivatives(theta1, theta2, omega1, omega2, gravity, length1, length2, mass1, mass2);
  const k2 = derivatives(
    theta1 + 0.5 * dt * k1.dtheta1,
    theta2 + 0.5 * dt * k1.dtheta2,
    omega1 + 0.5 * dt * k1.domega1,
    omega2 + 0.5 * dt * k1.domega2,
    gravity,
    length1,
    length2,
    mass1,
    mass2
  );
  const k3 = derivatives(
    theta1 + 0.5 * dt * k2.dtheta1,
    theta2 + 0.5 * dt * k2.dtheta2,
    omega1 + 0.5 * dt * k2.domega1,
    omega2 + 0.5 * dt * k2.domega2,
    gravity,
    length1,
    length2,
    mass1,
    mass2
  );
  const k4 = derivatives(
    theta1 + dt * k3.dtheta1,
    theta2 + dt * k3.dtheta2,
    omega1 + dt * k3.domega1,
    omega2 + dt * k3.domega2,
    gravity,
    length1,
    length2,
    mass1,
    mass2
  );

  const newTheta1 = theta1 + (dt / 6) * (k1.dtheta1 + 2 * k2.dtheta1 + 2 * k3.dtheta1 + k4.dtheta1);
  const newTheta2 = theta2 + (dt / 6) * (k1.dtheta2 + 2 * k2.dtheta2 + 2 * k3.dtheta2 + k4.dtheta2);
  const newOmega1 = omega1 + (dt / 6) * (k1.domega1 + 2 * k2.domega1 + 2 * k3.domega1 + k4.domega1);
  const newOmega2 = omega2 + (dt / 6) * (k1.domega2 + 2 * k2.domega2 + 2 * k3.domega2 + k4.domega2);

  // Calculate position of second bob for trail
  const x1 = length1 * Math.sin(newTheta1);
  const y1 = length1 * Math.cos(newTheta1);
  const x2 = x1 + length2 * Math.sin(newTheta2);
  const y2 = y1 + length2 * Math.cos(newTheta2);

  return {
    ...pendulum,
    theta1: newTheta1,
    theta2: newTheta2,
    omega1: newOmega1,
    omega2: newOmega2,
    trail: [...pendulum.trail, { x: x2, y: y2, time: Date.now() }],
  };
}

/**
 * Calculate derivatives for double pendulum equations of motion
 */
function derivatives(
  theta1: number,
  theta2: number,
  omega1: number,
  omega2: number,
  g: number,
  L1: number,
  L2: number,
  m1: number,
  m2: number
) {
  const dtheta = theta2 - theta1;
  const den1 = (m1 + m2) * L1 - m2 * L1 * Math.cos(dtheta) * Math.cos(dtheta);
  const den2 = (L2 / L1) * den1;

  const domega1 =
    (m2 * L1 * omega1 * omega1 * Math.sin(dtheta) * Math.cos(dtheta) +
      m2 * g * Math.sin(theta2) * Math.cos(dtheta) +
      m2 * L2 * omega2 * omega2 * Math.sin(dtheta) -
      (m1 + m2) * g * Math.sin(theta1)) /
    den1;

  const domega2 =
    (-m2 * L2 * omega2 * omega2 * Math.sin(dtheta) * Math.cos(dtheta) +
      (m1 + m2) * g * Math.sin(theta1) * Math.cos(dtheta) -
      (m1 + m2) * L1 * omega1 * omega1 * Math.sin(dtheta) -
      (m1 + m2) * g * Math.sin(theta2)) /
    den2;

  return {
    dtheta1: omega1,
    dtheta2: omega2,
    domega1,
    domega2,
  };
}

/**
 * Calculate energy of double pendulum
 */
export function calculateDoublePendulumEnergy(
  pendulum: DoublePendulum,
  gravity: number
): { kinetic: number; potential: number; total: number } {
  const { theta1, theta2, omega1, omega2, length1, length2, mass1, mass2 } = pendulum;

  // Position of masses
  const y1 = -length1 * Math.cos(theta1);
  const y2 = y1 - length2 * Math.cos(theta2);

  // Velocity of first mass
  const vx1 = length1 * omega1 * Math.cos(theta1);
  const vy1 = length1 * omega1 * Math.sin(theta1);
  const v1_squared = vx1 * vx1 + vy1 * vy1;

  // Velocity of second mass
  const vx2 = vx1 + length2 * omega2 * Math.cos(theta2);
  const vy2 = vy1 + length2 * omega2 * Math.sin(theta2);
  const v2_squared = vx2 * vx2 + vy2 * vy2;

  const kinetic = 0.5 * mass1 * v1_squared + 0.5 * mass2 * v2_squared;
  const potential = mass1 * gravity * y1 + mass2 * gravity * y2;
  const total = kinetic + potential;

  return { kinetic, potential, total };
}

/**
 * Update Lorenz system using RK4
 */
export function updateLorenzPoint(
  point: LorenzPoint,
  sigma: number,
  rho: number,
  beta: number,
  dt: number
): LorenzPoint {
  const { x, y, z } = point;

  // RK4 integration
  const k1 = lorenzDerivatives(x, y, z, sigma, rho, beta);
  const k2 = lorenzDerivatives(
    x + 0.5 * dt * k1.dx,
    y + 0.5 * dt * k1.dy,
    z + 0.5 * dt * k1.dz,
    sigma,
    rho,
    beta
  );
  const k3 = lorenzDerivatives(
    x + 0.5 * dt * k2.dx,
    y + 0.5 * dt * k2.dy,
    z + 0.5 * dt * k2.dz,
    sigma,
    rho,
    beta
  );
  const k4 = lorenzDerivatives(
    x + dt * k3.dx,
    y + dt * k3.dy,
    z + dt * k3.dz,
    sigma,
    rho,
    beta
  );

  const newX = x + (dt / 6) * (k1.dx + 2 * k2.dx + 2 * k3.dx + k4.dx);
  const newY = y + (dt / 6) * (k1.dy + 2 * k2.dy + 2 * k3.dy + k4.dy);
  const newZ = z + (dt / 6) * (k1.dz + 2 * k2.dz + 2 * k3.dz + k4.dz);

  return {
    ...point,
    x: newX,
    y: newY,
    z: newZ,
    trail: [...point.trail, { x: newX, y: newY, z: newZ, time: Date.now() }],
  };
}

/**
 * Lorenz system equations
 */
function lorenzDerivatives(
  x: number,
  y: number,
  z: number,
  sigma: number,
  rho: number,
  beta: number
) {
  return {
    dx: sigma * (y - x),
    dy: x * (rho - z) - y,
    dz: x * y - beta * z,
  };
}
