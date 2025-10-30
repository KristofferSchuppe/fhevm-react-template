import { NextRequest, NextResponse } from 'next/server';

export async function POST(request: NextRequest) {
  try {
    const { operation, operands } = await request.json();

    if (!operation || !operands || !Array.isArray(operands)) {
      return NextResponse.json(
        { error: 'Missing or invalid parameters' },
        { status: 400 }
      );
    }

    // In a real implementation, this would perform homomorphic computation
    // For demo purposes, we simulate the computation
    let result;
    switch (operation) {
      case 'add':
        result = operands.reduce((a, b) => a + b, 0);
        break;
      case 'multiply':
        result = operands.reduce((a, b) => a * b, 1);
        break;
      case 'compare':
        result = operands[0] > operands[1];
        break;
      default:
        return NextResponse.json(
          { error: 'Unknown operation' },
          { status: 400 }
        );
    }

    return NextResponse.json({
      success: true,
      result,
      operation,
      operands
    });
  } catch (error) {
    return NextResponse.json(
      { error: 'Computation failed' },
      { status: 500 }
    );
  }
}
