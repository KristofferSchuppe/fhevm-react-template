import React, { createContext, useContext, useState } from 'react';
import { FhevmClient } from '@fhevm-toolkit/sdk';
import { ethers } from 'ethers';

interface FHEContextType {
  client: FhevmClient | null;
  isInitialized: boolean;
  error: string | null;
  init: () => Promise<void>;
}

const FHEContext = createContext<FHEContextType | undefined>(undefined);

export const useFHE = () => {
  const context = useContext(FHEContext);
  if (!context) {
    throw new Error('useFHE must be used within FHEProvider');
  }
  return context;
};

export const FHEProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [client, setClient] = useState<FhevmClient | null>(null);
  const [isInitialized, setIsInitialized] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const init = async () => {
    try {
      setError(null);

      if (typeof window === 'undefined' || !window.ethereum) {
        throw new Error('Please install MetaMask or another Web3 wallet');
      }

      const provider = new ethers.BrowserProvider(window.ethereum);
      await provider.send('eth_requestAccounts', []);
      const signer = await provider.getSigner();
      const network = await provider.getNetwork();

      const fhevmClient = new FhevmClient({
        provider,
        signer,
        chainId: Number(network.chainId),
      });

      await fhevmClient.init();
      setClient(fhevmClient);
      setIsInitialized(true);
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to initialize FHE client';
      setError(errorMessage);
      console.error('FHE initialization error:', err);
    }
  };

  return (
    <FHEContext.Provider value={{ client, isInitialized, error, init }}>
      {children}
    </FHEContext.Provider>
  );
};
