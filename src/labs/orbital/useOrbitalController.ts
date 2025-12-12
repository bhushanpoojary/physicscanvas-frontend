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
      speed: preset.defaultSpeed ?? 10,
      timeStep: preset.defaultTimeStep ?? 1,
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
      speed: preset.defaultSpeed ?? prev.speed,
      timeStep: preset.defaultTimeStep ?? prev.timeStep,
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
      speed: preset.defaultSpeed ?? prev.speed,
      timeStep: preset.defaultTimeStep ?? prev.timeStep,
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
      
      // Limit update rate to ~16 FPS for better performance
      if (elapsed < 60) {
        animationFrameRef.current = requestAnimationFrame(animate);
        return;
      }
      
      lastUpdateTime = currentTime;

      setState((prev) => {
        if (prev.isPaused) return prev;
        
        const totalDt = prev.timeStep * prev.speed;
        const steps = Math.min(200, Math.max(1, Math.ceil(prev.speed)));
        const dt = steps > 0 ? totalDt / steps : totalDt;

        let bodies = prev.bodies;
        let spacecraft = prev.spacecraft;

        for (let step = 0; step < steps; step++) {
          const bodiesSnapshot = bodies;
          const updatedBodiesStep = bodiesSnapshot.map((body) =>
            updateCelestialBody(body, bodiesSnapshot, prev.gravitationalConstant, dt)
          );
          bodies = updatedBodiesStep;

          if (spacecraft.length > 0) {
            const spacecraftSnapshot = spacecraft;
            const updatedSpacecraftStep = spacecraftSnapshot.map((craft) =>
              updateSpacecraft(craft, bodies, prev.gravitationalConstant, dt)
            );
            spacecraft = updatedSpacecraftStep;
          }
        }

        const trimmedBodies = bodies.map((body) => ({
          ...body,
          trail: body.trail.slice(-prev.trailLength),
        }));

        const trimmedSpacecraft = spacecraft.map((craft) => ({
          ...craft,
          trail: craft.trail.slice(-prev.trailLength),
        }));

        // Calculate Lagrange points only when checkbox is enabled
        let lagrangePoints = prev.lagrangePoints;
        if (prev.showLagrangePoints && trimmedBodies.length >= 2) {
          lagrangePoints = calculateLagrangePoints(trimmedBodies[0], trimmedBodies[1]);
        }

        return {
          ...prev,
          time: prev.time + totalDt,
          bodies: trimmedBodies,
          spacecraft: trimmedSpacecraft,
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
