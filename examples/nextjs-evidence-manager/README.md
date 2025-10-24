# FHE Evidence Manager - Next.js Example

Next.js application demonstrating FHEVM SDK integration with confidential judicial evidence management.

---

## 📋 Overview

This example showcases how to integrate the `@fhevm-toolkit/sdk` into a Next.js 14 application with App Router, demonstrating:

- ✅ Client-side FHE encryption
- ✅ Wagmi + Rainbow Kit wallet integration
- ✅ React hooks for FHEVM operations
- ✅ Tailwind CSS styling
- ✅ Real-time evidence submission

**Live Demo**: [https://fhe-evidence-manager.vercel.app/](https://fhe-evidence-manager.vercel.app/)

---

## 🚀 Quick Start

### Prerequisites

- Node.js 18+ or 20+
- npm or yarn
- MetaMask or similar Web3 wallet

### Installation

```bash
# Install dependencies
npm install

# Copy environment file
cp .env.example .env.local

# Update .env.local with your values
```

### Environment Variables

Create `.env.local`:

```env
# Contract Address
NEXT_PUBLIC_CONTRACT_ADDRESS=0x2BB2Eed0a66d74D92897aFAADa41a988E50C1830

# Network
NEXT_PUBLIC_CHAIN_ID=11155111

# RPC URL
NEXT_PUBLIC_RPC_URL=https://rpc.sepolia.org

# WalletConnect (optional)
NEXT_PUBLIC_WALLETCONNECT_PROJECT_ID=your_project_id
```

### Run Development Server

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000)

---

## 🏗️ Project Structure

```
app/
├── layout.tsx              # Root layout
├── page.tsx                # Home page (main demo)
├── providers.tsx           # Wagmi/RainbowKit providers
│
hooks/
├── useFhevm.ts            # Custom FHEVM hook
└── useEthersSigner.ts     # Wagmi to ethers adapter
│
lib/
├── wagmi.ts               # Wagmi configuration
└── fhevm.ts               # FHEVM utilities
│
public/
└── ...                    # Static assets
```

---

## 🔧 Key Features

### 1. FHEVM Integration

**Custom Hook** (`hooks/useFhevm.ts`):

```typescript
import { useFhevmClient, useEncrypt } from '@fhevm-toolkit/sdk';

export function useFhevm() {
  const signer = useEthersSigner();

  const { client, isInitialized } = useFhevmClient({
    provider: signer?.provider,
    signer,
    chainId: 11155111
  });

  const { encrypt, isEncrypting } = useEncrypt(client);

  return { client, isInitialized, encrypt, isEncrypting };
}
```

### 2. Wallet Connection

**Wagmi Configuration** (`lib/wagmi.ts`):

```typescript
import { createConfig, http } from 'wagmi';
import { sepolia } from 'wagmi/chains';
import { injected, walletConnect } from 'wagmi/connectors';

export const config = createConfig({
  chains: [sepolia],
  connectors: [
    injected(),
    walletConnect({
      projectId: process.env.NEXT_PUBLIC_WALLETCONNECT_PROJECT_ID!
    })
  ],
  transports: {
    [sepolia.id]: http()
  }
});
```

### 3. Evidence Submission

**Page Component** (`app/page.tsx`):

```typescript
'use client';

import { useFhevm } from '../hooks/useFhevm';

export default function Home() {
  const { encrypt, isEncrypting } = useFhevm();

  const handleSubmit = async (value: number) => {
    const encrypted = await encrypt({
      value,
      type: 'uint64',
      contractAddress: process.env.NEXT_PUBLIC_CONTRACT_ADDRESS!
    });

    // Submit to contract
    await contract.submitEvidence(
      caseId,
      metadataURI,
      evidenceType,
      encrypted.handles[0],
      encrypted.inputProof
    );
  };

  return <div>{/* UI */}</div>;
}
```

---

## 📱 Features Demo

### Evidence Submission Flow

