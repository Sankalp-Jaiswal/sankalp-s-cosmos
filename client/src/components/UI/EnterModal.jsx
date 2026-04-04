import React, { useState, useCallback, useEffect, useRef, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

// Starfield particle with fixed position
const Star = React.memo(({ x, y, delay }) => {
  return (
    <div
      className="absolute w-[2px] h-[2px] bg-white rounded-full animate-star-twinkle"
      style={{
        left: `${x}%`,
        top: `${y}%`,
        animationDelay: `${delay}s`,
      }}
    />
  );
});

export default function EnterModal({ onJoin }) {
  const [username, setUsername] = useState('');
  const [error, setError] = useState('');

  // Static stars data so they don't move during re-renders
  const backgroundStars = useMemo(() => {
    return Array.from({ length: 80 }, () => ({
      x: Math.random() * 100,
      y: Math.random() * 100,
      delay: Math.random() * 4,
    }));
  }, []);

  const inputRef = useRef(null);

  useEffect(() => {
    inputRef.current?.focus();
  }, []);

  const handleSubmit = useCallback((e) => {
    e.preventDefault();
    const trimmed = username.trim();
    if (!trimmed) {
      setError('Username is required');
      return;
    }
    if (trimmed.length > 20) {
      setError('Max 20 characters');
      return;
    }
    setError('');
    onJoin(trimmed);
  }, [username, onJoin]);

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="fixed inset-0 z-[100] flex items-center justify-center"
        id="enter-modal"
      >
        {/* Background */}
        <div className="absolute inset-0 bg-cosmos-bg">
          {/* Starfield - Constant Flow */}
          {backgroundStars.map((star, i) => (
            <Star key={i} x={star.x} y={star.y} delay={star.delay} />
          ))}

          {/* Gradient orbs */}
          <div className="absolute top-1/4 left-1/4 w-96 h-96 rounded-full bg-cosmos-accent/5 blur-[120px]" />
          <div className="absolute bottom-1/4 right-1/4 w-80 h-80 rounded-full bg-purple-500/5 blur-[100px]" />
        </div>

        {/* Card */}
        <motion.div
          initial={{ scale: 0.9, y: 20, opacity: 0 }}
          animate={{ scale: 1, y: 0, opacity: 1 }}
          transition={{ delay: 0.2, type: 'spring', damping: 20 }}
          className="relative w-[380px] mx-4"
        >
          <div className="bg-cosmos-panel/60 backdrop-blur-2xl border border-cosmos-border/20 
            rounded-2xl p-8 shadow-2xl shadow-cosmos-accent/5"
          >
            {/* Logo */}
            <div className="text-center mb-8">
              <h1 className="text-2xl font-bold text-cosmos-text tracking-tight">
                Sankalp's Cosmos
              </h1>
              <p className="text-cosmos-text-muted text-sm mt-2">
                Join the virtual space and explore with others
              </p>
            </div>

            {/* Form */}
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <input
                  ref={inputRef}
                  type="text"
                  value={username}
                  onChange={(e) => {
                    setUsername(e.target.value);
                    if (error) setError('');
                  }}
                  placeholder="Your username"
                  maxLength={20}
                  className="w-full bg-cosmos-surface/40 text-cosmos-text text-sm px-4 py-3 rounded-xl
                    border border-cosmos-border/30 outline-none transition-all duration-200
                    placeholder:text-cosmos-text-muted/40
                    focus:border-cosmos-accent/50 focus:ring-2 focus:ring-cosmos-accent/10"
                  id="username-input"
                />
                {error && (
                  <motion.p
                    initial={{ opacity: 0, y: -5 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="text-red-400 text-xs mt-2 pl-1"
                  >
                    {error}
                  </motion.p>
                )}
              </div>

              <button
                type="submit"
                className="w-full bg-cosmos-accent text-white text-sm font-medium py-3 rounded-xl
                  transition-all duration-200 hover:bg-cosmos-accent/90 active:scale-[0.98]
                  shadow-lg shadow-cosmos-accent/20 hover:shadow-cosmos-accent/30"
                id="join-btn"
              >
                Join Space
              </button>
            </form>

            {/* Footer hint */}
            <p className="text-cosmos-text-muted/40 text-[10px] text-center mt-6">
              Use WASD or Arrow keys to move around
            </p>
          </div>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
}
