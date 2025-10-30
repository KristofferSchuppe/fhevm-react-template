/**
 * Computation Demo Component
 * Interactive demo for performing homomorphic computations on encrypted data
 */

'use client';

import React, { useState } from 'react';
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { useEncryption } from '@/hooks/useEncryption';
import { useComputation } from '@/hooks/useComputation';
import { EncryptedData, ComputationType } from '@/types/fhe';

export function ComputationDemo() {
  const [value1, setValue1] = useState('');
  const [value2, setValue2] = useState('');
  const [operation, setOperation] = useState<ComputationType>('add');
  const [encrypted1, setEncrypted1] = useState<EncryptedData | null>(null);
  const [encrypted2, setEncrypted2] = useState<EncryptedData | null>(null);
  const [computationResult, setComputationResult] = useState<EncryptedData | null>(null);
  const [finalResult, setFinalResult] = useState<string | null>(null);

  const { encrypt, decrypt, isEncrypting, isDecrypting, isReady } = useEncryption();
  const { compute, isComputing } = useComputation();

  /**
   * Encrypt both input values
   */
  const handleEncryptInputs = async () => {
    if (!value1 || !value2) {
      alert('Please enter both values');
      return;
    }

    try {
      const num1 = parseInt(value1, 10);
      const num2 = parseInt(value2, 10);

      if (isNaN(num1) || isNaN(num2)) {
        alert('Please enter valid numbers');
        return;
      }

      // Encrypt both values (using euint32 for simplicity)
      const enc1 = await encrypt(num1, 'euint32');
      const enc2 = await encrypt(num2, 'euint32');

      setEncrypted1(enc1);
      setEncrypted2(enc2);
      setComputationResult(null);
      setFinalResult(null);
    } catch (err) {
      console.error('Encryption failed:', err);
    }
  };

  /**
   * Perform homomorphic computation
   */
  const handleCompute = async () => {
    if (!encrypted1 || !encrypted2) return;

    try {
      const result = await compute(operation, encrypted1, encrypted2);
      setComputationResult(result);
      setFinalResult(null);
    } catch (err) {
      console.error('Computation failed:', err);
    }
  };

  /**
   * Decrypt the computation result
   */
  const handleDecryptResult = async () => {
    if (!computationResult) return;

    try {
      const result = await decrypt(computationResult);
      setFinalResult(result.toString());
    } catch (err) {
      console.error('Decryption failed:', err);
    }
  };

  /**
   * Reset the demo
   */
  const handleReset = () => {
    setValue1('');
    setValue2('');
    setEncrypted1(null);
    setEncrypted2(null);
    setComputationResult(null);
    setFinalResult(null);
  };

  /**
   * Get operation symbol
   */
  const getOperationSymbol = (op: ComputationType): string => {
    const symbols = {
      add: '+',
      subtract: '-',
      multiply: '×',
      divide: '÷',
      compare: '>',
    };
    return symbols[op] || op;
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>Homomorphic Computation Demo</CardTitle>
        <CardDescription>
          Perform computations on encrypted data without decrypting it first
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        {/* Input Section */}
        <div className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <Input
              label="First Value"
              type="number"
              value={value1}
              onChange={(e) => setValue1(e.target.value)}
              placeholder="Enter first number"
              disabled={isEncrypting || isComputing || isDecrypting}
            />
            <Input
              label="Second Value"
              type="number"
              value={value2}
              onChange={(e) => setValue2(e.target.value)}
              placeholder="Enter second number"
              disabled={isEncrypting || isComputing || isDecrypting}
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Operation
            </label>
            <select
              value={operation}
              onChange={(e) => setOperation(e.target.value as ComputationType)}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              disabled={isEncrypting || isComputing || isDecrypting}
            >
              <option value="add">Addition (+)</option>
              <option value="subtract">Subtraction (-)</option>
              <option value="multiply">Multiplication (×)</option>
              <option value="compare">Compare (>)</option>
            </select>
          </div>

          <Button
            onClick={handleEncryptInputs}
            disabled={!value1 || !value2 || !isReady || isEncrypting}
            isLoading={isEncrypting}
            className="w-full"
          >
            Step 1: Encrypt Values
          </Button>
        </div>

        {/* Encrypted Values Display */}
        {encrypted1 && encrypted2 && (
          <div className="border-t pt-4 space-y-4">
            <div className="bg-gray-50 p-4 rounded border border-gray-200">
              <h4 className="text-sm font-semibold text-gray-900 mb-2">Encrypted Values</h4>
              <div className="space-y-2 text-xs font-mono">
                <div>
                  <span className="font-semibold">Value 1:</span> {encrypted1.handle.substring(0, 20)}...
                </div>
                <div>
                  <span className="font-semibold">Value 2:</span> {encrypted2.handle.substring(0, 20)}...
                </div>
              </div>
            </div>

            <Button
              onClick={handleCompute}
              variant="secondary"
              disabled={isComputing}
              isLoading={isComputing}
              className="w-full"
            >
              Step 2: Compute ({getOperationSymbol(operation)})
            </Button>
          </div>
        )}

        {/* Computation Result Display */}
        {computationResult && (
          <div className="border-t pt-4 space-y-4">
            <div className="bg-purple-50 p-4 rounded border border-purple-200">
              <h4 className="text-sm font-semibold text-purple-900 mb-2">Encrypted Result</h4>
              <div className="text-xs font-mono break-all text-purple-800">
                {computationResult.handle}
              </div>
            </div>

            <Button
              onClick={handleDecryptResult}
              disabled={isDecrypting}
              isLoading={isDecrypting}
              className="w-full"
            >
              Step 3: Decrypt Result
            </Button>
          </div>
        )}

        {/* Final Result Display */}
        {finalResult !== null && (
          <div className="border-t pt-4">
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Final Result
            </label>
            <div className="bg-green-50 p-6 rounded border border-green-200">
              <div className="text-center">
                <div className="text-sm text-green-800 mb-2">
                  {value1} {getOperationSymbol(operation)} {value2} =
                </div>
                <div className="text-3xl font-bold text-green-900">
                  {finalResult}
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Reset Button */}
        {(encrypted1 || computationResult) && (
          <Button onClick={handleReset} variant="ghost" className="w-full">
            Reset Demo
          </Button>
        )}

        {/* Info Section */}
        <div className="bg-blue-50 p-4 rounded border border-blue-200">
          <h4 className="text-sm font-semibold text-blue-900 mb-2">How it works:</h4>
          <ul className="text-sm text-blue-800 space-y-1 list-disc list-inside">
            <li>Both values are encrypted on the client side</li>
            <li>Computation is performed on encrypted data (server-side)</li>
            <li>The result remains encrypted throughout the process</li>
            <li>Only you can decrypt the final result with your private key</li>
          </ul>
        </div>
      </CardContent>
    </Card>
  );
}
