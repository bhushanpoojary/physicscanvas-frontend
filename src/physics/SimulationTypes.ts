export type SimulationStatus = "idle" | "running" | "paused";

export interface SimulationOptions {
  width: number;
  height: number;
  gravityEnabled: boolean;
}

export type ToolType = "block" | "spring" | "inclined-plane" | "pendulum" | "force-arrow";

export interface SimulationAPI {
  start(): void;
  pause(): void;
  reset(): void;
  stepFrame(): void;
  setGravity(enabled: boolean): void;
  getStatus(): SimulationStatus;
  addBody(toolType: ToolType, x: number, y: number): void;
  dispose(): void;
}
