"use client";

import { motion, useInView } from "framer-motion";
import { useRef } from "react";
import { GlassCard } from "@/components/GlassCard";

const capabilities = [
  {
    title: "Collect Funds Securely",
    description: "Integrated payment channels for both crypto and traditional payments",
    icon: (
      <svg className="w-10 h-10" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 9V7a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2m2 4h10a2 2 0 002-2v-6a2 2 0 00-2-2H9a2 2 0 00-2 2v6a2 2 0 002 2zm7-5a2 2 0 11-4 0 2 2 0 014 0z" />
      </svg>
    ),
    variant: 'blue' as const,
  },
  {
    title: "Manage Fund Utilization",
    description: "Automated workflows for real-time fund management and tracking",
    icon: (
      <svg className="w-10 h-10" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-3 7h3m-3 4h3m-6-4h.01M9 16h.01" />
      </svg>
    ),
    variant: 'purple' as const,
  },
  {
    title: "Upload Verified Proofs",
    description: "Timestamped expense proofs with document verification",
    icon: (
      <svg className="w-10 h-10" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12" />
      </svg>
    ),
    variant: 'indigo' as const,
  },
  {
    title: "Anchor on Blockchain",
    description: "Immutable records with cryptographic verification",
    icon: (
      <svg className="w-10 h-10" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
      </svg>
    ),
    variant: 'blue' as const,
  },
  {
    title: "Public Audit Dashboards",
    description: "Real-time transparency for all stakeholders and donors",
    icon: (
      <svg className="w-10 h-10" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
      </svg>
    ),
    variant: 'purple' as const,
  },
];

export const SolutionSection = () => {
  const sectionRef = useRef(null);
  const isInView = useInView(sectionRef, { once: true, margin: "-100px" });

  return (
    <section ref={sectionRef} className="py-24 bg-gradient-to-b from-white to-[#D2DCFF] relative overflow-hidden">
      {/* Background pattern to make glass effect visible */}
      <div className="absolute inset-0" style={{
        backgroundImage: 'radial-gradient(circle at 30% 40%, rgba(24, 62, 194, 0.08) 0%, transparent 50%), radial-gradient(circle at 70% 70%, rgba(168, 85, 247, 0.08) 0%, transparent 50%)',
      }} />
      
      <div className="container relative z-10">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 20 }}
          transition={{ duration: 0.6 }}
          className="section-heading"
        >
          <div className="flex justify-center">
            <div className="tag">The Solution</div>
          </div>
          
          <h2 className="section-title mt-5">
            What Veritrax Is
          </h2>
          
          <p className="section-des mt-5 mb-8">
            Veritrax is a <span className="font-bold text-[#183EC2]">Platform-as-a-Service (PaaS)</span> that 
            turns trust-based funding into proof-based funding. Organizations can collect funds securely, 
            manage utilization in real time, and prove every expense with cryptographic verification anchored 
            to the blockchain.
          </p>

          <GlassCard variant="gradient" className="p-10 bg-gradient-to-b from-black to-[#001E80]">
            <svg className="w-12 h-12 mx-auto mb-4 text-green-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
            </svg>
            <p className="text-xl md:text-2xl font-bold leading-relaxed text-center text-white">
              Veritrax provides built-in compliance, transparency, and accountability—turning every fund 
              movement into publicly verifiable proof rather than private promises.
            </p>
          </GlassCard>
        </motion.div>

        {/* Capabilities Grid */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 20 }}
          transition={{ duration: 0.6, delay: 0.3 }}
          className="mt-16"
        >
          <h3 className="text-2xl font-inter font-bold text-gray-900 mb-8 text-center tracking-tight">Platform Capabilities</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {capabilities.map((capability, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 30 }}
                animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 30 }}
                transition={{ duration: 0.5, delay: 0.4 + index * 0.1 }}
              >
                <GlassCard variant={capability.variant} className="p-8">
                  <div className="text-[#183EC2] mb-4">{capability.icon}</div>
                  <h4 className="text-xl font-inter font-bold text-gray-900 mb-2 tracking-tight">{capability.title}</h4>
                  <p className="text-gray-600">{capability.description}</p>
                </GlassCard>
              </motion.div>
            ))}
          </div>
        </motion.div>

        {/* CTA */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 20 }}
          transition={{ duration: 0.6, delay: 0.9 }}
          className="text-center mt-12"
        >
          <a
            href="/signup"
            className="btn btn-primary px-8 py-4 text-lg shadow-lg hover:shadow-xl transition-shadow"
          >
            <span>Start Building Trust</span>
            <svg className="w-5 h-5 ml-2 inline" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7l5 5m0 0l-5 5m5-5H6" />
            </svg>
          </a>
        </motion.div>
      </div>
    </section>
  );
};
