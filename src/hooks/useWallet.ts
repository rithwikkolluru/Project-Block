import { create } from 'zustand';
import { algorandService } from '../services/blockchain/algorandService';

interface WalletState {
  address: string | null;
  isConnected: boolean;
  isLoading: boolean;
  error: string | null;
  connect: () => Promise<void>;
  disconnect: () => Promise<void>;
  reconnect: () => Promise<void>;
}

export const useWallet = create<WalletState>((set) => ({
  address: localStorage.getItem('walletAddress'),
  isConnected: !!localStorage.getItem('walletAddress'),
  isLoading: false,
  error: null,

  connect: async () => {
    set({ isLoading: true, error: null });
    try {
      const accounts = await algorandService.connectWallet();
      const address = accounts[0];
      localStorage.setItem('walletAddress', address);
      set({ address, isConnected: true, isLoading: false });
    } catch (err: any) {
      set({ error: err.message, isLoading: false });
    }
  },

  disconnect: async () => {
    try {
      await algorandService.disconnectWallet();
      set({ address: null, isConnected: false });
    } catch (err: any) {
      console.error('Disconnect error:', err);
    }
  },

  reconnect: async () => {
    set({ isLoading: true });
    try {
      const accounts = await algorandService.reconnectWallet();
      if (accounts.length > 0) {
        set({ address: accounts[0], isConnected: true });
      } else {
        localStorage.removeItem('walletAddress');
        set({ address: null, isConnected: false });
      }
    } catch (err) {
      console.error('Reconnection failed', err);
    } finally {
      set({ isLoading: false });
    }
  }
}));
