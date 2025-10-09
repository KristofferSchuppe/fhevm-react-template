/**
 * Decryption utilities
 *
 * Functions for decrypting encrypted values with EIP-712 signatures
 */

import type { Contract } from 'ethers';
import { DecryptionError } from '../types';

/**
 * User decrypt with EIP-712 signature
 * Requires user to sign permission for decryption
 */
export async function userDecrypt(
  client: any,
  contract: Contract,
  handle: string
): Promise<bigint | boolean> {
  try {
    if (!client.initialized) {
      throw new DecryptionError('FHEVM client not initialized');
    }

    // Generate permission signature
    const permission = await client.generatePermissionSignature(
      await contract.getAddress()
    );

    // Request decryption from contract
    // This requires the contract to have a view function that returns encrypted data
    // The actual implementation depends on the contract's interface

    // Placeholder - actual implementation would call contract method
    // const encryptedValue = await contract.someDecryptMethod(handle, permission.signature);

    // For now, return a placeholder
    throw new DecryptionError('User decryption requires contract-specific implementation');
  } catch (error) {
    throw new DecryptionError(
      `User decryption failed: ${error instanceof Error ? error.message : 'Unknown error'}`
    );
  }
}

/**
 * Public decrypt (no signature required)
 * Only works for values that have been made public
 */
export async function publicDecrypt(
  contract: Contract,
  handle: string
): Promise<bigint | boolean> {
  try {
    // Call public decrypt method on contract
    // This assumes the contract has a public decrypt function

    // Placeholder - actual implementation depends on contract
    throw new DecryptionError('Public decryption requires contract-specific implementation');
  } catch (error) {
    throw new DecryptionError(
      `Public decryption failed: ${error instanceof Error ? error.message : 'Unknown error'}`
    );
  }
}

/**
 * Decrypt bool value
 */
export async function decryptBool(
  client: any,
  contract: Contract,
  handle: string,
  useUserDecrypt: boolean = true
): Promise<boolean> {
  try {
    const value = useUserDecrypt
      ? await userDecrypt(client, contract, handle)
      : await publicDecrypt(contract, handle);

    return Boolean(value);
  } catch (error) {
    throw new DecryptionError(`Failed to decrypt bool: ${error}`);
  }
}

/**
 * Decrypt uint value
 */
export async function decryptUint(
  client: any,
  contract: Contract,
  handle: string,
  useUserDecrypt: boolean = true
): Promise<bigint> {
  try {
    const value = useUserDecrypt
      ? await userDecrypt(client, contract, handle)
      : await publicDecrypt(contract, handle);

    return BigInt(value);
  } catch (error) {
    throw new DecryptionError(`Failed to decrypt uint: ${error}`);
  }
}

/**
 * Batch decrypt multiple handles
 */
export async function decryptBatch(
  client: any,
  contract: Contract,
  handles: string[],
  useUserDecrypt: boolean = true
): Promise<(bigint | boolean)[]> {
  try {
    const results = await Promise.all(
      handles.map(handle =>
        useUserDecrypt
          ? userDecrypt(client, contract, handle)
          : publicDecrypt(contract, handle)
      )
    );
    return results;
  } catch (error) {
    throw new DecryptionError(`Failed to batch decrypt: ${error}`);
  }
}
