# Privacy Evidence Manager

> Example dApp demonstrating FHEVM SDK integration with a real-world judicial evidence management system.

## 📋 Overview

This example showcases how to integrate the `@fhevm-toolkit/sdk` into a Hardhat-based smart contract project for managing confidential legal evidence.

**Features:**
- 🔐 Role-based access control (Judges, Reviewers, Submitters)
- 📝 Evidence submission and review workflow
- 🔒 Access level management (Public, Restricted, Confidential, Top Secret)
- ⛓️ Immutable audit trail
- 🚀 FHEVM SDK integration

## 🚀 Quick Start

### Install Dependencies

```bash
npm install
```

### Compile Contracts

```bash
npm run compile
```

### Run Tests

```bash
npm test
```

### Deploy to Sepolia

```bash
# Configure .env
cp .env.example .env

# Deploy
npm run deploy
```

## 🔧 Using FHEVM SDK

This example demonstrates SDK usage in contract interactions:

```javascript
import { FhevmClient } from '@fhevm-toolkit/sdk';
import { ethers } from 'ethers';

// Initialize SDK
const client = new FhevmClient({
  provider,
  signer,
  chainId: 11155111
});

await client.init();

// Encrypt evidence data
const encrypted = await client.encryptInput({
  value: evidenceData,
  type: 'uint256',
  contractAddress: CONTRACT_ADDRESS
});

// Submit to contract
const tx = await evidenceContract.submitEvidence(
  caseId,
  metadataURI,
  evidenceType,
  accessLevel,
  encrypted.handles[0],
  encrypted.inputProof
);
```

## 📚 Contract Functions

### Admin Functions
- `authorizeJudge(address)` - Authorize a judge
- `authorizeReviewer(address)` - Authorize a reviewer

### Judge Functions
- `createCase(title, accessLevel)` - Create new case
- `closeCase(caseId)` - Close case
- `grantCaseAccess(caseId, user)` - Grant case access
- `sealEvidence(evidenceId)` - Seal evidence

### User Functions
- `submitEvidence(caseId, metadataURI, type, level)` - Submit evidence

### Reviewer Functions
- `reviewEvidence(evidenceId, status)` - Review evidence

## 🌐 Deployed Contract

**Network**: Sepolia Testnet
**Contract Address**: `0x2BB2Eed0a66d74D92897aFAADa41a988E50C1830`
**Explorer**: [View on Etherscan](https://sepolia.etherscan.io/address/0x2BB2Eed0a66d74D92897aFAADa41a988E50C1830)

## 📖 Documentation

See the [main documentation](../../docs/) for more details on:
- SDK integration guide
- Contract deployment
- Testing strategies
- Security best practices

## 📄 License

MIT
