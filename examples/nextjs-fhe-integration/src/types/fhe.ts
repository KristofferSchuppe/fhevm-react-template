export type FHEType =
  | 'bool'
  | 'uint8'
  | 'uint16'
  | 'uint32'
  | 'uint64'
  | 'uint128'
  | 'uint256'
  | 'address';

export interface FHEConfig {
  chainId: number;
  gatewayUrl?: string;
  aclAddress?: string;
}

export interface EncryptionResult {
  handles: string[];
  inputProof: string;
}

export interface DecryptionParams {
  encryptedData: string;
  contractAddress: string;
}
