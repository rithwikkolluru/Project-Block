import algosdk from 'algosdk';

// ── Constants ─────────────────────────────────────────────────────────────────
const ALGORAND_ADDRESS_LENGTH = 58;
const ALGORAND_TXID_LENGTH    = 52;
const URL_REGEX               = /^https?:\/\/.+/i;

// ── Validators ────────────────────────────────────────────────────────────────

/**
 * Validate an Algorand wallet address.
 * Must be 58 chars and pass algosdk's own checksum validation.
 */
export function isValidAlgorandAddress(address) {
  if (!address || typeof address !== 'string') return false;
  if (address.length !== ALGORAND_ADDRESS_LENGTH)  return false;
  try {
    return algosdk.isValidAddress(address);
  } catch {
    return false;
  }
}

/**
 * Validate an Algorand transaction ID.
 * Must be 52 Base32 characters.
 */
export function isValidAlgorandTxId(txId) {
  if (!txId || typeof txId !== 'string') return false;
  if (txId.length !== ALGORAND_TXID_LENGTH) return false;
  return /^[A-Z2-7]{52}$/.test(txId);
}

/**
 * Validate a URL (must start with http:// or https://)
 */
export function isValidUrl(url) {
  if (!url || typeof url !== 'string') return false;
  return URL_REGEX.test(url);
}

// ── Express Middleware ────────────────────────────────────────────────────────

/** Middleware: validate wallet address in req.body.address */
export function validateWalletAddress(req, res, next) {
  const { address } = req.body;
  if (!address) {
    return res.status(400).json({ error: 'address is required' });
  }
  if (!isValidAlgorandAddress(address)) {
    return res.status(400).json({
      error: 'Invalid Algorand address — must be 58 Base32 characters',
    });
  }
  next();
}

/** Middleware: validate transaction ID in req.body.txId */
export function validateTransactionId(req, res, next) {
  const { txId } = req.body;
  if (!txId) {
    return res.status(400).json({ error: 'txId is required' });
  }
  if (!isValidAlgorandTxId(txId)) {
    return res.status(400).json({
      error: 'Invalid Algorand transaction ID — must be 52 Base32 characters',
    });
  }
  next();
}

/** Middleware: validate URL in req.body.url */
export function validateUrl(req, res, next) {
  const { url } = req.body;
  if (!url) {
    return res.status(400).json({ error: 'url is required' });
  }
  if (!isValidUrl(url)) {
    return res.status(400).json({ error: 'Invalid URL — must start with http:// or https://' });
  }
  next();
}
