"use client";

import logo from "@/assets/logosaas.png";
import SocialX from "@/assets/social-x.svg";
import SocialInsta from "@/assets/social-insta.svg";
import SocialLinkedin from "@/assets/social-linkedin.svg";
import SocialPin from "@/assets/social-pin.svg";
import SocialYoutube from "@/assets/social-youtube.svg";
import Image from "next/image";
import Link from "next/link";

export const Footer = () => {
  const scrollToSection = (id: string) => {
    document.getElementById(id)?.scrollIntoView({ behavior: 'smooth' });
  };

  return (
    <footer id="about" className="bg-black text-[#BCBCBC] text-sm py-10 text-center">
      <div className="container">
        <div className="inline-flex relative before:content-[''] before:top-2 before:bottom-0 before:w-full before:blur before:bg-[linear-gradient(to_right,#F87BFF,#FB92CF,#FFDD9B,#C2F0B1,#2FD8FE)] before:absolute">
          <Image src={logo} alt="Veritrax logo" height={40} className="relative" />
        </div>
        <nav className="flex flex-col md:flex-row md:justify-center gap-6 mt-6">
          <button onClick={() => scrollToSection('charities')} className="hover:text-white transition">
            Charities
          </button>
          <button onClick={() => scrollToSection('how-it-works')} className="hover:text-white transition">
            How It Works
          </button>
          <button onClick={() => scrollToSection('testimonials')} className="hover:text-white transition">
            Testimonials
          </button>
          <Link href="/about" className="hover:text-white transition">
            About
          </Link>
          <Link href="/contact" className="hover:text-white transition">
            Contact
          </Link>
          <Link href="/privacy" className="hover:text-white transition">
            Privacy Policy
          </Link>
        </nav>

        <div className="flex justify-center gap-6 mt-6">
          <a href="https://twitter.com" target="_blank" rel="noopener noreferrer" className="hover:opacity-80 transition">
            <SocialX />
          </a>
          <a href="https://instagram.com" target="_blank" rel="noopener noreferrer" className="hover:opacity-80 transition">
            <SocialInsta />
          </a>
          <a href="https://linkedin.com" target="_blank" rel="noopener noreferrer" className="hover:opacity-80 transition">
            <SocialLinkedin />
          </a>
          <a href="https://pinterest.com" target="_blank" rel="noopener noreferrer" className="hover:opacity-80 transition">
            <SocialPin />
          </a>
          <a href="https://youtube.com" target="_blank" rel="noopener noreferrer" className="hover:opacity-80 transition">
            <SocialYoutube />
          </a>
        </div>
        <p className="mt-6">&copy; 2026 Veritrax. All rights reserved. Built in India.</p>
      </div>
    </footer>
  );
};
