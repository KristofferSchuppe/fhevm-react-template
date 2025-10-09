/**
 * Encryption utilities
 *
 * Standalone functions for encrypting values
 */

import type { EncryptionParams, EncryptedInput } from '../types';
import { EncryptionError } from '../types';

/**
 * Encrypt a boolean value
 */
export async function encryptBool(
  client: any,
  value: boolean,
  contractAddress: string
): Promise<EncryptedInput> {
  try {
    return await client.encryptInput({
      value,
      type: 'bool',
      contractAddress
    } as EncryptionParams);
  } catch (error) {
    throw new EncryptionError(`Failed to encrypt bool: ${error}`);
  }
}

/**
 * Encrypt a uint8 value
 */
export async function encryptUint8(
  client: any,
  value: number | bigint,
  contractAddress: string
): Promise<EncryptedInput> {
  try {
    return await client.encryptInput({
      value,
      type: 'uint8',
      contractAddress
    } as EncryptionParams);
  } catch (error) {
    throw new EncryptionError(`Failed to encrypt uint8: ${error}`);
  }
}

/**
 * Encrypt a uint16 value
 */
export async function encryptUint16(
  client: any,
  value: number | bigint,
  contractAddress: string
): Promise<EncryptedInput> {
  try {
    return await client.encryptInput({
      value,
      type: 'uint16',
      contractAddress
    } as EncryptionParams);
  } catch (error) {
    throw new EncryptionError(`Failed to encrypt uint16: ${error}`);
  }
}

/**
 * Encrypt a uint32 value
 */
export async function encryptUint32(
  client: any,
  value: number | bigint,
  contractAddress: string
): Promise<EncryptedInput> {
  try {
    return await client.encryptInput({
      value,
      type: 'uint32',
      contractAddress
    } as EncryptionParams);
  } catch (error) {
    throw new EncryptionError(`Failed to encrypt uint32: ${error}`);
  }
}

/**
 * Encrypt a uint64 value
 */
export async function encryptUint64(
  client: any,
  value: number | bigint,
  contractAddress: string
): Promise<EncryptedInput> {
  try {
    return await client.encryptInput({
      value,
      type: 'uint64',
      contractAddress
    } as EncryptionParams);
  } catch (error) {
    throw new EncryptionError(`Failed to encrypt uint64: ${error}`);
  }
}

/**
 * Encrypt an address value
 */
export async function encryptAddress(
  client: any,
  value: string,
  contractAddress: string
): Promise<EncryptedInput> {
  try {
    return await client.encryptInput({
      value,
      type: 'address',
      contractAddress
    } as EncryptionParams);
  } catch (error) {
    throw new EncryptionError(`Failed to encrypt address: ${error}`);
  }
}

/**
 * Batch encrypt multiple values
 */
export async function encryptBatch(
  client: any,
  params: EncryptionParams[]
): Promise<EncryptedInput[]> {
  try {
    const results = await Promise.all(
      params.map(param => client.encryptInput(param))
    );
    return results;
  } catch (error) {
    throw new EncryptionError(`Failed to batch encrypt: ${error}`);
  }
}
