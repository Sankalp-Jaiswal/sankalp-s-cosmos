import roomStore from '../store/roomStore.js';

export function chatHandler(socket, io) {
  socket.on('chat:message', ({ roomId, text }) => {
    const user = roomStore.getUser(socket.id);
    if (!user || !text || !text.trim()) return;

    const message = {
      roomId,
      from: {
        userId: user.userId,
        username: user.username,
        color: user.color,
      },
      text: text.trim(),
      timestamp: Date.now(),
    };

    // Broadcast message to the specific room (both users)
    io.to(roomId).emit('chat:message', message);
  });
}
