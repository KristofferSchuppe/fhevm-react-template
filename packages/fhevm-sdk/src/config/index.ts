/**
 * SDK Configuration
 */

/**
 * Network configurations
 */
export const NETWORK_CONFIG = {
  sepolia: {
    chainId: 11155111,
    name: 'Sepolia',
    rpcUrl: 'https://rpc.sepolia.org',
    gatewayUrl: '', // Add gateway URL if available
    aclAddress: '0x0000000000000000000000000000000000000000', // Placeholder
    explorerUrl: 'https://sepolia.etherscan.io'
  },
  mainnet: {
    chainId: 1,
    name: 'Ethereum Mainnet',
    rpcUrl: 'https://eth.llamarpc.com',
    gatewayUrl: '',
    aclAddress: '0x0000000000000000000000000000000000000000', // Placeholder
    explorerUrl: 'https://etherscan.io'
  },
  polygon: {
    chainId: 137,
    name: 'Polygon',
    rpcUrl: 'https://polygon-rpc.com',
    gatewayUrl: '',
    aclAddress: '0x0000000000000000000000000000000000000000', // Placeholder
    explorerUrl: 'https://polygonscan.com'
  }
};

/**
 * Default SDK options
 */
export const DEFAULT_OPTIONS = {
  gasLimitBuffer: 1.2,
  confirmations: 1,
  timeout: 120000
};

/**
 * Get network config by chain ID
 */
export function getNetworkConfig(chainId: number) {
  const config = Object.values(NETWORK_CONFIG).find(c => c.chainId === chainId);
  if (!config) {
    throw new Error(`Unsupported chain ID: ${chainId}`);
  }
  return config;
}
