import { create } from 'zustand';

export type ScanStatus = 'idle' | 'scanning' | 'complete';
export type RiskLevel = 'safe' | 'warning' | 'danger';

export interface Scan {
  address: string;
  score: number;
  level: RiskLevel;
  reasons?: string[];   // AI analysis bullets from backend
  txId?: string;        // Algorand tx hash if stored on-chain
  timestamp: string;
}

export interface CosmicState {
  currentScan: Scan | null;
  isWarping: boolean;
  scanHistory: Scan[];
  scanError: string | null;
  mousePos: { x: number; y: number };
  gravityTheme: 'dark_void' | 'light_nova';
  scamWallets: any[];
  userReports: any[];

  setMousePos: (x: number, y: number) => void;
  startScan: (address: string) => void;
  completeScan: (scan: Scan) => void;
  setScanError: (error: string | null) => void;
  setGravityTheme: (theme: 'dark_void' | 'light_nova') => void;
}

export const useCosmicStore = create<CosmicState>((set) => ({
  currentScan: null,
  isWarping: false,
  scanHistory: [],
  scanError: null,
  mousePos: { x: 0, y: 0 },
  gravityTheme: 'dark_void',
  scamWallets: [],
  userReports: [],

  setMousePos: (x, y) => set({ mousePos: { x, y } }),
  startScan: (address) =>
    set({
      isWarping: true,
      scanError: null,
      currentScan: { address, score: 0, level: 'safe', reasons: [], timestamp: new Date().toISOString() },
    }),
  completeScan: (scan) =>
    set((state) => ({
      isWarping: false,
      currentScan: scan,
      scanHistory: [scan, ...state.scanHistory],
    })),
  setScanError: (scanError) => set({ scanError }),
  setGravityTheme: (gravityTheme) => set({ gravityTheme }),
}));

