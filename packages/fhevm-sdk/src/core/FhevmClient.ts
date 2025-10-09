/**
 * FHEVM Client - Core class for FHEVM operations
 *
 * Provides a unified interface for:
 * - Instance initialization
 * - Encryption/Decryption
 * - Contract interactions
 * - Permission management
 */

import { createInstance, FhevmInstance } from 'fhevmjs';
import type { Signer, Provider } from 'ethers';
import type {
  FhevmConfig,
  EncryptionParams,
  EncryptedInput,
  DecryptionParams,
  FhevmInstanceState,
  PermissionSignature
} from '../types';
import { InitializationError, EncryptionError } from '../types';

export class FhevmClient {
  private config: FhevmConfig;
  private instance: FhevmInstance | null = null;
  private publicKey: string | null = null;
  private isInitialized: boolean = false;

  constructor(config: FhevmConfig) {
    this.config = config;
  }

  /**
   * Initialize FHEVM instance
   * Fetches public key and creates encryption instance
   */
  async init(): Promise<void> {
    try {
      // Get ACL contract address (network-specific)
      const aclAddress = this.config.aclAddress || await this.getACLAddress();

      // Create FHEVM instance
      this.instance = await createInstance({
        chainId: this.config.chainId,
        publicKeyVerifier: aclAddress,
        gatewayUrl: this.config.gatewayUrl
      });

      // Get public key
      this.publicKey = this.instance.getPublicKey();
      this.isInitialized = true;

      console.log('✅ FHEVM Client initialized');
    } catch (error) {
      throw new InitializationError(
        `Failed to initialize FHEVM: ${error instanceof Error ? error.message : 'Unknown error'}`
      );
    }
  }

  /**
   * Get ACL contract address for the network
   */
  private async getACLAddress(): Promise<string> {
    // Network-specific ACL addresses
    const aclAddresses: Record<number, string> = {
      11155111: '0x0000000000000000000000000000000000000000', // Sepolia (placeholder)
      1: '0x0000000000000000000000000000000000000000', // Mainnet (placeholder)
    };

    return aclAddresses[this.config.chainId] || '0x0000000000000000000000000000000000000000';
  }

  /**
   * Encrypt input value
   */
  async encryptInput(params: EncryptionParams): Promise<EncryptedInput> {
    if (!this.isInitialized || !this.instance) {
      throw new EncryptionError('FHEVM not initialized. Call init() first.');
    }

    try {
      const input = this.instance.createEncryptedInput(
        params.contractAddress,
        this.config.signer ? await this.config.signer.getAddress() : undefined
      );

      // Add value based on type
      switch (params.type) {
        case 'bool':
          input.addBool(Boolean(params.value));
          break;
        case 'uint8':
          input.add8(BigInt(params.value));
          break;
        case 'uint16':
          input.add16(BigInt(params.value));
          break;
        case 'uint32':
          input.add32(BigInt(params.value));
          break;
        case 'uint64':
          input.add64(BigInt(params.value));
          break;
        case 'uint128':
          input.add128(BigInt(params.value));
          break;
        case 'uint256':
          input.add256(BigInt(params.value));
          break;
        case 'address':
          input.addAddress(String(params.value));
          break;
        default:
          throw new EncryptionError(`Unsupported type: ${params.type}`);
      }

      // Encrypt and return
      const encrypted = input.encrypt();

      return {
        handles: encrypted.handles,
        inputProof: encrypted.inputProof
      };
    } catch (error) {
      throw new EncryptionError(
        `Encryption failed: ${error instanceof Error ? error.message : 'Unknown error'}`
      );
    }
  }

  /**
   * Generate permission signature for decryption (EIP-712)
   */
  async generatePermissionSignature(
    contractAddress: string
  ): Promise<PermissionSignature> {
    if (!this.config.signer) {
      throw new Error('Signer required for permission signature');
    }

    if (!this.instance) {
      throw new InitializationError('FHEVM not initialized');
    }

    try {
      const signature = await this.instance.generatePermit({
        verifyingContract: contractAddress,
        signer: this.config.signer
      });

      return {
        signature: signature.signature,
        publicKey: this.publicKey || ''
      };
    } catch (error) {
      throw new Error(
        `Failed to generate permission: ${error instanceof Error ? error.message : 'Unknown error'}`
      );
    }
  }

  /**
   * Get current instance state
   */
  getState(): FhevmInstanceState {
    return {
      instance: this.instance,
      publicKey: this.publicKey,
      isInitialized: this.isInitialized
    };
  }

  /**
   * Get FHEVM instance (for advanced usage)
   */
  getInstance(): FhevmInstance | null {
    return this.instance;
  }

  /**
   * Get public key
   */
  getPublicKey(): string | null {
    return this.publicKey;
  }

  /**
   * Check if initialized
   */
  get initialized(): boolean {
    return this.isInitialized;
  }
}
