# React FHEVM Template

React template with FHEVM SDK integration using Vite for building confidential applications.

## Features

- ✅ React 18 with Vite
- ✅ FHEVM SDK integration
- ✅ TypeScript support
- ✅ FHE encryption/decryption components
- ✅ Custom hooks for FHE operations
- ✅ Modern styling with CSS

## Getting Started

### 1. Install Dependencies

```bash
npm install
```

### 2. Run Development Server

```bash
npm run dev
```

Open [http://localhost:5173](http://localhost:5173) in your browser.

### 3. Build for Production

```bash
npm run build
npm run preview
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
```

### Using React Hook

```typescript
import { useFHE } from './hooks/useFHE';

function MyComponent() {
  const { client, isInitialized, init } = useFHE();

  const handleEncrypt = async () => {
    if (!client) return;

    const result = await client.encryptInput({
      value: 100,
      type: 'uint64',
      contractAddress: '0x...',
    });
    console.log('Encrypted:', result);
  };

  return (
    <>
      {!isInitialized ? (
        <button onClick={init}>Connect & Initialize</button>
      ) : (
        <button onClick={handleEncrypt}>Encrypt</button>
      )}
    </>
  );
}
```

## Project Structure

```
src/
├── components/
│   └── EncryptionDemo.tsx
├── hooks/
│   └── useFHE.tsx
├── App.tsx
├── App.css
├── main.tsx
└── index.css
```

## Learn More

- [FHEVM SDK Documentation](../../packages/fhevm-sdk/README.md)
- [React Documentation](https://react.dev/)
- [Vite Documentation](https://vitejs.dev/)
- [Zama FHEVM](https://docs.zama.ai/fhevm)

## License

MIT
