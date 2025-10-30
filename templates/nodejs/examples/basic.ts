import { FhevmClient } from '@fhevm-toolkit/sdk';
import { ethers } from 'ethers';
import dotenv from 'dotenv';

dotenv.config();

/**
 * Basic FHEVM SDK Usage Example
 *
 * This example demonstrates:
 * 1. Initializing the FHEVM client
 * 2. Checking initialization status
 * 3. Getting client state
 */

async function basicExample() {
  console.log('📚 Basic FHEVM SDK Example\n');

  try {
    // Setup provider and signer
    const provider = new ethers.JsonRpcProvider(process.env.RPC_URL!);
    const signer = new ethers.Wallet(process.env.PRIVATE_KEY!, provider);

    // Create and initialize client
    const client = new FhevmClient({
      provider,
      signer,
      chainId: parseInt(process.env.CHAIN_ID || '11155111'),
    });

    console.log('⏳ Initializing client...');
    await client.init();
    console.log('✅ Client initialized\n');

    // Get client state
    const state = await client.getState();
    console.log('📊 Client State:');
    console.log('  - Public Key:', state.publicKey ? 'Available' : 'Not available');
    console.log('  - Chain ID:', state.chainId);
    console.log('  - Initialized:', state.isInitialized);

    console.log('\n✨ Basic example completed!');
  } catch (error) {
    console.error('❌ Error:', error);
    throw error;
  }
}

basicExample();
