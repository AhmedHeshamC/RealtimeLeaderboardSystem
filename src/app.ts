import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import { json } from 'express';
import authRoutes from './routes/authRoutes';
import scoreRoutes from './routes/scoreRoutes';
import leaderboardRoutes from './routes/leaderboardRoutes';
import { Server as WebSocketServer, WebSocket } from 'ws';
import pool from './db';

// Load environment variables
dotenv.config();

const app = express();
const PORT = process.env.PORT || 3000;

app.use(cors());
app.use(json());

// API routes
app.use('/api/v1/auth', authRoutes);
app.use('/api/v1/scores', scoreRoutes);
app.use('/api/v1/leaderboard', leaderboardRoutes);

app.get('/', (req, res) => {
  res.send('Leaderboard API is running');
});

const server = app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});

// WebSocket server for real-time leaderboard updates
const wss = new WebSocketServer({ server });
const clients = new Set<WebSocket>();

wss.on('connection', (ws: WebSocket) => {
  clients.add(ws);
  ws.on('close', () => clients.delete(ws));
});

// Listen for PostgreSQL NOTIFY events
(async () => {
  const { Client } = require('pg');
  const client = new Client({
    user: process.env.DB_USER || 'postgres',
    host: process.env.DB_HOST || 'localhost',
    database: process.env.DB_NAME || 'lead',
    password: process.env.DB_PASS || 'root@22@',
    port: Number(process.env.DB_PORT) || 5432,
  });
  await client.connect();
  await client.query('LISTEN leaderboard_update');
  client.on('notification', async (msg: { channel: string; payload: string }) => {
    console.log('Received NOTIFY from Postgres:', msg);
    if (msg.channel === 'leaderboard_update') {
      try {
        const leaderboardService = require('./services/leaderboardService').default;
        const leaderboard = await leaderboardService.getGlobalLeaderboard(100, 0);
        const payload = JSON.stringify({ type: 'leaderboard', leaderboard });
        for (const ws of clients) {
          if (ws.readyState === WebSocket.OPEN) {
            ws.send(payload);
          }
        }
      } catch (err) {
        console.error('Failed to fetch or broadcast leaderboard:', err);
      }
    }
  });
})();
