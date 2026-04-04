import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import useCosmosStore from '../../store/cosmosStore';

export default function ConnectionBadge() {
  const { activeConnections } = useCosmosStore();
  const connections = Object.values(activeConnections);
  const isActive = connections.length > 0;

  return (
    <AnimatePresence>
      {isActive && (
        <motion.div
          initial={{ y: 20, opacity: 0, scale: 0.95 }}
          animate={{ y: 0, opacity: 1, scale: 1 }}
          exit={{ y: 20, opacity: 0, scale: 0.95 }}
          transition={{ type: 'spring', damping: 20, stiffness: 300 }}
          className="fixed bottom-5 left-5 z-40"
          id="connection-badge"
        >
          <div className="relative flex items-center gap-2 px-4 py-2.5 rounded-xl
            bg-cosmos-panel/80 backdrop-blur-lg border border-cosmos-connected/20
            shadow-[0_0_20px_rgba(34,197,94,0.1)]"
          >
            <div className="w-2 h-2 rounded-full bg-cosmos-connected animate-pulse" />
            <span className="text-cosmos-text text-xs font-medium">
              Connected to:{' '}
              {connections.map((c, i) => (
                <span key={c.userId || i}>
                  <span className="text-cosmos-connected">@{c.username}</span>
                  {i < connections.length - 1 ? ', ' : ''}
                </span>
              ))}
            </span>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
