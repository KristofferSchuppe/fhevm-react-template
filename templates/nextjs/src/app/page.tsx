'use client';

import { useState } from 'react';
import { FHEProvider } from '@/components/fhe/FHEProvider';
import { EncryptionDemo } from '@/components/fhe/EncryptionDemo';
import { ComputationDemo } from '@/components/fhe/ComputationDemo';
import { KeyManager } from '@/components/fhe/KeyManager';

export default function Home() {
  const [activeTab, setActiveTab] = useState<'encryption' | 'computation' | 'keys'>('encryption');

  return (
    <FHEProvider>
      <main className="min-h-screen bg-gray-50 py-12">
        <div className="container mx-auto px-4 max-w-6xl">
          <header className="mb-12 text-center">
            <h1 className="text-4xl font-bold text-gray-900 mb-4">
              FHEVM SDK Demo
            </h1>
            <p className="text-lg text-gray-600">
              Fully Homomorphic Encryption on Ethereum - Next.js Template
            </p>
          </header>

          <div className="mb-8">
            <nav className="flex space-x-4 border-b border-gray-200">
              <button
                onClick={() => setActiveTab('encryption')}
                className={`px-4 py-2 font-medium ${
                  activeTab === 'encryption'
                    ? 'border-b-2 border-blue-500 text-blue-600'
                    : 'text-gray-500 hover:text-gray-700'
                }`}
              >
                Encryption Demo
              </button>
              <button
                onClick={() => setActiveTab('computation')}
                className={`px-4 py-2 font-medium ${
                  activeTab === 'computation'
                    ? 'border-b-2 border-blue-500 text-blue-600'
                    : 'text-gray-500 hover:text-gray-700'
                }`}
              >
                Computation Demo
              </button>
              <button
                onClick={() => setActiveTab('keys')}
                className={`px-4 py-2 font-medium ${
                  activeTab === 'keys'
                    ? 'border-b-2 border-blue-500 text-blue-600'
                    : 'text-gray-500 hover:text-gray-700'
                }`}
              >
                Key Manager
              </button>
            </nav>
          </div>

          <div className="bg-white rounded-lg shadow-lg p-8">
            {activeTab === 'encryption' && <EncryptionDemo />}
            {activeTab === 'computation' && <ComputationDemo />}
            {activeTab === 'keys' && <KeyManager />}
          </div>
        </div>
      </main>
    </FHEProvider>
  );
}
