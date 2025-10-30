/**
 * Encryption Demo Component
 * Interactive demo for encrypting and decrypting values using FHE
 */

'use client';

import React, { useState } from 'react';
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { useEncryption } from '@/hooks/useEncryption';
import { EncryptedData } from '@/types/fhe';

export function EncryptionDemo() {
  const [inputValue, setInputValue] = useState('');
  const [encryptionType, setEncryptionType] = useState<'euint8' | 'euint16' | 'euint32' | 'euint64'>('euint32');
  const [encrypted, setEncrypted] = useState<EncryptedData | null>(null);
  const [decryptedValue, setDecryptedValue] = useState<string | null>(null);

  const { encrypt, decrypt, isEncrypting, isDecrypting, error, isReady } = useEncryption();

  /**
   * Handle encryption of the input value
   */
  const handleEncrypt = async () => {
    if (!inputValue) return;

    try {
      const value = parseInt(inputValue, 10);
      if (isNaN(value)) {
        alert('Please enter a valid number');
        return;
      }

      // Validate value range based on type
      const maxValues = {
        euint8: 255,
        euint16: 65535,
        euint32: 4294967295,
        euint64: Number.MAX_SAFE_INTEGER,
      };

      if (value < 0 || value > maxValues[encryptionType]) {
        alert(`Value must be between 0 and ${maxValues[encryptionType]} for ${encryptionType}`);
        return;
      }

      const result = await encrypt(value, encryptionType);
      setEncrypted(result);
      setDecryptedValue(null);
    } catch (err) {
      console.error('Encryption failed:', err);
    }
  };

  /**
   * Handle decryption of the encrypted data
   */
  const handleDecrypt = async () => {
    if (!encrypted) return;

    try {
      const result = await decrypt(encrypted);
      setDecryptedValue(result.toString());
    } catch (err) {
      console.error('Decryption failed:', err);
    }
  };

  /**
   * Reset the demo
   */
  const handleReset = () => {
    setInputValue('');
    setEncrypted(null);
    setDecryptedValue(null);
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>Encryption Demo</CardTitle>
        <CardDescription>
          Encrypt and decrypt values using Fully Homomorphic Encryption (FHE)
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        {/* Input Section */}
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Encryption Type
            </label>
            <select
              value={encryptionType}
              onChange={(e) => setEncryptionType(e.target.value as any)}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              disabled={isEncrypting || isDecrypting}
            >
              <option value="euint8">euint8 (0-255)</option>
              <option value="euint16">euint16 (0-65535)</option>
              <option value="euint32">euint32 (0-4294967295)</option>
              <option value="euint64">euint64 (large numbers)</option>
            </select>
          </div>

          <Input
            label="Value to Encrypt"
            type="number"
            value={inputValue}
            onChange={(e) => setInputValue(e.target.value)}
            placeholder="Enter a number"
            disabled={isEncrypting || isDecrypting}
          />

          <Button
            onClick={handleEncrypt}
            disabled={!inputValue || !isReady || isEncrypting}
            isLoading={isEncrypting}
            className="w-full"
          >
            Encrypt Value
          </Button>
        </div>

        {/* Encrypted Data Display */}
        {encrypted && (
          <div className="border-t pt-4 space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Encrypted Data
              </label>
              <div className="bg-gray-50 p-3 rounded border border-gray-200">
                <div className="text-xs font-mono break-all">
                  <div className="mb-2">
                    <span className="font-semibold">Handle:</span> {encrypted.handle}
                  </div>
                  <div className="mb-2">
                    <span className="font-semibold">Type:</span> {encrypted.type}
                  </div>
                  <div>
                    <span className="font-semibold">Ciphertext:</span>{' '}
                    {Buffer.from(encrypted.ciphertext).toString('base64').substring(0, 50)}...
                  </div>
                </div>
              </div>
            </div>

            <Button
              onClick={handleDecrypt}
              variant="secondary"
              disabled={isDecrypting}
              isLoading={isDecrypting}
              className="w-full"
            >
              Decrypt Value
            </Button>
          </div>
        )}

        {/* Decrypted Value Display */}
        {decryptedValue !== null && (
          <div className="border-t pt-4">
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Decrypted Value
            </label>
            <div className="bg-green-50 p-4 rounded border border-green-200">
              <div className="text-2xl font-bold text-green-900 text-center">
                {decryptedValue}
              </div>
            </div>
          </div>
        )}

        {/* Error Display */}
        {error && (
          <div className="bg-red-50 p-4 rounded border border-red-200">
            <p className="text-sm text-red-800">{error}</p>
          </div>
        )}

        {/* Reset Button */}
        {(encrypted || error) && (
          <Button onClick={handleReset} variant="ghost" className="w-full">
            Reset Demo
          </Button>
        )}

        {/* Info Section */}
        <div className="bg-blue-50 p-4 rounded border border-blue-200">
          <h4 className="text-sm font-semibold text-blue-900 mb-2">How it works:</h4>
          <ul className="text-sm text-blue-800 space-y-1 list-disc list-inside">
            <li>Enter a numeric value to encrypt</li>
            <li>The value is encrypted using FHE on the client side</li>
            <li>Encrypted data can be safely transmitted and stored</li>
            <li>Decrypt the value using your private key</li>
          </ul>
        </div>
      </CardContent>
    </Card>
  );
}