1. **Connect Wallet** - Click "Connect Wallet" button
2. **Initialize FHEVM** - Automatic on wallet connection
3. **Enter Evidence** - Fill in case details and evidence
4. **Encrypt Data** - Client-side encryption with FHE
5. **Submit Transaction** - On-chain submission to smart contract
6. **Confirm** - View transaction on Etherscan

### Role-Based Access

- **Judge** - Create cases, grant access, seal evidence
- **Reviewer** - Review and approve/reject evidence
- **Submitter** - Submit encrypted evidence to cases

---

## 🎨 UI Components

### Custom Components

**Evidence Form:**
```typescript
<form onSubmit={handleSubmit}>
  <input
    type="number"
    value={caseId}
    onChange={(e) => setCaseId(e.target.value)}
    placeholder="Case ID"
  />
  <input
    type="text"
    value={metadataURI}
    onChange={(e) => setMetadataURI(e.target.value)}
    placeholder="Evidence URI"
  />
  <button type="submit" disabled={isEncrypting}>
    {isEncrypting ? 'Encrypting...' : 'Submit Evidence'}
  </button>
</form>
```

### Loading States

```typescript
{isInitializing && (
  <div className="flex items-center gap-2">
    <Spinner />
    <span>Initializing FHEVM...</span>
  </div>
)}
```

---

## 🔐 Security

### Best Practices

1. **Environment Variables** - Never commit `.env.local`
2. **Input Validation** - Validate all user inputs
3. **Error Handling** - Catch and display errors properly
4. **Wallet Security** - Never store private keys in code
5. **HTTPS Only** - Always use HTTPS in production

---

## 📦 Build & Deploy

### Build for Production

```bash
npm run build
```

### Deploy to Vercel

1. **Push to GitHub**
   ```bash
   git push origin main
   ```

2. **Connect to Vercel**
   - Import repository in Vercel
   - Add environment variables
   - Deploy

3. **Configure Environment**
   - Add all `NEXT_PUBLIC_*` variables
   - Set production URLs
   - Enable analytics (optional)

**Deployed**: https://fhe-evidence-manager.vercel.app/

---

## 🧪 Testing

```bash
# Run tests (if implemented)
npm test

# Type check
npx tsc --noEmit

# Lint
npm run lint
```

---

## 📚 Documentation

### SDK Documentation
- [SDK Guide](../../docs/SDK_GUIDE.md)
- [API Reference](../../docs/API_REFERENCE.md)
- [Integration Guide](../../docs/INTEGRATION.md)

### Related
- [Smart Contract Example](../privacy-evidence-manager/)
- [Deployment Guide](../../docs/DEPLOYMENT.md)
- [Troubleshooting](../../docs/TROUBLESHOOTING.md)

---

## 🔗 Links

- **Live Demo**: https://fhe-evidence-manager.vercel.app/
- **GitHub**: https://github.com/KristofferSchuppe/fhevm-react-template
- **Smart Contract**: https://github.com/KristofferSchuppe/FHEEvidenceManager
- **Etherscan**: https://sepolia.etherscan.io/address/0x2BB2Eed0a66d74D92897aFAADa41a988E50C1830

---

## 💡 Tips

1. **MetaMask Required** - Install MetaMask browser extension
2. **Sepolia ETH** - Get testnet ETH from [faucet](https://sepoliafaucet.com)
3. **Network Switch** - App will prompt to switch to Sepolia
4. **Transaction Time** - Sepolia transactions take ~15 seconds

---

## 🐛 Troubleshooting

### Common Issues

**Wallet not connecting:**
- Check MetaMask is installed
- Try refreshing the page
- Clear browser cache

**FHEVM not initializing:**
- Check RPC URL in `.env.local`
- Verify network is Sepolia (Chain ID: 11155111)
- Check browser console for errors

**Transaction failing:**
- Ensure sufficient Sepolia ETH
- Check gas settings
- Verify contract address

See [Troubleshooting Guide](../../docs/TROUBLESHOOTING.md) for more help.

---

## 📄 License

MIT License - see [LICENSE](../../LICENSE) file for details.

---

**Built with Next.js 14, FHEVM SDK, and Wagmi**
