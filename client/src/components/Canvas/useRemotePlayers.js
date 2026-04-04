import { useEffect, useRef } from 'react';
import * as PIXI from 'pixi.js';
import { CONFIG } from '../../constants/config';
import { lerp, isCloseEnough } from '../../utils/interpolate';
import useCosmosStore from '../../store/cosmosStore';

/**
 * Creates a player avatar container with an astronaut helmet design
 */
function createPlayerSprite(user, isLocal = false) {
  const container = new PIXI.Container();
  container.zIndex = isLocal ? 10 : 5;
  container.position.set(user.x, user.y);

  const colorNum = typeof user.color === 'string' 
    ? parseInt(user.color.replace('#', ''), 16) 
    : user.color;

  // 1. Proximity ring (local only)
  if (isLocal) {
    const proximityRing = new PIXI.Graphics();
    proximityRing.lineStyle(1, CONFIG.COLORS.ACCENT, 0.12);
    proximityRing.drawCircle(0, 0, CONFIG.PROXIMITY_RING_RADIUS);
    proximityRing.name = 'proximityRing';
    container.addChild(proximityRing);
  }

  // 2. Outer glow ring
  const glowRing = new PIXI.Graphics();
  const glowColor = isLocal ? CONFIG.COLORS.ACCENT : colorNum;
  glowRing.beginFill(glowColor, 0.1);
  glowRing.drawCircle(0, 0, CONFIG.AVATAR_GLOW_RADIUS);
  glowRing.endFill();
  glowRing.lineStyle(1.5, glowColor, 0.4);
  glowRing.drawCircle(0, 0, CONFIG.AVATAR_GLOW_RADIUS);
  glowRing.name = 'glowRing';
  container.addChild(glowRing);

  // 3. ASTRONAUT HELMET (Main Body)
  const helmet = new PIXI.Graphics();
  
  // Outer Shell
  helmet.beginFill(colorNum);
  // Draw a rounded rectangle-like shape for the helmet
  helmet.drawRoundedRect(-14, -16, 28, 28, 8);
  helmet.endFill();
  
  // Helmet Highlight
  helmet.beginFill(0xffffff, 0.2);
  helmet.drawCircle(-6, -8, 4);
  helmet.endFill();

  // 4. VISOR (The "Glass" part)
  const visor = new PIXI.Graphics();
  visor.beginFill(0x1a1a2e); // Dark glass
  visor.drawRoundedRect(-10, -10, 20, 12, 4);
  visor.endFill();
  
  // Visor reflection
  visor.beginFill(0xffffff, 0.1);
  visor.drawRect(-8, -8, 16, 3);
  visor.endFill();

  container.addChild(helmet);
  container.addChild(visor);

  // 5. Username label
  const label = new PIXI.Text(user.username, {
    fontFamily: 'Inter, system-ui, sans-serif',
    fontSize: 12,
    fill: 0xe0e0f0,
    fontWeight: '600',
    align: 'center',
  });
  label.anchor.set(0.5, 1);
  label.position.set(0, CONFIG.LABEL_OFFSET_Y);
  label.name = 'label';
  container.addChild(label);

  // "You" indicator for local player
  if (isLocal) {
    const youLabel = new PIXI.Text('(you)', {
      fontFamily: 'Inter, system-ui, sans-serif',
      fontSize: 9,
      fill: 0x6B6B8D,
      fontWeight: '400',
      align: 'center',
    });
    youLabel.anchor.set(0.5, 1);
    youLabel.position.set(0, CONFIG.LABEL_OFFSET_Y - 14);
    container.addChild(youLabel);
  }

  return container;
}

/**
 * Update glow ring color based on connection state
 */
function updateGlowState(container, isConnected) {
  const glowRing = container.getChildByName('glowRing');
  if (!glowRing) return;

  glowRing.clear();
  const color = isConnected ? CONFIG.COLORS.CONNECTED : CONFIG.COLORS.ACCENT;
  const alpha = isConnected ? 0.25 : 0.15;
  
  glowRing.beginFill(color, alpha);
  glowRing.drawCircle(0, 0, CONFIG.AVATAR_GLOW_RADIUS);
  glowRing.endFill();
  glowRing.lineStyle(2, color, isConnected ? 0.9 : 0.6);
  glowRing.drawCircle(0, 0, CONFIG.AVATAR_GLOW_RADIUS);
}

