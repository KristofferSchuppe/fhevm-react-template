/**
 * API type definitions
 * These types define the structure of API requests and responses
 */

import { EncryptedData, ComputationType } from './fhe';

// Generic API response structure
export interface ApiResponse<T = any> {
  success: boolean;
  data?: T;
  error?: string;
  message?: string;
}

// Encryption API request
export interface EncryptionRequest {
  value: number | string;
  type?: 'euint8' | 'euint16' | 'euint32' | 'euint64';
}

// Encryption API response
export interface EncryptionResponse {
  encrypted: {
    ciphertext: string; // Base64 encoded
    handle: string;
    type: string;
  };
  publicKey: string;
}

// Decryption API request
export interface DecryptionRequest {
  ciphertext: string; // Base64 encoded
  handle: string;
  type: string;
}

// Decryption API response
export interface DecryptionResponse {
  plaintext: number | string;
  type: string;
}

// Computation API request
export interface ComputationRequest {
  operation: ComputationType;
  operand1: {
    ciphertext: string;
    handle: string;
    type: string;
  };
  operand2: {
    ciphertext: string;
    handle: string;
    type: string;
  };
}

// Computation API response
export interface ComputationResponse {
  result: {
    ciphertext: string;
    handle: string;
    type: string;
  };
  operation: string;
}

// Key generation response
export interface KeyGenerationResponse {
  publicKey: string;
  timestamp: number;
}

// FHE initialization request
export interface FHEInitRequest {
  regenerateKeys?: boolean;
}

// FHE initialization response
export interface FHEInitResponse {
  initialized: boolean;
  publicKey: string;
  version: string;
}

// Error response structure
export interface ErrorResponse {
  error: string;
  details?: string;
  code?: string;
  timestamp: number;
}
