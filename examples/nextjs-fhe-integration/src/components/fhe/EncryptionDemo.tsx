'use client';

import { useState } from 'react';
import { useFHE } from './FHEProvider';
import { Card } from '@/components/ui/Card';
import { Input } from '@/components/ui/Input';
import { Button } from '@/components/ui/Button';

export function EncryptionDemo() {
  const { client, isInitialized } = useFHE();
  const [value, setValue] = useState('');
  const [type, setType] = useState('uint32');
  const [encrypted, setEncrypted] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const handleEncrypt = async () => {
    if (!client || !value) return;

    setLoading(true);
    try {
      const result = await fetch('/api/fhe/encrypt', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          value: parseInt(value),
          type,
          contractAddress: '0x0000000000000000000000000000000000000000'
        })
      });

      const data = await result.json();
      if (data.success) {
        setEncrypted(JSON.stringify(data.encrypted, null, 2));
      }
    } catch (error) {
      console.error('Encryption error:', error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <Card title="Encryption Demo">
      <div className="space-y-4">
        {!isInitialized && (
          <div className="p-4 bg-yellow-900/30 border border-yellow-600 rounded-lg">
            <p className="text-yellow-200">Initializing FHE client...</p>
          </div>
        )}

        <div>
          <label className="block text-sm font-medium mb-2">Value to Encrypt</label>
          <Input
            type="number"
            value={value}
            onChange={(e) => setValue(e.target.value)}
            placeholder="Enter a number"
          />
        </div>

        <div>
          <label className="block text-sm font-medium mb-2">Data Type</label>
          <select
            value={type}
            onChange={(e) => setType(e.target.value)}
            className="w-full px-4 py-2 bg-gray-800 border border-gray-700 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            <option value="uint8">uint8</option>
            <option value="uint16">uint16</option>
            <option value="uint32">uint32</option>
            <option value="uint64">uint64</option>
            <option value="uint128">uint128</option>
            <option value="uint256">uint256</option>
          </select>
        </div>

        <Button
          onClick={handleEncrypt}
          disabled={!isInitialized || !value || loading}
          fullWidth
        >
          {loading ? 'Encrypting...' : 'Encrypt Value'}
        </Button>

        {encrypted && (
          <div className="mt-4">
            <label className="block text-sm font-medium mb-2">Encrypted Result</label>
            <pre className="p-4 bg-gray-800 rounded-lg overflow-x-auto text-sm">
              {encrypted}
            </pre>
          </div>
        )}
      </div>
    </Card>
  );
}
