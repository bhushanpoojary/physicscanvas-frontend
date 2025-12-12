import { useState, useCallback, useRef, useEffect } from 'react';
import type { ChaosState, ChaosSystemType, DoublePendulum, LorenzPoint } from './types';
import { CHAOS_PRESETS } from './types';
import {
  updateDoublePendulum,
  updateLorenzPoint,
  calculateDoublePendulumEnergy,
} from './physics/chaos';

export interface ChaosController {
  state: ChaosState;
  canvasRef: React.RefObject<HTMLCanvasElement | null>;
  togglePause: () => void;
  reset: () => void;
  setSystemType: (type: ChaosSystemType) => void;
  toggleDisplay: (
    key: keyof Pick<ChaosState, 'showTrails' | 'showGrid' | 'showEnergy' | 'show3DView'>
  ) => void;
  loadPreset: (presetId: string) => void;
  setSpeed: (speed: number) => void;
  setGravity: (gravity: number) => void;
  setSigma: (sigma: number) => void;
  setRho: (rho: number) => void;
  setBeta: (beta: number) => void;
  setTrailLength: (length: number) => void;
  addPendulum: () => void;
  addLorenzPoint: () => void;
  selectedItemId: string | null;
  selectItem: (id: string | null) => void;
}

export function useChaosController(): ChaosController {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [selectedItemId, setSelectedItemId] = useState<string | null>(null);
  const animationFrameRef = useRef<number | undefined>(undefined);

  const [state, setState] = useState<ChaosState>(() => {
    const preset = CHAOS_PRESETS[0];
    return {
      systemType: preset.systemType,
      isPaused: false,
      time: 0,
      gravity: 9.81,
      pendulums:
        preset.pendulums?.map((p, i) => ({
          id: i.toString(),
          theta1: p.theta1 ?? Math.PI / 2,
          theta2: p.theta2 ?? Math.PI / 2,
          omega1: p.omega1 ?? 0,
          omega2: p.omega2 ?? 0,
          length1: p.length1 ?? 150,
          length2: p.length2 ?? 150,
          mass1: p.mass1 ?? 1,
          mass2: p.mass2 ?? 1,
          color: p.color ?? '#4a90e2',
          trail: [],
        })) ?? [],
      lorenzPoints:
        preset.lorenzPoints?.map((p, i) => ({
          id: i.toString(),
          x: p.x ?? 0.1,
          y: p.y ?? 0,
          z: p.z ?? 0,
          color: p.color ?? '#4a90e2',
          trail: [],
        })) ?? [],
      sigma: preset.sigma ?? 10,
      rho: preset.rho ?? 28,
      beta: preset.beta ?? 8 / 3,
      showTrails: true,
      showGrid: true,
      showEnergy: false,
      show3DView: false,
      trailLength: 1000,
      comparisonMode: preset.comparisonMode ?? false,
      speed: 1,
    };
  });

  const togglePause = useCallback(() => {
    setState((prev) => ({ ...prev, isPaused: !prev.isPaused }));
  }, []);

  const reset = useCallback(() => {
    setState((prev) => {
      const preset = CHAOS_PRESETS.find((p) => p.systemType === prev.systemType) ?? CHAOS_PRESETS[0];
      return {
        ...prev,
        time: 0,
        isPaused: false,
        pendulums:
          preset.pendulums?.map((p, i) => ({
            id: i.toString(),
            theta1: p.theta1 ?? Math.PI / 2,
            theta2: p.theta2 ?? Math.PI / 2,
            omega1: p.omega1 ?? 0,
            omega2: p.omega2 ?? 0,
            length1: p.length1 ?? 150,
            length2: p.length2 ?? 150,
            mass1: p.mass1 ?? 1,
            mass2: p.mass2 ?? 1,
            color: p.color ?? '#4a90e2',
            trail: [],
          })) ?? prev.pendulums.map((p) => ({ ...p, trail: [], omega1: 0, omega2: 0 })),
        lorenzPoints:
          preset.lorenzPoints?.map((p, i) => ({
            id: i.toString(),
            x: p.x ?? 0.1,
            y: p.y ?? 0,
            z: p.z ?? 0,
            color: p.color ?? '#4a90e2',
            trail: [],
          })) ?? prev.lorenzPoints.map((p) => ({ ...p, trail: [] })),
      };
    });
  }, []);

  const setSystemType = useCallback((type: ChaosSystemType) => {
    setState((prev) => ({ ...prev, systemType: type }));
  }, []);

  const toggleDisplay = useCallback(
    (key: keyof Pick<ChaosState, 'showTrails' | 'showGrid' | 'showEnergy' | 'show3DView'>) => {
      setState((prev) => ({ ...prev, [key]: !prev[key] }));
    },
    []
  );

  const loadPreset = useCallback((presetId: string) => {
    const preset = CHAOS_PRESETS.find((p) => p.id === presetId);
    if (!preset) return;

    setState((prev) => ({
      ...prev,
      systemType: preset.systemType,
      time: 0,
      isPaused: false,
      pendulums:
        preset.pendulums?.map((p, i) => ({
          id: i.toString(),
          theta1: p.theta1 ?? Math.PI / 2,
          theta2: p.theta2 ?? Math.PI / 2,
          omega1: p.omega1 ?? 0,
          omega2: p.omega2 ?? 0,
          length1: p.length1 ?? 150,
          length2: p.length2 ?? 150,
          mass1: p.mass1 ?? 1,
          mass2: p.mass2 ?? 1,
          color: p.color ?? '#4a90e2',
          trail: [],
        })) ?? [],
      lorenzPoints:
        preset.lorenzPoints?.map((p, i) => ({
          id: i.toString(),
          x: p.x ?? 0.1,
          y: p.y ?? 0,
          z: p.z ?? 0,
          color: p.color ?? '#4a90e2',
          trail: [],
        })) ?? [],
      sigma: preset.sigma ?? prev.sigma,
      rho: preset.rho ?? prev.rho,
      beta: preset.beta ?? prev.beta,
      comparisonMode: preset.comparisonMode ?? false,
    }));
  }, []);

  const setSpeed = useCallback((speed: number) => {
    setState((prev) => ({ ...prev, speed }));
  }, []);

  const setGravity = useCallback((gravity: number) => {
    setState((prev) => ({ ...prev, gravity }));
  }, []);

  const setSigma = useCallback((sigma: number) => {
    setState((prev) => ({ ...prev, sigma }));
  }, []);

  const setRho = useCallback((rho: number) => {
    setState((prev) => ({ ...prev, rho }));
  }, []);

  const setBeta = useCallback((beta: number) => {
    setState((prev) => ({ ...prev, beta }));
  }, []);

  const setTrailLength = useCallback((length: number) => {
    setState((prev) => ({ ...prev, trailLength: length }));
  }, []);

  const addPendulum = useCallback(() => {
    setState((prev) => ({
      ...prev,
      pendulums: [
        ...prev.pendulums,
        {
          id: Date.now().toString(),
          theta1: Math.PI / 2 + (Math.random() - 0.5) * 0.5,
          theta2: Math.PI / 2 + (Math.random() - 0.5) * 0.5,
          omega1: 0,
          omega2: 0,
          length1: 150,
          length2: 150,
          mass1: 1,
          mass2: 1,
          color: `hsl(${Math.random() * 360}, 70%, 60%)`,
          trail: [],
        },
      ],
    }));
  }, []);

  const addLorenzPoint = useCallback(() => {
    setState((prev) => ({
      ...prev,
      lorenzPoints: [
        ...prev.lorenzPoints,
        {
          id: Date.now().toString(),
          x: (Math.random() - 0.5) * 2,
          y: (Math.random() - 0.5) * 2,
          z: 20 + (Math.random() - 0.5) * 10,
          color: `hsl(${Math.random() * 360}, 70%, 60%)`,
          trail: [],
        },
      ],
    }));
  }, []);

  const selectItem = useCallback((id: string | null) => {
    setSelectedItemId(id);
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

    let lastTime = performance.now();

    const animate = (currentTime: number) => {
      const deltaTime = (currentTime - lastTime) / 1000; // Convert to seconds
      lastTime = currentTime;

      setState((prev) => {
        const dt = Math.min(deltaTime * prev.speed, 0.05); // Cap dt to prevent instability

        // Update double pendulums
        const updatedPendulums = prev.pendulums.map((pendulum) => {
          const updated = updateDoublePendulum(pendulum, prev.gravity, dt);
          // Trim trail to max length
          const trimmedTrail = updated.trail.slice(-prev.trailLength);
          return { ...updated, trail: trimmedTrail };
        });

        // Update Lorenz points
        const updatedLorenzPoints = prev.lorenzPoints.map((point) => {
          const updated = updateLorenzPoint(point, prev.sigma, prev.rho, prev.beta, dt);
          // Trim trail to max length
          const trimmedTrail = updated.trail.slice(-prev.trailLength);
          return { ...updated, trail: trimmedTrail };
        });

        return {
          ...prev,
          time: prev.time + dt,
          pendulums: updatedPendulums,
          lorenzPoints: updatedLorenzPoints,
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
  }, [state.isPaused, state.speed]);

  return {
    state,
    canvasRef,
    togglePause,
    reset,
    setSystemType,
    toggleDisplay,
    loadPreset,
    setSpeed,
    setGravity,
    setSigma,
    setRho,
    setBeta,
    setTrailLength,
    addPendulum,
    addLorenzPoint,
    selectedItemId,
    selectItem,
  };
}
