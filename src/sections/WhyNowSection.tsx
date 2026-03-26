"use client";

import { motion, useInView } from "framer-motion";
import { useRef } from "react";
import { GlassCard } from "@/components/GlassCard";

const reasons = [
  {
    title: "Financial Fraud Rising",
    description: "Real cases of donation misuse create cascading effects—when one organization is exposed, it taints public perception of all charitable giving.",
    icon: (
      <svg className="w-12 h-12" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v13m0-13V6a2 2 0 112 2h-2zm0 0V5.5A2.5 2.5 0 109.5 8H12zm-7 4h14M5 12a2 2 0 110-4h14a2 2 0 110 4M5 12v7a2 2 0 002 2h10a2 2 0 002-2v-7" />
      </svg>
    ),
    variant: 'blue' as const,
  },
  {
    title: "Crowdfunding Misuse",
    description: "High-profile crowdfunding fraud cases erode platform credibility and make platforms liable for verifying fund usage themselves.",
    icon: (
      <svg className="w-12 h-12" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
      </svg>
    ),
    variant: 'purple' as const,
  },
  {
    title: "Regulatory Pressure",
    description: "CSR mandates and grant compliance requirements force organizations into costly manual reporting cycles without verifiable infrastructure.",
    icon: (
      <svg className="w-12 h-12" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
      </svg>
    ),
    variant: 'indigo' as const,
  },
  {
    title: "Weak Audit Systems",
    description: "Most organizations lack internal systems to produce real-time, cryptographically verifiable proof of fund utilization.",
    icon: (
      <svg className="w-12 h-12" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-6 9l2 2 4-4" />
      </svg>
    ),
    variant: 'blue' as const,
  },
];

export const WhyNowSection = () => {
  const sectionRef = useRef(null);
  const isInView = useInView(sectionRef, { once: true, margin: "-100px" });

  return (
    <section ref={sectionRef} className="py-24 bg-white relative overflow-hidden">
      {/* Background pattern to make glass effect visible */}
      <div className="absolute inset-0 bg-gradient-to-br from-blue-50 via-purple-50 to-pink-50 opacity-40" />
      <div className="absolute inset-0" style={{
        backgroundImage: 'radial-gradient(circle at 20% 50%, rgba(24, 62, 194, 0.08) 0%, transparent 50%), radial-gradient(circle at 80% 80%, rgba(168, 85, 247, 0.08) 0%, transparent 50%)',
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
            <div className="tag">Urgent Need</div>
          </div>
          
          <h2 className="section-title mt-5">
            Why Veritrax Is Needed Now
          </h2>
          
          <p className="section-des mt-5">
            The convergence of rising fraud, regulatory demands, and technological capability makes 
            proof-based funding infrastructure not just beneficial—but essential.
          </p>
        </motion.div>

        {/* Reasons Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 max-w-5xl mx-auto mt-10">
          {reasons.map((reason, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 30 }}
              animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 30 }}
              transition={{ duration: 0.5, delay: index * 0.15 }}
            >
              <GlassCard variant={reason.variant} className="p-10">
                <div className="text-[#183EC2] mb-4">
                  {reason.icon}
                </div>
                <h3 className="text-2xl font-inter font-bold text-gray-900 mb-3 tracking-tight">{reason.title}</h3>
                <p className="text-gray-600 leading-relaxed">{reason.description}</p>
              </GlassCard>
            </motion.div>
          ))}
        </div>

        {/* Bottom CTA */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 20 }}
          transition={{ duration: 0.6, delay: 0.8 }}
          className="mt-16 text-center"
        >
          <GlassCard variant="gradient" className="p-10 max-w-3xl mx-auto bg-gradient-to-b from-black to-[#001E80]">
            <h3 className="text-2xl font-bold mb-4 text-white">The Time for Change Is Now</h3>
            <p className="text-lg mb-6 text-white/90">
              Organizations that adopt proof-based funding infrastructure today will lead the next 
              generation of transparent, accountable charitable giving.
            </p>
            <a
              href="/signup"
              className="inline-flex items-center gap-2 bg-white text-black px-8 py-3 rounded-lg font-medium hover:bg-gray-100 transition-colors"
            >
              <span>Join the Movement</span>
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7l5 5m0 0l-5 5m5-5H6" />
              </svg>
            </a>
          </GlassCard>
        </motion.div>
      </div>
    </section>
  );
};
