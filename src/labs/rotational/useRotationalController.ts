import { useState, useRef, useEffect, useCallback } from 'react';
import type { RotatingObject, RotationalState, RotatingObjectType } from './types';
import { ROTATIONAL_PRESETS, calculateMomentOfInertia } from './types';
import {
  updateRotation,
  calculateTotalAngularMomentum,
  calculateTotalRotationalEnergy,
} from './physics/rotational';

export interface RotationalController {
  state: RotationalState;
  canvasRef: React.RefObject<HTMLCanvasElement | null>;
  togglePause: () => void;
  reset: () => void;
  toggleDisplay: (key: 'showAngularVelocity' | 'showAngularMomentum' | 'showTorque' | 'showGrid') => void;
  setFriction: (friction: number) => void;
  loadPreset: (presetId: string) => void;
  addObject: (x: number, y: number, type: RotatingObjectType) => void;
  updateObjectOmega: (id: string, omega: number) => void;
  updateObjectTorque: (id: string, torque: number) => void;
  deleteObject: (id: string) => void;
  selectedObjectId: string | null;
  selectObject: (id: string | null) => void;
}

export function useRotationalController(): RotationalController {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [selectedObjectId, setSelectedObjectId] = useState<string | null>(null);

  const [state, setState] = useState<RotationalState>(() => {
    const preset = ROTATIONAL_PRESETS[0];
    const objects = preset.objects.map((obj, i) => ({
      ...obj,
      id: `object-${i}`,
      angle: 0,
    }));

    const angularMomentum = calculateTotalAngularMomentum(objects);
    const rotationalEnergy = calculateTotalRotationalEnergy(objects);

    return {
      objects,
      isPaused: true,
      showAngularVelocity: true,
      showAngularMomentum: false,
      showTorque: false,
      showGrid: true,
      friction: 0.0,
      totalAngularMomentum: angularMomentum,
      totalRotationalEnergy: rotationalEnergy,
      initialAngularMomentum: angularMomentum,
      initialRotationalEnergy: rotationalEnergy,
    };
  });

  // Animation loop
  useEffect(() => {
    if (state.isPaused) return;

    let animationId: number | null = null;
    let lastTime = Date.now();

    const animate = () => {
      const now = Date.now();
      const dt = Math.min((now - lastTime) / 1000, 0.033); // Max 33ms
      lastTime = now;

      setState(prev => {
        const newObjects = prev.objects.map(obj => {
          const newObj = { ...obj };
          updateRotation(newObj, dt, prev.friction);
          return newObj;
        });

        const angularMomentum = calculateTotalAngularMomentum(newObjects);
        const rotationalEnergy = calculateTotalRotationalEnergy(newObjects);

        return {
          ...prev,
          objects: newObjects,
          totalAngularMomentum: angularMomentum,
          totalRotationalEnergy: rotationalEnergy,
        };
      });

      animationId = requestAnimationFrame(animate);
    };

    animationId = requestAnimationFrame(animate);

    return () => {
      if (animationId !== null) {
        cancelAnimationFrame(animationId);
      }
    };
  }, [state.isPaused, state.friction]);

  const togglePause = useCallback(() => {
    setState(prev => ({ ...prev, isPaused: !prev.isPaused }));
  }, []);

  const reset = useCallback(() => {
    setState(prev => {
      const preset = ROTATIONAL_PRESETS[0];
      const objects = preset.objects.map((obj, i) => ({
        ...obj,
        id: `object-${i}`,
        angle: 0,
      }));

      const angularMomentum = calculateTotalAngularMomentum(objects);
      const rotationalEnergy = calculateTotalRotationalEnergy(objects);

      return {
        ...prev,
        objects,
        isPaused: true,
        totalAngularMomentum: angularMomentum,
        totalRotationalEnergy: rotationalEnergy,
        initialAngularMomentum: angularMomentum,
        initialRotationalEnergy: rotationalEnergy,
      };
    });
    setSelectedObjectId(null);
  }, []);

  const toggleDisplay = useCallback((key: 'showAngularVelocity' | 'showAngularMomentum' | 'showTorque' | 'showGrid') => {
    setState(prev => ({ ...prev, [key]: !prev[key] }));
  }, []);

  const setFriction = useCallback((friction: number) => {
    setState(prev => ({ ...prev, friction }));
  }, []);

  const loadPreset = useCallback((presetId: string) => {
    const preset = ROTATIONAL_PRESETS.find(p => p.id === presetId);
    if (!preset) return;

    const objects = preset.objects.map((obj, i) => ({
      ...obj,
      id: `object-${i}`,
      angle: 0,
    }));

    const angularMomentum = calculateTotalAngularMomentum(objects);
    const rotationalEnergy = calculateTotalRotationalEnergy(objects);

    setState(prev => ({
      ...prev,
      objects,
      isPaused: true,
      totalAngularMomentum: angularMomentum,
      totalRotationalEnergy: rotationalEnergy,
      initialAngularMomentum: angularMomentum,
      initialRotationalEnergy: rotationalEnergy,
    }));
    setSelectedObjectId(null);
  }, []);

  const addObject = useCallback((x: number, y: number, type: RotatingObjectType) => {
    setState(prev => {
      const newObject: RotatingObject = {
        id: `object-${Date.now()}`,
        type,
        x,
        y,
        radius: 60,
        mass: 1.5,
        angle: 0,
        omega: 2.0,
        alpha: 0,
        appliedTorque: 0,
        momentOfInertia: calculateMomentOfInertia(type, 1.5, 60),
        color: ['#4dabf7', '#51cf66', '#ffd43b', '#ff6b6b'][Math.floor(Math.random() * 4)],
      };

      const newObjects = [...prev.objects, newObject];
      const angularMomentum = calculateTotalAngularMomentum(newObjects);
      const rotationalEnergy = calculateTotalRotationalEnergy(newObjects);

      return {
        ...prev,
        objects: newObjects,
        totalAngularMomentum: angularMomentum,
        totalRotationalEnergy: rotationalEnergy,
      };
    });
  }, []);

  const updateObjectOmega = useCallback((id: string, omega: number) => {
    setState(prev => {
      const newObjects = prev.objects.map(obj =>
        obj.id === id ? { ...obj, omega } : obj
      );

      const angularMomentum = calculateTotalAngularMomentum(newObjects);
      const rotationalEnergy = calculateTotalRotationalEnergy(newObjects);

      return {
        ...prev,
        objects: newObjects,
        totalAngularMomentum: angularMomentum,
        totalRotationalEnergy: rotationalEnergy,
      };
    });
  }, []);

  const updateObjectTorque = useCallback((id: string, torque: number) => {
    setState(prev => ({
      ...prev,
      objects: prev.objects.map(obj =>
        obj.id === id ? { ...obj, appliedTorque: torque } : obj
      ),
    }));
  }, []);

  const deleteObject = useCallback((id: string) => {
    setState(prev => {
      const newObjects = prev.objects.filter(obj => obj.id !== id);
      const angularMomentum = calculateTotalAngularMomentum(newObjects);
      const rotationalEnergy = calculateTotalRotationalEnergy(newObjects);

      return {
        ...prev,
        objects: newObjects,
        totalAngularMomentum: angularMomentum,
        totalRotationalEnergy: rotationalEnergy,
      };
    });
    setSelectedObjectId(null);
  }, []);

  const selectObject = useCallback((id: string | null) => {
    setSelectedObjectId(id);
  }, []);

  return {
    state,
    canvasRef,
    togglePause,
    reset,
    toggleDisplay,
    setFriction,
    loadPreset,
    addObject,
    updateObjectOmega,
    updateObjectTorque,
    deleteObject,
    selectedObjectId,
    selectObject,
  };
}
