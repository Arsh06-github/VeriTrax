"use client";

import { useState, useEffect } from 'react';
import { DemoState, initialState } from './types';
import { Step1Campaign } from './steps/Step1Campaign';
import { Step2WalletConnect } from './steps/Step2WalletConnect';
import { Step3EscrowLocking } from './steps/Step3EscrowLocking';
import { Step4ProofSubmission } from './steps/Step4ProofSubmission';
import { Step5HashAnchoring } from './steps/Step5HashAnchoring';
import { Step6FundRelease } from './steps/Step6FundRelease';
import { Step7Dashboard } from './steps/Step7Dashboard';
import { Step8Complete } from './steps/Step8Complete';

const STORAGE_KEY = 'veritraxDemoState';

export const DemoSteps = () => {
  const [state, setState] = useState<DemoState>(initialState);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const saved = localStorage.getItem(STORAGE_KEY);
    if (saved) {
      try {
        setState(JSON.parse(saved));
      } catch (e) {
        console.error('Failed to parse saved state');
      }
    }
  }, []);

  useEffect(() => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
  }, [state]);

  const nextStep = () => {
    setState(prev => ({ ...prev, step: Math.min(prev.step + 1, 8) }));
  };

  const prevStep = () => {
    setState(prev => ({ ...prev, step: Math.max(prev.step - 1, 1) }));
  };

  const resetDemo = () => {
    localStorage.removeItem(STORAGE_KEY);
    setState(initialState);
  };

  const updateState = (updates: Partial<DemoState>) => {
    setState(prev => ({ ...prev, ...updates }));
  };

  return (
    <div className="min-h-screen py-12 px-4">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="text-center mb-12">
          <h1 className="text-5xl font-inter font-bold text-gray-900 mb-4 tracking-tight">
            Veritrax Live Demo
          </h1>
          <p className="text-xl text-gray-600">Transparent Donations on Blockchain</p>
          
          {/* Step Indicator */}
          <div className="mt-8 flex items-center justify-center gap-2">
            {[1, 2, 3, 4, 5, 6, 7, 8].map((step) => (
              <div
                key={step}
                className={`h-2 w-12 rounded-full transition-all duration-300 ${
                  step === state.step
                    ? 'bg-[#183EC2] w-16'
                    : step < state.step
                    ? 'bg-[#183EC2]/60'
                    : 'bg-gray-300'
                }`}
              />
            ))}
          </div>
          <p className="mt-4 text-sm text-gray-500 font-medium">
            Step {state.step} of 8
          </p>
        </div>

        {/* Step Content */}
        <div className="backdrop-blur-2xl bg-white/60 border-2 border-white/80 rounded-3xl p-8 shadow-[0_8px_32px_0_rgba(31,38,135,0.37)] shadow-lg">
          {state.step === 1 && <Step1Campaign state={state} updateState={updateState} nextStep={nextStep} />}
          {state.step === 2 && <Step2WalletConnect state={state} updateState={updateState} nextStep={nextStep} />}
          {state.step === 3 && <Step3EscrowLocking state={state} updateState={updateState} nextStep={nextStep} />}
          {state.step === 4 && <Step4ProofSubmission state={state} updateState={updateState} nextStep={nextStep} />}
          {state.step === 5 && <Step5HashAnchoring state={state} updateState={updateState} nextStep={nextStep} />}
          {state.step === 6 && <Step6FundRelease state={state} updateState={updateState} nextStep={nextStep} />}
          {state.step === 7 && <Step7Dashboard state={state} updateState={updateState} nextStep={nextStep} />}
          {state.step === 8 && <Step8Complete state={state} resetDemo={resetDemo} />}
        </div>

        {/* Navigation */}
        <div className="mt-8 flex justify-between items-center">
          <button
            onClick={prevStep}
            disabled={state.step === 1}
            className="px-6 py-3 bg-gray-200 text-gray-700 rounded-lg font-medium disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-300 transition-colors"
          >
            ← Previous
          </button>
          
          <button
            onClick={resetDemo}
            className="px-6 py-3 bg-red-500 text-white rounded-lg font-medium hover:bg-red-600 transition-colors"
          >
            Reset Demo
          </button>
        </div>

        {/* Footer */}
        <div className="mt-12 text-center text-sm text-gray-500">
          <p>Simulated for demo purposes - Real implementation on Polygon with Wagmi/Viem</p>
        </div>
      </div>
    </div>
  );
};
