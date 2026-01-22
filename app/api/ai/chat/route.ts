import { NextRequest, NextResponse } from 'next/server';
import { chat } from '@/lib/ai/chat';

export async function POST(request: NextRequest) {
  try {
    const { messages, context } = await request.json();

    if (!messages || !context) {
      return NextResponse.json(
        { error: 'Missing messages or context' },
        { status: 400 }
      );
    }

    const response = await chat(messages, context);
    return NextResponse.json({ response });
  } catch (error) {
    console.error('Chat error:', error);
    return NextResponse.json(
      { error: 'Failed to get response' },
      { status: 500 }
    );
  }
}
