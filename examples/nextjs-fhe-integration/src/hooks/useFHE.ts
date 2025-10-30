import { useState, useEffect } from 'react';
import { FhevmClient } from '@/lib/fhe/client';

export function useFHEClient() {
  const [client, setClient] = useState<FhevmClient | null>(null);
  const [isInitialized, setIsInitialized] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const initClient = async () => {
      try {
        const fhevmClient = new FhevmClient();
        await fhevmClient.init();
        setClient(fhevmClient);
        setIsInitialized(true);
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Initialization failed');
      }
    };

    initClient();
  }, []);

  return { client, isInitialized, error };
}
