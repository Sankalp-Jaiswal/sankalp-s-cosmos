import { create } from 'zustand';


const useCosmosStore = create((set, get) => ({
  localUser: null,  
  remoteUsers: {},
  activeConnections: {},
  chatRooms: {},
  activeChatRoomId: null,
  spaceUserCount: 0,
  hasEntered: false,
  isSocketConnected: false,

  setLocalUser: (u) => set({ localUser: u }),

  setPosition: (x, y) => set((s) => ({
    localUser: s.localUser ? { ...s.localUser, x, y } : null,
  })),

  setHasEntered: (v) => set({ hasEntered: v }),

  setSocketConnected: (v) => set({ isSocketConnected: v }),

  setSpaceUserCount: (c) => set({ spaceUserCount: c }),

  // add helper for adding users 
  addRemoteUser: (u) => set((s) => ({
    remoteUsers: {
      ...s.remoteUsers,
      [u.userId]: {
        ...u,
        targetX: u.x,
        targetY: u.y,
      },
    },
  })),

  removeRemoteUser: (id) => set((s) => {
    const { [id]: removed, ...rem } = s.remoteUsers;
    const conns = { ...s.activeConnections };
    delete conns[id];
    
    const rooms = { ...s.chatRooms };
    for (const [rid, r] of Object.entries(rooms)) {
      if (r.targetUser?.userId === id) {
        delete rooms[rid];
      }
    }

    console.log("removing user with id:", id);

    return {
      remoteUsers: rem,
      activeConnections: conns,
      chatRooms: rooms,
      activeChatRoomId: s.activeChatRoomId && rooms[s.activeChatRoomId] 
        ? s.activeChatRoomId 
        : Object.keys(rooms)[0] || null,
    };
  }),

  updateRemotePosition: (id, x, y) => set((s) => {
    const u = s.remoteUsers[id];
    if (!u) return s;
    return {
      remoteUsers: {
        ...s.remoteUsers,
        [id]: {
          ...u,
          targetX: x,
          targetY: y,
        },
      },
    };
  }),

  setRemoteInterpolatedPosition: (id, x, y) => set((s) => {
    const u = s.remoteUsers[id];
    if (!u) return s;
    return {
      remoteUsers: {
        ...s.remoteUsers,
        [id]: { ...u, x, y },
      },
    };
  }),

  // setting all users at once
  setRemoteUsers: (arr) => {
    const res = {};
    arr.forEach((u) => {
      res[u.userId] = {
        ...u,
        targetX: u.x,
        targetY: u.y,
      };
    });
    set({ remoteUsers: res });
  },

  // connection logic
  addConnection: (id, rid, target) => set((s) => ({
    activeConnections: {
      ...s.activeConnections,
      [id]: { roomId: rid, ...target },
    },
    chatRooms: {
      ...s.chatRooms,
      [rid]: s.chatRooms[rid] || {
        messages: [],
        targetUser: target,
      },
    },
    activeChatRoomId: s.activeChatRoomId || rid,
  })),

  removeConnection: (tid, rid) => set((s) => {
    const cnew = { ...s.activeConnections };
    delete cnew[tid];
    
    const rnew = { ...s.chatRooms };
    if (rnew[rid]) {
      rnew[rid] = {
        ...rnew[rid],
        disconnected: true,
      };
    }

    const ids = Object.values(cnew).map(c => c.roomId);
    const act = ids.includes(s.activeChatRoomId)
      ? s.activeChatRoomId
      : ids[0] || null;

    console.log("disconnecting from room:", rid);

    return {
      activeConnections: cnew,
      chatRooms: rnew,
      activeChatRoomId: act,
    };
  }),

  // chat related
  addMessage: (rid, msg) => set((s) => {
    const r = s.chatRooms[rid];
    if (!r) return s;
    return {
      chatRooms: {
        ...s.chatRooms,
        [rid]: {
          ...r,
          messages: [...r.messages, msg],
        },
      },
    };
  }),

  setActiveChatRoom: (id) => set({ activeChatRoomId: id }),

  // count nearby people
  getNearbyCount: () => {
    return Object.keys(get().activeConnections).length;
  },
}));

export default useCosmosStore;
