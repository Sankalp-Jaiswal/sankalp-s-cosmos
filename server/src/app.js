import express from 'express';
import cors from 'cors';
import healthRouter from './routes/health.js';

const app = express();

app.use(cors({
  origin: process.env.CLIENT_URL || 'http://localhost:5173',
  methods: ['GET', 'POST'],
  credentials: true,
}));

app.use(express.json());

// Routes
app.use('/health', healthRouter);

// Root
app.get('/', (req, res) => {
  res.json({
    name: 'Sankalp\'s Cosmos',
    version: '1.0.0',
    status: 'running',
  });
});

export default app;
