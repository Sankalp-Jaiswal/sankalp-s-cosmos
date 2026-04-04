import { Server } from 'socket.io';
import { connectionHandler } from './handlers/connectionHandler.js';
import { movementHandler } from './handlers/movementHandler.js';
import { chatHandler } from './handlers/chatHandler.js';

let io;

export function initSocket(httpServer) {
  io = new Server(httpServer, {
    cors: {
      origin: process.env.CLIENT_URL || 'http://localhost:5173',
      methods: ['GET', 'POST'],
      credentials: true,
    },
    pingTimeout: 60000,
    pingInterval: 25000,
  });

  io.on('connection', (socket) => {
    console.log(`  ➜ Socket connected: ${socket.id}`);

    // Register all event handlers
    connectionHandler(socket, io);
    movementHandler(socket, io);
    chatHandler(socket, io);
  });

  return io;
}

export function getIO() {
  return io;
}
