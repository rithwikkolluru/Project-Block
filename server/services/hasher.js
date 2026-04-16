import { createHash } from 'crypto';

/**
 * Generate a SHA-256 hash of evidence content.
 * In production this would be an actual IPFS CID.
 * For now we return a SHA-256 hex that simulates a CID.
 *
 * @param {string|object} data — the evidence data to hash
 * @returns {string} — "sha256:<hex>"
 */
export function hashEvidence(data) {
  const str = typeof data === 'object' ? JSON.stringify(data) : String(data);
  const hash = createHash('sha256').update(str).digest('hex');
  return `sha256:${hash}`;
}

/**
 * Simulate pinning to IPFS (placeholder).
 * In production: use web3.storage or Pinata SDK.
 *
 * @param {object} reportData
 * @returns {Promise<string>} — CID
 */
export async function pinToIPFS(reportData) {
  // TODO: integrate web3.storage or Pinata
  const cid = hashEvidence(reportData);
  console.log('📌  IPFS pin simulated:', cid);
  return cid;
}
