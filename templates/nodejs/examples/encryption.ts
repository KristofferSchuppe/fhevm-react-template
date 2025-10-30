import { FhevmClient } from '@fhevm-toolkit/sdk';
import { ethers } from 'ethers';
import dotenv from 'dotenv';

dotenv.config();

/**
 * Encryption Example
 *
 * This example demonstrates:
 * 1. Encrypting different data types
 * 2. Handling encryption results
 * 3. Working with multiple values
 */

async function encryptionExample() {
  console.log('🔐 Encryption Example\n');

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

    // Encrypt different types
    console.log('📦 Encrypting uint32...');
    const encryptedUint32 = await client.encryptInput({
      value: 100,
      type: 'uint32',
      contractAddress,
    });
    console.log('  ✓ Encrypted uint32:', encryptedUint32.handles[0].substring(0, 20) + '...');

    console.log('\n📦 Encrypting uint64...');
    const encryptedUint64 = await client.encryptInput({
      value: 1000000,
      type: 'uint64',
      contractAddress,
    });
    console.log('  ✓ Encrypted uint64:', encryptedUint64.handles[0].substring(0, 20) + '...');

    console.log('\n📦 Encrypting boolean...');
    const encryptedBool = await client.encryptInput({
      value: true,
      type: 'bool',
      contractAddress,
    });
    console.log('  ✓ Encrypted bool:', encryptedBool.handles[0].substring(0, 20) + '...');

    console.log('\n✨ Encryption example completed!');
  } catch (error) {
    console.error('❌ Error:', error);
    throw error;
  }
}

encryptionExample();
