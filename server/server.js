import dotenv from 'dotenv';
dotenv.config();

import { createServer } from 'http';
import app from './src/app.js';
import { initSocket } from './src/socket/index.js';
import { connectDB } from './src/config/db.js';

var PORT = process.env.PORT || 4000;
var httpServer = createServer(app);

// starting socket here
initSocket(httpServer);

// connecting database and starting the server
console.log("Connecting to Database...");
connectDB()
  .then(() => {
    httpServer.listen(PORT, () => {
      console.log("Server is running on port " + PORT);
    });
  })
  .catch((e) => {
    console.log("database error occurred: " + e.message);
    // start anyway for now
    httpServer.listen(PORT, () => {
      console.log("Server running without database on port " + PORT);
    });
  });
