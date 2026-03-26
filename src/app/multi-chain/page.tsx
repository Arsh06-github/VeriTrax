'use client';

import { MultiChainDashboard } from '@/components/MultiChainDashboard';
import { Header } from '@/sections/Header';
import { Footer } from '@/sections/Footer';
import Link from 'next/link';
import { ArrowLeft, Sparkles, Zap, Shield, Layers } from 'lucide-react';
import { motion } from 'framer-motion';
import cogImage from "@/assets/cog.png";
import cylinderImage from "@/assets/cylinder.png";

export default function MultiChainPage() {
  return (
    <div className="min-h-screen">
      <Header />
      
      {/* Hero Section with Gradient Background */}
      <section 
        className="relative pt-20 pb-32 overflow-hidden"
        style={{ background: "radial-gradient(ellipse 200% 100% at bottom left, #183EC2, #EAEEFE 100%)" }}
      >
        {/* Animated Background Elements */}
        <motion.img
          src={cogImage.src}
          alt="Blockchain"
          className="absolute top-20 right-10 w-32 h-32 opacity-10"
          animate={{
            rotate: 360,
            scale: [1, 1.1, 1],
          }}
          transition={{
            rotate: { duration: 20, repeat: Infinity, ease: "linear" },
            scale: { duration: 3, repeat: Infinity, ease: "easeInOut" },
          }}
        />
        <motion.img
          src={cylinderImage.src}
          alt="Secure"
          className="absolute bottom-10 left-10 w-24 h-24 opacity-10"
          animate={{
            translateY: [-20, 20],
          }}
          transition={{
            duration: 4,
            repeat: Infinity,
            repeatType: "mirror",
            ease: "easeInOut",
          }}
        />

        <div className="container mx-auto px-4 relative z-10">
          <Link 
            href="/"
            className="inline-flex items-center text-sm text-white/80 hover:text-white mb-8 transition-colors"
          >
            <ArrowLeft className="w-4 h-4 mr-2" />
            Back to Home
          </Link>
          
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="text-center max-w-4xl mx-auto"
          >
            <div className="inline-flex items-center gap-2 bg-white/20 backdrop-blur-sm border border-white/30 px-4 py-2 rounded-full mb-6">
              <Sparkles className="w-4 h-4 text-white" />
              <span className="text-sm text-white font-medium">Multi-Chain Infrastructure</span>
            </div>
            
            <h1 className="text-5xl md:text-7xl font-bold tracking-tighter text-white mb-6">
              Connect to Any
              <span className="block bg-gradient-to-r from-white via-blue-100 to-white bg-clip-text text-transparent">
                Blockchain Network
              </span>
            </h1>
            
            <p className="text-xl text-white/90 max-w-2xl mx-auto leading-relaxed">
              Seamlessly interact with Ethereum, Algorand, and Solana. One dashboard, unlimited possibilities.
            </p>
          </motion.div>
        </div>
      </section>

      {/* Main Dashboard Section */}
      <section className="relative -mt-20 pb-20">
        <div className="container mx-auto px-4">
          <MultiChainDashboard />
        </div>
      </section>

      {/* Technologies Showcase */}
      <section className="py-20 bg-gradient-to-b from-white to-[#EAEEFE]">
        <div className="container mx-auto px-4">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="text-center mb-16"
          >
            <h2 className="section-title mb-4">
              Integrated Technologies
            </h2>
            <p className="section-des max-w-2xl mx-auto">
              Built with cutting-edge blockchain SDKs and wallet integrations for maximum compatibility
            </p>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 max-w-7xl mx-auto">
            {[
              {
                icon: "🔷",
                title: "Algorand SDK",
                desc: "Full blockchain integration with payments, assets, and transaction history",
                color: "from-black to-gray-800"
              },
              {
                icon: "👛",
                title: "Pera Wallet",
                desc: "Native Algorand wallet connection with secure transaction signing",
                color: "from-blue-600 to-blue-800"
              },
              {
                icon: "🔗",
                title: "WalletConnect",
                desc: "Universal multi-chain wallet support for Ethereum, Polygon, and more",
                color: "from-indigo-600 to-purple-600"
              },
              {
                icon: "⚡",
                title: "x402 Automation",
                desc: "Recurring donations and scheduled payment automation",
                color: "from-yellow-500 to-orange-600"
              },
              {
                icon: "🔵",
                title: "Coinbase SDK",
                desc: "Advanced integration with gasless transaction support",
                color: "from-blue-500 to-cyan-600"
              },
              {
                icon: "💼",
                title: "Coinbase Wallet",
                desc: "Direct wallet connection for seamless transactions",
                color: "from-cyan-600 to-blue-700"
              },
              {
                icon: "◎",
                title: "Solana Web3.js",
                desc: "Complete Solana blockchain support with Phantom integration",
                color: "from-purple-600 to-pink-600"
              },
              {
                icon: "🔐",
                title: "Ledger Support",
                desc: "Hardware wallet security for Solana with Ledger Nano S Plus",
                color: "from-gray-700 to-gray-900"
              },
            ].map((tech, index) => (
              <motion.div
                key={tech.title}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
                whileHover={{ scale: 1.05, y: -5 }}
                className="glass-card-hover p-6 group cursor-pointer"
              >
                <div className={`w-14 h-14 rounded-2xl bg-gradient-to-br ${tech.color} flex items-center justify-center text-2xl mb-4 group-hover:scale-110 transition-transform duration-300`}>
                  {tech.icon}
                </div>
                <h3 className="font-bold text-lg mb-2 bg-gradient-to-b from-black to-[#001E80] bg-clip-text text-transparent">
                  {tech.title}
                </h3>
                <p className="text-sm text-[#010D3E]/70 leading-relaxed">
                  {tech.desc}
                </p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Features Grid */}
      <section className="py-20 bg-white">
        <div className="container mx-auto px-4">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-16"
          >
            <h2 className="section-title mb-4">
              Powerful Features
            </h2>
            <p className="section-des max-w-2xl mx-auto">
              Everything you need for multi-chain blockchain interactions
            </p>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-6xl mx-auto">
            {[
              {
                icon: <Layers className="w-8 h-8" />,
                title: "Multi-Chain Support",
                features: [
                  "Connect to 3 major blockchains",
                  "Real-time balance tracking",
                  "Cross-chain transactions",
                  "Unified interface"
                ]
              },
              {
                icon: <Zap className="w-8 h-8" />,
                title: "Advanced Automation",
                features: [
                  "Recurring donations with x402",
                  "Scheduled payments",
                  "Gasless transactions",
                  "Smart contract interactions"
                ]
              },
              {
                icon: <Shield className="w-8 h-8" />,
                title: "Security First",
                features: [
                  "Hardware wallet support",
                  "Secure transaction signing",
                  "WalletConnect integration",
                  "Non-custodial architecture"
                ]
              }
            ].map((feature, index) => (
              <motion.div
                key={feature.title}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
                className="glass-card p-8"
              >
                <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-[#183EC2] to-[#001E80] flex items-center justify-center text-white mb-6">
                  {feature.icon}
                </div>
                <h3 className="text-2xl font-bold mb-4 bg-gradient-to-b from-black to-[#001E80] bg-clip-text text-transparent">
                  {feature.title}
                </h3>
                <ul className="space-y-3">
                  {feature.features.map((item, i) => (
                    <li key={i} className="flex items-start gap-2 text-[#010D3E]/80">
                      <span className="text-[#183EC2] mt-1">✓</span>
                      <span>{item}</span>
                    </li>
                  ))}
                </ul>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
}
