import algosdk from 'algosdk';
import { PeraWalletConnect } from '@perawallet/connect';

const ALGORAND_NODE = process.env.NEXT_PUBLIC_ALGORAND_NODE || 'https://testnet-api.algonode.cloud';
const ALGORAND_INDEXER = process.env.NEXT_PUBLIC_ALGORAND_INDEXER || 'https://testnet-idx.algonode.cloud';
const ALGORAND_PORT = '';
const ALGORAND_TOKEN = '';

export class AlgorandService {
  private algodClient: algosdk.Algodv2;
  private indexerClient: algosdk.Indexer;
  private peraWallet: PeraWalletConnect;
  private connectedAccount: string | null = null;

  constructor() {
    this.algodClient = new algosdk.Algodv2(ALGORAND_TOKEN, ALGORAND_NODE, ALGORAND_PORT);
    this.indexerClient = new algosdk.Indexer(ALGORAND_TOKEN, ALGORAND_INDEXER, ALGORAND_PORT);
    
    if (typeof window !== 'undefined') {
      this.peraWallet = new PeraWalletConnect({
        chainId: 416002, // Testnet
      });
    }
  }

  async connectPeraWallet(): Promise<string[]> {
    try {
      const accounts = await this.peraWallet.connect();
      this.connectedAccount = accounts[0];
      
      this.peraWallet.connector?.on('disconnect', () => {
        this.connectedAccount = null;
      });

      return accounts;
    } catch (error) {
      console.error('Pera Wallet connection error:', error);
      throw error;
    }
  }

  async disconnectPeraWallet(): Promise<void> {
    await this.peraWallet.disconnect();
    this.connectedAccount = null;
  }

  async getAccountInfo(address: string) {
    try {
      const accountInfo = await this.algodClient.accountInformation(address).do();
      return {
        address,
        balance: accountInfo.amount / 1000000, // Convert microAlgos to Algos
        minBalance: accountInfo['min-balance'] / 1000000,
        assets: accountInfo.assets || [],
      };
    } catch (error) {
      console.error('Error fetching account info:', error);
      throw error;
    }
  }

  async sendPayment(from: string, to: string, amount: number, note?: string): Promise<string> {
    try {
      const params = await this.algodClient.getTransactionParams().do();
      const amountInMicroAlgos = amount * 1000000;

      const txn = algosdk.makePaymentTxnWithSuggestedParamsFromObject({
        from,
        to,
        amount: amountInMicroAlgos,
        note: note ? new Uint8Array(Buffer.from(note)) : undefined,
        suggestedParams: params,
      });

      const singleTxnGroups = [{ txn, signers: [from] }];
      const signedTxn = await this.peraWallet.signTransaction([singleTxnGroups]);
      
      const { txId } = await this.algodClient.sendRawTransaction(signedTxn).do();
      await this.waitForConfirmation(txId);
      
      return txId;
    } catch (error) {
      console.error('Payment error:', error);
      throw error;
    }
  }

  async createAsset(
    creator: string,
    assetName: string,
    unitName: string,
    total: number,
    decimals: number = 0
  ): Promise<number> {
    try {
      const params = await this.algodClient.getTransactionParams().do();

      const txn = algosdk.makeAssetCreateTxnWithSuggestedParamsFromObject({
        from: creator,
        assetName,
        unitName,
        total,
        decimals,
        defaultFrozen: false,
        manager: creator,
        reserve: creator,
        freeze: creator,
        clawback: creator,
        suggestedParams: params,
      });

      const singleTxnGroups = [{ txn, signers: [creator] }];
      const signedTxn = await this.peraWallet.signTransaction([singleTxnGroups]);
      
      const { txId } = await this.algodClient.sendRawTransaction(signedTxn).do();
      const confirmedTxn = await this.waitForConfirmation(txId);
      
      return confirmedTxn['asset-index'];
    } catch (error) {
      console.error('Asset creation error:', error);
      throw error;
    }
  }

  async optInToAsset(account: string, assetId: number): Promise<string> {
    try {
      const params = await this.algodClient.getTransactionParams().do();

      const txn = algosdk.makeAssetTransferTxnWithSuggestedParamsFromObject({
        from: account,
        to: account,
        assetIndex: assetId,
        amount: 0,
        suggestedParams: params,
      });

      const singleTxnGroups = [{ txn, signers: [account] }];
      const signedTxn = await this.peraWallet.signTransaction([singleTxnGroups]);
      
      const { txId } = await this.algodClient.sendRawTransaction(signedTxn).do();
      await this.waitForConfirmation(txId);
      
      return txId;
    } catch (error) {
      console.error('Asset opt-in error:', error);
      throw error;
    }
  }

  async transferAsset(
    from: string,
    to: string,
    assetId: number,
    amount: number
  ): Promise<string> {
    try {
      const params = await this.algodClient.getTransactionParams().do();

      const txn = algosdk.makeAssetTransferTxnWithSuggestedParamsFromObject({
        from,
        to,
        assetIndex: assetId,
        amount,
        suggestedParams: params,
      });

      const singleTxnGroups = [{ txn, signers: [from] }];
      const signedTxn = await this.peraWallet.signTransaction([singleTxnGroups]);
      
      const { txId } = await this.algodClient.sendRawTransaction(signedTxn).do();
      await this.waitForConfirmation(txId);
      
      return txId;
    } catch (error) {
      console.error('Asset transfer error:', error);
      throw error;
    }
  }

  async getTransactionHistory(address: string, limit: number = 10) {
    try {
      const txns = await this.indexerClient
        .searchForTransactions()
        .address(address)
        .limit(limit)
        .do();
      
      return txns.transactions;
    } catch (error) {
      console.error('Error fetching transaction history:', error);
      throw error;
    }
  }

  private async waitForConfirmation(txId: string): Promise<any> {
    const response = await algosdk.waitForConfirmation(this.algodClient, txId, 4);
    return response;
  }

  getConnectedAccount(): string | null {
    return this.connectedAccount;
  }

  isConnected(): boolean {
    return this.connectedAccount !== null;
  }
}

export const algorandService = new AlgorandService();
