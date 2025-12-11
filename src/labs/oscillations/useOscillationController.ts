import { useState, useCallback, useRef, useEffect } from 'react';
import type { Oscillator, Spring, OscillationState, OscillatorType, CouplingType, DampingType } from './types';
import { OSCILLATION_PRESETS } from './types';
import {
  updateOscillators,
  calculateTotalEnergy,
  getDampingCoefficient,
  estimateAmplitude,
  calculateNormalModeFrequencies,
} from './physics/oscillations';

export interface OscillationController {
  state: OscillationState;
  canvasRef: React.RefObject<HTMLCanvasElement | null>;
  togglePause: () => void;
  reset: () => void;
  setOscillatorType: (type: OscillatorType) => void;
  setCouplingType: (type: CouplingType) => void;
  setDampingType: (type: DampingType) => void;
  toggleDisplay: (key: keyof Pick<OscillationState, 'showVelocityVectors' | 'showForceVectors' | 'showTrails' | 'showGrid' | 'showPhaseSpace' | 'showEnergyPlot'>) => void;
  loadPreset: (presetId: string) => void;
  updateOscillatorPosition: (id: string, x: number) => void;
  updateOscillatorVelocity: (id: string, vx: number) => void;
  updateSpringConstant: (id: string, k: number) => void;
  toggleDrivingForce: () => void;
  setDrivingAmplitude: (amplitude: number) => void;
  setDrivingFrequency: (frequency: number) => void;
  selectedOscillatorId: string | null;
  selectOscillator: (id: string | null) => void;
}

