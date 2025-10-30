import { FhevmClient } from '@fhevm-toolkit/sdk';
import { ethers } from 'ethers';
import dotenv from 'dotenv';

dotenv.config();

async function main() {
  console.log('🚀 FHEVM Node.js Template');
  console.log('========================\n');

  try {
    // Initialize provider and signer
    const provider = new ethers.JsonRpcProvider(
      process.env.RPC_URL || 'https://sepolia.infura.io/v3/YOUR_KEY'
    );

    const privateKey = process.env.PRIVATE_KEY;
    if (!privateKey) {
      throw new Error('PRIVATE_KEY environment variable is required');
    }

    const signer = new ethers.Wallet(privateKey, provider);
    console.log(`📝 Wallet Address: ${await signer.getAddress()}\n`);

    // Initialize FHEVM client
    console.log('🔐 Initializing FHEVM client...');
    const client = new FhevmClient({
      provider,
      signer,
      chainId: parseInt(process.env.CHAIN_ID || '11155111'),
    });

    await client.init();
    console.log('✅ FHEVM client initialized successfully\n');

    // Example: Encrypt a value
    const contractAddress = process.env.CONTRACT_ADDRESS || '0x0000000000000000000000000000000000000000';
    console.log(`📦 Contract Address: ${contractAddress}`);
    console.log('🔒 Encrypting value...');

    const encrypted = await client.encryptInput({
      value: 42,
      type: 'uint32',
      contractAddress,
    });

    console.log('✅ Encryption successful!');
    console.log('📄 Encrypted handles:', encrypted.handles);
    console.log('📝 Input proof length:', encrypted.inputProof.length);

    // Generate permission signature
    console.log('\n🔑 Generating permission signature...');
    const permission = await client.generatePermissionSignature(contractAddress);
    console.log('✅ Permission signature generated');
    console.log('🔓 Public key:', permission.publicKey.substring(0, 20) + '...');
    console.log('✍️  Signature:', permission.signature.substring(0, 20) + '...');

    console.log('\n✨ Demo completed successfully!');
  } catch (error) {
    console.error('❌ Error:', error instanceof Error ? error.message : error);
    process.exit(1);
  }
}

main();
