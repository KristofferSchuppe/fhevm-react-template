/**
 * Client-side FHE Operations Library
 * Handles encryption, decryption, and client-side FHE operations using @fhevm-toolkit/sdk
 */

import { EncryptedData, FHEClientInstance, EncryptionOptions, DecryptionResult } from '@/types/fhe';
import { FHEError, FHEUintType } from './types';
import { keyManager } from './keys';

/**
 * FHE Client wrapper for @fhevm-toolkit/sdk
 * This class provides a simplified interface for FHE operations
 */
export class FHEClient implements FHEClientInstance {
  private publicKey: string | null = null;
  private initialized: boolean = false;

  /**
   * Initialize the FHE client
   */
  async initialize(): Promise<void> {
    try {
      // Generate or retrieve key pair
      const keyPair = await keyManager.getOrGenerateKeyPair();
      this.publicKey = keyPair.publicKey;
      this.initialized = true;
    } catch (error) {
      throw new FHEError('Failed to initialize FHE client', 'INIT_ERROR');
    }
  }

  /**
   * Ensure client is initialized before operations
   */
  private ensureInitialized(): void {
    if (!this.initialized) {
      throw new FHEError('FHE client not initialized', 'NOT_INITIALIZED');
    }
  }

  /**
   * Encrypt an 8-bit unsigned integer
   * @param value - Value to encrypt (0-255)
   */
  async encrypt8(value: number): Promise<EncryptedData> {
    this.ensureInitialized();

    if (value < 0 || value > 255) {
      throw new FHEError('Value must be between 0 and 255 for euint8', 'INVALID_VALUE');
    }

    return this.encrypt(value, 'euint8');
  }

  /**
   * Encrypt a 16-bit unsigned integer
   * @param value - Value to encrypt (0-65535)
   */
  async encrypt16(value: number): Promise<EncryptedData> {
    this.ensureInitialized();

    if (value < 0 || value > 65535) {
      throw new FHEError('Value must be between 0 and 65535 for euint16', 'INVALID_VALUE');
    }

    return this.encrypt(value, 'euint16');
  }

  /**
   * Encrypt a 32-bit unsigned integer
   * @param value - Value to encrypt (0-4294967295)
   */
  async encrypt32(value: number): Promise<EncryptedData> {
    this.ensureInitialized();

    if (value < 0 || value > 4294967295) {
      throw new FHEError('Value must be between 0 and 4294967295 for euint32', 'INVALID_VALUE');
    }

    return this.encrypt(value, 'euint32');
  }

  /**
   * Encrypt a 64-bit unsigned integer
   * @param value - Value to encrypt
   */
  async encrypt64(value: bigint): Promise<EncryptedData> {
    this.ensureInitialized();

    if (value < 0n) {
      throw new FHEError('Value must be non-negative for euint64', 'INVALID_VALUE');
    }

    return this.encrypt(Number(value), 'euint64');
  }

  /**
   * Generic encryption method
   * In production, this would use @fhevm-toolkit/sdk encryption
   */
  private async encrypt(value: number, type: FHEUintType): Promise<EncryptedData> {
    try {
      // Simulate encryption
      // In production, use: await fhevmClient.encrypt(value, type)
      const ciphertext = this.simulateEncryption(value);
      const handle = this.generateHandle();

      return {
        ciphertext,
        handle,
        type,
      };
    } catch (error) {
      throw new FHEError(`Failed to encrypt value as ${type}`, 'ENCRYPTION_ERROR');
    }
  }

  /**
   * Decrypt encrypted data
   * @param encrypted - Encrypted data to decrypt
   */
  async decrypt(encrypted: EncryptedData): Promise<number | bigint> {
    this.ensureInitialized();

    try {
      // Simulate decryption
      // In production, use: await fhevmClient.decrypt(encrypted)
      const plaintext = this.simulateDecryption(encrypted.ciphertext);

      return encrypted.type === 'euint64' ? BigInt(plaintext) : plaintext;
    } catch (error) {
      throw new FHEError('Failed to decrypt data', 'DECRYPTION_ERROR');
    }
  }

  /**
   * Generate a new key pair
   */
  async generateKeys() {
    return keyManager.generateKeyPair();
  }

  /**
   * Get current public key
   */
  getPublicKey(): string {
    if (!this.publicKey) {
      throw new FHEError('No public key available', 'NO_PUBLIC_KEY');
    }
    return this.publicKey;
  }

  /**
   * Serialize encrypted data for transmission
   */
  serializeEncrypted(encrypted: EncryptedData): string {
    const base64 = Buffer.from(encrypted.ciphertext).toString('base64');
    return JSON.stringify({
      ciphertext: base64,
      handle: encrypted.handle,
      type: encrypted.type,
    });
  }

  /**
   * Deserialize encrypted data from string
   */
  deserializeEncrypted(serialized: string): EncryptedData {
    const data = JSON.parse(serialized);
    return {
      ciphertext: Buffer.from(data.ciphertext, 'base64'),
      handle: data.handle,
      type: data.type,
    };
  }

  /**
   * Simulate encryption (for demo purposes)
   * In production, replace with actual @fhevm-toolkit/sdk encryption
   */
  private simulateEncryption(value: number): Uint8Array {
    const buffer = new Uint8Array(32);
    const view = new DataView(buffer.buffer);
    view.setUint32(0, value, true);

    // Add some randomness to simulate ciphertext
    for (let i = 4; i < 32; i++) {
      buffer[i] = Math.floor(Math.random() * 256);
    }

    return buffer;
  }

  /**
   * Simulate decryption (for demo purposes)
   * In production, replace with actual @fhevm-toolkit/sdk decryption
   */
  private simulateDecryption(ciphertext: Uint8Array): number {
    const view = new DataView(ciphertext.buffer);
    return view.getUint32(0, true);
  }

  /**
   * Generate a unique handle for encrypted data
   */
  private generateHandle(): string {
    return `handle_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
  }
}

// Export singleton instance
export const fheClient = new FHEClient();

/**
 * Helper function to create and initialize a new FHE client
 */
export async function createFHEClient(): Promise<FHEClient> {
  const client = new FHEClient();
  await client.initialize();
  return client;
}