export function useOscillationController(): OscillationController {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [selectedOscillatorId, setSelectedOscillatorId] = useState<string | null>(null);
  const animationFrameRef = useRef<number>();

  const [state, setState] = useState<OscillationState>(() => {
    const preset = OSCILLATION_PRESETS[0];
    const oscillators = preset.oscillators.map((o, i) => ({
      ...o,
      id: `osc-${i}`,
      trail: [],
    }));

    const springs = preset.springs.map((s, i) => ({
      ...s,
      id: `spring-${i}`,
      oscillator1Id: s.oscillator1Id ? `osc-${s.oscillator1Id}` : null,
      oscillator2Id: `osc-${s.oscillator2Id}`,
    }));

    const energy = calculateTotalEnergy(oscillators, springs);
    const avgK = springs.reduce((sum, s) => sum + s.k, 0) / springs.length;
    const avgMass = oscillators.reduce((sum, o) => sum + o.mass, 0) / oscillators.length;
    const naturalFreq = Math.sqrt(avgK / avgMass) / (2 * Math.PI);

    return {
      oscillators,
      springs,
      oscillatorType: preset.oscillatorType,
      couplingType: preset.couplingType,
      dampingType: preset.dampingType,
      dampingCoefficient: getDampingCoefficient(preset.dampingType, avgMass, avgK),
      isPaused: true,
      time: 0,
      showVelocityVectors: true,
      showForceVectors: false,
      showTrails: true,
      showGrid: false,
      showPhaseSpace: false,
      showEnergyPlot: false,
      hasDrivingForce: preset.hasDrivingForce || false,
      drivingAmplitude: preset.drivingAmplitude || 20,
      drivingFrequency: preset.drivingFrequency || naturalFreq,
      totalEnergy: energy.total,
      kineticEnergy: energy.kinetic,
      potentialEnergy: energy.potential,
      frequency: naturalFreq,
      period: 1 / naturalFreq,
      amplitude: estimateAmplitude(oscillators[0]),
    };
  });

  const togglePause = useCallback(() => {
    setState(prev => ({ ...prev, isPaused: !prev.isPaused }));
  }, []);

  const reset = useCallback(() => {
    // Find current preset
    const preset = OSCILLATION_PRESETS.find(p => p.oscillatorType === state.oscillatorType) || OSCILLATION_PRESETS[0];
    
    const oscillators = preset.oscillators.map((o, i) => ({
      ...o,
      id: `osc-${i}`,
      trail: [],
    }));

    const springs = preset.springs.map((s, i) => ({
      ...s,
      id: `spring-${i}`,
      oscillator1Id: s.oscillator1Id ? `osc-${s.oscillator1Id}` : null,
      oscillator2Id: `osc-${s.oscillator2Id}`,
    }));

    const energy = calculateTotalEnergy(oscillators, springs);
    const avgK = springs.reduce((sum, s) => sum + s.k, 0) / springs.length;
    const avgMass = oscillators.reduce((sum, o) => sum + o.mass, 0) / oscillators.length;

    setState(prev => ({
      ...prev,
      oscillators,
      springs,
      time: 0,
      isPaused: true,
      dampingCoefficient: getDampingCoefficient(prev.dampingType, avgMass, avgK),
      totalEnergy: energy.total,
      kineticEnergy: energy.kinetic,
      potentialEnergy: energy.potential,
    }));
    
    setSelectedOscillatorId(null);
  }, [state.oscillatorType]);

  const setOscillatorType = useCallback((type: OscillatorType) => {
    setState(prev => ({ ...prev, oscillatorType: type }));
  }, []);

  const setCouplingType = useCallback((type: CouplingType) => {
    setState(prev => {
      // Adjust spring constants based on coupling type
      const multiplier = type === 'weak' ? 0.5 : type === 'strong' ? 2.0 : 1.0;
      const updatedSprings = prev.springs.map(s => {
        // Only modify coupling springs (those connecting oscillators)
        if (s.oscillator1Id && s.oscillator2Id) {
          return { ...s, k: s.k * multiplier };
        }
        return s;
      });
      
      return { ...prev, couplingType: type, springs: updatedSprings };
    });
  }, []);

  const setDampingType = useCallback((type: DampingType) => {
    setState(prev => {
      const avgMass = prev.oscillators.reduce((sum, o) => sum + o.mass, 0) / prev.oscillators.length;
      const avgK = prev.springs.reduce((sum, s) => sum + s.k, 0) / prev.springs.length;
      const newDampingCoeff = getDampingCoefficient(type, avgMass, avgK);
      
      return { 
        ...prev, 
        dampingType: type,
        dampingCoefficient: newDampingCoeff,
      };
    });
  }, []);

  const toggleDisplay = useCallback((key: keyof Pick<OscillationState, 'showVelocityVectors' | 'showForceVectors' | 'showTrails' | 'showGrid' | 'showPhaseSpace' | 'showEnergyPlot'>) => {
    setState(prev => ({ ...prev, [key]: !prev[key] }));
  }, []);

  const loadPreset = useCallback((presetId: string) => {
    const preset = OSCILLATION_PRESETS.find(p => p.id === presetId);
    if (!preset) return;

    const oscillators = preset.oscillators.map((o, i) => ({
      ...o,
      id: `osc-${i}`,
      trail: [],
    }));

    const springs = preset.springs.map((s, i) => ({
      ...s,
      id: `spring-${i}`,
      oscillator1Id: s.oscillator1Id ? `osc-${s.oscillator1Id}` : null,
      oscillator2Id: `osc-${s.oscillator2Id}`,
    }));

    const energy = calculateTotalEnergy(oscillators, springs);
    const avgK = springs.reduce((sum, s) => sum + s.k, 0) / springs.length;
    const avgMass = oscillators.reduce((sum, o) => sum + o.mass, 0) / oscillators.length;
    const naturalFreq = Math.sqrt(avgK / avgMass) / (2 * Math.PI);

    setState(prev => ({
      ...prev,
      oscillators,
      springs,
      oscillatorType: preset.oscillatorType,
      couplingType: preset.couplingType,
      dampingType: preset.dampingType,
      dampingCoefficient: getDampingCoefficient(preset.dampingType, avgMass, avgK),
      time: 0,
      isPaused: true,
      hasDrivingForce: preset.hasDrivingForce || false,
      drivingAmplitude: preset.drivingAmplitude || 20,
      drivingFrequency: preset.drivingFrequency || naturalFreq,
      totalEnergy: energy.total,
      kineticEnergy: energy.kinetic,
      potentialEnergy: energy.potential,
      frequency: naturalFreq,
      period: 1 / naturalFreq,
      amplitude: estimateAmplitude(oscillators[0]),
    }));

    setSelectedOscillatorId(null);
  }, []);

  const updateOscillatorPosition = useCallback((id: string, x: number) => {
    setState(prev => ({
      ...prev,
      oscillators: prev.oscillators.map(o =>
        o.id === id ? { ...o, x } : o
      ),
    }));
  }, []);

  const updateOscillatorVelocity = useCallback((id: string, vx: number) => {
    setState(prev => ({
      ...prev,
      oscillators: prev.oscillators.map(o =>
        o.id === id ? { ...o, vx } : o
      ),
    }));
  }, []);

  const updateSpringConstant = useCallback((id: string, k: number) => {
    setState(prev => ({
      ...prev,
      springs: prev.springs.map(s =>
        s.id === id ? { ...s, k } : s
      ),
    }));
  }, []);

  const toggleDrivingForce = useCallback(() => {
    setState(prev => ({ ...prev, hasDrivingForce: !prev.hasDrivingForce }));
  }, []);

  const setDrivingAmplitude = useCallback((amplitude: number) => {
    setState(prev => ({ ...prev, drivingAmplitude: amplitude }));
  }, []);

  const setDrivingFrequency = useCallback((frequency: number) => {
    setState(prev => ({ ...prev, drivingFrequency: frequency }));
  }, []);

  const selectOscillator = useCallback((id: string | null) => {
    setSelectedOscillatorId(id);
  }, []);

  // Animation loop
  useEffect(() => {
    if (state.isPaused) {
      if (animationFrameRef.current) {
        cancelAnimationFrame(animationFrameRef.current);
      }
      return;
    }

    let lastTime = performance.now();
    const dt = 0.016; // Fixed timestep: ~60 FPS

    const animate = (currentTime: number) => {
      const elapsed = (currentTime - lastTime) / 1000;
      
      if (elapsed >= dt) {
        setState(prev => {
          const newOscillators = updateOscillators(
            prev.oscillators,
            prev.springs,
            prev.dampingCoefficient,
            prev.hasDrivingForce,
            prev.drivingAmplitude,
            prev.drivingFrequency,
            prev.time,
            dt
          );

          const energy = calculateTotalEnergy(newOscillators, prev.springs);
          const amplitude = newOscillators.length > 0 ? estimateAmplitude(newOscillators[0]) : 0;

          return {
            ...prev,
            oscillators: newOscillators,
            time: prev.time + dt,
            totalEnergy: energy.total,
            kineticEnergy: energy.kinetic,
            potentialEnergy: energy.potential,
            amplitude,
          };
        });

        lastTime = currentTime;
      }

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
    setOscillatorType,
    setCouplingType,
    setDampingType,
    toggleDisplay,
    loadPreset,
    updateOscillatorPosition,
    updateOscillatorVelocity,
    updateSpringConstant,
    toggleDrivingForce,
    setDrivingAmplitude,
    setDrivingFrequency,
    selectedOscillatorId,
    selectOscillator,
  };
}
