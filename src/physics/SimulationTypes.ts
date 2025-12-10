export type SimulationStatus = "idle" | "running" | "paused";

export interface SimulationOptions {
  width: number;
  height: number;
  gravityEnabled: boolean;
}

export type ToolType = "block" | "spring" | "inclined-plane" | "pendulum" | "force-arrow";

export type ObjectType =
  | "ball"
  | "box"
  | "ramp"
  | "ground"
  | "spring"
  | "forceArrow";

export type PhysicsObjectId = string;

export interface ObjectProperties {
  id: PhysicsObjectId;
  type: ObjectType;
  label: string;

  mass: number;          // kg
  velocity: number;      // scalar speed in m/s (for now)
  friction: number;      // 0..1
  restitution: number;   // 0..1
  angle: number;         // degrees
}

export interface SimulationAPI {
  start(): void;
  pause(): void;
  reset(): void;
  stepFrame(): void;
  setGravity(enabled: boolean): void;
  getStatus(): SimulationStatus;
  addBody(toolType: ToolType, x: number, y: number): PhysicsObjectId;
  getObjectProperties(id: PhysicsObjectId): ObjectProperties | null;
  updateObjectProperties(id: PhysicsObjectId, changes: Partial<ObjectProperties>): void;
  applyForce(id: PhysicsObjectId, forceMagnitude: number): void;
  dispose(): void;
}