export function useRemotePlayers(app, worldContainer) {
  const spritesRef = useRef(new Map());
  const localSpriteRef = useRef(null);
  const pulseTimeRef = useRef(0);

  useEffect(() => {
    if (!app.current || !worldContainer.current) return;

    const ticker = app.current.ticker;

    const tickerCallback = () => {
      const { localUser, remoteUsers, activeConnections, setRemoteInterpolatedPosition } = useCosmosStore.getState();
      if (!localUser || !worldContainer.current) return;

      pulseTimeRef.current += 0.03;

      // ─── LOCAL PLAYER ─────────────────────────
      if (!localSpriteRef.current) {
        const sprite = createPlayerSprite(localUser, true);
        worldContainer.current.addChild(sprite);
        localSpriteRef.current = sprite;
      }

      const localSprite = localSpriteRef.current;
      localSprite.position.set(localUser.x, localUser.y);

      // Check if local player is connected to anyone
      const isLocalConnected = Object.keys(activeConnections).length > 0;
      updateGlowState(localSprite, isLocalConnected);

      // Pulse effect when connected
      if (isLocalConnected) {
        const scale = 1 + Math.sin(pulseTimeRef.current * 2) * 0.05;
        const glowRing = localSprite.getChildByName('glowRing');
        if (glowRing) glowRing.scale.set(scale);
      }

      // ─── CAMERA ─────────────────────────
      const offsetX = window.innerWidth / 2 - localUser.x;
      const offsetY = window.innerHeight / 2 - localUser.y;
      worldContainer.current.position.set(offsetX, offsetY);

      // ─── REMOTE PLAYERS ─────────────────────────
      const currentRemoteIds = new Set(Object.keys(remoteUsers));

      // Remove sprites for users who left
      for (const [userId, sprite] of spritesRef.current) {
        if (!currentRemoteIds.has(userId)) {
          worldContainer.current.removeChild(sprite);
          sprite.destroy({ children: true });
          spritesRef.current.delete(userId);
        }
      }

      // Add/update remote players
      for (const [userId, remote] of Object.entries(remoteUsers)) {
        let sprite = spritesRef.current.get(userId);

        // Create sprite if new
        if (!sprite) {
          sprite = createPlayerSprite(remote);
          worldContainer.current.addChild(sprite);
          spritesRef.current.set(userId, sprite);
        }

        // Interpolate position
        const newX = lerp(sprite.position.x, remote.targetX);
        const newY = lerp(sprite.position.y, remote.targetY);
        sprite.position.set(
          isCloseEnough(newX, remote.targetX) ? remote.targetX : newX,
          isCloseEnough(newY, remote.targetY) ? remote.targetY : newY
        );

        // Update store with interpolated position (for proximity calc)
        setRemoteInterpolatedPosition(userId, sprite.position.x, sprite.position.y);

        // Update glow based on connection
        const isConnected = !!activeConnections[userId];
        updateGlowState(sprite, isConnected);

        // Pulse animation for connected remote players
        if (isConnected) {
          const scale = 1 + Math.sin(pulseTimeRef.current * 2) * 0.05;
          const glowRing = sprite.getChildByName('glowRing');
          if (glowRing) glowRing.scale.set(scale);
        }
      }
    };

    ticker.add(tickerCallback);

    return () => {
      // Ensure the ticker exists and hasn't been destroyed
      if (app.current && app.current.ticker) {
        app.current.ticker.remove(tickerCallback);
      }

      // Cleanup all sprites with individual destroyed checks
      spritesRef.current.forEach((sprite) => {
        if (!sprite.destroyed) {
          sprite.destroy({ children: true });
        }
      });
      spritesRef.current.clear();
      
      if (localSpriteRef.current && !localSpriteRef.current.destroyed) {
        localSpriteRef.current.destroy({ children: true });
        localSpriteRef.current = null;
      }
    };
  }, [app, worldContainer]);

  return spritesRef;
}
