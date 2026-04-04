import { CONFIG } from '../constants/config';

/**
 * Linear interpolation between two values
 */
export function lerp(current, target, factor = CONFIG.LERP_FACTOR) {
  return current + (target - current) * factor;
}

/**
 * Interpolate a 2D position
 */
export function lerpPosition(current, target, factor = CONFIG.LERP_FACTOR) {
  return {
    x: lerp(current.x, target.x, factor),
    y: lerp(current.y, target.y, factor),
  };
}

/**
 * Check if interpolation is close enough to snap
 */
export function isCloseEnough(current, target, threshold = 0.5) {
  return Math.abs(current - target) < threshold;
}
