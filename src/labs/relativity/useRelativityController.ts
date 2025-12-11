import { useState, useCallback } from 'react';
import type {
  RelativityState,
  RelativityObjectId,
  Observer,
  Event,
  LightPulse,
  RelativityToolType,
  ObserverProperties,
  EventProperties,
  ScenePresetId,
} from './types';
import { lorentzGamma, lorentzTransform, formatTimeDilation, formatLengthContraction } from './math/lorentz';

const CANVAS_WIDTH = 900;
const CANVAS_HEIGHT = 500;
const DEFAULT_SCALE = 40; // pixels per unit

export function useRelativityController() {
  const [state, setState] = useState<RelativityState>({
    observers: [
      {
        id: 'obs_0',
        label: 'Lab Frame',
        velocity: 0,
        color: '#4a90e2',
        x0: 0,
      },
    ],
    events: [],
    lightPulses: [],
    selection: { type: null, id: null },
    viewport: {
      centerT: CANVAS_HEIGHT / (2 * DEFAULT_SCALE),
      centerX: 0,
      scale: DEFAULT_SCALE,
      minT: 0,
      maxT: CANVAS_HEIGHT / DEFAULT_SCALE,
      minX: -CANVAS_WIDTH / (2 * DEFAULT_SCALE),
      maxX: CANVAS_WIDTH / (2 * DEFAULT_SCALE),
    },
    referenceObserverId: null,
    showLightCone: true,
    showGrid: true,
  });

  let nextId = 1;

  // Add observer
  const addObserver = useCallback((x: number, _t: number, velocity: number = 0) => {
    const colors = ['#e74c3c', '#2ecc71', '#f39c12', '#9b59b6', '#1abc9c'];
    const newObserver: Observer = {
      id: `obs_${nextId++}`,
      label: `Observer ${nextId}`,
      velocity: Math.max(-0.99, Math.min(0.99, velocity)),
      color: colors[(nextId - 1) % colors.length],
      x0: x,
    };

    setState(prev => ({
      ...prev,
      observers: [...prev.observers, newObserver],
      selection: { type: 'observer', id: newObserver.id },
    }));
  }, []);

  // Add event
  const addEvent = useCallback((x: number, t: number) => {
    const newEvent: Event = {
      id: `evt_${nextId++}`,
      label: `Event ${nextId}`,
      t,
      x,
      color: '#34495e',
    };

    setState(prev => ({
      ...prev,
      events: [...prev.events, newEvent],
      selection: { type: 'event', id: newEvent.id },
    }));
  }, []);

  // Add light pulse
  const addLightPulse = useCallback((x: number, t: number, direction: 1 | -1 = 1) => {
    const newPulse: LightPulse = {
      id: `light_${nextId++}`,
      label: `Light ${nextId}`,
      originT: t,
      originX: x,
      direction,
      color: '#f1c40f',
    };

    setState(prev => ({
      ...prev,
      lightPulses: [...prev.lightPulses, newPulse],
      selection: { type: 'light-pulse', id: newPulse.id },
    }));
  }, []);

  // Add object based on tool type
  const addObject = useCallback((toolType: RelativityToolType, x: number, t: number) => {
    switch (toolType) {
      case 'observer':
        addObserver(x, t, 0);
        break;
      case 'event':
        addEvent(x, t);
        break;
      case 'light-pulse':
        addLightPulse(x, t, 1);
        break;
    }
  }, [addObserver, addEvent, addLightPulse]);

  // Delete selected object
  const deleteSelected = useCallback(() => {
    setState(prev => {
      if (!prev.selection.type || !prev.selection.id) return prev;

      const { type, id } = prev.selection;
      
      return {
        ...prev,
        observers: type === 'observer' ? prev.observers.filter(o => o.id !== id) : prev.observers,
        events: type === 'event' ? prev.events.filter(e => e.id !== id) : prev.events,
        lightPulses: type === 'light-pulse' ? prev.lightPulses.filter(l => l.id !== id) : prev.lightPulses,
        selection: { type: null, id: null },
      };
    });
  }, []);

  // Select object
  const selectObject = useCallback((type: 'observer' | 'event' | 'light-pulse' | null, id: RelativityObjectId | null) => {
    setState(prev => ({
      ...prev,
      selection: { type, id },
    }));
  }, []);

  // Update observer velocity
  const updateObserverVelocity = useCallback((id: RelativityObjectId, velocity: number) => {
    setState(prev => ({
      ...prev,
      observers: prev.observers.map(obs =>
        obs.id === id ? { ...obs, velocity: Math.max(-0.99, Math.min(0.99, velocity)) } : obs
      ),
    }));
  }, []);

  // Update event coordinates
  const updateEventCoordinates = useCallback((id: RelativityObjectId, t: number, x: number) => {
    setState(prev => ({
      ...prev,
      events: prev.events.map(evt =>
        evt.id === id ? { ...evt, t, x } : evt
      ),
    }));
  }, []);

  // Set reference observer for coordinate transformations
  const setReferenceObserver = useCallback((id: RelativityObjectId | null) => {
    setState(prev => ({
      ...prev,
      referenceObserverId: id,
    }));
  }, []);

  // Toggle display options
  const toggleLightCone = useCallback(() => {
    setState(prev => ({ ...prev, showLightCone: !prev.showLightCone }));
  }, []);

  const toggleGrid = useCallback(() => {
    setState(prev => ({ ...prev, showGrid: !prev.showGrid }));
  }, []);

  // Get observer properties for properties panel
  const getObserverProperties = useCallback((id: RelativityObjectId): ObserverProperties | null => {
    const observer = state.observers.find(o => o.id === id);
    if (!observer) return null;

    const gamma = lorentzGamma(observer.velocity);

    return {
      id: observer.id,
      label: observer.label,
      velocity: observer.velocity,
      gamma,
      timeDilation: formatTimeDilation(observer.velocity),
      lengthContraction: formatLengthContraction(observer.velocity),
    };
  }, [state.observers]);

  // Get event properties for properties panel
  const getEventProperties = useCallback((id: RelativityObjectId): EventProperties | null => {
    const event = state.events.find(e => e.id === id);
    if (!event) return null;

    const properties: EventProperties = {
      id: event.id,
      label: event.label,
      t: event.t,
      x: event.x,
    };

    // Add transformed coordinates if reference observer is selected
    if (state.referenceObserverId) {
      const observer = state.observers.find(o => o.id === state.referenceObserverId);
      if (observer) {
        const transformed = lorentzTransform(event.t, event.x, observer.velocity);
        properties.tPrime = transformed.tPrime;
        properties.xPrime = transformed.xPrime;
        properties.observerFrame = observer.label;
      }
    }

    return properties;
  }, [state.events, state.observers, state.referenceObserverId]);

  // Load preset scene
  const loadPreset = useCallback((presetId: ScenePresetId) => {
    nextId = 1;

    const newState: Partial<RelativityState> = {
      observers: [],
      events: [],
      lightPulses: [],
      selection: { type: null, id: null },
      referenceObserverId: null,
    };

    switch (presetId) {
      case 'empty':
        newState.observers = [{
          id: 'obs_0',
          label: 'Lab Frame',
          velocity: 0,
          color: '#4a90e2',
          x0: 0,
        }];
        break;

      case 'simultaneity':
        newState.observers = [
          { id: 'obs_0', label: 'Lab Frame', velocity: 0, color: '#4a90e2', x0: 0 },
          { id: 'obs_1', label: 'Moving Frame', velocity: 0.6, color: '#e74c3c', x0: 0 },
        ];
        newState.events = [
          { id: 'evt_0', label: 'Event A', t: 5, x: -3, color: '#34495e' },
          { id: 'evt_1', label: 'Event B', t: 5, x: 3, color: '#34495e' },
        ];
        break;

      case 'timeDilation':
        newState.observers = [
          { id: 'obs_0', label: 'Lab Frame', velocity: 0, color: '#4a90e2', x0: 0 },
          { id: 'obs_1', label: 'Moving Clock', velocity: 0.8, color: '#e74c3c', x0: 0 },
        ];
        newState.events = [
          { id: 'evt_0', label: 'Start', t: 2, x: 0, color: '#2ecc71' },
          { id: 'evt_1', label: 'End', t: 8, x: 4.8, color: '#e74c3c' },
        ];
        break;

      case 'lengthContraction':
        newState.observers = [
          { id: 'obs_0', label: 'Lab Frame', velocity: 0, color: '#4a90e2', x0: 0 },
          { id: 'obs_1', label: 'Moving Rod', velocity: 0.6, color: '#e74c3c', x0: -4 },
        ];
        newState.events = [
          { id: 'evt_0', label: 'Front', t: 6, x: -4, color: '#34495e' },
          { id: 'evt_1', label: 'Back', t: 6, x: 4, color: '#34495e' },
        ];
        break;

      case 'lightClock':
        newState.observers = [
          { id: 'obs_0', label: 'Lab Frame', velocity: 0, color: '#4a90e2', x0: 0 },
        ];
        newState.events = [
          { id: 'evt_0', label: 'Emit', t: 2, x: 0, color: '#f1c40f' },
          { id: 'evt_1', label: 'Reflect', t: 4, x: 2, color: '#f39c12' },
          { id: 'evt_2', label: 'Return', t: 6, x: 0, color: '#e67e22' },
        ];
        newState.lightPulses = [
          { id: 'light_0', label: 'Outgoing', originT: 2, originX: 0, direction: 1, color: '#f1c40f' },
          { id: 'light_1', label: 'Returning', originT: 4, originX: 2, direction: -1, color: '#f39c12' },
        ];
        break;
    }

    setState(prev => ({
      ...prev,
      ...newState,
    }));
  }, []);

  return {
    state,
    addObject,
    deleteSelected,
    selectObject,
    updateObserverVelocity,
    updateEventCoordinates,
    setReferenceObserver,
    toggleLightCone,
    toggleGrid,
    getObserverProperties,
    getEventProperties,
    loadPreset,
  };
}
