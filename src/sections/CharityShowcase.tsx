"use client";
import CheckIcon from "@/assets/check.svg";
import { twMerge } from "tailwind-merge";
import { motion } from "framer-motion";
import { useEffect, useState } from "react";
import { ApiService, Charity } from "@/lib/api";
import { useWeb3 } from "@/hooks/useWeb3";
import { web3Service } from "@/lib/web3";
import { toast } from "sonner";

export const CharityShowcase = () => {
  const [charities, setCharities] = useState<Charity[]>([]);
  const [loading, setLoading] = useState(true);
  const [donating, setDonating] = useState<number | null>(null);
  const { account } = useWeb3();

  useEffect(() => {
    const loadCharities = async () => {
      try {
        const data = await ApiService.getCharities();
        const approvedCharities = data.filter(c => c.status === 'approved').slice(0, 3);
        setCharities(approvedCharities);
      } catch (error) {
        console.error('Failed to load charities:', error);
      } finally {
        setLoading(false);
      }
    };

    loadCharities();
  }, []);

  const handleDonate = async (charity: Charity) => {
    if (!account) {
      toast.error('Please connect your wallet first');
      return;
    }

    if (!charity.onChainId) {
      toast.error('This charity is not yet on the blockchain');
      return;
    }

    const amount = prompt('Enter donation amount in INR:');
    if (!amount || isNaN(parseFloat(amount))) return;

    // Convert INR to ETH (approximate rate: 1 ETH = ₹85,000)
    const ethAmount = (parseFloat(amount) / 85000).toFixed(6);

    setDonating(charity.id);
    try {
      const txHash = await web3Service.donate(charity.onChainId, ethAmount);
      
      await ApiService.createDonation({
        charity: charity.id,
        donor: account,
        amount: parseFloat(ethAmount),
        transactionHash: txHash,
      });

      toast.success(`Donation of ₹${parseFloat(amount).toLocaleString('en-IN')} successful! TX: ${txHash.slice(0, 10)}...`);
      
      // Reload charities to update amounts
      const data = await ApiService.getCharities();
      const approvedCharities = data.filter(c => c.status === 'approved').slice(0, 3);
      setCharities(approvedCharities);
    } catch (error: any) {
      console.error('Donation failed:', error);
      toast.error(error.message || 'Donation failed');
    } finally {
      setDonating(null);
    }
  };

  if (loading) {
    return (
      <section id="charities" className="py-24 bg-white">
        <div className="container text-center">
          <div className="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-black"></div>
        </div>
      </section>
    );
  }

  return (
    <section id="charities" className="py-24 bg-white">
      <div className="container">
        <div className="section-heading">
          <h2 className="section-title">Featured Charities</h2>
          <p className="section-des mt-5">
            Support verified charities making a real difference. All donations are transparent and 
            recorded on the blockchain.
          </p>
        </div>

        <div className="flex flex-col gap-6 items-center mt-10 lg:flex-row lg:items-end lg:justify-center">
          {charities.map((charity, index) => {
            const progressPercentage = (charity.raisedAmount / charity.targetAmount) * 100;
            const isFullyFunded = progressPercentage >= 100;
            const isFeatured = index === 1;

            return (
              <div
                key={charity.id}
                className={twMerge(
                  "p-10 rounded-3xl border border-[#F1F1F1] shadow-[0_7px_14px_#EAEAEA] max-w-xs w-full",
                  isFeatured && "border-black bg-black text-white"
                )}
              >
                <div className="flex justify-between">
                  <h3 className={twMerge("text-lg font-bold text-black/50", isFeatured && "text-white/60")}>
                    {charity.category}
                  </h3>
                  {isFeatured && (
                    <div className="inline-flex text-sm px-4 py-1.5 rounded-xl border border-white/20">
                      <motion.span
                        animate={{
                          backgroundPositionX: "-100%",
                        }}
                        transition={{
                          duration: 1,
                          repeat: Infinity,
                          ease: "linear",
                          repeatType: "loop",
                        }}
                        className="bg-[linear-gradient(to_right,#DD7DDF,#E1CD86,#BBCB92,#71C2EF,#3BFFFF,#DD7DDF,#E1CD86,#BBCB92,#71C2EF,#3BFFFF)] [background-size:200%] text-transparent bg-clip-text font-medium"
                      >
                        Featured
                      </motion.span>
                    </div>
                  )}
                </div>
                
                <div className="mt-4">
                  <h4 className={twMerge("text-xl font-bold mb-2", isFeatured && "text-white")}>
                    {charity.name}
                  </h4>
                  <p className={twMerge("text-sm text-black/60 line-clamp-3", isFeatured && "text-white/80")}>
                    {charity.description}
                  </p>
                </div>

                <div className="mt-6">
                  <div className="flex justify-between text-sm mb-2">
                    <span className={twMerge("text-black/60", isFeatured && "text-white/80")}>Progress</span>
                    <span className={twMerge("font-bold", isFeatured && "text-white")}>
                      ₹{(charity.raisedAmount * 85000).toLocaleString('en-IN', {maximumFractionDigits: 0})} / ₹{(charity.targetAmount * 85000).toLocaleString('en-IN', {maximumFractionDigits: 0})}
                    </span>
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-2">
                    <div
                      className={twMerge("bg-black h-2 rounded-full", isFeatured && "bg-white")}
                      style={{ width: `${Math.min(progressPercentage, 100)}%` }}
                    ></div>
                  </div>
                  <div className={twMerge("text-xs mt-1 text-black/60", isFeatured && "text-white/80")}>
                    {progressPercentage.toFixed(1)}% funded
                  </div>
                </div>

                <button
                  onClick={() => handleDonate(charity)}
                  disabled={isFullyFunded || donating === charity.id || !account}
                  className={twMerge(
                    "btn btn-primary w-full mt-[30px]",
                    isFeatured && "bg-white text-black",
                    (isFullyFunded || !account) && "opacity-50 cursor-not-allowed"
                  )}
                >
                  {donating === charity.id ? 'Processing...' : isFullyFunded ? 'Fully Funded' : !account ? 'Connect Wallet' : 'Donate Now'}
                </button>

                <ul className="flex flex-col gap-3 mt-6">
                  <li className="text-sm flex items-center gap-3">
                    <CheckIcon className="h-5 w-5" />
                    <span>Blockchain verified</span>
                  </li>
                  <li className="text-sm flex items-center gap-3">
                    <CheckIcon className="h-5 w-5" />
                    <span>100% transparent</span>
                  </li>
                  <li className="text-sm flex items-center gap-3">
                    <CheckIcon className="h-5 w-5" />
                    <span>Direct to charity</span>
                  </li>
                </ul>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
};
