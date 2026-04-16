import 'dotenv/config';
import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import rateLimit from 'express-rate-limit';
import { connectMongoDB } from './config/db.js';

// ── Route Imports ─────────────────────────────────────────────────────────────
import scanRoutes    from './routes/scan.js';
import scamRoutes    from './routes/scam.js';
import walletRoutes  from './routes/wallet.js';
import networkRoutes from './routes/network.js';

const app  = express();
const PORT = process.env.PORT || 5000;

// ── Security Middleware ───────────────────────────────────────────────────────
app.use(helmet());
app.use(cors({
  origin: process.env.CLIENT_URL || 'http://localhost:5173',
  credentials: true,
}));
app.use(express.json({ limit: '10kb' }));

// ── Rate Limiting ─────────────────────────────────────────────────────────────
const limiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 100,
  standardHeaders: true,
  legacyHeaders: false,
  message: { error: 'Too many requests — please try again later.' },
});
app.use('/api/', limiter);

// ── Health Check ──────────────────────────────────────────────────────────────
app.get('/api/health', (_req, res) => {
  res.json({
    status: 'ok',
    message: 'CryptoShield API is running',
    version: '2.0.0',
    timestamp: new Date().toISOString(),
  });
});

// ── API Routes ────────────────────────────────────────────────────────────────
app.use('/api/scan',    scanRoutes);
app.use('/api/scam',    scamRoutes);
app.use('/api/wallet',  walletRoutes);
app.use('/api/network', networkRoutes);

// ── 404 Handler ───────────────────────────────────────────────────────────────
app.use((_req, res) => {
  res.status(404).json({ error: 'Endpoint not found' });
});

// ── Global Error Handler ──────────────────────────────────────────────────────
app.use((err, _req, res, _next) => {
  console.error('Unhandled error:', err);
  res.status(500).json({ error: 'Internal server error' });
});

// ── Startup ───────────────────────────────────────────────────────────────────
async function start() {
  await connectMongoDB(); // gracefully skips if Mongo is not available
  app.listen(PORT, () => {
    console.log(`🚀  CryptoShield API running on http://localhost:${PORT}`);
    console.log(`    Health: http://localhost:${PORT}/api/health`);
  });
}

start();
