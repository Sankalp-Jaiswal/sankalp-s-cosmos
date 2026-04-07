import { Server } from 'socket.io';
import { connectionHandler } from './handlers/connectionHandler.js';
import { movementHandler } from './handlers/movementHandler.js';
import { chatHandler } from './handlers/chatHandler.js';

var ioInstance;

export function initSocket(server) {
  ioInstance = new Server(server, {
    cors: {
      origin: "*", // allow all for now
      methods: ['GET', 'POST'],
    }
  });

  ioInstance.on('connection', (s) => {
    console.log("Someone connected: " + s.id);

    // calling my handlers
    connectionHandler(s, ioInstance);
    movementHandler(s, ioInstance);
    chatHandler(s, ioInstance);
  });

  return ioInstance;
}

export function getIO() {
  return ioInstance;
}
