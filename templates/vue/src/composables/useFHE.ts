import { ref } from 'vue';
import { FhevmClient } from '@fhevm-toolkit/sdk';
import { ethers } from 'ethers';

export function useFHE() {
  const client = ref<FhevmClient | null>(null);
  const isInitialized = ref(false);
  const error = ref<string | null>(null);

  const initializeFHE = async () => {
    try {
      error.value = null;

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
      client.value = fhevmClient;
      isInitialized.value = true;
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to initialize FHE client';
      error.value = errorMessage;
      console.error('FHE initialization error:', err);
    }
  };

  return {
    client,
    isInitialized,
    error,
    initializeFHE,
  };
}
