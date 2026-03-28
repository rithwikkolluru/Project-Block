import algosdk from 'algosdk';
import { PeraWalletConnect } from '@perawallet/connect';

// Initialize Pera Wallet Connect
const peraWallet = new PeraWalletConnect();

// Configuration (to be moved to env/config in production)
const ALGOD_SERVER = 'https://testnet-api.algonode.cloud';
const ALGOD_PORT = '';
const ALGOD_TOKEN = '';

const algodClient = new algosdk.Algodv2(ALGOD_TOKEN, ALGOD_SERVER, ALGOD_PORT);

/**
 * Algorand Service Layer
 * Centralizes all blockchain interactions.
 */
export const algorandService = {
  /**
   * Connect to Pera Wallet
   * @returns {Promise<string[]>} List of connected accounts
   */
  async connectWallet() {
    try {
      const accounts = await peraWallet.connect();
      
      // Setup disconnect listener
      peraWallet.connector?.on('disconnect', () => {
        console.log('Wallet disconnected');
        localStorage.removeItem('walletAddress');
      });

      return accounts;
    } catch (error) {
      console.error('Pera Wallet connection error:', error);
      throw error;
    }
  },

  /**
   * Reconnect to existing session
   * @returns {Promise<string[]>}
   */
  async reconnectWallet() {
    try {
      const accounts = await peraWallet.reconnectSession();
      return accounts || [];
    } catch (error) {
      console.error('Wallet reconnection error:', error);
      return [];
    }
  },

  /**
   * Disconnect wallet
   */
  async disconnectWallet() {
    await peraWallet.disconnect();
    localStorage.removeItem('walletAddress');
  },

  /**
   * Get Account Balance
   * @param {string} address 
   * @returns {Promise<number>} Balance in Algos
   */
  async getBalance(address) {
    const accountInfo = await algodClient.accountInformation(address).do();
    return accountInfo.amount / 1_000_000; // microAlgos to Algos
  },

  /**
   * Sign and send transaction (Skeleton)
   * @param {string} sender 
   * @param {Transaction} txn 
   */
  async signAndSendTransaction(sender, txn) {
    // In a production app, we would use peraWallet.signTransaction
    // This is a placeholder for future AlgoKit integration
    console.log('Transaction signing requested for', sender);
  }
};
