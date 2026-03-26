"use client";

import { motion, useInView } from "framer-motion";
import { useRef } from "react";
import { GlassCard } from "@/components/GlassCard";

const audiences = [
  {
    title: "NGOs & Charitable Organizations",
    description: "Build donor trust with transparent fund management and real-time proof of utilization",
    icon: (
      <svg className="w-12 h-12 text-[#183EC2]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
      </svg>
    ),
    variant: 'blue' as const,
  },
  {
    title: "Corporate CSR Departments",
    description: "Meet compliance requirements with automated reporting and verifiable fund tracking",
    icon: (
      <svg className="w-12 h-12 text-[#183EC2]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M12 2v4m0 0a2 2 0 100 4 2 2 0 000-4z" />
      </svg>
    ),
    variant: 'indigo' as const,
  },
  {
    title: "Crowdfunding Platforms",
    description: "Protect platform credibility by ensuring all campaigns have verifiable fund usage",
    icon: (
      <svg className="w-12 h-12 text-[#183EC2]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M3.055 11H5a2 2 0 012 2v1a2 2 0 002 2 2 2 0 012 2v2.945M8 3.935V5.5A2.5 2.5 0 0010.5 8h.5a2 2 0 012 2 2 2 0 104 0 2 2 0 012-2h1.064M15 20.488V18a2 2 0 012-2h3.064M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
      </svg>
    ),
    variant: 'purple' as const,
  },
  {
    title: "Educational Institutions",
    description: "Manage scholarship funds, grants, and donations with complete transparency",
    icon: (
      <svg className="w-12 h-12 text-[#183EC2]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M12 14l9-5-9-5-9 5 9 5z" />
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M12 14l6.16-3.422a12.083 12.083 0 01.665 6.479A11.952 11.952 0 0012 20.055a11.952 11.952 0 00-6.824-2.998 12.078 12.078 0 01.665-6.479L12 14z" />
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M12 14l9-5-9-5-9 5 9 5zm0 0l6.16-3.422a12.083 12.083 0 01.665 6.479A11.952 11.952 0 0012 20.055a11.952 11.952 0 00-6.824-2.998 12.078 12.078 0 01.665-6.479L12 14zm-4 6v-7.5l4-2.222" />
      </svg>
    ),
    variant: 'blue' as const,
  },
  {
    title: "Housing Societies",
    description: "Track shared funds and maintenance expenses with member-accessible audit trails",
    icon: (
      <svg className="w-12 h-12 text-[#183EC2]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" />
      </svg>
    ),
    variant: 'indigo' as const,
  },
  {
    title: "Government Grant Programs",
    description: "Ensure public funds are used appropriately with blockchain-verified accountability",
    icon: (
      <svg className="w-12 h-12 text-[#183EC2]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
      </svg>
    ),
    variant: 'purple' as const,
  },
  {
    title: "Freelancers & Consultants",
    description: "Manage client funds transparently with automated proof of expense utilization",
    icon: (
      <svg className="w-12 h-12 text-[#183EC2]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M21 13.255A23.931 23.931 0 0112 15c-3.183 0-6.22-.62-9-1.745M16 6V4a2 2 0 00-2-2h-4a2 2 0 00-2 2v2m4 6h.01M5 20h14a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
      </svg>
    ),
    variant: 'blue' as const,
  },
  {
    title: "Digital Agencies",
    description: "Handle client budgets with real-time tracking and verifiable expense documentation",
    icon: (
      <svg className="w-12 h-12 text-[#183EC2]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M7 21a4 4 0 01-4-4V5a2 2 0 012-2h4a2 2 0 012 2v12a4 4 0 01-4 4zm0 0h12a2 2 0 002-2v-4a2 2 0 00-2-2h-2.343M11 7.343l1.657-1.657a2 2 0 012.828 0l2.829 2.829a2 2 0 010 2.828l-8.486 8.485M7 17h.01" />
      </svg>
    ),
    variant: 'indigo' as const,
  },
];

export const WhoNeedsSection = () => {
  const sectionRef = useRef(null);
  const isInView = useInView(sectionRef, { once: true, margin: "-100px" });

  return (
    <section ref={sectionRef} className="py-24 bg-gradient-to-b from-[#EAEEFE] to-white relative overflow-hidden">
      {/* Background pattern to make glass effect visible */}
      <div className="absolute inset-0" style={{
        backgroundImage: 'radial-gradient(circle at 25% 35%, rgba(24, 62, 194, 0.08) 0%, transparent 50%), radial-gradient(circle at 75% 65%, rgba(168, 85, 247, 0.08) 0%, transparent 50%)',
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
            <div className="tag">Target Audiences</div>
          </div>
          
          <h2 className="section-title mt-5">
            Who Needs Veritrax
          </h2>
          
          <p className="section-des mt-5">
            From nonprofits to enterprises, any organization managing funds on behalf of others 
            benefits from proof-based infrastructure.
          </p>
        </motion.div>

        {/* Audiences Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mt-10">
          {audiences.map((audience, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 30 }}
              animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 30 }}
              transition={{ duration: 0.5, delay: index * 0.08 }}
            >
              <GlassCard variant={audience.variant} className="p-6 hover:scale-105 transition-transform duration-300 cursor-pointer">
                <div className="mb-4">
                  {audience.icon}
                </div>
                <h3 className="text-lg font-inter font-bold text-gray-900 mb-2 tracking-tight">{audience.title}</h3>
                <p className="text-sm text-gray-600 leading-relaxed">{audience.description}</p>
              </GlassCard>
            </motion.div>
          ))}
        </div>

        {/* Bottom Message */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 20 }}
          transition={{ duration: 0.6, delay: 0.8 }}
          className="mt-16 text-center"
        >
          <div className="glass-card p-10 max-w-3xl mx-auto border-2 border-[#183EC2]">
            <h3 className="text-2xl font-bold text-black/80 mb-4">
              Managing Funds for Others?
            </h3>
            <p className="text-lg text-[#010D3E]/60 mb-6">
              If you collect, manage, or distribute funds on behalf of stakeholders, Veritrax 
              provides the infrastructure to prove every transaction with cryptographic certainty.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <a
                href="/signup"
                className="btn btn-primary px-8 py-3"
              >
                <span>Get Started</span>
                <svg className="w-5 h-5 ml-2 inline" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7l5 5m0 0l-5 5m5-5H6" />
                </svg>
              </a>
              <a
                href="#how-it-works"
                className="inline-flex items-center justify-center gap-2 bg-white text-black border-2 border-black px-8 py-3 rounded-lg font-medium hover:bg-gray-50 transition-colors"
              >
                <span>See How It Works</span>
              </a>
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  );
};
