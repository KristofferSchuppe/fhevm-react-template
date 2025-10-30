import { useState, useEffect } from 'react';
import { FhevmClient } from '@fhevm-toolkit/sdk';
import { ethers } from 'ethers';

export function useFhevmClient(config: {
  provider?: ethers.Provider;
  signer?: ethers.Signer;
  chainId?: number;
}) {
  const [client, setClient] = useState<FhevmClient | null>(null);
  const [isInitialized, setIsInitialized] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (config.provider && config.signer && config.chainId) {
      initClient();
    }
  }, [config.provider, config.signer, config.chainId]);

  const initClient = async () => {
    try {
      if (!config.provider || !config.signer || !config.chainId) return;

      const fhevmClient = new FhevmClient({
        provider: config.provider,
        signer: config.signer,
        chainId: config.chainId,
      });

      await fhevmClient.init();
      setClient(fhevmClient);
      setIsInitialized(true);
      setError(null);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to initialize client');
      setIsInitialized(false);
    }
  };

  return { client, isInitialized, error, init: initClient };
}
