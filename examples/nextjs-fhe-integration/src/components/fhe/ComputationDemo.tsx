'use client';

import { useState } from 'react';
import { useFHE } from './FHEProvider';
import { Card } from '@/components/ui/Card';
import { Input } from '@/components/ui/Input';
import { Button } from '@/components/ui/Button';

export function ComputationDemo() {
  const { client, isInitialized } = useFHE();
  const [operand1, setOperand1] = useState('');
  const [operand2, setOperand2] = useState('');
  const [operation, setOperation] = useState('add');
  const [result, setResult] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const handleCompute = async () => {
    if (!client || !operand1 || !operand2) return;

    setLoading(true);
    try {
      const response = await fetch('/api/fhe/compute', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          operation,
          operands: [parseInt(operand1), parseInt(operand2)]
        })
      });

      const data = await response.json();
      if (data.success) {
        setResult(`Result: ${data.result}`);
      }
    } catch (error) {
      console.error('Computation error:', error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <Card title="Homomorphic Computation Demo">
      <div className="space-y-4">
        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium mb-2">First Operand</label>
            <Input
              type="number"
              value={operand1}
              onChange={(e) => setOperand1(e.target.value)}
              placeholder="Enter first number"
            />
          </div>
          <div>
            <label className="block text-sm font-medium mb-2">Second Operand</label>
            <Input
              type="number"
              value={operand2}
              onChange={(e) => setOperand2(e.target.value)}
              placeholder="Enter second number"
            />
          </div>
        </div>

        <div>
          <label className="block text-sm font-medium mb-2">Operation</label>
          <select
            value={operation}
            onChange={(e) => setOperation(e.target.value)}
            className="w-full px-4 py-2 bg-gray-800 border border-gray-700 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            <option value="add">Addition (+)</option>
            <option value="multiply">Multiplication (×)</option>
            <option value="compare">Comparison (&gt;)</option>
          </select>
        </div>

        <Button
          onClick={handleCompute}
          disabled={!isInitialized || !operand1 || !operand2 || loading}
          fullWidth
        >
          {loading ? 'Computing...' : 'Compute on Encrypted Data'}
        </Button>

        {result && (
          <div className="mt-4 p-4 bg-green-900/30 border border-green-600 rounded-lg">
            <p className="text-green-200 font-semibold">{result}</p>
          </div>
        )}
      </div>
    </Card>
  );
}
