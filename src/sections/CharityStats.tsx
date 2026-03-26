"use client";
import productImage from "@/assets/product-image.png";
import pyramidImage from "@/assets/pyramid.png";
import tubeImage from "@/assets/tube.png";
import Image from "next/image";
import { motion, useScroll, useTransform } from "framer-motion";
import { useRef, useEffect, useState } from "react";
import { ApiService } from "@/lib/api";
import { GlassCardWithGlow } from "@/components/GlassCard";

export const CharityStats = () => {
  const sectionRef = useRef(null);
  const { scrollYProgress } = useScroll({
    target: sectionRef,
    offset: ["start end", "end start"],
  });

  const translateY = useTransform(scrollYProgress, [0, 1], [150, -150]);
  
  const [stats, setStats] = useState({
    totalCharities: 0,
    totalDonations: 0,
    totalAmount: 0,
  });

  useEffect(() => {
    const loadStats = async () => {
      try {
        const charities = await ApiService.getCharities();
        const approvedCharities = charities.filter(c => c.status === 'approved');
        
        setStats({
          totalCharities: approvedCharities.length,
          totalDonations: approvedCharities.reduce((sum, c) => sum + (Number(c.raisedAmount) > 0 ? 1 : 0), 0),
          totalAmount: approvedCharities.reduce((sum, c) => sum + Number(c.raisedAmount), 0),
        });
      } catch (error) {
        console.error('Failed to load stats:', error);
      }
    };

    loadStats();
  }, []);

  return (
    <section ref={sectionRef} className="bg-gradient-to-b from-[#FFFFFF] to-[#D2DCFF] py-24 overflow-x-clip relative">
      {/* Background pattern to make glass effect visible */}
      <div className="absolute inset-0" style={{
        backgroundImage: 'radial-gradient(circle at 30% 50%, rgba(24, 62, 194, 0.08) 0%, transparent 50%), radial-gradient(circle at 70% 80%, rgba(168, 85, 247, 0.08) 0%, transparent 50%)',
      }} />
      
      <div className="container relative z-10">
        <div className="max-w-[540px] mx-auto">
          <div className="flex justify-center">
            <div className="tag">Transparency in Action</div>
          </div>

          <h2 className="text-center text-3xl md:text-[54px] md:leading-[60px] font-bold tracking-tighter bg-gradient-to-b from-black to-[#001E80] text-transparent bg-clip-text mt-5">
            Track every donation on the blockchain
          </h2>
          <p className="section-des mt-5">
            Every contribution is recorded on the blockchain, ensuring complete transparency 
            and accountability. See exactly where your donations go.
          </p>
        </div>

        <div className="relative mt-10">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-4xl mx-auto">
            <GlassCardWithGlow className="p-8 text-center">
              <div className="text-4xl font-inter font-bold text-[#001E80] mb-2">{stats.totalCharities}</div>
              <div className="text-gray-600 font-medium">Verified Charities</div>
            </GlassCardWithGlow>
            
            <GlassCardWithGlow className="p-8 text-center">
              <div className="text-4xl font-inter font-bold text-[#001E80] mb-2">₹{(stats.totalAmount * 85000).toLocaleString('en-IN')}</div>
              <div className="text-gray-600 font-medium">Total Donated</div>
            </GlassCardWithGlow>
            
            <GlassCardWithGlow className="p-8 text-center">
              <div className="text-4xl font-inter font-bold text-[#001E80] mb-2">{stats.totalDonations}</div>
              <div className="text-gray-600 font-medium">Active Campaigns</div>
            </GlassCardWithGlow>
          </div>

          <motion.img
            src={pyramidImage.src}
            alt="Pyramid image"
            height={262}
            width={262}
            className="hidden md:block absolute -right-36 -top-32"
            style={{
              translateY: translateY,
            }}
          />
          <motion.img
            src={tubeImage.src}
            alt="Tube image"
            height={248}
            width={248}
            className="hidden md:block absolute bottom-24 -left-36"
            style={{
              translateY: translateY,
            }}
          />
        </div>
      </div>
    </section>
  );
};
