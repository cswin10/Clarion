import { NextRequest, NextResponse } from 'next/server';
import { getMarketInsights } from '@/lib/ai/marketResearch';

export async function POST(request: NextRequest) {
  try {
    const context = await request.json();

    if (!context.address || !context.city) {
      return NextResponse.json(
        { error: 'Missing address or city' },
        { status: 400 }
      );
    }

    const insights = await getMarketInsights(context);
    return NextResponse.json(insights);
  } catch (error) {
    console.error('Market research error:', error);
    return NextResponse.json(
      { error: 'Failed to get market insights' },
      { status: 500 }
    );
  }
}
