/**
 * FHE library type definitions
 * Internal types used by the FHE library implementation
 */

export type FHEUintType = 'euint8' | 'euint16' | 'euint32' | 'euint64' | 'euint128' | 'euint256';

export interface SerializedCiphertext {
  data: string; // Base64 encoded
  type: FHEUintType;
}

export interface FHEConfig {
  serverUrl?: string;
  networkId?: number;
  defaultType?: FHEUintType;
}

export interface KeyManagerConfig {
  storageKey?: string;
  expirationTime?: number;
}

export class FHEError extends Error {
  code: string;

  constructor(message: string, code: string = 'FHE_ERROR') {
    super(message);
    this.name = 'FHEError';
    this.code = code;
  }
}
