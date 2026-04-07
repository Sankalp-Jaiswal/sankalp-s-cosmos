import { useEffect, useRef, useCallback } from 'react';
import { io } from 'socket.io-client';
import { CONFIG } from '../constants/config';
import useCosmosStore from '../store/cosmosStore';

var s = null;

export function getSocket() {
  return s;
}

export function useSocket() {
  const ref = useRef(null);
  const store = useCosmosStore();

  useEffect(() => {
    // connecting to the server
    s = io(CONFIG.SOCKET_URL, {
      transports: ['websocket', 'polling']
    });
    ref.current = s;

    s.on('connect', () => {
      console.log('Connected!');
      store.setSocketConnected(true);
    });

    s.on('disconnect', () => {
      console.log('Disconnected!');
      store.setSocketConnected(false);
    });

    // when i join
    s.on('user:joined:self', (data) => {
      store.setLocalUser(data);
    });

    // get all users
    s.on('space:state', (data) => {
      store.setRemoteUsers(data.users);
    });

    // someone else joined
    s.on('user:joined', (user) => {
      console.log("new user joined:", user.username);
      store.addRemoteUser(user);
    });

    // someone left
    s.on('user:left', (data) => {
      console.log("user left:", data.userId);
      store.removeRemoteUser(data.userId);
    });

    // moving
    s.on('position:sync', (data) => {
      store.updateRemotePosition(data.userId, data.x, data.y);
    });

    // chatting start
    s.on('chat:connected', (data) => {
      store.addConnection(data.targetUser.userId, data.roomId, data.targetUser);
    });

    // chatting end
    s.on('chat:disconnected', (data) => {
      store.removeConnection(data.targetUserId, data.roomId);
    });

    // got a message
    s.on('chat:message', (msg) => {
      store.addMessage(msg.roomId, msg);
    });

    // update count
    s.on('space:count', (data) => {
      store.setSpaceUserCount(data.count);
    });

    return () => {
      if (s) s.disconnect();
      s = null;
    };
  }, []);

  const join = useCallback((name) => {
    if (ref.current) {
      ref.current.emit('user:join', { username: name });
    }
  }, []);

  const move = useCallback((x, y) => {
    if (ref.current) {
      ref.current.emit('position:update', { x, y });
    }
  }, []);

  const enter = useCallback((id) => {
    if (ref.current) {
      ref.current.emit('proximity:enter', { targetId: id });
    }
  }, []);

  const leave = useCallback((id) => {
    if (ref.current) {
      ref.current.emit('proximity:leave', { targetId: id });
    }
  }, []);

  const send = useCallback((rid, val) => {
    if (ref.current) {
      ref.current.emit('chat:message', { roomId: rid, text: val });
    }
  }, []);

  return {
    socket: ref,
    joinCosmos: join,
    emitPosition: move,
    emitProximityEnter: enter,
    emitProximityLeave: leave,
    sendMessage: send,
  };
}
