# FHE Evidence Manager - Smart Contract Example

> Confidential judicial evidence management system demonstrating FHEVM SDK integration with Hardhat smart contracts.

**Live Demo**: [https://fhe-evidence-manager.vercel.app/](https://fhe-evidence-manager.vercel.app/)

**GitHub**: [https://github.com/KristofferSchuppe/FHEEvidenceManager](https://github.com/KristofferSchuppe/FHEEvidenceManager)

---

## 📋 Overview

This example showcases how to integrate the `@fhevm-toolkit/sdk` into a Hardhat-based smart contract project for managing confidential legal evidence with Fully Homomorphic Encryption (FHE).

**Core Concept**: **FHE Contract Privacy Evidence Management** - A confidential judicial evidence system that ensures absolute confidentiality of sensitive legal evidence through cryptographic guarantees.

**Features:**
- 🔐 **FHE-Powered Privacy**: Cryptographic guarantees with Fully Homomorphic Encryption
- ⚖️ **Role-Based Access Control**: Judges, Reviewers, and Submitters with distinct permissions
- 📝 **Evidence Workflow**: Complete submission, review, and sealing process
- 🔒 **Access Levels**: Public, Restricted, Confidential, Top Secret classifications
- ⛓️ **Immutable Audit Trail**: All actions recorded on blockchain
- 🚀 **FHEVM SDK Integration**: Production-ready SDK implementation
- 🧪 **Comprehensive Testing**: 77 tests with 92.45% coverage

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

This example demonstrates SDK usage for confidential evidence management in contract interactions:

```javascript
import { FhevmClient } from '@fhevm-toolkit/sdk';
import { ethers } from 'ethers';

// Initialize SDK for confidential judicial system
const client = new FhevmClient({
  provider,
  signer,
  chainId: 11155111 // Sepolia testnet
});

await client.init();

// Encrypt sensitive evidence data with FHE
const encrypted = await client.encryptInput({
  value: evidenceData,
  type: 'uint256',
  contractAddress: CONTRACT_ADDRESS
});

// Submit encrypted evidence to contract
// Evidence remains confidential throughout the judicial process
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
**Live Application**: [https://fhe-evidence-manager.vercel.app/](https://fhe-evidence-manager.vercel.app/)

## 🧪 Testing

The smart contract implementation includes comprehensive test coverage:

```bash
# Run all tests
npm test

# Run with coverage report
npm run coverage

# Run specific test file
npx hardhat test test/FHEEvidenceManager.test.js
```

**Test Coverage**: 77 tests covering 92.45% of code
- ✅ Access control and authorization
- ✅ Evidence submission and encryption
- ✅ Case creation and management
- ✅ Review workflow
- ✅ Permission and access levels
- ✅ Event emissions
- ✅ Error handling and edge cases

## 🔐 Security Features

This example demonstrates production-ready security practices:

- **Role-Based Access Control**: Granular permissions for judges, reviewers, and submitters
- **Input Validation**: Comprehensive validation of all function parameters
- **Access Level Enforcement**: Public, Restricted, Confidential, and Top Secret classifications
- **Audit Trail**: Immutable event logs for all state changes
- **Gas Optimization**: Optimized for efficient on-chain operations
- **Tested Security**: Extensive test suite covering security scenarios

## 📖 Documentation

For comprehensive guides and references, see:

- **[SDK Guide](../../docs/SDK_GUIDE.md)** - Complete FHEVM SDK reference and usage
- **[API Reference](../../docs/API_REFERENCE.md)** - Full API documentation for all SDK methods
- **[Integration Guide](../../docs/INTEGRATION.md)** - Framework-specific integration examples
- **[Deployment Guide](../../docs/DEPLOYMENT.md)** - Deploy smart contracts and frontend applications
- **[Security Best Practices](../../docs/SECURITY.md)** - Security guidelines for FHE applications
- **[Troubleshooting](../../docs/TROUBLESHOOTING.md)** - Common issues and solutions
- **[Next.js Example](../nextjs-evidence-manager/README.md)** - Frontend integration example

## 🔗 Links

- **Live Demo**: [https://fhe-evidence-manager.vercel.app/](https://fhe-evidence-manager.vercel.app/)
- **GitHub Repository**: [https://github.com/KristofferSchuppe/FHEEvidenceManager](https://github.com/KristofferSchuppe/FHEEvidenceManager)
- **Frontend Repository**: [https://github.com/KristofferSchuppe/fhevm-react-template](https://github.com/KristofferSchuppe/fhevm-react-template)
- **Deployed Contract**: [View on Etherscan](https://sepolia.etherscan.io/address/0x2BB2Eed0a66d74D92897aFAADa41a988E50C1830)

## 💡 Use Cases

This confidential judicial evidence management system demonstrates:

1. **Legal Evidence Management**: Secure handling of sensitive legal documents
2. **Chain of Custody**: Immutable tracking of evidence handling
3. **Confidential Voting**: Private decision-making with cryptographic guarantees
4. **Sealed Documents**: Time-locked or access-controlled information
5. **Regulatory Compliance**: GDPR-compliant data handling with encryption

## 📄 License

MIT
