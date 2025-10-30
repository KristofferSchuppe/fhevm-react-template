/**
 * Computation API Route
 * Handles homomorphic computation requests on encrypted data
 */

import { NextRequest, NextResponse } from 'next/server';
import { ApiResponse, ComputationRequest, ComputationResponse } from '@/types/api';
import { fheServer } from '@/lib/fhe/server';
import { EncryptedData } from '@/types/fhe';

/**
 * POST /api/fhe/compute
 * Perform homomorphic computation on encrypted data
 */
export async function POST(request: NextRequest) {
  try {
    const body: ComputationRequest = await request.json();

    // Validate request
    if (!body.operation || !body.operand1 || !body.operand2) {
      return NextResponse.json(
        {
          success: false,
          error: 'Operation and both operands are required',
        },
        { status: 400 }
      );
    }

    // Validate operation type
    const validOperations = ['add', 'subtract', 'multiply', 'divide', 'compare'];
    if (!validOperations.includes(body.operation)) {
      return NextResponse.json(
        {
          success: false,
          error: `Invalid operation. Must be one of: ${validOperations.join(', ')}`,
        },
        { status: 400 }
      );
    }

    // Convert API format to internal EncryptedData format
    const operand1: EncryptedData = {
      ciphertext: Buffer.from(body.operand1.ciphertext, 'base64'),
      handle: body.operand1.handle,
      type: body.operand1.type as any,
    };

    const operand2: EncryptedData = {
      ciphertext: Buffer.from(body.operand2.ciphertext, 'base64'),
      handle: body.operand2.handle,
      type: body.operand2.type as any,
    };

    // Perform computation using FHE server
    // In production, this would use @fhevm-toolkit/sdk
    const computationResult = await fheServer.compute(
      body.operation,
      operand1,
      operand2
    );

    // Convert result back to API format
    const response: ApiResponse<ComputationResponse> = {
      success: true,
      data: {
        result: {
          ciphertext: Buffer.from(computationResult.result.ciphertext).toString('base64'),
          handle: computationResult.result.handle,
          type: computationResult.result.type,
        },
        operation: body.operation,
      },
      message: 'Computation completed successfully',
    };

    return NextResponse.json(response);
  } catch (error) {
    console.error('Computation error:', error);

    return NextResponse.json(
      {
        success: false,
        error: 'Computation failed',
        details: error instanceof Error ? error.message : 'Unknown error',
      },
      { status: 500 }
    );
  }
}

/**
 * GET /api/fhe/compute
 * Get supported computation operations
 */
export async function GET(request: NextRequest) {
  const response = {
    success: true,
    data: {
      supportedOperations: [
        {
          operation: 'add',
          description: 'Add two encrypted values',
        },
        {
          operation: 'subtract',
          description: 'Subtract two encrypted values',
        },
        {
          operation: 'multiply',
          description: 'Multiply two encrypted values',
        },
        {
          operation: 'compare',
          description: 'Compare two encrypted values (greater than)',
        },
      ],
    },
  };

  return NextResponse.json(response);
}
