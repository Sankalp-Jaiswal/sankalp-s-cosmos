import { create } from 'zustand';

const useCosmosStore = create((set, get) => ({
  // Local user state
  localUser: null,
  
  // Remote users: Map-like object { [userId]: { username, x, y, color, targetX, targetY } }
  remoteUsers: {},
  
  // Active connections: { [userId]: { roomId, username, color } }
  activeConnections: {},
  
  // Chat rooms: { [roomId]: { messages: [], targetUser: { userId, username, color } } }
  chatRooms: {},
  
  // Currently active chat room
  activeChatRoomId: null,
  
  // Space user count
  spaceUserCount: 0,
  
  // Is entered (past the modal)
  hasEntered: false,

  // Socket connected state
  isSocketConnected: false,

  // ─── Actions ──────────────────────────────────

  setLocalUser: (user) => set({ localUser: user }),

  setPosition: (x, y) => set((state) => ({
    localUser: state.localUser ? { ...state.localUser, x, y } : null,
  })),

  setHasEntered: (val) => set({ hasEntered: val }),

  setSocketConnected: (val) => set({ isSocketConnected: val }),

  setSpaceUserCount: (count) => set({ spaceUserCount: count }),

  // Remote users
  addRemoteUser: (user) => set((state) => ({
    remoteUsers: {
      ...state.remoteUsers,
      [user.userId]: {
        ...user,
        targetX: user.x,
        targetY: user.y,
      },
    },
  })),

  removeRemoteUser: (userId) => set((state) => {
    const { [userId]: removed, ...rest } = state.remoteUsers;
    // Also remove any active connection
    const newConnections = { ...state.activeConnections };
    delete newConnections[userId];
    // And remove chat rooms associated
    const newChatRooms = { ...state.chatRooms };
    for (const [roomId, room] of Object.entries(newChatRooms)) {
      if (room.targetUser?.userId === userId) {
        delete newChatRooms[roomId];
      }
    }
    return {
      remoteUsers: rest,
      activeConnections: newConnections,
      chatRooms: newChatRooms,
      activeChatRoomId: state.activeChatRoomId && newChatRooms[state.activeChatRoomId] 
        ? state.activeChatRoomId 
        : Object.keys(newChatRooms)[0] || null,
    };
  }),

  updateRemotePosition: (userId, x, y) => set((state) => {
    const user = state.remoteUsers[userId];
    if (!user) return state;
    return {
      remoteUsers: {
        ...state.remoteUsers,
        [userId]: {
          ...user,
          targetX: x,
          targetY: y,
        },
      },
    };
  }),

  setRemoteInterpolatedPosition: (userId, x, y) => set((state) => {
    const user = state.remoteUsers[userId];
    if (!user) return state;
    return {
      remoteUsers: {
        ...state.remoteUsers,
        [userId]: { ...user, x, y },
      },
    };
  }),

  setRemoteUsers: (users) => {
    const remoteUsers = {};
    users.forEach((user) => {
      remoteUsers[user.userId] = {
        ...user,
        targetX: user.x,
        targetY: user.y,
      };
    });
    set({ remoteUsers });
  },

  // Connections
  addConnection: (userId, roomId, targetUser) => set((state) => ({
    activeConnections: {
      ...state.activeConnections,
      [userId]: { roomId, ...targetUser },
    },
    chatRooms: {
      ...state.chatRooms,
      [roomId]: state.chatRooms[roomId] || {
        messages: [],
        targetUser,
      },
    },
    activeChatRoomId: state.activeChatRoomId || roomId,
  })),

  removeConnection: (targetUserId, roomId) => set((state) => {
    const newConnections = { ...state.activeConnections };
    delete newConnections[targetUserId];
    
    // Keep chat room messages but mark as disconnected
    const newChatRooms = { ...state.chatRooms };
    if (newChatRooms[roomId]) {
      newChatRooms[roomId] = {
        ...newChatRooms[roomId],
        disconnected: true,
      };
    }

    // Switch active chat if needed
    const activeRoomIds = Object.values(newConnections).map(c => c.roomId);
    const newActiveChatRoomId = activeRoomIds.includes(state.activeChatRoomId)
      ? state.activeChatRoomId
      : activeRoomIds[0] || null;

    return {
      activeConnections: newConnections,
      chatRooms: newChatRooms,
      activeChatRoomId: newActiveChatRoomId,
    };
  }),

  // Chat
  addMessage: (roomId, message) => set((state) => {
    const room = state.chatRooms[roomId];
    if (!room) return state;
    return {
      chatRooms: {
        ...state.chatRooms,
        [roomId]: {
          ...room,
          messages: [...room.messages, message],
        },
      },
    };
  }),

  setActiveChatRoom: (roomId) => set({ activeChatRoomId: roomId }),

  // Get nearby user count
  getNearbyCount: () => {
    return Object.keys(get().activeConnections).length;
  },
}));

export default useCosmosStore;
