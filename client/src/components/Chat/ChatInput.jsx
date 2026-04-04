import React, { useState, useRef, useCallback } from 'react';

export default function ChatInput({ onSend, disabled }) {
  const [text, setText] = useState('');
  const inputRef = useRef(null);

  const handleSend = useCallback(() => {
    const trimmed = text.trim();
    if (!trimmed || disabled) return;
    onSend(trimmed);
    setText('');
    inputRef.current?.focus();
  }, [text, disabled, onSend]);

  const handleKeyDown = useCallback((e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      e.stopPropagation();
      handleSend();
    }
  }, [handleSend]);

  return (
    <div className="flex items-center gap-2 p-3 border-t border-cosmos-border/30 bg-cosmos-panel/80">
      <input
        ref={inputRef}
        type="text"
        value={text}
        onChange={(e) => setText(e.target.value)}
        onKeyDown={handleKeyDown}
        placeholder={disabled ? 'Move closer to chat...' : 'Message...'}
        disabled={disabled}
        maxLength={500}
        className={`flex-1 bg-cosmos-surface/60 text-cosmos-text text-sm px-4 py-2.5 rounded-xl
          border border-cosmos-border/30 outline-none transition-all duration-200
          placeholder:text-cosmos-text-muted/50
          ${disabled 
            ? 'opacity-40 cursor-not-allowed' 
            : 'focus:border-cosmos-accent/50 focus:ring-1 focus:ring-cosmos-accent/20'
          }`}
        id="chat-input"
      />
      <button
        onClick={handleSend}
        disabled={disabled || !text.trim()}
        className={`p-2.5 rounded-xl transition-all duration-200
          ${disabled || !text.trim()
            ? 'bg-cosmos-surface/30 text-cosmos-text-muted/30 cursor-not-allowed'
            : 'bg-cosmos-accent text-white hover:bg-cosmos-accent/80 active:scale-95'
          }`}
        id="chat-send-btn"
      >
        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <line x1="22" y1="2" x2="11" y2="13" />
          <polygon points="22 2 15 22 11 13 2 9 22 2" />
        </svg>
      </button>
    </div>
  );
}
