'use client';

import { useState } from 'react';
import { useFHE } from './FHEProvider';
import { Button } from '@/components/ui/Button';
import { Card } from '@/components/ui/Card';
import { Input } from '@/components/ui/Input';

export const KeyManager = () => {
  const { client, isInitialized } = useFHE();
  const [contractAddress, setContractAddress] = useState('0x0000000000000000000000000000000000000000');
  const [permission, setPermission] = useState<any>(null);
  const [isGenerating, setIsGenerating] = useState(false);

  const handleGeneratePermission = async () => {
    if (!client || !contractAddress) return;

    try {
      setIsGenerating(true);
      const permissionData = await client.generatePermissionSignature(contractAddress);
      setPermission(permissionData);
    } catch (err) {
      console.error('Permission generation error:', err);
      alert('Failed to generate permission: ' + (err instanceof Error ? err.message : 'Unknown error'));
    } finally {
      setIsGenerating(false);
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
      <h2 className="text-2xl font-bold mb-6">Key Manager</h2>

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

        <Button onClick={handleGeneratePermission} disabled={!contractAddress || isGenerating}>
          {isGenerating ? 'Generating...' : 'Generate Permission Signature'}
        </Button>

        {permission && (
          <div className="mt-6 space-y-4">
            <div>
              <h3 className="font-semibold mb-2">Public Key:</h3>
              <pre className="bg-gray-100 p-4 rounded overflow-x-auto text-sm">
                {permission.publicKey}
              </pre>
            </div>

            <div>
              <h3 className="font-semibold mb-2">Signature:</h3>
              <pre className="bg-gray-100 p-4 rounded overflow-x-auto text-sm break-all">
                {permission.signature}
              </pre>
            </div>
          </div>
        )}
      </div>
    </Card>
  );
};
