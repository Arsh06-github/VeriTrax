import { useState } from 'react';
import { DemoState } from '../types';
import { formatETH, shortenAddress } from '../utils';

interface Props {
  state: DemoState;
  updateState: (updates: Partial<DemoState>) => void;
  nextStep: () => void;
}

export const Step6FundRelease = ({ state, updateState, nextStep }: Props) => {
  const [releasing, setReleasing] = useState(false);
  const [released, setReleased] = useState(false);

  const releaseFunds = () => {
    setReleasing(true);
    setTimeout(() => {
      setReleasing(false);
      setReleased(true);
    }, 2500);
  };

  return (
    <div className="space-y-6">
      <h2 className="text-3xl font-inter font-bold text-gray-900 tracking-tight">
        x402-Based Fund Release
      </h2>

      {!released ? (
        <div className="space-y-6">
          <div className="bg-gradient-to-br from-blue-50/80 to-white/60 border-2 border-blue-200/60 rounded-2xl p-6">
            <h3 className="font-bold text-lg mb-4">Approval Required</h3>
            
            <div className="space-y-4">
              <div className="bg-white rounded-xl p-4">
                <div className="flex justify-between mb-2">
                  <span className="text-gray-600">Amount to Release:</span>
                  <span className="font-bold text-[#183EC2]">{formatETH(state.amount)}</span>
                </div>
                <div className="flex justify-between mb-2">
                  <span className="text-gray-600">Recipient:</span>
                  <span className="font-mono text-sm">{shortenAddress(state.needyAddress)}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Proofs Verified:</span>
                  <span className="text-green-600 font-bold">✓ {state.proofs.length} files</span>
                </div>
              </div>

              <div className="bg-yellow-50 border-2 border-yellow-200 rounded-xl p-4">
                <p className="text-sm text-gray-700">
                  <span className="font-bold">x402 Protocol:</span> Funds will be released automatically after verification through the x402 authorization standard.
                </p>
              </div>
            </div>
          </div>

          {releasing ? (
            <div className="bg-gradient-to-br from-purple-50/80 to-white/60 border-2 border-purple-200/60 rounded-2xl p-8">
              <div className="text-center space-y-4">
                <div className="flex justify-center">
                  <div className="animate-spin rounded-full h-16 w-16 border-b-4 border-[#183EC2]"></div>
                </div>
                <h3 className="text-xl font-bold text-gray-900">
                  Releasing funds via x402...
                </h3>
                <p className="text-gray-600">Please wait while the transaction is processed</p>
              </div>
            </div>
          ) : (
            <button
              onClick={releaseFunds}
              className="w-full py-4 bg-gradient-to-r from-green-500 to-green-600 text-white rounded-xl font-bold text-lg hover:shadow-lg transition-all duration-300 hover:scale-[1.02]"
            >
              Approve & Release Funds
            </button>
          )}
        </div>
      ) : (
        <div className="space-y-6">
          <div className="bg-gradient-to-br from-green-50/80 to-white/60 border-2 border-green-200/60 rounded-2xl p-8">
            <div className="text-center space-y-4">
              <div className="flex justify-center mb-6">
                <div className="relative">
                  <div className="w-24 h-24 bg-gradient-to-br from-green-400 to-green-600 rounded-2xl flex items-center justify-center shadow-xl">
                    <svg className="w-14 h-14 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                  </div>
                  <div className="absolute -top-2 -right-2 w-8 h-8 bg-green-500 rounded-full border-4 border-white flex items-center justify-center">
                    <svg className="w-4 h-4 text-white" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                    </svg>
                  </div>
                </div>
              </div>
              <h3 className="text-2xl font-inter font-bold text-gray-900">
                Funds Released Successfully
              </h3>
              <p className="text-sm text-gray-500">Transaction completed and verified</p>
              
              <div className="bg-white rounded-xl p-6 space-y-3 border border-gray-200">
                <div className="flex justify-between items-center py-2 border-b border-gray-100">
                  <span className="text-sm text-gray-500 font-medium">Amount Released:</span>
                  <span className="font-inter font-bold text-lg text-green-600">{formatETH(state.amount)}</span>
                </div>
                <div className="flex justify-between items-center py-2 border-b border-gray-100">
                  <span className="text-sm text-gray-500 font-medium">To:</span>
                  <span className="font-mono text-sm text-gray-900 bg-gray-100 px-3 py-1 rounded">{shortenAddress(state.needyAddress)}</span>
                </div>
                <div className="flex justify-between items-center py-2">
                  <span className="text-sm text-gray-500 font-medium">Authorization:</span>
                  <span className="px-3 py-1 bg-gradient-to-r from-green-400 to-green-600 text-white rounded-lg text-xs font-bold uppercase tracking-wide flex items-center gap-1">
                    <svg className="w-3 h-3" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                    </svg>
                    x402 Verified
                  </span>
                </div>
              </div>

              <div className="bg-gradient-to-r from-blue-50 to-indigo-50 border-2 border-blue-200 rounded-xl p-4">
                <div className="flex items-start gap-3">
                  <svg className="w-5 h-5 text-blue-600 mt-0.5 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clipRule="evenodd" />
                  </svg>
                  <p className="text-sm text-gray-700">
                    Funds released via x402 authorization protocol with cryptographic verification
                  </p>
                </div>
              </div>
            </div>
          </div>

          <button
            onClick={nextStep}
            className="w-full py-4 bg-gradient-to-r from-[#183EC2] to-purple-600 text-white rounded-xl font-bold text-lg hover:shadow-lg transition-all duration-300 hover:scale-[1.02]"
          >
            View Transparency Dashboard →
          </button>
        </div>
      )}
    </div>
  );
};
