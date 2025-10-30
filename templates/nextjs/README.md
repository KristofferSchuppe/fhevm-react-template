# Next.js FHEVM Template

Complete Next.js template with FHEVM SDK integration for building confidential applications.

## Features

- ✅ Next.js 14 with App Router
- ✅ FHEVM SDK integration
- ✅ TypeScript support
- ✅ Tailwind CSS styling
- ✅ FHE encryption/decryption components
- ✅ API routes for server-side operations
- ✅ Custom hooks for FHE operations
- ✅ Complete type definitions

## Project Structure

```
src/
├── app/                     # App Router (Next.js 13+)
│   ├── layout.tsx          # Root layout
│   ├── page.tsx            # Homepage
│   ├── globals.css         # Global styles
│   └── api/                # API routes
│       ├── fhe/
│       │   ├── route.ts    # FHE operations route
│       │   ├── encrypt/route.ts
│       │   ├── decrypt/route.ts
│       │   └── compute/route.ts
│       └── keys/route.ts   # Key management API
│
├── components/             # React components
│   ├── ui/                 # Basic UI components
│   │   ├── Button.tsx
│   │   ├── Input.tsx
│   │   └── Card.tsx
│   ├── fhe/                # FHE functionality components
│   │   ├── FHEProvider.tsx
│   │   ├── EncryptionDemo.tsx
│   │   ├── ComputationDemo.tsx
│   │   └── KeyManager.tsx
│   └── examples/           # Use case examples
│
├── lib/                    # Utility library
│   ├── fhe/                # FHE integration library
│   │   ├── client.ts
│   │   ├── server.ts
│   │   ├── keys.ts
│   │   └── types.ts
│   └── utils/              # Utility functions
│       ├── security.ts
│       └── validation.ts
│
├── hooks/                  # Custom Hooks
│   ├── useFHE.ts
│   ├── useEncryption.ts
│   └── useComputation.ts
│
├── types/                  # TypeScript types
│   ├── fhe.ts
│   └── api.ts
│
└── styles/                 # Style files
    └── globals.css
```

## Getting Started

### 1. Install Dependencies

```bash
npm install
```

### 2. Run Development Server

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser.

### 3. Build for Production

```bash
npm run build
npm start
```

## Using the FHEVM SDK

### Basic Usage

```typescript
import { FhevmClient } from '@fhevm-toolkit/sdk';
import { ethers } from 'ethers';

// Initialize client
const provider = new ethers.BrowserProvider(window.ethereum);
const signer = await provider.getSigner();
const client = new FhevmClient({ provider, signer, chainId: 11155111 });
await client.init();

// Encrypt a value
const encrypted = await client.encryptInput({
  value: 42,
  type: 'uint32',
  contractAddress: '0x...',
});

// Generate permission signature
const permission = await client.generatePermissionSignature('0x...');
```

### Using React Hooks

```typescript
import { useFHE } from '@/components/fhe/FHEProvider';
import { useEncrypt } from '@/hooks/useEncryption';

function MyComponent() {
  const { client, isInitialized } = useFHE();
  const { encrypt, isEncrypting } = useEncrypt(client);

  const handleEncrypt = async () => {
    const result = await encrypt({
      value: 100,
      type: 'uint64',
      contractAddress: '0x...',
    });
    console.log('Encrypted:', result);
  };

  return (
    <button onClick={handleEncrypt} disabled={isEncrypting}>
      {isEncrypting ? 'Encrypting...' : 'Encrypt'}
    </button>
  );
}
```

## API Routes

### POST /api/fhe/encrypt

Encrypt a value server-side.

```typescript
const response = await fetch('/api/fhe/encrypt', {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({
    value: 42,
    type: 'uint32',
    contractAddress: '0x...',
  }),
});
```

### POST /api/fhe/decrypt

Decrypt a value server-side.

### POST /api/fhe/compute

Perform homomorphic computation.

### POST /api/keys

Manage encryption keys.

## Environment Variables

Create a `.env.local` file:

```env
NEXT_PUBLIC_CHAIN_ID=11155111
NEXT_PUBLIC_RPC_URL=https://sepolia.infura.io/v3/YOUR_KEY
```

## Learn More

- [FHEVM SDK Documentation](../../packages/fhevm-sdk/README.md)
- [Next.js Documentation](https://nextjs.org/docs)
- [Zama FHEVM](https://docs.zama.ai/fhevm)

## License

MIT
