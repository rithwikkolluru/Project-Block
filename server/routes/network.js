import { Router } from 'express';
import { getDB } from '../config/db.js';

const router = Router();

// ── Mock graph data (used when MongoDB is unavailable) ────────────────────────
const MOCK_GRAPH = {
  nodes: [
    { id: 'ALGO1XF9...', label: 'Scam Hub', risk: 0.95, group: 'scam' },
    { id: 'ALGO2KL7...', label: 'Wallet A', risk: 0.40, group: 'suspicious' },
    { id: 'ALGO3ZZ1...', label: 'Wallet B', risk: 0.20, group: 'safe' },
    { id: 'ALGO4MP2...', label: 'Victim 1', risk: 0.10, group: 'safe' },
    { id: 'ALGO5PP8...', label: 'Victim 2', risk: 0.15, group: 'safe' },
  ],
  edges: [
    { source: 'ALGO1XF9...', target: 'ALGO2KL7...', value: 5000 },
    { source: 'ALGO2KL7...', target: 'ALGO4MP2...', value: 1000 },
    { source: 'ALGO1XF9...', target: 'ALGO5PP8...', value: 2500 },
    { source: 'ALGO3ZZ1...', target: 'ALGO1XF9...', value: 750 },
  ],
};

// ── GET /api/network/graph ────────────────────────────────────────────────────
router.get('/graph', async (_req, res) => {
  try {
    const db = getDB();
    if (!db) return res.json(MOCK_GRAPH);

    // Build graph from scam_registry + scan_results
    const scams = await db.collection('scam_registry')
      .find({ status: { $in: ['confirmed', 'pending'] } })
      .limit(200)
      .toArray();

    const nodes = scams.map(s => ({
      id: s.address,
      label: `${s.address.slice(0, 8)}...`,
      risk: s.risk || 0.5,
      group: s.status === 'confirmed' ? 'scam' : 'suspicious',
    }));

    // Simple edges: each scam connects to the reporter
    const edges = scams
      .filter(s => s.reporterAddress && s.reporterAddress !== 'anonymous')
      .map(s => ({
        source: s.reporterAddress,
        target: s.address,
        value: Math.round(s.risk * 100),
      }));

    res.json({ nodes, edges });
  } catch (err) {
    console.error('Network graph error:', err);
    res.json(MOCK_GRAPH);
  }
});

// ── GET /api/network/stats ────────────────────────────────────────────────────
router.get('/stats', async (_req, res) => {
  try {
    const db = getDB();
    if (!db) {
      return res.json({ totalScans: 0, confirmedScams: 0, pendingReports: 0, totalWalletsAnalysed: 0 });
    }

    const [totalScans, confirmedScams, pendingReports] = await Promise.all([
      db.collection('scan_results').countDocuments(),
      db.collection('scam_registry').countDocuments({ status: 'confirmed' }),
      db.collection('scam_registry').countDocuments({ status: 'pending' }),
    ]);

    res.json({ totalScans, confirmedScams, pendingReports });
  } catch (err) {
    console.error('Stats error:', err);
    res.json({ totalScans: 0, confirmedScams: 0, pendingReports: 0 });
  }
});

export default router;
