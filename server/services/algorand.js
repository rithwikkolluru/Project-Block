import algosdk from 'algosdk';

const ALGOD_SERVER = process.env.ALGOD_SERVER || 'https://testnet-api.algonode.cloud';
const INDEXER_SERVER = process.env.INDEXER_SERVER || 'https://testnet-idx.algonode.cloud';
const APP_ID = parseInt(process.env.ALGORAND_APP_ID || '0', 10);

export const algodClient = new algosdk.Algodv2('', ALGOD_SERVER, '');
export const indexerClient = new algosdk.Indexer('', INDEXER_SERVER, '');

/**
 * Submit a scam report CID to the smart contract.
 * Requires a funded admin mnemonic in env.
 * @param {string} reporterAddress  — the wallet being reported
 * @param {string} cid              — IPFS CID (or SHA-256 hash) of the evidence
 * @returns {Promise<string>}       — transaction ID
 */
export async function submitScamToChain(reporterAddress, cid) {
  if (!APP_ID || APP_ID === 0) {
    console.warn('⚠️  ALGORAND_APP_ID not set — skipping chain submission');
    return 'mock-txid-' + Date.now();
  }

  const mnemonic = process.env.ADMIN_MNEMONIC;
  if (!mnemonic) {
    console.warn('⚠️  ADMIN_MNEMONIC not set — skipping chain submission');
    return 'mock-txid-' + Date.now();
  }

  try {
    const account = algosdk.mnemonicToSecretKey(mnemonic);
    const suggestedParams = await algodClient.getTransactionParams().do();

    const appCallTxn = algosdk.makeApplicationCallTxnFromObject({
      from: account.addr,
      appIndex: APP_ID,
      onCompletion: algosdk.OnApplicationComplete.NoOpOC,
      appArgs: [
        new TextEncoder().encode('submit'),
        new TextEncoder().encode(cid),
      ],
      accounts: [reporterAddress],
      suggestedParams,
    });

    const signedTxn = appCallTxn.signTxn(account.sk);
    const { txId } = await algodClient.sendRawTransaction(signedTxn).do();
    await algosdk.waitForConfirmation(algodClient, txId, 4);
    return txId;
  } catch (err) {
    console.error('Chain submission error:', err.message);
    return 'failed-txid-' + Date.now();
  }
}

/**
 * Admin: verify a report on-chain.
 * @param {string} targetAddress — the wallet whose report to verify
 * @returns {Promise<string>} — transaction ID
 */
export async function verifyReportOnChain(targetAddress) {
  if (!APP_ID || APP_ID === 0) {
    return 'mock-verify-' + Date.now();
  }

  const mnemonic = process.env.ADMIN_MNEMONIC;
  if (!mnemonic) return 'mock-verify-' + Date.now();

  try {
    const account = algosdk.mnemonicToSecretKey(mnemonic);
    const suggestedParams = await algodClient.getTransactionParams().do();

    const appCallTxn = algosdk.makeApplicationCallTxnFromObject({
      from: account.addr,
      appIndex: APP_ID,
      onCompletion: algosdk.OnApplicationComplete.NoOpOC,
      appArgs: [
        new TextEncoder().encode('verify'),
        new TextEncoder().encode(targetAddress),
      ],
      accounts: [targetAddress],
      suggestedParams,
    });

    const signedTxn = appCallTxn.signTxn(account.sk);
    const { txId } = await algodClient.sendRawTransaction(signedTxn).do();
    await algosdk.waitForConfirmation(algodClient, txId, 4);
    return txId;
  } catch (err) {
    console.error('Verify error:', err.message);
    return 'failed-verify-' + Date.now();
  }
}

/**
 * Fetch account info from Algorand node.
 * @param {string} address
 */
export async function getAccountInfo(address) {
  try {
    const info = await algodClient.accountInformation(address).do();
    return info;
  } catch {
    return null;
  }
}

/**
 * Fetch transaction history for a wallet from the Indexer.
 * @param {string} address
 * @param {number} limit
 */
export async function getTransactionHistory(address, limit = 50) {
  try {
    const result = await indexerClient
      .lookupAccountTransactions(address)
      .limit(limit)
      .do();
    return result.transactions || [];
  } catch {
    return [];
  }
}
