/**
 * Core types for FHEVM SDK
 */

import type { Signer, Provider } from 'ethers';

/**
 * FHEVM Client Configuration
 */
export interface FhevmConfig {
  provider: Provider;
  signer?: Signer;
  chainId: number;
  gatewayUrl?: string;
  aclAddress?: string;
}

/**
 * Encryption input parameters
 */
export interface EncryptionParams {
  value: number | bigint | boolean;
  type: 'bool' | 'uint8' | 'uint16' | 'uint32' | 'uint64' | 'uint128' | 'uint256' | 'address';
  contractAddress: string;
}

/**
 * Encrypted input result
 */
export interface EncryptedInput {
  handles: string[];
  inputProof: string;
}

/**
 * Decryption request parameters
 */
export interface DecryptionParams {
  handle: string;
  contractAddress: string;
}

/**
 * User decryption result (EIP-712 signature based)
 */
export interface UserDecryptionResult {
  value: bigint | boolean;
  signature: string;
}

/**
 * Public decryption result
 */
export interface PublicDecryptionResult {
  value: bigint | boolean;
}

/**
 * Contract interaction options
 */
export interface ContractOptions {
  address: string;
  abi: any[];
  signer?: Signer;
}

/**
 * FHEVM instance state
 */
export interface FhevmInstanceState {
  instance: any | null;
  publicKey: string | null;
  isInitialized: boolean;
}

/**
 * Permission signature for decryption
 */
export interface PermissionSignature {
  signature: string;
  publicKey: string;
}

/**
 * Encrypted type enums
 */
export enum EncryptedType {
  EBOOL = 'ebool',
  EUINT8 = 'euint8',
  EUINT16 = 'euint16',
  EUINT32 = 'euint32',
  EUINT64 = 'euint64',
  EUINT128 = 'euint128',
  EUINT256 = 'euint256',
  EADDRESS = 'eaddress'
}

/**
 * SDK Error types
 */
export class FhevmError extends Error {
  constructor(message: string) {
    super(message);
    this.name = 'FhevmError';
  }
}

export class EncryptionError extends FhevmError {
  constructor(message: string) {
    super(message);
    this.name = 'EncryptionError';
  }
}

export class DecryptionError extends FhevmError {
  constructor(message: string) {
    super(message);
    this.name = 'DecryptionError';
  }
}

export class InitializationError extends FhevmError {
  constructor(message: string) {
    super(message);
    this.name = 'InitializationError';
  }
}
