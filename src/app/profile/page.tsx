"use client";

import { useEffect, useState } from 'react';
import { useAuth } from '@/hooks/useAuth';
import { useWeb3 } from '@/hooks/useWeb3';
import { useRouter } from 'next/navigation';
import { ThreeBackground } from '../demo/ThreeBackground';
import { toast } from 'sonner';

export default function ProfilePage() {
  const { user, logout } = useAuth();
  const { account, disconnectWallet } = useWeb3();
  const router = useRouter();
  
  const [formData, setFormData] = useState({
    displayName: '',
    email: user?.email || '',
    phone: '',
    bio: '',
  });

  const [notifications, setNotifications] = useState({
    emailNotifications: true,
    donationUpdates: true,
    campaignAlerts: false,
    monthlyReports: true,
  });

  useEffect(() => {
    if (!user) {
      router.push('/login');
    }
  }, [user, router]);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleNotificationChange = (key: string) => {
    setNotifications({
      ...notifications,
      [key]: !notifications[key as keyof typeof notifications],
    });
  };

  const handleSaveProfile = () => {
    toast.success('Profile updated successfully!');
  };

  const handleLogout = async () => {
    await logout();
    if (account) {
      disconnectWallet();
    }
    router.push('/');
  };

  if (!user) return null;

  return (
    <div className="relative min-h-screen bg-gradient-to-b from-[#EAEEFE] to-white overflow-hidden">
      <ThreeBackground />
      
      <div className="relative z-10 py-12 px-4">
        <div className="max-w-5xl mx-auto">
          {/* Header */}
          <div className="mb-12">
            <button
              onClick={() => router.push('/dashboard')}
              className="mb-4 text-gray-600 hover:text-gray-900 flex items-center gap-2 transition-colors"
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
              </svg>
              Back to Dashboard
            </button>
            <h1 className="text-5xl font-inter font-bold text-gray-900 mb-4 tracking-tight">
              Profile Settings
            </h1>
            <p className="text-xl text-gray-600">Manage your account and preferences</p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Profile Card */}
            <div className="backdrop-blur-2xl bg-white/60 border-2 border-white/80 rounded-3xl p-8 shadow-lg">
              <div className="text-center">
                <div className="w-24 h-24 bg-[#183EC2] rounded-full flex items-center justify-center mx-auto mb-4">
                  <span className="text-4xl font-bold text-white">
                    {user.email?.charAt(0).toUpperCase()}
                  </span>
                </div>
                <h2 className="text-xl font-inter font-bold text-gray-900 mb-2">
                  {formData.displayName || user.email?.split('@')[0]}
                </h2>
                <p className="text-sm text-gray-600 mb-6">{user.email}</p>
                
                {account && (
                  <div className="bg-white border-2 border-gray-200 rounded-xl p-3 mb-4">
                    <p className="text-xs text-gray-500 mb-1 font-medium">Wallet Connected</p>
                    <p className="font-mono text-xs text-gray-900 font-medium">{account.slice(0, 6)}...{account.slice(-4)}</p>
                  </div>
                )}

                <button
                  onClick={handleLogout}
                  className="w-full py-3 bg-gray-900 text-white rounded-xl font-medium hover:bg-gray-800 transition-colors flex items-center justify-center gap-2"
                >
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
                  </svg>
                  Logout
                </button>
              </div>
            </div>

            {/* Settings Forms */}
            <div className="lg:col-span-2 space-y-6">
              {/* Personal Information */}
              <div className="backdrop-blur-2xl bg-white/60 border-2 border-white/80 rounded-3xl p-8 shadow-lg">
                <h2 className="text-2xl font-inter font-bold text-gray-900 mb-6 flex items-center gap-2">
                  <svg className="w-6 h-6 text-[#183EC2]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                  </svg>
                  Personal Information
                </h2>
                
                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Display Name
                    </label>
                    <input
                      type="text"
                      name="displayName"
                      value={formData.displayName}
                      onChange={handleInputChange}
                      className="w-full px-4 py-3 bg-white border-2 border-gray-200 rounded-xl focus:border-[#183EC2] focus:outline-none transition-colors"
                      placeholder="Enter your name"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Email Address
                    </label>
                    <input
                      type="email"
                      name="email"
                      value={formData.email}
                      disabled
                      className="w-full px-4 py-3 bg-gray-100 border-2 border-gray-200 rounded-xl cursor-not-allowed"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Phone Number
                    </label>
                    <input
                      type="tel"
                      name="phone"
                      value={formData.phone}
                      onChange={handleInputChange}
                      className="w-full px-4 py-3 bg-white border-2 border-gray-200 rounded-xl focus:border-[#183EC2] focus:outline-none transition-colors"
                      placeholder="+91 XXXXX XXXXX"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Bio
                    </label>
                    <textarea
                      name="bio"
                      value={formData.bio}
                      onChange={handleInputChange}
                      rows={4}
                      className="w-full px-4 py-3 bg-white border-2 border-gray-200 rounded-xl focus:border-[#183EC2] focus:outline-none transition-colors resize-none"
                      placeholder="Tell us about yourself..."
                    />
                  </div>

                  <button
                    onClick={handleSaveProfile}
                    className="w-full py-3 bg-[#183EC2] text-white rounded-xl font-medium hover:bg-[#183EC2]/90 transition-colors"
                  >
                    Save Changes
                  </button>
                </div>
              </div>

              {/* Notification Preferences */}
              <div className="backdrop-blur-2xl bg-white/60 border-2 border-white/80 rounded-3xl p-8 shadow-lg">
                <h2 className="text-2xl font-inter font-bold text-gray-900 mb-6 flex items-center gap-2">
                  <svg className="w-6 h-6 text-[#183EC2]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9" />
                  </svg>
                  Notification Preferences
                </h2>

                <div className="space-y-4">
                  {Object.entries(notifications).map(([key, value]) => (
                    <div key={key} className="flex items-center justify-between p-4 bg-white rounded-xl border-2 border-gray-200">
                      <div>
                        <p className="font-medium text-gray-900">
                          {key.replace(/([A-Z])/g, ' $1').replace(/^./, str => str.toUpperCase())}
                        </p>
                        <p className="text-sm text-gray-600">
                          {key === 'emailNotifications' && 'Receive email notifications'}
                          {key === 'donationUpdates' && 'Get updates on your donations'}
                          {key === 'campaignAlerts' && 'Alerts for new campaigns'}
                          {key === 'monthlyReports' && 'Monthly impact reports'}
                        </p>
                      </div>
                      <button
                        onClick={() => handleNotificationChange(key)}
                        className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
                          value ? 'bg-[#183EC2]' : 'bg-gray-300'
                        }`}
                      >
                        <span
                          className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                            value ? 'translate-x-6' : 'translate-x-1'
                          }`}
                        />
                      </button>
                    </div>
                  ))}
                </div>
              </div>

              {/* Security */}
              <div className="backdrop-blur-2xl bg-white/60 border-2 border-white/80 rounded-3xl p-8 shadow-lg">
                <h2 className="text-2xl font-inter font-bold text-gray-900 mb-6 flex items-center gap-2">
                  <svg className="w-6 h-6 text-[#183EC2]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                  </svg>
                  Security
                </h2>

                <div className="space-y-3">
                  <button className="w-full py-3 bg-[#183EC2] text-white rounded-xl font-medium hover:bg-[#183EC2]/90 transition-colors flex items-center justify-center gap-2">
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 7a2 2 0 012 2m4 0a6 6 0 01-7.743 5.743L11 17H9v2H7v2H4a1 1 0 01-1-1v-2.586a1 1 0 01.293-.707l5.964-5.964A6 6 0 1121 9z" />
                    </svg>
                    Change Password
                  </button>

                  <button className="w-full py-3 bg-gray-700 text-white rounded-xl font-medium hover:bg-gray-600 transition-colors flex items-center justify-center gap-2">
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
                    </svg>
                    Enable 2FA
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
