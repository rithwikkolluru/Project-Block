// ── Shared API Types ──────────────────────────────────────────────────────────

export type RiskLevel = 'safe' | 'warning' | 'danger';

export interface ScanResult {
  target: string;
  type: 'wallet' | 'transaction' | 'url';
  score: number;           // 0–100
  level: RiskLevel;
  reasons: string[];       // human-readable explanation bullets
  shouldStoreOnChain: boolean;
  txId: string | null;     // Algorand txId if stored on-chain
  scannedAt: string;       // ISO timestamp
}

export interface RiskProfile {
  address: string;
  score: number;
  level: RiskLevel;
  reasons: string[];
  balance: string;         // e.g. "1.2345 ALGO"
  isReportedScam: boolean;
  cached: boolean;
  scannedAt: string;
}

export interface ScamReport {
  address: string;
  reason: string;
  evidence?: string;       // tx hash, URL, or other link
  reporterAddress?: string;
}

export interface ReportResult {
  success: boolean;
  id: string;
  txId: string;
  cid: string;
}

export interface GraphData {
  nodes: GraphNode[];
  edges: GraphEdge[];
}

export interface GraphNode {
  id: string;
  label: string;
  risk: number;
  group: 'scam' | 'suspicious' | 'safe';
}

export interface GraphEdge {
  source: string;
  target: string;
  value: number;
}

export interface NetworkStats {
  totalScans: number;
  confirmedScams: number;
  pendingReports: number;
}
