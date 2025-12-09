export type SimulationStatus = "idle" | "running" | "paused";

export interface SimulationOptions {
  width: number;
  height: number;
  gravityEnabled: boolean;
}

export interface SimulationAPI {
  start(): void;
  pause(): void;
  reset(): void;
  stepFrame(): void;
  setGravity(enabled: boolean): void;
  getStatus(): SimulationStatus;
  dispose(): void;
}
