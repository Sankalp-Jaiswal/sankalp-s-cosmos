import React from 'react';

export default function Layout({ children }) {
  return (
    <div className="relative w-screen h-screen overflow-hidden bg-cosmos-bg font-sans">
      {children}
    </div>
  );
}
