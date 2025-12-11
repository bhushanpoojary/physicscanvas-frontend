import { useState, useCallback, useRef, useEffect } from 'react';
import type { Ball, CollisionState, CollisionType } from './types';
import { COLLISION_PRESETS } from './types';
import {
  detectCollision,
  handleCollision,
  handleWallCollision,
  calculateTotalMomentum,
  calculateTotalEnergy,
} from './physics/collisions';

export interface CollisionController {
  state: CollisionState;
  canvasRef: React.RefObject<HTMLCanvasElement | null>;
  togglePause: () => void;
  reset: () => void;
  setCollisionType: (type: CollisionType) => void;
  toggleDisplay: (key: 'showVelocityVectors' | 'showMomentumVectors' | 'showTrails' | 'showGrid') => void;
  loadPreset: (presetId: string) => void;
  addBall: (x: number, y: number) => void;
  updateBallVelocity: (id: string, vx: number, vy: number) => void;
  deleteBall: (id: string) => void;
  selectedBallId: string | null;
  selectBall: (id: string | null) => void;
}

export function useCollisionController(): CollisionController {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [selectedBallId, setSelectedBallId] = useState<string | null>(null);

  const [state, setState] = useState<CollisionState>(() => {
    const preset = COLLISION_PRESETS[0];
    const balls = preset.balls.map((b, i) => ({
      ...b,
      id: `ball-${i}`,
      trail: [],
    }));

    const momentum = calculateTotalMomentum(balls);
    const energy = calculateTotalEnergy(balls);

    return {
      balls,
      collisionType: preset.collisionType,
      isPaused: true,
      showVelocityVectors: true,
      showMomentumVectors: false,
      showTrails: false,
      showGrid: false,
      totalMomentumX: momentum.x,
      totalMomentumY: momentum.y,
      totalEnergy: energy,
      initialMomentumX: momentum.x,
      initialMomentumY: momentum.y,
      initialEnergy: energy,
    };
  });

  // Animation loop
  useEffect(() => {
    if (state.isPaused) return;

    let animationId: number | null = null;
    let lastTime = Date.now();

    const animate = () => {
      const now = Date.now();
      const dt = Math.min((now - lastTime) / 1000, 0.033); // Max 33ms (30 FPS minimum)
      lastTime = now;

      setState(prev => {
        const canvas = canvasRef.current;
        if (!canvas) return prev;

        const newBalls = prev.balls.map(ball => {
          // Update position
          const newBall = {
            ...ball,
            x: ball.x + ball.vx * dt,
            y: ball.y + ball.vy * dt,
            trail: ball.trail,
          };

          // Add to trail
          if (prev.showTrails) {
            newBall.trail = [...ball.trail, { x: ball.x, y: ball.y }];
            if (newBall.trail.length > 50) newBall.trail.shift();
          } else {
            newBall.trail = [];
          }

          // Handle wall collisions
          handleWallCollision(newBall, canvas.width, canvas.height, prev.collisionType === 'elastic' ? 1.0 : 0.8);

          return newBall;
        });

        // Check for ball-ball collisions
        for (let i = 0; i < newBalls.length; i++) {
          for (let j = i + 1; j < newBalls.length; j++) {
            if (detectCollision(newBalls[i], newBalls[j])) {
              handleCollision(newBalls[i], newBalls[j], prev.collisionType);
            }
          }
        }

        // Update conservation metrics
        const momentum = calculateTotalMomentum(newBalls);
        const energy = calculateTotalEnergy(newBalls);

        return {
          ...prev,
          balls: newBalls,
          totalMomentumX: momentum.x,
          totalMomentumY: momentum.y,
          totalEnergy: energy,
        };
      });

      animationId = requestAnimationFrame(animate);
    };

    animationId = requestAnimationFrame(animate);

    return () => {
      if (animationId !== null) {
        cancelAnimationFrame(animationId);
      }
    };
  }, [state.isPaused, state.collisionType, state.showTrails]);

  const togglePause = useCallback(() => {
    setState(prev => ({ ...prev, isPaused: !prev.isPaused }));
  }, []);

  const reset = useCallback(() => {
    setState(prev => {
      const preset = COLLISION_PRESETS.find(p => p.collisionType === prev.collisionType) || COLLISION_PRESETS[0];
      const balls = preset.balls.map((b, i) => ({
        ...b,
        id: `ball-${i}`,
        trail: [],
      }));

      const momentum = calculateTotalMomentum(balls);
      const energy = calculateTotalEnergy(balls);

      return {
        ...prev,
        balls,
        isPaused: true,
        totalMomentumX: momentum.x,
        totalMomentumY: momentum.y,
        totalEnergy: energy,
        initialMomentumX: momentum.x,
        initialMomentumY: momentum.y,
        initialEnergy: energy,
      };
    });
    setSelectedBallId(null);
  }, []);

  const setCollisionType = useCallback((type: CollisionType) => {
    setState(prev => ({ ...prev, collisionType: type }));
  }, []);

  const toggleDisplay = useCallback((key: 'showVelocityVectors' | 'showMomentumVectors' | 'showTrails' | 'showGrid') => {
    setState(prev => ({ ...prev, [key]: !prev[key] }));
  }, []);

  const loadPreset = useCallback((presetId: string) => {
    const preset = COLLISION_PRESETS.find(p => p.id === presetId);
    if (!preset) return;

    const balls = preset.balls.map((b, i) => ({
      ...b,
      id: `ball-${i}`,
      trail: [],
    }));

    const momentum = calculateTotalMomentum(balls);
    const energy = calculateTotalEnergy(balls);

    setState(prev => ({
      ...prev,
      balls,
      collisionType: preset.collisionType,
      isPaused: true,
      totalMomentumX: momentum.x,
      totalMomentumY: momentum.y,
      totalEnergy: energy,
      initialMomentumX: momentum.x,
      initialMomentumY: momentum.y,
      initialEnergy: energy,
    }));
    setSelectedBallId(null);
  }, []);

  const addBall = useCallback((x: number, y: number) => {
    setState(prev => {
      const newBall: Ball = {
        id: `ball-${Date.now()}`,
        x,
        y,
        vx: 0,
        vy: 0,
        radius: 25,
        mass: 1,
        color: `hsl(${Math.random() * 360}, 70%, 60%)`,
        trail: [],
      };
      return { ...prev, balls: [...prev.balls, newBall] };
    });
  }, []);

  const updateBallVelocity = useCallback((id: string, vx: number, vy: number) => {
    setState(prev => ({
      ...prev,
      balls: prev.balls.map(ball =>
        ball.id === id ? { ...ball, vx, vy } : ball
      ),
    }));
  }, []);

  const deleteBall = useCallback((id: string) => {
    setState(prev => ({
      ...prev,
      balls: prev.balls.filter(ball => ball.id !== id),
    }));
    if (selectedBallId === id) {
      setSelectedBallId(null);
    }
  }, [selectedBallId]);

  const selectBall = useCallback((id: string | null) => {
    setSelectedBallId(id);
  }, []);

  return {
    state,
    canvasRef,
    togglePause,
    reset,
    setCollisionType,
    toggleDisplay,
    loadPreset,
    addBall,
    updateBallVelocity,
    deleteBall,
    selectedBallId,
    selectBall,
  };
}
