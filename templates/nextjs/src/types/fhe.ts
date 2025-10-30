export type FHEType = 'bool' | 'uint8' | 'uint16' | 'uint32' | 'uint64' | 'uint128' | 'uint256' | 'address';

export interface FHEClientConfig {
  provider: any;
  signer: any;
  chainId: number;
  gatewayUrl?: string;
  aclAddress?: string;
}

export interface EncryptionParams {
  value: number | boolean | string;
  type: FHEType;
  contractAddress: string;
}

export interface EncryptionResult {
  handles: string[];
  inputProof: string;
}

export interface PermissionSignature {
  signature: string;
  publicKey: string;
}
