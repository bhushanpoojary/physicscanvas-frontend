import { useState, useCallback, useRef, useEffect } from 'react';
import type { OrbitalState, OrbitalSystemType } from './types';
import { ORBITAL_PRESETS } from './types';
import {
  updateCelestialBody,
  updateSpacecraft,
  calculateLagrangePoints,
} from './physics/orbital';

export interface OrbitalController {
  state: OrbitalState;
  canvasRef: React.RefObject<HTMLCanvasElement | null>;
  togglePause: () => void;
  reset: () => void;
  setSystemType: (type: OrbitalSystemType) => void;
  toggleDisplay: (
    key: keyof Pick<
      OrbitalState,
      | 'showTrails'
      | 'showVelocityVectors'
      | 'showForceVectors'
      | 'showGrid'
      | 'showOrbitalElements'
      | 'showLagrangePoints'
    >
  ) => void;
  loadPreset: (presetId: string) => void;
  setSpeed: (speed: number) => void;
  setTrailLength: (length: number) => void;
  selectObject: (id: string | null) => void;
}

export function useOrbitalController(): OrbitalController {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const animationFrameRef = useRef<number | undefined>(undefined);

  const [state, setState] = useState<OrbitalState>(() => {
    const preset = ORBITAL_PRESETS[0];
    return {
      systemType: preset.systemType,
      bodies:
        preset.bodies.map((b, i) => ({
          id: i.toString(),
          name: b.name ?? 'Body',
          x: b.x ?? 0,
          y: b.y ?? 0,
          vx: b.vx ?? 0,
          vy: b.vy ?? 0,
          mass: b.mass ?? 1e24,
          radius: b.radius ?? 20,
          color: b.color ?? '#4a90e2',
          isFixed: b.isFixed ?? false,
          trail: [],
        })) ?? [],
      spacecraft:
        preset.spacecraft?.map((s, i) => ({
          id: `sc-${i}`,
          name: s.name ?? 'Spacecraft',
          x: s.x ?? 0,
          y: s.y ?? 0,
          vx: s.vx ?? 0,
          vy: s.vy ?? 0,
          color: s.color ?? '#e74c3c',
          trail: [],
          fuel: s.fuel ?? 100,
          thrust: s.thrust ?? 10,
        })) ?? [],
      lagrangePoints: [],
      isPaused: true,
      time: 0,
      gravitationalConstant: 6.674e-11,
      showTrails: true,
      showVelocityVectors: false,
      showForceVectors: false,
      showGrid: true,
      showOrbitalElements: true,
      showLagrangePoints: preset.showLagrangePoints ?? false,
      trailLength: 1000,
      speed: 10,
      timeStep: 1,
      selectedId: null,
    };
  });

  const togglePause = useCallback(() => {
    setState((prev) => ({ ...prev, isPaused: !prev.isPaused }));
  }, []);

  const reset = useCallback(() => {
    const preset = ORBITAL_PRESETS.find((p) => p.id === 'earth-moon') ?? ORBITAL_PRESETS[0];
    setState((prev) => ({
      ...prev,
      time: 0,
      isPaused: false,
      bodies:
        preset.bodies.map((b, i) => ({
          id: i.toString(),
          name: b.name ?? 'Body',
          x: b.x ?? 0,
          y: b.y ?? 0,
          vx: b.vx ?? 0,
          vy: b.vy ?? 0,
          mass: b.mass ?? 1e24,
          radius: b.radius ?? 20,
          color: b.color ?? '#4a90e2',
          isFixed: b.isFixed ?? false,
          trail: [],
        })),
      spacecraft: [],
      lagrangePoints: [],
    }));
  }, []);

  const setSystemType = useCallback((type: OrbitalSystemType) => {
    setState((prev) => ({ ...prev, systemType: type }));
  }, []);

  const toggleDisplay = useCallback(
    (
      key: keyof Pick<
        OrbitalState,
        | 'showTrails'
        | 'showVelocityVectors'
        | 'showForceVectors'
        | 'showGrid'
        | 'showOrbitalElements'
        | 'showLagrangePoints'
      >
    ) => {
      setState((prev) => ({ ...prev, [key]: !prev[key] }));
    },
    []
  );

  const loadPreset = useCallback((presetId: string) => {
    const preset = ORBITAL_PRESETS.find((p) => p.id === presetId);
    if (!preset) return;

    setState((prev) => ({
      ...prev,
      systemType: preset.systemType,
      time: 0,
      isPaused: false,
      bodies:
        preset.bodies.map((b, i) => ({
          id: i.toString(),
          name: b.name ?? 'Body',
          x: b.x ?? 0,
          y: b.y ?? 0,
          vx: b.vx ?? 0,
          vy: b.vy ?? 0,
          mass: b.mass ?? 1e24,
          radius: b.radius ?? 20,
          color: b.color ?? '#4a90e2',
          isFixed: b.isFixed ?? false,
          trail: [],
        })),
      spacecraft:
        preset.spacecraft?.map((s, i) => ({
          id: `sc-${i}`,
          name: s.name ?? 'Spacecraft',
          x: s.x ?? 0,
          y: s.y ?? 0,
          vx: s.vx ?? 0,
          vy: s.vy ?? 0,
          color: s.color ?? '#e74c3c',
          trail: [],
          fuel: s.fuel ?? 100,
          thrust: s.thrust ?? 10,
        })) ?? [],
      lagrangePoints: [],
      showLagrangePoints: preset.showLagrangePoints ?? false,
      selectedId: null,
    }));
  }, []);

  const setSpeed = useCallback((speed: number) => {
    setState((prev) => ({ ...prev, speed }));
  }, []);

  const setTrailLength = useCallback((length: number) => {
    setState((prev) => ({ ...prev, trailLength: length }));
  }, []);

  const selectObject = useCallback((id: string | null) => {
    setState((prev) => ({ ...prev, selectedId: id }));
  }, []);

  // Animation loop
  useEffect(() => {
    if (state.isPaused) {
      if (animationFrameRef.current) {
        cancelAnimationFrame(animationFrameRef.current);
        animationFrameRef.current = undefined;
      }
      return;
    }

    let lastUpdateTime = Date.now();

    const animate = () => {
      const currentTime = Date.now();
      const elapsed = currentTime - lastUpdateTime;
      
      // Limit update rate to 20 FPS for performance
      if (elapsed < 50) {
        animationFrameRef.current = requestAnimationFrame(animate);
        return;
      }
      
      lastUpdateTime = currentTime;

      setState((prev) => {
        if (prev.isPaused) return prev;
        
        // Use larger time step for visible motion (10 seconds per frame)
        const dt = prev.timeStep * prev.speed * 10;

        // Update celestial bodies
        const updatedBodies = prev.bodies.map((body) => {
          const updated = updateCelestialBody(body, prev.bodies, prev.gravitationalConstant, dt);
          const trimmedTrail = updated.trail.slice(-prev.trailLength);
          return { ...updated, trail: trimmedTrail };
        });

        // Update spacecraft only if present (skip expensive calculation if empty)
        const updatedSpacecraft = prev.spacecraft.length > 0 
          ? prev.spacecraft.map((spacecraft) => {
              const updated = updateSpacecraft(
                spacecraft,
                updatedBodies,
                prev.gravitationalConstant,
                dt
              );
              const trimmedTrail = updated.trail.slice(-prev.trailLength);
              return { ...updated, trail: trimmedTrail };
            })
          : [];

        // Calculate Lagrange points only when checkbox is enabled
        let lagrangePoints = prev.lagrangePoints;
        if (prev.showLagrangePoints && updatedBodies.length >= 2) {
          lagrangePoints = calculateLagrangePoints(updatedBodies[0], updatedBodies[1]);
        }

        return {
          ...prev,
          time: prev.time + dt,
          bodies: updatedBodies,
          spacecraft: updatedSpacecraft,
          lagrangePoints,
        };
      });

      animationFrameRef.current = requestAnimationFrame(animate);
    };

    animationFrameRef.current = requestAnimationFrame(animate);

    return () => {
      if (animationFrameRef.current) {
        cancelAnimationFrame(animationFrameRef.current);
      }
    };
  }, [state.isPaused]);

  return {
    state,
    canvasRef,
    togglePause,
    reset,
    setSystemType,
    toggleDisplay,
    loadPreset,
    setSpeed,
    setTrailLength,
    selectObject,
  };
}
