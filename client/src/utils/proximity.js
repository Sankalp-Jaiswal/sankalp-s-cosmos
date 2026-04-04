/**
 * Calculate Euclidean distance between two points
 */
export function getDistance(x1, y1, x2, y2) {
  const dx = x2 - x1;
  const dy = y2 - y1;
  return Math.sqrt(dx * dx + dy * dy);
}

/**
 * Check if two points are within proximity radius
 */
export function isInProximity(x1, y1, x2, y2, radius) {
  return getDistance(x1, y1, x2, y2) < radius;
}
