// In-memory user state store
// users = Map<socketId, { userId, username, x, y, color, connectedTo: Set<string> }>

const AVATAR_COLORS = [
  '#6C63FF', '#FF6B6B', '#4ECDC4', '#FFE66D', '#A8E6CF',
  '#FF8A5C', '#EA526F', '#23B5D3', '#F7B267', '#B8F2E6',
  '#7C5CFC', '#FF85A1', '#00C9A7', '#FFC75F', '#845EC2',
  '#D65DB1', '#FF6F91', '#0089BA', '#FFC75F', '#C34A36',
];

class RoomStore {
  constructor() {
    this.users = new Map();
    this.colorIndex = 0;
  }

  addUser(socketId, { userId, username }) {
    const color = AVATAR_COLORS[this.colorIndex % AVATAR_COLORS.length];
    this.colorIndex++;

    // Random spawn position within center area of canvas
    const x = 1200 + Math.random() * 600;
    const y = 1200 + Math.random() * 600;

    const user = {
      userId,
      socketId,
      username,
      x,
      y,
      color,
      connectedTo: new Set(),
      lastActivity: Date.now(),
    };

    this.users.set(socketId, user);
    return user;
  }

  removeUser(socketId) {
    const user = this.users.get(socketId);
    if (user) {
      // Clean up connections for other users
      for (const targetSocketId of user.connectedTo) {
        const targetUser = this.users.get(targetSocketId);
        if (targetUser) {
          targetUser.connectedTo.delete(socketId);
        }
      }
      this.users.delete(socketId);
    }
    return user;
  }

  getUser(socketId) {
    return this.users.get(socketId);
  }

  getUserByUserId(userId) {
    for (const [, user] of this.users) {
      if (user.userId === userId) return user;
    }
    return null;
  }

  getSocketIdByUserId(userId) {
    for (const [socketId, user] of this.users) {
      if (user.userId === userId) return socketId;
    }
    return null;
  }

  updatePosition(socketId, x, y) {
    const user = this.users.get(socketId);
    if (user) {
      user.x = x;
      user.y = y;
      user.lastActivity = Date.now();
    }
    return user;
  }

  addConnection(socketId1, socketId2) {
    const user1 = this.users.get(socketId1);
    const user2 = this.users.get(socketId2);
    if (user1 && user2) {
      user1.connectedTo.add(socketId2);
      user2.connectedTo.add(socketId1);
    }
  }

  removeConnection(socketId1, socketId2) {
    const user1 = this.users.get(socketId1);
    const user2 = this.users.get(socketId2);
    if (user1) user1.connectedTo.delete(socketId2);
    if (user2) user2.connectedTo.delete(socketId1);
  }

  isConnected(socketId1, socketId2) {
    const user1 = this.users.get(socketId1);
    return user1 ? user1.connectedTo.has(socketId2) : false;
  }

  getAllUsers() {
    const users = [];
    for (const [, user] of this.users) {
      users.push({
        userId: user.userId,
        username: user.username,
        x: user.x,
        y: user.y,
        color: user.color,
      });
    }
    return users;
  }

  getUserCount() {
    return this.users.size;
  }

  getConnectionsForUser(socketId) {
    const user = this.users.get(socketId);
    if (!user) return [];
    
    const connections = [];
    for (const targetSocketId of user.connectedTo) {
      const target = this.users.get(targetSocketId);
      if (target) {
        connections.push({
          userId: target.userId,
          username: target.username,
          color: target.color,
        });
      }
    }
    return connections;
  }
}

// Singleton instance
const roomStore = new RoomStore();
export default roomStore;
