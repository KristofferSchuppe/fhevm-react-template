/**
 * Validation utilities
 */

import { isAddress } from 'ethers';

/**
 * Validate Ethereum address
 */
export function validateAddress(address: string): boolean {
  return isAddress(address);
}

/**
 * Validate encrypted type
 */
export function validateEncryptedType(type: string): boolean {
  const validTypes = ['bool', 'uint8', 'uint16', 'uint32', 'uint64', 'uint128', 'uint256', 'address'];
  return validTypes.includes(type);
}

/**
 * Validate value for type
 */
export function validateValueForType(value: any, type: string): boolean {
  switch (type) {
    case 'bool':
      return typeof value === 'boolean';
    case 'uint8':
      return Number.isInteger(value) && value >= 0 && value <= 255;
    case 'uint16':
      return Number.isInteger(value) && value >= 0 && value <= 65535;
    case 'uint32':
      return Number.isInteger(value) && value >= 0 && value <= 4294967295;
    case 'uint64':
    case 'uint128':
    case 'uint256':
      return typeof value === 'bigint' || (Number.isInteger(value) && value >= 0);
    case 'address':
      return typeof value === 'string' && validateAddress(value);
    default:
      return false;
  }
}

/**
 * Validate chain ID
 */
export function validateChainId(chainId: number): boolean {
  const supportedChainIds = [
    1, // Mainnet
    11155111, // Sepolia
    5, // Goerli
    80001, // Mumbai
    137 // Polygon
  ];
  return supportedChainIds.includes(chainId);
}

/**
 * Sanitize input value
 */
export function sanitizeInput(value: any, type: string): any {
  switch (type) {
    case 'bool':
      return Boolean(value);
    case 'uint8':
    case 'uint16':
    case 'uint32':
      return Number(value);
    case 'uint64':
    case 'uint128':
    case 'uint256':
      return BigInt(value);
    case 'address':
      return String(value).toLowerCase();
    default:
      return value;
  }
}
