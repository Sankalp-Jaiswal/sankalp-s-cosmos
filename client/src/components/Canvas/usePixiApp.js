import { useEffect, useRef } from 'react';
import * as PIXI from 'pixi.js';
import { CONFIG } from '../../constants/config';

export function usePixiApp(containerRef) {
  const appRef = useRef(null);
  const stageRef = useRef(null);

  useEffect(() => {
    if (!containerRef.current || appRef.current) return;

    const app = new PIXI.Application({
      width: window.innerWidth,
      height: window.innerHeight,
      backgroundColor: CONFIG.COLORS.CANVAS_BG,
      antialias: true,
      resolution: window.devicePixelRatio || 1,
      autoDensity: true,
    });

    containerRef.current.appendChild(app.view);
    app.view.style.width = '100%';
    app.view.style.height = '100%';

    // World container (holds everything, moved for camera)
    const worldContainer = new PIXI.Container();
    worldContainer.sortableChildren = true;
    app.stage.addChild(worldContainer);

    appRef.current = app;
    stageRef.current = worldContainer;

    // Handle window resize
    const handleResize = () => {
      app.renderer.resize(window.innerWidth, window.innerHeight);
    };
    window.addEventListener('resize', handleResize);

    return () => {
      window.removeEventListener('resize', handleResize);
      if (appRef.current) {
        appRef.current.destroy(true, { children: true, texture: true, baseTexture: true });
        appRef.current = null;
        stageRef.current = null;
      }
    };
  }, [containerRef]);

  return { app: appRef, worldContainer: stageRef };
}
