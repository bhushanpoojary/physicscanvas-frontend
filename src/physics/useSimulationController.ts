import { useRef, useState, useEffect } from "react";
import type { SimulationAPI, SimulationOptions, SimulationStatus } from "./SimulationTypes";
import { createPhysicsEngine } from "./PhysicsEngine";

export function useSimulationController(options: SimulationOptions) {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const engineRef = useRef<SimulationAPI | null>(null);
  
  const [status, setStatus] = useState<SimulationStatus>("idle");
  const [gravityEnabled, setGravityEnabled] = useState(options.gravityEnabled);

  // Initialize physics engine when canvas is ready
  useEffect(() => {
    if (!canvasRef.current) return;

    // Create physics engine
    const engine = createPhysicsEngine(canvasRef.current, options);
    engineRef.current = engine;

    // Initialize with reset
    engine.reset();
    setStatus(engine.getStatus());

    // Cleanup on unmount
    return () => {
      if (engineRef.current) {
        engineRef.current.dispose();
        engineRef.current = null;
      }
    };
  }, [options.width, options.height, options.gravityEnabled]);

  // Control functions
  const start = () => {
    if (!engineRef.current) return;
    engineRef.current.start();
    setStatus(engineRef.current.getStatus());
  };

  const pause = () => {
    if (!engineRef.current) return;
    engineRef.current.pause();
    setStatus(engineRef.current.getStatus());
  };

  const reset = () => {
    if (!engineRef.current) return;
    engineRef.current.reset();
    setStatus(engineRef.current.getStatus());
  };

  const stepFrame = () => {
    if (!engineRef.current) return;
    engineRef.current.stepFrame();
  };

  const toggleGravity = () => {
    if (!engineRef.current) return;
    const newGravityState = !gravityEnabled;
    engineRef.current.setGravity(newGravityState);
    setGravityEnabled(newGravityState);
  };

  return {
    canvasRef,
    status,
    gravityEnabled,
    start,
    pause,
    reset,
    stepFrame,
    toggleGravity,
  };
}
