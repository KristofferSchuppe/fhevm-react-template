/**
 * FHE Key Management Library
 * Handles generation, storage, and retrieval of FHE keys
 */

import { FHEKeyPair } from '@/types/fhe';
import { FHEError, KeyManagerConfig } from './types';

const DEFAULT_STORAGE_KEY = 'fhe_keypair';
const DEFAULT_EXPIRATION_TIME = 24 * 60 * 60 * 1000; // 24 hours

export class KeyManager {
  private config: KeyManagerConfig;

  constructor(config: KeyManagerConfig = {}) {
    this.config = {
      storageKey: config.storageKey || DEFAULT_STORAGE_KEY,
      expirationTime: config.expirationTime || DEFAULT_EXPIRATION_TIME,
    };
  }

  /**
   * Generate a new FHE key pair
   * In a real implementation, this would use the @fhevm-toolkit/sdk
   */
  async generateKeyPair(): Promise<FHEKeyPair> {
    try {
      // Simulate key generation
      // In production, use @fhevm-toolkit/sdk key generation
      const publicKey = this.generateRandomKey(64);
      const privateKey = this.generateRandomKey(64);

      const keyPair: FHEKeyPair = {
        publicKey,
        privateKey,
      };

      // Store the key pair
      this.storeKeyPair(keyPair);

      return keyPair;
    } catch (error) {
      throw new FHEError('Failed to generate key pair', 'KEY_GENERATION_ERROR');
    }
  }

  /**
   * Store key pair in local storage
   */
  private storeKeyPair(keyPair: FHEKeyPair): void {
    if (typeof window === 'undefined') return;

    const storageData = {
      keyPair,
      timestamp: Date.now(),
    };

    try {
      localStorage.setItem(this.config.storageKey!, JSON.stringify(storageData));
    } catch (error) {
      console.error('Failed to store key pair:', error);
    }
  }

  /**
   * Retrieve key pair from local storage
   */
  getStoredKeyPair(): FHEKeyPair | null {
    if (typeof window === 'undefined') return null;

    try {
      const stored = localStorage.getItem(this.config.storageKey!);
      if (!stored) return null;

      const { keyPair, timestamp } = JSON.parse(stored);

      // Check if key pair has expired
      if (Date.now() - timestamp > this.config.expirationTime!) {
        this.clearStoredKeyPair();
        return null;
      }

      return keyPair;
    } catch (error) {
      console.error('Failed to retrieve key pair:', error);
      return null;
    }
  }

  /**
   * Clear stored key pair
   */
  clearStoredKeyPair(): void {
    if (typeof window === 'undefined') return;

    try {
      localStorage.removeItem(this.config.storageKey!);
    } catch (error) {
      console.error('Failed to clear key pair:', error);
    }
  }

  /**
   * Get or generate a key pair
   */
  async getOrGenerateKeyPair(): Promise<FHEKeyPair> {
    const stored = this.getStoredKeyPair();
    if (stored) return stored;

    return this.generateKeyPair();
  }

  /**
   * Generate a random key (helper method)
   */
  private generateRandomKey(length: number): string {
    const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
    let result = '';
    for (let i = 0; i < length; i++) {
      result += chars.charAt(Math.floor(Math.random() * chars.length));
    }
    return result;
  }

  /**
   * Export public key only
   */
  async exportPublicKey(): Promise<string> {
    const keyPair = await this.getOrGenerateKeyPair();
    return keyPair.publicKey;
  }

  /**
   * Validate key pair format
   */
  validateKeyPair(keyPair: FHEKeyPair): boolean {
    return !!(
      keyPair &&
      keyPair.publicKey &&
      keyPair.privateKey &&
      typeof keyPair.publicKey === 'string' &&
      typeof keyPair.privateKey === 'string'
    );
  }
}

// Export singleton instance
export const keyManager = new KeyManager();
