export type FHEType = 'bool' | 'uint8' | 'uint16' | 'uint32' | 'uint64' | 'uint128' | 'uint256' | 'address';

export interface EncryptionInput {
  value: number | boolean | string;
  type: FHEType;
  contractAddress: string;
}

export interface EncryptionResult {
  handles: string[];
  inputProof: string;
}

export interface DecryptionInput {
  handle: string;
  contractAddress: string;
  signature: string;
}

export interface FHEState {
  isInitialized: boolean;
  publicKey: string | null;
  chainId: number | null;
}

export interface PermissionSignature {
  signature: string;
  publicKey: string;
}
