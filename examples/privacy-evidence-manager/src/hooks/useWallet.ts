import { useState, useEffect } from 'react';
import { ethers } from 'ethers';

export function useWallet() {
  const [provider, setProvider] = useState<ethers.BrowserProvider | null>(null);
  const [signer, setSigner] = useState<ethers.Signer | null>(null);
  const [address, setAddress] = useState<string>('');
  const [isConnected, setIsConnected] = useState(false);

  useEffect(() => {
    checkConnection();
  }, []);

  const checkConnection = async () => {
    if (typeof window.ethereum !== 'undefined') {
      const browserProvider = new ethers.BrowserProvider(window.ethereum);
      setProvider(browserProvider);

      const accounts = await browserProvider.listAccounts();
      if (accounts.length > 0) {
        const userSigner = await browserProvider.getSigner();
        setSigner(userSigner);
        setAddress(await userSigner.getAddress());
        setIsConnected(true);
      }
    }
  };

  const connect = async () => {
    try {
      await window.ethereum.request({ method: 'eth_requestAccounts' });
      await checkConnection();
    } catch (error) {
      console.error('Failed to connect wallet:', error);
    }
  };

  return { provider, signer, address, isConnected, connect };
}
