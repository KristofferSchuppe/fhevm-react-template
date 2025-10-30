# Node.js FHEVM Template

Node.js/TypeScript template with FHEVM SDK integration for building server-side confidential applications.

## Features

- ✅ Node.js with TypeScript
- ✅ FHEVM SDK integration
- ✅ Multiple examples (basic, encryption, contract interaction)
- ✅ Environment variable configuration
- ✅ Production-ready setup

## Getting Started

### 1. Install Dependencies

```bash
npm install
```

### 2. Configure Environment

Copy `.env.example` to `.env` and fill in your values:

```bash
cp .env.example .env
```

Required environment variables:
- `RPC_URL`: Ethereum RPC endpoint (e.g., Infura, Alchemy)
- `PRIVATE_KEY`: Your wallet private key (for signing transactions)
- `CHAIN_ID`: Network chain ID (11155111 for Sepolia)
- `CONTRACT_ADDRESS`: Your deployed contract address

### 3. Run Examples

```bash
# Run main example
npm run dev

# Run basic example
npm run example:basic

# Run encryption example
npm run example:encrypt

# Run contract interaction example
npm run example:contract
```

### 4. Build for Production

```bash
npm run build
npm start
```

## Using the FHEVM SDK

### Basic Initialization

```typescript
import { FhevmClient } from '@fhevm-toolkit/sdk';
import { ethers } from 'ethers';

const provider = new ethers.JsonRpcProvider(RPC_URL);
const signer = new ethers.Wallet(PRIVATE_KEY, provider);

const client = new FhevmClient({
  provider,
  signer,
  chainId: 11155111,
});

await client.init();
```

### Encrypting Values

```typescript
const encrypted = await client.encryptInput({
  value: 42,
  type: 'uint32',
  contractAddress: CONTRACT_ADDRESS,
});

console.log('Handle:', encrypted.handles[0]);
console.log('Input Proof:', encrypted.inputProof);
```

### Generating Permission Signatures

```typescript
const permission = await client.generatePermissionSignature(CONTRACT_ADDRESS);

console.log('Public Key:', permission.publicKey);
console.log('Signature:', permission.signature);
```

### Contract Interaction

```typescript
// Prepare encrypted data
const encryptedValue = await client.encryptInput({
  value: 100,
  type: 'uint64',
  contractAddress: CONTRACT_ADDRESS,
});

// Call contract with encrypted data
const contract = new ethers.Contract(CONTRACT_ADDRESS, ABI, signer);
const tx = await contract.submitValue(
  encryptedValue.handles[0],
  encryptedValue.inputProof
);

await tx.wait();
console.log('Transaction confirmed!');
```

## Project Structure

```
nodejs-fhevm-template/
├── src/
│   └── index.ts          # Main application
├── examples/
│   ├── basic.ts          # Basic SDK usage
│   ├── encryption.ts     # Encryption examples
│   └── contract-interaction.ts  # Contract interaction
├── .env.example          # Environment template
├── package.json
├── tsconfig.json
└── README.md
```

## Examples

### Basic Example
Demonstrates basic FHEVM client initialization and state management.

```bash
npm run example:basic
```

### Encryption Example
Shows how to encrypt different data types (uint32, uint64, bool).

```bash
npm run example:encrypt
```

### Contract Interaction Example
Demonstrates preparing encrypted data for contract calls and generating permission signatures.

```bash
npm run example:contract
```

## Security Notes

- **Never commit your `.env` file** or expose private keys
- Use environment variables for all sensitive data
- For production, use secure key management solutions
- Always validate inputs before encryption

## Learn More

- [FHEVM SDK Documentation](../../packages/fhevm-sdk/README.md)
- [Node.js Documentation](https://nodejs.org/docs/)
- [ethers.js Documentation](https://docs.ethers.org/)
- [Zama FHEVM](https://docs.zama.ai/fhevm)

## License

MIT
