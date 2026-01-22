import { NextRequest, NextResponse } from 'next/server';
import { generateNarratives } from '@/lib/ai/generateNarratives';

export async function POST(request: NextRequest) {
  try {
    const { property, inputs, scenarios } = await request.json();

    if (!property || !inputs || !scenarios) {
      return NextResponse.json(
        { error: 'Missing property, inputs, or scenarios' },
        { status: 400 }
      );
    }

    const narratives = await generateNarratives(property, inputs, scenarios);
    return NextResponse.json(narratives);
  } catch (error) {
    console.error('Narrative generation error:', error);
    return NextResponse.json(
      { error: 'Failed to generate narratives' },
      { status: 500 }
    );
  }
}
