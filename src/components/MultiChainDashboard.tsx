'use client';

import { useState, useEffect } from 'react';
import { useMultiChainWallet } from '@/hooks/useMultiChainWallet';
import { toast } from 'sonner';
import { Wallet, RefreshCw, Send, Calendar, TrendingUp, Zap, Copy, ExternalLink, ChevronRight } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

export function MultiChainDashboard() {
  const {
    connections,
    activeChain,
    isConnecting,
    connectEthereum,
    connectAlgorand,
    connectSolana,
    disconnect,
    switchChain,
    refreshBalances,
    getBalance,
    isConnected,
  } = useMultiChainWallet();

  const [balances, setBalances] = useState<Record<string, string>>({});
  const [isRefreshing, setIsRefreshing] = useState(false);

  useEffect(() => {
    loadBalances();
  }, [connections]);

  const loadBalances = async () => {
    setIsRefreshing(true);
    const newBalances: Record<string, string> = {};
    
    for (const conn of connections) {
      const balance = await getBalance(conn.chain);
      if (balance) {
        newBalances[conn.chain] = balance;
      }
    }
    
    setBalances(newBalances);
    setIsRefreshing(false);
  };

  const handleRefresh = async () => {
    await refreshBalances();
    await loadBalances();
    toast.success('Balances refreshed');
  };

  const copyAddress = (address: string) => {
    navigator.clipboard.writeText(address);
    toast.success('Address copied to clipboard');
  };

  const chainConfig = {
    ethereum: {
      name: 'Ethereum',
      icon: '⟠',
      color: 'from-blue-500 to-indigo-600',
      bgGradient: 'from-blue-50 to-indigo-50',
      currency: 'ETH',
      wallets: [
        { name: 'MetaMask', icon: '🦊', action: () => connectEthereum('metamask') },
        { name: 'Coinbase', icon: '🔵', action: () => connectEthereum('coinbase') },
        { name: 'WalletConnect', icon: '🔗', action: () => connectEthereum('walletconnect') },
      ]
    },
    algorand: {
      name: 'Algorand',
      icon: '◆',
      color: 'from-black to-gray-800',
      bgGradient: 'from-gray-50 to-slate-50',
      currency: 'ALGO',
      wallets: [
        { name: 'Pera Wallet', icon: '👛', action: connectAlgorand },
      ]
    },
    solana: {
      name: 'Solana',
      icon: '◎',
      color: 'from-purple-500 to-pink-600',
      bgGradient: 'from-purple-50 to-pink-50',
      currency: 'SOL',
      wallets: [
        { name: 'Phantom', icon: '👻', action: () => connectSolana('phantom') },
      ]
    },
  };

  return (
    <div className="w-full max-w-7xl mx-auto space-y-8">
      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="glass-card p-8"
      >
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-4xl font-bold bg-gradient-to-b from-black to-[#001E80] bg-clip-text text-transparent mb-2">
              Multi-Chain Wallet
            </h2>
            <p className="text-[#010D3E]/70">
              Connect and manage wallets across multiple blockchains
            </p>
          </div>
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={handleRefresh}
            disabled={isRefreshing}
            className="flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-[#183EC2] to-[#001E80] text-white rounded-xl font-medium hover:shadow-lg transition-all disabled:opacity-50"
          >
            <RefreshCw className={`w-5 h-5 ${isRefreshing ? 'animate-spin' : ''}`} />
            Refresh
          </motion.button>
        </div>
      </motion.div>

      {/* Wallet Cards Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {Object.entries(chainConfig).map(([chainKey, config], index) => {
          const chain = chainKey as 'ethereum' | 'algorand' | 'solana';
          const connection = connections.find(c => c.chain === chain);
          const isActive = activeChain === chain;

          return (
            <motion.div
              key={chain}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
              className={`glass-card-hover overflow-hidden ${isActive ? 'ring-2 ring-[#183EC2]' : ''}`}
            >
              {/* Card Header */}
              <div className={`bg-gradient-to-br ${config.bgGradient} p-6 border-b border-white/50`}>
                <div className="flex items-center justify-between mb-4">
                  <div className="flex items-center gap-3">
                    <div className={`w-12 h-12 rounded-xl bg-gradient-to-br ${config.color} flex items-center justify-center text-2xl text-white shadow-lg`}>
                      {config.icon}
                    </div>
                    <div>
                      <h3 className="text-xl font-bold text-gray-900">{config.name}</h3>
                      {isActive && (
                        <span className="text-xs text-[#183EC2] font-medium">Active Chain</span>
                      )}
                    </div>
                  </div>
                  {connection && (
                    <div className="w-3 h-3 rounded-full bg-green-500 animate-pulse shadow-lg shadow-green-500/50" />
                  )}
                </div>

                {connection && (
                  <div className="space-y-3">
                    <div>
                      <p className="text-xs text-gray-600 mb-1">Address</p>
                      <div className="flex items-center gap-2 bg-white/60 backdrop-blur-sm rounded-lg p-2">
                        <p className="text-xs font-mono text-gray-900 truncate flex-1">
                          {connection.address}
                        </p>
                        <button
                          onClick={() => copyAddress(connection.address)}
                          className="p-1 hover:bg-white/80 rounded transition-colors"
                        >
                          <Copy className="w-3 h-3 text-gray-600" />
                        </button>
                      </div>
                    </div>

                    <div>
                      <p className="text-xs text-gray-600 mb-1">Balance</p>
                      <p className="text-3xl font-bold bg-gradient-to-r from-gray-900 to-gray-700 bg-clip-text text-transparent">
                        {balances[chain] || '0'} {config.currency}
                      </p>
                    </div>
                  </div>
                )}
              </div>

              {/* Card Body */}
              <div className="p-6 space-y-3">
                {connection ? (
                  <>
                    {!isActive && (
                      <motion.button
                        whileHover={{ scale: 1.02 }}
                        whileTap={{ scale: 0.98 }}
                        onClick={() => switchChain(chain)}
                        className="w-full py-3 px-4 bg-gradient-to-r from-[#183EC2] to-[#001E80] text-white rounded-xl font-medium hover:shadow-lg transition-all flex items-center justify-center gap-2"
                      >
                        <Zap className="w-4 h-4" />
                        Set as Active
                      </motion.button>
                    )}
                    <motion.button
                      whileHover={{ scale: 1.02 }}
                      whileTap={{ scale: 0.98 }}
                      onClick={() => disconnect(chain)}
                      className="w-full py-3 px-4 bg-red-50 text-red-600 rounded-xl font-medium hover:bg-red-100 transition-all"
                    >
                      Disconnect
                    </motion.button>
                  </>
                ) : (
                  <div className="space-y-2">
                    {config.wallets.map((wallet) => (
                      <motion.button
                        key={wallet.name}
                        whileHover={{ scale: 1.02, x: 5 }}
                        whileTap={{ scale: 0.98 }}
                        onClick={wallet.action}
                        disabled={isConnecting}
                        className="w-full py-3 px-4 bg-white/60 backdrop-blur-sm hover:bg-white/80 rounded-xl font-medium transition-all flex items-center justify-between group disabled:opacity-50"
                      >
                        <div className="flex items-center gap-3">
                          <span className="text-xl">{wallet.icon}</span>
                          <span className="text-gray-900">{wallet.name}</span>
                        </div>
                        <ChevronRight className="w-5 h-5 text-gray-400 group-hover:text-[#183EC2] transition-colors" />
                      </motion.button>
                    ))}
                  </div>
                )}
              </div>
            </motion.div>
          );
        })}
      </div>

      {/* Features Section */}
      {connections.length > 0 && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
          className="grid grid-cols-1 md:grid-cols-3 gap-6"
        >
          {[
            {
              icon: <Send className="w-6 h-6" />,
              title: 'Send Transactions',
              desc: 'Transfer crypto across multiple chains seamlessly',
              color: 'from-blue-500 to-cyan-500',
            },
            {
              icon: <Calendar className="w-6 h-6" />,
              title: 'Recurring Donations',
              desc: 'Set up automated payments with x402 integration',
              color: 'from-green-500 to-emerald-500',
            },
            {
              icon: <TrendingUp className="w-6 h-6" />,
              title: 'Gasless Transactions',
              desc: 'Use Coinbase SDK for fee-free transactions',
              color: 'from-purple-500 to-pink-500',
            },
          ].map((feature, index) => (
            <motion.div
              key={feature.title}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.5 + index * 0.1 }}
              whileHover={{ scale: 1.03, y: -5 }}
              className="glass-card p-6 group cursor-pointer"
            >
              <div className={`w-14 h-14 rounded-2xl bg-gradient-to-br ${feature.color} flex items-center justify-center text-white mb-4 group-hover:scale-110 transition-transform duration-300 shadow-lg`}>
                {feature.icon}
              </div>
              <h4 className="font-bold text-lg mb-2 bg-gradient-to-b from-black to-[#001E80] bg-clip-text text-transparent">
                {feature.title}
              </h4>
              <p className="text-sm text-[#010D3E]/70 leading-relaxed">
                {feature.desc}
              </p>
            </motion.div>
          ))}
        </motion.div>
      )}

      {/* Empty State */}
      {connections.length === 0 && (
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          className="glass-card p-12 text-center"
        >
          <div className="w-20 h-20 rounded-full bg-gradient-to-br from-[#183EC2] to-[#001E80] flex items-center justify-center text-4xl mx-auto mb-6">
            <Wallet className="w-10 h-10 text-white" />
          </div>
          <h3 className="text-2xl font-bold mb-3 bg-gradient-to-b from-black to-[#001E80] bg-clip-text text-transparent">
            No Wallets Connected
          </h3>
          <p className="text-[#010D3E]/70 max-w-md mx-auto">
            Connect your first wallet to start managing your multi-chain assets
          </p>
        </motion.div>
      )}
    </div>
  );
}
