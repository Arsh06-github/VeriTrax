<div align="center">

<img src="https://capsule-render.vercel.app/api?type=waving&color=0:0F2027,50:203A43,100:2C5364&height=200&section=header&text=VeriTrax&fontSize=80&fontColor=00D4FF&fontAlignY=38&desc=Verified%20Transactions.%20Transparent%20Trust.&descSize=20&descAlignY=60&descColor=FFFFFF&animation=fadeIn" width="100%"/>

<br/>

[![Algorand](https://img.shields.io/badge/Algorand-Bharat-00D4FF?style=for-the-badge&logo=algorand&logoColor=white)](https://algorand.com)
[![Solana](https://img.shields.io/badge/Solana-Chain-9945FF?style=for-the-badge&logo=solana&logoColor=white)](https://solana.com)
[![Coinbase](https://img.shields.io/badge/Coinbase-Wallet-0052FF?style=for-the-badge&logo=coinbase&logoColor=white)](https://coinbase.com)
[![Next.js](https://img.shields.io/badge/Next.js-15-000000?style=for-the-badge&logo=nextdotjs&logoColor=white)](https://nextjs.org)
[![MongoDB](https://img.shields.io/badge/MongoDB-Database-47A248?style=for-the-badge&logo=mongodb&logoColor=white)](https://mongodb.com)
[![WalletConnect](https://img.shields.io/badge/WalletConnect-v2-3B99FC?style=for-the-badge&logo=walletconnect&logoColor=white)](https://walletconnect.com)

<br/>

> ### *"₹3,076 crore donated to PM CARES in 3 days. RTI filed — Rejected. CAG Audit — Denied. Zero accountability.*
> ### *We built VeriTrax so that never happens again."*

<br/>

**Team Sentinels** · Bikaner Technical University · Open Innovation

**Arsh Maheshwari** &nbsp;·&nbsp; **Vighnesh Bhati** &nbsp;·&nbsp; **Dhruv Parihar**

</div>

---

<br/>

## 🔍 What is VeriTrax?

**VeriTrax** is a decentralized, multi-chain transparent payment and fundraising platform. Every rupee donated, every fund withdrawn, every payment automated — recorded permanently on a public blockchain ledger that **anyone can verify, anytime, from anywhere.**

No RTIs. No unanswered emails. No broken trust.

Just code.

<br/>

---

## 🚨 The Problem

| What's Broken | The Numbers |
|---|---|
| NGO fund accountability | 47 lakh registered NGOs — less than 10% file audited accounts |
| Traditional donation fees | 20–30% lost to payment processors before reaching the cause |
| Cross-wallet interoperability | MetaMask, Pera, Coinbase — siloed, incompatible, fragmented |
| Manual recurring payments | Zero automation — every release requires human intervention |
| Public fund transparency | ₹3,076 crore in PM CARES — zero public audit trail |

<br/>

---

## ✅ Our Solution

```
Donor sends ₹500          →    Algorand records it in 4 seconds at 3–5% fee
NGO withdraws ₹50 lakh    →    Solana handles it at 65,000 TPS
Auto-payment triggered    →    x402 releases funds only when condition is met
Anyone audits anytime     →    Public immutable blockchain ledger
```

**One platform. Three chains. Zero black boxes.**

<br/>

---

## ⚡ Features

<details>
<summary><b>🔐 Authentication</b></summary>

<br/>

- **Company Signup** — Name · Location · Password
- **User Signup** — Name · Email · Contact Number · Password
- Passwords hashed via `bcryptjs` — never stored in plain text
- JWT session management via `next-auth`
- Choose between **Company** or **User** account type at signup

</details>

<details>
<summary><b>🚀 Campaign (Fundraising)</b></summary>

<br/>

- Companies create transparent fundraising campaigns
- Enter reason, target amount, and **exact fund utilization breakdown**
- Amount shown simultaneously in **INR · USD · ETH · SOL · ALGO** (live via CoinGecko)
- Users browse all active campaigns and donate directly
- All donations processed via **Algorand** — confirmed in under 4 seconds at 3–5% fee
- Donation history permanently recorded on Algorand public ledger

</details>

<details>
<summary><b>💸 Transactions</b></summary>

<br/>

- Connect **MetaMask**, **Coinbase Wallet**, or **Pera Wallet** in one click
- Cross-wallet payments via **WalletConnect v2 QR code** — scan and send
- **Gasless transactions** when using Coinbase Wallet on Base network (Coinbase Paymaster)
- **3–5% fee** when using Pera Wallet on Algorand
- **Auto-Payment Setup** — connect Coinbase Wallet → enter receiver wallet ID → select trigger condition from dropdown → x402 generates the payment contract → funds release automatically when condition is met

</details>

<details>
<summary><b>📋 Transaction History</b></summary>

<br/>

- Complete unified view of ALL transactions in one dashboard
- Types: Normal · Auto-Payment · Crowdfunding Donation
- Status tags: ✅ Completed · ⏳ Pending · ❌ Failed
- Real-time updates via on-chain event listeners

</details>

<details>
<summary><b>👤 User Profile</b></summary>

<br/>

- Connected wallet address displayed
- Live wallet balance across connected chains
- Personal details: Name · Email · Contact Number

</details>

<br/>

---

## 🏗️ Architecture

```
┌─────────────────────────────────────────────────────────────┐
│                        VERITRAX                             │
│                    Next.js 15 Frontend                      │
└──────────┬────────────────┬──────────────────┬─────────────┘
           │                │                  │
           ▼                ▼                  ▼
   ┌───────────────┐ ┌─────────────┐ ┌──────────────────┐
   │   ALGORAND    │ │   SOLANA    │ │   EVM / BASE     │
   │   Bharat SDK  │ │  Web3.js    │ │   Hardhat        │
   │               │ │             │ │                  │
   │ • P2P Donations│ │ • NGO       │ │ • x402 Contracts │
   │ • Crowdfunding│ │   Treasury  │ │ • Auto-Payments  │
   │ • 3-5% fees   │ │ • High Vol  │ │ • Gasless Txns   │
   │ • 4 sec finality│ │ • 65K TPS  │ │ • OpenZeppelin   │
   │               │ │             │ │                  │
   │  Pera Wallet  │ │Phantom/Sol  │ │Coinbase + MetaMask│
   └───────────────┘ └─────────────┘ └──────────────────┘
           │                │                  │
           └────────────────┼──────────────────┘
                            │
                            ▼
                   ┌─────────────────┐
                   │    MONGODB      │
                   │                 │
                   │ • Campaign data │
                   │ • User profiles │
                   │ • Txn metadata  │
                   │ • Audit labels  │
                   └─────────────────┘
```

<br/>

---

## 🛠️ Tech Stack

### ⭐ Blockchain Layer

| Chain | SDK | Wallet | Use Case |
|---|---|---|---|
| **Algorand** | `algosdk` · `algokit-utils` | **Pera Wallet** | P2P donations · Crowdfunding · Low-fee transactions |
| **Solana** | `@solana/web3.js` · `spl-token` | Phantom · Wallet Adapter | High-volume institutional fund movements |
| **Base (EVM)** | `ethers` · `viem` | **Coinbase Wallet** | Gasless transactions · x402 auto-payments |
| **Ethereum** | `wagmi` · `ethers` | **MetaMask** | EVM standard transactions |

### 💳 Payments & Wallets

| Tool | Package | Purpose |
|---|---|---|
| **x402 Protocol** | `x402` | Conditional auto-payments — funds release on task completion |
| **Coinbase Paymaster** | `permissionless` · `@coinbase/onchainkit` | Gasless transactions via ERC-4337 account abstraction |
| **WalletConnect v2** | `@walletconnect/modal` | Cross-wallet QR code transactions |
| **Pera Wallet** | `@perawallet/connect` | Algorand mobile-first wallet |
| **MetaMask SDK** | `@metamask/sdk-react` | EVM wallet standard |
| **Coinbase SDK** | `@coinbase/coinbase-sdk` | Coinbase ecosystem integration |

### 🖥️ Frontend

| Tool | Version | Purpose |
|---|---|---|
| Next.js | 15.2.3 | React framework · SSR · API routes |
| React | 19.0.0 | UI library |
| TypeScript | 5.8.2 | Type safety |
| TailwindCSS | 4.1.3 | Utility-first styling |
| DaisyUI | 5.0.9 | UI component library |
| Recharts | latest | Transaction history charts |
| React Hook Form + Zod | latest | Form validation |
| QRCode.react | latest | QR code generation |
| Zustand | 5.0.0 | Global state management |

### 🔧 Backend & Database

| Tool | Package | Purpose |
|---|---|---|
| **MongoDB** | `mongoose` · `mongodb` | Campaign data · user profiles · txn metadata |
| **NextAuth** | `next-auth` | Authentication sessions |
| **bcryptjs** | `bcryptjs` | Password hashing |
| **JWT** | `jsonwebtoken` | Secure session tokens |
| **CoinGecko API** | `@coingecko/api` | Live INR/USD ↔ ETH/SOL/ALGO conversion |
| **BigNumber.js** | `bignumber.js` | Crypto decimal precision |

### ⛓️ Smart Contracts

| Tool | Version | Purpose |
|---|---|---|
| Hardhat | 2.22.10 | Contract development environment |
| OpenZeppelin | 5.0.2 | Secure contract standards |
| TypeChain | latest | Type-safe contract interactions |
| Solidity | ^0.8.20 | Smart contract language |
| hardhat-gas-reporter | latest | Gas cost optimization |
| solidity-coverage | latest | Test coverage reports |

<br/>

---

## 📁 Project Structure

```
VeriTrax/
├── packages/
│   ├── hardhat/                    # Smart contracts
│   │   ├── contracts/
│   │   │   ├── CampaignFactory.sol       # Crowdfunding campaigns
│   │   │   ├── AutoPayment.sol           # x402 conditional payments
│   │   │   └── VeriTraxRegistry.sol      # Universal wallet registry
│   │   ├── deploy/                       # Deployment scripts
│   │   └── test/                         # Contract tests
│   │
│   └── nextjs/                     # Frontend application
│       ├── app/
│       │   ├── auth/                     # Login · Signup
│       │   ├── dashboard/
│       │   │   ├── campaign/             # View · Create campaigns
│       │   │   ├── transactions/         # Send · Auto-payments
│       │   │   ├── history/              # Transaction history
│       │   │   └── profile/              # User profile
│       │   └── api/                      # Backend API routes
│       ├── services/
│       │   ├── algorand/                 # Algorand SDK + Pera Wallet
│       │   ├── solana/                   # Solana Web3.js
│       │   ├── coinbase/                 # Coinbase SDK + Paymaster
│       │   ├── x402/                     # Auto-payment middleware
│       │   └── db/                       # MongoDB connection
│       └── components/                   # Reusable UI components
```

<br/>

---

## 🚀 Getting Started

### Prerequisites
```bash
Node.js >= 20.18.3
Yarn >= 3.2.3
MongoDB URI
WalletConnect Project ID
```

### Installation
```bash
# Clone the repository
git clone https://github.com/sentinels-btu/veritrax.git
cd veritrax

# Install all dependencies
yarn install
```

### Environment Setup
```bash
# Create .env.local in packages/nextjs/
cp packages/nextjs/.env.example packages/nextjs/.env.local
```

```env
NEXT_PUBLIC_WALLETCONNECT_PROJECT_ID=
NEXT_PUBLIC_ALGORAND_API_KEY=
NEXT_PUBLIC_ALGORAND_INDEXER_URL=
NEXT_PUBLIC_SOLANA_RPC_URL=
NEXT_PUBLIC_COINBASE_API_KEY=
MONGODB_URI=
NEXTAUTH_SECRET=
NEXTAUTH_URL=
JWT_SECRET=
COINGECKO_API_KEY=
X402_FACILITATOR_URL=
```

### Run Locally
```bash
# Terminal 1 — Start local blockchain
yarn chain

# Terminal 2 — Deploy contracts
yarn deploy

# Terminal 3 — Start frontend
yarn start
```

### Deploy to Testnet
```bash
yarn deploy --network baseSepolia
yarn deploy --network algorandTestnet
```

<br/>

---

## 💼 Business Model

**Platform as a Service (PaaS)** — Organizations pay, individuals don't.

| Customer | Value Delivered | Revenue Model |
|---|---|---|
| **NGOs** | Campaign tools · donor dashboard · audit reports | Monthly subscription |
| **Startups** | Fundraising · auto-payment · investor transparency | Per campaign fee |
| **Govt Sectors** | Public fund tracking · compliance audit trail | Annual licensing |

**Individual donors always pay zero platform fees.** Only 3–5% Algorand network fee applies.

<br/>

---

## 📊 Why This Wins

| Traditional Platform | VeriTrax |
|---|---|
| 20–30% transaction fees | 3–5% via Algorand |
| Zero fund transparency | Every rupee on public ledger |
| Manual payment releases | x402 conditional automation |
| Single wallet support | MetaMask + Coinbase + Pera + WalletConnect |
| Self-reported fund usage | Tamper-proof on-chain records |
| Centralized — can be manipulated | Decentralized — mathematically immutable |

<br/>

---

## 🔐 Security

- Passwords hashed with `bcryptjs` — never stored plain
- JWT tokens for authenticated sessions
- OpenZeppelin audited contract standards
- Smart contract access control via `Ownable` and `AccessControl`
- TypeChain for type-safe contract interactions — no ABI mismatches
- Input validation via `zod` on all forms and API routes

<br/>

---

## 👥 Team

<div align="center">

| | Name | Role |
|---|---|---|
| 🧠 | **Arsh Maheshwari** | Blockchain + Smart Contracts |
| ⚡ | **Vighnesh Bhati** | Frontend + Web3 Integration |
| 🔧 | **Dhruv Parihar** | Backend + Database |

**Bikaner Technical University**
**Team Sentinels**

</div>

<br/>

---

<div align="center">

<img src="https://capsule-render.vercel.app/api?type=waving&color=0:2C5364,50:203A43,100:0F2027&height=120&section=footer&animation=fadeIn" width="100%"/>

**Built with conviction. Deployed with proof. Trusted by code.**

*VeriTrax — Because trust should never depend on a promise.*

</div>
