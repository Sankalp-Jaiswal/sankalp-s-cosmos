import React, { useRef, useEffect } from 'react';
import { usePixiApp } from './usePixiApp';
import { usePlayerMovement } from './usePlayerMovement';
import { useRemotePlayers } from './useRemotePlayers';
import { drawGridBackground, drawStars } from './GridBackground';

export default function CosmosCanvas({ emitPosition }) {
  const containerRef = useRef(null);
  const { app, worldContainer } = usePixiApp(containerRef);

  // Draw background once world container is ready
  useEffect(() => {
    if (!worldContainer.current) return;
    
    const world = worldContainer.current;
    const grid = drawGridBackground(world);
    const stars = drawStars(world);

    return () => {
      // Safety check: if the world container is still valid and not destroyed
      if (grid && !grid.destroyed) {
        grid.destroy({ children: true });
      }
      if (stars && !stars.destroyed) {
        stars.destroy({ children: true });
      }
    };
  }, [worldContainer.current]);

  // Player movement
  usePlayerMovement(app, emitPosition);

  // Remote player rendering
  useRemotePlayers(app, worldContainer);

  return (
    <div
      ref={containerRef}
      id="cosmos-canvas"
      className="absolute inset-0 w-full h-full"
      style={{ cursor: 'crosshair' }}
    />
  );
}
