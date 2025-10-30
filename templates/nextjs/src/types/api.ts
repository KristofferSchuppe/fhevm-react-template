export interface APIResponse<T = any> {
  success: boolean;
  data?: T;
  error?: string;
  timestamp?: string;
}

export interface EncryptAPIRequest {
  value: any;
  type: string;
  contractAddress: string;
}

export interface DecryptAPIRequest {
  encryptedValue: any;
  signature: string;
}

export interface ComputeAPIRequest {
  operation: string;
  operands: any[];
}

export interface KeyAPIRequest {
  action: string;
  contractAddress: string;
}
