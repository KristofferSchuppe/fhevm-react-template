export interface APIResponse<T = any> {
  success: boolean;
  data?: T;
  error?: string;
}

export interface EncryptRequest {
  value: number | boolean | string;
  type: string;
  contractAddress: string;
}

export interface DecryptRequest {
  encryptedData: string;
  contractAddress: string;
}

export interface ComputeRequest {
  operation: string;
  operands: number[];
}

export interface KeysResponse {
  publicKey: string;
  timestamp: number;
}
