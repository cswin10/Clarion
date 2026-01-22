import { NextRequest, NextResponse } from 'next/server';
import { validateInputs } from '@/lib/ai/validateInputs';

export async function POST(request: NextRequest) {
  try {
    const { inputs, propertySize, propertyType } = await request.json();

    if (!inputs) {
      return NextResponse.json(
        { error: 'Missing inputs' },
        { status: 400 }
      );
    }

    const validation = await validateInputs(
      inputs,
      propertySize || 1000,
      propertyType || 'Office'
    );
    return NextResponse.json(validation);
  } catch (error) {
    console.error('Validation error:', error);
    return NextResponse.json(
      { isValid: true, warnings: [] },
      { status: 200 }
    );
  }
}
