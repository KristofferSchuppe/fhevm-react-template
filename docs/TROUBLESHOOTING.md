# 🔧 Troubleshooting Guide

Common issues and solutions for FHEVM SDK applications.

---

## Table of Contents

1. [Installation Issues](#installation-issues)
2. [SDK Initialization Issues](#sdk-initialization-issues)
3. [Encryption Issues](#encryption-issues)
4. [Smart Contract Issues](#smart-contract-issues)
5. [Frontend Issues](#frontend-issues)
6. [Network Issues](#network-issues)
7. [Build Issues](#build-issues)

---

## Installation Issues

### Issue: `npm install` fails

**Error:**
```
npm ERR! code ERESOLVE
npm ERR! ERESOLVE unable to resolve dependency tree
```

**Solutions:**

1. **Clear npm cache:**
```bash
npm cache clean --force
rm -rf node_modules package-lock.json
npm install
```

2. **Use legacy peer deps:**
```bash
npm install --legacy-peer-deps
```

3. **Update Node.js:**
```bash
# Check version
node --version

# Should be 18.x or 20.x
# Update via nvm
nvm install 20
nvm use 20
```

---

### Issue: TypeScript errors after install

**Error:**
```
Cannot find module '@fhevm-toolkit/sdk' or its corresponding type declarations
```

**Solutions:**

1. **Reinstall dependencies:**
```bash
npm install @fhevm-toolkit/sdk ethers
```

2. **Check tsconfig.json:**
```json
{
  "compilerOptions": {
    "moduleResolution": "node",
    "esModuleInterop": true,
    "skipLibCheck": true
  }
}
```

3. **Restart TypeScript server:**
- VS Code: `Cmd/Ctrl + Shift + P` → "Restart TS Server"

---

## SDK Initialization Issues

### Issue: Client initialization fails

**Error:**
```
InitializationError: Failed to initialize FHEVM: ...
```

**Solutions:**

1. **Check network connectivity:**
```typescript
try {
  const response = await fetch(rpcUrl);
  console.log('RPC available:', response.ok);
} catch (error) {
  console.error('RPC unreachable:', error);
}
```

2. **Verify provider configuration:**
```typescript
const provider = new ethers.JsonRpcProvider(
  process.env.NEXT_PUBLIC_RPC_URL
);

// Test provider
const network = await provider.getNetwork();
console.log('Connected to:', network.chainId);
```

3. **Check chain ID:**
```typescript
const client = new FhevmClient({
  provider,
  signer,
  chainId: 11155111 // Sepolia
});
```

4. **Use fallback RPC:**
```typescript
const rpcs = [
  'https://rpc.sepolia.org',
  'https://sepolia.infura.io/v3/YOUR_KEY',
  'https://eth-sepolia.g.alchemy.com/v2/YOUR_KEY'
];

async function getProvider() {
  for (const rpc of rpcs) {
    try {
      const provider = new ethers.JsonRpcProvider(rpc);
      await provider.getNetwork();
      return provider;
    } catch (error) {
      continue;
    }
  }
  throw new Error('No RPC available');
}
```

---

### Issue: Public key not fetching

**Error:**
```
Error: Public key is null
```

**Solutions:**

1. **Wait for initialization:**
```typescript
await client.init();

if (!client.initialized) {
  throw new Error('Client not initialized');
}

const publicKey = client.getPublicKey();
```

2. **Check ACL address:**
```typescript
const client = new FhevmClient({
  provider,
  signer,
  chainId: 11155111,
  aclAddress: '0x...' // Provide correct ACL address
});
```

---

## Encryption Issues

### Issue: Encryption fails

**Error:**
```
EncryptionError: Encryption failed: ...
```

**Solutions:**

1. **Verify client is initialized:**
```typescript
if (!client.initialized) {
  await client.init();
}
```

2. **Validate input parameters:**
```typescript
import { validateAddress, validateValueForType } from '@fhevm-toolkit/sdk';

// Validate address
if (!validateAddress(contractAddress)) {
  throw new Error('Invalid contract address');
}

// Validate value
if (!validateValueForType(value, type)) {
  throw new Error(`Invalid value for type ${type}`);
}
```

3. **Check value range:**
```typescript
// For uint32
if (value < 0 || value > 4294967295) {
  throw new Error('Value out of range for uint32');
}

// For uint64, use BigInt
const value = 1000000000000n; // Use 'n' suffix
```

4. **Verify contract address:**
```typescript
// Must be a valid Ethereum address
const contractAddress = '0x1234567890123456789012345678901234567890';
```

---

### Issue: Type mismatch errors

**Error:**
```
Type 'number' is not assignable to type 'bigint'
```

**Solutions:**

1. **Use correct types:**
```typescript
// For large numbers, use BigInt
const encrypted = await client.encryptInput({
  value: 1000000n, // Note the 'n' suffix
  type: 'uint64',
  contractAddress
});

// For small numbers, use regular number
const encrypted = await client.encryptInput({
  value: 100,
  type: 'uint32',
  contractAddress
});
```

2. **Convert values:**
```typescript
// String to number
const value = parseInt(userInput);

// Number to BigInt
const bigValue = BigInt(value);

// BigInt to string
const stringValue = bigValue.toString();
```

---

## Smart Contract Issues

### Issue: Transaction fails

**Error:**
```
Error: transaction failed
```

**Solutions:**

1. **Check gas settings:**
```typescript
import { estimateGasWithBuffer } from '@fhevm-toolkit/sdk';

const gasLimit = await estimateGasWithBuffer(
  contract,
  'submitValue',
  [handle, proof],
  1.5 // 50% buffer
);

const tx = await contract.submitValue(handle, proof, {
  gasLimit
});
```

2. **Verify contract address:**
```typescript
const code = await provider.getCode(contractAddress);
if (code === '0x') {
  throw new Error('No contract at this address');
}
```

3. **Check wallet balance:**
```typescript
const balance = await provider.getBalance(address);
console.log('Balance:', ethers.formatEther(balance));

if (balance === 0n) {
  throw new Error('Insufficient balance');
}
```

4. **Verify network:**
```typescript
const network = await provider.getNetwork();
if (network.chainId !== 11155111n) {
  throw new Error('Wrong network - switch to Sepolia');
}
```

---

### Issue: Contract not verified

**Error:**
```
Contract source code not verified
```

**Solutions:**

1. **Verify on Etherscan:**
```bash
npx hardhat verify --network sepolia DEPLOYED_ADDRESS
```

2. **Check verification status:**
```bash
# Visit Etherscan
https://sepolia.etherscan.io/address/YOUR_ADDRESS
```

3. **Manual verification:**
- Go to Etherscan → Contract → Verify & Publish
- Upload contract source code
- Set compiler version and optimization settings

---

## Frontend Issues

### Issue: Wallet not connecting

**Error:**
```
No Ethereum provider found
```

**Solutions:**

1. **Check MetaMask installed:**
```typescript
if (typeof window.ethereum === 'undefined') {
  alert('Please install MetaMask');
  return;
}
```

2. **Request account access:**
```typescript
try {
  const accounts = await window.ethereum.request({
    method: 'eth_requestAccounts'
  });
  console.log('Connected:', accounts[0]);
} catch (error) {
  console.error('User rejected:', error);
}
```

3. **Check network:**
```typescript
const chainId = await window.ethereum.request({
  method: 'eth_chainId'
});

if (chainId !== '0xaa36a7') { // Sepolia
  await window.ethereum.request({
    method: 'wallet_switchEthereumChain',
    params: [{ chainId: '0xaa36a7' }]
  });
}
```

---

### Issue: React hooks not working

**Error:**
```
Hooks can only be called inside a function component
```

**Solutions:**

1. **Use 'use client' directive:**
```typescript
'use client'; // Add at top of file

import { useFhevmClient } from '@fhevm-toolkit/sdk';

export default function MyComponent() {
  const { client } = useFhevmClient({ ... });
  // ...
}
```

2. **Check component structure:**
```typescript
// ❌ Wrong - not in component
const { client } = useFhevmClient({ ... });

function MyComponent() {
  return <div>{...}</div>;
}

// ✅ Correct - inside component
function MyComponent() {
  const { client } = useFhevmClient({ ... });
  return <div>{...}</div>;
}
```

---

### Issue: Environment variables not loading

**Error:**
```
process.env.NEXT_PUBLIC_CONTRACT_ADDRESS is undefined
```

**Solutions:**

1. **Check file name:**
```bash
# Should be .env.local for Next.js
ls -la .env*

# Rename if needed
mv .env .env.local
```

2. **Verify variable prefix:**
```env
# ❌ Wrong - not accessible in browser
CONTRACT_ADDRESS=0x...

# ✅ Correct - NEXT_PUBLIC_ prefix
NEXT_PUBLIC_CONTRACT_ADDRESS=0x...
```

3. **Restart dev server:**
```bash
# Stop server (Ctrl+C)
# Restart
npm run dev
```

4. **Check .gitignore:**
```bash
# Ensure .env.local is ignored
cat .gitignore | grep ".env"
```

---

## Network Issues

### Issue: RPC timeout

**Error:**
```
Error: timeout exceeded
```

**Solutions:**

1. **Increase timeout:**
```typescript
const provider = new ethers.JsonRpcProvider(
  rpcUrl,
  {
    timeout: 60000 // 60 seconds
  }
);
```

2. **Use alternative RPC:**
```typescript
// Try different RPC endpoints
const rpcs = [
  'https://rpc.sepolia.org',
  'https://rpc2.sepolia.org',
  'https://sepolia.gateway.tenderly.co'
];
```

3. **Check RPC status:**
```bash
# Test RPC endpoint
curl -X POST https://rpc.sepolia.org \
  -H "Content-Type: application/json" \
  -d '{"jsonrpc":"2.0","method":"eth_blockNumber","params":[],"id":1}'
```

---

### Issue: Wrong network

**Error:**
```
Chain ID mismatch
```

**Solutions:**

1. **Switch network in MetaMask:**
```typescript
try {
  await window.ethereum.request({
    method: 'wallet_switchEthereumChain',
    params: [{ chainId: '0xaa36a7' }] // Sepolia
  });
} catch (error) {
  if (error.code === 4902) {
    // Network not added, add it
    await window.ethereum.request({
      method: 'wallet_addEthereumChain',
      params: [{
        chainId: '0xaa36a7',
        chainName: 'Sepolia',
        nativeCurrency: { name: 'ETH', symbol: 'ETH', decimals: 18 },
        rpcUrls: ['https://rpc.sepolia.org']
      }]
    });
  }
}
```

2. **Verify chain ID:**
```typescript
const expectedChainId = 11155111; // Sepolia
const currentChainId = await signer.getChainId();

if (currentChainId !== expectedChainId) {
  throw new Error(`Wrong network: ${currentChainId}`);
}
```

---

## Build Issues

### Issue: Build fails

**Error:**
```
Type error: Cannot find module
```

**Solutions:**

1. **Clear cache:**
```bash
# Next.js
rm -rf .next
npm run build

# Vite
rm -rf dist node_modules/.vite
npm run build
```

2. **Check TypeScript:**
```bash
# Run TypeScript check
npx tsc --noEmit

# Fix any errors shown
```

3. **Verify imports:**
```typescript
// ❌ Wrong
import { FhevmClient } from 'fhevm-toolkit-sdk';

// ✅ Correct
import { FhevmClient } from '@fhevm-toolkit/sdk';
```

---

### Issue: Bundle size too large

**Warning:**
```
Warning: Bundle size exceeds 500KB
```

**Solutions:**

1. **Dynamic imports:**
```typescript
// Instead of
import { FhevmClient } from '@fhevm-toolkit/sdk';

// Use dynamic import
const { FhevmClient } = await import('@fhevm-toolkit/sdk');
```

2. **Code splitting:**
```typescript
// next.config.js
module.exports = {
  webpack: (config) => {
    config.optimization.splitChunks = {
      chunks: 'all'
    };
    return config;
  }
};
```

3. **Tree shaking:**
```typescript
// Import only what you need
import { FhevmClient, encryptUint64 } from '@fhevm-toolkit/sdk';
// Instead of
import * as SDK from '@fhevm-toolkit/sdk';
```

---

## Debug Tips

### Enable Debug Mode

```typescript
// Set in environment
process.env.DEBUG = 'fhevm:*';

// Log all operations
const client = new FhevmClient({
  provider,
  signer,
  chainId: 11155111
});

client.on('debug', (msg) => console.log('[DEBUG]', msg));
```

### Check SDK State

```typescript
const state = client.getState();
console.log({
  isInitialized: state.isInitialized,
  hasPublicKey: !!state.publicKey,
  hasInstance: !!state.instance
});
```

### Test Contract Interaction

```typescript
// Test contract is accessible
const contract = new ethers.Contract(address, abi, provider);

// Call view function
const result = await contract.someViewFunction();
console.log('Contract responsive:', result);
```

---

## Getting Help

### Before Asking for Help

1. Check this troubleshooting guide
2. Review error messages carefully
3. Check SDK documentation
4. Search existing GitHub issues

### When Asking for Help

Include:
- Error message (full stack trace)
- SDK version (`npm list @fhevm-toolkit/sdk`)
- Node version (`node --version`)
- Operating system
- Code snippet (minimal reproducible example)
- Steps to reproduce

### Where to Get Help

- **Documentation**: [SDK Guide](./SDK_GUIDE.md)
- **API Reference**: [API_REFERENCE.md](./API_REFERENCE.md)
- **GitHub Issues**: https://github.com/KristofferSchuppe/fhevm-react-template/issues
- **Discussions**: https://github.com/KristofferSchuppe/fhevm-react-template/discussions

---

## Common Error Codes

| Error Code | Meaning | Solution |
|------------|---------|----------|
| `ERESOLVE` | Dependency conflict | Use `--legacy-peer-deps` |
| `ECONNREFUSED` | RPC unavailable | Check RPC URL, try alternative |
| `INSUFFICIENT_FUNDS` | Not enough ETH | Get testnet ETH from faucet |
| `INVALID_ARGUMENT` | Wrong parameter type | Check function signature |
| `NETWORK_ERROR` | Network issue | Check internet, try different RPC |
| `NONCE_EXPIRED` | Transaction nonce conflict | Reset MetaMask account |
| `UNPREDICTABLE_GAS_LIMIT` | Gas estimation failed | Set gas limit manually |

---

*Still having issues? Open an issue on GitHub with details!*
