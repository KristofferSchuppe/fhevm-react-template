# 📖 FHEVM SDK Complete Guide

## Table of Contents

1. [Introduction](#introduction)
2. [Installation](#installation)
3. [Core Concepts](#core-concepts)
4. [API Reference](#api-reference)
5. [Framework Integration](#framework-integration)
6. [Best Practices](#best-practices)
7. [Troubleshooting](#troubleshooting)

---

## Introduction

The FHEVM Toolkit SDK is a universal, framework-agnostic library for building confidential dApps with Fully Homomorphic Encryption (FHE).

### Key Features

- **Framework-Agnostic**: Works with any JavaScript environment
- **Modular Architecture**: Import only what you need
- **TypeScript Support**: Full type definitions
- **React Hooks**: Optional wagmi-like hooks
- **Production-Ready**: Tested and documented

---

## Installation

### NPM

```bash
npm install @fhevm-toolkit/sdk ethers
```

### Yarn

```bash
yarn add @fhevm-toolkit/sdk ethers
```

### PNPM

```bash
pnpm add @fhevm-toolkit/sdk ethers
```

### Peer Dependencies

The SDK requires:
- `ethers` ^6.9.0
- `fhevmjs` ^0.5.0 (automatically installed)

---

## Core Concepts

### 1. FhevmClient

The main class for FHEVM operations.

```typescript
import { FhevmClient } from '@fhevm-toolkit/sdk';
import { ethers } from 'ethers';

// Create provider and signer
const provider = new ethers.JsonRpcProvider('https://rpc.sepolia.org');
const signer = new ethers.Wallet(PRIVATE_KEY, provider);

// Initialize client
const client = new FhevmClient({
  provider,
  signer,
  chainId: 11155111 // Sepolia
});

await client.init();
```

### 2. Encryption

Encrypt values before sending to smart contracts.

```typescript
const encrypted = await client.encryptInput({
  value: 42,
  type: 'uint32',
  contractAddress: CONTRACT_ADDRESS
});

// Result structure
{
  handles: ['0x...'],
  inputProof: '0x...'
}
```

### 3. Permission Signatures

Generate EIP-712 signatures for decryption.

```typescript
const permission = await client.generatePermissionSignature(CONTRACT_ADDRESS);

// Result structure
{
  signature: '0x...',
  publicKey: '0x...'
}
```

---

## API Reference

### FhevmClient Class

#### Constructor

```typescript
new FhevmClient(config: FhevmConfig)
```

**Parameters:**
```typescript
interface FhevmConfig {
  provider: Provider;
  signer?: Signer;
  chainId: number;
  gatewayUrl?: string;
  aclAddress?: string;
}
```

#### Methods

**`init(): Promise<void>`**
- Initialize FHEVM instance
- Fetches public key
- Required before encryption

**`encryptInput(params: EncryptionParams): Promise<EncryptedInput>`**
- Encrypt a value
- Returns handles and inputProof

**`generatePermissionSignature(contractAddress: string): Promise<PermissionSignature>`**
- Generate EIP-712 signature for decryption
- Requires signer

**`getState(): FhevmInstanceState`**
- Get current client state
- Returns instance, publicKey, isInitialized

**`getInstance(): FhevmInstance | null`**
- Get raw FHEVM instance
- For advanced usage

**`getPublicKey(): string | null`**
- Get encryption public key

**`get initialized(): boolean`**
- Check if client is initialized

---

### Encryption Functions

#### `encryptBool()`

```typescript
async function encryptBool(
  client: FhevmClient,
  value: boolean,
  contractAddress: string
): Promise<EncryptedInput>
```

#### `encryptUint8()` / `encryptUint16()` / `encryptUint32()` / `encryptUint64()`

```typescript
async function encryptUint32(
  client: FhevmClient,
  value: number | bigint,
  contractAddress: string
): Promise<EncryptedInput>
```

#### `encryptAddress()`

```typescript
async function encryptAddress(
  client: FhevmClient,
  value: string,
  contractAddress: string
): Promise<EncryptedInput>
```

#### `encryptBatch()`

```typescript
async function encryptBatch(
  client: FhevmClient,
  params: EncryptionParams[]
): Promise<EncryptedInput[]>
```

---

### React Hooks

#### `useFhevmClient()`

```typescript
function useFhevmClient(config: FhevmConfig): {
  client: FhevmClient | null;
  isInitializing: boolean;
  isInitialized: boolean;
  error: Error | null;
  reinit: () => Promise<void>;
}
```

#### `useEncrypt()`

```typescript
function useEncrypt(client: FhevmClient | null): {
  encrypt: (params: EncryptionParams) => Promise<EncryptedInput | null>;
  isEncrypting: boolean;
  error: Error | null;
}
```

#### `usePermission()`

```typescript
function usePermission(client: FhevmClient | null): {
  generatePermission: (contractAddress: string) => Promise<PermissionSignature | null>;
  isGenerating: boolean;
  error: Error | null;
}
```

#### `useFhevmState()`

```typescript
function useFhevmState(client: FhevmClient | null): FhevmInstanceState | null
```

#### `usePublicKey()`

```typescript
function usePublicKey(client: FhevmClient | null): string | null
```

---

### Utility Functions

#### Contract Helpers

```typescript
// Create contract instance
function createContract(
  address: string,
  abi: InterfaceAbi,
  signerOrProvider: Signer | Provider
): Contract

// Get contract with options
function getContract(
  options: ContractOptions,
  signerOrProvider: Signer | Provider
): Contract

// Call with encrypted input
async function callWithEncryptedInput(
  contract: Contract,
  method: string,
  args: any[],
  encryptedInput: EncryptedInput
): Promise<any>

// Estimate gas with buffer
async function estimateGasWithBuffer(
  contract: Contract,
  method: string,
  args: any[],
  buffer: number = 1.2
): Promise<bigint>
```

#### Validation

```typescript
// Validate Ethereum address
function validateAddress(address: string): boolean

// Validate encrypted type
function validateEncryptedType(type: string): boolean

// Validate value for type
function validateValueForType(value: any, type: string): boolean

// Validate chain ID
function validateChainId(chainId: number): boolean

// Sanitize input
function sanitizeInput(value: any, type: string): any
```

---

## Framework Integration

### Next.js (App Router)

```typescript
'use client';

import { useFhevmClient, useEncrypt } from '@fhevm-toolkit/sdk';
import { useWalletClient } from 'wagmi';
import { walletClientToSigner } from '@/lib/ethers';

export default function Page() {
  const { data: walletClient } = useWalletClient();
  const signer = walletClient ? walletClientToSigner(walletClient) : undefined;

  const { client, isInitialized } = useFhevmClient({
    provider: signer?.provider,
    signer,
    chainId: 11155111
  });

  const { encrypt } = useEncrypt(client);

  return <div>{/* Your UI */}</div>;
}
```

### React (Vite)

```typescript
import { useState, useEffect } from 'react';
import { FhevmClient } from '@fhevm-toolkit/sdk';
import { ethers } from 'ethers';

function App() {
  const [client, setClient] = useState<FhevmClient | null>(null);

  useEffect(() => {
    async function init() {
      const provider = new ethers.BrowserProvider(window.ethereum);
      const signer = await provider.getSigner();

      const fhevmClient = new FhevmClient({
        provider,
        signer,
        chainId: 11155111
      });

      await fhevmClient.init();
      setClient(fhevmClient);
    }

    init();
  }, []);

  return <div>{/* Your UI */}</div>;
}
```

### Vue 3

```typescript
import { ref, onMounted } from 'vue';
import { FhevmClient } from '@fhevm-toolkit/sdk';
import { ethers } from 'ethers';

export default {
  setup() {
    const client = ref<FhevmClient | null>(null);
    const isInitialized = ref(false);

    onMounted(async () => {
      const provider = new ethers.BrowserProvider(window.ethereum);
      const signer = await provider.getSigner();

      client.value = new FhevmClient({
        provider,
        signer,
        chainId: 11155111
      });

      await client.value.init();
      isInitialized.value = true;
    });

    return { client, isInitialized };
  }
};
```

### Node.js

```javascript
const { FhevmClient } = require('@fhevm-toolkit/sdk');
const { ethers } = require('ethers');

async function main() {
  const provider = new ethers.JsonRpcProvider(process.env.RPC_URL);
  const signer = new ethers.Wallet(process.env.PRIVATE_KEY, provider);

  const client = new FhevmClient({
    provider,
    signer,
    chainId: 11155111
  });

  await client.init();

  // Use client
  const encrypted = await client.encryptInput({
    value: 100,
    type: 'uint64',
    contractAddress: process.env.CONTRACT_ADDRESS
  });

  console.log('Encrypted:', encrypted);
}

main().catch(console.error);
```

---

## Best Practices

### 1. Error Handling

Always wrap SDK calls in try-catch blocks:

```typescript
try {
  await client.init();
} catch (error) {
  if (error instanceof InitializationError) {
    console.error('Failed to initialize:', error.message);
  }
}
```

### 2. Validation

Validate inputs before encryption:

```typescript
import { validateValueForType, sanitizeInput } from '@fhevm-toolkit/sdk';

if (!validateValueForType(value, 'uint32')) {
  throw new Error('Invalid value for uint32');
}

const sanitized = sanitizeInput(value, 'uint32');
```

### 3. Gas Estimation

Estimate gas before transactions:

```typescript
import { estimateGasWithBuffer } from '@fhevm-toolkit/sdk';

const gasLimit = await estimateGasWithBuffer(
  contract,
  'submitValue',
  [encrypted.handles[0], encrypted.inputProof],
  1.2 // 20% buffer
);

const tx = await contract.submitValue(
  encrypted.handles[0],
  encrypted.inputProof,
  { gasLimit }
);
```

### 4. State Management

Check client state before operations:

```typescript
if (!client.initialized) {
  console.warn('Client not initialized');
  return;
}

const publicKey = client.getPublicKey();
```

---

## Troubleshooting

### Client Not Initializing

**Problem**: `FhevmClient.init()` fails

**Solutions**:
1. Check network connectivity
2. Verify chainId is supported
3. Ensure provider is configured correctly
4. Check ACL contract address

### Encryption Fails

**Problem**: `encryptInput()` throws error

**Solutions**:
1. Ensure client is initialized
2. Validate value type
3. Check contract address is valid
4. Verify value is within range for type

### Permission Signature Fails

**Problem**: `generatePermissionSignature()` fails

**Solutions**:
1. Ensure signer is provided to FhevmClient
2. Check wallet is connected
3. Verify contract address

### TypeScript Errors

**Problem**: Type definitions not found

**Solutions**:
1. Ensure TypeScript version >= 5.0
2. Check `tsconfig.json` includes SDK
3. Reinstall dependencies

---

## Support

- **Documentation**: [Complete Docs](./API_REFERENCE.md)
- **Examples**: [Example Apps](../examples/)
- **Issues**: [GitHub Issues](https://github.com/your-org/fhevm-toolkit/issues)
- **Zama Docs**: [docs.zama.ai/fhevm](https://docs.zama.ai/fhevm)

---

**Need Help?** Check the [Troubleshooting Guide](./TROUBLESHOOTING.md) or open an issue on GitHub.
