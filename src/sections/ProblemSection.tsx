"use client";

import { motion, useInView } from "framer-motion";
import { useRef } from "react";
import { GlassCard } from "@/components/GlassCard";

const problems = [
  {
    title: "Easily Manipulated",
    description: "Spreadsheets and PDFs can be altered without leaving a trace.",
    icon: (
      <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
      </svg>
    ),
    variant: 'blue' as const,
  },
  {
    title: "Difficult to Verify",
    description: "With no real-time public access, trust relies on reputation alone.",
    icon: (
      <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8.228 9c.549-1.165 2.03-2 3.772-2 2.21 0 4 1.343 4 3 0 1.4-1.278 2.575-3.006 2.907-.542.104-.994.54-.994 1.093m0 3h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
      </svg>
    ),
    variant: 'purple' as const,
  },
  {
    title: "Not Transparent",
    description: "Behind closed doors, fund misuse becomes nearly impossible to detect.",
    icon: (
      <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.543-7a9.97 9.97 0 011.563-3.029m5.858.908a3 3 0 114.243 4.243M9.878 9.878l4.242 4.242M9.88 9.88l-3.29-3.29m7.532 7.532l3.29 3.29M3 3l3.59 3.59m0 0A9.953 9.953 0 0112 5c4.478 0 8.268 2.943 9.543 7a10.025 10.025 0 01-4.132 5.411m0 0L21 21" />
      </svg>
    ),
    variant: 'indigo' as const,
  },
];

const currentReality = [
  "Manual spreadsheet tracking prone to human error",
  "Static PDF reports impossible to verify in real time",
  "Selective disclosure that hides the complete financial picture",
  "Months-long audit cycles that expose fraud too late",
];

const impacts = [
  "Donation scams increase and exploit genuine causes",
  "Public confidence in philanthropy erodes",
  "Compliance costs balloon with manual audits",
  "Genuine organizations struggle to secure funding",
  "Donors lose motivation to contribute",
  "Accountability becomes subjective rather than objective",
];

export const ProblemSection = () => {
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
            <div className="tag">The Challenge</div>
          </div>
          
          <h2 className="section-title mt-5">
            Lack of Trust in Fund Usage
          </h2>
          
          <p className="section-des mt-5">
            Billions of dollars are collected annually by NGOs, CSR programs, crowdfunding platforms, 
            and charitable institutions, but most still rely on outdated, non-verifiable systems.
          </p>
        </motion.div>

        {/* Problem Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-10 mb-12">
          {problems.map((problem, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 30 }}
              animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 30 }}
              transition={{ duration: 0.5, delay: index * 0.1 }}
            >
              <GlassCard variant={problem.variant} className="p-10">
                <div className="text-[#183EC2] mb-4">{problem.icon}</div>
                <h3 className="text-xl font-inter font-bold text-gray-900 mb-2 tracking-tight">{problem.title}</h3>
                <p className="text-gray-600">{problem.description}</p>
              </GlassCard>
            </motion.div>
          ))}
        </div>

        {/* Current Reality */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 20 }}
          transition={{ duration: 0.6, delay: 0.4 }}
        >
          <GlassCard variant="gradient" className="p-10 mb-12">
            <h3 className="text-2xl font-inter font-bold text-gray-900 mb-6 tracking-tight">Current Reality</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {currentReality.map((item, index) => (
                <div key={index} className="flex items-start gap-3">
                  <svg className="w-5 h-5 text-[#183EC2] mt-0.5 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
                  </svg>
                  <span className="text-gray-700">{item}</span>
                </div>
              ))}
            </div>
          </GlassCard>
        </motion.div>

        {/* Trust Crisis Statement */}
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={isInView ? { opacity: 1, scale: 1 } : { opacity: 0, scale: 0.95 }}
          transition={{ duration: 0.6, delay: 0.6 }}
        >
          <GlassCard variant="gradient" className="p-10 text-center mb-12 bg-gradient-to-b from-black to-[#001E80]">
            <svg className="w-16 h-16 mx-auto mb-4 text-yellow-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
            </svg>
            <p className="text-xl md:text-2xl font-bold leading-relaxed text-white">
              "A single instance of fund misuse can destroy years of credibility, and without verifiable 
              records, recovering trust becomes nearly impossible."
            </p>
          </GlassCard>
        </motion.div>

        {/* Impact */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 20 }}
          transition={{ duration: 0.6, delay: 0.8 }}
        >
          <h3 className="text-2xl font-inter font-bold text-gray-900 mb-6 text-center tracking-tight">The Cascading Impact</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {impacts.map((impact, index) => (
              <GlassCard key={index} variant={index % 3 === 0 ? 'blue' : index % 3 === 1 ? 'purple' : 'indigo'} className="p-4">
                <div className="flex items-start gap-3">
                  <svg className="w-5 h-5 text-[#183EC2] mt-0.5 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
                  </svg>
                  <span className="text-gray-700 text-sm">{impact}</span>
                </div>
              </GlassCard>
            ))}
          </div>
        </motion.div>
      </div>
    </section>
  );
};
