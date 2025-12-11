import { useState, useCallback } from 'react';
import type { UncertaintyState, UncertaintyMode } from './types';
import { UNCERTAINTY_PRESETS } from './types';
import { computeGaussianWavePacket } from './calculations/wavePackets';

export interface UncertaintyController {
  state: UncertaintyState;
  setMode: (mode: UncertaintyMode) => void;
  setSigma: (sigma: number) => void;
  setX0: (x0: number) => void;
  setK0: (k0: number) => void;
  toggleDisplay: (key: 'showPositionSpace' | 'showMomentumSpace' | 'showUncertaintyProduct') => void;
  loadPreset: (presetId: string) => void;
}

export function useUncertaintyController(): UncertaintyController {
  const [state, setState] = useState<UncertaintyState>(() => {
    // Initialize with minimum uncertainty Gaussian
    const wavePacket = computeGaussianWavePacket(1.0, 0, 3, 500);
    
    return {
      mode: 'position-momentum',
      wavePacket,
      sigma: 1.0,
      x0: 0,
      k0: 3,
      showPositionSpace: true,
      showMomentumSpace: true,
      showUncertaintyProduct: true,
      pulseWidth: 1.0,
      centerFrequency: 5.0,
    };
  });

  const setMode = useCallback((mode: UncertaintyMode) => {
    setState(prev => ({ ...prev, mode }));
  }, []);

  const setSigma = useCallback((sigma: number) => {
    setState(prev => {
      const clampedSigma = Math.max(0.1, Math.min(sigma, 5.0));
      const wavePacket = computeGaussianWavePacket(clampedSigma, prev.x0, prev.k0, 500);
      return { ...prev, sigma: clampedSigma, wavePacket };
    });
  }, []);

  const setX0 = useCallback((x0: number) => {
    setState(prev => {
      const clampedX0 = Math.max(-10, Math.min(x0, 10));
      const wavePacket = computeGaussianWavePacket(prev.sigma, clampedX0, prev.k0, 500);
      return { ...prev, x0: clampedX0, wavePacket };
    });
  }, []);

  const setK0 = useCallback((k0: number) => {
    setState(prev => {
      const clampedK0 = Math.max(0, Math.min(k0, 15));
      const wavePacket = computeGaussianWavePacket(prev.sigma, prev.x0, clampedK0, 500);
      return { ...prev, k0: clampedK0, wavePacket };
    });
  }, []);

  const toggleDisplay = useCallback((key: 'showPositionSpace' | 'showMomentumSpace' | 'showUncertaintyProduct') => {
    setState(prev => ({ ...prev, [key]: !prev[key] }));
  }, []);

  const loadPreset = useCallback((presetId: string) => {
    const preset = UNCERTAINTY_PRESETS.find(p => p.id === presetId);
    if (!preset) return;

    const wavePacket = computeGaussianWavePacket(preset.sigma, preset.x0, preset.k0, 500);
    
    setState(prev => ({
      ...prev,
      sigma: preset.sigma,
      x0: preset.x0,
      k0: preset.k0,
      wavePacket,
    }));
  }, []);

  return {
    state,
    setMode,
    setSigma,
    setX0,
    setK0,
    toggleDisplay,
    loadPreset,
  };
}
