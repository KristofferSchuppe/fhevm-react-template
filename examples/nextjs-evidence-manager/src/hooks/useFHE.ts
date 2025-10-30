/**
 * useFHE Hook
 * Main hook for FHE operations, provides access to FHE client and functionality
 */

'use client';

import { useState, useEffect, useCallback } from 'react';
import { FHEClientInstance, FHEContextState, EncryptedData } from '@/types/fhe';
import { fheClient } from '@/lib/fhe/client';

export function useFHE() {
  const [state, setState] = useState<FHEContextState>({
    isInitialized: false,
    publicKey: null,
    isLoading: false,
    error: null,
  });

  /**
   * Initialize FHE client
   */
  const initialize = useCallback(async () => {
    setState((prev) => ({ ...prev, isLoading: true, error: null }));

    try {
      await fheClient.initialize();
      const publicKey = fheClient.getPublicKey();

      setState({
        isInitialized: true,
        publicKey,
        isLoading: false,
        error: null,
      });
    } catch (error) {
      setState({
        isInitialized: false,
        publicKey: null,
        isLoading: false,
        error: error instanceof Error ? error.message : 'Failed to initialize FHE',
      });
    }
  }, []);

  /**
   * Encrypt a value
   */
  const encrypt = useCallback(
    async (value: number, type: 'euint8' | 'euint16' | 'euint32' | 'euint64' = 'euint32') => {
      if (!state.isInitialized) {
        throw new Error('FHE client not initialized');
      }

      switch (type) {
        case 'euint8':
          return fheClient.encrypt8(value);
        case 'euint16':
          return fheClient.encrypt16(value);
        case 'euint32':
          return fheClient.encrypt32(value);
        case 'euint64':
          return fheClient.encrypt64(BigInt(value));
        default:
          return fheClient.encrypt32(value);
      }
    },
    [state.isInitialized]
  );

  /**
   * Decrypt encrypted data
   */
  const decrypt = useCallback(
    async (encrypted: EncryptedData) => {
      if (!state.isInitialized) {
        throw new Error('FHE client not initialized');
      }

      return fheClient.decrypt(encrypted);
    },
    [state.isInitialized]
  );

  /**
   * Get current public key
   */
  const getPublicKey = useCallback(() => {
    return state.publicKey;
  }, [state.publicKey]);

  /**
   * Generate new key pair
   */
  const generateKeys = useCallback(async () => {
    setState((prev) => ({ ...prev, isLoading: true, error: null }));

    try {
      const keyPair = await fheClient.generateKeys();

      setState({
        isInitialized: true,
        publicKey: keyPair.publicKey,
        isLoading: false,
        error: null,
      });

      return keyPair;
    } catch (error) {
      setState((prev) => ({
        ...prev,
        isLoading: false,
        error: error instanceof Error ? error.message : 'Failed to generate keys',
      }));
      throw error;
    }
  }, []);

  /**
   * Auto-initialize on mount
   */
  useEffect(() => {
    if (!state.isInitialized && !state.isLoading) {
      initialize();
    }
  }, []);

  return {
    ...state,
    initialize,
    encrypt,
    decrypt,
    getPublicKey,
    generateKeys,
    client: fheClient,
  };
}
