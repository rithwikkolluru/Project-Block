import type {
  ScanResult,
  RiskProfile,
  ScamReport,
  ReportResult,
  GraphData,
  NetworkStats,
} from './types';

const BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';

// ── Internal fetch helper ─────────────────────────────────────────────────────
async function apiFetch<T>(path: string, options?: RequestInit): Promise<T> {
  const res = await fetch(`${BASE_URL}${path}`, {
    headers: { 'Content-Type': 'application/json' },
    ...options,
  });

  if (!res.ok) {
    const body = await res.json().catch(() => ({ error: res.statusText }));
    throw new Error(body.error || `API error ${res.status}`);
  }

  return res.json() as Promise<T>;
}

// ── Scan Endpoints ────────────────────────────────────────────────────────────

/**
 * Scan an Algorand wallet address for risk.
 * Triggers AI analysis + optional on-chain storage if high-risk.
 */
export async function scanWallet(address: string): Promise<ScanResult> {
  return apiFetch<ScanResult>('/scan/wallet', {
    method: 'POST',
    body: JSON.stringify({ address }),
  });
}

/**
 * Scan an Algorand transaction ID.
 */
export async function scanTransaction(txId: string): Promise<ScanResult> {
  return apiFetch<ScanResult>('/scan/transaction', {
    method: 'POST',
    body: JSON.stringify({ txId }),
  });
}

/**
 * Scan a URL for phishing patterns.
 */
export async function scanUrl(url: string): Promise<ScanResult> {
  return apiFetch<ScanResult>('/scan/url', {
    method: 'POST',
    body: JSON.stringify({ url }),
  });
}

// ── Wallet Endpoints ──────────────────────────────────────────────────────────

/**
 * Get a full risk profile for a wallet (uses cache if < 1h old).
 */
export async function getWalletRisk(address: string): Promise<RiskProfile> {
  return apiFetch<RiskProfile>(`/wallet/${address}/risk`);
}

// ── Scam Registry Endpoints ───────────────────────────────────────────────────

/**
 * Submit a scam report — hashes evidence, stores on Algorand + MongoDB.
 */
export async function submitScamReport(report: ScamReport): Promise<ReportResult> {
  return apiFetch<ReportResult>('/scam/report', {
    method: 'POST',
    body: JSON.stringify(report),
  });
}

/**
 * Fetch the full scam registry list.
 */
export async function getScamRegistry(): Promise<any[]> {
  return apiFetch<any[]>('/scam/registry');
}

// ── Network Endpoints ─────────────────────────────────────────────────────────

/**
 * Get graph data (nodes + edges) for the network visualiser.
 */
export async function getNetworkGraph(): Promise<GraphData> {
  return apiFetch<GraphData>('/network/graph');
}

/**
 * Get platform-wide statistics.
 */
export async function getNetworkStats(): Promise<NetworkStats> {
  return apiFetch<NetworkStats>('/network/stats');
}
