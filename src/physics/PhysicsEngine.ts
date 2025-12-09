import Matter from "matter-js";
import type { SimulationAPI, SimulationOptions, SimulationStatus } from "./SimulationTypes";

const { Engine, World, Bodies } = Matter;

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

    // Draw all bodies
    const bodies = Matter.Composite.allBodies(world);
    
    ctx.strokeStyle = "#333";
    ctx.fillStyle = "#007bff";
    ctx.lineWidth = 2;

    bodies.forEach((body) => {
      const { position, vertices, isStatic } = body;

      ctx.save();
      ctx.translate(position.x, position.y);
      ctx.rotate(body.angle);

      // Draw body
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
