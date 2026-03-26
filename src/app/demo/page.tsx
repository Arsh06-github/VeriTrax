"use client";

import { useState, useEffect, useRef } from 'react';
import { ThreeBackground } from './ThreeBackground';
import { DemoSteps } from './DemoSteps';
import Head from 'next/head';

export default function DemoPage() {
  return (
    <>
      <Head>
        <title>Veritrax Working - Live Demo</title>
        <meta name="description" content="Experience Veritrax blockchain donation platform in action. See transparent, verifiable donations from start to finish." />
      </Head>
      <div className="relative min-h-screen bg-gradient-to-b from-[#EAEEFE] to-white overflow-hidden">
        <ThreeBackground />
        <div className="relative z-10">
          <DemoSteps />
        </div>
      </div>
    </>
  );
}
