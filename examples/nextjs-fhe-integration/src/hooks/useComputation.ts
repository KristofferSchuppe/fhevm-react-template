import { useState } from 'react';

export function useComputation() {
  const [isComputing, setIsComputing] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const compute = async (operation: string, operands: number[]) => {
    setIsComputing(true);
    setError(null);

    try {
      const response = await fetch('/api/fhe/compute', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ operation, operands })
      });

      const data = await response.json();

      if (!data.success) {
        throw new Error('Computation failed');
      }

      return data.result;
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Computation failed');
      return null;
    } finally {
      setIsComputing(false);
    }
  };

  return { compute, isComputing, error };
}
