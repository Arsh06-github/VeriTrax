import { DemoState } from '../types';

interface Props {
  state: DemoState;
  updateState: (updates: Partial<DemoState>) => void;
  nextStep: () => void;
}

export const Step1Campaign = ({ state, updateState, nextStep }: Props) => {
  return (
    <div className="space-y-6">
      <h2 className="text-3xl font-inter font-bold text-gray-900 tracking-tight">
        Campaign Creation/View
      </h2>
      
      <div className="bg-gradient-to-br from-blue-50/80 to-white/60 border-2 border-blue-200/60 rounded-2xl p-6">
        <h3 className="text-2xl font-inter font-bold text-gray-900 mb-4">
          Aid for Flood Victims
        </h3>
        
        <div className="space-y-4">
          <div className="flex justify-between items-center">
            <span className="text-gray-600">Goal:</span>
            <span className="text-2xl font-bold text-[#183EC2]">
              ${state.campaign.goal}
            </span>
          </div>
          
          <div className="flex justify-between items-center">
            <span className="text-gray-600">Raised:</span>
            <span className="text-2xl font-bold text-green-600">
              ${state.campaign.raised}
            </span>
          </div>
          
          <div className="w-full bg-gray-200 rounded-full h-4">
            <div
              className="bg-gradient-to-r from-[#183EC2] to-purple-500 h-4 rounded-full transition-all duration-500"
              style={{ width: `${(state.campaign.raised / state.campaign.goal) * 100}%` }}
            />
          </div>
          
          <div className="flex gap-2 mt-4">
            {state.campaign.categories.map((cat) => (
              <span
                key={cat}
                className="px-4 py-2 bg-[#183EC2] text-white rounded-lg text-sm font-medium"
              >
                {cat}
              </span>
            ))}
          </div>
        </div>
      </div>

      <button
        onClick={nextStep}
        className="w-full py-4 bg-gradient-to-r from-[#183EC2] to-purple-600 text-white rounded-xl font-bold text-lg hover:shadow-lg transition-all duration-300 hover:scale-[1.02]"
      >
        Donate Now →
      </button>
    </div>
  );
};
