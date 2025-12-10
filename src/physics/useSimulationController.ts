import { useRef, useState, useEffect } from "react";
import type { SimulationAPI, SimulationOptions, SimulationStatus, ToolType, PhysicsObjectId, ObjectProperties, ScenePresetId } from "./SimulationTypes";
import { createPhysicsEngine } from "./PhysicsEngine";

export function useSimulationController(options: SimulationOptions) {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const engineRef = useRef<SimulationAPI | null>(null);
  const statusRef = useRef<SimulationStatus>("idle");
  
  const [status, setStatus] = useState<SimulationStatus>("idle");
  const [gravityEnabled, setGravityEnabled] = useState(options.gravityEnabled);
  const [selectedObjectId, setSelectedObjectId] = useState<PhysicsObjectId | null>(null);
  const [selectedProps, setSelectedProps] = useState<ObjectProperties | null>(null);
  const [currentPreset, setCurrentPreset] = useState<ScenePresetId>("empty");

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
    // Clear selection on reset
    setSelectedObjectId(null);
    setSelectedProps(null);
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

  const addBody = (toolType: ToolType, x: number, y: number) => {
    if (!engineRef.current) return;
    const id = engineRef.current.addBody(toolType, x, y);
    
    // Select the newly added object
    setSelectedObjectId(id);
    engineRef.current.setSelectedId(id);
    const props = engineRef.current.getObjectProperties(id);
    setSelectedProps(props);
  };

  const refreshSelectedProps = () => {
    if (!engineRef.current || !selectedObjectId) return;
    const props = engineRef.current.getObjectProperties(selectedObjectId);
    setSelectedProps(props);
  };

  const updateSelectedProperties = (changes: Partial<ObjectProperties>) => {
    if (!engineRef.current || !selectedObjectId) return;
    engineRef.current.updateObjectProperties(selectedObjectId, changes);
    refreshSelectedProps();
  };

  const applyForceToSelected = (forceMagnitude: number) => {
    if (!engineRef.current || !selectedObjectId) return;
    engineRef.current.applyForce(selectedObjectId, forceMagnitude);
  };

  const selectObjectAtPoint = (x: number, y: number) => {
    if (!engineRef.current) return;
    const id = engineRef.current.hitTest(x, y);
    
    if (!id) {
      setSelectedObjectId(null);
      setSelectedProps(null);
      engineRef.current.setSelectedId(null);
      return;
    }

    setSelectedObjectId(id);
    engineRef.current.setSelectedId(id);
    const props = engineRef.current.getObjectProperties(id);
    setSelectedProps(props);
  };

  const deleteSelectedObject = () => {
    if (!engineRef.current || !selectedObjectId) return;
    engineRef.current.deleteBody(selectedObjectId);
    setSelectedObjectId(null);
    setSelectedProps(null);
  };

  const moveSelectedObject = (x: number, y: number) => {
    if (!engineRef.current || !selectedObjectId) return;
    engineRef.current.moveBody(selectedObjectId, x, y);
    refreshSelectedProps();
  };

  const loadPreset = (preset: ScenePresetId) => {
    if (!engineRef.current) return;

    // Pause simulation and set status to idle
    statusRef.current = "idle";
    setStatus("idle");

    const primaryId = engineRef.current.loadPreset(preset);
    setCurrentPreset(preset);

    if (primaryId) {
      setSelectedObjectId(primaryId);
      engineRef.current.setSelectedId(primaryId);
      const props = engineRef.current.getObjectProperties(primaryId);
      setSelectedProps(props);
    } else {
      setSelectedObjectId(null);
      engineRef.current.setSelectedId(null);
      setSelectedProps(null);
    }
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
    addBody,
    selectedObjectId,
    selectedProps,
    updateSelectedProperties,
    applyForceToSelected,
    selectObjectAtPoint,
    deleteSelectedObject,
    moveSelectedObject,
    currentPreset,
    loadPreset,
  };
}
