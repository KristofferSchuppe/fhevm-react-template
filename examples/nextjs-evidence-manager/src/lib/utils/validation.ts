/**
 * Validation utility functions
 * Provides helper functions for data validation
 */

import { EncryptedData } from '@/types/fhe';

/**
 * Validate if value is a valid number
 */
export function isValidNumber(value: any): boolean {
  return typeof value === 'number' && !isNaN(value) && isFinite(value);
}

/**
 * Validate if value is a valid integer
 */
export function isValidInteger(value: any): boolean {
  return isValidNumber(value) && Number.isInteger(value);
}

/**
 * Validate if value fits in uint8 (0-255)
 */
export function isValidUint8(value: number): boolean {
  return isValidInteger(value) && value >= 0 && value <= 255;
}

/**
 * Validate if value fits in uint16 (0-65535)
 */
export function isValidUint16(value: number): boolean {
  return isValidInteger(value) && value >= 0 && value <= 65535;
}

/**
 * Validate if value fits in uint32 (0-4294967295)
 */
export function isValidUint32(value: number): boolean {
  return isValidInteger(value) && value >= 0 && value <= 4294967295;
}

/**
 * Validate if value fits in uint64
 */
export function isValidUint64(value: bigint): boolean {
  return typeof value === 'bigint' && value >= 0n;
}

/**
 * Validate encrypted data structure
 */
export function isValidEncryptedData(data: any): data is EncryptedData {
  return (
    data &&
    typeof data === 'object' &&
    data.ciphertext instanceof Uint8Array &&
    typeof data.handle === 'string' &&
    typeof data.type === 'string' &&
    ['euint8', 'euint16', 'euint32', 'euint64', 'euint128', 'euint256'].includes(data.type)
  );
}

/**
 * Validate API request payload
 */
export function isValidApiRequest(payload: any): boolean {
  return payload && typeof payload === 'object';
}

/**
 * Validate email format
 */
export function isValidEmail(email: string): boolean {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
}

/**
 * Validate hex string
 */
export function isValidHexString(str: string): boolean {
  return /^0x[0-9A-Fa-f]*$/.test(str);
}

/**
 * Validate that string is not empty
 */
export function isNonEmptyString(str: any): boolean {
  return typeof str === 'string' && str.trim().length > 0;
}

/**
 * Validate array has elements
 */
export function isNonEmptyArray(arr: any): boolean {
  return Array.isArray(arr) && arr.length > 0;
}

/**
 * Validate computation type
 */
export function isValidComputationType(type: string): boolean {
  return ['add', 'subtract', 'multiply', 'divide', 'compare'].includes(type);
}

/**
 * Validate FHE uint type
 */
export function isValidFHEUintType(type: string): boolean {
  return ['euint8', 'euint16', 'euint32', 'euint64', 'euint128', 'euint256'].includes(type);
}

/**
 * Sanitize and validate numeric input
 */
export function sanitizeNumericInput(input: string): number | null {
  const cleaned = input.trim().replace(/[^\d.-]/g, '');
  const num = Number(cleaned);

  if (isValidNumber(num)) {
    return num;
  }

  return null;
}

/**
 * Validate value for specific FHE type
 */
export function isValidForFHEType(value: number | bigint, type: string): boolean {
  switch (type) {
    case 'euint8':
      return typeof value === 'number' && isValidUint8(value);
    case 'euint16':
      return typeof value === 'number' && isValidUint16(value);
    case 'euint32':
      return typeof value === 'number' && isValidUint32(value);
    case 'euint64':
      return typeof value === 'bigint' && isValidUint64(value);
    default:
      return false;
  }
}

/**
 * Validate JSON string
 */
export function isValidJSON(str: string): boolean {
  try {
    JSON.parse(str);
    return true;
  } catch {
    return false;
  }
}

/**
 * Create validation result object
 */
export interface ValidationResult {
  valid: boolean;
  error?: string;
}

/**
 * Validate multiple conditions and return result
 */
export function validateConditions(
  conditions: Array<{ check: boolean; error: string }>
): ValidationResult {
  for (const condition of conditions) {
    if (!condition.check) {
      return {
        valid: false,
        error: condition.error,
      };
    }
  }

  return { valid: true };
}

/**
 * Validate input length
 */
export function isValidLength(str: string, min: number, max: number): boolean {
  const length = str.length;
  return length >= min && length <= max;
}

/**
 * Validate URL format
 */
export function isValidUrl(url: string): boolean {
  try {
    new URL(url);
    return true;
  } catch {
    return false;
  }
}
