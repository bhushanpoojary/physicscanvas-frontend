import Matter from "matter-js";
import type { SimulationAPI, SimulationOptions, SimulationStatus, ToolType } from "./SimulationTypes";

const { Engine, World, Bodies, Constraint } = Matter;

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
    
    ctx.strokeStyle = "#333";
    ctx.fillStyle = "#007bff";
    ctx.lineWidth = 2;

    bodies.forEach((body) => {
      const { position, vertices, isStatic, circleRadius } = body;

      ctx.save();
      ctx.translate(position.x, position.y);
      ctx.rotate(body.angle);

      // Draw circular bodies
      if (circleRadius) {
        ctx.beginPath();
        ctx.arc(0, 0, circleRadius, 0, Math.PI * 2);
        ctx.fillStyle = isStatic ? "#6c757d" : "#28a745";
        ctx.fill();
        ctx.stroke();
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

    addBody(toolType: ToolType, x: number, y: number) {
      let newBodies: Matter.Body[] = [];

      switch (toolType) {
        case "block": {
          const block = Bodies.rectangle(x, y, 80, 80, {
            restitution: 0.5,
            friction: 0.1,
          });
          newBodies.push(block);
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
          break;
        }

        case "inclined-plane": {
          // Create an inclined plane (static body at 30-degree angle)
          const plane = Bodies.rectangle(x, y, 200, 20, {
            isStatic: true,
            angle: Math.PI / 6, // 30 degrees
          });
          newBodies.push(plane);
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
          break;
        }

        case "force-arrow": {
          // Create a small arrow-shaped body (visual indicator)
          const arrow = Bodies.rectangle(x, y, 60, 10, {
            isStatic: true,
          });
          newBodies.push(arrow);
          break;
        }
      }

      // Add all new bodies to the world
      World.add(world, newBodies);
      
      // Render immediately if not running
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
