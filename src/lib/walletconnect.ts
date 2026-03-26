import { EthereumProvider } from '@walletconnect/ethereum-provider';
import { ethers } from 'ethers';

const WALLETCONNECT_PROJECT_ID = process.env.NEXT_PUBLIC_WALLETCONNECT_PROJECT_ID || '';

export class WalletConnectService {
  private provider: EthereumProvider | null = null;
  private ethersProvider: ethers.BrowserProvider | null = null;
  private signer: ethers.Signer | null = null;

  async connect(): Promise<string> {
    try {
      this.provider = await EthereumProvider.init({
        projectId: WALLETCONNECT_PROJECT_ID,
        chains: [1], // Ethereum Mainnet
        optionalChains: [11155111, 80002, 137], // Sepolia, Polygon Amoy, Polygon Mainnet
        showQrModal: true,
        qrModalOptions: {
          themeMode: 'light',
        },
      });

      const accounts = await this.provider.enable();
      
      this.ethersProvider = new ethers.BrowserProvider(this.provider);
      this.signer = await this.ethersProvider.getSigner();

      this.setupEventListeners();

      return accounts[0];
    } catch (error) {
      console.error('WalletConnect connection error:', error);
      throw error;
    }
  }

  async disconnect(): Promise<void> {
    if (this.provider) {
      await this.provider.disconnect();
      this.provider = null;
      this.ethersProvider = null;
      this.signer = null;
    }
  }

  async switchChain(chainId: number): Promise<void> {
    if (!this.provider) {
      throw new Error('Provider not initialized');
    }

    try {
      await this.provider.request({
        method: 'wallet_switchEthereumChain',
        params: [{ chainId: `0x${chainId.toString(16)}` }],
      });
    } catch (error: any) {
      if (error.code === 4902) {
        throw new Error('Chain not added to wallet');
      }
      throw error;
    }
  }

  async getBalance(address: string): Promise<string> {
    if (!this.ethersProvider) {
      throw new Error('Provider not initialized');
    }

    const balance = await this.ethersProvider.getBalance(address);
    return ethers.formatEther(balance);
  }

  async sendTransaction(to: string, value: string): Promise<string> {
    if (!this.signer) {
      throw new Error('Signer not initialized');
    }

    const tx = await this.signer.sendTransaction({
      to,
      value: ethers.parseEther(value),
    });

    const receipt = await tx.wait();
    return receipt?.hash || '';
  }

  async signMessage(message: string): Promise<string> {
    if (!this.signer) {
      throw new Error('Signer not initialized');
    }

    return await this.signer.signMessage(message);
  }

  private setupEventListeners(): void {
    if (!this.provider) return;

    this.provider.on('accountsChanged', (accounts: string[]) => {
      console.log('Accounts changed:', accounts);
    });

    this.provider.on('chainChanged', (chainId: number) => {
      console.log('Chain changed:', chainId);
      window.location.reload();
    });

    this.provider.on('disconnect', () => {
      console.log('Disconnected');
      this.provider = null;
      this.ethersProvider = null;
      this.signer = null;
    });
  }

  getProvider(): EthereumProvider | null {
    return this.provider;
  }

  getSigner(): ethers.Signer | null {
    return this.signer;
  }

  isConnected(): boolean {
    return this.provider !== null;
  }
}

export const walletConnectService = new WalletConnectService();
