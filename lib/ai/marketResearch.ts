import Anthropic from '@anthropic-ai/sdk';

const client = new Anthropic();

export interface MarketContext {
  address: string;
  city: string;
  propertyType: string;
  size: number;
  assumedRent: number;
  assumedYield: number;
}

export interface MarketInsights {
  rentBenchmark: string;
  yieldBenchmark: string;
  recentTransactions: string;
  marketTrends: string;
  validationNotes: string;
}

export async function getMarketInsights(
  context: MarketContext
): Promise<MarketInsights> {
  const response = await client.messages.create({
    model: 'claude-sonnet-4-20250514',
    max_tokens: 4096,
    tools: [
      {
        type: 'web_search_20250305',
        name: 'web_search',
      },
    ],
    messages: [
      {
        role: 'user',
        content: `Research current market data for this property investment analysis:

Property: ${context.propertyType} in ${context.city}
Address: ${context.address}
Size: ${context.size} sqm
User's assumed rent: £${context.assumedRent}/sqm/year
User's assumed yield: ${context.assumedYield}%

Search for:
1. Current market rents for similar ${context.propertyType} properties in ${context.city}
2. Recent transaction yields for comparable assets
3. Any relevant market news or trends for ${context.city} ${context.propertyType} market

Then provide a structured assessment comparing the user's assumptions to market reality.

Return JSON only (no markdown):
{
  "rentBenchmark": "2-3 sentences on market rents vs user assumption",
  "yieldBenchmark": "2-3 sentences on market yields vs user assumption",
  "recentTransactions": "Notable recent comparable transactions if found",
  "marketTrends": "Key market trends affecting this asset type/location",
  "validationNotes": "Overall assessment - are the user's assumptions realistic?"
}`,
      },
    ],
  });

  // Extract the final text response after web search
  const textContent = response.content.find((c) => c.type === 'text');
  if (!textContent || textContent.type !== 'text') {
    throw new Error('No text response');
  }

  // Parse JSON from response
  const jsonMatch = textContent.text.match(/\{[\s\S]*\}/);
  if (!jsonMatch) {
    throw new Error('No JSON in response');
  }

  return JSON.parse(jsonMatch[0]) as MarketInsights;
}
