import { FhevmClient } from '@fhevm-toolkit/sdk';
import { ethers } from 'ethers';

export async function createFhevmClient(
  provider: ethers.Provider,
  signer: ethers.Signer,
  chainId: number
): Promise<FhevmClient> {
  const client = new FhevmClient({
    provider,
    signer,
    chainId,
  });

  await client.init();
  return client;
}

export async function encryptValue(
  client: FhevmClient,
  value: number | boolean | string,
  type: string,
  contractAddress: string
) {
  return await client.encryptInput({
    value,
    type,
    contractAddress,
  });
}

export async function generatePermission(
  client: FhevmClient,
  contractAddress: string
) {
  return await client.generatePermissionSignature(contractAddress);
}
