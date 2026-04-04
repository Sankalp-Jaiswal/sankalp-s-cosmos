# Sankalp's Cosmos

A **2D multiplayer virtual environment** with proximity-based chat — built with React, PixiJS, Socket.IO, and MongoDB.

Move around the cosmos as a stylized astronaut, approach other users, and chat when you're close enough. 

![Sankalp's Cosmos Screenshot](./screenshot-placeholder.png)

---

## ✨ Features

- **Stylized Astronaut Avatars** — Unique astronaut helmet designs for every user
- **Real-time multiplayer canvas** — See and interact with other users in real-time
- **Proximity-based chat** — Chat unlocks automatically when you're near another user
- **Stabilized Starfield** — Smooth, constant-flow background logic
- **Smooth movement** — WASD/Arrow key movement with diagonal normalization
- **Lerp interpolation** — Remote players move smoothly via position interpolation
- **Glass morphism chat** — Slide-in chat panel with backdrop blur
- **Connection HUD** — See who's nearby with a floating badge

---

## 🛠 Tech Stack

| Layer | Technology |
|-------|-----------|
| **Frontend** | React 18, Vite, PixiJS v7, Tailwind CSS v3, Zustand, Framer Motion |
| **Backend** | Node.js, Express, Socket.IO |
| **Database** | MongoDB + Mongoose |
| **Real-time** | Socket.IO (WebSocket + polling fallback) |

---

## 📋 Prerequisites

- **Node.js** 18+ 
- **MongoDB** (local or Atlas cloud)
- **npm** or **yarn**

---

## 🚀 Quick Start

### 1. Clone & Install
```bash
git clone <your-repo-url>
cd virtual-cosmos
```

# Install server dependencies
cd server
npm install

# Install client dependencies
cd ../client
npm install
```

### 2. Configure Environment
Copy the example environment files and update them with your credentials:

**Server:**
```bash
cp server/.env.example server/.env
```

**Client:**
```bash
cp client/.env.example client/.env
```

### 3. Start the application

**Terminal 1 — Server:**
```bash
cd server
npm run dev
```

**Terminal 2 — Client:**
```bash
cd client
npm run dev
```

### 4. Open multiple browser tabs
Navigate to `http://localhost:5173` in multiple tabs/browsers to test multiplayer.

---

## 🔌 Socket Event Reference

### Client → Server

| Event | Payload | Description |
|-------|---------|-------------|
| `user:join` | `{ username }` | Join the cosmos with a username |
| `position:update` | `{ x, y }` | Send current position (throttled 50ms) |
| `proximity:enter` | `{ targetId }` | Entered another user's proximity |
| `proximity:leave` | `{ targetId }` | Left another user's proximity |
| `chat:message` | `{ roomId, text }` | Send a chat message |

### Server → Client

| Event | Payload | Description |
|-------|---------|-------------|
| `user:joined:self` | `{ userId, username, x, y, color }` | Your own user data |
| `user:joined` | `{ userId, username, x, y, color }` | New user appeared |
| `user:left` | `{ userId }` | User disconnected |
| `space:state` | `{ users: [...] }` | Full state on join |
| `space:count` | `{ count }` | Updated user count |
| `position:sync` | `{ userId, x, y }` | Position update from another user |
| `chat:connected` | `{ roomId, targetUser }` | Chat unlocked with user |
| `chat:disconnected` | `{ roomId, targetUserId }` | Chat locked |
| `chat:message` | `{ roomId, from, text, timestamp }` | Incoming message |

---

## 📁 Project Structure

```
virtual-cosmos/
├── client/                          # React + Vite frontend
│   ├── src/
│   │   ├── components/
│   │   │   ├── Canvas/              # PixiJS canvas + hooks
│   │   │   ├── Chat/                # Chat panel + messages
│   │   │   ├── UI/                  # Navbar, modal, badges
│   │   │   └── Layout.jsx
│   │   ├── hooks/                   # useSocket, useProximity
│   │   ├── store/                   # Zustand global state
│   │   ├── utils/                   # Distance, interpolation
│   │   ├── constants/               # Config values
│   │   ├── App.jsx
│   │   └── main.jsx
│   └── ...config files
│
├── server/                          # Express + Socket.IO backend
│   ├── src/
│   │   ├── config/                  # MongoDB connection
│   │   ├── models/                  # Mongoose schemas
│   │   ├── socket/                  # Socket.IO handlers
│   │   │   ├── handlers/            # movement, chat, connection
│   │   │   └── store/               # In-memory state
│   │   └── routes/                  # REST endpoints
│   └── server.js
│
└── README.md
```
---


