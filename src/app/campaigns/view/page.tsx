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
  Heart, 
  TrendingUp, 
  Users, 
  Calendar,
  Target,
  FileText,
  ArrowLeft,
  AlertCircle,
  CheckCircle2
} from 'lucide-react';
import { toast } from 'sonner';
import Link from 'next/link';

interface Campaign {
  id: string;
  title: string;
  description: string;
  reason: string;
  category: string;
  targetAmount: number;
  raisedAmount: number;
  contributors: number;
  daysLeft: number;
  creator: string;
  documents: string[];
  status: 'active' | 'completed' | 'pending';
}

export default function ViewCampaignsPage() {
  const { user } = useAuth();
  const { connections, isConnected } = useMultiChainWallet();
  const router = useRouter();
  
  const [campaigns, setCampaigns] = useState<Campaign[]>([]);
  const [selectedCampaign, setSelectedCampaign] = useState<Campaign | null>(null);
  const [donationAmount, setDonationAmount] = useState('');
  const [showDonateModal, setShowDonateModal] = useState(false);
  const [isProcessing, setIsProcessing] = useState(false);
  const [filterCategory, setFilterCategory] = useState<string>('all');

  useEffect(() => {
    if (!user) {
      router.push('/login');
      return;
    }
    loadCampaigns();
  }, [user]);

  const loadCampaigns = () => {
    // Mock campaign data
    const mockCampaigns: Campaign[] = [
      {
        id: '1',
        title: 'Education for Underprivileged Children',
        description: 'Providing quality education and learning materials to children in rural areas who lack access to basic educational resources.',
        reason: 'Many children in rural communities cannot afford school supplies, books, and proper learning facilities. This campaign aims to bridge that gap.',
        category: 'education',
        targetAmount: 50000,
        raisedAmount: 32500,
        contributors: 145,
        daysLeft: 23,
        creator: '0x1234...5678',
        documents: ['registration.pdf', 'project-proposal.pdf'],
        status: 'active'
      },
      {
        id: '2',
        title: 'Medical Equipment for Rural Clinic',
        description: 'Purchasing essential medical equipment for a clinic serving 5000+ people in a remote village.',
        reason: 'The clinic lacks basic diagnostic equipment, making it difficult to provide proper healthcare to the community.',
        category: 'healthcare',
        targetAmount: 75000,
        raisedAmount: 58000,
        contributors: 203,
        daysLeft: 15,
        creator: '0x8765...4321',
        documents: ['clinic-license.pdf', 'equipment-list.pdf'],
        status: 'active'
      },
      {
        id: '3',
        title: 'Clean Water Initiative',
        description: 'Installing water purification systems in villages affected by water contamination.',
        reason: 'Contaminated water sources are causing health issues. We need funds to install filtration systems.',
        category: 'environment',
        targetAmount: 100000,
        raisedAmount: 95000,
        contributors: 412,
        daysLeft: 5,
        creator: '0x9999...1111',
        documents: ['ngo-registration.pdf', 'water-test-reports.pdf'],
        status: 'active'
      },
      {
        id: '4',
        title: 'Food Distribution Program',
        description: 'Monthly food distribution to 200 families facing food insecurity.',
        reason: 'Rising food costs have made it difficult for low-income families to afford nutritious meals.',
        category: 'food',
        targetAmount: 30000,
        raisedAmount: 18500,
        contributors: 89,
        daysLeft: 45,
        creator: '0x5555...6666',
        documents: ['charity-certificate.pdf', 'beneficiary-list.pdf'],
        status: 'active'
      },
      {
        id: '5',
        title: 'Disaster Relief Fund',
        description: 'Emergency relief for families affected by recent floods.',
        reason: 'Immediate assistance needed for shelter, food, and medical supplies for flood victims.',
        category: 'disaster',
        targetAmount: 150000,
        raisedAmount: 150000,
        contributors: 678,
        daysLeft: 0,
        creator: '0x7777...8888',
        documents: ['disaster-report.pdf', 'relief-plan.pdf'],
        status: 'completed'
      }
    ];

    setCampaigns(mockCampaigns);
  };

  const filteredCampaigns = filterCategory === 'all' 
    ? campaigns 
    : campaigns.filter(c => c.category === filterCategory);

  const getProgressPercentage = (raised: number, target: number) => {
    return Math.min((raised / target) * 100, 100);
  };

  const getAmountInETH = (usdAmount: number) => {
    const ethRate = 2000; // 1 ETH = $2000
    return (usdAmount / ethRate).toFixed(6);
  };

  const getCategoryColor = (category: string) => {
    const colors: Record<string, string> = {
      education: 'bg-blue-100 text-blue-700',
      healthcare: 'bg-green-100 text-green-700',
      environment: 'bg-emerald-100 text-emerald-700',
      food: 'bg-orange-100 text-orange-700',
      disaster: 'bg-red-100 text-red-700',
      other: 'bg-gray-100 text-gray-700'
    };
    return colors[category] || colors.other;
  };

  const handleDonate = (campaign: Campaign) => {
    if (!isConnected('ethereum')) {
      toast.error('Please connect your Ethereum wallet first');
      router.push('/multi-chain');
      return;
    }

    setSelectedCampaign(campaign);
    setShowDonateModal(true);
  };

  const processDonation = async () => {
    if (!donationAmount || parseFloat(donationAmount) <= 0) {
      toast.error('Please enter a valid donation amount');
      return;
    }

    setIsProcessing(true);

    // Simulate donation processing
    setTimeout(() => {
      setIsProcessing(false);
      setShowDonateModal(false);
      
      // Always show error since wallet is empty
      toast.error('Transaction Failed: No coins to send, wallet empty', {
        description: 'Your wallet does not have sufficient ETH to complete this donation.',
        duration: 5000,
      });
      
      setDonationAmount('');
      setSelectedCampaign(null);
    }, 2000);
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
          <Link href="/campaigns" className="inline-flex items-center gap-2 text-[#183EC2] hover:underline mb-4">
            <ArrowLeft className="w-4 h-4" />
            Back to Campaigns
          </Link>
          <h1 className="text-5xl font-inter font-bold text-gray-900 mb-4 tracking-tight">
            Active Campaigns
          </h1>
          <p className="text-xl text-gray-600">
            Support verified fundraising campaigns with Ethereum donations
          </p>
        </motion.div>

        {/* Filter */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="mb-8"
        >
          <GlassCard variant="blue" className="p-6">
            <div className="flex flex-wrap gap-3">
              <button
                onClick={() => setFilterCategory('all')}
                className={`px-4 py-2 rounded-lg font-medium transition-all ${
                  filterCategory === 'all'
                    ? 'bg-[#183EC2] text-white'
                    : 'bg-white/80 text-gray-700 hover:bg-white'
                }`}
              >
                All Categories
              </button>
              {['education', 'healthcare', 'environment', 'food', 'disaster'].map((category) => (
                <button
                  key={category}
                  onClick={() => setFilterCategory(category)}
                  className={`px-4 py-2 rounded-lg font-medium capitalize transition-all ${
                    filterCategory === category
                      ? 'bg-[#183EC2] text-white'
                      : 'bg-white/80 text-gray-700 hover:bg-white'
                  }`}
                >
                  {category}
                </button>
              ))}
            </div>
          </GlassCard>
        </motion.div>

        {/* Campaigns Grid */}
        <div className="grid md:grid-cols-2 gap-8">
          {filteredCampaigns.map((campaign, index) => (
            <motion.div
              key={campaign.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 * (index + 2) }}
            >
              <GlassCard variant="hover" className="p-8 h-full flex flex-col">
                {/* Header */}
                <div className="flex items-start justify-between mb-4">
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-2">
                      <span className={`text-xs px-3 py-1 rounded-full font-medium ${getCategoryColor(campaign.category)}`}>
                        {campaign.category}
                      </span>
                      {campaign.status === 'completed' && (
                        <span className="text-xs px-3 py-1 rounded-full font-medium bg-green-100 text-green-700 flex items-center gap-1">
                          <CheckCircle2 className="w-3 h-3" />
                          Completed
                        </span>
                      )}
                    </div>
                    <h3 className="text-2xl font-bold text-gray-900 mb-2">
                      {campaign.title}
                    </h3>
                  </div>
                </div>

                {/* Description */}
                <p className="text-gray-600 mb-4 flex-grow">
                  {campaign.description}
                </p>

                {/* Reason */}
                <div className="bg-blue-50 rounded-lg p-4 mb-4">
                  <p className="text-sm font-medium text-gray-700 mb-1">Why we need your support:</p>
                  <p className="text-sm text-gray-600">{campaign.reason}</p>
                </div>

                {/* Progress Bar */}
                <div className="mb-4">
                  <div className="flex justify-between items-center mb-2">
                    <span className="text-sm font-medium text-gray-700">Progress</span>
                    <span className="text-sm font-bold text-[#183EC2]">
                      {getProgressPercentage(campaign.raisedAmount, campaign.targetAmount).toFixed(1)}%
                    </span>
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-3 overflow-hidden">
                    <div
                      className="bg-gradient-to-r from-[#183EC2] to-purple-600 h-full rounded-full transition-all duration-500"
                      style={{ width: `${getProgressPercentage(campaign.raisedAmount, campaign.targetAmount)}%` }}
                    />
                  </div>
                </div>

                {/* Stats */}
                <div className="grid grid-cols-3 gap-4 mb-6">
                  <div className="text-center">
                    <div className="flex items-center justify-center gap-1 mb-1">
                      <Target className="w-4 h-4 text-gray-500" />
                    </div>
                    <p className="text-lg font-bold text-gray-900">${campaign.targetAmount.toLocaleString()}</p>
                    <p className="text-xs text-gray-500">Goal</p>
                  </div>
                  <div className="text-center">
                    <div className="flex items-center justify-center gap-1 mb-1">
                      <TrendingUp className="w-4 h-4 text-green-500" />
                    </div>
                    <p className="text-lg font-bold text-gray-900">${campaign.raisedAmount.toLocaleString()}</p>
                    <p className="text-xs text-gray-500">Raised</p>
                  </div>
                  <div className="text-center">
                    <div className="flex items-center justify-center gap-1 mb-1">
                      <Users className="w-4 h-4 text-purple-500" />
                    </div>
                    <p className="text-lg font-bold text-gray-900">{campaign.contributors}</p>
                    <p className="text-xs text-gray-500">Donors</p>
                  </div>
                </div>

                {/* Days Left */}
                {campaign.status === 'active' && (
                  <div className="flex items-center gap-2 mb-4 text-sm text-gray-600">
                    <Calendar className="w-4 h-4" />
                    <span>{campaign.daysLeft} days left</span>
                  </div>
                )}

                {/* Documents */}
                <div className="mb-6">
                  <p className="text-sm font-medium text-gray-700 mb-2 flex items-center gap-2">
                    <FileText className="w-4 h-4" />
                    Proof Documents:
                  </p>
                  <div className="flex flex-wrap gap-2">
                    {campaign.documents.map((doc, idx) => (
                      <span key={idx} className="text-xs bg-white/80 px-3 py-1 rounded-full text-gray-600 border border-gray-200">
                        {doc}
                      </span>
                    ))}
                  </div>
                </div>

                {/* Donate Button */}
                <button
                  onClick={() => handleDonate(campaign)}
                  disabled={campaign.status === 'completed'}
                  className={`w-full btn flex items-center justify-center gap-2 py-3 ${
                    campaign.status === 'completed'
                      ? 'bg-gray-300 text-gray-600 cursor-not-allowed'
                      : 'btn-primary'
                  }`}
                >
                  <Heart className="w-5 h-5" />
                  {campaign.status === 'completed' ? 'Campaign Completed' : 'Donate with ETH'}
                </button>
              </GlassCard>
            </motion.div>
          ))}
        </div>
      </div>

      {/* Donation Modal */}
      {showDonateModal && selectedCampaign && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            className="max-w-md w-full"
          >
            <GlassCard variant="blue" className="p-8">
              <h2 className="text-2xl font-bold text-gray-900 mb-4">
                Donate to Campaign
              </h2>
              
              <p className="text-gray-600 mb-6">
                {selectedCampaign.title}
              </p>

              <div className="space-y-4 mb-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Donation Amount (ETH)
                  </label>
                  <input
                    type="number"
                    value={donationAmount}
                    onChange={(e) => setDonationAmount(e.target.value)}
                    placeholder="0.00"
                    step="0.000001"
                    min="0"
                    className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-[#183EC2] bg-white/80"
                  />
                  {donationAmount && parseFloat(donationAmount) > 0 && (
                    <p className="text-sm text-gray-500 mt-1">
                      ≈ ${(parseFloat(donationAmount) * 2000).toFixed(2)} USD
                    </p>
                  )}
                </div>

                <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4 flex gap-3">
                  <AlertCircle className="w-5 h-5 text-yellow-600 flex-shrink-0" />
                  <p className="text-sm text-gray-700">
                    Donations are held in escrow and released when campaign milestones are verified on the blockchain.
                  </p>
                </div>
              </div>

              <div className="flex gap-3">
                <button
                  onClick={() => {
                    setShowDonateModal(false);
                    setDonationAmount('');
                    setSelectedCampaign(null);
                  }}
                  className="flex-1 btn bg-gray-200 text-gray-700 hover:bg-gray-300"
                >
                  Cancel
                </button>
                <button
                  onClick={processDonation}
                  disabled={isProcessing || !donationAmount}
                  className="flex-1 btn btn-primary disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {isProcessing ? (
                    <>
                      <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white mr-2"></div>
                      Processing...
                    </>
                  ) : (
                    'Confirm Donation'
                  )}
                </button>
              </div>
            </GlassCard>
          </motion.div>
        </div>
      )}

      <Footer />
    </div>
  );
}
