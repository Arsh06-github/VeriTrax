"use client";
import avatar1 from "@/assets/avatar-1.png";
import avatar2 from "@/assets/avatar-2.png";
import avatar3 from "@/assets/avatar-3.png";
import avatar4 from "@/assets/avatar-4.png";
import avatar5 from "@/assets/avatar-5.png";
import avatar6 from "@/assets/avatar-6.png";
import avatar7 from "@/assets/avatar-7.png";
import avatar8 from "@/assets/avatar-8.png";
import avatar9 from "@/assets/avatar-9.png";
import Image from "next/image";
import { twMerge } from "tailwind-merge";
import { motion } from "framer-motion";
import React from "react";

const testimonials = [
  {
    text: "The transparency of blockchain technology gives me complete confidence in where my donations go. I can track every transaction!",
    imageSrc: avatar1.src,
    name: "Priya Sharma",
    username: "@priya_gives",
  },
  {
    text: "Finally, a charity platform that eliminates the middleman. My donations go directly to the causes I care about.",
    imageSrc: avatar2.src,
    name: "Rahul Verma",
    username: "@rahul_impact",
  },
  {
    text: "As an NGO organizer, Veritrax has revolutionized how we receive and manage donations. The verification process builds trust.",
    imageSrc: avatar3.src,
    name: "Anjali Patel",
    username: "@anjali_ngo",
  },
  {
    text: "I love that I can verify every donation on the blockchain. This is the future of charitable giving in India!",
    imageSrc: avatar4.src,
    name: "Arjun Reddy",
    username: "@arjun_tech",
  },
  {
    text: "The platform is so easy to use, even for someone new to digital payments. Making a difference has never been simpler.",
    imageSrc: avatar5.src,
    name: "Sneha Gupta",
    username: "@sneha_cares",
  },
  {
    text: "Knowing that every rupee is accounted for on the blockchain gives me peace of mind when donating.",
    imageSrc: avatar6.src,
    name: "Vikram Singh",
    username: "@vikram_donor",
  },
  {
    text: "Veritrax's verification system ensures I'm only donating to legitimate charities. That's invaluable for Indian donors.",
    imageSrc: avatar7.src,
    name: "Kavya Iyer",
    username: "@kavya_trust",
  },
  {
    text: "The combination of traditional charity work with blockchain technology is brilliant. This is how it should be done.",
    imageSrc: avatar8.src,
    name: "Aditya Mehta",
    username: "@aditya_change",
  },
  {
    text: "I've donated to three charities through Veritrax and the experience has been seamless every time.",
    imageSrc: avatar9.src,
    name: "Neha Kapoor",
    username: "@neha_donations",
  },
];

const firstColumn = testimonials.slice(0, 3);
const secondColumn = testimonials.slice(3, 6);
const thirdColumn = testimonials.slice(6, 9);

const TestimonialsColumn = (props: {
  className?: string;
  testimonials: typeof testimonials;
  duration?: number;
}) => (
  <div className={props.className}>
    <motion.div
      animate={{
        translateY: "-50%",
      }}
      transition={{
        duration: props.duration || 10,
        repeat: Infinity,
        ease: "linear",
        repeatType: "loop",
      }}
      className="flex flex-col gap-6 pb-6"
    >
      {[...new Array(2)].fill(0).map((_, index) => (
        <React.Fragment key={index}>
          {props.testimonials.map(({ text, imageSrc, name, username }) => (
            <div key={username} className="card">
              <div>{text}</div>
              <div className="flex items-center gap-2 mt-5">
                <Image
                  src={imageSrc}
                  alt={name}
                  width={40}
                  height={40}
                  className="h-10 w-10 rounded-full"
                />
                <div className="flex flex-col">
                  <div className="font-medium tracking-tight leading-5">{name}</div>
                  <div className="leading-5 tracking-tight">{username}</div>
                </div>
              </div>
            </div>
          ))}
        </React.Fragment>
      ))}
    </motion.div>
  </div>
);

export const Testimonials = () => {
  return (
    <section id="testimonials" className="bg-white">
      <div className="container">
        <div className="section-heading">
          <div className="flex justify-center">
            <div className="tag">Testimonials</div>
          </div>
          <h2 className="section-title mt-5">What our donors say</h2>
          <p className="section-des mt-5">
            Join thousands of donors who trust Veritrax for transparent, secure charitable giving.
          </p>
        </div>
        <div className="flex justify-center gap-6 mt-10 [mask-image:linear-gradient(to_bottom,transparent,black_25%,black_75%,transparent)] max-h-[738px] overflow-hidden">
          <TestimonialsColumn testimonials={firstColumn} duration={15} />
          <TestimonialsColumn
            testimonials={secondColumn}
            className="hidden md:block"
            duration={19}
          />
          <TestimonialsColumn
            testimonials={thirdColumn}
            className="hidden lg:block"
            duration={17}
          />
        </div>
      </div>
    </section>
  );
};
