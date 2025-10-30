import { useState } from 'react';
import { FhevmClient } from '@fhevm-toolkit/sdk';

export function useEncrypt(client: FhevmClient | null) {
  const [isEncrypting, setIsEncrypting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const encrypt = async (params: {
    value: number | boolean | string;
    type: string;
    contractAddress: string;
  }) => {
    if (!client) {
      throw new Error('FHE client not initialized');
    }

    try {
      setIsEncrypting(true);
      setError(null);

      const result = await client.encryptInput(params);
      return result;
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Encryption failed';
      setError(errorMessage);
      throw err;
    } finally {
      setIsEncrypting(false);
    }
  };

  return { encrypt, isEncrypting, error };
}
