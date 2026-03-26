"use client";

import { useState, useEffect } from 'react';
import { useAuth } from '@/hooks/useAuth';
import { useMultiChainWallet } from '@/hooks/useMultiChainWallet';
import { useRouter } from 'next/navigation';
import { Header } from '@/sections/Header';
import { Footer } from '@/sections/Footer';
import { GlassCard } from '@/components/GlassCard';
import { motion } from 'framer-motion';
import { 
  Send, 
  Wallet, 
  ArrowRight, 
  AlertCircle,
  Copy,
  CheckCircle2
} from 'lucide-react';
import { toast } from 'sonner';

export default function TransferPage() {
  const { user } = useAuth();
  const { connections, activeChain, getBalance, isConnected } = useMultiChainWallet();
  const router = useRouter();
  
  const [selectedChain, setSelectedChain] = useState<string>('ethereum');
  const [recipientAddress, setRecipientAddress] = useState('');
  const [amount, setAmount] = useState('');
  const [balance, setBalance] = useState('0');
  const [gasEstimate, setGasEstimate] = useState('0');
  const [isProcessing, setIsProcessing] = useState(false);
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    if (!user) {
      router.push('/login');
      return;
    }
    loadBalance();
  }, [user, selectedChain, connections]);

  useEffect(() => {
    if (amount && parseFloat(amount) > 0) {
      calculateGasFee();
    } else {
      setGasEstimate('0');
    }
  }, [amount, selectedChain]);

  const loadBalance = async () => {
    if (connections.length > 0) {
      const chainConnection = connections.find(c => c.chain === selectedChain);
      if (chainConnection) {
        const bal = await getBalance(selectedChain as any);
        setBalance(bal || '0');
      }
    }
  };

  const calculateGasFee = () => {
    // Mock gas fee calculation based on amount and chain
    const amountNum = parseFloat(amount);
    let gasFee = 0;

    switch (selectedChain) {
      case 'ethereum':
        gasFee = 0.002 + (amountNum * 0.001); // Base fee + percentage
        break;
      case 'algorand':
        gasFee = 0.001; // Fixed fee for Algorand
        break;
      case 'solana':
        gasFee = 0.000005; // Very low fee for Solana
        break;
      default:
        gasFee = 0.002;
    }

    setGasEstimate(gasFee.toFixed(6));
  };

  const getCurrencySymbol = (chain: string) => {
    const symbols: Record<string, string> = {
      'ethereum': 'ETH',
      'algorand': 'ALGO',
      'solana': 'SOL',
      'polygon': 'MATIC'
    };
    return symbols[chain] || 'ETH';
  };

  const getUSDValue = (amount: string, chain: string) => {
    // Mock USD conversion rates
    const rates: Record<string, number> = {
      'ethereum': 2000,
      'algorand': 0.15,
      'solana': 20,
      'polygon': 0.80
    };
    
    const amountNum = parseFloat(amount) || 0;
    const rate = rates[chain] || 0;
    return (amountNum * rate).toFixed(2);
  };

  const getINRValue = (amount: string, chain: string) => {
    // Mock INR conversion rates (1 USD = 83 INR approx)
    const usdValue = parseFloat(getUSDValue(amount, chain));
    return (usdValue * 83).toFixed(2);
  };

  const copyAddress = () => {
    const connection = connections.find(c => c.chain === selectedChain);
    if (connection) {
      navigator.clipboard.writeText(connection.address);
      setCopied(true);
      toast.success('Address copied to clipboard');
      setTimeout(() => setCopied(false), 2000);
    }
  };

  const handleTransfer = async () => {
    if (!recipientAddress || !amount) {
      toast.error('Please fill in all fields');
      return;
    }

    const amountNum = parseFloat(amount);
    const balanceNum = parseFloat(balance);
    const gasNum = parseFloat(gasEstimate);

    if (amountNum + gasNum > balanceNum) {
      toast.error('Insufficient balance including gas fees');
      return;
    }

    setIsProcessing(true);

    // Simulate transaction processing
    setTimeout(() => {
      setIsProcessing(false);
      // Always show error since wallet is empty
      toast.error('Transaction Failed: No coins to send, wallet empty', {
        description: 'Your wallet does not have sufficient funds to complete this transaction.',
        duration: 5000,
      });
      
      // Reset form
      setRecipientAddress('');
      setAmount('');
    }, 2000);
  };

  const currentConnection = connections.find(c => c.chain === selectedChain);

  if (!user) return null;

  return (
    <div className="min-h-screen bg-gradient-to-b from-[#EAEEFE] to-white">
      <Header />
      
      <div className="container mx-auto px-4 py-12">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-8 text-center"
        >
          <h1 className="text-5xl font-inter font-bold text-gray-900 mb-4 tracking-tight">
            Send & Receive Crypto
          </h1>
          <p className="text-xl text-gray-600">
            Transfer funds securely across blockchain networks
          </p>
        </motion.div>

        <div className="max-w-4xl mx-auto grid md:grid-cols-2 gap-8">
          {/* Send Section */}
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.1 }}
          >
            <GlassCard variant="blue" className="p-8">
              <div className="flex items-center gap-3 mb-6">
                <div className="p-3 rounded-full bg-[#183EC2]/10">
                  <Send className="w-6 h-6 text-[#183EC2]" />
                </div>
                <h2 className="text-2xl font-bold text-gray-900">Send Funds</h2>
              </div>

              {!isConnected(selectedChain as any) ? (
                <div className="text-center py-8">
                  <AlertCircle className="w-12 h-12 text-yellow-500 mx-auto mb-4" />
                  <p className="text-gray-600 mb-4">Please connect your wallet first</p>
                  <button
                    onClick={() => router.push('/multi-chain')}
                    className="btn btn-primary"
                  >
                    Connect Wallet
                  </button>
                </div>
              ) : (
                <div className="space-y-6">
                  {/* Chain Selection */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Select Network
                    </label>
                    <select
                      value={selectedChain}
                      onChange={(e) => setSelectedChain(e.target.value)}
                      className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-[#183EC2] bg-white/80"
                    >
                      {connections.map((conn) => (
                        <option key={conn.chain} value={conn.chain}>
                          {conn.chain.charAt(0).toUpperCase() + conn.chain.slice(1)} ({getCurrencySymbol(conn.chain)})
                        </option>
                      ))}
                    </select>
                  </div>

                  {/* Balance Display */}
                  <div className="bg-gradient-to-r from-[#183EC2]/10 to-purple-500/10 rounded-lg p-4">
                    <p className="text-sm text-gray-600 mb-1">Available Balance</p>
                    <p className="text-2xl font-bold text-gray-900">
                      {balance} {getCurrencySymbol(selectedChain)}
                    </p>
                    <p className="text-sm text-gray-500">
                      ≈ ${getUSDValue(balance, selectedChain)} / ₹{getINRValue(balance, selectedChain)}
                    </p>
                  </div>

                  {/* Recipient Address */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Recipient Address
                    </label>
                    <input
                      type="text"
                      value={recipientAddress}
                      onChange={(e) => setRecipientAddress(e.target.value)}
                      placeholder="Enter wallet address"
                      className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-[#183EC2] bg-white/80"
                    />
                  </div>

                  {/* Amount */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Amount
                    </label>
                    <div className="relative">
                      <input
                        type="number"
                        value={amount}
                        onChange={(e) => setAmount(e.target.value)}
                        placeholder="0.00"
                        step="0.000001"
                        min="0"
                        className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-[#183EC2] bg-white/80"
                      />
                      <span className="absolute right-4 top-1/2 transform -translate-y-1/2 text-gray-500 font-medium">
                        {getCurrencySymbol(selectedChain)}
                      </span>
                    </div>
                    {amount && parseFloat(amount) > 0 && (
                      <p className="text-sm text-gray-500 mt-1">
                        ≈ ${getUSDValue(amount, selectedChain)} / ₹{getINRValue(amount, selectedChain)}
                      </p>
                    )}
                  </div>

                  {/* Gas Fee */}
                  {gasEstimate !== '0' && (
                    <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
                      <div className="flex justify-between items-center mb-2">
                        <span className="text-sm font-medium text-gray-700">Estimated Gas Fee</span>
                        <span className="text-lg font-bold text-gray-900">
                          {gasEstimate} {getCurrencySymbol(selectedChain)}
                        </span>
                      </div>
                      <p className="text-xs text-gray-600">
                        ≈ ${getUSDValue(gasEstimate, selectedChain)} / ₹{getINRValue(gasEstimate, selectedChain)}
                      </p>
                    </div>
                  )}

                  {/* Total */}
                  {amount && parseFloat(amount) > 0 && (
                    <div className="border-t pt-4">
                      <div className="flex justify-between items-center">
                        <span className="text-lg font-medium text-gray-700">Total Amount</span>
                        <div className="text-right">
                          <p className="text-2xl font-bold text-gray-900">
                            {(parseFloat(amount) + parseFloat(gasEstimate)).toFixed(6)} {getCurrencySymbol(selectedChain)}
                          </p>
                          <p className="text-sm text-gray-500">
                            ≈ ${getUSDValue((parseFloat(amount) + parseFloat(gasEstimate)).toString(), selectedChain)}
                          </p>
                        </div>
                      </div>
                    </div>
                  )}

                  {/* Send Button */}
                  <button
                    onClick={handleTransfer}
                    disabled={isProcessing || !recipientAddress || !amount}
                    className="w-full btn btn-primary py-4 text-lg flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    {isProcessing ? (
                      <>
                        <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white"></div>
                        Processing...
                      </>
                    ) : (
                      <>
                        Send Funds
                        <ArrowRight className="w-5 h-5" />
                      </>
                    )}
                  </button>
                </div>
              )}
            </GlassCard>
          </motion.div>

          {/* Receive Section */}
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.2 }}
          >
            <GlassCard variant="purple" className="p-8">
              <div className="flex items-center gap-3 mb-6">
                <div className="p-3 rounded-full bg-purple-500/10">
                  <Wallet className="w-6 h-6 text-purple-600" />
                </div>
                <h2 className="text-2xl font-bold text-gray-900">Receive Funds</h2>
              </div>

              {!currentConnection ? (
                <div className="text-center py-8">
                  <AlertCircle className="w-12 h-12 text-yellow-500 mx-auto mb-4" />
                  <p className="text-gray-600 mb-4">Please connect your wallet first</p>
                  <button
                    onClick={() => router.push('/multi-chain')}
                    className="btn btn-primary"
                  >
                    Connect Wallet
                  </button>
                </div>
              ) : (
                <div className="space-y-6">
                  <p className="text-gray-600">
                    Share your wallet address to receive {getCurrencySymbol(selectedChain)} on the {selectedChain} network
                  </p>

                  {/* Chain Selection */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Select Network
                    </label>
                    <select
                      value={selectedChain}
                      onChange={(e) => setSelectedChain(e.target.value)}
                      className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-purple-500 bg-white/80"
                    >
                      {connections.map((conn) => (
                        <option key={conn.chain} value={conn.chain}>
                          {conn.chain.charAt(0).toUpperCase() + conn.chain.slice(1)} ({getCurrencySymbol(conn.chain)})
                        </option>
                      ))}
                    </select>
                  </div>

                  {/* Address Display */}
                  <div className="bg-gradient-to-r from-purple-500/10 to-pink-500/10 rounded-lg p-6">
                    <p className="text-sm font-medium text-gray-700 mb-3">Your Wallet Address</p>
                    <div className="bg-white/80 rounded-lg p-4 break-all font-mono text-sm mb-4">
                      {currentConnection.address}
                    </div>
                    <button
                      onClick={copyAddress}
                      className="w-full btn bg-gradient-to-r from-purple-600 to-pink-600 text-white flex items-center justify-center gap-2"
                    >
                      {copied ? (
                        <>
                          <CheckCircle2 className="w-5 h-5" />
                          Copied!
                        </>
                      ) : (
                        <>
                          <Copy className="w-5 h-5" />
                          Copy Address
                        </>
                      )}
                    </button>
                  </div>

                  {/* QR Code Placeholder */}
                  <div className="bg-white/80 rounded-lg p-6 text-center">
                    <div className="w-48 h-48 mx-auto bg-gradient-to-br from-gray-100 to-gray-200 rounded-lg flex items-center justify-center mb-4">
                      <div className="text-gray-400">
                        <Wallet className="w-16 h-16 mx-auto mb-2" />
                        <p className="text-sm">QR Code</p>
                      </div>
                    </div>
                    <p className="text-sm text-gray-600">
                      Scan this QR code to send funds to this address
                    </p>
                  </div>

                  {/* Warning */}
                  <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4 flex gap-3">
                    <AlertCircle className="w-5 h-5 text-yellow-600 flex-shrink-0 mt-0.5" />
                    <div className="text-sm text-gray-700">
                      <p className="font-medium mb-1">Important</p>
                      <p>Only send {getCurrencySymbol(selectedChain)} to this address on the {selectedChain} network. Sending other tokens may result in permanent loss.</p>
                    </div>
                  </div>
                </div>
              )}
            </GlassCard>
          </motion.div>
        </div>
      </div>

      <Footer />
    </div>
  );
}
