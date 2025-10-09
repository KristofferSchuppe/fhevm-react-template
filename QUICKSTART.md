# ⚡ FHEVM Toolkit - Quick Start Guide

**Get started in less than 5 minutes!**

---

## 🎯 For Evaluators

### 1. Review Documentation (2 minutes)

```bash
cd D:\zamadapp\dapp156\fhevm-react-template

# Read main README
cat README.md

# Check submission summary
cat SUBMISSION_SUMMARY.md

# Review setup status
cat SETUP_COMPLETE.md
```

### 2. Explore SDK (1 minute)

```bash
# View SDK README
cat packages/fhevm-sdk/README.md

# Check SDK Guide
cat docs/SDK_GUIDE.md

# Browse source code
ls -la packages/fhevm-sdk/src/
```

### 3. Watch Demo (5 minutes)

```bash
# Play demo video
# demo.mp4 (located in root directory)
```

### 4. Test Examples (2 minutes)

```bash
# Check Next.js example
cat examples/nextjs-evidence-manager/app/page.tsx

# Review smart contract
cat examples/privacy-evidence-manager/contracts/PrivacyEvidenceManager.sol

# See deployment script
cat examples/privacy-evidence-manager/scripts/deploy.js
```

**Total Time**: ~10 minutes to review everything ✅

---

## 👨‍💻 For Developers

### Installation (< 1 minute)

```bash
# Clone repository
cd D:\zamadapp\dapp156\fhevm-react-template

# Install all dependencies
npm install
```

### Build SDK (< 1 minute)

```bash
# Build the SDK package
npm run build
```

### Run Next.js Example (< 30 seconds)

```bash
# Start Next.js development server
npm run dev:nextjs

# Open browser
# http://localhost:3000
```

### Test Smart Contract (< 1 minute)

```bash
# Go to example directory
cd examples/privacy-evidence-manager

# Run tests
npm test

# Expected output:
# ✓ 77 tests passing
# ✓ 92.45% coverage
```

**Total Setup Time**: ~3 minutes ✅

---

## 📦 Using the SDK (< 10 lines)

### Method 1: Pure Node.js

```javascript
import { FhevmClient } from '@fhevm-toolkit/sdk';
import { ethers } from 'ethers';

// 1. Setup (3 lines)
const provider = new ethers.JsonRpcProvider('https://rpc.sepolia.org');
const signer = new ethers.Wallet(process.env.PRIVATE_KEY, provider);
const client = new FhevmClient({ provider, signer, chainId: 11155111 });

// 2. Initialize (1 line)
await client.init();

// 3. Encrypt (1 line)
const encrypted = await client.encryptInput({
  value: 42,
  type: 'uint32',
  contractAddress: '0x...'
});

// Done! ✅
console.log('Encrypted:', encrypted);
```

**Total**: 5 lines of code!

### Method 2: Next.js with React Hooks

```typescript
'use client';

import { useFhevmClient, useEncrypt } from '@fhevm-toolkit/sdk';

export default function Page() {
  // 1. Initialize client (1 hook)
  const { client, isInitialized } = useFhevmClient({
    provider,
    signer,
    chainId: 11155111
  });

  // 2. Use encryption hook (1 hook)
  const { encrypt, isEncrypting } = useEncrypt(client);

  // 3. Encrypt value (1 function call)
  const handleEncrypt = async (value: number) => {
    const result = await encrypt({
      value,
      type: 'uint64',
      contractAddress: '0x...'
    });
  };

  return <div>{/* Your UI */}</div>;
}
```

**Total**: 2 hooks + 1 function = Simple! ✅

---

## 🚀 Quick Commands

### Monorepo Commands

```bash
# Install all packages
npm install

# Build SDK
npm run build

# Build SDK only
npm run build:sdk

# Run Next.js example
npm run dev:nextjs

# Run Privacy Evidence Manager
npm run dev:evidence

# Clean everything
npm run clean

# Lint code
npm run lint

# Format code
npm run format
```

### SDK Commands

```bash
cd packages/fhevm-sdk

# Build SDK
npm run build

# Watch mode
npm run dev

# Run tests
npm test

# Lint
npm run lint
```

### Next.js Example Commands

```bash
cd examples/nextjs-evidence-manager

# Install dependencies
npm install

# Run development server
npm run dev

# Build for production
npm run build

# Start production server
npm start
```

### Smart Contract Example Commands

```bash
cd examples/privacy-evidence-manager

# Install dependencies
npm install

# Compile contracts
npm run compile

# Run tests
npm test

# Deploy to Sepolia
npm run deploy

# All in one
npm run compile && npm test && npm run deploy
```

---

## 📝 Quick Reference

### SDK Imports

