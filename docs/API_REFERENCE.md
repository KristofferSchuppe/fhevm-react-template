# 📖 FHEVM SDK API Reference

Complete API documentation for @fhevm-toolkit/sdk

---

## Table of Contents

1. [FhevmClient Class](#fhevmclient-class)
2. [Encryption Functions](#encryption-functions)
3. [Decryption Functions](#decryption-functions)
4. [React Hooks](#react-hooks)
5. [Utility Functions](#utility-functions)
6. [Type Definitions](#type-definitions)
7. [Error Classes](#error-classes)
8. [Configuration](#configuration)

---

## FhevmClient Class

Main client class for FHEVM operations.

### Constructor

```typescript
new FhevmClient(config: FhevmConfig)
```

**Parameters:**

| Parameter | Type | Description |
|-----------|------|-------------|
| config | `FhevmConfig` | Client configuration object |

**FhevmConfig Interface:**

```typescript
interface FhevmConfig {
  provider: Provider;        // Ethers provider
  signer?: Signer;          // Ethers signer (optional)
  chainId: number;          // Network chain ID
  gatewayUrl?: string;      // Gateway URL (optional)
  aclAddress?: string;      // ACL contract address (optional)
}
```

**Example:**

```typescript
import { FhevmClient } from '@fhevm-toolkit/sdk';
import { ethers } from 'ethers';

const provider = new ethers.JsonRpcProvider('https://rpc.sepolia.org');
const signer = new ethers.Wallet(privateKey, provider);

const client = new FhevmClient({
  provider,
  signer,
  chainId: 11155111
});
```

---

### Methods

#### `init()`

Initialize FHEVM instance and fetch public key.

```typescript
async init(): Promise<void>
```

**Returns:** `Promise<void>`

**Throws:** `InitializationError` if initialization fails

**Example:**

```typescript
await client.init();
console.log('Client initialized');
```

---

#### `encryptInput()`

Encrypt a value for submission to smart contract.

```typescript
async encryptInput(params: EncryptionParams): Promise<EncryptedInput>
```

**Parameters:**

```typescript
interface EncryptionParams {
  value: number | bigint | boolean;
  type: 'bool' | 'uint8' | 'uint16' | 'uint32' | 'uint64' | 'uint128' | 'uint256' | 'address';
  contractAddress: string;
}
```

**Returns:**

```typescript
interface EncryptedInput {
  handles: string[];      // Encrypted handles
  inputProof: string;     // Proof for verification
}
```

**Throws:** `EncryptionError` if encryption fails

**Example:**

```typescript
const encrypted = await client.encryptInput({
  value: 42,
  type: 'uint32',
  contractAddress: '0x1234...'
});

console.log(encrypted.handles);
console.log(encrypted.inputProof);
```

---

#### `generatePermissionSignature()`

Generate EIP-712 signature for decryption permission.

```typescript
async generatePermissionSignature(contractAddress: string): Promise<PermissionSignature>
```

**Parameters:**

| Parameter | Type | Description |
|-----------|------|-------------|
| contractAddress | `string` | Contract address for permission |

**Returns:**

```typescript
interface PermissionSignature {
  signature: string;    // EIP-712 signature
  publicKey: string;    // Public key
}
```

**Throws:** `Error` if signer not provided or generation fails

**Example:**

```typescript
const permission = await client.generatePermissionSignature('0x1234...');
console.log(permission.signature);
console.log(permission.publicKey);
```

---

#### `getState()`

Get current FHEVM instance state.

```typescript
getState(): FhevmInstanceState
```

**Returns:**

```typescript
interface FhevmInstanceState {
  instance: any | null;
  publicKey: string | null;
  isInitialized: boolean;
}
```

**Example:**

```typescript
const state = client.getState();
console.log('Initialized:', state.isInitialized);
console.log('Public Key:', state.publicKey);
```

---

#### `getInstance()`

Get raw FHEVM instance for advanced usage.

```typescript
getInstance(): FhevmInstance | null
```

**Returns:** `FhevmInstance | null`

**Example:**

```typescript
const instance = client.getInstance();
if (instance) {
  // Advanced operations
}
```

---

#### `getPublicKey()`

Get encryption public key.

```typescript
getPublicKey(): string | null
```

**Returns:** `string | null` - Public key or null if not initialized

**Example:**

```typescript
const publicKey = client.getPublicKey();
console.log('Public Key:', publicKey);
```

---

#### `initialized` (getter)

Check if client is initialized.

```typescript
get initialized(): boolean
```

**Returns:** `boolean`

**Example:**

```typescript
if (client.initialized) {
  console.log('Client ready');
}
```

---

## Encryption Functions

Type-specific encryption helper functions.

### `encryptBool()`

Encrypt a boolean value.

```typescript
async function encryptBool(
  client: FhevmClient,
  value: boolean,
  contractAddress: string
): Promise<EncryptedInput>
```

**Example:**

```typescript
const encrypted = await encryptBool(client, true, '0x1234...');
```

---

### `encryptUint8()` / `encryptUint16()` / `encryptUint32()` / `encryptUint64()`

Encrypt unsigned integer values.

```typescript
async function encryptUint32(
  client: FhevmClient,
  value: number | bigint,
  contractAddress: string
): Promise<EncryptedInput>
```

**Example:**

```typescript
const encrypted = await encryptUint32(client, 100, '0x1234...');
```

---

### `encryptAddress()`

Encrypt an Ethereum address.

```typescript
async function encryptAddress(
  client: FhevmClient,
  value: string,
  contractAddress: string
): Promise<EncryptedInput>
```

**Example:**

```typescript
const encrypted = await encryptAddress(client, '0xABC...', '0x1234...');
```

---

### `encryptBatch()`

Encrypt multiple values in batch.

```typescript
async function encryptBatch(
  client: FhevmClient,
  params: EncryptionParams[]
): Promise<EncryptedInput[]>
```

**Example:**

```typescript
const results = await encryptBatch(client, [
  { value: true, type: 'bool', contractAddress: '0x1234...' },
  { value: 42, type: 'uint32', contractAddress: '0x1234...' }
]);
```

---

## Decryption Functions

Functions for decrypting encrypted values.

### `userDecrypt()`

Decrypt with user permission (EIP-712 signature).

```typescript
async function userDecrypt(
  client: FhevmClient,
  contract: Contract,
  handle: string
): Promise<bigint | boolean>
```

**Note:** Requires contract-specific implementation.

---

### `publicDecrypt()`

Decrypt publicly available value.

```typescript
async function publicDecrypt(
  contract: Contract,
  handle: string
): Promise<bigint | boolean>
```

**Note:** Only works for values made public.

---

### `decryptBool()`

Decrypt boolean value.

```typescript
async function decryptBool(
  client: FhevmClient,
  contract: Contract,
  handle: string,
  useUserDecrypt: boolean = true
): Promise<boolean>
```

---

### `decryptUint()`

Decrypt unsigned integer value.

```typescript
async function decryptUint(
  client: FhevmClient,
  contract: Contract,
  handle: string,
  useUserDecrypt: boolean = true
): Promise<bigint>
```

---

### `decryptBatch()`

Decrypt multiple handles in batch.

```typescript
async function decryptBatch(
  client: FhevmClient,
  contract: Contract,
  handles: string[],
  useUserDecrypt: boolean = true
): Promise<(bigint | boolean)[]>
```

---

## React Hooks

Wagmi-like hooks for React applications.

### `useFhevmClient()`

Initialize and manage FHEVM client.

```typescript
function useFhevmClient(config: FhevmConfig): {
  client: FhevmClient | null;
  isInitializing: boolean;
  isInitialized: boolean;
  error: Error | null;
  reinit: () => Promise<void>;
}
```

**Example:**

```typescript
const { client, isInitialized, error } = useFhevmClient({
  provider,
  signer,
  chainId: 11155111
});
```

---

### `useEncrypt()`

Hook for encryption operations.

```typescript
function useEncrypt(client: FhevmClient | null): {
  encrypt: (params: EncryptionParams) => Promise<EncryptedInput | null>;
  isEncrypting: boolean;
  error: Error | null;
}
```

**Example:**

```typescript
const { encrypt, isEncrypting } = useEncrypt(client);

const handleEncrypt = async () => {
  const result = await encrypt({
    value: 42,
    type: 'uint32',
    contractAddress: '0x1234...'
  });
};
```

---

### `usePermission()`

Hook for permission signature generation.

```typescript
function usePermission(client: FhevmClient | null): {
  generatePermission: (contractAddress: string) => Promise<PermissionSignature | null>;
  isGenerating: boolean;
  error: Error | null;
}
```

**Example:**

```typescript
const { generatePermission, isGenerating } = usePermission(client);

const handlePermission = async () => {
  const permission = await generatePermission('0x1234...');
};
```

---

### `useFhevmState()`

Get FHEVM instance state.

```typescript
function useFhevmState(client: FhevmClient | null): FhevmInstanceState | null
```

**Example:**

```typescript
const state = useFhevmState(client);
console.log('Initialized:', state?.isInitialized);
```

---

### `usePublicKey()`

Get public key.

```typescript
function usePublicKey(client: FhevmClient | null): string | null
```

**Example:**

```typescript
const publicKey = usePublicKey(client);
console.log('Public Key:', publicKey);
```

---

## Utility Functions

### Contract Utilities

#### `createContract()`

Create contract instance.

```typescript
function createContract(
  address: string,
  abi: InterfaceAbi,
  signerOrProvider: Signer | Provider
): Contract
```

---

#### `getContract()`

Get contract with options.

```typescript
function getContract(
  options: ContractOptions,
  signerOrProvider: Signer | Provider
): Contract
```

---

#### `waitForTransaction()`

Wait for transaction confirmation.

```typescript
async function waitForTransaction(
  tx: any,
  confirmations: number = 1,
  timeout: number = 120000
): Promise<any>
```

---

#### `estimateGasWithBuffer()`

Estimate gas with buffer.

```typescript
async function estimateGasWithBuffer(
  contract: Contract,
  method: string,
  args: any[],
  buffer: number = 1.2
): Promise<bigint>
```

---

#### `callWithEncryptedInput()`

Call contract method with encrypted input.

```typescript
async function callWithEncryptedInput(
  contract: Contract,
  method: string,
  args: any[],
  encryptedInput: EncryptedInput
): Promise<any>
```

---

### Validation Utilities

#### `validateAddress()`

```typescript
function validateAddress(address: string): boolean
```

#### `validateEncryptedType()`

```typescript
function validateEncryptedType(type: string): boolean
```

#### `validateValueForType()`

```typescript
function validateValueForType(value: any, type: string): boolean
```

#### `validateChainId()`

```typescript
function validateChainId(chainId: number): boolean
```

#### `sanitizeInput()`

```typescript
function sanitizeInput(value: any, type: string): any
```

---

## Type Definitions

### Core Types

```typescript
// Encrypted types enum
enum EncryptedType {
  EBOOL = 'ebool',
  EUINT8 = 'euint8',
  EUINT16 = 'euint16',
  EUINT32 = 'euint32',
  EUINT64 = 'euint64',
  EUINT128 = 'euint128',
  EUINT256 = 'euint256',
  EADDRESS = 'eaddress'
}

// Contract options
interface ContractOptions {
  address: string;
  abi: any[];
  signer?: Signer;
}
```

---

## Error Classes

### `FhevmError`

Base error class.

```typescript
class FhevmError extends Error {
  constructor(message: string)
}
```

### `EncryptionError`

Encryption-specific error.

```typescript
class EncryptionError extends FhevmError {
  constructor(message: string)
}
```

### `DecryptionError`

Decryption-specific error.

```typescript
class DecryptionError extends FhevmError {
  constructor(message: string)
}
```

### `InitializationError`

Initialization-specific error.

```typescript
class InitializationError extends FhevmError {
  constructor(message: string)
}
```

---

## Configuration

### Network Configuration

```typescript
const NETWORK_CONFIG = {
  sepolia: {
    chainId: 11155111,
    name: 'Sepolia',
    rpcUrl: 'https://rpc.sepolia.org',
    gatewayUrl: '',
    aclAddress: '0x0000000000000000000000000000000000000000',
    explorerUrl: 'https://sepolia.etherscan.io'
  },
  // ... other networks
}
```

### Default Options

```typescript
const DEFAULT_OPTIONS = {
  gasLimitBuffer: 1.2,
  confirmations: 1,
  timeout: 120000
}
```

### Get Network Config

```typescript
function getNetworkConfig(chainId: number): NetworkConfig
```

---

## Complete Example

```typescript
import {
  FhevmClient,
  encryptUint64,
  createContract,
  estimateGasWithBuffer,
  validateAddress
} from '@fhevm-toolkit/sdk';
import { ethers } from 'ethers';

async function main() {
  // 1. Initialize client
  const provider = new ethers.JsonRpcProvider('https://rpc.sepolia.org');
  const signer = new ethers.Wallet(privateKey, provider);

  const client = new FhevmClient({
    provider,
    signer,
    chainId: 11155111
  });

  await client.init();

  // 2. Validate address
  if (!validateAddress(contractAddress)) {
    throw new Error('Invalid address');
  }

  // 3. Create contract
  const contract = createContract(contractAddress, abi, signer);

  // 4. Encrypt value
  const encrypted = await encryptUint64(client, 1000n, contractAddress);

  // 5. Estimate gas
  const gasLimit = await estimateGasWithBuffer(
    contract,
    'submitValue',
    [encrypted.handles[0], encrypted.inputProof],
    1.2
  );

  // 6. Submit transaction
  const tx = await contract.submitValue(
    encrypted.handles[0],
    encrypted.inputProof,
    { gasLimit }
  );

  await tx.wait();
  console.log('Transaction successful!');
}

main();
```

---

## Support

For more information:
- **SDK Guide**: [SDK_GUIDE.md](./SDK_GUIDE.md)
- **Integration Guide**: [INTEGRATION.md](./INTEGRATION.md)
- **GitHub Issues**: [Report Issues](https://github.com/KristofferSchuppe/fhevm-react-template/issues)

---

*Complete API reference for @fhevm-toolkit/sdk*
