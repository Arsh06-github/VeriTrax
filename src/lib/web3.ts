import { ethers } from 'ethers';
import CoinbaseWalletSDK from '@coinbase/wallet-sdk';

const CONTRACT_ADDRESS = process.env.NEXT_PUBLIC_CONTRACT_ADDRESS || '';
const CHAIN_ID = process.env.NEXT_PUBLIC_CHAIN_ID || '11155111'; // Sepolia testnet

// Only initialize contract if address is valid
const isValidContractAddress = CONTRACT_ADDRESS && CONTRACT_ADDRESS !== 'your_contract_address_here' && ethers.isAddress(CONTRACT_ADDRESS);

// Simplified ABI - add your full ABI here
const CONTRACT_ABI = [
  "function createCharity(address _charityWallet, string memory _name, string memory _description, string memory _category, uint256 _targetAmount) external returns (uint256)",
  "function donate(uint256 _charityId) external payable",
  "function getCharity(uint256 _charityId) external view returns (tuple(uint256 id, address charityWallet, string name, string description, string category, uint256 targetAmount, uint256 raisedAmount, bool isActive, address creator))",
  "function verifyCharity(uint256 _charityId) external",
  "event CharityCreated(uint256 indexed charityId, address indexed creator, address charityWallet, string name)",
  "event DonationReceived(uint256 indexed charityId, address indexed donor, uint256 amount)"
];

export type WalletType = 'metamask' | 'coinbase' | null;

class Web3Service {
  private provider: ethers.BrowserProvider | null = null;
  private signer: ethers.Signer | null = null;
  private contract: ethers.Contract | null = null;
  private coinbaseWallet: any = null;
  private currentWalletType: WalletType = null;

  async connectMetaMask(): Promise<string> {
    if (typeof window === 'undefined') {
      throw new Error('Window is not available');
    }

    // Check for MetaMask specifically
    let ethereum = window.ethereum;
    
    // If multiple wallets are installed, find MetaMask
    if (window.ethereum?.providers) {
      ethereum = window.ethereum.providers.find((provider: any) => provider.isMetaMask);
    } else if (!window.ethereum?.isMetaMask) {
      // Check if there's a MetaMask provider
      if (window.ethereum?.providerMap?.has('MetaMask')) {
        ethereum = window.ethereum.providerMap.get('MetaMask');
      }
    }

    if (!ethereum) {
      throw new Error('MetaMask is not installed. Please install MetaMask extension.');
    }

    try {
      this.provider = new ethers.BrowserProvider(ethereum);
      const accounts = await this.provider.send('eth_requestAccounts', []);
      this.signer = await this.provider.getSigner();
      
      // Only initialize contract if valid address is configured
      if (isValidContractAddress) {
        this.contract = new ethers.Contract(CONTRACT_ADDRESS, CONTRACT_ABI, this.signer);
      }
      
      this.currentWalletType = 'metamask';

      // Switch to correct network if needed
      await this.switchNetwork();

      return accounts[0];
    } catch (error) {
      console.error('MetaMask connection error:', error);
      throw error;
    }
  }

  async connectCoinbase(): Promise<string> {
    if (typeof window === 'undefined') {
      throw new Error('Window is not available');
    }

    try {
      // Check if Coinbase Wallet extension is installed
      let coinbaseProvider = null;
      
      if (window.ethereum?.providers) {
        coinbaseProvider = window.ethereum.providers.find((provider: any) => provider.isCoinbaseWallet);
      } else if (window.ethereum?.isCoinbaseWallet) {
        coinbaseProvider = window.ethereum;
      } else if (window.ethereum?.providerMap?.has('CoinbaseWallet')) {
        coinbaseProvider = window.ethereum.providerMap.get('CoinbaseWallet');
      }

      // If Coinbase Wallet extension is found, use it directly
      if (coinbaseProvider) {
        this.provider = new ethers.BrowserProvider(coinbaseProvider);
        const accounts = await this.provider.send('eth_requestAccounts', []);
        this.signer = await this.provider.getSigner();
        
        // Only initialize contract if valid address is configured
        if (isValidContractAddress) {
          this.contract = new ethers.Contract(CONTRACT_ADDRESS, CONTRACT_ABI, this.signer);
        }
        
        this.currentWalletType = 'coinbase';
        return accounts[0];
      }

      // Otherwise, use Coinbase Wallet SDK (for mobile or if extension not installed)
      const coinbaseWallet = new CoinbaseWalletSDK({
        appName: 'Veritrax',
        appLogoUrl: 'https://veritrax.in/logo.png',
        darkMode: false
      });

      // Create Web3 Provider
      const ethereum = coinbaseWallet.makeWeb3Provider(
        `https://eth-sepolia.g.alchemy.com/v2/${process.env.NEXT_PUBLIC_ALCHEMY_KEY || ''}`,
        parseInt(CHAIN_ID)
      );

      this.coinbaseWallet = ethereum;
      this.provider = new ethers.BrowserProvider(ethereum);
      
      const accounts = await ethereum.request({ method: 'eth_requestAccounts' });
      this.signer = await this.provider.getSigner();
      
      // Only initialize contract if valid address is configured
      if (isValidContractAddress) {
        this.contract = new ethers.Contract(CONTRACT_ADDRESS, CONTRACT_ABI, this.signer);
      }
      
      this.currentWalletType = 'coinbase';

      return accounts[0];
    } catch (error) {
      console.error('Coinbase Wallet connection error:', error);
      throw error;
    }
  }

