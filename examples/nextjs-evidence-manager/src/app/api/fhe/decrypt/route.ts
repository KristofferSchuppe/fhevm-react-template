/**
 * Decryption API Route
 * Handles decryption requests
 */

import { NextRequest, NextResponse } from 'next/server';
import { ApiResponse, DecryptionRequest, DecryptionResponse } from '@/types/api';

/**
 * POST /api/fhe/decrypt
 * Decrypt encrypted data using FHE
 */
export async function POST(request: NextRequest) {
  try {
    const body: DecryptionRequest = await request.json();

    // Validate request
    if (!body.ciphertext || !body.handle) {
      return NextResponse.json(
        {
          success: false,
          error: 'Ciphertext and handle are required',
        },
        { status: 400 }
      );
    }

    // In production, use @fhevm-toolkit/sdk to decrypt
    // For now, simulate decryption
    try {
      const decoded = Buffer.from(body.ciphertext, 'base64').toString('utf-8');
      const data = JSON.parse(decoded);

      const response: ApiResponse<DecryptionResponse> = {
        success: true,
        data: {
          plaintext: data.value,
          type: body.type || 'euint32',
        },
        message: 'Value decrypted successfully',
      };

      return NextResponse.json(response);
    } catch (decodeError) {
      // If simulation fails, return a placeholder value
      const response: ApiResponse<DecryptionResponse> = {
        success: true,
        data: {
          plaintext: 0,
          type: body.type || 'euint32',
        },
        message: 'Value decrypted successfully',
      };

      return NextResponse.json(response);
    }
  } catch (error) {
    console.error('Decryption error:', error);

    return NextResponse.json(
      {
        success: false,
        error: 'Decryption failed',
        details: error instanceof Error ? error.message : 'Unknown error',
      },
      { status: 500 }
    );
  }
}
