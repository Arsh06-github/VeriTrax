import { useState } from 'react';
import { DemoState } from '../types';

interface Props {
  state: DemoState;
  updateState: (updates: Partial<DemoState>) => void;
  nextStep: () => void;
}

export const Step4ProofSubmission = ({ state, updateState, nextStep }: Props) => {
  const [dragOver, setDragOver] = useState(false);
  const [files, setFiles] = useState<string[]>(state.proofs);

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setDragOver(false);
    const mockFiles = ['receipt_food_supplies.pdf', 'invoice_shelter_materials.pdf', 'photo_distribution.jpg'];
    setFiles(prev => [...prev, ...mockFiles]);
    updateState({ proofs: [...files, ...mockFiles] });
  };

  const addMockFile = () => {
    const mockFile = `receipt_${Date.now()}.pdf`;
    setFiles(prev => [...prev, mockFile]);
    updateState({ proofs: [...files, mockFile] });
  };

  const removeFile = (index: number) => {
    const newFiles = files.filter((_, i) => i !== index);
    setFiles(newFiles);
    updateState({ proofs: newFiles });
  };

  return (
    <div className="space-y-6">
      <h2 className="text-3xl font-inter font-bold text-gray-900 tracking-tight">
        Proof Submissions
      </h2>

      <div
        onDragOver={(e) => { e.preventDefault(); setDragOver(true); }}
        onDragLeave={() => setDragOver(false)}
        onDrop={handleDrop}
        className={`border-4 border-dashed rounded-2xl p-12 text-center transition-all duration-300 ${
          dragOver
            ? 'border-[#183EC2] bg-blue-50/50'
            : 'border-gray-300 bg-gray-50/50'
        }`}
      >
        <div className="text-6xl mb-4">📄</div>
        <h3 className="text-xl font-bold text-gray-900 mb-2">
          Drop files here or click to upload
        </h3>
        <p className="text-gray-600 mb-4">
          Upload receipts, invoices, and proof of expenses
        </p>
        <button
          onClick={addMockFile}
          className="px-6 py-3 bg-[#183EC2] text-white rounded-lg font-medium hover:bg-[#183EC2]/90 transition-colors"
        >
          Add Mock File
        </button>
      </div>

      {files.length > 0 && (
        <div className="bg-gradient-to-br from-green-50/80 to-white/60 border-2 border-green-200/60 rounded-2xl p-6">
          <h3 className="font-bold text-lg mb-4">Uploaded Files ({files.length})</h3>
          <div className="space-y-2">
            {files.map((file, index) => (
              <div
                key={index}
                className="flex items-center justify-between p-3 bg-white rounded-lg"
              >
                <div className="flex items-center gap-3">
                  <span className="text-2xl">📎</span>
                  <span className="font-medium text-gray-900">{file}</span>
                </div>
                <button
                  onClick={() => removeFile(index)}
                  className="text-red-500 hover:text-red-700 font-bold"
                >
                  ✕
                </button>
              </div>
            ))}
          </div>
        </div>
      )}

      <button
        onClick={nextStep}
        disabled={files.length === 0}
        className="w-full py-4 bg-gradient-to-r from-[#183EC2] to-purple-600 text-white rounded-xl font-bold text-lg hover:shadow-lg transition-all duration-300 hover:scale-[1.02] disabled:opacity-50 disabled:cursor-not-allowed"
      >
        Continue to Hash Anchoring →
      </button>
    </div>
  );
};
