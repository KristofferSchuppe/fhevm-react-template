# 🔌 FHEVM SDK Integration Guide

Framework-specific integration examples for @fhevm-toolkit/sdk

---

## Table of Contents

1. [Next.js Integration](#nextjs-integration)
2. [React Integration](#react-integration)
3. [Vue.js Integration](#vuejs-integration)
4. [Node.js Integration](#nodejs-integration)
5. [Express.js Integration](#expressjs-integration)
6. [Best Practices](#best-practices)

---

## Next.js Integration

### Next.js 14 with App Router

**File Structure:**
```
app/
├── providers.tsx          # Client-side providers
├── hooks/
│   └── useFhevm.ts       # Custom hooks
├── lib/
│   └── fhevm.ts          # FHEVM configuration
└── page.tsx              # Page components
```

#### 1. Setup Provider

**`app/providers.tsx`:**

```typescript
'use client';

import { WagmiProvider } from 'wagmi';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { RainbowKitProvider } from '@rainbow-me/rainbowkit';
import { config } from './lib/wagmi';

const queryClient = new QueryClient();

export function Providers({ children }: { children: React.ReactNode }) {
  return (
    <WagmiProvider config={config}>
      <QueryClientProvider client={queryClient}>
        <RainbowKitProvider>
          {children}
        </RainbowKitProvider>
      </QueryClientProvider>
    </WagmiProvider>
  );
}
```

#### 2. Create Custom Hook

**`app/hooks/useFhevm.ts`:**

```typescript
'use client';

import { useFhevmClient, useEncrypt } from '@fhevm-toolkit/sdk';
import { useWalletClient } from 'wagmi';
import { walletClientToSigner } from '../lib/ethers';

export function useFhevm() {
  const { data: walletClient } = useWalletClient();
  const signer = walletClient ? walletClientToSigner(walletClient) : undefined;

  const { client, isInitialized, isInitializing, error } = useFhevmClient({
    provider: signer?.provider,
    signer,
    chainId: 11155111 // Sepolia
  });

  const { encrypt, isEncrypting } = useEncrypt(client);

  return {
    client,
    isInitialized,
    isInitializing,
    encrypt,
    isEncrypting,
    error
  };
}
```

#### 3. Use in Page Component

**`app/page.tsx`:**

```typescript
'use client';

import { useState } from 'react';
import { useFhevm } from './hooks/useFhevm';

export default function Home() {
  const { client, isInitialized, encrypt, isEncrypting } = useFhevm();
  const [value, setValue] = useState('');
  const [result, setResult] = useState<string>('');

  const handleEncrypt = async () => {
    if (!value) return;

    const encrypted = await encrypt({
      value: parseInt(value),
      type: 'uint64',
      contractAddress: process.env.NEXT_PUBLIC_CONTRACT_ADDRESS!
    });

    if (encrypted) {
      setResult(encrypted.handles[0]);
    }
  };

  return (
    <main className="container mx-auto p-4">
      <h1 className="text-4xl font-bold mb-8">FHE Evidence Manager</h1>

      {!isInitialized ? (
        <p>Initializing FHEVM...</p>
      ) : (
        <div className="space-y-4">
          <input
            type="number"
            value={value}
            onChange={(e) => setValue(e.target.value)}
            className="border p-2 rounded"
            placeholder="Enter value"
          />

          <button
            onClick={handleEncrypt}
            disabled={isEncrypting}
            className="bg-blue-500 text-white px-4 py-2 rounded"
          >
            {isEncrypting ? 'Encrypting...' : 'Encrypt'}
          </button>

          {result && (
            <div className="mt-4">
              <p className="font-mono text-sm">{result}</p>
            </div>
          )}
        </div>
      )}
    </main>
  );
}
```

#### 4. Environment Variables

**`.env.local`:**

```env
NEXT_PUBLIC_CONTRACT_ADDRESS=0x1234...
NEXT_PUBLIC_CHAIN_ID=11155111
```

---

## React Integration

### React with Vite

**File Structure:**
```
src/
├── hooks/
│   └── useFhevmClient.ts
├── components/
│   └── EncryptForm.tsx
├── App.tsx
└── main.tsx
```

#### 1. Custom Hook

**`src/hooks/useFhevmClient.ts`:**

```typescript
import { useState, useEffect } from 'react';
import { FhevmClient } from '@fhevm-toolkit/sdk';
import { ethers } from 'ethers';

export function useFhevmClient() {
  const [client, setClient] = useState<FhevmClient | null>(null);
  const [isInitialized, setIsInitialized] = useState(false);
  const [error, setError] = useState<Error | null>(null);

  useEffect(() => {
    async function init() {
      try {
        const provider = new ethers.BrowserProvider(window.ethereum);
        const signer = await provider.getSigner();

        const fhevmClient = new FhevmClient({
          provider,
          signer,
          chainId: 11155111
        });

        await fhevmClient.init();
        setClient(fhevmClient);
        setIsInitialized(true);
      } catch (err) {
        setError(err as Error);
      }
    }

    init();
  }, []);

  return { client, isInitialized, error };
}
```

#### 2. Component

**`src/components/EncryptForm.tsx`:**

```typescript
import { useState } from 'react';
import { FhevmClient } from '@fhevm-toolkit/sdk';

interface Props {
  client: FhevmClient;
  contractAddress: string;
}

export function EncryptForm({ client, contractAddress }: Props) {
  const [value, setValue] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      const encrypted = await client.encryptInput({
        value: parseInt(value),
        type: 'uint64',
        contractAddress
      });

      console.log('Encrypted:', encrypted);
      alert('Encryption successful!');
    } catch (error) {
      console.error('Encryption failed:', error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <input
        type="number"
        value={value}
        onChange={(e) => setValue(e.target.value)}
        placeholder="Enter value"
        className="border p-2 rounded w-full"
      />
      <button
        type="submit"
        disabled={isLoading}
        className="bg-blue-500 text-white px-4 py-2 rounded"
      >
        {isLoading ? 'Encrypting...' : 'Encrypt'}
      </button>
    </form>
  );
}
```

#### 3. Main App

**`src/App.tsx`:**

```typescript
import { useFhevmClient } from './hooks/useFhevmClient';
import { EncryptForm } from './components/EncryptForm';

function App() {
  const { client, isInitialized, error } = useFhevmClient();

  if (error) {
    return <div>Error: {error.message}</div>;
  }

  if (!isInitialized || !client) {
    return <div>Initializing FHEVM...</div>;
  }

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-4xl font-bold mb-8">FHE Evidence Manager</h1>
      <EncryptForm
        client={client}
        contractAddress={import.meta.env.VITE_CONTRACT_ADDRESS}
      />
    </div>
  );
}

export default App;
```

---

## Vue.js Integration

### Vue 3 with Composition API

**File Structure:**
```
src/
├── composables/
│   └── useFhevm.ts
├── components/
│   └── EncryptForm.vue
└── App.vue
```

#### 1. Composable

**`src/composables/useFhevm.ts`:**

```typescript
import { ref, onMounted } from 'vue';
import { FhevmClient } from '@fhevm-toolkit/sdk';
import { ethers } from 'ethers';

export function useFhevm() {
  const client = ref<FhevmClient | null>(null);
  const isInitialized = ref(false);
  const error = ref<Error | null>(null);

  onMounted(async () => {
    try {
      const provider = new ethers.BrowserProvider(window.ethereum);
      const signer = await provider.getSigner();

      client.value = new FhevmClient({
        provider,
        signer,
        chainId: 11155111
      });

      await client.value.init();
      isInitialized.value = true;
    } catch (err) {
      error.value = err as Error;
    }
  });

  const encrypt = async (value: number, contractAddress: string) => {
    if (!client.value) throw new Error('Client not initialized');

    return await client.value.encryptInput({
      value,
      type: 'uint64',
      contractAddress
    });
  };

  return {
    client,
    isInitialized,
    error,
    encrypt
  };
}
```

#### 2. Component

**`src/components/EncryptForm.vue`:**

```vue
<template>
  <div class="encrypt-form">
    <form @submit.prevent="handleSubmit">
      <input
        v-model.number="value"
        type="number"
        placeholder="Enter value"
        class="border p-2 rounded w-full"
      />
      <button
        type="submit"
        :disabled="isLoading"
        class="bg-blue-500 text-white px-4 py-2 rounded mt-4"
      >
        {{ isLoading ? 'Encrypting...' : 'Encrypt' }}
      </button>
    </form>

    <div v-if="result" class="mt-4">
      <p class="font-mono text-sm">{{ result }}</p>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue';
import { useFhevm } from '../composables/useFhevm';

const { encrypt } = useFhevm();
const value = ref(0);
const isLoading = ref(false);
const result = ref('');

const contractAddress = import.meta.env.VITE_CONTRACT_ADDRESS;

const handleSubmit = async () => {
  isLoading.value = true;

  try {
    const encrypted = await encrypt(value.value, contractAddress);
    result.value = encrypted.handles[0];
  } catch (error) {
    console.error('Encryption failed:', error);
  } finally {
    isLoading.value = false;
  }
};
</script>
```

---

## Node.js Integration

### Express.js Server

```typescript
import express from 'express';
import { FhevmClient } from '@fhevm-toolkit/sdk';
import { ethers } from 'ethers';

const app = express();
app.use(express.json());

// Initialize FHEVM client
let fhevmClient: FhevmClient;

async function initFhevm() {
  const provider = new ethers.JsonRpcProvider(process.env.RPC_URL);
  const signer = new ethers.Wallet(process.env.PRIVATE_KEY!, provider);

  fhevmClient = new FhevmClient({
    provider,
    signer,
    chainId: 11155111
  });

  await fhevmClient.init();
  console.log('FHEVM initialized');
}

// Encrypt endpoint
app.post('/api/encrypt', async (req, res) => {
  try {
    const { value, type, contractAddress } = req.body;

    const encrypted = await fhevmClient.encryptInput({
      value,
      type,
      contractAddress
    });

    res.json(encrypted);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Permission endpoint
app.post('/api/permission', async (req, res) => {
  try {
    const { contractAddress } = req.body;

    const permission = await fhevmClient.generatePermissionSignature(
      contractAddress
    );

    res.json(permission);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Start server
initFhevm().then(() => {
  app.listen(3000, () => {
    console.log('Server running');
  });
});
```

---

## Express.js Integration

### API Server with FHEVM

```typescript
import express, { Request, Response } from 'express';
import { FhevmClient, encryptUint64, validateAddress } from '@fhevm-toolkit/sdk';
import { ethers } from 'ethers';

const app = express();
app.use(express.json());

// FHEVM client
let client: FhevmClient;

// Middleware to check initialization
const requireInitialized = (req: Request, res: Response, next: Function) => {
  if (!client || !client.initialized) {
    return res.status(503).json({ error: 'FHEVM not initialized' });
  }
  next();
};

// Initialize
async function init() {
  const provider = new ethers.JsonRpcProvider(process.env.RPC_URL);
  const signer = new ethers.Wallet(process.env.PRIVATE_KEY!, provider);

  client = new FhevmClient({
    provider,
    signer,
    chainId: parseInt(process.env.CHAIN_ID!)
  });

  await client.init();
}

// Routes
app.get('/health', (req, res) => {
  res.json({
    status: 'ok',
    initialized: client?.initialized || false
  });
});

app.post('/encrypt', requireInitialized, async (req, res) => {
  try {
    const { value, contractAddress } = req.body;

    if (!validateAddress(contractAddress)) {
      return res.status(400).json({ error: 'Invalid address' });
    }

    const encrypted = await encryptUint64(client, BigInt(value), contractAddress);

    res.json(encrypted);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

app.post('/permission', requireInitialized, async (req, res) => {
  try {
    const { contractAddress } = req.body;

    const permission = await client.generatePermissionSignature(contractAddress);

    res.json(permission);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Start
init().then(() => {
  const PORT = process.env.PORT || 3000;
  app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
  });
});
```

---

## Best Practices

### 1. Error Handling

```typescript
import { EncryptionError, InitializationError } from '@fhevm-toolkit/sdk';

try {
  await client.init();
} catch (error) {
  if (error instanceof InitializationError) {
    console.error('Failed to initialize:', error.message);
    // Handle initialization error
  } else {
    console.error('Unexpected error:', error);
  }
}
```

### 2. Loading States

```typescript
const [isLoading, setIsLoading] = useState(false);

const handleAction = async () => {
  setIsLoading(true);
  try {
    // Your action
  } finally {
    setIsLoading(false);
  }
};
```

### 3. Input Validation

```typescript
import { validateAddress, validateValueForType } from '@fhevm-toolkit/sdk';

function validateInput(address: string, value: number, type: string) {
  if (!validateAddress(address)) {
    throw new Error('Invalid contract address');
  }

  if (!validateValueForType(value, type)) {
    throw new Error(`Invalid value for type ${type}`);
  }
}
```

### 4. Environment Variables

```env
# .env
NEXT_PUBLIC_CONTRACT_ADDRESS=0x...
NEXT_PUBLIC_CHAIN_ID=11155111
NEXT_PUBLIC_RPC_URL=https://rpc.sepolia.org
```

### 5. TypeScript Types

```typescript
import type {
  FhevmClient,
  EncryptionParams,
  EncryptedInput
} from '@fhevm-toolkit/sdk';

interface EncryptFormProps {
  client: FhevmClient;
  onSuccess: (result: EncryptedInput) => void;
}
```

---

## Support

For more examples and documentation:
- **SDK Guide**: [SDK_GUIDE.md](./SDK_GUIDE.md)
- **API Reference**: [API_REFERENCE.md](./API_REFERENCE.md)
- **GitHub**: [Report Issues](https://github.com/KristofferSchuppe/fhevm-react-template/issues)

---

*Framework integration guide for @fhevm-toolkit/sdk*
