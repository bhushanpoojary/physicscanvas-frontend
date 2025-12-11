// Type definitions for Relativity Lab

export type RelativityObjectId = string;

export type RelativityToolType = 'observer' | 'event' | 'light-pulse';

export type ScenePresetId = 
  | 'empty'
  | 'simultaneity'
  | 'timeDilation'
  | 'lengthContraction'
  | 'lightClock';

/**
 * An inertial observer (reference frame)
 */
export interface Observer {
  id: RelativityObjectId;
  label: string;
  velocity: number;        // β = v/c, range: [-0.99, 0.99]
  color: string;
  x0: number;              // Initial position at t=0
}

/**
 * A spacetime event (point in spacetime)
 */
export interface Event {
  id: RelativityObjectId;
  label: string;
  t: number;               // Time coordinate (lab frame)
  x: number;               // Position coordinate (lab frame)
  color: string;
}

/**
 * A light pulse (photon worldline)
 */
export interface LightPulse {
  id: RelativityObjectId;
  label: string;
  originT: number;         // Origin time
  originX: number;         // Origin position
  direction: 1 | -1;       // +1 for forward, -1 for backward
  color: string;
}

/**
 * Selection state
 */
export interface Selection {
  type: 'observer' | 'event' | 'light-pulse' | null;
  id: RelativityObjectId | null;
}

/**
 * Viewport/camera settings for the spacetime diagram
 */
export interface Viewport {
  centerT: number;         // Center time coordinate
  centerX: number;         // Center space coordinate
  scale: number;           // Pixels per unit
  minT: number;
  maxT: number;
  minX: number;
  maxX: number;
}

/**
 * Observer properties for the properties panel
 */
export interface ObserverProperties {
  id: RelativityObjectId;
  label: string;
  velocity: number;        // β
  gamma: number;           // Lorentz factor
  timeDilation: string;    // Formatted: "Δt' = 1.15Δt"
  lengthContraction: string; // Formatted: "L' = 0.87L"
}

/**
 * Event properties for the properties panel
 */
export interface EventProperties {
  id: RelativityObjectId;
  label: string;
  
  // Lab frame coordinates
  t: number;
  x: number;
  
  // Coordinates in selected observer's frame (if any)
  tPrime?: number;
  xPrime?: number;
  observerFrame?: string;  // Name of observer whose frame we're viewing
}

/**
 * Complete relativity simulation state
 */
export interface RelativityState {
  observers: Observer[];
  events: Event[];
  lightPulses: LightPulse[];
  selection: Selection;
  viewport: Viewport;
  referenceObserverId: RelativityObjectId | null; // For showing transformed coordinates
  showLightCone: boolean;
  showGrid: boolean;
}
