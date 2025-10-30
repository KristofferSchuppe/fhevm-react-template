'use client';

import { useState } from 'react';
import { useFHE } from './FHEProvider';
import { Button } from '@/components/ui/Button';
import { Card } from '@/components/ui/Card';

export const ComputationDemo = () => {
  const { client, isInitialized } = useFHE();
  const [result, setResult] = useState<string>('');

  const handleComputation = async () => {
    if (!client) return;

    try {
      setResult('Performing homomorphic computation...');

      // Example: This would typically involve contract interaction
      // For demo purposes, we show the concept
      const mockResult = {
        operation: 'Addition',
        description: 'Encrypted values were added without decryption',
        result: 'Encrypted result stored on-chain',
      };

      setTimeout(() => {
        setResult(JSON.stringify(mockResult, null, 2));
      }, 1500);
    } catch (err) {
      console.error('Computation error:', err);
      alert('Computation failed: ' + (err instanceof Error ? err.message : 'Unknown error'));
    }
  };

  if (!isInitialized) {
    return (
      <Card>
        <p className="text-gray-600">Please initialize the FHE client first.</p>
      </Card>
    );
  }

  return (
    <Card>
      <h2 className="text-2xl font-bold mb-6">Computation Demo</h2>

      <div className="space-y-4">
        <p className="text-gray-600">
          Demonstrate homomorphic computation on encrypted data without decryption.
        </p>

        <Button onClick={handleComputation}>
          Run Sample Computation
        </Button>

        {result && (
          <div className="mt-6">
            <h3 className="font-semibold mb-2">Computation Result:</h3>
            <pre className="bg-gray-100 p-4 rounded overflow-x-auto text-sm">
              {result}
            </pre>
          </div>
        )}
      </div>
    </Card>
  );
};
