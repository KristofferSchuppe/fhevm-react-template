/**
 * Encryption API Route
 * Handles encryption requests
 */

import { NextRequest, NextResponse } from 'next/server';
import { ApiResponse, EncryptionRequest, EncryptionResponse } from '@/types/api';
import { isValidNumber } from '@/lib/utils/validation';

/**
 * POST /api/fhe/encrypt
 * Encrypt a value using FHE
 */
export async function POST(request: NextRequest) {
  try {
    const body: EncryptionRequest = await request.json();

    // Validate request
    if (!body.value) {
      return NextResponse.json(
        {
          success: false,
          error: 'Value is required',
        },
        { status: 400 }
      );
    }

    const numValue = typeof body.value === 'string' ? parseFloat(body.value) : body.value;

    if (!isValidNumber(numValue)) {
      return NextResponse.json(
        {
          success: false,
          error: 'Invalid value provided',
        },
        { status: 400 }
      );
    }

    const type = body.type || 'euint32';

    // In production, use @fhevm-toolkit/sdk to encrypt
    // For now, simulate encryption
    const simulatedCiphertext = Buffer.from(
      JSON.stringify({ value: numValue, type, timestamp: Date.now() })
    ).toString('base64');

    const response: ApiResponse<EncryptionResponse> = {
      success: true,
      data: {
        encrypted: {
          ciphertext: simulatedCiphertext,
          handle: `handle_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
          type: type,
        },
        publicKey: 'server-public-key-placeholder',
      },
      message: 'Value encrypted successfully',
    };

    return NextResponse.json(response);
  } catch (error) {
    console.error('Encryption error:', error);

    return NextResponse.json(
      {
        success: false,
        error: 'Encryption failed',
        details: error instanceof Error ? error.message : 'Unknown error',
      },
      { status: 500 }
    );
  }
}
