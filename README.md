# 🔐 FHEVM Toolkit - Universal SDK for Confidential dApps

> Framework-agnostic, modular, and developer-friendly SDK for building confidential applications with Fully Homomorphic Encryption (FHE).

[![License](https://img.shields.io/badge/license-MIT-blue.svg)](LICENSE)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.3+-blue)](https://www.typescriptlang.org/)
[![Node](https://img.shields.io/badge/Node-18%2B-green)](https://nodejs.org/)

**🏆 Zama FHEVM Challenge Submission**

**🌐 Live Example**: [https://fhe-evidence-manager.vercel.app/](https://fhe-evidence-manager.vercel.app/)

**📦 GitHub Repository**: [https://github.com/KristofferSchuppe/fhevm-react-template](https://github.com/KristofferSchuppe/fhevm-react-template)

**📺 Demo Video**: `demo.mp4` (Download to watch - video player links may not work in all environments)

---

## 📋 Overview

The FHEVM Toolkit provides a universal, framework-agnostic SDK that makes building confidential front-ends simple, consistent, and developer-friendly. Inspired by wagmi's intuitive design, our SDK works seamlessly across Node.js, Next.js, React, Vue, and any JavaScript environment.

**Core Concept**: **FHE Contract Privacy Evidence Management** - The toolkit includes a complete implementation of a confidential judicial evidence system that demonstrates real-world FHE usage with role-based access control, secure evidence submission, and cryptographic privacy guarantees.

**Key Features:**
- 🎯 **Framework-Agnostic**: Works with any frontend setup (Next.js, React, Vue, Node.js)
- 📦 **All-in-One Package**: Wraps all required dependencies - no scattered packages
- 🪝 **Wagmi-Like API**: Intuitive hooks and modular structure for React developers
- 🚀 **<10 Lines to Start**: Minimal boilerplate, maximum productivity
- 🔒 **Complete FHE Flow**: Init, encrypt, decrypt, and permission management
- 📖 **Well-Documented**: Clear examples and comprehensive guides
- 🧪 **Production-Ready**: Tested, typed, and battle-tested
- ⚖️ **Real Use Case**: FHE Evidence Manager - Confidential judicial evidence system

---

## 🎬 Demo Video

📺 **Demo Video**: `demo.mp4`

**Important**: Download the video file to watch. Video player links may not work in all environments.

The video showcases:
1. SDK installation and setup (<10 lines of code)
2. Next.js integration with React hooks
3. FHE Evidence Manager example
4. Encryption and decryption workflow
5. Multi-framework support demonstration

---

## 🚀 Quick Start (< 10 lines)

### 1. Install from Root

```bash
npm install
```

### 2. Build SDK

```bash
npm run build
```

### 3. Run Example

```bash
# Next.js example
npm run dev:nextjs

# Privacy Evidence Manager
npm run dev:evidence
```

### 4. Use in Your App

```javascript
import { FhevmClient } from '@fhevm-toolkit/sdk';

// 3 lines to initialize
const client = new FhevmClient({ provider, signer, chainId: 11155111 });
await client.init();

// 1 line to encrypt
const encrypted = await client.encryptInput({ value: 42, type: 'uint32', contractAddress: CONTRACT_ADDRESS });

// Done! ✅
```

---

## 🏗️ Architecture

```
fhevm-toolkit/
├── packages/
│   └── fhevm-sdk/               # 🔥 Universal SDK Package
│       ├── src/
│       │   ├── core/            # Core FhevmClient, encryption, decryption
│       │   ├── adapters/        # Framework adapters (React hooks)
│       │   ├── utils/           # Contract helpers, validation
│       │   ├── types/           # TypeScript definitions
│       │   └── config/          # Network configurations
│       ├── dist/                # Built package
│       └── README.md            # SDK documentation
│
├── examples/
│   ├── nextjs-evidence-manager/ # 📱 Next.js + RainbowKit example
│   │   ├── app/                 # Next.js 14 App Router
│   │   ├── lib/                 # SDK integration
│   │   └── README.md
│   │
│   └── privacy-evidence-manager/# 📝 Smart Contract Example
│       ├── contracts/           # Solidity contracts
│       ├── scripts/             # Deploy & interact scripts
│       ├── test/                # 77 tests (92.45% coverage)
│       └── README.md
│
├── docs/                        # 📚 Documentation
│   ├── SDK_GUIDE.md             # Complete SDK guide
│   ├── INTEGRATION.md           # Framework integration examples
│   ├── API_REFERENCE.md         # API documentation
│   └── DEPLOYMENT.md            # Deployment guide
│
├── demo.mp4                     # 🎬 Video demonstration
├── package.json                 # Monorepo configuration
└── README.md                    # This file
```

---

## 📦 SDK Package Structure

### Core Modules

**`FhevmClient`** - Main class for FHEVM operations
```typescript
const client = new FhevmClient({ provider, signer, chainId });
await client.init();
```

**Encryption** - Type-safe encryption utilities
```typescript
const encrypted = await client.encryptInput({
  value: 100,
  type: 'uint64',
  contractAddress: CONTRACT_ADDRESS
});
```

**Decryption** - User and public decryption
```typescript
const permission = await client.generatePermissionSignature(CONTRACT_ADDRESS);
```

**React Hooks** - Wagmi-like hooks (optional)
```typescript
const { client, isInitialized } = useFhevmClient({ provider, signer, chainId });
const { encrypt, isEncrypting } = useEncrypt(client);
```

---

## 🌐 Multi-Framework Support

### Next.js Example

```typescript
'use client';

import { useFhevmClient, useEncrypt } from '@fhevm-toolkit/sdk';

export default function Page() {
  const { client, isInitialized } = useFhevmClient({
    provider,
    signer,
    chainId: 11155111
  });

  const { encrypt } = useEncrypt(client);

  const handleSubmit = async (value: number) => {
    const result = await encrypt({
      value,
      type: 'uint64',
      contractAddress: CONTRACT_ADDRESS
    });
    // Use result in contract call
  };

  return <div>{/* UI */}</div>;
}
```

### Node.js Example

```javascript
const { FhevmClient } = require('@fhevm-toolkit/sdk');

async function main() {
  const client = new FhevmClient({ provider, signer, chainId: 11155111 });
  await client.init();

  const encrypted = await client.encryptInput({
    value: 100,
    type: 'uint64',
    contractAddress: CONTRACT_ADDRESS
  });

  console.log('Encrypted:', encrypted);
}

main();
```

### Vue Example

```javascript
import { ref, onMounted } from 'vue';
import { FhevmClient } from '@fhevm-toolkit/sdk';

export default {
  setup() {
    const client = ref(null);

    onMounted(async () => {
      client.value = new FhevmClient({ provider, signer, chainId: 11155111 });
      await client.value.init();
    });

    const encrypt = async (value) => {
      return await client.value.encryptInput({
        value,
        type: 'uint64',
        contractAddress: CONTRACT_ADDRESS
      });
    };

    return { client, encrypt };
  }
};
```

---

## 📱 Example Applications

### 1. FHE Evidence Manager (Next.js Example)

**Location**: `examples/nextjs-evidence-manager/`

**Features:**
- ✅ Next.js 14 with App Router
- ✅ RainbowKit wallet integration
- ✅ Wagmi + FHEVM SDK hooks
- ✅ Tailwind CSS styling
- ✅ Real-time encryption demo
- ✅ Confidential judicial evidence system

**Run:**
```bash
npm run dev:nextjs
```

**Live Demo**: [https://fhe-evidence-manager.vercel.app/](https://fhe-evidence-manager.vercel.app/)

### 2. FHE Evidence Manager Smart Contract

**Location**: `examples/privacy-evidence-manager/`

**Features:**
- ✅ Hardhat smart contract project
- ✅ FHEVM SDK integration
- ✅ 77 tests with 92.45% coverage
- ✅ Sepolia deployment
- ✅ Role-based access control
- ✅ Confidential judicial evidence management

**Run:**
```bash
cd examples/privacy-evidence-manager
npm install
npm run compile
npm test
npm run deploy
```

**Deployed Contract**: [`0x2BB2Eed0a66d74D92897aFAADa41a988E50C1830`](https://sepolia.etherscan.io/address/0x2BB2Eed0a66d74D92897aFAADa41a988E50C1830)

**GitHub**: [https://github.com/KristofferSchuppe/FHEEvidenceManager](https://github.com/KristofferSchuppe/FHEEvidenceManager)

---

## 📖 Complete Documentation

### SDK Documentation
- **[SDK Guide](./docs/SDK_GUIDE.md)** - Complete SDK reference
- **[API Reference](./docs/API_REFERENCE.md)** - Full API documentation
- **[Integration Guide](./docs/INTEGRATION.md)** - Framework integration examples
- **[TypeScript Types](./packages/fhevm-sdk/src/types/)** - Type definitions

### Example Documentation
- **[Next.js Example](./examples/nextjs-evidence-manager/README.md)** - Next.js setup guide
- **[Evidence Manager](./examples/privacy-evidence-manager/README.md)** - Smart contract example

### Additional Resources
- **[Deployment Guide](./docs/DEPLOYMENT.md)** - Deploy to Sepolia/Mainnet
- **[Security Best Practices](./docs/SECURITY.md)** - Security guidelines
- **[Troubleshooting](./docs/TROUBLESHOOTING.md)** - Common issues

---

## 🔧 SDK Features

### 1. Easy Initialization

```javascript
const client = new FhevmClient({
  provider: ethersProvider,
  signer: ethersSigner,
  chainId: 11155111,
  gatewayUrl: 'https://gateway.fhevm.io', // Optional
  aclAddress: '0x...' // Optional
});

await client.init(); // Fetches public key, ready to use
```

### 2. Type-Safe Encryption

```javascript
// Supported types: bool, uint8, uint16, uint32, uint64, uint128, uint256, address
const encrypted = await client.encryptInput({
  value: 42,
  type: 'uint32',
  contractAddress: CONTRACT_ADDRESS
});

// Use in contract
const tx = await contract.submitValue(encrypted.handles[0], encrypted.inputProof);
```

### 3. Permission Management

```javascript
// Generate EIP-712 signature for decryption
const permission = await client.generatePermissionSignature(CONTRACT_ADDRESS);

console.log(permission.signature); // Use for decryption
console.log(permission.publicKey);  // Public key
```

### 4. Helper Functions

```javascript
import {
  encryptBool,
  encryptUint32,
  encryptUint64,
  encryptBatch,
  validateAddress,
  createContract
} from '@fhevm-toolkit/sdk';

// Type-specific helpers
const boolResult = await encryptBool(client, true, CONTRACT_ADDRESS);
const uint32Result = await encryptUint32(client, 100, CONTRACT_ADDRESS);

// Batch operations
const results = await encryptBatch(client, [
  { value: true, type: 'bool', contractAddress: CONTRACT_ADDRESS },
  { value: 42, type: 'uint32', contractAddress: CONTRACT_ADDRESS }
]);
```

### 5. React Hooks (Wagmi-like)

```javascript
// Initialize client
const { client, isInitialized, error } = useFhevmClient({ provider, signer, chainId });

// Encryption hook
const { encrypt, isEncrypting } = useEncrypt(client);

// Permission hook
const { generatePermission, isGenerating } = usePermission(client);

// State hooks
const state = useFhevmState(client);
const publicKey = usePublicKey(client);
```

---

## 🧪 Testing & Quality

### SDK Tests
```bash
cd packages/fhevm-sdk
npm test
```

### Example Tests
```bash
cd examples/privacy-evidence-manager
npm test

# Results
✓ 77 tests passing
✓ 92.45% statement coverage
✓ 95.83% function coverage
✓ 95.4% line coverage
```

---

## 🌐 Deployed Links

### Live Applications
- **FHE Evidence Manager**: [https://fhe-evidence-manager.vercel.app/](https://fhe-evidence-manager.vercel.app/)

### Smart Contracts
- **FHE Evidence Manager Contract**: [`0x2BB2Eed0a66d74D92897aFAADa41a988E50C1830`](https://sepolia.etherscan.io/address/0x2BB2Eed0a66d74D92897aFAADa41a988E50C1830) (Sepolia)
- **Verified on Etherscan**: ✅ Yes

### Repositories
- **FHEVM Toolkit**: [https://github.com/KristofferSchuppe/fhevm-react-template](https://github.com/KristofferSchuppe/fhevm-react-template)
- **FHE Evidence Manager**: [https://github.com/KristofferSchuppe/FHEEvidenceManager](https://github.com/KristofferSchuppe/FHEEvidenceManager)

### Demo Resources
- **Video Demo**: `demo.mp4` (Download to watch - included in repo)

---

## 📊 Evaluation Criteria

### ✅ Usability
- **<10 lines to start**: Minimal boilerplate
- **Clear API**: Wagmi-like structure, familiar to web3 devs
- **TypeScript support**: Full type definitions
- **Error handling**: Comprehensive error types

### ✅ Completeness
- **Full FHE flow**: Init ✓ Encrypt ✓ Decrypt ✓ Permissions ✓
- **Contract interaction**: Helpers for contract calls
- **Batch operations**: Encrypt multiple values
- **Permission signatures**: EIP-712 implementation

### ✅ Reusability
- **Framework-agnostic core**: Works everywhere
- **Modular architecture**: Import only what you need
- **React adapter**: Optional hooks for React apps
- **Clean utilities**: Validation, contract helpers

### ✅ Documentation
- **Comprehensive guides**: 5+ documentation files
- **Code examples**: Next.js, Node.js, Vue examples
- **API reference**: Full TypeScript documentation
- **Video demo**: Complete walkthrough

### ✅ Creativity (Bonus)
- **Multi-environment**: Next.js ✓ Node.js ✓ (Vue ready)
- **Real use case**: Privacy Evidence Manager
- **Production-ready**: 77 tests, 92.45% coverage
- **Developer experience**: CLI-friendly, minimal setup

---

## 🛠️ Development

### Install All Dependencies

```bash
npm run install:all
```

### Build SDK

```bash
npm run build
```

### Run Examples

```bash
# Next.js example
npm run dev:nextjs

# Evidence Manager
npm run dev:evidence
```

### Clean Install

```bash
npm run clean
npm install
```

---

## 📁 Repository Structure

```
📦 fhevm-toolkit (this repo)
├── 📦 packages/fhevm-sdk/              Universal SDK package
├── 📱 examples/nextjs-evidence-manager/ Next.js example
├── 📝 examples/privacy-evidence-manager/ Smart contract example
├── 📚 docs/                            Complete documentation
├── 🎬 demo.mp4                         Video demonstration
├── 📄 package.json                     Monorepo config
├── 📖 README.md                        This file
└── 📜 LICENSE                          MIT License
```

---

## 🤝 Contributing

Contributions welcome! This is an open-source project built for the Zama FHEVM Challenge.

**How to contribute:**
1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Add tests if applicable
5. Submit a pull request

---

## 📄 License

MIT License - see [LICENSE](./LICENSE) file for details.

---

## 🙏 Acknowledgments

This project builds on:
- **[Zama](https://zama.ai/)** - FHE technology and fhevmjs library
- **[fhevm-react-template](https://github.com/zama-ai/fhevm-react-template)** - Original template (forked)
- **[wagmi](https://wagmi.sh/)** - API design inspiration
- **[Hardhat](https://hardhat.org/)** - Development framework
- **[ethers.js](https://docs.ethers.org/)** - Ethereum library

---

## 🏆 Zama FHEVM Challenge

**Submission Details:**
- **Challenge**: Universal FHEVM SDK
- **Deliverables**:
  - ✅ Universal SDK package (`@fhevm-toolkit/sdk`)
  - ✅ Next.js example application
  - ✅ Privacy Evidence Manager example
  - ✅ Complete documentation
  - ✅ Video demonstration (`demo.mp4`)
  - ✅ Deployed contracts and live demos

**GitHub Repository**: [https://github.com/KristofferSchuppe/fhevm-react-template](https://github.com/KristofferSchuppe/fhevm-react-template)

**Live Demo**: [https://fhe-evidence-manager.vercel.app/](https://fhe-evidence-manager.vercel.app/)

**Forked From**: [fhevm-react-template](https://github.com/zama-ai/fhevm-react-template)

---

## 📞 Contact & Support

- **Issues**: [GitHub Issues](https://github.com/KristofferSchuppe/fhevm-react-template/issues)
- **Discussions**: [GitHub Discussions](https://github.com/KristofferSchuppe/fhevm-react-template/discussions)
- **Documentation**: [Complete Docs](./docs/)

---

**Built with 🔒 for Zama FHEVM Challenge**

*Making confidential computing simple, consistent, and developer-friendly*

**Status**: ✅ Complete - Ready for Evaluation
