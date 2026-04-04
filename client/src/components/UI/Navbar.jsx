import React from 'react';
import { motion } from 'framer-motion';
import useCosmosStore from '../../store/cosmosStore';

export default function Navbar() {
  const { localUser, activeConnections, spaceUserCount } = useCosmosStore();
  const nearbyCount = Object.keys(activeConnections).length;

  return (
    <motion.nav
      initial={{ y: -60, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ delay: 0.2, duration: 0.5, ease: 'easeOut' }}
      className="fixed top-0 left-0 right-0 z-50 h-12 flex items-center justify-between px-5"
      id="navbar"
    >
      {/* Glass background */}
      <div className="absolute inset-0 bg-cosmos-bg/60 backdrop-blur-lg border-b border-cosmos-border/10" />

      {/* Left: Logo */}
      <div className="relative flex items-center gap-2">
        <span className="text-cosmos-text font-bold text-sm tracking-tight">
          Sankalp's Cosmos
        </span>
      </div>

      {/* Center: Connection status */}
      <div className="relative">
        <div className={`flex items-center gap-2 px-3 py-1 rounded-full text-xs font-medium
          ${nearbyCount > 0 
            ? 'bg-cosmos-connected/10 text-cosmos-connected border border-cosmos-connected/20' 
            : 'bg-cosmos-surface/30 text-cosmos-text-muted border border-cosmos-border/20'
          }`}
        >
          <span className={`w-1.5 h-1.5 rounded-full ${nearbyCount > 0 ? 'bg-cosmos-connected animate-pulse' : 'bg-cosmos-muted'}`} />
          {nearbyCount} nearby
        </div>
      </div>

      {/* Right: User info */}
      <div className="relative flex items-center gap-3">
        <span className="text-cosmos-text-muted text-xs">
          {spaceUserCount} in cosmos
        </span>
        {localUser && (
          <div className="flex items-center gap-2">
            <div
              className="w-3 h-3 rounded-full ring-1 ring-white/10"
              style={{ backgroundColor: localUser.color }}
            />
            <span className="text-cosmos-text text-xs font-medium">
              {localUser.username}
            </span>
          </div>
        )}
      </div>
    </motion.nav>
  );
}
