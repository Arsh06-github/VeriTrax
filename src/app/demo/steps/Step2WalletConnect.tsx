import { useState } from 'react';
import { DemoState } from '../types';
import { generateRandomAddress, shortenAddress, formatETH } from '../utils';
import { QRCodeSVG } from 'qrcode.react';

interface Props {
  state: DemoState;
  updateState: (updates: Partial<DemoState>) => void;
  nextStep: () => void;
}

export const Step2WalletConnect = ({ state, updateState, nextStep }: Props) => {
  const [showQR, setShowQR] = useState(false);
  const [selectedWallet, setSelectedWallet] = useState<'metamask' | 'coinbase' | null>(null);

  const connectWallet = (type: 'metamask' | 'coinbase') => {
    setSelectedWallet(type);
    setTimeout(() => {
      const address = generateRandomAddress();
      updateState({
        wallet: type,
        donorAddress: address,
      });
    }, 1500);
  };

  const donate = () => {
    updateState({
      campaign: {
        ...state.campaign,
        raised: state.campaign.raised + (state.amount * 2000), // ETH to USD
      },
    });
    nextStep();
  };

  return (
    <div className="space-y-6">
      <h2 className="text-3xl font-inter font-bold text-gray-900 tracking-tight">
        Fund Collection / Donor Connect
      </h2>

      {!state.wallet ? (
        <div className="space-y-4">
          <p className="text-gray-600">Connect your wallet to continue</p>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <button
              onClick={() => connectWallet('metamask')}
              disabled={selectedWallet === 'metamask'}
              className="p-6 bg-gradient-to-br from-orange-50/80 to-white/60 border-2 border-orange-200/60 rounded-2xl hover:scale-105 transition-all duration-300 disabled:opacity-50"
            >
              {selectedWallet === 'metamask' ? (
                <div className="flex items-center justify-center">
                  <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-[#183EC2]"></div>
                </div>
              ) : (
                <>
                  <div className="text-4xl mb-2">🦊</div>
                  <h3 className="font-bold text-lg">MetaMask</h3>
                </>
              )}
            </button>

            <button
              onClick={() => connectWallet('coinbase')}
              disabled={selectedWallet === 'coinbase'}
              className="p-6 bg-gradient-to-br from-blue-50/80 to-white/60 border-2 border-blue-200/60 rounded-2xl hover:scale-105 transition-all duration-300 disabled:opacity-50"
            >
              {selectedWallet === 'coinbase' ? (
                <div className="flex items-center justify-center">
                  <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-[#183EC2]"></div>
                </div>
              ) : (
                <>
                  <div className="text-4xl mb-2">💼</div>
                  <h3 className="font-bold text-lg">Coinbase Wallet</h3>
                </>
              )}
            </button>
          </div>
        </div>
      ) : (
        <div className="space-y-6">
          <div className="bg-gradient-to-br from-green-50/80 to-white/60 border-2 border-green-200/60 rounded-2xl p-6">
            <div className="flex items-center justify-between mb-4">
              <h3 className="font-bold text-lg">Wallet Connected</h3>
              <span className="px-3 py-1 bg-green-500 text-white rounded-full text-sm">
                Connected
              </span>
            </div>
            
            <div className="space-y-3">
              <div>
                <p className="text-sm text-gray-600">Address</p>
                <p className="font-mono font-bold text-gray-900">
                  {shortenAddress(state.donorAddress)}
                </p>
              </div>
              
              <div>
                <p className="text-sm text-gray-600">Balance</p>
                <p className="text-2xl font-bold text-[#183EC2]">
                  {formatETH(2)}
                </p>
              </div>
            </div>

            <button
              onClick={() => setShowQR(!showQR)}
              className="mt-4 w-full py-2 bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300 transition-colors"
            >
              {showQR ? 'Hide' : 'Show'} QR Code
            </button>

            {showQR && (
              <div className="mt-4 flex justify-center p-4 bg-white rounded-lg">
                <QRCodeSVG value={state.donorAddress} size={200} />
              </div>
            )}
          </div>

          <div className="bg-gradient-to-br from-purple-50/80 to-white/60 border-2 border-purple-200/60 rounded-2xl p-6">
            <h3 className="font-bold text-lg mb-4">Donation Amount</h3>
            <div className="text-center">
              <p className="text-4xl font-bold text-[#183EC2] mb-2">
                {formatETH(state.amount)}
              </p>
              <p className="text-gray-600">≈ $200 USD</p>
            </div>
          </div>

          <button
            onClick={donate}
            className="w-full py-4 bg-gradient-to-r from-[#183EC2] to-purple-600 text-white rounded-xl font-bold text-lg hover:shadow-lg transition-all duration-300 hover:scale-[1.02]"
          >
            Donate {formatETH(state.amount)} (Gasless) →
          </button>
        </div>
      )}
    </div>
  );
};
