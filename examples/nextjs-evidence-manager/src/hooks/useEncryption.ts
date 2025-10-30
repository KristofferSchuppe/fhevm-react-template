/**
 * useEncryption Hook
 * Simplified hook for encryption/decryption operations
 */

'use client';

import { useState, useCallback } from 'react';
import { EncryptedData } from '@/types/fhe';
import { useFHE } from './useFHE';

interface EncryptionState {
  isEncrypting: boolean;
  isDecrypting: boolean;
  error: string | null;
  lastEncrypted: EncryptedData | null;
  lastDecrypted: number | bigint | null;
}

export function useEncryption() {
  const { encrypt: fheEncrypt, decrypt: fheDecrypt, isInitialized } = useFHE();

  const [state, setState] = useState<EncryptionState>({
    isEncrypting: false,
    isDecrypting: false,
    error: null,
    lastEncrypted: null,
    lastDecrypted: null,
  });

  /**
   * Encrypt a value with loading state management
   */
  const encrypt = useCallback(
    async (value: number, type: 'euint8' | 'euint16' | 'euint32' | 'euint64' = 'euint32') => {
      if (!isInitialized) {
        throw new Error('FHE not initialized');
      }

      setState((prev) => ({
        ...prev,
        isEncrypting: true,
        error: null,
      }));

      try {
        const encrypted = await fheEncrypt(value, type);

        setState({
          isEncrypting: false,
          isDecrypting: false,
          error: null,
          lastEncrypted: encrypted,
          lastDecrypted: null,
        });

        return encrypted;
      } catch (error) {
        const errorMessage = error instanceof Error ? error.message : 'Encryption failed';

        setState((prev) => ({
          ...prev,
          isEncrypting: false,
          error: errorMessage,
        }));

        throw error;
      }
    },
    [fheEncrypt, isInitialized]
  );

  /**
   * Decrypt encrypted data with loading state management
   */
  const decrypt = useCallback(
    async (encrypted: EncryptedData) => {
      if (!isInitialized) {
        throw new Error('FHE not initialized');
      }

      setState((prev) => ({
        ...prev,
        isDecrypting: true,
        error: null,
      }));

      try {
        const decrypted = await fheDecrypt(encrypted);

        setState((prev) => ({
          ...prev,
          isDecrypting: false,
          error: null,
          lastDecrypted: decrypted,
        }));

        return decrypted;
      } catch (error) {
        const errorMessage = error instanceof Error ? error.message : 'Decryption failed';

        setState((prev) => ({
          ...prev,
          isDecrypting: false,
          error: errorMessage,
        }));

        throw error;
      }
    },
    [fheDecrypt, isInitialized]
  );

  /**
   * Encrypt multiple values
   */
  const encryptBatch = useCallback(
    async (values: number[], type: 'euint8' | 'euint16' | 'euint32' | 'euint64' = 'euint32') => {
      setState((prev) => ({
        ...prev,
        isEncrypting: true,
        error: null,
      }));

      try {
        const encrypted = await Promise.all(values.map((v) => fheEncrypt(v, type)));

        setState((prev) => ({
          ...prev,
          isEncrypting: false,
        }));

        return encrypted;
      } catch (error) {
        const errorMessage = error instanceof Error ? error.message : 'Batch encryption failed';

        setState((prev) => ({
          ...prev,
          isEncrypting: false,
          error: errorMessage,
        }));

        throw error;
      }
    },
    [fheEncrypt]
  );

  /**
   * Decrypt multiple values
   */
  const decryptBatch = useCallback(
    async (encrypted: EncryptedData[]) => {
      setState((prev) => ({
        ...prev,
        isDecrypting: true,
        error: null,
      }));

      try {
        const decrypted = await Promise.all(encrypted.map((e) => fheDecrypt(e)));

        setState((prev) => ({
          ...prev,
          isDecrypting: false,
        }));

        return decrypted;
      } catch (error) {
        const errorMessage = error instanceof Error ? error.message : 'Batch decryption failed';

        setState((prev) => ({
          ...prev,
          isDecrypting: false,
          error: errorMessage,
        }));

        throw error;
      }
    },
    [fheDecrypt]
  );

  /**
   * Clear error state
   */
  const clearError = useCallback(() => {
    setState((prev) => ({
      ...prev,
      error: null,
    }));
  }, []);

  /**
   * Reset state
   */
  const reset = useCallback(() => {
    setState({
      isEncrypting: false,
      isDecrypting: false,
      error: null,
      lastEncrypted: null,
      lastDecrypted: null,
    });
  }, []);

  return {
    ...state,
    encrypt,
    decrypt,
    encryptBatch,
    decryptBatch,
    clearError,
    reset,
    isReady: isInitialized,
  };
}
