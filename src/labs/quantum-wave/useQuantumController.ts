import { useState, useCallback } from 'react';
import type { QuantumState, QuantumSystemId, SystemParameters } from './types';
import { QUANTUM_SYSTEMS } from './types';
import { computeWaveFunction } from './solutions/waveFunctions';

export interface QuantumController {
  state: QuantumState;
  setSystemId: (id: QuantumSystemId) => void;
  setEnergyLevel: (n: number) => void;
  setParameters: (params: Partial<SystemParameters>) => void;
  toggleDisplay: (key: 'showReal' | 'showImaginary' | 'showProbability') => void;
  loadPreset: (presetId: string) => void;
}

/**
 * Custom hook for managing quantum wave lab state
 */
export function useQuantumController(): QuantumController {
  const [state, setState] = useState<QuantumState>(() => {
    // Initialize with infinite well, ground state
    const system = QUANTUM_SYSTEMS[0];
    const waveFunction = computeWaveFunction(
      system.id,
      1,
      system.parameters,
      500
    );

    return {
      system,
      energyLevel: 1,
      waveFunction,
      showReal: false,
      showImaginary: false,
      showProbability: true,
      showPotential: true,
      xMin: -0.5,
      xMax: 1.5,
      numPoints: 500,
    };
  });

  const setSystemId = useCallback((id: QuantumSystemId) => {
    const system = QUANTUM_SYSTEMS.find(s => s.id === id);
    if (!system) return;

    setState(prev => {
      const newLevel = Math.min(prev.energyLevel, system.maxLevels);
      const waveFunction = computeWaveFunction(id, newLevel, system.parameters, 500);
      
      return {
        ...prev,
        system,
        energyLevel: newLevel,
        waveFunction,
      };
    });
  }, []);

  const setEnergyLevel = useCallback((n: number) => {
    setState(prev => {
      const clampedN = Math.max(1, Math.min(n, prev.system.maxLevels));
      const waveFunction = computeWaveFunction(prev.system.id, clampedN, prev.system.parameters, 500);

      return {
        ...prev,
        energyLevel: clampedN,
        waveFunction,
      };
    });
  }, []);

  const setParameters = useCallback((params: Partial<SystemParameters>) => {
    setState(prev => {
      const newParams = { ...prev.system.parameters, ...params };
      const updatedSystem = { ...prev.system, parameters: newParams };
      const waveFunction = computeWaveFunction(prev.system.id, prev.energyLevel, newParams, 500);

      return {
        ...prev,
        system: updatedSystem,
        waveFunction,
      };
    });
  }, []);

  const toggleDisplay = useCallback((key: 'showReal' | 'showImaginary' | 'showProbability') => {
    setState(prev => ({
      ...prev,
      [key]: !prev[key],
    }));
  }, []);

  const loadPreset = useCallback((presetId: string) => {
    switch (presetId) {
      case 'groundState':
        setSystemId('infiniteWell');
        setState(prev => ({
          ...prev,
          energyLevel: 1,
          showReal: false,
          showImaginary: false,
          showProbability: true,
        }));
        break;

      case 'firstExcited':
        setSystemId('infiniteWell');
        setState(prev => ({
          ...prev,
          energyLevel: 2,
          showReal: true,
          showImaginary: false,
          showProbability: true,
        }));
        break;

      case 'harmonicN3':
        setSystemId('harmonicOscillator');
        setState(prev => ({
          ...prev,
          energyLevel: 3,
          showReal: true,
          showImaginary: false,
          showProbability: true,
        }));
        break;

      case 'tunneling':
        setSystemId('barrier');
        setState(prev => ({
          ...prev,
          energyLevel: 1,
          showReal: true,
          showImaginary: true,
          showProbability: true,
        }));
        break;

      case 'finiteN4':
        setSystemId('finiteWell');
        setState(prev => ({
          ...prev,
          energyLevel: 4,
          showReal: false,
          showImaginary: false,
          showProbability: true,
        }));
        break;

      default:
        break;
    }
  }, [setSystemId, setState]);

  return {
    state,
    setSystemId,
    setEnergyLevel,
    setParameters,
    toggleDisplay,
    loadPreset,
  };
}
