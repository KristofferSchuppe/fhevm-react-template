/**
 * React Hooks for FHEVM
 *
 * Wagmi-like hooks for React applications
 * Optional - core SDK is framework-agnostic
 */

import { useState, useEffect, useCallback, useMemo } from 'react';
import { FhevmClient } from '../../core/FhevmClient';
import type { FhevmConfig, EncryptionParams, EncryptedInput, FhevmInstanceState } from '../../types';

/**
 * Hook to use FHEVM client
 */
export function useFhevmClient(config: FhevmConfig) {
  const [client, setClient] = useState<FhevmClient | null>(null);
  const [isInitializing, setIsInitializing] = useState(false);
  const [isInitialized, setIsInitialized] = useState(false);
  const [error, setError] = useState<Error | null>(null);

  const init = useCallback(async () => {
    setIsInitializing(true);
    setError(null);

    try {
      const fhevmClient = new FhevmClient(config);
      await fhevmClient.init();
      setClient(fhevmClient);
      setIsInitialized(true);
    } catch (err) {
      setError(err as Error);
    } finally {
      setIsInitializing(false);
    }
  }, [config]);

  useEffect(() => {
    init();
  }, [init]);

  return {
    client,
    isInitializing,
    isInitialized,
    error,
    reinit: init
  };
}

/**
 * Hook for encryption
 */
export function useEncrypt(client: FhevmClient | null) {
  const [isEncrypting, setIsEncrypting] = useState(false);
  const [error, setError] = useState<Error | null>(null);

  const encrypt = useCallback(
    async (params: EncryptionParams): Promise<EncryptedInput | null> => {
      if (!client) {
        setError(new Error('FHEVM client not initialized'));
        return null;
      }

      setIsEncrypting(true);
      setError(null);

      try {
        const result = await client.encryptInput(params);
        return result;
      } catch (err) {
        setError(err as Error);
        return null;
      } finally {
        setIsEncrypting(false);
      }
    },
    [client]
  );

  return {
    encrypt,
    isEncrypting,
    error
  };
}

/**
 * Hook for permission signature generation
 */
export function usePermission(client: FhevmClient | null) {
  const [isGenerating, setIsGenerating] = useState(false);
  const [error, setError] = useState<Error | null>(null);

  const generatePermission = useCallback(
    async (contractAddress: string) => {
      if (!client) {
        setError(new Error('FHEVM client not initialized'));
        return null;
      }

      setIsGenerating(true);
      setError(null);

      try {
        const permission = await client.generatePermissionSignature(contractAddress);
        return permission;
      } catch (err) {
        setError(err as Error);
        return null;
      } finally {
        setIsGenerating(false);
      }
    },
    [client]
  );

  return {
    generatePermission,
    isGenerating,
    error
  };
}

/**
 * Hook to get FHEVM instance state
 */
export function useFhevmState(client: FhevmClient | null): FhevmInstanceState | null {
  const state = useMemo(() => {
    if (!client) return null;
    return client.getState();
  }, [client]);

  return state;
}

/**
 * Hook to get public key
 */
export function usePublicKey(client: FhevmClient | null): string | null {
  const [publicKey, setPublicKey] = useState<string | null>(null);

  useEffect(() => {
    if (client) {
      setPublicKey(client.getPublicKey());
    }
  }, [client]);

  return publicKey;
}
