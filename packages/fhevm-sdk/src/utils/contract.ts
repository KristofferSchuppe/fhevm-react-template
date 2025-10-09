/**
 * Contract interaction utilities
 */

import { Contract, InterfaceAbi } from 'ethers';
import type { Signer, Provider } from 'ethers';
import type { ContractOptions } from '../types';

/**
 * Create contract instance
 */
export function createContract(
  address: string,
  abi: InterfaceAbi,
  signerOrProvider: Signer | Provider
): Contract {
  return new Contract(address, abi, signerOrProvider);
}

/**
 * Get contract with options
 */
export function getContract(
  options: ContractOptions,
  signerOrProvider: Signer | Provider
): Contract {
  return createContract(options.address, options.abi, signerOrProvider);
}

/**
 * Wait for transaction with retry logic
 */
export async function waitForTransaction(
  tx: any,
  confirmations: number = 1,
  timeout: number = 120000
): Promise<any> {
  const receipt = await tx.wait(confirmations, timeout);
  return receipt;
}

/**
 * Estimate gas with buffer
 */
export async function estimateGasWithBuffer(
  contract: Contract,
  method: string,
  args: any[],
  buffer: number = 1.2
): Promise<bigint> {
  const estimated = await contract[method].estimateGas(...args);
  return (estimated * BigInt(Math.floor(buffer * 100))) / 100n;
}

/**
 * Call contract method with encrypted input
 */
export async function callWithEncryptedInput(
  contract: Contract,
  method: string,
  args: any[],
  encryptedInput: any
): Promise<any> {
  const tx = await contract[method](...args, encryptedInput.handles, encryptedInput.inputProof);
  return tx;
}
