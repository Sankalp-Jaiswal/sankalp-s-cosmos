import { useEffect, useRef, useCallback } from 'react';
import { CONFIG } from '../../constants/config';
import useCosmosStore from '../../store/cosmosStore';

export function usePlayerMovement(app, emitPosition) {
  const keysRef = useRef(new Set());
  const lastEmitRef = useRef(0);
  const tickerCallbackRef = useRef(null);

  const handleKeyDown = useCallback((e) => {
    const key = e.key.toLowerCase();
    if (['w', 'a', 's', 'd', 'arrowup', 'arrowdown', 'arrowleft', 'arrowright'].includes(key)) {
      // Don't capture keys if user is typing in an input
      if (e.target.tagName === 'INPUT' || e.target.tagName === 'TEXTAREA') return;
      e.preventDefault();
      keysRef.current.add(key);
    }
  }, []);

  const handleKeyUp = useCallback((e) => {
    const key = e.key.toLowerCase();
    keysRef.current.delete(key);
  }, []);

  useEffect(() => {
    window.addEventListener('keydown', handleKeyDown);
    window.addEventListener('keyup', handleKeyUp);

    return () => {
      window.removeEventListener('keydown', handleKeyDown);
      window.removeEventListener('keyup', handleKeyUp);
    };
  }, [handleKeyDown, handleKeyUp]);

  useEffect(() => {
    if (!app.current) return;

    const ticker = app.current.ticker;

    tickerCallbackRef.current = () => {
      const keys = keysRef.current;
      if (keys.size === 0) return;

      const { localUser, setPosition } = useCosmosStore.getState();
      if (!localUser) return;

      let dx = 0;
      let dy = 0;
      const speed = CONFIG.MOVE_SPEED;

      if (keys.has('w') || keys.has('arrowup')) dy -= speed;
      if (keys.has('s') || keys.has('arrowdown')) dy += speed;
      if (keys.has('a') || keys.has('arrowleft')) dx -= speed;
      if (keys.has('d') || keys.has('arrowright')) dx += speed;

      // Normalize diagonal movement
      if (dx !== 0 && dy !== 0) {
        const factor = 1 / Math.sqrt(2);
        dx *= factor;
        dy *= factor;
      }

      // Clamp to canvas bounds
      let newX = Math.max(CONFIG.AVATAR_RADIUS, Math.min(CONFIG.CANVAS_WIDTH - CONFIG.AVATAR_RADIUS, localUser.x + dx));
      let newY = Math.max(CONFIG.AVATAR_RADIUS, Math.min(CONFIG.CANVAS_HEIGHT - CONFIG.AVATAR_RADIUS, localUser.y + dy));

      setPosition(newX, newY);

      // Throttle emission
      const now = Date.now();
      if (now - lastEmitRef.current >= CONFIG.EMIT_THROTTLE_MS) {
        emitPosition(newX, newY);
        lastEmitRef.current = now;
      }
    };

    const runner = tickerCallbackRef.current;
    if (runner) {
      ticker.add(runner);
    }

    return () => {
      // Ensure the ticker still exists and hasn't been destroyed by app.destroy()
      if (app.current && app.current.ticker && runner) {
        app.current.ticker.remove(runner);
      }
    };
  }, [app, emitPosition]);

  return keysRef;
}
