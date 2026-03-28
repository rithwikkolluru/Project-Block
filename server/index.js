import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import rateLimit from 'express-rate-limit';

const app = express();
const PORT = process.env.PORT || 5000;

// Security Middleware
app.use(helmet()); // Sets various HTTP headers for security
app.use(cors({
  origin: process.env.CLIENT_URL || 'http://localhost:5173',
  credentials: true
}));
app.use(express.json());

// Rate Limiting
const limiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 100 // limit each IP to 100 requests per windowMs
});
app.use('/api/', limiter);

// Health Check
app.get('/api/health', (req, res) => {
  res.json({ status: 'ok', message: 'Project Block API is running', timestamp: new Date() });
});

// Wallet Verification Endpoint (Skeleton)
app.post('/api/wallet/verify', (req, res) => {
  const { address, signature } = req.body;
  if (!address) {
    return res.status(400).json({ error: 'Address is required' });
  }
  // Logic for verifying signature using algosdk would go here
  res.json({ success: true, message: 'Wallet verified' });
});

// Start Server
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
