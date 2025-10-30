export function sanitizeInput(input: string): string {
  return input.replace(/[<>\"']/g, '');
}

export function validateAddress(address: string): boolean {
  return /^0x[a-fA-F0-9]{40}$/.test(address);
}

export function validateChainId(chainId: number): boolean {
  const supportedChainIds = [1, 11155111]; // Mainnet, Sepolia
  return supportedChainIds.includes(chainId);
}

export function isValidEncryptionType(type: string): boolean {
  const validTypes = ['bool', 'uint8', 'uint16', 'uint32', 'uint64', 'uint128', 'uint256', 'address'];
  return validTypes.includes(type);
}

export function hashData(data: string): string {
  // Simple hash function for demonstration
  let hash = 0;
  for (let i = 0; i < data.length; i++) {
    const char = data.charCodeAt(i);
    hash = (hash << 5) - hash + char;
    hash = hash & hash;
  }
  return hash.toString(16);
}
