import { useEffect, useRef, useCallback } from 'react';
import { io } from 'socket.io-client';
import { CONFIG } from '../constants/config';
import useCosmosStore from '../store/cosmosStore';

let socket = null;

export function getSocket() {
  return socket;
}

export function useSocket() {
  const socketRef = useRef(null);
  const {
    setLocalUser,
    setRemoteUsers,
    addRemoteUser,
    removeRemoteUser,
    updateRemotePosition,
    addConnection,
    removeConnection,
    addMessage,
    setSpaceUserCount,
    setSocketConnected,
  } = useCosmosStore();

  useEffect(() => {
    // Create socket connection
    socket = io(CONFIG.SOCKET_URL, {
      transports: ['websocket', 'polling'],
      reconnection: true,
      reconnectionAttempts: 10,
      reconnectionDelay: 1000,
    });
    socketRef.current = socket;

    socket.on('connect', () => {
      console.log('✦ Connected to Virtual Cosmos');
      setSocketConnected(true);
    });

    socket.on('disconnect', () => {
      console.log('✦ Disconnected from Virtual Cosmos');
      setSocketConnected(false);
    });

    // Receive own user data after joining
    socket.on('user:joined:self', (user) => {
      setLocalUser(user);
    });

    // Receive full space state on join
    socket.on('space:state', ({ users }) => {
      setRemoteUsers(users);
    });

    // New user joined
    socket.on('user:joined', (user) => {
      addRemoteUser(user);
    });

    // User left
    socket.on('user:left', ({ userId }) => {
      removeRemoteUser(userId);
    });

    // Position sync from another user
    socket.on('position:sync', ({ userId, x, y }) => {
      updateRemotePosition(userId, x, y);
    });

    // Chat connected (proximity)
    socket.on('chat:connected', ({ roomId, targetUser }) => {
      addConnection(targetUser.userId, roomId, targetUser);
    });

    // Chat disconnected
    socket.on('chat:disconnected', ({ roomId, targetUserId }) => {
      removeConnection(targetUserId, roomId);
    });

    // Incoming chat message
    socket.on('chat:message', (message) => {
      addMessage(message.roomId, message);
    });

    // Space user count
    socket.on('space:count', ({ count }) => {
      setSpaceUserCount(count);
    });

    return () => {
      socket.disconnect();
      socket = null;
    };
  }, []);

  const joinCosmos = useCallback((username) => {
    if (socketRef.current) {
      socketRef.current.emit('user:join', { username });
    }
  }, []);

  const emitPosition = useCallback((x, y) => {
    if (socketRef.current) {
      socketRef.current.emit('position:update', { x, y });
    }
  }, []);

  const emitProximityEnter = useCallback((targetId) => {
    if (socketRef.current) {
      socketRef.current.emit('proximity:enter', { targetId });
    }
  }, []);

  const emitProximityLeave = useCallback((targetId) => {
    if (socketRef.current) {
      socketRef.current.emit('proximity:leave', { targetId });
    }
  }, []);

  const sendMessage = useCallback((roomId, text) => {
    if (socketRef.current) {
      socketRef.current.emit('chat:message', { roomId, text });
    }
  }, []);

  return {
    socket: socketRef,
    joinCosmos,
    emitPosition,
    emitProximityEnter,
    emitProximityLeave,
    sendMessage,
  };
}
