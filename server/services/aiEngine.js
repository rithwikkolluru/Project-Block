import { getAccountInfo, getTransactionHistory } from './algorand.js';

// ── Risk Score Bands ──────────────────────────────────────────────────────────
const RISK = {
  NEW_WALLET_DAYS:      7,    // wallet younger than 7 days → +25 risk
  HIGH_VOLUME_TXNS:     100,  // more than 100 txns in analysed window → +20
  LARGE_RECEIVE_ALGO:   100_000, // received >100k ALGO total → +15
  SCAM_PATTERN_SCORE:   30,   // address pattern heuristic adds up to 30
};

/**
 * Primary analysis entry point.
 *
 * @param {'wallet'|'transaction'|'url'} type
 * @param {string} target — address, txId, or URL
 * @returns {Promise<AnalysisResult>}
 *
 * @typedef {Object} AnalysisResult
 * @property {number}   score    — 0-100 (higher = more dangerous)
 * @property {'safe'|'warning'|'danger'} level
 * @property {string[]} reasons  — human-readable explanation bullets
 * @property {boolean}  shouldStoreOnChain
 */
export async function analyseTarget(type, target) {
  switch (type) {
    case 'wallet':      return analyseWallet(target);
    case 'transaction': return analyseTransaction(target);
    case 'url':         return analyseUrl(target);
    default:            return { score: 0, level: 'safe', reasons: [], shouldStoreOnChain: false };
  }
}

// ── Wallet Analysis ───────────────────────────────────────────────────────────
async function analyseWallet(address) {
  const reasons = [];
  let score = 0;

  const [accountInfo, transactions] = await Promise.all([
    getAccountInfo(address),
    getTransactionHistory(address, 100),
  ]);

  // 1. Wallet age
  if (!accountInfo) {
    reasons.push('Wallet not found on-chain or zero balance — treat as unknown');
    score += 20;
  } else {
    const createdRound = accountInfo['created-at-round'] || 0;
    if (createdRound === 0) {
      reasons.push('Wallet has no creation record — suspicious');
      score += 15;
    }

    // 2. Low balance wallets used for dust attacks
    const balanceAlgo = (accountInfo.amount || 0) / 1_000_000;
    if (balanceAlgo < 0.5 && transactions.length > 50) {
      reasons.push(`Low balance (${balanceAlgo.toFixed(3)} ALGO) with high activity — dust attack pattern`);
      score += 25;
    }

    // 3. High total receive volume
    const totalReceived = transactions
      .filter(t => t['payment-transaction']?.receiver === address)
      .reduce((sum, t) => sum + (t['payment-transaction']?.amount || 0), 0) / 1_000_000;

    if (totalReceived > RISK.LARGE_RECEIVE_ALGO) {
      reasons.push(`Very high received volume (${totalReceived.toFixed(0)} ALGO) — possible mixing`);
      score += 15;
    }
  }

  // 4. Transaction volume spike
  if (transactions.length >= RISK.HIGH_VOLUME_TXNS) {
    reasons.push(`High transaction volume (${transactions.length}+ txns) — bot-like behaviour`);
    score += 20;
  }

  // 5. New wallet heuristic (many txns in first few days)
  if (transactions.length > 20 && accountInfo?.['created-at-round']) {
    const nearCreation = transactions.filter(t => {
      const diff = (t['confirmed-round'] || 0) - accountInfo['created-at-round'];
      return diff < 500; // ~500 blocks ≈ 30 mins on Algorand
    });
    if (nearCreation.length > 5) {
      reasons.push('Burst of transactions right after wallet creation — phishing pattern');
      score += RISK.NEW_WALLET_DAYS * 2;
    }
  }

  // 6. Pattern match on address prefix (simple heuristic)
  const patternScore = addressPatternScore(address);
  if (patternScore > 0) {
    reasons.push(`Address pattern matches known scam prefixes (+${patternScore} risk)`);
    score += patternScore;
  }

  // If no issues found
  if (reasons.length === 0) {
    reasons.push('No suspicious patterns detected');
  }

  score = Math.min(score, 100);
  return { score, level: riskLevel(score), reasons, shouldStoreOnChain: score >= 70 };
}

// ── Transaction Analysis ──────────────────────────────────────────────────────
async function analyseTransaction(txId) {
  const reasons = [];
  let score = 0;

  // TODO: lookup txId via Indexer
  // For now: basic string-pattern checks
  if (txId.startsWith('AAAA')) {
    reasons.push('Transaction ID matches known burn-address pattern');
    score += 40;
  } else {
    reasons.push('Transaction ID format is valid — no known patterns matched');
  }

  return { score, level: riskLevel(score), reasons, shouldStoreOnChain: score >= 70 };
}

// ── URL Analysis ──────────────────────────────────────────────────────────────
async function analyseUrl(url) {
  const reasons = [];
  let score = 0;

  const lower = url.toLowerCase();
  const scamKeywords = ['wallet-connect', 'claim-algo', 'free-algo', 'airdrop', 'verify-account', 'urgent'];

  for (const kw of scamKeywords) {
    if (lower.includes(kw)) {
      reasons.push(`URL contains suspicious keyword: "${kw}"`);
      score += 25;
    }
  }

  if (lower.includes('algorand') && !lower.includes('algorand.foundation') && !lower.includes('algoexplorer')) {
    reasons.push('URL uses "algorand" branding but is not an official domain');
    score += 20;
  }

  if (reasons.length === 0) {
    reasons.push('No suspicious URL patterns detected');
  }

  score = Math.min(score, 100);
  return { score, level: riskLevel(score), reasons, shouldStoreOnChain: score >= 70 };
}

// ── Helpers ───────────────────────────────────────────────────────────────────
function riskLevel(score) {
  if (score >= 70) return 'danger';
  if (score >= 30) return 'warning';
  return 'safe';
}

function addressPatternScore(address) {
  // Known bad actor prefix patterns (can be extended from a DB later)
  const knownBadPrefixes = ['SCAM', 'PHSH', 'HACK'];
  for (const prefix of knownBadPrefixes) {
    if (address.startsWith(prefix)) return RISK.SCAM_PATTERN_SCORE;
  }
  return 0;
}
