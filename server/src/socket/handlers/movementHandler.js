import roomStore from '../store/roomStore.js';

export function movementHandler(socket, io) {
  socket.on('position:update', ({ x, y }) => {
    const user = roomStore.updatePosition(socket.id, x, y);
    if (!user) return;

    // Broadcast position to all other clients
    socket.broadcast.emit('position:sync', {
      userId: user.userId,
      x: user.x,
      y: user.y,
    });
  });
}
