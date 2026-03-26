"use client";

import { ReactNode } from 'react';
import { motion } from 'framer-motion';

interface GlassCardProps {
  children: ReactNode;
  className?: string;
  variant?: 'default' | 'hover' | 'gradient' | 'blue' | 'purple' | 'indigo';
  animate?: boolean;
}

export const GlassCard = ({ 
  children, 
  className = '', 
  variant = 'default',
  animate = true 
}: GlassCardProps) => {
  const baseStyles = "relative backdrop-blur-2xl border-2 rounded-3xl overflow-hidden shadow-[0_8px_32px_0_rgba(31,38,135,0.37)] shadow-lg";
  
  const variants = {
    default: "bg-white/60 border-white/80",
    hover: "bg-white/60 border-white/80 hover:bg-white/70 hover:shadow-[0_12px_48px_0_rgba(31,38,135,0.45)] hover:scale-[1.03] transition-all duration-300 hover:border-white/90",
    gradient: "bg-white/60 border-white/80 before:absolute before:inset-0 before:bg-gradient-to-br before:from-white/40 before:to-transparent before:pointer-events-none",
    blue: "bg-gradient-to-br from-blue-50/80 to-white/60 border-blue-200/60 hover:from-blue-100/80 hover:to-white/70 hover:border-blue-300/70 hover:scale-[1.03] transition-all duration-300",
    purple: "bg-gradient-to-br from-purple-50/80 to-white/60 border-purple-200/60 hover:from-purple-100/80 hover:to-white/70 hover:border-purple-300/70 hover:scale-[1.03] transition-all duration-300",
    indigo: "bg-gradient-to-br from-indigo-50/80 to-white/60 border-indigo-200/60 hover:from-indigo-100/80 hover:to-white/70 hover:border-indigo-300/70 hover:scale-[1.03] transition-all duration-300",
  };

  const CardWrapper = animate ? motion.div : 'div';
  const animationProps = animate ? {
    initial: { opacity: 0, y: 20 },
    whileInView: { opacity: 1, y: 0 },
    viewport: { once: true },
    transition: { duration: 0.5 }
  } : {};

  return (
    <CardWrapper 
      className={`${baseStyles} ${variants[variant]} ${className}`}
      {...animationProps}
    >
      {/* Glass reflection effect - more visible */}
      <div className="absolute inset-0 bg-gradient-to-br from-white/40 via-white/10 to-transparent pointer-events-none rounded-3xl" />
      
      {/* Shimmer effect - more prominent */}
      <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/30 to-transparent -translate-x-full animate-shimmer" />
      
      {/* Inner glow for depth */}
      <div className="absolute inset-0 rounded-3xl shadow-[inset_0_0_20px_rgba(255,255,255,0.3)] pointer-events-none" />
      
      {/* Content */}
      <div className="relative z-10">
        {children}
      </div>
    </CardWrapper>
  );
};

// Specific card variants for different use cases
export const GlassCardWithGlow = ({ children, className = '' }: { children: ReactNode; className?: string }) => {
  return (
    <motion.div
      className={`relative ${className}`}
      whileHover={{ scale: 1.03 }}
      transition={{ duration: 0.3 }}
    >
      {/* Glow effect - more visible */}
      <div className="absolute -inset-2 bg-gradient-to-r from-[#183EC2]/40 via-purple-500/40 to-[#183EC2]/40 rounded-3xl blur-2xl opacity-60 group-hover:opacity-90 transition duration-300 animate-glow" />
      
      {/* Glass card */}
      <div className="relative backdrop-blur-2xl bg-white/60 border-2 border-white/80 rounded-3xl p-8 shadow-[0_8px_32px_0_rgba(31,38,135,0.37)] shadow-lg">
        {/* Glass reflection - more visible */}
        <div className="absolute inset-0 bg-gradient-to-br from-white/40 via-white/10 to-transparent pointer-events-none rounded-3xl" />
        
        {/* Inner glow */}
        <div className="absolute inset-0 rounded-3xl shadow-[inset_0_0_20px_rgba(255,255,255,0.3)] pointer-events-none" />
        
        <div className="relative z-10">
          {children}
        </div>
      </div>
    </motion.div>
  );
};

export const GlassCardInteractive = ({ children, className = '' }: { children: ReactNode; className?: string }) => {
  return (
    <motion.div
      className={`relative backdrop-blur-2xl bg-white/60 border-2 border-white/80 rounded-3xl p-8 shadow-[0_8px_32px_0_rgba(31,38,135,0.37)] shadow-lg cursor-pointer ${className}`}
      whileHover={{ 
        scale: 1.05,
        backgroundColor: "rgba(255, 255, 255, 0.75)",
        boxShadow: "0 12px 48px 0 rgba(31,38,135,0.45)",
        borderColor: "rgba(255, 255, 255, 0.95)"
      }}
      whileTap={{ scale: 0.98 }}
      transition={{ duration: 0.2 }}
    >
      {/* Glass reflection - more visible */}
      <div className="absolute inset-0 bg-gradient-to-br from-white/40 via-white/10 to-transparent pointer-events-none rounded-3xl" />
      
      {/* Animated gradient border on hover */}
      <div className="absolute inset-0 rounded-3xl bg-gradient-to-r from-[#183EC2]/30 via-purple-500/30 to-[#183EC2]/30 opacity-0 hover:opacity-100 transition-opacity duration-300" />
      
      {/* Inner glow */}
      <div className="absolute inset-0 rounded-3xl shadow-[inset_0_0_20px_rgba(255,255,255,0.3)] pointer-events-none" />
      
      <div className="relative z-10">
        {children}
      </div>
    </motion.div>
  );
};
