/**
 * Key Manager Component
 * Interface for managing FHE encryption keys
 */

'use client';

import React, { useState, useEffect } from 'react';
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { useFHEContext } from './FHEProvider';
import { keyManager } from '@/lib/fhe/keys';

export function KeyManager() {
  const { publicKey, generateKeys, isLoading } = useFHEContext();
  const [showPrivateKey, setShowPrivateKey] = useState(false);
  const [privateKey, setPrivateKey] = useState<string | null>(null);
  const [isGenerating, setIsGenerating] = useState(false);
  const [copySuccess, setCopySuccess] = useState<string | null>(null);

  /**
   * Load private key from storage
   */
  useEffect(() => {
    const keyPair = keyManager.getStoredKeyPair();
    if (keyPair) {
      setPrivateKey(keyPair.privateKey);
    }
  }, [publicKey]);

  /**
   * Generate new key pair
   */
  const handleGenerateKeys = async () => {
    setIsGenerating(true);
    try {
      const keyPair = await generateKeys();
      setPrivateKey(keyPair.privateKey);
      setCopySuccess(null);
    } catch (err) {
      console.error('Failed to generate keys:', err);
    } finally {
      setIsGenerating(false);
    }
  };

  /**
   * Copy key to clipboard
   */
  const handleCopyKey = async (key: string, keyType: string) => {
    try {
      await navigator.clipboard.writeText(key);
      setCopySuccess(keyType);
      setTimeout(() => setCopySuccess(null), 2000);
    } catch (err) {
      console.error('Failed to copy:', err);
    }
  };

  /**
   * Clear stored keys
   */
  const handleClearKeys = () => {
    if (confirm('Are you sure you want to clear all stored keys? This action cannot be undone.')) {
      keyManager.clearStoredKeyPair();
      setPrivateKey(null);
      setCopySuccess(null);
    }
  };

  /**
   * Export keys as JSON
   */
  const handleExportKeys = () => {
    if (!publicKey || !privateKey) return;

    const keyData = {
      publicKey,
      privateKey,
      timestamp: Date.now(),
      exported: new Date().toISOString(),
    };

    const blob = new Blob([JSON.stringify(keyData, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `fhe-keys-${Date.now()}.json`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>Key Management</CardTitle>
        <CardDescription>
          Manage your FHE encryption keys. Keep your private key secure!
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        {/* Public Key Section */}
        <div className="space-y-2">
          <div className="flex items-center justify-between">
            <label className="block text-sm font-medium text-gray-700">
              Public Key
            </label>
            {publicKey && (
              <Button
                variant="ghost"
                size="sm"
                onClick={() => handleCopyKey(publicKey, 'public')}
              >
                {copySuccess === 'public' ? 'Copied!' : 'Copy'}
              </Button>
            )}
          </div>
          <div className="bg-gray-50 p-3 rounded border border-gray-200">
            <div className="text-xs font-mono break-all text-gray-700">
              {publicKey || 'No public key available'}
            </div>
          </div>
          <p className="text-xs text-gray-500">
            Your public key can be safely shared with others for encryption.
          </p>
        </div>

        {/* Private Key Section */}
        <div className="space-y-2">
          <div className="flex items-center justify-between">
            <label className="block text-sm font-medium text-gray-700">
              Private Key
            </label>
            {privateKey && (
              <div className="flex space-x-2">
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => setShowPrivateKey(!showPrivateKey)}
                >
                  {showPrivateKey ? 'Hide' : 'Show'}
                </Button>
                {showPrivateKey && (
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => handleCopyKey(privateKey, 'private')}
                  >
                    {copySuccess === 'private' ? 'Copied!' : 'Copy'}
                  </Button>
                )}
              </div>
            )}
          </div>
          <div className="bg-yellow-50 p-3 rounded border border-yellow-200">
            <div className="text-xs font-mono break-all text-gray-700">
              {showPrivateKey && privateKey
                ? privateKey
                : privateKey
                ? '••••••••••••••••••••••••••••••••'
                : 'No private key available'}
            </div>
          </div>
          <div className="bg-red-50 p-2 rounded border border-red-200">
            <p className="text-xs text-red-800">
              ⚠️ Never share your private key! It is used to decrypt your encrypted data.
            </p>
          </div>
        </div>

        {/* Key Actions */}
        <div className="border-t pt-4 space-y-3">
          <Button
            onClick={handleGenerateKeys}
            disabled={isLoading || isGenerating}
            isLoading={isGenerating}
            className="w-full"
          >
            Generate New Key Pair
          </Button>

          {publicKey && privateKey && (
            <>
              <Button
                onClick={handleExportKeys}
                variant="secondary"
                className="w-full"
              >
                Export Keys (JSON)
              </Button>

              <Button
                onClick={handleClearKeys}
                variant="danger"
                className="w-full"
              >
                Clear Stored Keys
              </Button>
            </>
          )}
        </div>

        {/* Key Status */}
        <div className="bg-blue-50 p-4 rounded border border-blue-200">
          <h4 className="text-sm font-semibold text-blue-900 mb-2">Key Storage</h4>
          <ul className="text-sm text-blue-800 space-y-1 list-disc list-inside">
            <li>Keys are stored locally in your browser</li>
            <li>Keys expire after 24 hours for security</li>
            <li>Export your keys to back them up</li>
            <li>Generate new keys if needed</li>
          </ul>
        </div>
      </CardContent>
    </Card>
  );
}
