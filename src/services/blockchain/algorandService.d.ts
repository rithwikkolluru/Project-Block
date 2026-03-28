export declare const algorandService: {
  connectWallet: () => Promise<string[]>;
  reconnectWallet: () => Promise<string[]>;
  disconnectWallet: () => Promise<void>;
  getBalance: (address: string) => Promise<number>;
  signAndSendTransaction: (sender: string, txn: unknown) => Promise<void>;
};
