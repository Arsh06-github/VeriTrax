"use client";

import { useState, useEffect } from 'react';
import { useAuth } from '@/hooks/useAuth';
import { useRouter } from 'next/navigation';
import { Header } from '@/sections/Header';
import { Footer } from '@/sections/Footer';
import { GlassCard } from '@/components/GlassCard';
import { motion } from 'framer-motion';
import { 
  Upload, 
  FileText, 
  DollarSign, 
  Target,
  AlertCircle,
  CheckCircle2,
  ArrowLeft
} from 'lucide-react';
import { toast } from 'sonner';
import Link from 'next/link';

export default function CreateCampaignPage() {
  const { user } = useAuth();
  const router = useRouter();
  
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    reason: '',
    targetAmount: '',
    category: 'education',
    duration: '30'
  });
  
  const [documents, setDocuments] = useState<File[]>([]);
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    if (!user) {
      router.push('/login');
    }
  }, [user]);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      const newFiles = Array.from(e.target.files);
      setDocuments([...documents, ...newFiles]);
      toast.success(`${newFiles.length} document(s) uploaded`);
    }
  };

  const removeDocument = (index: number) => {
    setDocuments(documents.filter((_, i) => i !== index));
    toast.info('Document removed');
  };

  const getAmountInCurrencies = (amount: string) => {
    const amountNum = parseFloat(amount) || 0;
    
    // Mock conversion rates
    const ethRate = 2000; // 1 ETH = $2000
    const inrRate = 83; // 1 USD = 83 INR
    
    return {
      usd: amountNum.toFixed(2),
      inr: (amountNum * inrRate).toFixed(2),
      eth: (amountNum / ethRate).toFixed(6)
    };
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!formData.title || !formData.description || !formData.reason || !formData.targetAmount) {
      toast.error('Please fill in all required fields');
      return;
    }

    if (documents.length === 0) {
      toast.error('Please upload at least one proof document');
      return;
    }

    setIsSubmitting(true);

    // Simulate campaign creation
    setTimeout(() => {
      setIsSubmitting(false);
      toast.success('Campaign created successfully!', {
        description: 'Your campaign is now live and accepting donations',
        duration: 5000,
      });
      
      // Redirect to view campaigns
      router.push('/campaigns/view');
    }, 2000);
  };

  if (!user) return null;

  const currencies = getAmountInCurrencies(formData.targetAmount);

  return (
    <div className="min-h-screen bg-gradient-to-b from-[#EAEEFE] to-white">
      <Header />
      
      <div className="container mx-auto px-4 py-12">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-8"
        >
          <Link href="/campaigns" className="inline-flex items-center gap-2 text-[#183EC2] hover:underline mb-4">
            <ArrowLeft className="w-4 h-4" />
            Back to Campaigns
          </Link>
          <h1 className="text-5xl font-inter font-bold text-gray-900 mb-4 tracking-tight">
            Generate New Campaign
          </h1>
          <p className="text-xl text-gray-600">
            Create a transparent fundraising campaign with blockchain verification
          </p>
        </motion.div>

        <div className="max-w-4xl mx-auto">
          <form onSubmit={handleSubmit}>
            <div className="space-y-6">
              {/* Basic Information */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.1 }}
              >
                <GlassCard variant="blue" className="p-8">
                  <h2 className="text-2xl font-bold text-gray-900 mb-6 flex items-center gap-3">
                    <FileText className="w-6 h-6 text-[#183EC2]" />
                    Campaign Details
                  </h2>

                  <div className="space-y-6">
                    {/* Title */}
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Campaign Title <span className="text-red-500">*</span>
                      </label>
                      <input
                        type="text"
                        name="title"
                        value={formData.title}
                        onChange={handleInputChange}
                        placeholder="e.g., Education for Underprivileged Children"
                        className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-[#183EC2] bg-white/80"
                        required
                      />
                    </div>

                    {/* Category */}
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Category <span className="text-red-500">*</span>
                      </label>
                      <select
                        name="category"
                        value={formData.category}
                        onChange={handleInputChange}
                        className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-[#183EC2] bg-white/80"
                        required
                      >
                        <option value="education">Education</option>
                        <option value="healthcare">Healthcare</option>
                        <option value="food">Food & Shelter</option>
                        <option value="environment">Environment</option>
                        <option value="disaster">Disaster Relief</option>
                        <option value="other">Other</option>
                      </select>
                    </div>

                    {/* Description */}
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Campaign Description <span className="text-red-500">*</span>
                      </label>
                      <textarea
                        name="description"
                        value={formData.description}
                        onChange={handleInputChange}
                        placeholder="Describe your campaign and its impact..."
                        rows={4}
                        className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-[#183EC2] bg-white/80"
                        required
                      />
                    </div>

                    {/* Reason for Fundraising */}
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Reason for Raising Funds <span className="text-red-500">*</span>
                      </label>
                      <textarea
                        name="reason"
                        value={formData.reason}
                        onChange={handleInputChange}
                        placeholder="Explain why you need these funds and how they will be used..."
                        rows={4}
                        className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-[#183EC2] bg-white/80"
                        required
                      />
                    </div>

                    {/* Duration */}
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Campaign Duration (days)
                      </label>
                      <input
                        type="number"
                        name="duration"
                        value={formData.duration}
                        onChange={handleInputChange}
                        min="1"
                        max="365"
                        className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-[#183EC2] bg-white/80"
                      />
                    </div>
                  </div>
                </GlassCard>
              </motion.div>

              {/* Funding Goal */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.2 }}
              >
                <GlassCard variant="indigo" className="p-8">
                  <h2 className="text-2xl font-bold text-gray-900 mb-6 flex items-center gap-3">
                    <Target className="w-6 h-6 text-indigo-600" />
                    Funding Goal
                  </h2>

                  <div className="space-y-6">
                    {/* Target Amount in USD */}
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Target Amount (USD) <span className="text-red-500">*</span>
                      </label>
                      <div className="relative">
                        <DollarSign className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                        <input
                          type="number"
                          name="targetAmount"
                          value={formData.targetAmount}
                          onChange={handleInputChange}
                          placeholder="10000"
                          min="1"
                          step="0.01"
                          className="w-full pl-12 pr-4 py-3 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-indigo-500 bg-white/80"
                          required
                        />
                      </div>
                    </div>

                    {/* Currency Conversions */}
                    {formData.targetAmount && parseFloat(formData.targetAmount) > 0 && (
                      <div className="bg-gradient-to-r from-indigo-50 to-purple-50 rounded-lg p-6">
                        <p className="text-sm font-medium text-gray-700 mb-4">Equivalent Amounts:</p>
                        <div className="grid grid-cols-3 gap-4">
                          <div className="text-center">
                            <p className="text-sm text-gray-600 mb-1">US Dollar</p>
                            <p className="text-2xl font-bold text-gray-900">${currencies.usd}</p>
                          </div>
                          <div className="text-center">
                            <p className="text-sm text-gray-600 mb-1">Indian Rupee</p>
                            <p className="text-2xl font-bold text-gray-900">₹{currencies.inr}</p>
                          </div>
                          <div className="text-center">
                            <p className="text-sm text-gray-600 mb-1">Ethereum</p>
                            <p className="text-2xl font-bold text-gray-900">{currencies.eth} ETH</p>
                          </div>
                        </div>
                      </div>
                    )}
                  </div>
                </GlassCard>
              </motion.div>

              {/* Proof Documents */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.3 }}
              >
                <GlassCard variant="purple" className="p-8">
                  <h2 className="text-2xl font-bold text-gray-900 mb-6 flex items-center gap-3">
                    <Upload className="w-6 h-6 text-purple-600" />
                    Proof Documents
                  </h2>

                  <div className="space-y-6">
                    <p className="text-gray-600">
                      Upload documents that verify your campaign's legitimacy and purpose (ID proof, registration certificates, project proposals, etc.)
                    </p>

                    {/* File Upload */}
                    <div className="border-2 border-dashed border-gray-300 rounded-lg p-8 text-center hover:border-purple-500 transition-colors">
                      <input
                        type="file"
                        id="documents"
                        multiple
                        accept=".pdf,.jpg,.jpeg,.png,.doc,.docx"
                        onChange={handleFileUpload}
                        className="hidden"
                      />
                      <label htmlFor="documents" className="cursor-pointer">
                        <Upload className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                        <p className="text-gray-700 font-medium mb-2">
                          Click to upload documents
                        </p>
                        <p className="text-sm text-gray-500">
                          PDF, JPG, PNG, DOC (Max 10MB each)
                        </p>
                      </label>
                    </div>

                    {/* Uploaded Documents List */}
                    {documents.length > 0 && (
                      <div className="space-y-2">
                        <p className="text-sm font-medium text-gray-700">Uploaded Documents:</p>
                        {documents.map((doc, index) => (
                          <div key={index} className="flex items-center justify-between bg-white/80 rounded-lg p-3 border border-gray-200">
                            <div className="flex items-center gap-3">
                              <CheckCircle2 className="w-5 h-5 text-green-600" />
                              <span className="text-sm text-gray-700">{doc.name}</span>
                              <span className="text-xs text-gray-500">
                                ({(doc.size / 1024).toFixed(2)} KB)
                              </span>
                            </div>
                            <button
                              type="button"
                              onClick={() => removeDocument(index)}
                              className="text-red-500 hover:text-red-700 text-sm font-medium"
                            >
                              Remove
                            </button>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                </GlassCard>
              </motion.div>

              {/* Important Notice */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.4 }}
              >
                <div className="bg-yellow-50 border-2 border-yellow-200 rounded-lg p-6 flex gap-4">
                  <AlertCircle className="w-6 h-6 text-yellow-600 flex-shrink-0" />
                  <div className="text-sm text-gray-700">
                    <p className="font-medium mb-2">Important Information</p>
                    <ul className="list-disc list-inside space-y-1">
                      <li>All campaigns are subject to verification before going live</li>
                      <li>Donations will be held in escrow until milestones are met</li>
                      <li>You must provide proof of fund utilization to release funds</li>
                      <li>False information may result in campaign suspension</li>
                    </ul>
                  </div>
                </div>
              </motion.div>

              {/* Submit Button */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.5 }}
              >
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="w-full btn btn-primary py-4 text-lg flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {isSubmitting ? (
                    <>
                      <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white"></div>
                      Creating Campaign...
                    </>
                  ) : (
                    <>
                      Create Campaign
                      <CheckCircle2 className="w-5 h-5" />
                    </>
                  )}
                </button>
              </motion.div>
            </div>
          </form>
        </div>
      </div>

      <Footer />
    </div>
  );
}
