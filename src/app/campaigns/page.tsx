"use client";

import { useState, useEffect } from 'react';
import { useAuth } from '@/hooks/useAuth';
import { useRouter } from 'next/navigation';
import { Header } from '@/sections/Header';
import { Footer } from '@/sections/Footer';
import { GlassCard } from '@/components/GlassCard';
import { motion } from 'framer-motion';
import { 
  Plus, 
  Eye, 
  TrendingUp, 
  Users, 
  Target,
  Calendar,
  ArrowRight
} from 'lucide-react';
import Link from 'next/link';

export default function CampaignsPage() {
  const { user } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (!user) {
      router.push('/login');
    }
  }, [user]);

  if (!user) return null;

  return (
    <div className="min-h-screen bg-gradient-to-b from-[#EAEEFE] to-white">
      <Header />
      
      <div className="container mx-auto px-4 py-12">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-12 text-center"
        >
          <h1 className="text-5xl font-inter font-bold text-gray-900 mb-4 tracking-tight">
            Fundraising Campaigns
          </h1>
          <p className="text-xl text-gray-600 max-w-2xl mx-auto">
            Create transparent fundraising campaigns or support existing ones with blockchain-verified donations
          </p>
        </motion.div>

        {/* Action Cards */}
        <div className="max-w-5xl mx-auto grid md:grid-cols-2 gap-8 mb-16">
          {/* Create Campaign Card */}
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.1 }}
          >
            <Link href="/campaigns/create">
              <GlassCard variant="blue" className="p-8 h-full cursor-pointer group">
                <div className="flex flex-col h-full">
                  <div className="p-4 rounded-full bg-[#183EC2]/10 w-fit mb-6 group-hover:bg-[#183EC2]/20 transition-colors">
                    <Plus className="w-8 h-8 text-[#183EC2]" />
                  </div>
                  
                  <h2 className="text-3xl font-bold text-gray-900 mb-4">
                    Generate New Campaign
                  </h2>
                  
                  <p className="text-gray-600 mb-6 flex-grow">
                    Start a new fundraising campaign with transparent goals, proof-based verification, and blockchain tracking
                  </p>

                  <div className="space-y-3 mb-6">
                    <div className="flex items-center gap-3 text-sm text-gray-700">
                      <div className="w-2 h-2 rounded-full bg-[#183EC2]"></div>
                      <span>Set fundraising goals in multiple currencies</span>
                    </div>
                    <div className="flex items-center gap-3 text-sm text-gray-700">
                      <div className="w-2 h-2 rounded-full bg-[#183EC2]"></div>
                      <span>Upload proof documents for transparency</span>
                    </div>
                    <div className="flex items-center gap-3 text-sm text-gray-700">
                      <div className="w-2 h-2 rounded-full bg-[#183EC2]"></div>
                      <span>Track donations on blockchain</span>
                    </div>
                  </div>

                  <div className="flex items-center gap-2 text-[#183EC2] font-semibold group-hover:gap-3 transition-all">
                    Create Campaign
                    <ArrowRight className="w-5 h-5" />
                  </div>
                </div>
              </GlassCard>
            </Link>
          </motion.div>

          {/* View Campaigns Card */}
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.2 }}
          >
            <Link href="/campaigns/view">
              <GlassCard variant="purple" className="p-8 h-full cursor-pointer group">
                <div className="flex flex-col h-full">
                  <div className="p-4 rounded-full bg-purple-500/10 w-fit mb-6 group-hover:bg-purple-500/20 transition-colors">
                    <Eye className="w-8 h-8 text-purple-600" />
                  </div>
                  
                  <h2 className="text-3xl font-bold text-gray-900 mb-4">
                    View Existing Campaigns
                  </h2>
                  
                  <p className="text-gray-600 mb-6 flex-grow">
                    Browse active fundraising campaigns and contribute with Ethereum to causes you care about
                  </p>

                  <div className="space-y-3 mb-6">
                    <div className="flex items-center gap-3 text-sm text-gray-700">
                      <div className="w-2 h-2 rounded-full bg-purple-600"></div>
                      <span>Explore verified campaigns</span>
                    </div>
                    <div className="flex items-center gap-3 text-sm text-gray-700">
                      <div className="w-2 h-2 rounded-full bg-purple-600"></div>
                      <span>Donate with Ethereum (ETH)</span>
                    </div>
                    <div className="flex items-center gap-3 text-sm text-gray-700">
                      <div className="w-2 h-2 rounded-full bg-purple-600"></div>
                      <span>View campaign progress and proof</span>
                    </div>
                  </div>

                  <div className="flex items-center gap-2 text-purple-600 font-semibold group-hover:gap-3 transition-all">
                    Browse Campaigns
                    <ArrowRight className="w-5 h-5" />
                  </div>
                </div>
              </GlassCard>
            </Link>
          </motion.div>
        </div>

        {/* Stats Section */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="max-w-5xl mx-auto"
        >
          <GlassCard variant="gradient" className="p-8">
            <h3 className="text-2xl font-bold text-gray-900 mb-6 text-center">
              Platform Impact
            </h3>
            
            <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
              <div className="text-center">
                <div className="p-3 rounded-full bg-[#183EC2]/10 w-fit mx-auto mb-3">
                  <TrendingUp className="w-6 h-6 text-[#183EC2]" />
                </div>
                <p className="text-3xl font-bold text-gray-900 mb-1">127</p>
                <p className="text-sm text-gray-600">Active Campaigns</p>
              </div>

              <div className="text-center">
                <div className="p-3 rounded-full bg-green-500/10 w-fit mx-auto mb-3">
                  <Target className="w-6 h-6 text-green-600" />
                </div>
                <p className="text-3xl font-bold text-gray-900 mb-1">$2.4M</p>
                <p className="text-sm text-gray-600">Funds Raised</p>
              </div>

              <div className="text-center">
                <div className="p-3 rounded-full bg-purple-500/10 w-fit mx-auto mb-3">
                  <Users className="w-6 h-6 text-purple-600" />
                </div>
                <p className="text-3xl font-bold text-gray-900 mb-1">8,542</p>
                <p className="text-sm text-gray-600">Contributors</p>
              </div>

              <div className="text-center">
                <div className="p-3 rounded-full bg-orange-500/10 w-fit mx-auto mb-3">
                  <Calendar className="w-6 h-6 text-orange-600" />
                </div>
                <p className="text-3xl font-bold text-gray-900 mb-1">89</p>
                <p className="text-sm text-gray-600">Completed</p>
              </div>
            </div>
          </GlassCard>
        </motion.div>
      </div>

      <Footer />
    </div>
  );
}
