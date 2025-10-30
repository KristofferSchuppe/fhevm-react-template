export type FHEDataType =
  | 'bool'
  | 'uint8'
  | 'uint16'
  | 'uint32'
  | 'uint64'
  | 'uint128'
  | 'uint256'
  | 'address';

export interface EncryptedData {
  handles: string[];
  inputProof: string;
}

export interface EncryptionParams {
  value: number | boolean | string;
  type: FHEDataType;
  contractAddress: string;
}

export interface DecryptionResult {
  value: number | boolean | string;
  type: FHEDataType;
}

export interface FHEClientConfig {
  chainId?: number;
  gatewayUrl?: string;
  aclAddress?: string;
}
