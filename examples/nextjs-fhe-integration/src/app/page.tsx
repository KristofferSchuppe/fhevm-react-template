'use client';

import { useState } from 'react';
import { FHEProvider } from '@/components/fhe/FHEProvider';
import { EncryptionDemo } from '@/components/fhe/EncryptionDemo';
import { ComputationDemo } from '@/components/fhe/ComputationDemo';
import { KeyManager } from '@/components/fhe/KeyManager';
import { BankingExample } from '@/components/examples/BankingExample';
import { MedicalExample } from '@/components/examples/MedicalExample';

export default function Home() {
  const [activeTab, setActiveTab] = useState<'encryption' | 'computation' | 'keys' | 'banking' | 'medical'>('encryption');

  return (
    <FHEProvider>
      <main className="min-h-screen bg-gradient-to-br from-gray-900 via-blue-900 to-gray-900 text-white">
        <div className="container mx-auto px-4 py-8">
          {/* Header */}
          <header className="text-center mb-12">
            <h1 className="text-5xl font-bold mb-4 bg-gradient-to-r from-blue-400 to-purple-500 bg-clip-text text-transparent">
              FHEVM Integration Example
            </h1>
            <p className="text-xl text-gray-300">
              Complete Next.js 14 implementation with Fully Homomorphic Encryption
            </p>
          </header>

          {/* Navigation Tabs */}
          <div className="flex flex-wrap justify-center gap-4 mb-8">
            <button
              onClick={() => setActiveTab('encryption')}
              className={`px-6 py-3 rounded-lg font-semibold transition-all ${
                activeTab === 'encryption'
                  ? 'bg-blue-600 text-white shadow-lg'
                  : 'bg-gray-800 text-gray-300 hover:bg-gray-700'
              }`}
            >
              Encryption Demo
            </button>
            <button
              onClick={() => setActiveTab('computation')}
              className={`px-6 py-3 rounded-lg font-semibold transition-all ${
                activeTab === 'computation'
                  ? 'bg-blue-600 text-white shadow-lg'
                  : 'bg-gray-800 text-gray-300 hover:bg-gray-700'
              }`}
            >
              Computation Demo
            </button>
            <button
              onClick={() => setActiveTab('keys')}
              className={`px-6 py-3 rounded-lg font-semibold transition-all ${
                activeTab === 'keys'
                  ? 'bg-blue-600 text-white shadow-lg'
                  : 'bg-gray-800 text-gray-300 hover:bg-gray-700'
              }`}
            >
              Key Manager
            </button>
            <button
              onClick={() => setActiveTab('banking')}
              className={`px-6 py-3 rounded-lg font-semibold transition-all ${
                activeTab === 'banking'
                  ? 'bg-blue-600 text-white shadow-lg'
                  : 'bg-gray-800 text-gray-300 hover:bg-gray-700'
              }`}
            >
              Banking Example
            </button>
            <button
              onClick={() => setActiveTab('medical')}
              className={`px-6 py-3 rounded-lg font-semibold transition-all ${
                activeTab === 'medical'
                  ? 'bg-blue-600 text-white shadow-lg'
                  : 'bg-gray-800 text-gray-300 hover:bg-gray-700'
              }`}
            >
              Medical Example
            </button>
          </div>

          {/* Tab Content */}
          <div className="max-w-6xl mx-auto">
            {activeTab === 'encryption' && <EncryptionDemo />}
            {activeTab === 'computation' && <ComputationDemo />}
            {activeTab === 'keys' && <KeyManager />}
            {activeTab === 'banking' && <BankingExample />}
            {activeTab === 'medical' && <MedicalExample />}
          </div>

          {/* Footer */}
          <footer className="text-center mt-16 text-gray-400">
            <p>Built with FHEVM Toolkit - Fully Homomorphic Encryption for Ethereum</p>
          </footer>
        </div>
      </main>
    </FHEProvider>
  );
}
