'use client';

import { useState, useEffect, createContext, useContext, ReactNode } from 'react';
import { web3Service, WalletType } from '@/lib/web3';
import { algorandService } from '@/lib/algorand';
import { solanaService } from '@/lib/solana';
import { walletConnectService } from '@/lib/walletconnect';
import { coinbaseAdvancedService } from '@/lib/coinbase-advanced';
import { x402Service } from '@/lib/x402';
import { toast } from 'sonner';

export type ChainType = 'ethereum' | 'algorand' | 'solana' | 'polygon';
export type WalletProvider = 'metamask' | 'coinbase' | 'pera' | 'walletconnect' | 'phantom' | 'ledger';

interface WalletConnection {
  chain: ChainType;
  provider: WalletProvider;
  address: string;
  balance?: string;
}

interface MultiChainWalletContextType {
  connections: WalletConnection[];
  activeChain: ChainType | null;
  isConnecting: boolean;
  
  // Connection methods
  connectEthereum: (provider: 'metamask' | 'coinbase' | 'walletconnect') => Promise<void>;
  connectAlgorand: () => Promise<void>;
  connectSolana: (provider: 'phantom' | 'ledger') => Promise<void>;
  disconnect: (chain: ChainType) => Promise<void>;
  disconnectAll: () => Promise<void>;
  
  // Chain switching
  switchChain: (chain: ChainType) => void;
  
  // Balance queries
  getBalance: (chain: ChainType) => Promise<string | null>;
  refreshBalances: () => Promise<void>;
  
  // Transaction methods
  sendTransaction: (chain: ChainType, to: string, amount: string) => Promise<string>;
  
  // x402 Payment Automation
  createRecurringDonation: (
    chain: ChainType,
    to: string,
    amount: string,
    frequency: 'daily' | 'weekly' | 'monthly'
  ) => Promise<void>;
  
  // Utility
  isConnected: (chain: ChainType) => boolean;
  getConnection: (chain: ChainType) => WalletConnection | null;
}

const MultiChainWalletContext = createContext<MultiChainWalletContextType | undefined>(undefined);

