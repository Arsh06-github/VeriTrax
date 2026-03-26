import type { Metadata } from "next";
import { DM_Sans, Inter } from "next/font/google";
import "./globals.css";
import { twMerge } from "tailwind-merge";
import { Toaster } from "@/components/ui/sonner";
import { Web3Provider } from "@/hooks/useWeb3";
import { AuthProvider } from "@/hooks/useAuth";
import { MultiChainWalletProvider } from "@/hooks/useMultiChainWallet";
import { SolanaWalletProviderComponent } from "@/components/SolanaWalletProvider";

const dmSans = DM_Sans({ subsets: ["latin"] });
const inter = Inter({ 
  subsets: ["latin"],
  variable: '--font-inter',
  weight: ['400', '500', '600', '700', '800']
});

export const metadata: Metadata = {
  title: "Veritrax - Multi-Chain Charity Platform",
  description: "Blockchain-powered charity platform supporting Ethereum, Algorand, and Solana",
};

// Force dynamic rendering to avoid Firebase SSR issues
export const dynamic = 'force-dynamic';

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="relative">
      <body className={twMerge(dmSans.className, inter.variable, "antialiased bg-[#EAEEFE]")}>
        <AuthProvider>
          <SolanaWalletProviderComponent>
            <MultiChainWalletProvider>
              <Web3Provider>
                {children}
                <Toaster />
              </Web3Provider>
            </MultiChainWalletProvider>
          </SolanaWalletProviderComponent>
        </AuthProvider>
      </body>
    </html>
  );
}
