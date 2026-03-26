import { DemoState } from '../types';
import { formatETH, shortenAddress } from '../utils';

interface Props {
  state: DemoState;
  updateState: (updates: Partial<DemoState>) => void;
  nextStep: () => void;
}

export const Step7Dashboard = ({ state, updateState, nextStep }: Props) => {
  const transactions = [
    {
      txId: state.txId,
      amount: state.amount,
      status: 'Released',
      proofHash: state.hash,
      donor: state.donorAddress,
      recipient: state.needyAddress,
      timestamp: new Date().toLocaleString(),
    },
  ];

  return (
    <div className="space-y-6">
      <h2 className="text-3xl font-inter font-bold text-gray-900 tracking-tight">
        Public Transparency Dashboard
      </h2>

      <div className="bg-gradient-to-br from-blue-50/80 to-white/60 border-2 border-blue-200/60 rounded-2xl p-6">
        <h3 className="font-bold text-lg mb-4">All Transactions - Publicly Verifiable</h3>
        
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b-2 border-gray-300">
                <th className="text-left py-3 px-2 font-bold text-gray-700">Tx ID</th>
                <th className="text-left py-3 px-2 font-bold text-gray-700">Amount</th>
                <th className="text-left py-3 px-2 font-bold text-gray-700">Status</th>
                <th className="text-left py-3 px-2 font-bold text-gray-700">Proof Hash</th>
                <th className="text-left py-3 px-2 font-bold text-gray-700">Donor</th>
                <th className="text-left py-3 px-2 font-bold text-gray-700">Recipient</th>
              </tr>
            </thead>
            <tbody>
              {transactions.map((tx, index) => (
                <tr key={index} className="border-b border-gray-200 hover:bg-white/50 transition-colors">
                  <td className="py-4 px-2">
                    <a
                      href={`https://mumbai.polygonscan.com/tx/${tx.txId}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="font-mono text-sm text-[#183EC2] hover:underline"
                    >
                      {shortenAddress(tx.txId)}
                    </a>
                  </td>
                  <td className="py-4 px-2 font-bold text-gray-900">
                    {formatETH(tx.amount)}
                  </td>
                  <td className="py-4 px-2">
                    <span className="px-3 py-1 bg-green-500 text-white rounded-full text-sm font-medium">
                      {tx.status}
                    </span>
                  </td>
                  <td className="py-4 px-2">
                    <button
                      onClick={() => alert(`Proof Hash:\n${tx.proofHash}`)}
                      className="font-mono text-sm text-purple-600 hover:underline"
                    >
                      {tx.proofHash.slice(0, 10)}...
                    </button>
                  </td>
                  <td className="py-4 px-2 font-mono text-sm">
                    {shortenAddress(tx.donor)}
                  </td>
                  <td className="py-4 px-2 font-mono text-sm">
                    {shortenAddress(tx.recipient)}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        <div className="mt-6 grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="bg-white rounded-xl p-4 text-center">
            <p className="text-3xl font-bold text-[#183EC2]">1</p>
            <p className="text-sm text-gray-600 mt-1">Total Transactions</p>
          </div>
          <div className="bg-white rounded-xl p-4 text-center">
            <p className="text-3xl font-bold text-green-600">{formatETH(state.amount)}</p>
            <p className="text-sm text-gray-600 mt-1">Total Released</p>
          </div>
          <div className="bg-white rounded-xl p-4 text-center">
            <p className="text-3xl font-bold text-purple-600">{state.proofs.length}</p>
            <p className="text-sm text-gray-600 mt-1">Proofs Verified</p>
          </div>
        </div>
      </div>

      <button
        onClick={nextStep}
        className="w-full py-4 bg-gradient-to-r from-[#183EC2] to-purple-600 text-white rounded-xl font-bold text-lg hover:shadow-lg transition-all duration-300 hover:scale-[1.02]"
      >
        Complete Demo →
      </button>
    </div>
  );
};
