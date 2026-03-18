import { create } from 'zustand';

export type ScanStatus = 'idle' | 'scanning' | 'complete';
export type RiskLevel = 'safe' | 'warning' | 'danger';

export interface Scan {
  address: string;
  score: number;
  level: RiskLevel;
  timestamp: string;
}

export interface CosmicState {
  currentScan: Scan | null;
  isWarping: boolean;
  scanHistory: Scan[];
  mousePos: { x: number; y: number };
  gravityTheme: 'dark_void' | 'light_nova';
  scamWallets: any[];
  userReports: any[];
  
  setMousePos: (x: number, y: number) => void;
  startScan: (address: string) => void;
  completeScan: (scan: Scan) => void;
  setGravityTheme: (theme: 'dark_void' | 'light_nova') => void;
}

export const useCosmicStore = create<CosmicState>((set) => ({
  currentScan: null,
  isWarping: false,
  scanHistory: [],
  mousePos: { x: 0, y: 0 },
  gravityTheme: 'dark_void',
  scamWallets: [],
  userReports: [],

  setMousePos: (x, y) => set({ mousePos: { x, y } }),
  startScan: (address) => set({ isWarping: true, currentScan: { address, score: 0, level: 'safe', timestamp: new Date().toISOString() } }),
  completeScan: (scan) =>
    set((state) => ({
      isWarping: false,
      currentScan: scan,
      scanHistory: [scan, ...state.scanHistory],
    })),
  setGravityTheme: (gravityTheme) => set({ gravityTheme }),
}));
