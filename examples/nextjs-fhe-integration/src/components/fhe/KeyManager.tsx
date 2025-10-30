'use client';

import { useState, useEffect } from 'react';
import { useFHE } from './FHEProvider';
import { Card } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';

export function KeyManager() {
  const { client, isInitialized } = useFHE();
  const [publicKey, setPublicKey] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (isInitialized) {
      fetchKeys();
    }
  }, [isInitialized]);

  const fetchKeys = async () => {
    try {
      const response = await fetch('/api/keys');
      const data = await response.json();
      if (data.success) {
        setPublicKey(data.keys.publicKey);
      }
    } catch (error) {
      console.error('Failed to fetch keys:', error);
    }
  };

  const handleRefresh = async () => {
    setLoading(true);
    try {
      const response = await fetch('/api/keys', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ action: 'refresh' })
      });

      const data = await response.json();
      if (data.success) {
        setPublicKey(data.publicKey);
      }
    } catch (error) {
      console.error('Failed to refresh keys:', error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <Card title="FHE Key Management">
      <div className="space-y-4">
        <div>
          <label className="block text-sm font-medium mb-2">Public Key</label>
          {publicKey ? (
            <pre className="p-4 bg-gray-800 rounded-lg overflow-x-auto text-sm text-green-400">
              {publicKey}
            </pre>
          ) : (
            <div className="p-4 bg-gray-800 rounded-lg text-gray-400">
              No public key loaded
            </div>
          )}
        </div>

        <div className="flex gap-4">
          <Button
            onClick={handleRefresh}
            disabled={!isInitialized || loading}
          >
            {loading ? 'Refreshing...' : 'Refresh Keys'}
          </Button>
        </div>

        <div className="mt-4 p-4 bg-blue-900/30 border border-blue-600 rounded-lg">
          <h4 className="font-semibold mb-2 text-blue-200">About FHE Keys</h4>
          <p className="text-sm text-blue-100">
            The public key is used to encrypt data on the client side before sending it to the blockchain.
            Only authorized parties with the corresponding private key can decrypt the data.
          </p>
        </div>
      </div>
    </Card>
  );
}
