"use client";

import ArrowRight from "@/assets/arrow-right.svg";
import Logo from "@/assets/logosaas.png";
import Image from "next/image";
import MenuIcon from "@/assets/menu.svg";
import { useWeb3 } from "@/hooks/useWeb3";
import { useAuth } from "@/hooks/useAuth";
import { useState } from "react";
import Link from "next/link";
import { useRouter, usePathname } from "next/navigation";
import { logOut } from "@/lib/firebase";
import { toast } from "sonner";
import { X } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

export const Header = () => {
  const { account, walletType, connectMetaMask, connectCoinbase, disconnect, isConnecting } = useWeb3();
  const { user, userProfile } = useAuth();
  const [showWalletMenu, setShowWalletMenu] = useState(false);
  const [showUserMenu, setShowUserMenu] = useState(false);
  const [showMobileMenu, setShowMobileMenu] = useState(false);
  const router = useRouter();
  const pathname = usePathname();

  const handleConnect = async (type: 'metamask' | 'coinbase') => {
    try {
      if (type === 'metamask') {
        await connectMetaMask();
      } else {
        await connectCoinbase();
      }
      setShowWalletMenu(false);
      setShowMobileMenu(false);
    } catch (error) {
      console.error('Connection failed:', error);
    }
  };

  const handleLogout = async () => {
    try {
      await logOut();
      disconnect();
      toast.success('Logged out successfully');
      setShowUserMenu(false);
      setShowMobileMenu(false);
    } catch (error) {
      toast.error('Failed to logout');
    }
  };

  const scrollToSection = (id: string) => {
    setShowMobileMenu(false);
    // If we're not on the home page, navigate there first
    if (pathname !== '/') {
      router.push('/');
      // Wait for navigation to complete, then scroll
      setTimeout(() => {
        document.getElementById(id)?.scrollIntoView({ behavior: 'smooth' });
      }, 100);
    } else {
      // If we're already on home page, just scroll
      document.getElementById(id)?.scrollIntoView({ behavior: 'smooth' });
    }
  };

  const handleNavigation = (path: string) => {
    setShowMobileMenu(false);
    router.push(path);
  };

  return (
    <header className="sticky top-0 backdrop-blur-sm z-20">
      <div className="flex justify-center items-center py-3 bg-black text-white text-sm gap-3">
        <p className="text-white/60 hidden md:block">
          Transparent charity donations powered by blockchain
        </p>
        <div className="inline-flex gap-1 items-center">
          <p>Start donating today</p>
          <ArrowRight className="h-4 w-4 inline-flex justify-center items-center" />
        </div>
      </div>

      <div className="py-5 bg-[#EAEEFE]">
        <div className="container">
          <div className="flex items-center justify-between">
            <Link href="/" className="flex items-center gap-2 cursor-pointer">
              <Image src={Logo} alt="Veritrax logo" height={40} width={40} />
              <span className="text-xl font-bold">Veritrax</span>
            </Link>
            
            {/* Mobile Menu Button */}
            <button 
              onClick={() => setShowMobileMenu(!showMobileMenu)}
              className="md:hidden p-2 hover:bg-black/5 rounded-lg transition-colors"
              aria-label="Toggle menu"
            >
              {showMobileMenu ? (
                <X className="h-6 w-6 text-black" />
              ) : (
                <MenuIcon className="h-5 w-5" />
              )}
            </button>

            {/* Desktop Navigation */}
            <nav className="hidden md:flex gap-6 text-black/60 items-center">
              <button onClick={() => scrollToSection('charities')} className="hover:text-black transition">
                Charities
              </button>
              <button onClick={() => scrollToSection('how-it-works')} className="hover:text-black transition">
                How It Works
              </button>
              <button onClick={() => scrollToSection('testimonials')} className="hover:text-black transition">
                Testimonials
              </button>
              <Link href="/about" className="hover:text-black transition">
                About
              </Link>
              <Link href="/multi-chain" className="hover:text-black transition font-semibold text-[#183EC2]">
                Multi-Chain 🚀
              </Link>
              {user && (
                <>
                  <Link href="/campaigns" className="hover:text-black transition font-semibold text-purple-600">
                    Campaigns
                  </Link>
                  <Link href="/transfer" className="hover:text-black transition">
                    Transfer
                  </Link>
                  <Link href="/transactions" className="hover:text-black transition">
                    History
                  </Link>
                </>
              )}
              
              {!user ? (
                <div className="flex items-center gap-3">
                  <Link
                    href="/login"
                    className="text-black/80 hover:text-black font-medium transition"
                  >
                    Login
                  </Link>
                  <Link
                    href="/signup"
                    className="bg-black text-white px-4 py-2 rounded-lg font-medium hover:bg-gray-800 transition"
                  >
                    Sign Up
                  </Link>
                </div>
              ) : (
                <div className="flex items-center gap-3">
                  {!account ? (
                    <div className="relative">
                      <button
                        onClick={() => setShowWalletMenu(!showWalletMenu)}
                        disabled={isConnecting}
                        className="bg-[#183EC2] text-white px-4 py-2 rounded-lg font-medium inline-flex items-center justify-center tracking-tight disabled:opacity-50 hover:bg-[#0f2a8f] transition"
                      >
                        {isConnecting ? 'Connecting...' : 'Connect Wallet'}
                      </button>
                      
                      {showWalletMenu && (
                        <div className="absolute right-0 mt-2 w-48 bg-white rounded-lg shadow-lg border border-gray-200 py-2 z-50">
                          <button
                            onClick={() => handleConnect('metamask')}
                            className="w-full px-4 py-2 text-left hover:bg-gray-100 flex items-center gap-2"
                          >
                            <span>🦊</span>
                            <span>MetaMask</span>
                          </button>
                          <button
                            onClick={() => handleConnect('coinbase')}
                            className="w-full px-4 py-2 text-left hover:bg-gray-100 flex items-center gap-2"
                          >
                            <span>🔵</span>
                            <span>Coinbase Wallet</span>
                          </button>
                        </div>
                      )}
                    </div>
                  ) : (
                    <div className="relative">
                      <button
                        onClick={() => setShowWalletMenu(!showWalletMenu)}
                        className="flex items-center gap-2 bg-green-100 text-green-800 px-3 py-2 rounded-lg text-sm font-medium hover:bg-green-200 transition"
                      >
                        <span>{walletType === 'metamask' ? '🦊' : '🔵'}</span>
                        <span>{account.slice(0, 6)}...{account.slice(-4)}</span>
                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                        </svg>
                      </button>
                      
                      {showWalletMenu && (
                        <div className="absolute right-0 mt-2 w-56 bg-white rounded-lg shadow-lg border border-gray-200 py-2 z-50">
                          <div className="px-4 py-2 border-b border-gray-200">
                            <p className="text-xs text-gray-500">Connected with {walletType === 'metamask' ? 'MetaMask' : 'Coinbase Wallet'}</p>
                            <p className="text-sm font-mono text-gray-900 mt-1">{account.slice(0, 10)}...{account.slice(-8)}</p>
                          </div>
                          <button
                            onClick={() => {
                              disconnect();
                              setShowWalletMenu(false);
                            }}
                            className="w-full px-4 py-2 text-left hover:bg-red-50 text-red-600 flex items-center gap-2"
                          >
                            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
                            </svg>
                            <span>Disconnect Wallet</span>
                          </button>
                        </div>
                      )}
                    </div>
                  )}
                  
                  <div className="relative">
                    <button
                      onClick={() => setShowUserMenu(!showUserMenu)}
                      className="flex items-center gap-2 bg-gray-100 px-3 py-2 rounded-lg hover:bg-gray-200 transition"
                    >
                      <div className="w-8 h-8 bg-gradient-to-br from-[#183EC2] to-[#001E80] rounded-full flex items-center justify-center text-white font-bold text-sm">
                        {userProfile?.displayName?.charAt(0).toUpperCase() || 'U'}
                      </div>
                      <span className="text-sm font-medium">{userProfile?.displayName || 'User'}</span>
                    </button>
                    
                    {showUserMenu && (
                      <div className="absolute right-0 mt-2 w-56 bg-white rounded-lg shadow-lg border border-gray-200 py-2">
                        <div className="px-4 py-2 border-b border-gray-200">
                          <p className="text-sm font-medium text-gray-900">{userProfile?.displayName}</p>
                          <p className="text-xs text-gray-500">{user?.email}</p>
                          {userProfile?.userType === 'organization' && (
                            <span className="inline-block mt-1 px-2 py-0.5 bg-blue-100 text-blue-800 text-xs rounded">
                              Organization
                            </span>
                          )}
                        </div>
                        <Link
                          href="/dashboard"
                          className="block w-full px-4 py-2 text-left hover:bg-gray-100 text-sm"
                          onClick={() => setShowUserMenu(false)}
                        >
                          Dashboard
                        </Link>
                        <Link
                          href="/campaigns"
                          className="block w-full px-4 py-2 text-left hover:bg-gray-100 text-sm"
                          onClick={() => setShowUserMenu(false)}
                        >
                          Campaigns
                        </Link>
                        <Link
                          href="/transfer"
                          className="block w-full px-4 py-2 text-left hover:bg-gray-100 text-sm"
                          onClick={() => setShowUserMenu(false)}
                        >
                          Transfer Funds
                        </Link>
                        <Link
                          href="/transactions"
                          className="block w-full px-4 py-2 text-left hover:bg-gray-100 text-sm"
                          onClick={() => setShowUserMenu(false)}
                        >
                          Transaction History
                        </Link>
                        <Link
                          href="/profile"
                          className="block w-full px-4 py-2 text-left hover:bg-gray-100 text-sm"
                          onClick={() => setShowUserMenu(false)}
                        >
                          Profile Settings
                        </Link>
                        <button
                          onClick={handleLogout}
                          className="block w-full px-4 py-2 text-left hover:bg-gray-100 text-sm text-red-600"
                        >
                          Logout
                        </button>
                      </div>
                    )}
                  </div>
                </div>
              )}
            </nav>
          </div>
        </div>
      </div>

      {/* Mobile Menu */}
      <AnimatePresence>
        {showMobileMenu && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            transition={{ duration: 0.3 }}
            className="md:hidden bg-white border-t border-gray-200 shadow-lg overflow-hidden"
          >
            <div className="container py-6 space-y-4">
              {/* Navigation Links */}
              <div className="space-y-2">
                <button 
                  onClick={() => scrollToSection('charities')} 
                  className="block w-full text-left px-4 py-3 text-gray-700 hover:bg-gray-100 rounded-lg transition font-medium"
                >
                  Charities
                </button>
                <button 
                  onClick={() => scrollToSection('how-it-works')} 
                  className="block w-full text-left px-4 py-3 text-gray-700 hover:bg-gray-100 rounded-lg transition font-medium"
                >
                  How It Works
                </button>
                <button 
                  onClick={() => scrollToSection('testimonials')} 
                  className="block w-full text-left px-4 py-3 text-gray-700 hover:bg-gray-100 rounded-lg transition font-medium"
                >
                  Testimonials
                </button>
                <button 
                  onClick={() => handleNavigation('/about')}
                  className="block w-full text-left px-4 py-3 text-gray-700 hover:bg-gray-100 rounded-lg transition font-medium"
                >
                  About
                </button>
                <button 
                  onClick={() => handleNavigation('/multi-chain')}
                  className="block w-full text-left px-4 py-3 text-[#183EC2] hover:bg-blue-50 rounded-lg transition font-semibold"
                >
                  Multi-Chain 🚀
                </button>
                {user && (
                  <>
                    <button 
                      onClick={() => handleNavigation('/campaigns')}
                      className="block w-full text-left px-4 py-3 text-purple-600 hover:bg-purple-50 rounded-lg transition font-semibold"
                    >
                      Campaigns
                    </button>
                    <button 
                      onClick={() => handleNavigation('/transfer')}
                      className="block w-full text-left px-4 py-3 text-gray-700 hover:bg-gray-100 rounded-lg transition font-medium"
                    >
                      Transfer
                    </button>
                    <button 
                      onClick={() => handleNavigation('/transactions')}
                      className="block w-full text-left px-4 py-3 text-gray-700 hover:bg-gray-100 rounded-lg transition font-medium"
                    >
                      History
                    </button>
                  </>
                )}
              </div>

              {/* User Section */}
              <div className="pt-4 border-t border-gray-200 space-y-3">
                {!user ? (
                  <>
                    <button
                      onClick={() => handleNavigation('/login')}
                      className="block w-full px-4 py-3 text-center text-gray-700 hover:bg-gray-100 rounded-lg transition font-medium"
                    >
                      Login
                    </button>
                    <button
                      onClick={() => handleNavigation('/signup')}
                      className="block w-full px-4 py-3 text-center bg-black text-white rounded-lg font-medium hover:bg-gray-800 transition"
                    >
                      Sign Up
                    </button>
                  </>
                ) : (
                  <>
                    {/* User Info */}
                    <div className="px-4 py-3 bg-gray-50 rounded-lg">
                      <div className="flex items-center gap-3 mb-3">
                        <div className="w-10 h-10 bg-gradient-to-br from-[#183EC2] to-[#001E80] rounded-full flex items-center justify-center text-white font-bold">
                          {userProfile?.displayName?.charAt(0).toUpperCase() || 'U'}
                        </div>
                        <div>
                          <p className="font-medium text-gray-900">{userProfile?.displayName || 'User'}</p>
                          <p className="text-xs text-gray-500">{user?.email}</p>
                        </div>
                      </div>
                      {account && (
                        <div className="text-xs font-mono text-gray-600 bg-white px-3 py-2 rounded">
                          {account.slice(0, 10)}...{account.slice(-8)}
                        </div>
                      )}
                    </div>

                    {/* Wallet Actions */}
                    {!account ? (
                      <div className="space-y-2">
                        <button
                          onClick={() => handleConnect('metamask')}
                          disabled={isConnecting}
                          className="w-full px-4 py-3 bg-[#183EC2] text-white rounded-lg font-medium hover:bg-[#0f2a8f] transition disabled:opacity-50 flex items-center justify-center gap-2"
                        >
                          <span>🦊</span>
                          <span>Connect MetaMask</span>
                        </button>
                        <button
                          onClick={() => handleConnect('coinbase')}
                          disabled={isConnecting}
                          className="w-full px-4 py-3 bg-blue-600 text-white rounded-lg font-medium hover:bg-blue-700 transition disabled:opacity-50 flex items-center justify-center gap-2"
                        >
                          <span>🔵</span>
                          <span>Connect Coinbase</span>
                        </button>
                      </div>
                    ) : (
                      <button
                        onClick={() => {
                          disconnect();
                          setShowMobileMenu(false);
                        }}
                        className="w-full px-4 py-3 bg-red-50 text-red-600 rounded-lg font-medium hover:bg-red-100 transition"
                      >
                        Disconnect Wallet
                      </button>
                    )}

                    {/* User Menu Links */}
                    <div className="space-y-2 pt-2 border-t border-gray-200">
                      <button
                        onClick={() => handleNavigation('/dashboard')}
                        className="block w-full text-left px-4 py-3 text-gray-700 hover:bg-gray-100 rounded-lg transition"
                      >
                        Dashboard
                      </button>
                      <button
                        onClick={() => handleNavigation('/profile')}
                        className="block w-full text-left px-4 py-3 text-gray-700 hover:bg-gray-100 rounded-lg transition"
                      >
                        Profile Settings
                      </button>
                      <button
                        onClick={handleLogout}
                        className="block w-full text-left px-4 py-3 text-red-600 hover:bg-red-50 rounded-lg transition"
                      >
                        Logout
                      </button>
                    </div>
                  </>
                )}
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </header>
  );
};
