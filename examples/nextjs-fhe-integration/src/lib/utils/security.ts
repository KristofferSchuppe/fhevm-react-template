export function validateAddress(address: string): boolean {
  return /^0x[a-fA-F0-9]{40}$/.test(address);
}

export function sanitizeInput(input: string): string {
  return input.replace(/[^\w\s.-]/g, '');
}

export function hashData(data: string): string {
  // Simple hash simulation - in production use proper crypto
  return '0x' + Buffer.from(data).toString('hex');
}

export function verifySignature(
  message: string,
  signature: string,
  address: string
): boolean {
  // Simulate signature verification
  return signature.length > 0 && validateAddress(address);
}
