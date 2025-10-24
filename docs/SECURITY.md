# 🔒 Security Best Practices

Security guidelines for FHEVM SDK applications and smart contracts.

---

## Table of Contents

1. [Smart Contract Security](#smart-contract-security)
2. [Frontend Security](#frontend-security)
3. [API Security](#api-security)
4. [Key Management](#key-management)
5. [Network Security](#network-security)
6. [Monitoring & Auditing](#monitoring--auditing)

---

## Smart Contract Security

### 1. Access Control

**✅ Best Practices:**

```solidity
// Use role-based access control
modifier onlyJudge() {
    require(authorizedJudges[msg.sender], "Not authorized judge");
    _;
}

modifier onlyReviewer() {
    require(authorizedReviewers[msg.sender], "Not authorized reviewer");
    _;
}

// Separate admin functions
function authorizeJudge(address _judge) external onlyOwner {
    require(_judge != address(0), "Invalid address");
    authorizedJudges[_judge] = true;
}
```

**❌ Avoid:**
- Using `tx.origin` for authentication
- Missing access control on critical functions
- Overly permissive roles

### 2. Input Validation

**✅ Always Validate:**

```solidity
function submitEvidence(
    uint256 _caseId,
    string memory _metadataURI,
    EvidenceType _evidenceType,
    AccessLevel _accessLevel
) external returns (uint256) {
    // Validate case exists
    require(_caseId > 0 && _caseId <= caseCount, "Invalid case");

    // Validate non-empty strings
    require(bytes(_metadataURI).length > 0, "Empty URI");

    // Validate enum values
    require(uint8(_evidenceType) < 8, "Invalid type");
    require(uint8(_accessLevel) < 4, "Invalid level");

    // ... rest of function
}
```

**Key Validations:**
- Zero address checks
- Non-empty string validation
- Value range checks
- State verification

### 3. Reentrancy Protection

**✅ Use Check-Effects-Interactions Pattern:**

```solidity
function processEvidence(uint256 _evidenceId) external {
    // 1. Checks
    require(evidenceExists[_evidenceId], "Evidence not found");
    require(msg.sender == evidenceOwner[_evidenceId], "Not owner");

    // 2. Effects (state changes)
    evidenceProcessed[_evidenceId] = true;

    // 3. Interactions (external calls)
    // Any external calls go last
}
```

### 4. DoS Protection

**✅ Prevent Denial of Service:**

```solidity
// Avoid unbounded loops
// ❌ Bad
for (uint i = 0; i < allEvidenceIds.length; i++) {
    // Process
}

// ✅ Good - Use pagination
function getEvidenceRange(uint start, uint count)
    external view returns (uint256[] memory) {
    require(start + count <= evidenceCount, "Out of range");
    uint256[] memory result = new uint256[](count);
    for (uint i = 0; i < count; i++) {
        result[i] = evidenceIds[start + i];
    }
    return result;
}
```

**Gas Limits:**
```javascript
// hardhat.config.js
sepolia: {
  gas: "auto",
  gasPrice: "auto",
  gasMultiplier: 1.2,
  timeout: 60000
}
```

### 5. Event Emission

**✅ Emit Events for All State Changes:**

```solidity
event EvidenceSubmitted(
    uint256 indexed evidenceId,
    uint256 indexed caseId,
    address indexed submitter,
    EvidenceType evidenceType
);

function submitEvidence(...) external returns (uint256) {
    // ... logic

    emit EvidenceSubmitted(
        evidenceId,
        _caseId,
        msg.sender,
        _evidenceType
    );

    return evidenceId;
}
```

---

## Frontend Security

### 1. Environment Variables

**✅ Secure Configuration:**

```env
# .env.local (Never commit!)
PRIVATE_KEY=your_private_key_here
ETHERSCAN_API_KEY=your_api_key_here

# .env (Public variables only)
NEXT_PUBLIC_CONTRACT_ADDRESS=0x...
NEXT_PUBLIC_CHAIN_ID=11155111
```

**Rules:**
- Never commit `.env` files
- Use `NEXT_PUBLIC_` prefix for public variables
- Keep sensitive data server-side
- Use different keys for dev/prod

### 2. Input Sanitization

**✅ Validate User Input:**

```typescript
import { validateAddress, validateValueForType } from '@fhevm-toolkit/sdk';

function validateInput(address: string, value: number, type: string) {
  // Validate address
  if (!validateAddress(address)) {
    throw new Error('Invalid contract address');
  }

  // Validate value
  if (!validateValueForType(value, type)) {
    throw new Error(`Invalid value for type ${type}`);
  }

  // Sanitize strings
  const sanitized = value.toString().replace(/[^0-9]/g, '');

  return sanitized;
}
```

### 3. XSS Prevention

**✅ Prevent Cross-Site Scripting:**

```typescript
// Use React's built-in escaping
function DisplayData({ data }: { data: string }) {
  // ✅ Safe - React escapes by default
  return <div>{data}</div>;

  // ❌ Dangerous - Can execute scripts
  // return <div dangerouslySetInnerHTML={{ __html: data }} />;
}

// Sanitize user input
import DOMPurify from 'dompurify';

function sanitizeHtml(html: string) {
  return DOMPurify.sanitize(html);
}
```

### 4. CORS Configuration

**✅ Configure CORS Properly:**

```typescript
// next.config.js
module.exports = {
  async headers() {
    return [
      {
        source: '/api/:path*',
        headers: [
          { key: 'Access-Control-Allow-Origin', value: 'https://your-domain.com' },
          { key: 'Access-Control-Allow-Methods', value: 'GET,POST,OPTIONS' },
          { key: 'Access-Control-Allow-Headers', value: 'Content-Type, Authorization' }
        ]
      }
    ];
  }
};
```

### 5. Wallet Security

**✅ Secure Wallet Integration:**

```typescript
// Check wallet connection
async function connectWallet() {
  if (!window.ethereum) {
    throw new Error('No wallet detected');
  }

  try {
    // Request accounts
    const accounts = await window.ethereum.request({
      method: 'eth_requestAccounts'
    });

    // Verify network
    const chainId = await window.ethereum.request({
      method: 'eth_chainId'
    });

    if (chainId !== '0xaa36a7') { // Sepolia
      throw new Error('Wrong network');
    }

    return accounts[0];
  } catch (error) {
    console.error('Connection failed:', error);
    throw error;
  }
}
```

---

## API Security

### 1. Rate Limiting

**✅ Implement Rate Limits:**

```typescript
import rateLimit from 'express-rate-limit';

const limiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 100, // Limit each IP to 100 requests per windowMs
  message: 'Too many requests, please try again later'
});

app.use('/api/', limiter);
```

### 2. Authentication

**✅ Verify Requests:**

```typescript
import jwt from 'jsonwebtoken';

function authenticateToken(req, res, next) {
  const token = req.headers['authorization']?.split(' ')[1];

  if (!token) {
    return res.sendStatus(401);
  }

  jwt.verify(token, process.env.JWT_SECRET, (err, user) => {
    if (err) return res.sendStatus(403);
    req.user = user;
    next();
  });
}

app.post('/api/encrypt', authenticateToken, async (req, res) => {
  // Protected route
});
```

### 3. Input Validation

**✅ Validate API Inputs:**

```typescript
import { body, validationResult } from 'express-validator';

app.post('/api/encrypt',
  [
    body('value').isInt().toInt(),
    body('type').isIn(['bool', 'uint8', 'uint16', 'uint32', 'uint64']),
    body('contractAddress').isEthereumAddress()
  ],
  async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    // Process request
  }
);
```

---

## Key Management

### 1. Private Key Storage

**✅ Secure Storage:**

```bash
# Use environment variables
export PRIVATE_KEY="your_private_key"

# Use secrets management (production)
# - AWS Secrets Manager
# - Google Cloud Secret Manager
# - Azure Key Vault
# - HashiCorp Vault
```

**❌ Never:**
- Commit private keys to git
- Store keys in code
- Share keys in plaintext
- Use same key for dev/prod

### 2. Key Rotation

**✅ Regular Rotation:**

```bash
# Generate new key
openssl rand -hex 32

# Update in secrets manager
aws secretsmanager update-secret \
  --secret-id prod/private-key \
  --secret-string "new_key_here"

# Update deployment
kubectl rollout restart deployment/app
```

### 3. Multi-Signature Wallets

**✅ For Production:**

```solidity
// Use Gnosis Safe or similar
address constant MULTISIG = 0x...;

modifier onlyMultisig() {
    require(msg.sender == MULTISIG, "Not multisig");
    _;
}
```

---

## Network Security

### 1. RPC Security

**✅ Secure RPC Usage:**

```typescript
// Use authenticated RPC
const provider = new ethers.JsonRpcProvider(
  process.env.RPC_URL,
  {
    headers: {
      'Authorization': `Bearer ${process.env.RPC_API_KEY}`
    }
  }
);

// Use multiple RPC endpoints for redundancy
const providers = [
  new ethers.JsonRpcProvider(process.env.RPC_URL_1),
  new ethers.JsonRpcProvider(process.env.RPC_URL_2)
];
```

### 2. HTTPS Only

**✅ Enforce HTTPS:**

```typescript
// next.config.js
module.exports = {
  async redirects() {
    return [
      {
        source: '/:path*',
        has: [{ type: 'header', key: 'x-forwarded-proto', value: 'http' }],
        destination: 'https://your-domain.com/:path*',
        permanent: true
      }
    ];
  }
};
```

### 3. Content Security Policy

**✅ Set CSP Headers:**

```typescript
// next.config.js
module.exports = {
  async headers() {
    return [
      {
        source: '/:path*',
        headers: [
          {
            key: 'Content-Security-Policy',
            value: "default-src 'self'; script-src 'self' 'unsafe-eval' 'unsafe-inline'; style-src 'self' 'unsafe-inline';"
          }
        ]
      }
    ];
  }
};
```

---

## Monitoring & Auditing

### 1. Error Tracking

**✅ Implement Monitoring:**

```typescript
import * as Sentry from '@sentry/nextjs';

Sentry.init({
  dsn: process.env.SENTRY_DSN,
  environment: process.env.NODE_ENV
});

// Catch errors
try {
  await client.encryptInput(...);
} catch (error) {
  Sentry.captureException(error);
  throw error;
}
```

### 2. Audit Logging

**✅ Log Important Events:**

```typescript
function logAudit(action: string, user: string, data: any) {
  const log = {
    timestamp: new Date().toISOString(),
    action,
    user,
    data,
    ip: req.ip
  };

  // Send to logging service
  console.log(JSON.stringify(log));

  // Store in database
  await db.auditLogs.create(log);
}

// Usage
logAudit('EVIDENCE_SUBMITTED', userAddress, {
  caseId,
  evidenceId
});
```

### 3. Smart Contract Events

**✅ Monitor Contract Events:**

```typescript
const contract = new ethers.Contract(address, abi, provider);

// Listen for events
contract.on('EvidenceSubmitted', (evidenceId, caseId, submitter) => {
  console.log('Evidence submitted:', {
    evidenceId: evidenceId.toString(),
    caseId: caseId.toString(),
    submitter
  });

  // Alert if suspicious
  if (isSupicious(submitter)) {
    alertSecurityTeam(evidenceId);
  }
});
```

---

## Security Checklist

### Smart Contract
- [ ] Access control implemented
- [ ] Input validation complete
- [ ] Reentrancy protection
- [ ] DoS protection
- [ ] Events emitted
- [ ] Tested with 90%+ coverage
- [ ] Audited by security firm

### Frontend
- [ ] Environment variables secured
- [ ] Input sanitization
- [ ] XSS prevention
- [ ] CORS configured
- [ ] Wallet security
- [ ] HTTPS enforced
- [ ] CSP headers set

### API
- [ ] Rate limiting
- [ ] Authentication
- [ ] Input validation
- [ ] Error handling
- [ ] Logging enabled

### Keys
- [ ] Private keys secured
- [ ] Secrets manager used
- [ ] Key rotation plan
- [ ] Multi-sig for production

### Monitoring
- [ ] Error tracking
- [ ] Audit logging
- [ ] Event monitoring
- [ ] Alerting configured

---

## Incident Response

### 1. Detection

Monitor for:
- Unusual transaction patterns
- High gas usage
- Failed transactions
- Unauthorized access attempts

### 2. Response Plan

```
1. Identify the issue
2. Pause contract (if possible)
3. Assess impact
4. Notify stakeholders
5. Implement fix
6. Resume operations
7. Post-mortem analysis
```

### 3. Emergency Contacts

```typescript
// Add pause functionality
bool public paused = false;

modifier whenNotPaused() {
    require(!paused, "Contract paused");
    _;
}

function pause() external onlyOwner {
    paused = true;
    emit Paused(msg.sender);
}

function unpause() external onlyOwner {
    paused = false;
    emit Unpaused(msg.sender);
}
```

---

## Resources

- **OpenZeppelin Security**: https://docs.openzeppelin.com/contracts/security
- **Solidity Security**: https://consensys.github.io/smart-contract-best-practices/
- **OWASP Top 10**: https://owasp.org/www-project-top-ten/
- **Smart Contract Auditors**: Trail of Bits, ConsenSys Diligence, OpenZeppelin

---

## Support

For security issues:
- **Private Security Reports**: Open a private vulnerability report on GitHub
- **Public Issues**: [GitHub Issues](https://github.com/KristofferSchuppe/fhevm-react-template/issues)
- **Documentation**: [SDK Guide](./SDK_GUIDE.md)

---

*Security is not a feature, it's a requirement.*
