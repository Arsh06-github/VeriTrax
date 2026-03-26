'use client';

import { useState, useEffect, createContext, useContext, ReactNode } from 'react';
import { web3Service, WalletType } from '@/lib/web3';
import { ApiService, UserProfile } from '@/lib/api';
import { toast } from 'sonner';

interface Web3ContextType {
  account: string | null;
  walletType: WalletType;
  userProfile: UserProfile | null;
  isConnecting: boolean;
  connectMetaMask: () => Promise<void>;
  connectCoinbase: () => Promise<void>;
  disconnect: () => void;
  refreshProfile: () => Promise<void>;
}

const Web3Context = createContext<Web3ContextType | undefined>(undefined);

export function Web3Provider({ children }: { children: ReactNode }) {
  const [account, setAccount] = useState<string | null>(null);
  const [walletType, setWalletType] = useState<WalletType>(null);
  const [userProfile, setUserProfile] = useState<UserProfile | null>(null);
  const [isConnecting, setIsConnecting] = useState(false);

  const loadUserProfile = async (address: string) => {
    try {
      const profile = await ApiService.getUserProfile(address);
      setUserProfile(profile);
    } catch (error) {
      console.log('User profile not found, needs to be created');
      setUserProfile(null);
    }
  };

  const connectMetaMask = async () => {
    setIsConnecting(true);
    try {
      const address = await web3Service.connectMetaMask();
      setAccount(address);
      setWalletType('metamask');
      await loadUserProfile(address);
      localStorage.setItem('walletType', 'metamask');
      localStorage.setItem('walletAddress', address);
    } catch (error) {
      console.error('Failed to connect MetaMask:', error);
      throw error;
    } finally {
      setIsConnecting(false);
    }
  };

  const connectCoinbase = async () => {
    setIsConnecting(true);
    try {
      const address = await web3Service.connectCoinbase();
      setAccount(address);
      setWalletType('coinbase');
      await loadUserProfile(address);
      localStorage.setItem('walletType', 'coinbase');
      localStorage.setItem('walletAddress', address);
    } catch (error) {
      console.error('Failed to connect Coinbase Wallet:', error);
      throw error;
    } finally {
      setIsConnecting(false);
    }
  };

  const disconnect = () => {
    web3Service.disconnect();
    setAccount(null);
    setWalletType(null);
    setUserProfile(null);
    localStorage.removeItem('walletType');
    localStorage.removeItem('walletAddress');
    toast.success('Wallet disconnected successfully');
  };

  const refreshProfile = async () => {
    if (account) {
      await loadUserProfile(account);
    }
  };

  // Auto-reconnect on page load
  useEffect(() => {
    const savedWalletType = localStorage.getItem('walletType') as WalletType;
    const savedAddress = localStorage.getItem('walletAddress');

    if (savedWalletType && savedAddress) {
      if (savedWalletType === 'metamask') {
        connectMetaMask().catch(console.error);
      } else if (savedWalletType === 'coinbase') {
        connectCoinbase().catch(console.error);
      }
    }
  }, []);

  // Listen for account changes
  useEffect(() => {
    if (typeof window === 'undefined') return;

    const handleAccountsChanged = (accounts: string[]) => {
      if (accounts.length === 0) {
        disconnect();
      } else if (accounts[0] !== account) {
        setAccount(accounts[0]);
        loadUserProfile(accounts[0]);
      }
    };

    const handleChainChanged = () => {
      window.location.reload();
    };

    if (window.ethereum) {
      window.ethereum.on('accountsChanged', handleAccountsChanged);
      window.ethereum.on('chainChanged', handleChainChanged);

      return () => {
        window.ethereum.removeListener('accountsChanged', handleAccountsChanged);
        window.ethereum.removeListener('chainChanged', handleChainChanged);
      };
    }
  }, [account]);

  return (
    <Web3Context.Provider
      value={{
        account,
        walletType,
        userProfile,
        isConnecting,
        connectMetaMask,
        connectCoinbase,
        disconnect,
        refreshProfile,
      }}
    >
      {children}
    </Web3Context.Provider>
  );
}

export function useWeb3() {
  const context = useContext(Web3Context);
  if (context === undefined) {
    throw new Error('useWeb3 must be used within a Web3Provider');
  }
  return context;
}
