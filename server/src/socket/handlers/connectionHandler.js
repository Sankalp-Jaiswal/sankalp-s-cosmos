import { v4 as uuidv4 } from 'uuid';
import roomStore from '../store/roomStore.js';

export function connectionHandler(socket, io) {
  // Handle user joining the cosmos
  socket.on('user:join', ({ username }) => {
    const userId = uuidv4();
    const user = roomStore.addUser(socket.id, { userId, username });

    // Send the new user their own info
    socket.emit('user:joined:self', {
      userId: user.userId,
      username: user.username,
      x: user.x,
      y: user.y,
      color: user.color,
    });

    // Send existing space state to the new user
    const allUsers = roomStore.getAllUsers().filter(u => u.userId !== userId);
    socket.emit('space:state', { users: allUsers });

    // Notify all others that a new user joined
    socket.broadcast.emit('user:joined', {
      userId: user.userId,
      username: user.username,
      x: user.x,
      y: user.y,
      color: user.color,
    });

    // Broadcast updated user count
    io.emit('space:count', { count: roomStore.getUserCount() });

    console.log(`${username} joined the cosmos (${roomStore.getUserCount()} total)`);
  });

  // Proximity enter — create shared room for chat
  socket.on('proximity:enter', ({ targetId }) => {
    const user = roomStore.getUser(socket.id);
    if (!user) return;

    const targetSocketId = roomStore.getSocketIdByUserId(targetId);
    if (!targetSocketId) return;

    const targetUser = roomStore.getUser(targetSocketId);
    if (!targetUser) return;

    // Check if already connected
    if (roomStore.isConnected(socket.id, targetSocketId)) return;

    // Create deterministic room ID
    const roomId = [user.userId, targetUser.userId].sort().join('_');

    // Join both sockets to the room
    socket.join(roomId);
    const targetSocket = io.sockets.sockets.get(targetSocketId);
    if (targetSocket) {
      targetSocket.join(roomId);
    }

    // Update connection state
    roomStore.addConnection(socket.id, targetSocketId);

    // Notify both users
    socket.emit('chat:connected', {
      roomId,
      targetUser: {
        userId: targetUser.userId,
        username: targetUser.username,
        color: targetUser.color,
      },
    });

    if (targetSocket) {
      targetSocket.emit('chat:connected', {
        roomId,
        targetUser: {
          userId: user.userId,
          username: user.username,
          color: user.color,
        },
      });
    }
  });

  // Proximity leave — remove from shared room
  socket.on('proximity:leave', ({ targetId }) => {
    const user = roomStore.getUser(socket.id);
    if (!user) return;

    const targetSocketId = roomStore.getSocketIdByUserId(targetId);
    if (!targetSocketId) return;

    const targetUser = roomStore.getUser(targetSocketId);
    if (!targetUser) return;

    // Check if actually connected
    if (!roomStore.isConnected(socket.id, targetSocketId)) return;

    const roomId = [user.userId, targetUser.userId].sort().join('_');

    // Leave the room
    socket.leave(roomId);
    const targetSocket = io.sockets.sockets.get(targetSocketId);
    if (targetSocket) {
      targetSocket.leave(roomId);
    }

    // Update connection state
    roomStore.removeConnection(socket.id, targetSocketId);

    // Notify both users
    socket.emit('chat:disconnected', { roomId, targetUserId: targetUser.userId });
    if (targetSocket) {
      targetSocket.emit('chat:disconnected', { roomId, targetUserId: user.userId });
    }
  });

  // Handle disconnect
  socket.on('disconnect', () => {
    const user = roomStore.getUser(socket.id);
    if (!user) return;

    // Notify connected users about disconnection
    for (const targetSocketId of user.connectedTo) {
      const targetUser = roomStore.getUser(targetSocketId);
      if (targetUser) {
        const roomId = [user.userId, targetUser.userId].sort().join('_');
        const targetSocket = io.sockets.sockets.get(targetSocketId);
        if (targetSocket) {
          targetSocket.leave(roomId);
          targetSocket.emit('chat:disconnected', { roomId, targetUserId: user.userId });
        }
      }
    }

    // Notify all users
    io.emit('user:left', { userId: user.userId });

    console.log(`${user.username} left the cosmos`);

    // Remove from store
    roomStore.removeUser(socket.id);

    // Broadcast updated count
    io.emit('space:count', { count: roomStore.getUserCount() });
  });
}
