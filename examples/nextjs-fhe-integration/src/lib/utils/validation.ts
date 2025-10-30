import { FHEDataType } from '../fhe/types';

export function validateValue(value: any, type: FHEDataType): boolean {
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
      return Number.isInteger(value) && value >= 0;
    case 'uint128':
    case 'uint256':
      return typeof value === 'bigint' || (Number.isInteger(value) && value >= 0);
    case 'address':
      return /^0x[a-fA-F0-9]{40}$/.test(value);
    default:
      return false;
  }
}

export function validateContractAddress(address: string): boolean {
  return /^0x[a-fA-F0-9]{40}$/.test(address);
}

export function validateChainId(chainId: number): boolean {
  return Number.isInteger(chainId) && chainId > 0;
}
