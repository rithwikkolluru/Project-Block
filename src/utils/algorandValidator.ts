/**
 * algorandValidator.ts
 * Validates and identifies Algorand blockchain inputs:
 *   - Wallet Address: 58-char Base32 uppercase + algosdk checksum
 *   - Transaction ID: 52-char Base32 uppercase
 *   - Smart Contract App ID: Positive integer (numeric, uint64)
 *   - Phishing URL: http/https URL
 */

import algosdk from 'algosdk';

export type AlgorandInputType = 'wallet' | 'transaction' | 'contract' | 'url' | 'unknown';

export interface ValidationResult {
  /** What kind of input was detected */
  type: AlgorandInputType;
  /** Whether the input passes format validation */
  isValid: boolean;
  /** Human-readable explanation shown to the user */
  message: string;
  /** Display badge label (plain text, no emojis) */
  badge: string;
}

// Algorand wallet address: exactly 58 uppercase Base32 chars (A-Z, 2-7)
const WALLET_REGEX = /^[A-Z2-7]{58}$/;

// Algorand Transaction ID: exactly 52 uppercase Base32 chars
const TXID_REGEX = /^[A-Z2-7]{52}$/;

// Smart Contract App ID: positive integer up to 19 digits (covers uint64)
const APP_ID_REGEX = /^\d{1,19}$/;

// URL: must start with http:// or https://
const URL_REGEX = /^https?:\/\/.+/i;

/**
 * Detects the Algorand input type and validates its format.
 * Wallet addresses are additionally checksum-verified via algosdk.
 */
export function validateAlgorandInput(input: string): ValidationResult {
  const trimmed = input.trim();

  if (!trimmed) {
    return {
      type: 'unknown',
      isValid: false,
      message: 'Enter an Algorand address, transaction ID, App ID, or URL.',
      badge: '',
    };
  }

  // --- URL ---
  if (URL_REGEX.test(trimmed)) {
    return {
      type: 'url',
      isValid: true,
      message: 'URL detected — phishing link analysis ready.',
      badge: 'URL',
    };
  }

  // --- Smart Contract App ID (pure numeric) ---
  if (APP_ID_REGEX.test(trimmed)) {
    const num = BigInt(trimmed);
    const isValid = num > 0n && num <= BigInt('18446744073709551615'); // max uint64
    return {
      type: 'contract',
      isValid,
      message: isValid
        ? `App ID #${trimmed} — valid Algorand smart contract ID.`
        : 'App ID is out of valid uint64 range.',
      badge: isValid ? 'App ID' : 'Invalid App ID',
    };
  }

  // --- Wallet Address: 58-char Base32 + checksum via algosdk ---
  if (WALLET_REGEX.test(trimmed)) {
    let checksumValid = false;
    try {
      checksumValid = algosdk.isValidAddress(trimmed);
    } catch {
      checksumValid = false;
    }
    return {
      type: 'wallet',
      isValid: checksumValid,
      message: checksumValid
        ? 'Valid Algorand wallet address — checksum verified.'
        : 'Invalid checksum — this address format is incorrect.',
      badge: checksumValid ? 'Wallet' : 'Bad Checksum',
    };
  }

  // --- Transaction ID: 52-char Base32 ---
  if (TXID_REGEX.test(trimmed)) {
    return {
      type: 'transaction',
      isValid: true,
      message: 'Transaction ID detected — 52-character Base32 format verified.',
      badge: 'TxID',
    };
  }

  // --- Unknown / Partial input ---
  const len = trimmed.length;
  let hint = '';
  if (len > 0 && len < 58 && /^[A-Z2-7]+$/.test(trimmed)) {
    hint = `Keep typing — wallet addresses are 58 chars, TxIDs are 52 chars (${len} entered so far).`;
  } else if (len > 0 && /^\d+$/.test(trimmed)) {
    hint = 'Looks like a partial App ID. Enter the full numeric contract ID.';
  } else {
    hint = 'Unrecognized format. Provide a valid wallet address (58 chars), TxID (52 chars), App ID (number), or URL.';
  }

  return { type: 'unknown', isValid: false, message: hint, badge: 'Unknown' };
}
