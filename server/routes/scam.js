import { Router } from 'express';
import { isValidAlgorandAddress } from '../middleware/validate.js';
import { submitScamToChain } from '../services/algorand.js';
import { pinToIPFS } from '../services/hasher.js';
import { getDB } from '../config/db.js';

const router = Router();

// ── Mock fallback data ────────────────────────────────────────────────────────
const MOCK_REGISTRY = [
  { address: 'ALGO1XF9AAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAA', reportedBy: 'AlgoSec', risk: 0.95, status: 'confirmed', createdAt: '2025-03-10T14:00:00Z' },
  { address: 'ALGO2KL7BBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBB', reportedBy: 'User_442', risk: 0.88, status: 'confirmed', createdAt: '2025-03-09T09:12:00Z' },
  { address: 'ALGO3ZZ1CCCCCCCCCCCCCCCCCCCCCCCCCCCCCCCCCCCCCCCCCCCCCCCCC', reportedBy: 'Anon', risk: 0.65, status: 'pending', createdAt: '2025-03-11T16:45:00Z' },
];

// ── POST /api/scam/report ─────────────────────────────────────────────────────
router.post('/report', async (req, res) => {
  const { address, reason, evidence, reporterAddress } = req.body;

  // Validate
  if (!address) {
    return res.status(400).json({ error: 'address is required' });
  }
  if (!reason || reason.length < 10) {
    return res.status(400).json({ error: 'reason must be at least 10 characters' });
  }
  if (!isValidAlgorandAddress(address)) {
    return res.status(400).json({ error: 'Invalid Algorand address' });
  }

  try {
    // Build evidence payload and pin as IPFS CID
    const evidencePayload = { address, reason, evidence: evidence || '', reporterAddress, timestamp: new Date().toISOString() };
    const cid = await pinToIPFS(evidencePayload);

    // Submit CID to smart contract
    const txId = await submitScamToChain(address, cid);

    // Save to MongoDB
    const db = getDB();
    const reportDoc = {
      address,
      reason,
      evidence: evidence || '',
      reporterAddress: reporterAddress || 'anonymous',
      cid,
      txId,
      status: 'pending',
      risk: 0,
      createdAt: new Date(),
    };

    if (db) {
      const result = await db.collection('scam_registry').insertOne(reportDoc);
      return res.status(201).json({ success: true, id: result.insertedId, txId, cid });
    }

    // No DB — return success with mock fallback
    res.status(201).json({ success: true, id: 'mock-' + Date.now(), txId, cid });
  } catch (err) {
    console.error('Scam report error:', err);
    res.status(500).json({ error: 'Failed to submit report', details: err.message });
  }
});

// ── GET /api/scam/registry ────────────────────────────────────────────────────
router.get('/registry', async (_req, res) => {
  try {
    const db = getDB();
    if (db) {
      const entries = await db.collection('scam_registry')
        .find({})
        .sort({ createdAt: -1 })
        .limit(100)
        .toArray();
      return res.json(entries);
    }
    // Fallback to mock
    res.json(MOCK_REGISTRY);
  } catch (err) {
    console.error('Registry fetch error:', err);
    res.json(MOCK_REGISTRY);
  }
});

export default router;
