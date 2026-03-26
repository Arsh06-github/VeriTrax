import { useState, useEffect } from 'react';
import { DemoState } from '../types';
import { formatETH } from '../utils';

interface Props {
  state: DemoState;
  updateState: (updates: Partial<DemoState>) => void;
  nextStep: () => void;
}

export const Step3EscrowLocking = ({ state, updateState, nextStep }: Props) => {
  const [locking, setLocking] = useState(true);
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setProgress(prev => {
        if (prev >= 100) {
          clearInterval(interval);
          setLocking(false);
          return 100;
        }
        return prev + 10;
      });
    }, 200);

    return () => clearInterval(interval);
  }, []);

  return (
    <div className="space-y-6">
      <h2 className="text-3xl font-inter font-bold text-gray-900 tracking-tight">
        Escrow Locking
      </h2>

      <div className="bg-gradient-to-br from-yellow-50/80 to-white/60 border-2 border-yellow-200/60 rounded-2xl p-8">
        <div className="text-center space-y-6">
          {locking ? (
            <>
              <div className="flex justify-center">
                <div className="relative w-24 h-24">
                  <div className="absolute inset-0 border-4 border-[#183EC2]/20 rounded-full"></div>
                  <div className="absolute inset-0 border-4 border-[#183EC2] rounded-full border-t-transparent animate-spin"></div>
                  <div className="absolute inset-0 flex items-center justify-center">
                    <span className="text-2xl">🔒</span>
                  </div>
                </div>
              </div>
              
              <h3 className="text-2xl font-bold text-gray-900">
                Locking Funds in Smart Contract...
              </h3>
              
              <div className="w-full bg-gray-200 rounded-full h-4">
                <div
                  className="bg-gradient-to-r from-[#183EC2] to-purple-500 h-4 rounded-full transition-all duration-300"
                  style={{ width: `${progress}%` }}
                />
              </div>
              
              <p className="text-gray-600">{progress}% Complete</p>
            </>
          ) : (
            <>
              <div className="flex justify-center mb-6">
                <div className="relative">
                  <div className="w-20 h-20 bg-gradient-to-br from-green-400 to-green-600 rounded-2xl flex items-center justify-center shadow-lg">
                    <svg className="w-12 h-12 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
                    </svg>
                  </div>
                  <div className="absolute -top-1 -right-1 w-6 h-6 bg-green-500 rounded-full border-4 border-white"></div>
                </div>
              </div>
              <h3 className="text-2xl font-inter font-bold text-gray-900 mb-2">
                Funds Locked Successfully
              </h3>
              <p className="text-sm text-gray-500 mb-6">Transaction confirmed on blockchain</p>
              
              <div className="bg-white rounded-xl p-6 space-y-3">
                <div className="flex justify-between items-center py-2 border-b border-gray-100">
                  <span className="text-sm text-gray-500 font-medium">Amount Locked:</span>
                  <span className="font-inter font-bold text-lg text-[#183EC2]">{formatETH(state.amount)}</span>
                </div>
                <div className="flex justify-between items-center py-2 border-b border-gray-100">
                  <span className="text-sm text-gray-500 font-medium">Status:</span>
                  <span className="px-3 py-1 bg-gradient-to-r from-yellow-400 to-orange-500 text-white rounded-lg text-xs font-bold uppercase tracking-wide">
                    Locked
                  </span>
                </div>
                <div className="flex justify-between items-center py-2">
                  <span className="text-sm text-gray-500 font-medium">Contract:</span>
                  <span className="font-mono text-sm text-gray-900 bg-gray-100 px-3 py-1 rounded">0xABC...123</span>
                </div>
              </div>

              <button
                onClick={nextStep}
                className="w-full py-4 bg-gradient-to-r from-[#183EC2] to-purple-600 text-white rounded-xl font-bold text-lg hover:shadow-lg transition-all duration-300 hover:scale-[1.02]"
              >
                Switch to Organization/Needy →
              </button>
            </>
          )}
        </div>
      </div>
    </div>
  );
};
