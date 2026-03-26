"use client";

import { useEffect, useState } from 'react';
import { useAuth } from '@/hooks/useAuth';
import { useWeb3 } from '@/hooks/useWeb3';
import { useRouter } from 'next/navigation';
import { ThreeBackground } from '../demo/ThreeBackground';
import { motion } from 'framer-motion';

export default function DashboardPage() {
  const { user } = useAuth();
  const { account, connectMetaMask } = useWeb3();
  const router = useRouter();
  
  const [stats, setStats] = useState({
    totalDonations: 12,
    totalAmount: 45000,
    activeCampaigns: 3,
    impactScore: 95,
  });

  const [donationTrend, setDonationTrend] = useState([
    { month: 'Jan', amount: 5000 },
    { month: 'Feb', amount: 8000 },
    { month: 'Mar', amount: 12000 },
    { month: 'Apr', amount: 15000 },
    { month: 'May', amount: 20000 },
    { month: 'Jun', amount: 45000 },
  ]);

  const [categoryDistribution, setCategoryDistribution] = useState([
    { name: 'Education', value: 35, color: '#183EC2' },
    { name: 'Healthcare', value: 30, color: '#4F46E5' },
    { name: 'Food & Shelter', value: 20, color: '#7C3AED' },
    { name: 'Environment', value: 15, color: '#9333EA' },
  ]);

  useEffect(() => {
    if (!user) {
      router.push('/login');
    }
  }, [user, router]);

  if (!user) return null;

  const maxAmount = Math.max(...donationTrend.map(d => d.amount));

  return (
    <div className="relative min-h-screen bg-gradient-to-b from-[#EAEEFE] to-white overflow-hidden">
      <ThreeBackground />
      
      <div className="relative z-10 py-12 px-4">
        <div className="max-w-7xl mx-auto">
          {/* Header */}
          <motion.div 
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            className="mb-12"
          >
            <h1 className="text-5xl font-inter font-bold text-gray-900 mb-4 tracking-tight">
              Dashboard
            </h1>
            <p className="text-xl text-gray-600">Welcome back, {user.email?.split('@')[0]}!</p>
          </motion.div>

          {/* Stats Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-12">
            {[
              { 
                icon: (
                  <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                ),
                label: 'Total Donations',
                value: stats.totalDonations,
                trend: '+12%',
                trendUp: true
              },
              {
                icon: (
                  <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6" />
                  </svg>
                ),
                label: 'Total Amount',
                value: `₹${stats.totalAmount.toLocaleString()}`,
                trend: '+25%',
                trendUp: true
              },
              {
                icon: (
                  <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                ),
                label: 'Active Campaigns',
                value: stats.activeCampaigns,
                trend: '+3',
                trendUp: true
              },
              {
                icon: (
                  <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11.049 2.927c.3-.921 1.603-.921 1.902 0l1.519 4.674a1 1 0 00.95.69h4.915c.969 0 1.371 1.24.588 1.81l-3.976 2.888a1 1 0 00-.363 1.118l1.518 4.674c.3.922-.755 1.688-1.538 1.118l-3.976-2.888a1 1 0 00-1.176 0l-3.976 2.888c-.783.57-1.838-.197-1.538-1.118l1.518-4.674a1 1 0 00-.363-1.118l-3.976-2.888c-.784-.57-.38-1.81.588-1.81h4.914a1 1 0 00.951-.69l1.519-4.674z" />
                  </svg>
                ),
                label: 'Impact Score',
                value: `${stats.impactScore}%`,
                trend: '+5%',
                trendUp: true
              }
            ].map((stat, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 }}
                className="backdrop-blur-2xl bg-white/60 border-2 border-gray-200/60 rounded-3xl p-6 shadow-lg hover:border-[#183EC2]/30 transition-all duration-300 hover:scale-105"
              >
                <div className="flex items-center justify-between mb-4">
                  <div className="w-12 h-12 bg-gradient-to-br from-[#183EC2] to-[#4F46E5] rounded-xl flex items-center justify-center text-white">
                    {stat.icon}
                  </div>
                  <span className={`text-sm font-medium ${stat.trendUp ? 'text-green-600' : 'text-red-600'}`}>
                    {stat.trend}
                  </span>
                </div>
                <p className="text-sm text-gray-500 mb-1 font-medium">{stat.label}</p>
                <p className="text-3xl font-inter font-bold text-gray-900">{stat.value}</p>
              </motion.div>
            ))}
          </div>

          {/* Charts Section */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-12">
            {/* Donation Trend Chart */}
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.4 }}
              className="lg:col-span-2 backdrop-blur-2xl bg-white/60 border-2 border-white/80 rounded-3xl p-8 shadow-lg"
            >
              <h2 className="text-2xl font-inter font-bold text-gray-900 mb-6">Donation Trend</h2>
              <div className="h-64">
                <div className="flex items-end justify-between h-full gap-4">
                  {donationTrend.map((data, index) => {
                    const height = (data.amount / maxAmount) * 100;
                    return (
                      <div key={index} className="flex-1 flex flex-col items-center gap-2">
                        <motion.div
                          initial={{ height: 0 }}
                          animate={{ height: `${height}%` }}
                          transition={{ delay: 0.6 + index * 0.1, duration: 0.5 }}
                          className="w-full bg-gradient-to-t from-[#183EC2] to-[#4F46E5] rounded-t-xl relative group cursor-pointer hover:from-[#4F46E5] hover:to-[#7C3AED] transition-all"
                        >
                          <div className="absolute -top-8 left-1/2 transform -translate-x-1/2 opacity-0 group-hover:opacity-100 transition-opacity bg-gray-900 text-white text-xs px-2 py-1 rounded whitespace-nowrap">
                            ₹{data.amount.toLocaleString()}
                          </div>
                        </motion.div>
                        <span className="text-xs text-gray-600 font-medium">{data.month}</span>
                      </div>
                    );
                  })}
                </div>
              </div>
            </motion.div>

            {/* Category Distribution */}
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.5 }}
              className="backdrop-blur-2xl bg-white/60 border-2 border-white/80 rounded-3xl p-8 shadow-lg"
            >
              <h2 className="text-2xl font-inter font-bold text-gray-900 mb-6">Categories</h2>
              <div className="space-y-4">
                {categoryDistribution.map((category, index) => (
                  <div key={index} className="space-y-2">
                    <div className="flex justify-between items-center">
                      <span className="text-sm font-medium text-gray-700">{category.name}</span>
                      <span className="text-sm font-bold text-gray-900">{category.value}%</span>
                    </div>
                    <div className="h-3 bg-gray-200 rounded-full overflow-hidden">
                      <motion.div
                        initial={{ width: 0 }}
                        animate={{ width: `${category.value}%` }}
                        transition={{ delay: 0.7 + index * 0.1, duration: 0.5 }}
                        className="h-full rounded-full"
                        style={{ backgroundColor: category.color }}
                      />
                    </div>
                  </div>
                ))}
              </div>
            </motion.div>
          </div>

          {/* Main Content Grid */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Recent Activity */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.6 }}
              className="lg:col-span-2 backdrop-blur-2xl bg-white/60 border-2 border-white/80 rounded-3xl p-8 shadow-lg"
            >
              <h2 className="text-2xl font-inter font-bold text-gray-900 mb-6">Recent Activity</h2>
              <div className="space-y-4">
                {[
                  {
                    icon: '✓',
                    bgColor: 'bg-[#183EC2]',
                    title: 'Donation Successful',
                    desc: 'Aid for Flood Victims - ₹5,000',
                    time: '2 hours ago'
                  },
                  {
                    icon: '🔗',
                    bgColor: 'bg-gray-700',
                    title: 'Wallet Connected',
                    desc: 'MetaMask wallet linked',
                    time: '1 day ago'
                  },
                  {
                    icon: '👁',
                    bgColor: 'bg-gray-500',
                    title: 'Profile Updated',
                    desc: 'Account information changed',
                    time: '3 days ago'
                  },
                  {
                    icon: '📊',
                    bgColor: 'bg-[#4F46E5]',
                    title: 'Impact Report Generated',
                    desc: 'Monthly transparency report available',
                    time: '5 days ago'
                  }
                ].map((activity, index) => (
                  <motion.div
                    key={index}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: 0.8 + index * 0.1 }}
                    className="flex items-center gap-4 p-4 bg-white rounded-xl border border-gray-200 hover:border-[#183EC2]/30 transition-all hover:shadow-md cursor-pointer"
                  >
                    <div className={`w-10 h-10 ${activity.bgColor} rounded-full flex items-center justify-center flex-shrink-0 text-white font-bold`}>
                      {activity.icon}
                    </div>
                    <div className="flex-1">
                      <p className="font-medium text-gray-900">{activity.title}</p>
                      <p className="text-sm text-gray-600">{activity.desc}</p>
                    </div>
                    <span className="text-xs text-gray-500">{activity.time}</span>
                  </motion.div>
                ))}
              </div>
            </motion.div>

            {/* Quick Actions */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.7 }}
              className="backdrop-blur-2xl bg-white/60 border-2 border-white/80 rounded-3xl p-8 shadow-lg"
            >
              <h2 className="text-2xl font-inter font-bold text-gray-900 mb-6">Quick Actions</h2>
              <div className="space-y-3">
                {!account && (
                  <button
                    onClick={connectMetaMask}
                    className="w-full py-3 bg-gradient-to-r from-[#183EC2] to-[#4F46E5] text-white rounded-xl font-medium hover:shadow-lg transition-all hover:scale-105 flex items-center justify-center gap-2"
                  >
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                    </svg>
                    Connect Wallet
                  </button>
                )}
                
                <button
                  onClick={() => router.push('/#charities')}
                  className="w-full py-3 bg-gray-900 text-white rounded-xl font-medium hover:bg-gray-800 transition-all hover:scale-105 flex items-center justify-center gap-2"
                >
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                  Make Donation
                </button>

                <button
                  onClick={() => router.push('/demo')}
                  className="w-full py-3 bg-gray-700 text-white rounded-xl font-medium hover:bg-gray-600 transition-all hover:scale-105 flex items-center justify-center gap-2"
                >
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14.752 11.168l-3.197-2.132A1 1 0 0010 9.87v4.263a1 1 0 001.555.832l3.197-2.132a1 1 0 000-1.664z" />
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                  View Demo
                </button>

                <button
                  onClick={() => router.push('/profile')}
                  className="w-full py-3 bg-white border-2 border-gray-200 text-gray-700 rounded-xl font-medium hover:border-[#183EC2]/30 hover:bg-gray-50 transition-all hover:scale-105 flex items-center justify-center gap-2"
                >
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" />
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                  </svg>
                  Profile Settings
                </button>
              </div>
            </motion.div>
          </div>
        </div>
      </div>
    </div>
  );
}
