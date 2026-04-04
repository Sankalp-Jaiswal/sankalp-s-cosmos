import dotenv from 'dotenv';
dotenv.config();

import { createServer } from 'http';
import app from './src/app.js';
import { initSocket } from './src/socket/index.js';
import { connectDB } from './src/config/db.js';

const PORT = process.env.PORT || 4000;
const httpServer = createServer(app);

// Initialize Socket.IO
initSocket(httpServer);

// Connect to MongoDB and start server
connectDB()
  .then(() => {
    httpServer.listen(PORT, () => {
      console.log(`\n  Sankalp's Cosmos Server`);
      console.log(`  ➜ HTTP:   http://localhost:${PORT}`);
      console.log(`  ➜ Socket: ws://localhost:${PORT}`);
      console.log(`  ➜ Env:    ${process.env.NODE_ENV}\n`);
    });
  })
  .catch((err) => {
    console.error('Failed to start server:', err.message);
    // Start without DB if connection fails (for development)
    httpServer.listen(PORT, () => {
      console.log(`\n  Sankalp's Cosmos Server (No DB)`);
      console.log(`  ➜ HTTP:   http://localhost:${PORT}`);
      console.log(`  ➜ Socket: ws://localhost:${PORT}`);
      console.log(`  ⚠ MongoDB not connected — running in-memory only\n`);
    });
  });
