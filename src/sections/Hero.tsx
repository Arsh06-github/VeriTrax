"use client";
import ArrowIcon from "@/assets/arrow-right.svg";
import cogImage from "@/assets/cog.png";
import cylinderImage from "@/assets/cylinder.png";
import noodleImage from "@/assets/noodle.png";
import { motion, useScroll, useTransform } from "framer-motion";
import Image from "next/image";
import { useRef } from "react";
import { useWeb3 } from "@/hooks/useWeb3";
import { useAuth } from "@/hooks/useAuth";
import { useRouter } from "next/navigation";

export const Hero = () => {
  const heroRef = useRef(null);
  const router = useRouter();
  const { scrollYProgress } = useScroll({
    target: heroRef,
    offset: ["start end", "end start"],
  });

  const translateY = useTransform(scrollYProgress, [0, 1], [150, -150]);
  const { account } = useWeb3();
  const { user } = useAuth();

  const scrollToCharities = () => {
    document.getElementById('charities')?.scrollIntoView({ behavior: 'smooth' });
  };

  const handleGetStarted = () => {
    if (user) {
      scrollToCharities();
    } else {
      router.push('/signup');
    }
  };

  const handleLearnMore = () => {
    document.getElementById('how-it-works')?.scrollIntoView({ behavior: 'smooth' });
  };

  return (
    <section
      ref={heroRef}
      className="pt-8 pb-20 md:pt-5 md:pb-10 overflow-x-clip"
      style={{ background: "radial-gradient(ellipse 200% 100% at bottom left, #183EC2, #EAEEFE 100%)" }}
    >
      <div className="container">
        <div className="md:flex items-center">
          <div className="md:w-[478px]">
            <div className="text-sm inline-flex border border-[#222]/10 px-3 py-1 rounded-lg tracking-tight bg-white/80">
              Veritrax Platform-as-a-Service
            </div>
            <h1 className="text-5xl md:text-7xl font-bold tracking-tighter bg-gradient-to-b from-black to-[#001E80] text-transparent bg-clip-text mt-6">
              Transparent Fund Infrastructure for Proof-Based Funding
            </h1>
            <p className="text-xl text-[#010D3E] tracking-tight mt-6">
              Transform trust-based funding into proof-based funding. Every fund movement becomes cryptographically 
              verifiable evidence on the blockchain. Built-in compliance, transparency, and accountability for NGOs, 
              CSR programs, and charitable institutions.
            </p>
            <div className="flex gap-1 items-center mt-[30px]">
              <button 
                onClick={handleGetStarted}
                className="btn btn-primary"
              >
                {user ? (account ? 'Browse Charities' : 'Connect Wallet') : 'Get Started'}
              </button>
              <button onClick={handleLearnMore} className="btn btn-text flex gap-1">
                <span>Learn more</span>
                <ArrowIcon className="h-5 w-5" />
              </button>
              <button 
                onClick={() => router.push('/demo')}
                className="btn bg-gradient-to-r from-purple-600 to-[#183EC2] text-white hover:shadow-lg transition-all duration-300"
              >
                Raw Demo
              </button>
            </div>
          </div>
          <div className="mt-20 md:mt-0 md:h-[648px] md:flex-1 relative">
            <motion.img
              src={cogImage.src}
              alt="Blockchain technology"
              className="md:absolute md:h-full md:w-auto md:max-w-none md:-left-6 lg:left-0"
              animate={{
                translateY: [-30, 30],
              }}
              transition={{
                repeat: Infinity,
                repeatType: "mirror",
                duration: 3,
                ease: "easeInOut",
              }}
            />
            <motion.img
              src={cylinderImage.src}
              width={220}
              height={220}
              alt="Secure donations"
              className="hidden md:block -top-8 -left-32 md:absolute"
              style={{
                translateY: translateY,
              }}
            />
            <motion.img
              src={noodleImage.src}
              width={220}
              alt="Transparent tracking"
              className="hidden lg:block top-[524px] left-[448px] absolute rotate-[30deg]"
              style={{
                rotate: 30,
                translateY: translateY,
              }}
            />
          </div>
        </div>
      </div>
    </section>
  );
};
