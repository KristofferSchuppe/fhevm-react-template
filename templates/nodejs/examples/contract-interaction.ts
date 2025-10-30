import { FhevmClient } from '@fhevm-toolkit/sdk';
import { ethers } from 'ethers';
import dotenv from 'dotenv';

dotenv.config();

/**
 * Contract Interaction Example
 *
 * This example demonstrates:
 * 1. Encrypting values for contract calls
 * 2. Generating permission signatures
 * 3. Preparing encrypted data for transactions
 */

async function contractInteractionExample() {
  console.log('🤝 Contract Interaction Example\n');

  try {
    // Setup
    const provider = new ethers.JsonRpcProvider(process.env.RPC_URL!);
    const signer = new ethers.Wallet(process.env.PRIVATE_KEY!, provider);
    const contractAddress = process.env.CONTRACT_ADDRESS || '0x0000000000000000000000000000000000000000';

    // Initialize client
    const client = new FhevmClient({
      provider,
      signer,
      chainId: parseInt(process.env.CHAIN_ID || '11155111'),
    });

    await client.init();
    console.log('✅ Client initialized\n');

    // Encrypt value for contract call
    console.log('🔒 Preparing encrypted data for contract...');
    const encryptedValue = await client.encryptInput({
      value: 42,
      type: 'uint32',
      contractAddress,
    });

    console.log('📝 Encrypted data ready for transaction:');
    console.log('  - Handle:', encryptedValue.handles[0].substring(0, 30) + '...');
    console.log('  - Input Proof length:', encryptedValue.inputProof.length, 'bytes');

    // Generate permission signature
    console.log('\n🔑 Generating permission for decryption...');
    const permission = await client.generatePermissionSignature(contractAddress);

    console.log('✅ Permission signature generated:');
    console.log('  - Public Key:', permission.publicKey.substring(0, 30) + '...');
    console.log('  - Signature:', permission.signature.substring(0, 30) + '...');

    // Example contract ABI (simplified)
    const contractABI = [
      'function submitEncryptedValue(bytes32 handle, bytes calldata inputProof) external',
    ];

    const contract = new ethers.Contract(contractAddress, contractABI, signer);

    console.log('\n📄 Contract call ready:');
    console.log('  contract.submitEncryptedValue(');
    console.log(`    "${encryptedValue.handles[0].substring(0, 20)}...",`);
    console.log(`    "${encryptedValue.inputProof.substring(0, 20)}..."`);
    console.log('  )');

    console.log('\n✨ Contract interaction example completed!');
    console.log('💡 Note: Actual transaction not sent in this example');
  } catch (error) {
    console.error('❌ Error:', error);
    throw error;
  }
}

contractInteractionExample();
