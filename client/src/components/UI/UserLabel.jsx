import React from 'react';

export default function UserLabel({ username, color }) {
  return (
    <div className="flex items-center gap-1.5">
      <div
        className="w-2.5 h-2.5 rounded-full"
        style={{ backgroundColor: color }}
      />
      <span className="text-cosmos-text text-xs font-medium">{username}</span>
    </div>
  );
}
