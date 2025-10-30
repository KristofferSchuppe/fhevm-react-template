# Next.js FHE Integration Example

Complete Next.js 14 integration example demonstrating FHEVM SDK usage with App Router, API routes, and React components.

## Features

- ✅ Next.js 14 with App Router
- ✅ FHE Provider & React Context
- ✅ Encryption/Decryption demos
- ✅ Homomorphic computation examples
- ✅ Key management interface
- ✅ Real-world use cases (Banking, Medical)
- ✅ API routes for FHE operations
- ✅ TypeScript support
- ✅ Tailwind CSS styling

## Getting Started

### Install Dependencies

```bash
npm install
```

### Run Development Server

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) to view the application.

## Project Structure

```
src/
├── app/                       # Next.js App Router
│   ├── layout.tsx            # Root layout
│   ├── page.tsx              # Home page
│   ├── globals.css           # Global styles
│   └── api/                  # API routes
│       ├── fhe/
│       │   ├── route.ts      # FHE operations
│       │   ├── encrypt/route.ts
│       │   ├── decrypt/route.ts
│       │   └── compute/route.ts
│       └── keys/route.ts     # Key management
│
├── components/               # React components
│   ├── ui/                   # Base UI components
│   │   ├── Button.tsx
│   │   ├── Input.tsx
│   │   └── Card.tsx
│   ├── fhe/                  # FHE functionality
│   │   ├── FHEProvider.tsx
│   │   ├── EncryptionDemo.tsx
│   │   ├── ComputationDemo.tsx
│   │   └── KeyManager.tsx
│   └── examples/             # Use case examples
│       ├── BankingExample.tsx
│       └── MedicalExample.tsx
│
├── lib/                      # Utility libraries
│   ├── fhe/
│   │   ├── client.ts
│   │   ├── server.ts
│   │   ├── keys.ts
│   │   └── types.ts
│   └── utils/
│       ├── security.ts
│       └── validation.ts
│
├── hooks/                    # Custom React hooks
│   ├── useFHE.ts
│   ├── useEncryption.ts
│   └── useComputation.ts
│
└── types/                    # TypeScript types
    ├── fhe.ts
    └── api.ts
```

## Usage Examples

### Using FHE Provider

```tsx
import { FHEProvider, useFHE } from '@/components/fhe/FHEProvider';

function MyComponent() {
  const { client, isInitialized } = useFHE();

  // Use client for FHE operations
}

function App() {
  return (
    <FHEProvider>
      <MyComponent />
    </FHEProvider>
  );
}
```

### Encrypting Data

```tsx
const { encrypt, isEncrypting } = useEncryption(client);

const handleEncrypt = async () => {
  const result = await encrypt(42, 'uint32');
  console.log('Encrypted:', result);
};
```

### API Routes

```typescript
// POST /api/fhe/encrypt
const response = await fetch('/api/fhe/encrypt', {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({
    value: 100,
    type: 'uint64',
    contractAddress: '0x...'
  })
});
```

## Learn More

- [FHEVM Toolkit Documentation](../../README.md)
- [Next.js Documentation](https://nextjs.org/docs)
- [Zama FHEVM](https://docs.zama.ai/fhevm)

## License

MIT
