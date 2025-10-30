# Privacy Evidence Manager

> A Confidential Judicial Evidence Management System Built on FHE (Fully Homomorphic Encryption)

[![Live Demo](https://img.shields.io/badge/demo-live-brightgreen)](https://privacy-evidence-manager.vercel.app/)
[![License](https://img.shields.io/badge/license-MIT-blue.svg)](LICENSE)
[![Solidity](https://img.shields.io/badge/solidity-0.8.24-orange)](https://docs.soliditylang.org/)

## 🎯 Overview

Privacy Evidence Manager is a revolutionary blockchain-based judicial evidence management system that leverages Fully Homomorphic Encryption (FHE) to ensure absolute confidentiality of sensitive legal evidence while maintaining transparency and auditability on-chain.

The system enables secure submission, review, and management of confidential legal evidence with cryptographic guarantees that sensitive information remains encrypted throughout its entire lifecycle - even during computational operations.

🌐 **Live Application**: [https://privacy-evidence-manager.vercel.app/](https://privacy-evidence-manager.vercel.app/)

📺 **Demo Video**: Available in `/PrivacyEvidenceManager.mp4`

 

---

## 🔐 Core Concepts

### Fully Homomorphic Encryption (FHE)

FHE is a groundbreaking cryptographic technique that allows computations to be performed directly on encrypted data without requiring decryption. In the context of judicial evidence management, this means:

- **End-to-End Encryption**: Evidence remains encrypted from submission through review to final judgment
- **Confidential Computation**: Evidence can be verified, analyzed, and processed while remaining encrypted
- **Zero-Knowledge Verification**: Authorized parties can validate evidence authenticity without exposing sensitive content
- **Granular Access Control**: Different encryption keys enable role-based access to evidence categories

### Privacy-Preserving Judicial Workflow

The system implements a complete judicial evidence lifecycle with cryptographic privacy guarantees:

1. **Confidential Case Creation**: Judges create cases with encrypted metadata and access controls
2. **Secure Evidence Submission**: Evidence submitters upload encrypted evidence with FHE protection
3. **Private Review Process**: Authorized reviewers can assess evidence integrity without decryption
4. **Encrypted Verdict Recording**: Final judgments are recorded with privacy-preserving cryptographic proofs
5. **Audit Trail**: Complete transparency of actions while maintaining content confidentiality

### Role-Based Access Architecture

Three distinct roles ensure separation of concerns and security:

- **Judges**: Create cases, authorize reviewers, grant access permissions, and close cases
- **Reviewers**: Examine submitted evidence and update status (approve/reject)
- **Evidence Submitters**: Upload encrypted evidence to assigned cases

---

## 🏗️ System Architecture

### Smart Contract Infrastructure

The system is powered by the `PrivacyEvidenceManager` smart contract deployed on Ethereum-compatible networks with FHE support:

**Contract Address**: `0x2BB2Eed0a66d74D92897aFAADa41a988E50C1830` (Sepolia Testnet)

**Key Features**:
- FHE-encrypted evidence storage
- Role-based access control (RBAC)
- Multi-level security classifications (Public, Restricted, Confidential, Top Secret)
- Immutable audit trail
- Event-driven architecture for real-time updates

### Evidence Classification System

Evidence is categorized by type and security level:

**Evidence Types**:
- 📄 **Document**: Written evidence, contracts, agreements
- 📸 **Photo**: Visual evidence, crime scene photos
- 🎥 **Video**: Surveillance footage, recordings
- 🔊 **Audio**: Voice recordings, wiretaps
- 📊 **Digital**: Computer forensics, digital artifacts
- 🧬 **Forensic**: DNA, fingerprints, lab results
- 👁️ **Witness**: Testimony transcripts, depositions
- 📋 **Other**: Miscellaneous evidence

**Security Levels**:
1. **Public** (Level 0): Non-sensitive information
2. **Restricted** (Level 1): Limited distribution
3. **Confidential** (Level 2): Authorized personnel only
4. **Top Secret** (Level 3): Highest security clearance required

---

## 📸 Screenshots & Demonstrations

### On-Chain Transaction Verification

All evidence submissions and reviews are recorded immutably on the blockchain:

![Transaction Screenshot](Transaction Screenshot.png)

**Example Transaction**: Evidence submission with encrypted payload
- Gas Used: Optimized for FHE operations
- Block Confirmation: Instant finality



## 🎬 Demo Video

A comprehensive demonstration video is included showing:

1. Wallet connection and authentication
2. Creating a confidential case
3. Submitting encrypted evidence
4. Reviewer authorization workflow
5. Evidence review and approval process
6. On-chain transaction verification
7. Access control demonstration

**Video Location**: `PrivacyEvidenceManager.mp4`

**Video Highlights**:
- Real-time blockchain interaction
- FHE encryption in action
- Role-based access control
- Complete evidence lifecycle

---

## 🔧 Technical Stack

### Blockchain & Smart Contracts
- **Solidity 0.8.24**: Smart contract development
- **Hardhat**: Development environment and testing
- **fhEVM by Zama**: FHE implementation for Ethereum
- **ethers.js v6**: Blockchain interaction library

### Frontend Technologies
- **Vanilla JavaScript**: Lightweight, no framework overhead
- **Modern CSS**: Glassmorphism design, responsive layout
- **Web3 Integration**: Direct smart contract calls
- **MetaMask**: Wallet integration

### Cryptography
- **FHE (Fully Homomorphic Encryption)**: Zama's fhEVM library
- **Encrypted State Variables**: euint8, euint32, euint64 types
- **Access Control Lists**: Encrypted permission management

---

## 📋 Smart Contract Functions

### Administrative Functions

```solidity
function authorizeJudge(address _judge) external onlyOwner
function authorizeReviewer(address _reviewer) external onlyOwner
```

### Case Management

```solidity
function createCase(
    string memory _title,
    einput encryptedDescription,
    bytes calldata inputProof
) external returns (uint256)

function closeCase(uint256 _caseId) external onlyJudge
```

### Evidence Operations

```solidity
function submitEvidence(
    uint256 _caseId,
    einput encryptedData,
    einput encryptedHash,
    bytes calldata inputProof,
    uint8 _evidenceType,
    uint8 _securityLevel
) external returns (uint256)

function reviewEvidence(
    uint256 _evidenceId,
    uint8 _newStatus
) external onlyReviewer
```

### Access Control

```solidity
function grantCaseAccess(
    uint256 _caseId,
    address _user
) external onlyJudge

function grantEvidenceAccess(
    uint256 _evidenceId,
    address _user
) external onlyJudge
```

---

## 🔒 Security Features

### Encryption Layer
- **End-to-End FHE**: Evidence never exists in plaintext on-chain
- **Threshold Decryption**: Multi-party decryption keys for sensitive operations
- **Key Management**: Secure key derivation and storage

### Access Control
- **Role-Based Permissions**: Granular authorization system
- **Time-Locked Access**: Evidence can have time-based access restrictions
- **Audit Logging**: All access attempts are permanently recorded

### Smart Contract Security
- **Reentrancy Protection**: OpenZeppelin security standards
- **Input Validation**: Comprehensive input sanitization
- **Access Modifiers**: Strict function-level access control
- **Event Emission**: Complete action transparency

---

## 🌟 Use Cases

### 1. Criminal Investigations
Securely manage sensitive evidence like witness testimonies, forensic data, and surveillance footage with guaranteed confidentiality.

### 2. Corporate Litigation
Handle confidential business documents, trade secrets, and financial records in civil disputes without exposure risk.

### 3. Government Security Cases
Process classified information in national security cases with military-grade encryption and access control.

### 4. Whistleblower Protection
Allow anonymous evidence submission with cryptographic identity protection while maintaining legal validity.

### 5. Cross-Jurisdiction Cases
Enable secure evidence sharing between international jurisdictions with provable chain of custody.

---

## 📊 System Statistics

The dashboard provides real-time statistics:

- **Total Cases**: Number of cases created
- **Total Evidence**: Cumulative evidence submissions
- **Total Reviews**: Number of review actions performed
- **Active Cases**: Currently open investigations
- **Pending Reviews**: Evidence awaiting reviewer action

---

## 🎨 User Interface Features

### Modern Design
- **Glassmorphism**: Frosted glass aesthetic with backdrop blur
- **Gradient Accents**: Professional blue gradient theme
- **Smooth Animations**: Hover effects, transitions, and micro-interactions
- **Responsive Layout**: Mobile-first design adapting to all screen sizes

### Intuitive Navigation
- **Tab-Based Interface**: Organized sections for different operations
- **Status Indicators**: Real-time connection and transaction status
- **Interactive Cards**: Hover states and visual feedback
- **Form Validation**: Client-side validation with helpful error messages

### Accessibility
- **Keyboard Navigation**: Full keyboard support
- **Screen Reader Compatible**: ARIA labels and semantic HTML
- **High Contrast**: Readable text with sufficient contrast ratios
- **Loading States**: Clear feedback during async operations

---

## 🚀 Key Advantages

### For Legal Professionals
✅ **Guaranteed Confidentiality**: Mathematical proof of privacy through FHE
✅ **Immutable Records**: Tamper-proof evidence with blockchain permanence
✅ **Transparent Process**: Complete audit trail without compromising privacy
✅ **Regulatory Compliance**: Meet data protection requirements (GDPR, HIPAA, etc.)

### For Technology Teams
✅ **Cutting-Edge Cryptography**: Implementation of latest FHE research
✅ **Scalable Architecture**: Designed for enterprise-scale deployments
✅ **Open Standards**: Compatible with Ethereum ecosystem
✅ **Extensible Design**: Modular smart contracts for custom workflows

### For Organizations
✅ **Cost Reduction**: Eliminate secure storage and handling overhead
✅ **Risk Mitigation**: Reduce data breach exposure through encryption
✅ **Process Automation**: Smart contracts automate manual workflows
✅ **Global Accessibility**: Decentralized access from anywhere

---

## 🔬 Technical Innovation

### FHE Integration
This project showcases one of the first production implementations of Fully Homomorphic Encryption in a judicial evidence system, demonstrating:

- **Practical FHE Usage**: Real-world application beyond academic research
- **Performance Optimization**: Efficient encrypted operations on-chain
- **User Experience**: Complex cryptography abstracted for end users
- **Scalability**: Designed to handle high-volume evidence processing

### Blockchain Benefits
- **Decentralization**: No single point of failure or control
- **Transparency**: Verifiable actions without exposing sensitive data
- **Permanence**: Evidence preservation for decades
- **Interoperability**: Compatible with other blockchain systems

---

## 📝 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

---

## 🤝 Contributing

Contributions are welcome! Please feel free to submit pull requests or open issues for bugs and feature requests.

**Development Guidelines**:
- Follow Solidity best practices and security patterns
- Maintain test coverage above 90%
- Document all public functions with NatSpec
- Use semantic commit messages

---

## 📞 Contact & Support


- **Live Demo**: [https://privacy-evidence-manager.vercel.app/](https://privacy-evidence-manager.vercel.app/)
- **Issues**: Report bugs and request features via GitHub Issues

---

## 🙏 Acknowledgments

- **Zama**: For pioneering FHE technology and the fhEVM library
- **Ethereum Foundation**: For the robust blockchain infrastructure
- **OpenZeppelin**: For security-audited smart contract libraries
- **Web3 Community**: For continuous innovation in decentralized technologies

---

## 📚 Further Reading

- [Zama fhEVM Documentation](https://docs.zama.ai/fhevm)
- [Fully Homomorphic Encryption Overview](https://en.wikipedia.org/wiki/Homomorphic_encryption)
- [Solidity Documentation](https://docs.soliditylang.org/)
- [Ethereum Development Guides](https://ethereum.org/en/developers/)

---

**Built with ❤️ for a more private and secure judicial system**

*Protecting justice, preserving privacy*