```javascript
// Core client
import { FhevmClient } from '@fhevm-toolkit/sdk';

// Encryption helpers
import { encryptBool, encryptUint32, encryptUint64 } from '@fhevm-toolkit/sdk';

// Contract utilities
import { createContract, estimateGasWithBuffer } from '@fhevm-toolkit/sdk';

// Validation
import { validateAddress, validateEncryptedType } from '@fhevm-toolkit/sdk';

// React hooks
import { useFhevmClient, useEncrypt, usePermission } from '@fhevm-toolkit/sdk';

// Types
import type {
  FhevmConfig,
  EncryptionParams,
  EncryptedInput
} from '@fhevm-toolkit/sdk';
```

### Supported Encryption Types

```typescript
// All supported types
'bool'      // Boolean
'uint8'     // 0 to 255
'uint16'    // 0 to 65,535
'uint32'    // 0 to 4,294,967,295
'uint64'    // 0 to 18,446,744,073,709,551,615
'uint128'   // Large numbers
'uint256'   // Very large numbers
'address'   // Ethereum addresses
```

### Common Patterns

```javascript
// Pattern 1: Basic encryption
const encrypted = await client.encryptInput({
  value: 42,
  type: 'uint32',
  contractAddress: CONTRACT_ADDRESS
});

// Pattern 2: Batch encryption
const results = await encryptBatch(client, [
  { value: true, type: 'bool', contractAddress: CONTRACT_ADDRESS },
  { value: 100, type: 'uint64', contractAddress: CONTRACT_ADDRESS }
]);

// Pattern 3: With contract call
const tx = await contract.submitValue(
  encrypted.handles[0],
  encrypted.inputProof
);

// Pattern 4: Permission signature
const permission = await client.generatePermissionSignature(CONTRACT_ADDRESS);
```

---

## 🔗 Important Links

### Documentation
- Main README: `./README.md`
- SDK Guide: `./docs/SDK_GUIDE.md`
- SDK README: `./packages/fhevm-sdk/README.md`
- Submission Summary: `./SUBMISSION_SUMMARY.md`

### Examples
- Next.js: `./examples/nextjs-evidence-manager/`
- Smart Contract: `./examples/privacy-evidence-manager/`

### Demo
- Video: `./demo.mp4`

### Deployed
- Contract: `0x2BB2Eed0a66d74D92897aFAADa41a988E50C1830` (Sepolia)
- Explorer: https://sepolia.etherscan.io/address/0x2BB2Eed0a66d74D92897aFAADa41a988E50C1830

---

## 💡 Tips

### For First-Time Users

1. **Start with README**: Read `./README.md` first
2. **Try SDK directly**: Check `./packages/fhevm-sdk/README.md`
3. **See examples**: Browse `./examples/` directory
4. **Watch demo**: Play `./demo.mp4`
5. **Build and test**: Run `npm install && npm run build && npm test`

### For Developers

1. **Use TypeScript**: Full type definitions available
2. **Check hooks**: React hooks make integration easy
3. **Validate inputs**: Use built-in validation functions
4. **Estimate gas**: Use `estimateGasWithBuffer()` helper
5. **Handle errors**: All custom error types provided

### For Evaluators

1. **Quick review**: Read `SUBMISSION_SUMMARY.md`
2. **Code quality**: Check `PROJECT_STRUCTURE.md`
3. **Completeness**: See `SETUP_COMPLETE.md`
4. **Watch demo**: Play `demo.mp4`
5. **Test examples**: Run `npm test` in examples

---

## 🎯 Next Steps

### If You're Evaluating

1. ✅ Read documentation (10 minutes)
2. ✅ Watch demo video (5 minutes)
3. ✅ Review code structure (5 minutes)
4. ✅ Test examples (optional, 10 minutes)

**Total**: 20-30 minutes for complete evaluation

### If You're Using the SDK

1. ✅ Install dependencies
2. ✅ Build SDK
3. ✅ Follow examples
4. ✅ Read API reference
5. ✅ Start building!

**Total**: 30 minutes to full productivity

---

## ❓ Need Help?

### Documentation
- **SDK Guide**: `./docs/SDK_GUIDE.md`
- **API Reference**: `./packages/fhevm-sdk/src/types/index.ts`
- **Examples**: `./examples/` directory

### Support
- **Issues**: GitHub Issues (to be created)
- **Discussions**: GitHub Discussions (to be created)
- **Email**: Contact through repository

---

## ✅ Checklist

### For Evaluation
- [ ] Read main README
- [ ] Review submission summary
- [ ] Check setup status
- [ ] Watch demo video
- [ ] Explore SDK code
- [ ] Review examples
- [ ] Test if desired

### For Development
- [ ] Install dependencies
- [ ] Build SDK
- [ ] Run examples
- [ ] Read API docs
- [ ] Implement integration
- [ ] Test thoroughly

---

**🚀 Ready to start? Choose your path above!**

---

*FHEVM Toolkit - From zero to confidential dApp in under 10 lines of code*
