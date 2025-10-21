# 🚀 Deployment Guide

Complete guide for deploying FHEVM SDK applications and smart contracts.

---

## Table of Contents

1. [Smart Contract Deployment](#smart-contract-deployment)
2. [Frontend Deployment](#frontend-deployment)
3. [Environment Configuration](#environment-configuration)
4. [Network Setup](#network-setup)
5. [Verification](#verification)
6. [Troubleshooting](#troubleshooting)

---

## Smart Contract Deployment

### Prerequisites

- Node.js 18+ installed
- Wallet with testnet ETH
- Etherscan API key (for verification)

### 1. Setup Environment

Create `.env` file:

```env
PRIVATE_KEY=your_private_key_here
SEPOLIA_RPC_URL=https://rpc.sepolia.org
ETHERSCAN_API_KEY=your_etherscan_api_key
```

### 2. Install Dependencies

```bash
npm install
```

### 3. Compile Contracts

```bash
npx hardhat compile
```

### 4. Deploy to Sepolia

```bash
npx hardhat run scripts/deploy.js --network sepolia
```

**Expected Output:**
```
Deploying FHE Evidence Manager...
✅ Contract deployed to: 0x1234...
✅ Deployment info saved to: deployments/sepolia.json
📝 Network: Sepolia (11155111)
🔍 Etherscan: https://sepolia.etherscan.io/address/0x1234...
```

### 5. Verify Contract

```bash
npx hardhat verify --network sepolia DEPLOYED_ADDRESS
```

**Or use the verify script:**

```bash
npx hardhat run scripts/verify.js --network sepolia
```

### 6. Save Deployment Info

**`deployments/sepolia.json`:**

```json
{
  "network": "sepolia",
  "chainId": 11155111,
  "contractAddress": "0x1234...",
  "deployer": "0xABC...",
  "blockNumber": 12345678,
  "timestamp": "2024-10-27T10:00:00.000Z",
  "transactionHash": "0xDEF...",
  "gasUsed": "1234567"
}
```

---

## Frontend Deployment

### Next.js Deployment (Vercel)

#### 1. Prepare for Deployment

**`next.config.js`:**

```javascript
/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  env: {
    NEXT_PUBLIC_CONTRACT_ADDRESS: process.env.NEXT_PUBLIC_CONTRACT_ADDRESS,
    NEXT_PUBLIC_CHAIN_ID: process.env.NEXT_PUBLIC_CHAIN_ID,
  }
}

module.exports = nextConfig
```

#### 2. Configure Environment Variables

In Vercel dashboard, add:

```env
NEXT_PUBLIC_CONTRACT_ADDRESS=0x2BB2Eed0a66d74D92897aFAADa41a988E50C1830
NEXT_PUBLIC_CHAIN_ID=11155111
NEXT_PUBLIC_RPC_URL=https://rpc.sepolia.org
```

#### 3. Deploy to Vercel

**Option A: GitHub Integration**

1. Push code to GitHub
2. Connect repository in Vercel
3. Vercel auto-deploys on push

**Option B: Vercel CLI**

```bash
# Install Vercel CLI
npm i -g vercel

# Login
vercel login

# Deploy
vercel

# Deploy to production
vercel --prod
```

#### 4. Custom Domain (Optional)

In Vercel dashboard:
1. Go to Settings → Domains
2. Add your custom domain
3. Configure DNS records

**Result:** https://fhe-evidence-manager.vercel.app/

---

### React Deployment (Netlify)

#### 1. Build Configuration

**`netlify.toml`:**

```toml
[build]
  command = "npm run build"
  publish = "dist"

[[redirects]]
  from = "/*"
  to = "/index.html"
  status = 200

[build.environment]
  NODE_VERSION = "18"
```

#### 2. Deploy with Netlify CLI

```bash
# Install Netlify CLI
npm i -g netlify-cli

# Login
netlify login

# Deploy
netlify deploy

# Deploy to production
netlify deploy --prod
```

#### 3. Environment Variables

In Netlify dashboard:
- Go to Site settings → Environment variables
- Add required variables

---

## Environment Configuration

### Development Environment

**`.env.development`:**

```env
# Contract
NEXT_PUBLIC_CONTRACT_ADDRESS=0x...
NEXT_PUBLIC_CHAIN_ID=11155111

# Network
NEXT_PUBLIC_RPC_URL=https://rpc.sepolia.org

# Features
NEXT_PUBLIC_ENABLE_DEBUG=true
```

### Production Environment

**`.env.production`:**

```env
# Contract
NEXT_PUBLIC_CONTRACT_ADDRESS=0x2BB2Eed0a66d74D92897aFAADa41a988E50C1830
NEXT_PUBLIC_CHAIN_ID=11155111

# Network
NEXT_PUBLIC_RPC_URL=https://rpc.sepolia.org

# Analytics
NEXT_PUBLIC_GA_ID=GA-XXXXXXX

# Features
NEXT_PUBLIC_ENABLE_DEBUG=false
```

### Environment Variable Checklist

- [ ] `NEXT_PUBLIC_CONTRACT_ADDRESS` - Deployed contract address
- [ ] `NEXT_PUBLIC_CHAIN_ID` - Network chain ID
- [ ] `NEXT_PUBLIC_RPC_URL` - RPC endpoint
- [ ] `WALLETCONNECT_PROJECT_ID` - WalletConnect ID (if using)
- [ ] API keys for services

---

## Network Setup

### Supported Networks

#### Sepolia Testnet (Recommended for Testing)

```javascript
{
  chainId: 11155111,
  name: 'Sepolia',
  rpcUrl: 'https://rpc.sepolia.org',
  explorerUrl: 'https://sepolia.etherscan.io',
  faucets: [
    'https://sepoliafaucet.com',
    'https://faucet.sepolia.dev'
  ]
}
```

#### Ethereum Mainnet (Production)

```javascript
{
  chainId: 1,
  name: 'Ethereum',
  rpcUrl: 'https://eth.llamarpc.com',
  explorerUrl: 'https://etherscan.io'
}
```

### Network Configuration in Code

**Wagmi Config:**

```typescript
import { createConfig, http } from 'wagmi';
import { sepolia } from 'wagmi/chains';

export const config = createConfig({
  chains: [sepolia],
  transports: {
    [sepolia.id]: http(process.env.NEXT_PUBLIC_RPC_URL)
  }
});
```

---

## Verification

### Smart Contract Verification

#### Manual Verification

```bash
npx hardhat verify --network sepolia \
  DEPLOYED_ADDRESS \
  "Constructor Arg 1" \
  "Constructor Arg 2"
```

#### Automated Verification

**`scripts/verify.js`:**

```javascript
const hre = require("hardhat");
const fs = require("fs");

async function main() {
  // Load deployment info
  const deployment = JSON.parse(
    fs.readFileSync("./deployments/sepolia.json", "utf8")
  );

  console.log("Verifying contract...");

  try {
    await hre.run("verify:verify", {
      address: deployment.contractAddress,
      constructorArguments: []
    });

    console.log("✅ Contract verified!");
  } catch (error) {
    console.error("❌ Verification failed:", error.message);
  }
}

main();
```

### Frontend Verification

1. **Check Build:**
   ```bash
   npm run build
   ```

2. **Test Locally:**
   ```bash
   npm run start
   ```

3. **Check Environment:**
   - Verify all environment variables
   - Test contract interactions
   - Check wallet connection

4. **Monitor Logs:**
   - Check Vercel/Netlify deployment logs
   - Monitor browser console for errors

---

## Deployment Checklist

### Pre-Deployment

- [ ] All tests passing (`npm test`)
- [ ] Code linted (`npm run lint`)
- [ ] Build successful (`npm run build`)
- [ ] Environment variables configured
- [ ] Smart contracts compiled
- [ ] Deployment scripts tested

### Smart Contract Deployment

- [ ] Deploy to testnet first
- [ ] Verify contract on block explorer
- [ ] Test all contract functions
- [ ] Save deployment info
- [ ] Update frontend contract address

### Frontend Deployment

- [ ] Environment variables set
- [ ] Build configuration correct
- [ ] Custom domain configured (if applicable)
- [ ] SSL certificate active
- [ ] Analytics configured (if applicable)

### Post-Deployment

- [ ] Test live application
- [ ] Verify contract interactions
- [ ] Check wallet connection
- [ ] Monitor for errors
- [ ] Update documentation with URLs

---

## Troubleshooting

### Smart Contract Issues

**Issue:** Contract deployment fails

**Solutions:**
1. Check wallet has sufficient ETH
2. Verify RPC URL is correct
3. Check gas price settings
4. Try increasing gas limit

**Issue:** Verification fails

**Solutions:**
1. Check contract is deployed
2. Verify Etherscan API key
3. Check constructor arguments
4. Wait for Etherscan to index

### Frontend Issues

**Issue:** Build fails

**Solutions:**
1. Clear `.next` or `dist` folder
2. Delete `node_modules` and reinstall
3. Check for missing dependencies
4. Verify environment variables

**Issue:** Contract not connecting

**Solutions:**
1. Check contract address in env
2. Verify chain ID matches
3. Check wallet network
4. Verify RPC URL

### Network Issues

**Issue:** RPC timeout

**Solutions:**
1. Use alternative RPC endpoint
2. Increase timeout in config
3. Check network status
4. Use backup RPC

**Issue:** Transaction fails

**Solutions:**
1. Check gas settings
2. Verify contract is deployed
3. Check wallet permissions
4. Verify function parameters

---

## Production Checklist

### Security

- [ ] Private keys secured
- [ ] Environment variables not exposed
- [ ] Rate limiting configured
- [ ] Error messages don't leak sensitive info
- [ ] HTTPS enabled
- [ ] CORS configured properly

### Performance

- [ ] Images optimized
- [ ] Code minified
- [ ] Caching configured
- [ ] CDN setup (if applicable)
- [ ] Bundle size optimized

### Monitoring

- [ ] Error tracking (Sentry, etc.)
- [ ] Analytics (Google Analytics, etc.)
- [ ] Uptime monitoring
- [ ] Performance monitoring
- [ ] Contract event monitoring

---

## Example Deployment Workflow

```bash
# 1. Test everything locally
npm test
npm run lint
npm run build

# 2. Deploy smart contract
npx hardhat run scripts/deploy.js --network sepolia

# 3. Verify contract
npx hardhat run scripts/verify.js --network sepolia

# 4. Update frontend env
echo "NEXT_PUBLIC_CONTRACT_ADDRESS=0x..." >> .env.production

# 5. Deploy frontend
vercel --prod

# 6. Verify deployment
curl https://fhe-evidence-manager.vercel.app/

# 7. Test live app
# Open browser and test functionality

# 8. Monitor
# Check logs and analytics
```

---

## Deployed Links

### Live Applications
- **FHE Evidence Manager**: https://fhe-evidence-manager.vercel.app/

### Smart Contracts
- **Sepolia Contract**: 0x2BB2Eed0a66d74D92897aFAADa41a988E50C1830
- **Etherscan**: https://sepolia.etherscan.io/address/0x2BB2Eed0a66d74D92897aFAADa41a988E50C1830

### Repositories
- **Main Repository**: https://github.com/KristofferSchuppe/fhevm-react-template
- **Smart Contract**: https://github.com/KristofferSchuppe/FHEEvidenceManager

---

## Support

For deployment issues:
- Check [Troubleshooting Guide](./TROUBLESHOOTING.md)
- Open [GitHub Issue](https://github.com/KristofferSchuppe/fhevm-react-template/issues)
- Review [SDK Guide](./SDK_GUIDE.md)

---

*Complete deployment guide for FHEVM SDK applications*
