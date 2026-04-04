export const CONFIG = {
  PROXIMITY_RADIUS: parseInt(import.meta.env.VITE_PROXIMITY_RADIUS) || 150,
  CANVAS_WIDTH: parseInt(import.meta.env.VITE_CANVAS_WIDTH) || 3000,
  CANVAS_HEIGHT: parseInt(import.meta.env.VITE_CANVAS_HEIGHT) || 3000,
  SOCKET_URL: import.meta.env.VITE_SOCKET_URL || 'http://localhost:4000',

  // Movement
  MOVE_SPEED: 3,
  EMIT_THROTTLE_MS: 50,
  PROXIMITY_CHECK_MS: 200,

  // Visual
  GRID_SPACING: 30,
  GRID_DOT_COLOR: 0x1E1E35,
  GRID_DOT_RADIUS: 1.2,
  CANVAS_BG_COLOR: 0x0D0D1A,

  // Avatar
  AVATAR_RADIUS: 18,
  AVATAR_GLOW_RADIUS: 28,
  PROXIMITY_RING_RADIUS: 150,
  LABEL_OFFSET_Y: -38,

  // Colors
  COLORS: {
    ACCENT: 0x6C63FF,
    CONNECTED: 0x22C55E,
    MUTED: 0x3F3F5A,
    WHITE: 0xFFFFFF,
    BG: 0x0A0A0F,
    CANVAS_BG: 0x0D0D1A,
  },

  // Interpolation
  LERP_FACTOR: 0.15,

  // Away status
  AWAY_TIMEOUT_MS: 30000,
};
