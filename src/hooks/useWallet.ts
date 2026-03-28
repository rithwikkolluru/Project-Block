import { create } from 'zustand';
import { algorandService } from '../services/blockchain/algorandService';

interface WalletState {
  address: string | null;
  isConnected: boolean;
  isLoading: boolean;
  error: string | null;
  connect: () => Promise<void>;
  loginEmail: (email: string) => void;
  disconnect: () => Promise<void>;
  reconnect: () => Promise<void>;
}

export const useWallet = create<WalletState>((set) => ({
  address: localStorage.getItem('walletAddress') || localStorage.getItem('userEmail'),
  isConnected: !!(localStorage.getItem('walletAddress') || localStorage.getItem('userEmail')),
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

  // Mock login for email/password
  loginEmail: (email: string) => {
    localStorage.setItem('userEmail', email);
    set({ address: email, isConnected: true });
  },

  disconnect: async () => {
    try {
      if (localStorage.getItem('walletAddress')) {
        await algorandService.disconnectWallet();
      }
      localStorage.removeItem('walletAddress');
      localStorage.removeItem('userEmail');
      set({ address: null, isConnected: false });
    } catch (err: any) {
      console.error('Disconnect error:', err);
      // Still clear local state
      localStorage.removeItem('walletAddress');
      localStorage.removeItem('userEmail');
      set({ address: null, isConnected: false });
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
