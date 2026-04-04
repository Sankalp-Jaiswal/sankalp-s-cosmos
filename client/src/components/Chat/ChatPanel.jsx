import React, { useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import useCosmosStore from '../../store/cosmosStore';
import ChatMessage from './ChatMessage';
import ChatInput from './ChatInput';

export default function ChatPanel({ sendMessage }) {
  const {
    activeConnections,
    chatRooms,
    activeChatRoomId,
    localUser,
    setActiveChatRoom,
  } = useCosmosStore();

  const messagesEndRef = useRef(null);
  const connectionCount = Object.keys(activeConnections).length;
  const isOpen = connectionCount > 0;
  const activeRoom = activeChatRoomId ? chatRooms[activeChatRoomId] : null;
  const messages = activeRoom?.messages || [];

  // Auto-scroll to bottom on new messages
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages.length]);

  const handleSend = (text) => {
    if (activeChatRoomId) {
      sendMessage(activeChatRoomId, text);
    }
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          initial={{ x: 340, opacity: 0 }}
          animate={{ x: 0, opacity: 1 }}
          exit={{ x: 340, opacity: 0 }}
          transition={{ type: 'spring', damping: 25, stiffness: 250 }}
          className="fixed right-0 top-0 bottom-0 w-[320px] z-40 flex flex-col"
          id="chat-panel"
        >
          {/* Glass background */}
          <div className="absolute inset-0 bg-cosmos-panel/85 backdrop-blur-xl border-l border-cosmos-border/20" />

          {/* Content */}
          <div className="relative flex flex-col h-full">
            {/* Header */}
            <div className="flex items-center justify-between px-4 py-3 border-b border-cosmos-border/20">
              <div className="flex items-center gap-2">
                <div className="w-2 h-2 rounded-full bg-cosmos-connected animate-pulse" />
                <span className="text-cosmos-text text-sm font-medium">
                  Chat
                </span>
                <span className="text-cosmos-text-muted text-xs">
                  · {connectionCount} nearby
                </span>
              </div>
            </div>

            {/* Tabs if multiple connections */}
            {connectionCount > 1 && (
              <div className="flex gap-1 px-3 py-2 border-b border-cosmos-border/10 overflow-x-auto scrollbar-hide">
                {Object.entries(activeConnections).map(([userId, conn]) => (
                  <button
                    key={userId}
                    onClick={() => setActiveChatRoom(conn.roomId)}
                    className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium
                      transition-all duration-200 whitespace-nowrap
                      ${activeChatRoomId === conn.roomId
                        ? 'bg-cosmos-accent/20 text-cosmos-accent border border-cosmos-accent/30'
                        : 'bg-cosmos-surface/30 text-cosmos-text-muted hover:bg-cosmos-surface/50'
                      }`}
                  >
                    <div
                      className="w-2 h-2 rounded-full"
                      style={{ backgroundColor: conn.color }}
                    />
                    {conn.username}
                  </button>
                ))}
              </div>
            )}

            {/* Active connection header */}
            {activeRoom?.targetUser && (
              <div className="flex items-center gap-2.5 px-4 py-2.5 border-b border-cosmos-border/10">
                <div
                  className="w-6 h-6 rounded-full ring-2 ring-cosmos-connected/30"
                  style={{ backgroundColor: activeRoom.targetUser.color }}
                />
                <div>
                  <p className="text-cosmos-text text-sm font-medium leading-tight">
                    {activeRoom.targetUser.username}
                  </p>
                  <p className="text-cosmos-connected text-[10px]">Connected</p>
                </div>
              </div>
            )}

            {/* Messages */}
            <div className="flex-1 overflow-y-auto px-3 py-3 space-y-1 scrollbar-thin">
              {messages.length === 0 ? (
                <div className="flex flex-col items-center justify-center h-full text-center">
                  <div className="text-2xl mb-2">💬</div>
                  <p className="text-cosmos-text-muted text-xs">
                    You're connected! Say hello.
                  </p>
                </div>
              ) : (
                messages.map((msg, i) => (
                  <ChatMessage
                    key={`${msg.timestamp}-${i}`}
                    message={msg}
                    isOwn={msg.from.userId === localUser?.userId}
                  />
                ))
              )}
              <div ref={messagesEndRef} />
            </div>

            {/* Input */}
            <ChatInput onSend={handleSend} disabled={!activeChatRoomId} />
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
