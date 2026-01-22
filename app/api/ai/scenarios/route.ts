import { NextRequest, NextResponse } from 'next/server';
import { generateAIScenarios } from '@/lib/ai/generateScenarios';

export async function POST(request: NextRequest) {
  try {
    const { property, inputs } = await request.json();

    if (!property || !inputs) {
      return NextResponse.json(
        { error: 'Missing property or inputs' },
        { status: 400 }
      );
    }

    const scenarios = await generateAIScenarios(property, inputs);
    return NextResponse.json(scenarios);
  } catch (error) {
    console.error('Scenario generation error:', error);
    return NextResponse.json(
      { error: 'Failed to generate scenarios' },
      { status: 500 }
    );
  }
}
