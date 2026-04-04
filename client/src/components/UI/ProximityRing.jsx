import React from 'react';

// ProximityRing is rendered via PixiJS in useRemotePlayers.
// This component provides a DOM-based fallback/overlay if needed.
export default function ProximityRing({ radius = 150, color = '#6C63FF', active = false }) {
  return (
    <div
      className="absolute rounded-full pointer-events-none transition-all duration-500"
      style={{
        width: radius * 2,
        height: radius * 2,
        border: `1px solid ${active ? '#22C55E' : color}`,
        opacity: active ? 0.2 : 0.08,
        transform: 'translate(-50%, -50%)',
      }}
    />
  );
}
