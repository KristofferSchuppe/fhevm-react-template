/**
 * useComputation Hook
 * Hook for performing homomorphic computations on encrypted data
 */

'use client';

import { useState, useCallback } from 'react';
import { EncryptedData, ComputationType, ComputationResult } from '@/types/fhe';
import { ComputationRequest, ComputationResponse, ApiResponse } from '@/types/api';

interface ComputationState {
  isComputing: boolean;
  error: string | null;
  lastResult: ComputationResult | null;
}

export function useComputation() {
  const [state, setState] = useState<ComputationState>({
    isComputing: false,
    error: null,
    lastResult: null,
  });

  /**
   * Perform a computation on encrypted data
   */
  const compute = useCallback(
    async (
      operation: ComputationType,
      operand1: EncryptedData,
      operand2: EncryptedData
    ): Promise<EncryptedData> => {
      setState((prev) => ({
        ...prev,
        isComputing: true,
        error: null,
      }));

      try {
        // Prepare request payload
        const request: ComputationRequest = {
          operation,
          operand1: {
            ciphertext: Buffer.from(operand1.ciphertext).toString('base64'),
            handle: operand1.handle,
            type: operand1.type,
          },
          operand2: {
            ciphertext: Buffer.from(operand2.ciphertext).toString('base64'),
            handle: operand2.handle,
            type: operand2.type,
          },
        };

        // Call computation API
        const response = await fetch('/api/fhe/compute', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(request),
        });

        if (!response.ok) {
          throw new Error(`Computation failed: ${response.statusText}`);
        }

        const data: ApiResponse<ComputationResponse> = await response.json();

        if (!data.success || !data.data) {
          throw new Error(data.error || 'Computation failed');
        }

        // Convert result back to EncryptedData
        const result: EncryptedData = {
          ciphertext: Buffer.from(data.data.result.ciphertext, 'base64'),
          handle: data.data.result.handle,
          type: data.data.result.type as any,
        };

        const computationResult: ComputationResult = {
          result,
          operation,
          timestamp: Date.now(),
        };

        setState({
          isComputing: false,
          error: null,
          lastResult: computationResult,
        });

        return result;
      } catch (error) {
        const errorMessage = error instanceof Error ? error.message : 'Computation failed';

        setState((prev) => ({
          ...prev,
          isComputing: false,
          error: errorMessage,
        }));

        throw error;
      }
    },
    []
  );

  /**
   * Add two encrypted values
   */
  const add = useCallback(
    async (operand1: EncryptedData, operand2: EncryptedData) => {
      return compute('add', operand1, operand2);
    },
    [compute]
  );

  /**
   * Subtract two encrypted values
   */
  const subtract = useCallback(
    async (operand1: EncryptedData, operand2: EncryptedData) => {
      return compute('subtract', operand1, operand2);
    },
    [compute]
  );

  /**
   * Multiply two encrypted values
   */
  const multiply = useCallback(
    async (operand1: EncryptedData, operand2: EncryptedData) => {
      return compute('multiply', operand1, operand2);
    },
    [compute]
  );

  /**
   * Compare two encrypted values
   */
  const compare = useCallback(
    async (operand1: EncryptedData, operand2: EncryptedData) => {
      return compute('compare', operand1, operand2);
    },
    [compute]
  );

  /**
   * Perform batch computations
   */
  const computeBatch = useCallback(
    async (
      operations: Array<{
        operation: ComputationType;
        operand1: EncryptedData;
        operand2: EncryptedData;
      }>
    ): Promise<EncryptedData[]> => {
      setState((prev) => ({
        ...prev,
        isComputing: true,
        error: null,
      }));

      try {
        const results = await Promise.all(
          operations.map((op) => compute(op.operation, op.operand1, op.operand2))
        );

        setState((prev) => ({
          ...prev,
          isComputing: false,
        }));

        return results;
      } catch (error) {
        const errorMessage = error instanceof Error ? error.message : 'Batch computation failed';

        setState((prev) => ({
          ...prev,
          isComputing: false,
          error: errorMessage,
        }));

        throw error;
      }
    },
    [compute]
  );

  /**
   * Clear error state
   */
  const clearError = useCallback(() => {
    setState((prev) => ({
      ...prev,
      error: null,
    }));
  }, []);

  /**
   * Reset state
   */
  const reset = useCallback(() => {
    setState({
      isComputing: false,
      error: null,
      lastResult: null,
    });
  }, []);

  return {
    ...state,
    compute,
    add,
    subtract,
    multiply,
    compare,
    computeBatch,
    clearError,
    reset,
  };
}
