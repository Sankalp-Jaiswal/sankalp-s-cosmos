import React from 'react';

export default function ChatMessage({ message, isOwn }) {
  const time = new Date(message.timestamp).toLocaleTimeString('en-US', {
    hour: '2-digit',
    minute: '2-digit',
    hour12: false,
  });

  return (
    <div className={`flex w-full mb-3 ${isOwn ? 'justify-end' : 'justify-start'}`}>
      <div className={`max-w-[80%] ${isOwn ? 'items-end' : 'items-start'}`}>
        {!isOwn && (
          <div className="flex items-center gap-1.5 mb-1">
            <div
              className="w-2.5 h-2.5 rounded-full"
              style={{ backgroundColor: message.from.color }}
            />
            <span className="text-[10px] text-cosmos-text-muted font-medium">
              {message.from.username}
            </span>
          </div>
        )}
        <div
          className={`px-3.5 py-2 rounded-2xl text-sm leading-relaxed ${
            isOwn
              ? 'bg-cosmos-accent text-white rounded-br-md'
              : 'bg-cosmos-border text-cosmos-text rounded-bl-md'
          }`}
        >
          {message.text}
        </div>
        <span className={`text-[10px] text-cosmos-text-muted mt-1 block ${isOwn ? 'text-right' : 'text-left'}`}>
          {time}
        </span>
      </div>
    </div>
  );
}
