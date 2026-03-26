import { useState, useEffect } from 'react';
import { DemoState } from '../types';
import { generateRandomHash } from '../utils';
import { QRCodeSVG } from 'qrcode.react';

interface Props {
  state: DemoState;
  updateState: (updates: Partial<DemoState>) => void;
  nextStep: () => void;
}

export const Step5HashAnchoring = ({ state, updateState, nextStep }: Props) => {
  const [anchoring, setAnchoring] = useState(true);
  const [hash, setHash] = useState('');
  const [txId, setTxId] = useState('');
  const [showQR, setShowQR] = useState(false);

  useEffect(() => {
    const anchor = async () => {
      const timestamp = new Date().toISOString();
      const data = `${state.proofs.join(',')}:${timestamp}`;
      const generatedHash = await generateRandomHash(data);
      setHash(generatedHash);
      
      setTimeout(() => {
        const randomTxId = `0x${Math.random().toString(16).slice(2)}${Math.random().toString(16).slice(2)}`;
        setTxId(randomTxId);
        updateState({ hash: generatedHash, txId: randomTxId });
        setAnchoring(false);
      }, 3000);
    };

    anchor();
  }, []);

  const explorerUrl = `https://mumbai.polygonscan.com/tx/${txId}`;

  return (
    <div className="space-y-6">
      <h2 className="text-3xl font-inter font-bold text-gray-900 tracking-tight">
        Hash Anchoring
      </h2>

      {anchoring ? (
        <div className="bg-gradient-to-br from-purple-50/80 to-white/60 border-2 border-purple-200/60 rounded-2xl p-8">
          <div className="text-center space-y-6">
            <div className="flex justify-center">
              <div className="relative w-24 h-24">
                <div className="absolute inset-0 border-4 border-purple-500/20 rounded-full"></div>
                <div className="absolute inset-0 border-4 border-purple-500 rounded-full border-t-transparent animate-spin"></div>
                <div className="absolute inset-0 flex items-center justify-center">
                  <span className="text-2xl">⛓️</span>
                </div>
              </div>
            </div>
            
            <h3 className="text-2xl font-bold text-gray-900">
              Anchoring to Polygon Mumbai...
            </h3>
            
            <div className="space-y-2">
              <div className="flex items-center justify-center gap-2">
                <div className="w-2 h-2 bg-purple-500 rounded-full animate-bounce"></div>
                <div className="w-2 h-2 bg-purple-500 rounded-full animate-bounce" style={{ animationDelay: '0.1s' }}></div>
                <div className="w-2 h-2 bg-purple-500 rounded-full animate-bounce" style={{ animationDelay: '0.2s' }}></div>
              </div>
              <p className="text-gray-600">Generating SHA-256 hash...</p>
            </div>

            {hash && (
              <div className="bg-white rounded-xl p-4">
                <p className="text-sm text-gray-600 mb-2">Hash Generated:</p>
                <p className="font-mono text-xs break-all text-[#183EC2]">{hash}</p>
              </div>
            )}
          </div>
        </div>
      ) : (
        <div className="space-y-6">
          <div className="bg-gradient-to-br from-green-50/80 to-white/60 border-2 border-green-200/60 rounded-2xl p-6">
            <div className="text-center mb-6">
              <div className="flex justify-center mb-6">
                <div className="relative">
                  <div className="w-20 h-20 bg-gradient-to-br from-green-400 to-green-600 rounded-2xl flex items-center justify-center shadow-lg">
                    <svg className="w-12 h-12 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
                    </svg>
                  </div>
                  <div className="absolute -top-1 -right-1 w-6 h-6 bg-green-500 rounded-full border-4 border-white animate-pulse"></div>
                </div>
              </div>
              <h3 className="text-2xl font-inter font-bold text-gray-900 mb-2">
                Successfully Anchored
              </h3>
              <p className="text-sm text-gray-500">Hash recorded on Polygon Mumbai testnet</p>
            </div>

            <div className="space-y-4">
              <div className="bg-white rounded-xl p-4 border border-gray-200">
                <p className="text-xs text-gray-500 mb-2 uppercase tracking-wide font-medium">Proof Hash (SHA-256):</p>
                <p className="font-mono text-xs break-all text-[#183EC2] font-bold bg-blue-50 p-3 rounded">{hash}</p>
              </div>

              <div className="bg-white rounded-xl p-4 border border-gray-200">
                <p className="text-xs text-gray-500 mb-2 uppercase tracking-wide font-medium">Transaction ID:</p>
                <p className="font-mono text-xs break-all text-purple-600 font-bold bg-purple-50 p-3 rounded">{txId}</p>
              </div>

              <div className="bg-gradient-to-r from-purple-50 to-indigo-50 border-2 border-purple-200 rounded-xl p-4">
                <div className="flex items-start gap-3">
                  <svg className="w-5 h-5 text-purple-600 mt-0.5 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                  </svg>
                  <div className="flex-1">
                    <p className="text-sm font-bold text-gray-900 mb-1">Blockchain Verified</p>
                    <p className="text-xs text-gray-600">Transaction recorded on Polygon Mumbai testnet</p>
                    <p className="text-xs text-purple-600 font-mono mt-2 break-all">{explorerUrl}</p>
                  </div>
                </div>
              </div>

              <button
                onClick={() => setShowQR(!showQR)}
                className="w-full py-3 bg-gray-200 text-gray-700 rounded-lg font-medium hover:bg-gray-300 transition-colors flex items-center justify-center gap-2"
              >
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v1m6 11h2m-6 0h-2v4m0-11v3m0 0h.01M12 12h4.01M16 20h4M4 12h4m12 0h.01M5 8h2a1 1 0 001-1V5a1 1 0 00-1-1H5a1 1 0 00-1 1v2a1 1 0 001 1zm12 0h2a1 1 0 001-1V5a1 1 0 00-1-1h-2a1 1 0 00-1 1v2a1 1 0 001 1zM5 20h2a1 1 0 001-1v-2a1 1 0 00-1-1H5a1 1 0 00-1 1v2a1 1 0 001 1z" />
                </svg>
                {showQR ? 'Hide' : 'Show'} Verification QR Code
              </button>

              {showQR && (
                <div className="flex justify-center p-4 bg-white rounded-lg">
                  <QRCodeSVG value={explorerUrl} size={200} />
                </div>
              )}
            </div>
          </div>

          <button
            onClick={nextStep}
            className="w-full py-4 bg-gradient-to-r from-[#183EC2] to-purple-600 text-white rounded-xl font-bold text-lg hover:shadow-lg transition-all duration-300 hover:scale-[1.02]"
          >
            Proceed to Fund Release →
          </button>
        </div>
      )}
    </div>
  );
};
