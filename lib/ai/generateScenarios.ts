import Anthropic from '@anthropic-ai/sdk';
import { ProjectInputs } from '../types';

const client = new Anthropic();

export interface GeneratedScenario {
  id: 'A' | 'B' | 'C';
  name: string;
  summary: string;
  strategy: string;
  capitalExpenditure: number;
  projectedAnnualIncome: number;
  netYield: number;
  irr: number;
  esgRating: string;
  riskLevel: 'Low' | 'Medium' | 'High';
  complexity: 'Low' | 'Medium' | 'High';
  timelineMonths: number;
  keyConsiderations: string[];
  epcRatingAchieved: string;
  meesCompliant: boolean;
  paybackPeriod: number;
}

export interface ScenarioResponse {
  scenarios: {
    A: GeneratedScenario;
    B: GeneratedScenario;
    C: GeneratedScenario;
  };
  recommendation: 'A' | 'B' | 'C';
  recommendationRationale: string;
}

interface PropertyContext {
  name: string;
  address: string;
  city: string;
  propertyType: string;
  size: number;
  yearBuilt: number;
}

export async function generateAIScenarios(
  property: PropertyContext,
  inputs: ProjectInputs
): Promise<ScenarioResponse> {
  const systemPrompt = `You are Clarion's AI analyst - an expert in UK commercial real estate investment, development feasibility, and ESG compliance. You combine the analytical rigour of a Big Four property team with practical development experience.

Your task is to generate three distinct, realistic development scenarios for a property based on the provided inputs. Each scenario must be genuinely different in strategy, not just variations in numbers.

CRITICAL RULES:
1. All financial figures must be realistic for the UK market
2. Consider planning constraints seriously - listed buildings and conservation areas have real limitations
3. ESG/EPC requirements are legally binding - MEES regulations mean EPC E or below cannot be let after 2023, and this tightens to EPC C by 2027-2030
4. Your scenarios should reflect genuine strategic choices an investor would consider
5. Be specific about WHY each scenario makes sense for THIS building
6. IRR should typically range from 5-20% depending on risk
7. Net yields in UK commercial typically range from 4-8%
8. Payback periods should be realistic (3-15 years typically)

OUTPUT FORMAT:
Return valid JSON matching this structure exactly:
{
  "scenarios": {
    "A": {
      "id": "A",
      "name": "Scenario name (max 3 words)",
      "summary": "One sentence summary",
      "strategy": "2-3 sentence strategic rationale",
      "capitalExpenditure": 0,
      "projectedAnnualIncome": 0,
      "netYield": 0.0,
      "irr": 0.0,
      "esgRating": "A/B/C/D/E/F",
      "riskLevel": "Low/Medium/High",
      "complexity": "Low/Medium/High",
      "timelineMonths": 0,
      "keyConsiderations": ["point 1", "point 2", "point 3"],
      "epcRatingAchieved": "A/B/C/D/E/F/G",
      "meesCompliant": true/false,
      "paybackPeriod": 0.0
    },
    "B": { ... },
    "C": { ... }
  },
  "recommendation": "A/B/C",
  "recommendationRationale": "2-3 sentences explaining why this scenario is recommended for this specific property"
}`;

  const userPrompt = `Analyse this property and generate three development scenarios:

PROPERTY DETAILS:
Name: ${property.name}
Address: ${property.address}, ${property.city}
Type: ${property.propertyType}
Size: ${property.size} sqm
Year Built: ${property.yearBuilt}

BUILDING CONDITION:
${inputs.condition ? JSON.stringify(inputs.condition, null, 2) : 'Not provided'}

PLANNING & ARCHITECTURE:
${inputs.planning ? JSON.stringify(inputs.planning, null, 2) : 'Not provided'}

MEP & SERVICES:
${inputs.mep ? JSON.stringify(inputs.mep, null, 2) : 'Not provided'}

COSTS & FINANCIALS:
${inputs.costs ? JSON.stringify(inputs.costs, null, 2) : 'Not provided'}

ESG & COMPLIANCE:
${inputs.esg ? JSON.stringify(inputs.esg, null, 2) : 'Not provided'}

Generate three scenarios:
- Scenario A: Conservative / Status Quo approach - minimal intervention
- Scenario B: Value-Add / Moderate intervention - balanced risk/return
- Scenario C: Maximum Value / Transformational - highest potential but more complex

Consider the specific constraints and opportunities of THIS building. Return JSON only, no other text or markdown.`;

  const response = await client.messages.create({
    model: 'claude-sonnet-4-20250514',
    max_tokens: 4096,
    messages: [
      {
        role: 'user',
        content: userPrompt,
      },
    ],
    system: systemPrompt,
  });

  const content = response.content[0];
  if (content.type !== 'text') {
    throw new Error('Unexpected response type');
  }

  // Extract JSON from response (handle potential markdown wrapping)
  let jsonText = content.text;
  const jsonMatch = jsonText.match(/\{[\s\S]*\}/);
  if (jsonMatch) {
    jsonText = jsonMatch[0];
  }

  return JSON.parse(jsonText) as ScenarioResponse;
}
