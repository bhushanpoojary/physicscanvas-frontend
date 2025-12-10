import Matter from "matter-js";
import type { SimulationAPI, SimulationOptions, SimulationStatus, ToolType, PhysicsObjectId, ObjectProperties, ObjectType } from "./SimulationTypes";

const { Engine, World, Bodies, Constraint, Body } = Matter;

export function createPhysicsEngine(
  canvas: HTMLCanvasElement,
  options: SimulationOptions
): SimulationAPI {
  // Create Matter.js engine
  const engine = Engine.create({
    gravity: {
      x: 0,
      y: options.gravityEnabled ? 1 : 0,
      scale: 0.001,
    },
  });

  const world = engine.world;
  
  // Get 2D rendering context
  const ctx = canvas.getContext("2d")!;
  
  // State
  let status: SimulationStatus = "idle";
  let animationFrameId: number | null = null;

  // Body tracking for properties
  const bodiesById = new Map<PhysicsObjectId, Matter.Body>();
  const bodyIdMap = new Map<Matter.Body, PhysicsObjectId>();
  const bodyTypes = new Map<PhysicsObjectId, ObjectType>();
  let nextId = 1;

  // Selection state
  let selectedId: PhysicsObjectId | null = null;

  // Initialize scene
  function initializeScene() {
    // Clear existing bodies
    World.clear(world, false);
    Engine.clear(engine);

    // Create ground (static)
    const ground = Bodies.rectangle(
      options.width / 2,
      options.height - 30,
      options.width,
      60,
      { isStatic: true }
    );

    // Create a dynamic rectangle in the middle
    const box = Bodies.rectangle(
      options.width / 2,
      options.height / 4,
      80,
      80
    );

    // Add bodies to world
    World.add(world, [ground, box]);
  }

  // Render the scene
  function render() {
    // Clear canvas
    ctx.fillStyle = "#f8f9fa";
    ctx.fillRect(0, 0, options.width, options.height);

    // Draw constraints (springs, pendulum rods)
    const constraints = Matter.Composite.allConstraints(world);
    constraints.forEach((constraint) => {
      if (!constraint.bodyA || !constraint.bodyB) return;

      const posA = constraint.bodyA.position;
      const posB = constraint.bodyB.position;

      ctx.strokeStyle = "#4a90e2";
      ctx.lineWidth = 2;
      ctx.beginPath();
      ctx.moveTo(posA.x, posA.y);
      ctx.lineTo(posB.x, posB.y);
      ctx.stroke();
    });

    // Draw all bodies
    const bodies = Matter.Composite.allBodies(world);

    bodies.forEach((body) => {
      const { position, vertices, isStatic, circleRadius } = body;
      const bodyId = bodyIdMap.get(body);
      const isSelected = bodyId === selectedId;

      ctx.save();
      ctx.translate(position.x, position.y);
      ctx.rotate(body.angle);

      // Set stroke style based on selection
      if (isSelected) {
        ctx.strokeStyle = "#1e90ff";
        ctx.lineWidth = 4;
      } else {
        ctx.strokeStyle = "#333";
        ctx.lineWidth = 2;
      }

      // Draw circular bodies
      if (circleRadius) {
        ctx.beginPath();
        ctx.arc(0, 0, circleRadius, 0, Math.PI * 2);
        ctx.fillStyle = isStatic ? "#6c757d" : "#28a745";
        ctx.fill();
        ctx.stroke();

        // Add outer glow for selected circular bodies
        if (isSelected) {
          ctx.strokeStyle = "#1e90ff";
          ctx.lineWidth = 2;
          ctx.globalAlpha = 0.3;
          ctx.beginPath();
          ctx.arc(0, 0, circleRadius + 4, 0, Math.PI * 2);
          ctx.stroke();
          ctx.globalAlpha = 1;
        }
      } else {
        // Draw polygonal bodies
        ctx.beginPath();
        const localVertices = vertices.map((v) => ({
          x: v.x - position.x,
          y: v.y - position.y,
        }));

        ctx.moveTo(localVertices[0].x, localVertices[0].y);
        for (let i = 1; i < localVertices.length; i++) {
          ctx.lineTo(localVertices[i].x, localVertices[i].y);
        }
        ctx.closePath();

        // Fill color based on static/dynamic
        ctx.fillStyle = isStatic ? "#6c757d" : "#007bff";
        ctx.fill();
        ctx.stroke();

        // Add outer glow for selected polygonal bodies
        if (isSelected) {
          // Draw a second, larger outline for the glow effect
          const offset = 3;
          ctx.strokeStyle = "#1e90ff";
          ctx.lineWidth = 6;
          ctx.globalAlpha = 0.4;
          
          ctx.beginPath();
          const expandedVertices = localVertices.map((v) => {
            const length = Math.sqrt(v.x * v.x + v.y * v.y);
            const scale = length > 0 ? (length + offset) / length : 1;
            return {
              x: v.x * scale,
              y: v.y * scale,
            };
          });
          
          ctx.moveTo(expandedVertices[0].x, expandedVertices[0].y);
          for (let i = 1; i < expandedVertices.length; i++) {
            ctx.lineTo(expandedVertices[i].x, expandedVertices[i].y);
          }
          ctx.closePath();
          ctx.stroke();
          ctx.globalAlpha = 1;
        }
      }

      ctx.restore();
    });
  }

  // Animation loop
  function animate(_currentTime: number) {
    if (status !== "running") {
      return;
    }

    // Update physics (use fixed timestep for stability)
    Engine.update(engine, 1000 / 60);

    // Render
    render();

    // Continue animation
    animationFrameId = requestAnimationFrame(animate);
  }

  // API implementation
  const api: SimulationAPI = {
    start() {
      if (status === "running") return;
      
      status = "running";
      animationFrameId = requestAnimationFrame(animate);
    },

    pause() {
      if (status !== "running") return;
      
      status = "paused";
      if (animationFrameId !== null) {
        cancelAnimationFrame(animationFrameId);
        animationFrameId = null;
      }
    },

    reset() {
      // Stop animation if running
      if (animationFrameId !== null) {
        cancelAnimationFrame(animationFrameId);
        animationFrameId = null;
      }

      status = "idle";
      
      // Clear body tracking
      bodiesById.clear();
      bodyIdMap.clear();
      bodyTypes.clear();
      nextId = 1;
      selectedId = null;
      
      // Recreate scene
      initializeScene();
      
      // Render initial state
      render();
    },

    stepFrame() {
      if (status === "running") return;
      
      // Update physics by one frame
      Engine.update(engine, 1000 / 60);
      
      // Render
      render();
    },

    setGravity(enabled: boolean) {
      engine.world.gravity.y = enabled ? 1 : 0;
    },

    getStatus() {
      return status;
    },

    addBody(toolType: ToolType, x: number, y: number): PhysicsObjectId {
      let newBodies: Matter.Body[] = [];
      let primaryBody: Matter.Body | null = null;
      let objectType: ObjectType = "box";

      switch (toolType) {
        case "block": {
          const block = Bodies.rectangle(x, y, 80, 80, {
            restitution: 0.5,
            friction: 0.1,
          });
          newBodies.push(block);
          primaryBody = block;
          objectType = "box";
          break;
        }

        case "spring": {
          // Create two connected bodies with a constraint (spring)
          const block1 = Bodies.rectangle(x - 50, y, 40, 40, {
            isStatic: true,
          });
          const block2 = Bodies.rectangle(x + 50, y, 40, 40);
          
          const spring = Constraint.create({
            bodyA: block1,
            bodyB: block2,
            stiffness: 0.05,
            damping: 0.01,
            length: 100,
            render: {
              lineWidth: 2,
              strokeStyle: "#4a90e2",
            },
          });

          World.add(world, spring);
          newBodies.push(block1, block2);
          primaryBody = block2; // The movable part
          objectType = "spring";
          break;
        }

        case "inclined-plane": {
          // Create an inclined plane (static body at 30-degree angle)
          const plane = Bodies.rectangle(x, y, 200, 20, {
            isStatic: true,
            angle: Math.PI / 6, // 30 degrees
          });
          newBodies.push(plane);
          primaryBody = plane;
          objectType = "ramp";
          break;
        }

        case "pendulum": {
          // Create pendulum: static anchor + dynamic bob + constraint
          const anchor = Bodies.circle(x, y - 100, 5, {
            isStatic: true,
          });
          const bob = Bodies.circle(x, y + 50, 25, {
            density: 0.01,
          });

          const rod = Constraint.create({
            bodyA: anchor,
            bodyB: bob,
            length: 150,
            stiffness: 1,
            render: {
              lineWidth: 2,
              strokeStyle: "#333",
            },
          });

          World.add(world, rod);
          newBodies.push(anchor, bob);
          primaryBody = bob; // The swinging part
          objectType = "ball";
          break;
        }

        case "force-arrow": {
          // Create a small arrow-shaped body (visual indicator)
          const arrow = Bodies.rectangle(x, y, 60, 10, {
            isStatic: true,
          });
          newBodies.push(arrow);
          primaryBody = arrow;
          objectType = "forceArrow";
          break;
        }
      }

      // Add all new bodies to the world
      World.add(world, newBodies);

      // Generate ID and track the primary body
      const id: PhysicsObjectId = `obj_${nextId++}`;
      if (primaryBody) {
        bodiesById.set(id, primaryBody);
        bodyIdMap.set(primaryBody, id);
        bodyTypes.set(id, objectType);
      }
      
      // Render immediately if not running
      if (status !== "running") {
        render();
      }

      return id;
    },

    getObjectProperties(id: PhysicsObjectId): ObjectProperties | null {
      const body = bodiesById.get(id);
      if (!body) return null;

      const type = bodyTypes.get(id) || "box";
      const velocityMagnitude = Math.sqrt(
        body.velocity.x ** 2 + body.velocity.y ** 2
      );
      const angleDeg = (body.angle * 180) / Math.PI;

      return {
        id,
        type,
        label: `${type.charAt(0).toUpperCase() + type.slice(1)} #${id.split('_')[1]}`,
        mass: body.mass,
        velocity: velocityMagnitude,
        friction: body.friction,
        restitution: body.restitution,
        angle: angleDeg,
      };
    },

    updateObjectProperties(id: PhysicsObjectId, changes: Partial<ObjectProperties>): void {
      const body = bodiesById.get(id);
      if (!body) return;

      if (changes.mass !== undefined) {
        Body.setMass(body, changes.mass);
      }

      if (changes.velocity !== undefined) {
        // Set velocity magnitude, preserving direction if moving, else horizontal
        const currentVel = body.velocity;
        const currentMag = Math.sqrt(currentVel.x ** 2 + currentVel.y ** 2);
        
        if (currentMag > 0.01) {
          // Preserve direction
          const scale = changes.velocity / currentMag;
          Body.setVelocity(body, {
            x: currentVel.x * scale,
            y: currentVel.y * scale,
          });
        } else {
          // Default to horizontal
          Body.setVelocity(body, { x: changes.velocity, y: 0 });
        }
      }

      if (changes.friction !== undefined) {
        body.friction = changes.friction;
      }

      if (changes.restitution !== undefined) {
        body.restitution = changes.restitution;
      }

      if (changes.angle !== undefined) {
        const radians = (changes.angle * Math.PI) / 180;
        Body.setAngle(body, radians);
      }

      // Render immediately if not running
      if (status !== "running") {
        render();
      }
    },

    applyForce(id: PhysicsObjectId, forceMagnitude: number): void {
      const body = bodiesById.get(id);
      if (!body) return;

      // Apply horizontal force to the right
      const force = {
        x: forceMagnitude,
        y: 0,
      };
      Body.applyForce(body, body.position, force);

      // Render immediately if not running
      if (status !== "running") {
        render();
      }
    },

    hitTest(x: number, y: number): PhysicsObjectId | null {
      const point = { x, y };
      const bodies = Array.from(bodiesById.values());
      const found = Matter.Query.point(bodies, point);
      
      if (!found.length) return null;

      const body = found[0];
      const id = bodyIdMap.get(body) ?? null;
      return id;
    },

    setSelectedId(id: PhysicsObjectId | null): void {
      selectedId = id;
      // Re-render to show selection highlight
      if (status !== "running") {
        render();
      }
    },

    dispose() {
      if (animationFrameId !== null) {
        cancelAnimationFrame(animationFrameId);
        animationFrameId = null;
      }
      World.clear(world, false);
      Engine.clear(engine);
    },
  };

  // Initialize the scene on creation
  initializeScene();
  render();

  return api;
}
