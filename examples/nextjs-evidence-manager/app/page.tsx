'use client';

import { useFhevmClient, useEncrypt } from '@fhevm-toolkit/sdk';
import { useAccount, useWalletClient } from 'wagmi';
import { walletClientToSigner } from '../lib/ethers';
import { useState } from 'react';

export default function Home() {
  const { address, isConnected } = useAccount();
  const { data: walletClient } = useWalletClient();
  const [value, setValue] = useState('');

  // Initialize FHEVM client
  const signer = walletClient ? walletClientToSigner(walletClient) : undefined;

  const { client, isInitialized, isInitializing } = useFhevmClient({
    provider: signer?.provider,
    signer,
    chainId: 11155111 // Sepolia
  });

  const { encrypt, isEncrypting } = useEncrypt(client);

  const handleEncrypt = async () => {
    if (!value || !client) return;

    const result = await encrypt({
      value: parseInt(value),
      type: 'uint64',
      contractAddress: process.env.NEXT_PUBLIC_CONTRACT_ADDRESS || ''
    });

    console.log('Encrypted:', result);
    alert('Value encrypted successfully!');
  };

  return (
    <main className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 py-12 px-4">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold text-gray-900 mb-4">
            🔐 FHEVM SDK Demo
          </h1>
          <p className="text-lg text-gray-600">
            Next.js + Privacy Evidence Manager Example
          </p>
        </div>

        {/* Status Card */}
        <div className="bg-white rounded-lg shadow-lg p-6 mb-8">
          <h2 className="text-2xl font-semibold mb-4">Status</h2>
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <span className="text-gray-700">Wallet:</span>
              <span className={`font-mono ${isConnected ? 'text-green-600' : 'text-red-600'}`}>
                {isConnected ? address : 'Not connected'}
              </span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-gray-700">FHEVM Client:</span>
              <span className={`font-semibold ${isInitialized ? 'text-green-600' : 'text-yellow-600'}`}>
                {isInitializing ? 'Initializing...' : isInitialized ? 'Ready ✓' : 'Not initialized'}
              </span>
            </div>
          </div>
        </div>

        {/* Encryption Demo */}
        {isConnected && isInitialized && (
          <div className="bg-white rounded-lg shadow-lg p-6 mb-8">
            <h2 className="text-2xl font-semibold mb-4">Encrypt Value</h2>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Enter a number to encrypt
                </label>
                <input
                  type="number"
                  value={value}
                  onChange={(e) => setValue(e.target.value)}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  placeholder="42"
                />
              </div>
              <button
                onClick={handleEncrypt}
                disabled={!value || isEncrypting}
                className="w-full bg-blue-600 text-white px-6 py-3 rounded-lg font-semibold hover:bg-blue-700 disabled:bg-gray-400 disabled:cursor-not-allowed transition-colors"
              >
                {isEncrypting ? 'Encrypting...' : 'Encrypt Value'}
              </button>
            </div>
          </div>
        )}

        {/* Features */}
        <div className="grid md:grid-cols-2 gap-6">
          <div className="bg-white rounded-lg shadow-lg p-6">
            <h3 className="text-xl font-semibold mb-3 flex items-center">
              <span className="text-2xl mr-2">🔒</span>
              Encryption
            </h3>
            <p className="text-gray-600">
              Encrypt values client-side before sending to the blockchain
            </p>
          </div>

          <div className="bg-white rounded-lg shadow-lg p-6">
            <h3 className="text-xl font-semibold mb-3 flex items-center">
              <span className="text-2xl mr-2">📝</span>
              Evidence Manager
            </h3>
            <p className="text-gray-600">
              Submit and manage confidential legal evidence
            </p>
          </div>

          <div className="bg-white rounded-lg shadow-lg p-6">
            <h3 className="text-xl font-semibold mb-3 flex items-center">
              <span className="text-2xl mr-2">🎯</span>
              Framework-Agnostic
            </h3>
            <p className="text-gray-600">
              Works with Next.js, React, Vue, or vanilla JavaScript
            </p>
          </div>

          <div className="bg-white rounded-lg shadow-lg p-6">
            <h3 className="text-xl font-semibold mb-3 flex items-center">
              <span className="text-2xl mr-2">⚡</span>
              Developer-Friendly
            </h3>
            <p className="text-gray-600">
              Wagmi-like API with React hooks and minimal boilerplate
            </p>
          </div>
        </div>

        {/* Footer */}
        <div className="text-center mt-12 text-gray-600">
          <p>Built with @fhevm-toolkit/sdk</p>
          <p className="text-sm">Zama FHEVM Challenge Submission</p>
        </div>
      </div>
    </main>
  );
}
