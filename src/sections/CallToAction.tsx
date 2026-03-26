"use client";
import ArrowRight from "@/assets/arrow-right.svg";
import starImage from "@/assets/star.png";
import springImage from "@/assets/spring.png";
import { motion, useScroll, useTransform } from "framer-motion";
import { useRef } from "react";
import { useWeb3 } from "@/hooks/useWeb3";
import { useAuth } from "@/hooks/useAuth";
import { useRouter } from "next/navigation";

export const CallToAction = () => {
  const sectionRef = useRef(null);
  const router = useRouter();
  const { scrollYProgress } = useScroll({
    target: sectionRef,
    offset: ["start end", "end start"],
  });

  const translateY = useTransform(scrollYProgress, [0, 1], [150, -150]);
  const { account } = useWeb3();
  const { user } = useAuth();

  const handlePrimaryAction = () => {
    if (user) {
      if (account) {
        document.getElementById('charities')?.scrollIntoView({ behavior: 'smooth' });
      } else {
        // Trigger wallet connect
        document.querySelector<HTMLButtonElement>('button:has-text("Connect Wallet")')?.click();
      }
    } else {
      router.push('/signup');
    }
  };

  const handleLearnMore = () => {
    document.getElementById('how-it-works')?.scrollIntoView({ behavior: 'smooth' });
  };

  return (
    <section ref={sectionRef} className="bg-gradient-to-b from-white to-[#D2DCFF] py-24 overflow-x-clip">
      <div className="container">
        <div className="section-heading relative">
          <h2 className="section-title">Start making a difference today</h2>
          <p className="section-des mt-5">
            Join Veritrax's community of transparent donors and verified charities. Every donation is tracked 
            on the blockchain, ensuring your contribution makes a real impact.
          </p>

          <motion.img
            src={starImage.src}
            alt="star image"
            width={360}
            className="absolute -left-[350px] -top-[137px]"
            style={{
              translateY,
            }}
          />
          <motion.img
            src={springImage.src}
            alt="spring image"
            width={360}
            className="absolute -right-[331px] -top-[19px]"
            style={{
              translateY,
            }}
          />
        </div>

        <div className="flex gap-2 mt-10 justify-center">
          <button onClick={handlePrimaryAction} className="btn btn-primary">
            {user ? (account ? 'Browse Charities' : 'Connect Wallet') : 'Get Started'}
          </button>
          <button onClick={handleLearnMore} className="btn btn-text gap-1">
            <span>Learn more</span>
            <ArrowRight className="h-5 w-5" />
          </button>
        </div>
      </div>
    </section>
  );
};
