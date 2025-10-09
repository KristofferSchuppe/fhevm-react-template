# 🔐 @fhevm-toolkit/sdk

> Universal FHEVM SDK - Framework-agnostic toolkit for building confidential dApps

[![npm version](https://img.shields.io/npm/v/@fhevm-toolkit/sdk)](https://www.npmjs.com/package/@fhevm-toolkit/sdk)
[![License](https://img.shields.io/badge/license-MIT-blue.svg)](LICENSE)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.3+-blue)](https://www.typescriptlang.org/)

## 📋 Overview

The FHEVM Toolkit SDK is a comprehensive, framework-agnostic library for building confidential decentralized applications using Fully Homomorphic Encryption (FHE). It provides a clean, modular API similar to wagmi, making it intuitive for web3 developers.

**Key Features:**
- 🎯 **Framework-Agnostic**: Works with Node.js, Next.js, React, Vue, or any JavaScript environment
- 🔒 **Complete FHE Flow**: Initialization, encryption, decryption, and permission management
- 🪝 **React Hooks**: Optional wagmi-like hooks for React applications
- 📦 **All-in-One**: Wraps all required packages - no scattered dependencies
- 🚀 **Developer-Friendly**: Minimal boilerplate, intuitive API, <10 lines to start
- 📖 **Well-Documented**: Comprehensive guides and examples

---

## 🚀 Quick Start

### Installation

```bash
npm install @fhevm-toolkit/sdk
# or
yarn add @fhevm-toolkit/sdk
# or
pnpm add @fhevm-toolkit/sdk
```

### Basic Usage (< 10 lines)

```javascript
import { FhevmClient } from '@fhevm-toolkit/sdk';
import { ethers } from 'ethers';

// 1. Setup provider and signer
const provider = new ethers.JsonRpcProvider('https://rpc.sepolia.org');
const signer = new ethers.Wallet(PRIVATE_KEY, provider);

// 2. Create client
const client = new FhevmClient({ provider, signer, chainId: 11155111 });

// 3. Initialize
await client.init();

// 4. Encrypt value
const encrypted = await client.encryptInput({
  value: 42,
  type: 'uint32',
  contractAddress: '0x...'
});

// Done! ✅
```

---

## 📚 Core API

### FhevmClient

Main class for FHEVM operations.

```typescript
import { FhevmClient } from '@fhevm-toolkit/sdk';

const client = new FhevmClient({
  provider: ethers.JsonRpcProvider,
  signer: ethers.Wallet,
  chainId: 11155111,
  gatewayUrl: 'https://gateway.fhevm.io', // Optional
  aclAddress: '0x...' // Optional
});

await client.init();
```

### Encryption

Encrypt values for confidential computations:

```typescript
// Single value encryption
const encrypted = await client.encryptInput({
  value: 100,
  type: 'uint64',
  contractAddress: CONTRACT_ADDRESS
});

// Use in contract call
const tx = await contract.submitValue(
  encrypted.handles[0],
  encrypted.inputProof
);
```

**Supported Types:**
- `bool` - Boolean values
- `uint8` - 8-bit unsigned integer
- `uint16` - 16-bit unsigned integer
- `uint32` - 32-bit unsigned integer
- `uint64` - 64-bit unsigned integer
- `uint128` - 128-bit unsigned integer
- `uint256` - 256-bit unsigned integer
- `address` - Ethereum address

### Permission Signatures

Generate EIP-712 signatures for decryption:

```typescript
const permission = await client.generatePermissionSignature(CONTRACT_ADDRESS);

console.log(permission.signature); // EIP-712 signature
console.log(permission.publicKey);  // Public key for verification
```

---

## 🪝 React Hooks

Optional hooks for React applications (wagmi-like API):

```typescript
import { useFhevmClient, useEncrypt, usePermission } from '@fhevm-toolkit/sdk';

function MyComponent() {
  // Initialize client
  const { client, isInitialized, error } = useFhevmClient({
    provider,
    signer,
    chainId: 11155111
  });

  // Encryption hook
  const { encrypt, isEncrypting } = useEncrypt(client);

  // Permission hook
  const { generatePermission } = usePermission(client);

  const handleEncrypt = async () => {
    const result = await encrypt({
      value: 42,
      type: 'uint32',
      contractAddress: CONTRACT_ADDRESS
    });
  };

  return <div>{/* Your UI */}</div>;
}
```

**Available Hooks:**
- `useFhevmClient()` - Initialize and manage FHEVM client
- `useEncrypt()` - Encrypt values
- `usePermission()` - Generate permission signatures
- `useFhevmState()` - Get client state
- `usePublicKey()` - Get public key

---

## 🔧 Utility Functions

### Encryption Helpers

```typescript
import { encryptBool, encryptUint32, encryptUint64, encryptBatch } from '@fhevm-toolkit/sdk';

// Type-specific encryption
const boolResult = await encryptBool(client, true, CONTRACT_ADDRESS);
const uint32Result = await encryptUint32(client, 100, CONTRACT_ADDRESS);
const uint64Result = await encryptUint64(client, 1000000n, CONTRACT_ADDRESS);

// Batch encryption
const results = await encryptBatch(client, [
  { value: true, type: 'bool', contractAddress: CONTRACT_ADDRESS },
  { value: 42, type: 'uint32', contractAddress: CONTRACT_ADDRESS }
]);
```

### Contract Utilities

```typescript
import { createContract, callWithEncryptedInput, estimateGasWithBuffer } from '@fhevm-toolkit/sdk';

// Create contract instance
const contract = createContract(CONTRACT_ADDRESS, ABI, signer);

// Estimate gas with buffer
const gasLimit = await estimateGasWithBuffer(
  contract,
  'submitValue',
  [encrypted.handles[0], encrypted.inputProof],
  1.2 // 20% buffer
);

// Call with encrypted input
const tx = await callWithEncryptedInput(
  contract,
  'submitValue',
  [],
  encrypted
);
```

### Validation

```typescript
import { validateAddress, validateEncryptedType, validateValueForType } from '@fhevm-toolkit/sdk';

validateAddress('0x1234...'); // true/false
validateEncryptedType('uint64'); // true/false
validateValueForType(42, 'uint32'); // true/false
```

---

## 📦 Framework Examples

### Node.js

```javascript
const { FhevmClient } = require('@fhevm-toolkit/sdk');
const { ethers } = require('ethers');

async function main() {
  const provider = new ethers.JsonRpcProvider(RPC_URL);
  const signer = new ethers.Wallet(PRIVATE_KEY, provider);

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

### Next.js

```typescript
'use client';

import { useFhevmClient, useEncrypt } from '@fhevm-toolkit/sdk';
import { useEthersSigner } from './hooks/useEthersSigner';

export default function EncryptPage() {
  const signer = useEthersSigner();

  const { client, isInitialized } = useFhevmClient({
    provider: signer?.provider,
    signer,
    chainId: 11155111
  });

  const { encrypt, isEncrypting } = useEncrypt(client);

  const handleSubmit = async (value: number) => {
    const result = await encrypt({
      value,
      type: 'uint64',
      contractAddress: CONTRACT_ADDRESS
    });

    // Use result in contract call
  };

  return <div>{/* Your UI */}</div>;
}
```

### Vue

```javascript
import { ref, onMounted } from 'vue';
import { FhevmClient } from '@fhevm-toolkit/sdk';

export default {
  setup() {
    const client = ref(null);
    const isInitialized = ref(false);

    onMounted(async () => {
      client.value = new FhevmClient({
        provider,
        signer,
        chainId: 11155111
      });

      await client.value.init();
      isInitialized.value = true;
    });

    const encrypt = async (value) => {
      return await client.value.encryptInput({
        value,
        type: 'uint64',
        contractAddress: CONTRACT_ADDRESS
      });
    };

    return { client, isInitialized, encrypt };
  }
};
```

---

## 🏗️ Architecture

```
@fhevm-toolkit/sdk
├── core/
│   ├── FhevmClient.ts        # Main client class
│   ├── encryption.ts         # Encryption utilities
│   └── decryption.ts         # Decryption utilities
├── adapters/
│   └── react/
│       └── hooks.ts          # React hooks
├── utils/
│   ├── contract.ts           # Contract helpers
│   └── validation.ts         # Validation functions
├── types/
│   └── index.ts              # TypeScript types
└── config/
    └── index.ts              # Network configurations
```

---

## 🔒 Security

### Best Practices

1. **Never expose private keys**: Use environment variables
2. **Validate all inputs**: Use built-in validation utilities
3. **Use permission signatures**: Implement proper EIP-712 signatures for decryption
4. **Gas estimation**: Always estimate gas before transactions
5. **Error handling**: Wrap all SDK calls in try-catch blocks

### Error Types

```typescript
import { FhevmError, EncryptionError, DecryptionError, InitializationError } from '@fhevm-toolkit/sdk';

try {
  await client.init();
} catch (error) {
  if (error instanceof InitializationError) {
    console.error('Initialization failed:', error.message);
  }
}
```

---

## 📖 TypeScript Support

Full TypeScript support with type definitions:

```typescript
import type {
  FhevmConfig,
  EncryptionParams,
  EncryptedInput,
  DecryptionParams,
  PermissionSignature,
  FhevmInstanceState,
  EncryptedType
} from '@fhevm-toolkit/sdk';
```

---

## 🧪 Testing

```bash
# Run tests
npm test

# Run with coverage
npm run test:coverage
```

---

## 🤝 Contributing

Contributions welcome! Please read our [Contributing Guide](../../CONTRIBUTING.md).

---

## 📄 License

MIT License - see [LICENSE](LICENSE) file for details.

---

## 🔗 Links

- **Documentation**: [Full Docs](../../docs/SDK_GUIDE.md)
- **Examples**: [Example Apps](../../examples/)
- **Issues**: [GitHub Issues](https://github.com/your-org/fhevm-toolkit/issues)
- **Zama Docs**: [docs.zama.ai/fhevm](https://docs.zama.ai/fhevm)

---

**Built for Zama FHEVM Challenge** 🏆

*Making confidential computing simple, consistent, and developer-friendly*
