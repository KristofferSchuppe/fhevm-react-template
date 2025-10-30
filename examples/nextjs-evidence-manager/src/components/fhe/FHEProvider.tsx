/**
 * FHE Provider Component
 * Context provider for FHE operations throughout the application
 */

'use client';

import React, { createContext, useContext, ReactNode } from 'react';
import { useFHE } from '@/hooks/useFHE';
import { FHEContextState, EncryptedData } from '@/types/fhe';

interface FHEContextValue extends FHEContextState {
  initialize: () => Promise<void>;
  encrypt: (
    value: number,
    type?: 'euint8' | 'euint16' | 'euint32' | 'euint64'
  ) => Promise<EncryptedData>;
  decrypt: (encrypted: EncryptedData) => Promise<number | bigint>;
  getPublicKey: () => string | null;
  generateKeys: () => Promise<any>;
}

const FHEContext = createContext<FHEContextValue | undefined>(undefined);

interface FHEProviderProps {
  children: ReactNode;
}

/**
 * FHE Provider component that wraps the application
 * Provides FHE functionality to all child components
 */
export function FHEProvider({ children }: FHEProviderProps) {
  const fhe = useFHE();

  const value: FHEContextValue = {
    isInitialized: fhe.isInitialized,
    publicKey: fhe.publicKey,
    isLoading: fhe.isLoading,
    error: fhe.error,
    initialize: fhe.initialize,
    encrypt: fhe.encrypt,
    decrypt: fhe.decrypt,
    getPublicKey: fhe.getPublicKey,
    generateKeys: fhe.generateKeys,
  };

  return <FHEContext.Provider value={value}>{children}</FHEContext.Provider>;
}

/**
 * Hook to access FHE context
 * Must be used within FHEProvider
 */
export function useFHEContext() {
  const context = useContext(FHEContext);

  if (context === undefined) {
    throw new Error('useFHEContext must be used within FHEProvider');
  }

  return context;
}

/**
 * FHE Status Display Component
 * Shows the current status of FHE initialization
 */
export function FHEStatus() {
  const { isInitialized, isLoading, error, publicKey } = useFHEContext();

  if (isLoading) {
    return (
      <div className="flex items-center space-x-2 text-sm text-gray-600">
        <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-blue-600"></div>
        <span>Initializing FHE...</span>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex items-center space-x-2 text-sm text-red-600">
        <svg
          className="h-4 w-4"
          fill="currentColor"
          viewBox="0 0 20 20"
        >
          <path
            fillRule="evenodd"
            d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z"
            clipRule="evenodd"
          />
        </svg>
        <span>FHE Error: {error}</span>
      </div>
    );
  }

  if (isInitialized) {
    return (
      <div className="flex items-center space-x-2 text-sm text-green-600">
        <svg
          className="h-4 w-4"
          fill="currentColor"
          viewBox="0 0 20 20"
        >
          <path
            fillRule="evenodd"
            d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"
            clipRule="evenodd"
          />
        </svg>
        <span>FHE Ready</span>
      </div>
    );
  }

  return null;
}
