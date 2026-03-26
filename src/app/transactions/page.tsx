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
  ArrowUpRight, 
  ArrowDownLeft, 
  Clock, 
  CheckCircle2, 
  XCircle, 
  ExternalLink,
  Filter,
  Search
} from 'lucide-react';

interface Transaction {
  id: string;
  type: 'send' | 'receive' | 'donation';
  status: 'completed' | 'pending' | 'failed';
  amount: string;
  currency: string;
  chain: string;
  from: string;
  to: string;
  hash: string;
  timestamp: Date;
  gasUsed?: string;
  message?: string;
}

export default function TransactionsPage() {
  const { user } = useAuth();
  const { connections } = useMultiChainWallet();
  const router = useRouter();
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [filteredTransactions, setFilteredTransactions] = useState<Transaction[]>([]);
  const [filterStatus, setFilterStatus] = useState<'all' | 'completed' | 'pending' | 'failed'>('all');
  const [filterType, setFilterType] = useState<'all' | 'send' | 'receive' | 'donation'>('all');
  const [searchQuery, setSearchQuery] = useState('');

  useEffect(() => {
    if (!user) {
      router.push('/login');
      return;
    }
    loadTransactions();
  }, [user, connections]);

  useEffect(() => {
    applyFilters();
  }, [transactions, filterStatus, filterType, searchQuery]);

  const loadTransactions = () => {
    // Mock transaction data - in production, fetch from blockchain/backend
    const mockTransactions: Transaction[] = [
      {
        id: '1',
        type: 'donation',
        status: 'completed',
        amount: '0.5',
        currency: 'ETH',
        chain: 'Ethereum',
        from: connections[0]?.address || '0x1234...5678',
        to: '0x8765...4321',
        hash: '0xabc123...def456',
        timestamp: new Date(Date.now() - 2 * 60 * 60 * 1000),
        gasUsed: '0.002',
        message: 'Donation to Education Fund'
      },
      {
        id: '2',
        type: 'send',
        status: 'pending',
        amount: '1.2',
        currency: 'ETH',
        chain: 'Ethereum',
        from: connections[0]?.address || '0x1234...5678',
        to: '0x9999...1111',
        hash: '0xdef789...ghi012',
        timestamp: new Date(Date.now() - 30 * 60 * 1000),
        gasUsed: '0.003'
      },
      {
        id: '3',
        type: 'receive',
        status: 'completed',
        amount: '2.0',
        currency: 'ETH',
        chain: 'Ethereum',
        from: '0x5555...6666',
        to: connections[0]?.address || '0x1234...5678',
        hash: '0xghi345...jkl678',
        timestamp: new Date(Date.now() - 24 * 60 * 60 * 1000),
        message: 'Refund from campaign'
      },
      {
        id: '4',
        type: 'donation',
        status: 'failed',
        amount: '0.8',
        currency: 'ETH',
        chain: 'Ethereum',
        from: connections[0]?.address || '0x1234...5678',
        to: '0x7777...8888',
        hash: '0xjkl901...mno234',
        timestamp: new Date(Date.now() - 48 * 60 * 60 * 1000),
        gasUsed: '0.001',
        message: 'Insufficient funds'
      },
      {
        id: '5',
        type: 'send',
        status: 'completed',
        amount: '10.5',
        currency: 'ALGO',
        chain: 'Algorand',
        from: connections[1]?.address || 'ALGO1234...5678',
        to: 'ALGO8765...4321',
        hash: 'TXID123...456',
        timestamp: new Date(Date.now() - 72 * 60 * 60 * 1000),
        gasUsed: '0.001'
      }
    ];

    setTransactions(mockTransactions);
  };

  const applyFilters = () => {
    let filtered = [...transactions];

    if (filterStatus !== 'all') {
      filtered = filtered.filter(tx => tx.status === filterStatus);
    }

    if (filterType !== 'all') {
      filtered = filtered.filter(tx => tx.type === filterType);
    }

    if (searchQuery) {
      filtered = filtered.filter(tx => 
        tx.hash.toLowerCase().includes(searchQuery.toLowerCase()) ||
        tx.to.toLowerCase().includes(searchQuery.toLowerCase()) ||
        tx.from.toLowerCase().includes(searchQuery.toLowerCase()) ||
        tx.message?.toLowerCase().includes(searchQuery.toLowerCase())
      );
    }

    setFilteredTransactions(filtered);
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'completed':
        return <CheckCircle2 className="w-5 h-5 text-green-600" />;
      case 'pending':
        return <Clock className="w-5 h-5 text-yellow-600" />;
      case 'failed':
        return <XCircle className="w-5 h-5 text-red-600" />;
      default:
        return null;
    }
  };

  const getTypeIcon = (type: string) => {
    switch (type) {
      case 'send':
      case 'donation':
        return <ArrowUpRight className="w-5 h-5 text-red-500" />;
      case 'receive':
        return <ArrowDownLeft className="w-5 h-5 text-green-500" />;
      default:
        return null;
    }
  };

  const formatTimestamp = (date: Date) => {
    const now = new Date();
    const diff = now.getTime() - date.getTime();
    const hours = Math.floor(diff / (1000 * 60 * 60));
    
    if (hours < 1) {
      const minutes = Math.floor(diff / (1000 * 60));
      return `${minutes} minutes ago`;
    } else if (hours < 24) {
      return `${hours} hours ago`;
    } else {
      const days = Math.floor(hours / 24);
      return `${days} days ago`;
    }
  };

  const getExplorerUrl = (chain: string, hash: string) => {
    const explorers: Record<string, string> = {
      'Ethereum': `https://sepolia.etherscan.io/tx/${hash}`,
      'Algorand': `https://testnet.algoexplorer.io/tx/${hash}`,
      'Solana': `https://explorer.solana.com/tx/${hash}?cluster=devnet`
    };
    return explorers[chain] || '#';
  };

  if (!user) return null;

  return (
    <div className="min-h-screen bg-gradient-to-b from-[#EAEEFE] to-white">
      <Header />
      
      <div className="container mx-auto px-4 py-12">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-8"
        >
          <h1 className="text-5xl font-inter font-bold text-gray-900 mb-4 tracking-tight">
            Transaction History
          </h1>
          <p className="text-xl text-gray-600">
            Monitor all your blockchain transactions across multiple chains
          </p>
        </motion.div>

        {/* Filters */}
        <GlassCard variant="blue" className="p-6 mb-8">
          <div className="flex flex-col md:flex-row gap-4">
            {/* Search */}
            <div className="flex-1">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                <input
                  type="text"
                  placeholder="Search by hash, address, or message..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full pl-10 pr-4 py-2 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-[#183EC2] bg-white/80"
                />
              </div>
            </div>

            {/* Status Filter */}
            <div className="flex gap-2">
              <Filter className="text-gray-600 w-5 h-5 self-center" />
              <select
                value={filterStatus}
                onChange={(e) => setFilterStatus(e.target.value as any)}
                className="px-4 py-2 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-[#183EC2] bg-white/80"
              >
                <option value="all">All Status</option>
                <option value="completed">Completed</option>
                <option value="pending">Pending</option>
                <option value="failed">Failed</option>
              </select>

              {/* Type Filter */}
              <select
                value={filterType}
                onChange={(e) => setFilterType(e.target.value as any)}
                className="px-4 py-2 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-[#183EC2] bg-white/80"
              >
                <option value="all">All Types</option>
                <option value="send">Sent</option>
                <option value="receive">Received</option>
                <option value="donation">Donations</option>
              </select>
            </div>
          </div>
        </GlassCard>

        {/* Transactions List */}
        <div className="space-y-4">
          {filteredTransactions.length === 0 ? (
            <GlassCard variant="default" className="p-12 text-center">
              <p className="text-gray-500 text-lg">No transactions found</p>
            </GlassCard>
          ) : (
            filteredTransactions.map((tx, index) => (
              <motion.div
                key={tx.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 }}
              >
                <GlassCard variant="hover" className="p-6">
                  <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                    {/* Left Section */}
                    <div className="flex items-start gap-4 flex-1">
                      {/* Type Icon */}
                      <div className="p-3 rounded-full bg-gray-100">
                        {getTypeIcon(tx.type)}
                      </div>

                      {/* Transaction Details */}
                      <div className="flex-1">
                        <div className="flex items-center gap-2 mb-1">
                          <h3 className="font-semibold text-lg capitalize">
                            {tx.type === 'donation' ? 'Donation' : tx.type}
                          </h3>
                          {getStatusIcon(tx.status)}
                          <span className={`text-sm px-2 py-1 rounded-full ${
                            tx.status === 'completed' ? 'bg-green-100 text-green-700' :
                            tx.status === 'pending' ? 'bg-yellow-100 text-yellow-700' :
                            'bg-red-100 text-red-700'
                          }`}>
                            {tx.status}
                          </span>
                        </div>
                        
                        <p className="text-sm text-gray-600 mb-2">
                          {tx.message || `${tx.type === 'receive' ? 'From' : 'To'}: ${tx.type === 'receive' ? tx.from : tx.to}`}
                        </p>

                        <div className="flex flex-wrap gap-4 text-sm text-gray-500">
                          <span className="flex items-center gap-1">
                            <span className="font-medium">Chain:</span> {tx.chain}
                          </span>
                          <span className="flex items-center gap-1">
                            <span className="font-medium">Hash:</span> 
                            <code className="bg-gray-100 px-2 py-0.5 rounded">{tx.hash.slice(0, 10)}...{tx.hash.slice(-8)}</code>
                          </span>
                          {tx.gasUsed && (
                            <span className="flex items-center gap-1">
                              <span className="font-medium">Gas:</span> {tx.gasUsed} {tx.currency}
                            </span>
                          )}
                        </div>
                      </div>
                    </div>

                    {/* Right Section */}
                    <div className="flex flex-col items-end gap-2">
                      <div className="text-right">
                        <p className={`text-2xl font-bold ${
                          tx.type === 'receive' ? 'text-green-600' : 'text-gray-900'
                        }`}>
                          {tx.type === 'receive' ? '+' : '-'}{tx.amount} {tx.currency}
                        </p>
                        <p className="text-sm text-gray-500">{formatTimestamp(tx.timestamp)}</p>
                      </div>

                      <a
                        href={getExplorerUrl(tx.chain, tx.hash)}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="flex items-center gap-1 text-sm text-[#183EC2] hover:underline"
                      >
                        View on Explorer
                        <ExternalLink className="w-4 h-4" />
                      </a>
                    </div>
                  </div>
                </GlassCard>
              </motion.div>
            ))
          )}
        </div>
      </div>

      <Footer />
    </div>
  );
}
