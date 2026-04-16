import { Router } from 'express';
import { isValidAlgorandAddress } from '../middleware/validate.js';
import { getAccountInfo } from '../services/algorand.js';
import { analyseTarget } from '../services/aiEngine.js';
import { getDB } from '../config/db.js';

const router = Router();

// ── GET /api/wallet/:address/risk ─────────────────────────────────────────────
router.get('/:address/risk', async (req, res) => {
  const { address } = req.params;

  if (!isValidAlgorandAddress(address)) {
    return res.status(400).json({ error: 'Invalid Algorand address' });
  }

  try {
    const db = getDB();

    // 1. Check if we have a cached result in MongoDB (< 1 hour old)
    if (db) {
      const cached = await db.collection('scan_results').findOne({
        target: address,
        type: 'wallet',
        scannedAt: { $gte: new Date(Date.now() - 3_600_000) },
      }, { sort: { scannedAt: -1 } });

      if (cached) {
        return res.json({
          address,
          score: cached.score,
          level: cached.level,
          reasons: cached.reasons,
          cached: true,
          scannedAt: cached.scannedAt,
        });
      }
    }

    // 2. Check if wallet is in scam registry
    let isReportedScam = false;
    if (db) {
      const scamEntry = await db.collection('scam_registry').findOne({ address, status: 'confirmed' });
      if (scamEntry) isReportedScam = true;
    }

    // 3. Live analysis
    const [result, accountInfo] = await Promise.all([
      analyseTarget('wallet', address),
      getAccountInfo(address),
    ]);

    // Boost score if already in registry
    if (isReportedScam) {
      result.score = Math.min(result.score + 30, 100);
      result.reasons.unshift('⚠️ Address confirmed in CryptoShield Scam Registry');
      result.level = result.score >= 70 ? 'danger' : result.level;
    }

    const profile = {
      address,
      score: result.score,
      level: result.level,
      reasons: result.reasons,
      balance: accountInfo ? (accountInfo.amount / 1_000_000).toFixed(4) + ' ALGO' : 'unknown',
      isReportedScam,
      cached: false,
      scannedAt: new Date().toISOString(),
    };

    // Cache result
    if (db) {
      await db.collection('scan_results').insertOne({
        type: 'wallet',
        target: address,
        ...result,
        scannedAt: new Date(),
      });
    }

    res.json(profile);
  } catch (err) {
    console.error('Wallet risk error:', err);
    res.status(500).json({ error: 'Risk analysis failed', details: err.message });
  }
});

export default router;
