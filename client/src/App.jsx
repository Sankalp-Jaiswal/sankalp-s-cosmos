import React, { useCallback } from 'react';
import { AnimatePresence } from 'framer-motion';
import useCosmosStore from './store/cosmosStore';
import { useSocket } from './hooks/useSocket';
import { useProximity } from './hooks/useProximity';
import Layout from './components/Layout';
import CosmosCanvas from './components/Canvas/CosmosCanvas';
import ChatPanel from './components/Chat/ChatPanel';
import Navbar from './components/UI/Navbar';
import ConnectionBadge from './components/UI/ConnectionBadge';
import EnterModal from './components/UI/EnterModal';

export default function App() {
  const { hasEntered, setHasEntered } = useCosmosStore();

  const {
    joinCosmos,
    emitPosition,
    emitProximityEnter,
    emitProximityLeave,
    sendMessage,
  } = useSocket();

  // Proximity detection
  useProximity(emitProximityEnter, emitProximityLeave);

  const handleJoin = useCallback((username) => {
    joinCosmos(username);
    setHasEntered(true);
  }, [joinCosmos, setHasEntered]);

  return (
    <Layout>
      <AnimatePresence mode="wait">
        {!hasEntered ? (
          <EnterModal key="enter-modal" onJoin={handleJoin} />
        ) : (
          <>
            {/* Canvas */}
            <CosmosCanvas emitPosition={emitPosition} />

            {/* UI Overlays */}
            <Navbar />
            <ConnectionBadge />
            <ChatPanel sendMessage={sendMessage} />

            {/* Movement hint (fades out after 5s) */}
            <HelpHint />
          </>
        )}
      </AnimatePresence>
    </Layout>
  );
}

// Small hint that fades away
function HelpHint() {
  const [visible, setVisible] = React.useState(true);

  React.useEffect(() => {
    const timer = setTimeout(() => setVisible(false), 6000);
    return () => clearTimeout(timer);
  }, []);

  if (!visible) return null;

  return (
    <div className="fixed bottom-5 left-1/2 -translate-x-1/2 z-30 animate-fade-in">
      <div className="bg-cosmos-panel/70 backdrop-blur-lg border border-cosmos-border/20 
        rounded-xl px-4 py-2 text-cosmos-text-muted text-xs flex items-center gap-3
        transition-opacity duration-1000"
        style={{ opacity: visible ? 1 : 0 }}
      >
        <div className="flex gap-1">
          <kbd className="px-1.5 py-0.5 bg-cosmos-surface/50 rounded text-[10px] border border-cosmos-border/30">W</kbd>
          <kbd className="px-1.5 py-0.5 bg-cosmos-surface/50 rounded text-[10px] border border-cosmos-border/30">A</kbd>
          <kbd className="px-1.5 py-0.5 bg-cosmos-surface/50 rounded text-[10px] border border-cosmos-border/30">S</kbd>
          <kbd className="px-1.5 py-0.5 bg-cosmos-surface/50 rounded text-[10px] border border-cosmos-border/30">D</kbd>
        </div>
        <span>to move around the cosmos</span>
      </div>
    </div>
  );
}
