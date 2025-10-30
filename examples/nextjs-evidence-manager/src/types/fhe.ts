/**
 * FHE-related type definitions
 * These types define the structure of FHE operations, keys, and encrypted data
 */

// Encrypted data structure
export interface EncryptedData {
  ciphertext: Uint8Array;
  handle: string;
  type: 'euint8' | 'euint16' | 'euint32' | 'euint64' | 'euint128' | 'euint256';
}

// FHE key pair structure
export interface FHEKeyPair {
  publicKey: string;
  privateKey: string;
}

// FHE client instance interface
export interface FHEClientInstance {
  encrypt8(value: number): Promise<EncryptedData>;
  encrypt16(value: number): Promise<EncryptedData>;
  encrypt32(value: number): Promise<EncryptedData>;
  encrypt64(value: bigint): Promise<EncryptedData>;
  decrypt(ciphertext: EncryptedData): Promise<number | bigint>;
  generateKeys(): Promise<FHEKeyPair>;
  getPublicKey(): string;
}

// Homomorphic computation types
export type ComputationType = 'add' | 'subtract' | 'multiply' | 'divide' | 'compare';

export interface ComputationRequest {
  operation: ComputationType;
  operand1: EncryptedData;
  operand2: EncryptedData;
}

export interface ComputationResult {
  result: EncryptedData;
  operation: ComputationType;
  timestamp: number;
}

// FHE context state
export interface FHEContextState {
  isInitialized: boolean;
  publicKey: string | null;
  isLoading: boolean;
  error: string | null;
}

// Encryption options
export interface EncryptionOptions {
  type?: 'euint8' | 'euint16' | 'euint32' | 'euint64';
  useServerKey?: boolean;
}

// Decryption result
export interface DecryptionResult {
  plaintext: number | bigint | string;
  type: string;
  timestamp: number;
}

// FHE operation status
export interface FHEOperationStatus {
  status: 'idle' | 'processing' | 'completed' | 'error';
  message?: string;
  progress?: number;
}
