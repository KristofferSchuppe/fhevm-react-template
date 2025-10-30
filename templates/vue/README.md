# Vue FHEVM Template

Vue 3 template with FHEVM SDK integration using Vite for building confidential applications.

## Features

- ✅ Vue 3 with Composition API
- ✅ FHEVM SDK integration
- ✅ TypeScript support
- ✅ FHE encryption/decryption components
- ✅ Composables for FHE operations
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

### Using Vue Composable

```vue
<script setup lang="ts">
import { useFHE } from '@/composables/useFHE';

const { client, isInitialized, initializeFHE } = useFHE();

const handleEncrypt = async () => {
  if (!client.value) return;

  const result = await client.value.encryptInput({
    value: 100,
    type: 'uint64',
    contractAddress: '0x...',
  });
  console.log('Encrypted:', result);
};
</script>

<template>
  <button v-if="!isInitialized" @click="initializeFHE">
    Connect & Initialize
  </button>
  <button v-else @click="handleEncrypt">
    Encrypt
  </button>
</template>
```

## Project Structure

```
src/
├── components/
│   └── EncryptionDemo.vue
├── composables/
│   └── useFHE.ts
├── App.vue
├── main.ts
└── style.css
```

## Learn More

- [FHEVM SDK Documentation](../../packages/fhevm-sdk/README.md)
- [Vue 3 Documentation](https://vuejs.org/)
- [Vite Documentation](https://vitejs.dev/)
- [Zama FHEVM](https://docs.zama.ai/fhevm)

## License

MIT
