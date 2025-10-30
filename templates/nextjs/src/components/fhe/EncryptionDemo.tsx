'use client';

import { useState } from 'react';
import { useFHE } from './FHEProvider';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { Card } from '@/components/ui/Card';

export const EncryptionDemo = () => {
  const { client, isInitialized, error, init } = useFHE();
  const [value, setValue] = useState('');
  const [encryptedData, setEncryptedData] = useState<string>('');
  const [isEncrypting, setIsEncrypting] = useState(false);
  const [contractAddress, setContractAddress] = useState('0x0000000000000000000000000000000000000000');

  const handleEncrypt = async () => {
    if (!client || !value) return;

    try {
      setIsEncrypting(true);
      const result = await client.encryptInput({
        value: parseInt(value),
        type: 'uint32',
        contractAddress,
      });

      setEncryptedData(JSON.stringify(result, null, 2));
    } catch (err) {
      console.error('Encryption error:', err);
      alert('Encryption failed: ' + (err instanceof Error ? err.message : 'Unknown error'));
    } finally {
      setIsEncrypting(false);
    }
  };

  if (error) {
    return (
      <Card>
        <div className="text-red-600 mb-4">Error: {error}</div>
        <Button onClick={init}>Retry Initialization</Button>
      </Card>
    );
  }

  if (!isInitialized) {
    return (
      <Card>
        <h2 className="text-2xl font-bold mb-4">Initialize FHE Client</h2>
        <p className="mb-4 text-gray-600">
          Connect your wallet to initialize the FHE client and start encrypting data.
        </p>
        <Button onClick={init}>Connect & Initialize</Button>
      </Card>
    );
  }

  return (
    <Card>
      <h2 className="text-2xl font-bold mb-6">Encryption Demo</h2>

      <div className="space-y-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Contract Address
          </label>
          <Input
            type="text"
            value={contractAddress}
            onChange={(e) => setContractAddress(e.target.value)}
            placeholder="0x..."
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Value to Encrypt (uint32)
          </label>
          <Input
            type="number"
            value={value}
            onChange={(e) => setValue(e.target.value)}
            placeholder="Enter a number"
          />
        </div>

        <Button onClick={handleEncrypt} disabled={!value || isEncrypting}>
          {isEncrypting ? 'Encrypting...' : 'Encrypt Value'}
        </Button>

        {encryptedData && (
          <div className="mt-6">
            <h3 className="font-semibold mb-2">Encrypted Result:</h3>
            <pre className="bg-gray-100 p-4 rounded overflow-x-auto text-sm">
              {encryptedData}
            </pre>
          </div>
        )}
      </div>
    </Card>
  );
};
