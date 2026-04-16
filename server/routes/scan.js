import { Router } from 'express';
import { validateWalletAddress, validateTransactionId, validateUrl } from '../middleware/validate.js';
import { analyseTarget } from '../services/aiEngine.js';
import { submitScamToChain } from '../services/algorand.js';
import { hashEvidence } from '../services/hasher.js';
import { getDB } from '../config/db.js';

const router = Router();

// ── POST /api/scan/wallet ─────────────────────────────────────────────────────
router.post('/wallet', validateWalletAddress, async (req, res) => {
  const { address } = req.body;

  try {
    const result = await analyseTarget('wallet', address);

    // If high-risk → hash and store on chain
    let txId = null;
    if (result.shouldStoreOnChain) {
      const cid = hashEvidence({ address, score: result.score, reasons: result.reasons });
      txId = await submitScamToChain(address, cid);
    }

    // Persist to MongoDB (if available)
    const db = getDB();
    if (db) {
      await db.collection('scan_results').insertOne({
        type: 'wallet',
        target: address,
        ...result,
        txId,
        scannedAt: new Date(),
      });
    }

    res.json({
      target: address,
      type: 'wallet',
      ...result,
      txId,
      scannedAt: new Date().toISOString(),
    });
  } catch (err) {
    console.error('Wallet scan error:', err);
    res.status(500).json({ error: 'Scan failed', details: err.message });
  }
});

// ── POST /api/scan/transaction ────────────────────────────────────────────────
router.post('/transaction', validateTransactionId, async (req, res) => {
  const { txId } = req.body;

  try {
    const result = await analyseTarget('transaction', txId);

    let chainTxId = null;
    if (result.shouldStoreOnChain) {
      const cid = hashEvidence({ txId, score: result.score });
      chainTxId = await submitScamToChain(txId, cid);
    }

    const db = getDB();
    if (db) {
      await db.collection('scan_results').insertOne({
        type: 'transaction',
        target: txId,
        ...result,
        txId: chainTxId,
        scannedAt: new Date(),
      });
    }

    res.json({
      target: txId,
      type: 'transaction',
      ...result,
      txId: chainTxId,
      scannedAt: new Date().toISOString(),
    });
  } catch (err) {
    console.error('Transaction scan error:', err);
    res.status(500).json({ error: 'Scan failed', details: err.message });
  }
});

// ── POST /api/scan/url ────────────────────────────────────────────────────────
router.post('/url', validateUrl, async (req, res) => {
  const { url } = req.body;

  try {
    const result = await analyseTarget('url', url);

    const db = getDB();
    if (db) {
      await db.collection('scan_results').insertOne({
        type: 'url',
        target: url,
        ...result,
        scannedAt: new Date(),
      });
    }

    res.json({
      target: url,
      type: 'url',
      ...result,
      scannedAt: new Date().toISOString(),
    });
  } catch (err) {
    console.error('URL scan error:', err);
    res.status(500).json({ error: 'Scan failed', details: err.message });
  }
});

export default router;