  async switchNetwork(): Promise<void> {
    if (!this.provider) return;

    try {
      await this.provider.send('wallet_switchEthereumChain', [
        { chainId: `0x${parseInt(CHAIN_ID).toString(16)}` }
      ]);
    } catch (error: any) {
      // Chain not added, add it
      if (error.code === 4902) {
        await this.provider.send('wallet_addEthereumChain', [
          {
            chainId: `0x${parseInt(CHAIN_ID).toString(16)}`,
            chainName: 'Sepolia Test Network',
            nativeCurrency: { name: 'ETH', symbol: 'ETH', decimals: 18 },
            rpcUrls: ['https://sepolia.infura.io/v3/'],
            blockExplorerUrls: ['https://sepolia.etherscan.io']
          }
        ]);
      }
    }
  }

  async createCharityOnChain(
    charityWallet: string,
    name: string,
    description: string,
    category: string,
    targetAmount: string
  ): Promise<number> {
    if (!this.contract || !this.signer) {
      throw new Error('Wallet not connected');
    }

    try {
      const targetAmountWei = ethers.parseEther(targetAmount);
      const tx = await this.contract.createCharity(
        charityWallet,
        name,
        description,
        category,
        targetAmountWei
      );

      const receipt = await tx.wait();
      
      // Parse the CharityCreated event to get the charity ID
      const event = receipt.logs.find((log: any) => {
        try {
          const parsed = this.contract!.interface.parseLog(log);
          return parsed?.name === 'CharityCreated';
        } catch {
          return false;
        }
      });

      if (event) {
        const parsed = this.contract.interface.parseLog(event);
        return Number(parsed?.args[0]);
      }

      throw new Error('Charity ID not found in transaction');
    } catch (error) {
      console.error('Create charity on-chain error:', error);
      throw error;
    }
  }

  async donate(charityId: number, amount: string): Promise<string> {
    if (!this.contract || !this.signer) {
      throw new Error('Wallet not connected');
    }

    try {
      const amountWei = ethers.parseEther(amount);
      const tx = await this.contract.donate(charityId, { value: amountWei });
      const receipt = await tx.wait();
      return receipt.hash;
    } catch (error) {
      console.error('Donation error:', error);
      throw error;
    }
  }

  async verifyCharity(charityId: number): Promise<void> {
    if (!this.contract || !this.signer) {
      throw new Error('Wallet not connected');
    }

    try {
      const tx = await this.contract.verifyCharity(charityId);
      await tx.wait();
    } catch (error) {
      console.error('Verify charity error:', error);
      throw error;
    }
  }

  async getCharityOnChain(charityId: number): Promise<any> {
    if (!this.contract) {
      throw new Error('Contract not initialized');
    }

    try {
      return await this.contract.getCharity(charityId);
    } catch (error) {
      console.error('Get charity error:', error);
      throw error;
    }
  }

  getCurrentWalletType(): WalletType {
    return this.currentWalletType;
  }

  disconnect(): void {
    this.provider = null;
    this.signer = null;
    this.contract = null;
    this.currentWalletType = null;
    
    if (this.coinbaseWallet) {
      this.coinbaseWallet.disconnect();
      this.coinbaseWallet = null;
    }
  }

  setupContractEventListeners(): void {
    if (!this.contract) return;

    this.contract.on('CharityCreated', (charityId, creator, charityWallet, name) => {
      console.log('Charity Created:', { charityId, creator, charityWallet, name });
    });

    this.contract.on('DonationReceived', (charityId, donor, amount) => {
      console.log('Donation Received:', { charityId, donor, amount: ethers.formatEther(amount) });
    });
  }
}

export const web3Service = new Web3Service();

// Type declarations for window.ethereum
declare global {
  interface Window {
    ethereum?: any;
  }
}
