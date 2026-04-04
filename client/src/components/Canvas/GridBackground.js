import * as PIXI from 'pixi.js';
import { CONFIG } from '../../constants/config';

/**
 * Draw a dot-grid background on the world container.
 * Returns the PIXI.Graphics object for cleanup.
 */
export function drawGridBackground(worldContainer) {
  const grid = new PIXI.Graphics();
  grid.zIndex = -100;

  const { CANVAS_WIDTH, CANVAS_HEIGHT, GRID_SPACING, GRID_DOT_COLOR, GRID_DOT_RADIUS } = CONFIG;

  // Draw dots
  grid.beginFill(GRID_DOT_COLOR, 0.6);
  for (let x = 0; x <= CANVAS_WIDTH; x += GRID_SPACING) {
    for (let y = 0; y <= CANVAS_HEIGHT; y += GRID_SPACING) {
      grid.drawCircle(x, y, GRID_DOT_RADIUS);
    }
  }
  grid.endFill();

  // Draw canvas boundary (subtle)
  grid.lineStyle(1, 0x1a1a2e, 0.3);
  grid.drawRect(0, 0, CANVAS_WIDTH, CANVAS_HEIGHT);

  worldContainer.addChild(grid);
  return grid;
}

/**
 * Draw decorative stars across the background
 */
export function drawStars(worldContainer) {
  const stars = new PIXI.Graphics();
  stars.zIndex = -99;

  const { CANVAS_WIDTH, CANVAS_HEIGHT } = CONFIG;

  // Create random stars across the canvas
  for (let i = 0; i < 200; i++) {
    const x = Math.random() * CANVAS_WIDTH;
    const y = Math.random() * CANVAS_HEIGHT;
    const radius = Math.random() * 1.5 + 0.3;
    const alpha = Math.random() * 0.4 + 0.1;

    stars.beginFill(0xffffff, alpha);
    stars.drawCircle(x, y, radius);
    stars.endFill();
  }

  // A few colored accent stars
  for (let i = 0; i < 30; i++) {
    const x = Math.random() * CANVAS_WIDTH;
    const y = Math.random() * CANVAS_HEIGHT;
    const radius = Math.random() * 1.8 + 0.5;
    const alpha = Math.random() * 0.3 + 0.1;
    const color = Math.random() > 0.5 ? CONFIG.COLORS.ACCENT : 0x22C55E;

    stars.beginFill(color, alpha);
    stars.drawCircle(x, y, radius);
    stars.endFill();
  }

  worldContainer.addChild(stars);
  return stars;
}
