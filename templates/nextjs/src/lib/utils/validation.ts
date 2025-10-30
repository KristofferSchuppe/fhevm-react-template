export function validateNumber(value: any): boolean {
  return typeof value === 'number' && !isNaN(value) && isFinite(value);
}

export function validateBoolean(value: any): boolean {
  return typeof value === 'boolean';
}

export function validateString(value: any): boolean {
  return typeof value === 'string' && value.length > 0;
}

export function validateUint(value: number, bits: number): boolean {
  if (!validateNumber(value)) return false;
  if (value < 0) return false;

  const maxValue = Math.pow(2, bits) - 1;
  return value <= maxValue;
}

export function validateAddress(address: string): boolean {
  return /^0x[a-fA-F0-9]{40}$/.test(address);
}

export interface ValidationResult {
  isValid: boolean;
  error?: string;
}

export function validateEncryptionInput(
  value: any,
  type: string,
  contractAddress: string
): ValidationResult {
  if (!validateAddress(contractAddress)) {
    return { isValid: false, error: 'Invalid contract address' };
  }

  switch (type) {
    case 'bool':
      if (!validateBoolean(value)) {
        return { isValid: false, error: 'Value must be boolean' };
      }
      break;
    case 'uint8':
      if (!validateUint(value, 8)) {
        return { isValid: false, error: 'Value must be uint8 (0-255)' };
      }
      break;
    case 'uint16':
      if (!validateUint(value, 16)) {
        return { isValid: false, error: 'Value must be uint16 (0-65535)' };
      }
      break;
    case 'uint32':
      if (!validateUint(value, 32)) {
        return { isValid: false, error: 'Value must be uint32' };
      }
      break;
    case 'uint64':
    case 'uint128':
    case 'uint256':
      if (!validateNumber(value) || value < 0) {
        return { isValid: false, error: `Value must be positive ${type}` };
      }
      break;
    case 'address':
      if (!validateAddress(value)) {
        return { isValid: false, error: 'Invalid Ethereum address' };
      }
      break;
    default:
      return { isValid: false, error: 'Unsupported encryption type' };
  }

  return { isValid: true };
}
