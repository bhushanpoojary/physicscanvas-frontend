import type { SimulationStatus } from "../../physics/SimulationTypes";
import "./SimulationControls.css";

interface SimulationControlsProps {
  status: SimulationStatus;
  gravityEnabled: boolean;
  onStart(): void;
  onPause(): void;
  onReset(): void;
  onStepFrame(): void;
  onToggleGravity(): void;
}

export default function SimulationControls({
  status,
  gravityEnabled,
  onStart,
  onPause,
  onReset,
  onStepFrame,
  onToggleGravity,
}: SimulationControlsProps) {
  return (
    <div className="pc-simulation-controls">
      <button
        className="pc-control-btn pc-control-btn-primary"
        onClick={onStart}
        disabled={status === "running"}
        title="Start simulation"
      >
        ▶ Play
      </button>
      
      <button
        className="pc-control-btn"
        onClick={onPause}
        disabled={status !== "running"}
        title="Pause simulation"
      >
        ⏸ Pause
      </button>
      
      <button
        className="pc-control-btn"
        onClick={onReset}
        title="Reset simulation"
      >
        ↻ Reset
      </button>
      
      <button
        className="pc-control-btn"
        onClick={onStepFrame}
        disabled={status === "running"}
        title="Advance one frame"
      >
        ⏭ Step
      </button>
      
      <div className="pc-control-divider"></div>
      
      <button
        className={`pc-control-btn pc-control-btn-toggle ${gravityEnabled ? "active" : ""}`}
        onClick={onToggleGravity}
        title="Toggle gravity"
      >
        🌍 Gravity: {gravityEnabled ? "On" : "Off"}
      </button>
    </div>
  );
}