export function MultiChainWalletProvider({ children }: { children: ReactNode }) {
  const [connections, setConnections] = useState<WalletConnection[]>([]);
  const [activeChain, setActiveChain] = useState<ChainType | null>(null);
  const [isConnecting, setIsConnecting] = useState(false);

  const connectEthereum = async (provider: 'metamask' | 'coinbase' | 'walletconnect') => {
    setIsConnecting(true);
    try {
      let address: string;
      
      switch (provider) {
        case 'metamask':
          address = await web3Service.connectMetaMask();
          break;
        case 'coinbase':
          address = await web3Service.connectCoinbase();
          break;
        case 'walletconnect':
          address = await walletConnectService.connect();
          break;
        default:
          throw new Error('Unknown provider');
      }

      const newConnection: WalletConnection = {
        chain: 'ethereum',
        provider,
        address,
      };

      setConnections(prev => [...prev.filter(c => c.chain !== 'ethereum'), newConnection]);
      setActiveChain('ethereum');
      
      localStorage.setItem('eth_wallet', JSON.stringify(newConnection));
      toast.success(`Connected to Ethereum via ${provider}`);
    } catch (error: any) {
      toast.error(error.message || 'Failed to connect to Ethereum');
      throw error;
    } finally {
      setIsConnecting(false);
    }
  };

  const connectAlgorand = async () => {
    setIsConnecting(true);
    try {
      const accounts = await algorandService.connectPeraWallet();
      
      const newConnection: WalletConnection = {
        chain: 'algorand',
        provider: 'pera',
        address: accounts[0],
      };

      setConnections(prev => [...prev.filter(c => c.chain !== 'algorand'), newConnection]);
      setActiveChain('algorand');
      
      localStorage.setItem('algo_wallet', JSON.stringify(newConnection));
      toast.success('Connected to Algorand via Pera Wallet');
    } catch (error: any) {
      toast.error(error.message || 'Failed to connect to Algorand');
      throw error;
    } finally {
      setIsConnecting(false);
    }
  };

  const connectSolana = async (provider: 'phantom' | 'ledger') => {
    setIsConnecting(true);
    try {
      let address: string;

      if (provider === 'phantom') {
        if (typeof window !== 'undefined' && (window as any).solana) {
          const resp = await (window as any).solana.connect();
          address = resp.publicKey.toString();
          solanaService.setWallet((window as any).solana);
        } else {
          throw new Error('Phantom wallet not installed');
        }
      } else {
        throw new Error('Ledger support requires additional setup');
      }

      const newConnection: WalletConnection = {
        chain: 'solana',
        provider,
        address,
      };

      setConnections(prev => [...prev.filter(c => c.chain !== 'solana'), newConnection]);
      setActiveChain('solana');
      
      localStorage.setItem('sol_wallet', JSON.stringify(newConnection));
      toast.success(`Connected to Solana via ${provider}`);
    } catch (error: any) {
      toast.error(error.message || 'Failed to connect to Solana');
      throw error;
    } finally {
      setIsConnecting(false);
    }
  };

  const disconnect = async (chain: ChainType) => {
    try {
      switch (chain) {
        case 'ethereum':
          web3Service.disconnect();
          walletConnectService.disconnect();
          localStorage.removeItem('eth_wallet');
          break;
        case 'algorand':
          await algorandService.disconnectPeraWallet();
          localStorage.removeItem('algo_wallet');
          break;
        case 'solana':
          if (typeof window !== 'undefined' && (window as any).solana) {
            await (window as any).solana.disconnect();
          }
          localStorage.removeItem('sol_wallet');
          break;
      }

      setConnections(prev => prev.filter(c => c.chain !== chain));
      
      if (activeChain === chain) {
        setActiveChain(connections[0]?.chain || null);
      }

      toast.success(`Disconnected from ${chain}`);
    } catch (error: any) {
      toast.error(error.message || `Failed to disconnect from ${chain}`);
    }
  };

  const disconnectAll = async () => {
    for (const connection of connections) {
      await disconnect(connection.chain);
    }
  };

  const switchChain = (chain: ChainType) => {
    const connection = connections.find(c => c.chain === chain);
    if (connection) {
      setActiveChain(chain);
      toast.success(`Switched to ${chain}`);
    } else {
      toast.error(`Not connected to ${chain}`);
    }
  };

  const getBalance = async (chain: ChainType): Promise<string | null> => {
    const connection = connections.find(c => c.chain === chain);
    if (!connection) return null;

    try {
      switch (chain) {
        case 'ethereum':
          const ethBalance = await walletConnectService.getBalance(connection.address);
          return ethBalance;
        case 'algorand':
          const algoInfo = await algorandService.getAccountInfo(connection.address);
          return algoInfo.balance.toString();
        case 'solana':
          const solBalance = await solanaService.getBalance(
            new (await import('@solana/web3.js')).PublicKey(connection.address)
          );
          return solBalance.toString();
        default:
          return null;
      }
    } catch (error) {
      console.error(`Error fetching ${chain} balance:`, error);
      return null;
    }
  };

  const refreshBalances = async () => {
    for (const connection of connections) {
      const balance = await getBalance(connection.chain);
      if (balance) {
        setConnections(prev =>
          prev.map(c =>
            c.chain === connection.chain ? { ...c, balance } : c
          )
        );
      }
    }
  };

  const sendTransaction = async (chain: ChainType, to: string, amount: string): Promise<string> => {
    const connection = connections.find(c => c.chain === chain);
    if (!connection) {
      throw new Error(`Not connected to ${chain}`);
    }

    try {
      switch (chain) {
        case 'ethereum':
          return await walletConnectService.sendTransaction(to, amount);
        case 'algorand':
          return await algorandService.sendPayment(connection.address, to, parseFloat(amount));
        case 'solana':
          const { PublicKey } = await import('@solana/web3.js');
          return await solanaService.sendSOL(
            new PublicKey(connection.address),
            new PublicKey(to),
            parseFloat(amount)
          );
        default:
          throw new Error(`Unsupported chain: ${chain}`);
      }
    } catch (error: any) {
      toast.error(error.message || 'Transaction failed');
      throw error;
    }
  };

  const createRecurringDonation = async (
    chain: ChainType,
    to: string,
    amount: string,
    frequency: 'daily' | 'weekly' | 'monthly'
  ) => {
    const connection = connections.find(c => c.chain === chain);
    if (!connection) {
      throw new Error(`Not connected to ${chain}`);
    }

    try {
      await x402Service.createRecurringPayment(
        connection.address,
        to,
        amount,
        frequency
      );
      toast.success(`Recurring donation set up successfully`);
    } catch (error: any) {
      toast.error(error.message || 'Failed to set up recurring donation');
      throw error;
    }
  };

  const isConnected = (chain: ChainType): boolean => {
    return connections.some(c => c.chain === chain);
  };

  const getConnection = (chain: ChainType): WalletConnection | null => {
    return connections.find(c => c.chain === chain) || null;
  };

  // Auto-reconnect on page load
  useEffect(() => {
    const reconnect = async () => {
      const ethWallet = localStorage.getItem('eth_wallet');
      const algoWallet = localStorage.getItem('algo_wallet');
      const solWallet = localStorage.getItem('sol_wallet');

      if (ethWallet) {
        const conn = JSON.parse(ethWallet);
        try {
          await connectEthereum(conn.provider);
        } catch (error) {
          console.error('Failed to reconnect Ethereum:', error);
        }
      }

      if (algoWallet) {
        try {
          await connectAlgorand();
        } catch (error) {
          console.error('Failed to reconnect Algorand:', error);
        }
      }

      if (solWallet) {
        const conn = JSON.parse(solWallet);
        try {
          await connectSolana(conn.provider);
        } catch (error) {
          console.error('Failed to reconnect Solana:', error);
        }
      }
    };

    reconnect();
  }, []);

  return (
    <MultiChainWalletContext.Provider
      value={{
        connections,
        activeChain,
        isConnecting,
        connectEthereum,
        connectAlgorand,
        connectSolana,
        disconnect,
        disconnectAll,
        switchChain,
        getBalance,
        refreshBalances,
        sendTransaction,
        createRecurringDonation,
        isConnected,
        getConnection,
      }}
    >
      {children}
    </MultiChainWalletContext.Provider>
  );
}

export function useMultiChainWallet() {
  const context = useContext(MultiChainWalletContext);
  if (context === undefined) {
    throw new Error('useMultiChainWallet must be used within a MultiChainWalletProvider');
  }
  return context;
}
