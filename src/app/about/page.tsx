"use client";

import { motion } from "framer-motion";
import { useRef } from "react";
import { useInView } from "framer-motion";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Header } from "@/sections/Header";
import { Footer } from "@/sections/Footer";
import { ArrowLeft, Heart, Users, Shield, TrendingUp, Mail, Sparkles, Target, Award } from "lucide-react";
import cogImage from "@/assets/cog.png";
import cylinderImage from "@/assets/cylinder.png";

export default function AboutPage() {
  const sectionRef = useRef(null);
  const isInView = useInView(sectionRef, { once: true, margin: "-100px" });
  const router = useRouter();

  const stats = [
    { value: "₹10,000Cr+", label: "Announced for Education" },
    { value: "₹5,000Cr+", label: "Allocated for Farmers" },
    { value: "₹20,000Cr+", label: "Budgeted for Healthcare" },
    { value: "70%", label: "Never Reaches Recipients" },
  ];

  const values = [
    {
      icon: <Shield className="w-8 h-8" />,
      title: "Transparency First",
      desc: "Every transaction recorded on blockchain for permanent verification",
      color: "from-blue-500 to-indigo-600"
    },
    {
      icon: <Heart className="w-8 h-8" />,
      title: "Impact Driven",
      desc: "Ensuring funds reach those who need them most",
      color: "from-red-500 to-pink-600"
    },
    {
      icon: <Users className="w-8 h-8" />,
      title: "Community Focused",
      desc: "Building trust between donors, NGOs, and beneficiaries",
      color: "from-green-500 to-emerald-600"
    },
    {
      icon: <TrendingUp className="w-8 h-8" />,
      title: "Innovation Led",
      desc: "Using cutting-edge technology to solve real problems",
      color: "from-purple-500 to-pink-600"
    },
  ];

  return (
    <div className="min-h-screen">
      <Header />

      {/* Hero Section */}
      <section
        className="relative pt-32 pb-40 overflow-hidden"
        style={{ background: "radial-gradient(ellipse 200% 100% at bottom left, #183EC2, #EAEEFE 100%)" }}
      >
        {/* Animated Background Elements */}
        <motion.img
          src={cogImage.src}
          alt="Blockchain"
          className="absolute top-20 right-10 w-40 h-40 opacity-10"
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
          className="absolute bottom-20 left-10 w-32 h-32 opacity-10"
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
            className="max-w-5xl mx-auto text-center"
          >
            <div className="inline-flex items-center gap-2 bg-white/20 backdrop-blur-sm border border-white/30 px-4 py-2 rounded-full mb-6">
              <Sparkles className="w-4 h-4 text-white" />
              <span className="text-sm text-white font-medium">Our Mission</span>
            </div>

            <h1 className="text-5xl md:text-7xl font-bold tracking-tighter text-white mb-8 leading-tight">
              Transforming Trust-Based
              <span className="block bg-gradient-to-r from-white via-blue-100 to-white bg-clip-text text-transparent">
                Into Proof-Based Funding
              </span>
            </h1>

            <p className="text-xl md:text-2xl text-white/90 max-w-3xl mx-auto leading-relaxed">
              India's government schemes have the money—but not the proof to reach those who need it most
            </p>
          </motion.div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="relative -mt-20 pb-20">
        <div className="container mx-auto px-4">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="glass-card p-8 md:p-12"
          >
            <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
              {stats.map((stat, index) => (
                <motion.div
                  key={stat.label}
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ duration: 0.5, delay: 0.3 + index * 0.1 }}
                  className="text-center"
                >
                  <div className="text-3xl md:text-4xl font-bold bg-gradient-to-b from-black to-[#001E80] bg-clip-text text-transparent mb-2">
                    {stat.value}
                  </div>
                  <div className="text-sm text-[#010D3E]/70">
                    {stat.label}
                  </div>
                </motion.div>
              ))}
            </div>
          </motion.div>
        </div>
      </section>

      {/* The Problem Section */}
      <section className="py-20 bg-gradient-to-b from-white to-[#EAEEFE]">
        <div className="container mx-auto px-4">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="max-w-4xl mx-auto"
          >
            <div className="glass-card bg-gradient-to-br from-[#183EC2] to-[#001E80] p-10 md:p-16 text-white relative overflow-hidden">
              <div className="absolute top-0 right-0 w-64 h-64 bg-white/10 rounded-full blur-3xl" />
              <div className="absolute bottom-0 left-0 w-64 h-64 bg-white/10 rounded-full blur-3xl" />
              
              <div className="relative z-10">
                <div className="w-16 h-16 rounded-2xl bg-white/20 backdrop-blur-sm flex items-center justify-center mb-6">
                  <Target className="w-8 h-8 text-white" />
                </div>
                <p className="text-2xl md:text-3xl font-bold leading-relaxed mb-6">
                  ₹10,000 crore announced for education. ₹5,000 crore for farmers. ₹20,000 crore for healthcare.
                </p>
                <p className="text-lg md:text-xl opacity-90 leading-relaxed">
                  Beautiful schemes with noble intentions. But in the end, <span className="font-bold">the money never finds the actual people in need on the ground.</span>
                </p>
              </div>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Our Story Section */}
      <section ref={sectionRef} className="py-20 bg-white">
        <div className="container mx-auto px-4">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 20 }}
            transition={{ duration: 0.6 }}
            className="max-w-4xl mx-auto"
          >
            <div className="text-center mb-16">
              <h2 className="section-title mb-4">
                Our Story
              </h2>
              <p className="section-des">
                Three friends from Rajasthan on a mission to end corruption
              </p>
            </div>

            <div className="space-y-8 text-lg text-[#010D3E] leading-relaxed">
              <motion.div
                initial={{ opacity: 0, x: -20 }}
                animate={isInView ? { opacity: 1, x: 0 } : { opacity: 0, x: -20 }}
                transition={{ duration: 0.6, delay: 0.2 }}
                className="glass-card p-8"
              >
                <p>
                  Three friends from Rajasthan watched corruption systematically destroy everything India desperately needs.
                </p>
              </motion.div>

              <motion.div
                initial={{ opacity: 0, x: 20 }}
                animate={isInView ? { opacity: 1, x: 0 } : { opacity: 0, x: 20 }}
                transition={{ duration: 0.6, delay: 0.3 }}
                className="glass-card p-8"
              >
                <p>
                  We've witnessed hospital tragedies firsthand—families begging for medicine already paid for, <span className="font-bold">body parts misplaced</span> because no one could prove where emergency funds actually went. We've seen selfless NGO workers pour their lives into serving the poor, only to watch rich professional donors walk away. Why? Because they know <span className="font-bold">70% of donated money never reaches the intended people.</span>
                </p>
              </motion.div>

              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 20 }}
                transition={{ duration: 0.6, delay: 0.4 }}
                className="glass-card bg-gradient-to-br from-yellow-50 to-orange-50 p-10 border-2 border-yellow-200"
              >
                <div className="flex items-start gap-4">
                  <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-yellow-500 to-orange-600 flex items-center justify-center flex-shrink-0">
                    <Award className="w-6 h-6 text-white" />
                  </div>
                  <div>
                    <p className="text-xl font-bold text-black/80 mb-2">
                      The Breakthrough Moment
                    </p>
                    <p className="text-lg">
                      That's when it hit us: The problem wasn't lack of generosity. India gives billions every year. The problem was <span className="font-bold">lack of proof</span>.
                    </p>
                  </div>
                </div>
              </motion.div>

              <motion.div
                initial={{ opacity: 0, x: -20 }}
                animate={isInView ? { opacity: 1, x: 0 } : { opacity: 0, x: -20 }}
                transition={{ duration: 0.6, delay: 0.5 }}
                className="glass-card p-8"
              >
                <p className="text-xl font-bold text-black/80 mb-4">
                  Rich donors hesitate because they can't verify. Governments invest because they must, but can't track. Genuine organizations suffer because they can't prove.
                </p>
              </motion.div>

              <motion.div
                initial={{ opacity: 0, x: 20 }}
                animate={isInView ? { opacity: 1, x: 0 } : { opacity: 0, x: 20 }}
                transition={{ duration: 0.6, delay: 0.6 }}
                className="glass-card p-8"
              >
                <p>
                  So we built Veritrax—not just another donation platform, but <span className="font-bold">proof infrastructure</span>. A system where every rupee collected, every expense made, every outcome delivered becomes <span className="font-bold">permanently verifiable</span> on the blockchain.
                </p>
              </motion.div>

              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 20 }}
                transition={{ duration: 0.6, delay: 0.7 }}
                className="glass-card p-8"
              >
                <p>
                  From hospital medicine procurement to government scheme tracking to NGO expense verification—Veritrax makes corruption impossible to hide and genuine work impossible to ignore.
                </p>
              </motion.div>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Values Section */}
      <section className="py-20 bg-gradient-to-b from-[#EAEEFE] to-white">
        <div className="container mx-auto px-4">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-16"
          >
            <h2 className="section-title mb-4">
              Our Values
            </h2>
            <p className="section-des max-w-2xl mx-auto">
              The principles that guide everything we do
            </p>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 max-w-7xl mx-auto">
            {values.map((value, index) => (
              <motion.div
                key={value.title}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
                whileHover={{ scale: 1.05, y: -5 }}
                className="glass-card-hover p-6 group cursor-pointer"
              >
                <div className={`w-14 h-14 rounded-2xl bg-gradient-to-br ${value.color} flex items-center justify-center text-white mb-4 group-hover:scale-110 transition-transform duration-300`}>
                  {value.icon}
                </div>
                <h3 className="font-bold text-lg mb-2 bg-gradient-to-b from-black to-[#001E80] bg-clip-text text-transparent">
                  {value.title}
                </h3>
                <p className="text-sm text-[#010D3E]/70 leading-relaxed">
                  {value.desc}
                </p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 bg-white">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6 }}
              className="glass-card p-12 text-center"
            >
              <div className="w-20 h-20 rounded-full bg-gradient-to-br from-[#183EC2] to-[#001E80] flex items-center justify-center mx-auto mb-6">
                <Mail className="w-10 h-10 text-white" />
              </div>

              <h2 className="text-4xl md:text-5xl font-bold tracking-tighter bg-gradient-to-b from-black to-[#001E80] text-transparent bg-clip-text mb-4">
                Partner with Us
              </h2>
              <p className="text-xl text-[#010D3E]/80 mb-10 max-w-2xl mx-auto">
                Ready to make your funding proof-based instead of trust-based? Let's talk.
              </p>

              <div className="flex flex-col sm:flex-row gap-4 justify-center mb-8">
                <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
                  <Link 
                    href="/contact" 
                    className="inline-flex items-center gap-2 px-8 py-4 bg-gradient-to-r from-[#183EC2] to-[#001E80] text-white rounded-xl font-medium hover:shadow-lg transition-all text-lg"
                  >
                    Book a Demo
                  </Link>
                </motion.div>
                <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
                  <button
                    onClick={() => {
                      router.push('/');
                      setTimeout(() => {
                        document.getElementById('how-it-works')?.scrollIntoView({ behavior: 'smooth' });
                      }, 100);
                    }}
                    className="inline-flex items-center gap-2 px-8 py-4 bg-white/60 backdrop-blur-sm hover:bg-white/80 text-[#183EC2] rounded-xl font-medium transition-all text-lg border-2 border-[#183EC2]/20"
                  >
                    View Product
                  </button>
                </motion.div>
              </div>

              <div className="space-y-4 pt-8 border-t border-gray-200">
                <div className="glass-card bg-gradient-to-br from-blue-50 to-indigo-50 p-6">
                  <p className="text-sm text-[#010D3E]/60 mb-2">Email the Founders</p>
                  <a
                    href="mailto:vighnesh0291@gmail.com"
                    className="text-[#183EC2] hover:underline font-medium text-lg"
                  >
                    vighnesh0291@gmail.com
                  </a>
                  <p className="text-sm text-[#010D3E]/60 mt-2">
                    Vighnesh Bhati, Arsh Maheshwari, Dhruv Parihar
                  </p>
                </div>

                <Link 
                  href="/contact" 
                  className="inline-block text-[#183EC2] hover:underline font-medium"
                >
                  Join as a Pilot Partner →
                </Link>
              </div>

              <p className="text-[#010D3E]/60 max-w-2xl mx-auto mt-8">
                Ideal for NGOs, CSR teams, hospitals, government schemes, and anyone handling public/shared funds.
              </p>
            </motion.div>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
}
