# Next.js FHE Example Application

A comprehensive Next.js 14 example application demonstrating Fully Homomorphic Encryption (FHE) capabilities using the `@fhevm-toolkit/sdk`. This application showcases secure data encryption, homomorphic computations, and real-world use cases for privacy-preserving applications.

---

## 📋 Overview

This example showcases how to integrate the `@fhevm-toolkit/sdk` into a Next.js 14 application with App Router, demonstrating:

- ✅ **Encryption Demo**: Interactive demonstration of FHE encryption and decryption
- ✅ **Homomorphic Computation**: Perform operations on encrypted data without decryption
- ✅ **Key Management**: Generate, store, and manage FHE encryption keys
- ✅ **Banking Example**: Secure financial transaction processing with encrypted balances
- ✅ **Medical Example**: HIPAA-compliant medical data handling and analysis
- ✅ **Type-Safe API**: Fully typed API routes with comprehensive error handling
- ✅ **Modern UI**: Built with Tailwind CSS and custom React components

---

## 🚀 Quick Start

### Prerequisites

- Node.js 18.0.0 or higher
- npm, yarn, or pnpm package manager

### Installation

1. Clone the repository and navigate to the project:

```bash
cd examples/nextjs-fhe-example
```

2. Install dependencies:

```bash
npm install
# or
yarn install
# or
pnpm install
```

3. Run the development server:

```bash
npm run dev
# or
yarn dev
# or
pnpm dev
```

4. Open [http://localhost:3000](http://localhost:3000) in your browser

---

## 🏗️ Project Structure

```
src/
├── app/                        # App Router (Next.js 14)
│   ├── layout.tsx              # Root layout with FHE provider
│   ├── page.tsx                # Home page with tabbed interface
│   ├── globals.css             # Global styles and Tailwind
│   └── api/                    # API routes
│       ├── fhe/
│       │   ├── route.ts        # FHE initialization
│       │   ├── encrypt/route.ts # Encryption endpoint
│       │   ├── decrypt/route.ts # Decryption endpoint
│       │   └── compute/route.ts # Computation endpoint
│       └── keys/route.ts       # Key management
│
├── components/                 # React components
│   ├── ui/                     # Basic UI components
│   │   ├── Button.tsx          # Reusable button component
│   │   ├── Input.tsx           # Form input component
│   │   └── Card.tsx            # Card container component
│   ├── fhe/                    # FHE functionality components
│   │   ├── FHEProvider.tsx     # FHE context provider
│   │   ├── EncryptionDemo.tsx  # Encryption demo interface
│   │   ├── ComputationDemo.tsx # Computation demo interface
│   │   └── KeyManager.tsx      # Key management interface
│   └── examples/               # Use case examples
│       ├── BankingExample.tsx  # Banking use case
│       └── MedicalExample.tsx  # Medical use case
│
├── lib/                        # Utility libraries
│   ├── fhe/                    # FHE integration library
│   │   ├── client.ts           # Client-side FHE operations
│   │   ├── server.ts           # Server-side FHE operations
│   │   ├── keys.ts             # Key management logic
│   │   └── types.ts            # FHE type definitions
│   └── utils/                  # Utility functions
│       ├── security.ts         # Security utilities
│       └── validation.ts       # Validation functions
│
├── hooks/                      # Custom React Hooks
│   ├── useFHE.ts               # Main FHE operations hook
│   ├── useEncryption.ts        # Encryption/decryption hook
│   └── useComputation.ts       # Computation hook
│
└── types/                      # TypeScript types
    ├── fhe.ts                  # FHE-related types
    └── api.ts                  # API type definitions
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
