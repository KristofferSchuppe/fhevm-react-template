import { useState } from 'react';
import { FhevmClient } from '@/lib/fhe/client';

export function useEncryption(client: FhevmClient | null) {
  const [isEncrypting, setIsEncrypting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const encrypt = async (value: number, type: string) => {
    if (!client) {
      setError('Client not initialized');
      return null;
    }

    setIsEncrypting(true);
    setError(null);

    try {
      const result = await client.encrypt(value, type);
      return result;
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Encryption failed');
      return null;
    } finally {
      setIsEncrypting(false);
    }
  };

  return { encrypt, isEncrypting, error };
}
