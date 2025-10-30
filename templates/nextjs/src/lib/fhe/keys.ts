import { FhevmClient } from '@fhevm-toolkit/sdk';

export interface KeyInfo {
  publicKey: string;
  contractAddress: string;
  timestamp: number;
}

export async function getPublicKey(client: FhevmClient): Promise<string | null> {
  try {
    // Get the public key from the initialized client
    const state = await client.getState();
    return state?.publicKey || null;
  } catch (error) {
    console.error('Failed to get public key:', error);
    return null;
  }
}

export async function createPermissionSignature(
  client: FhevmClient,
  contractAddress: string
): Promise<{ signature: string; publicKey: string } | null> {
  try {
    return await client.generatePermissionSignature(contractAddress);
  } catch (error) {
    console.error('Failed to create permission signature:', error);
    return null;
  }
}

export function validateContractAddress(address: string): boolean {
  return /^0x[a-fA-F0-9]{40}$/.test(address);
}
