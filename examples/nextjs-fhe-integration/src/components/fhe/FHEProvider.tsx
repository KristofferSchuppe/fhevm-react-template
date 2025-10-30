'use client';

import React, { createContext, useContext, useState, useEffect } from 'react';
import { FhevmClient } from '@/lib/fhe/client';

interface FHEContextType {
  client: FhevmClient | null;
  isInitialized: boolean;
  error: string | null;
  initialize: () => Promise<void>;
}

const FHEContext = createContext<FHEContextType | undefined>(undefined);

export function FHEProvider({ children }: { children: React.ReactNode }) {
  const [client, setClient] = useState<FhevmClient | null>(null);
  const [isInitialized, setIsInitialized] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const initialize = async () => {
    try {
      setError(null);
      const fhevmClient = new FhevmClient();
      await fhevmClient.init();
      setClient(fhevmClient);
      setIsInitialized(true);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to initialize FHE');
      console.error('FHE initialization error:', err);
    }
  };

  useEffect(() => {
    initialize();
  }, []);

  return (
    <FHEContext.Provider value={{ client, isInitialized, error, initialize }}>
      {children}
    </FHEContext.Provider>
  );
}

export function useFHE() {
  const context = useContext(FHEContext);
  if (context === undefined) {
    throw new Error('useFHE must be used within FHEProvider');
  }
  return context;
}
