import Anthropic from '@anthropic-ai/sdk';
import { ProjectInputs } from '../types';
import { ScenarioResponse } from './generateScenarios';

const client = new Anthropic();

export interface ChatMessage {
  role: 'user' | 'assistant';
  content: string;
}

export interface ChatContext {
  property: {
    name: string;
    address: string;
    city: string;
    propertyType: string;
    size: number;
    yearBuilt: number;
  };
  inputs: ProjectInputs;
  scenarios: ScenarioResponse;
}

export async function chat(
  messages: ChatMessage[],
  context: ChatContext
): Promise<string> {
  const systemPrompt = `You are Clarion's AI assistant, helping users understand their property feasibility analysis. You have complete context about their project.

PROJECT CONTEXT:
Property: ${context.property.name}
Address: ${context.property.address}, ${context.property.city}
Type: ${context.property.propertyType}
Size: ${context.property.size} sqm
Year Built: ${context.property.yearBuilt}

KEY INPUTS:
- Building Condition: ${context.inputs.condition?.overallStructuralCondition || 'N/A'}
- Current EPC: ${context.inputs.esg?.currentEPCRating || 'N/A'}
- Current Rent: £${context.inputs.costs?.currentAnnualRent?.toLocaleString() || 'N/A'}/year
- Property Value: £${context.inputs.costs?.currentPropertyValueEstimate?.toLocaleString() || 'N/A'}

SCENARIOS:
Scenario A (${context.scenarios.scenarios.A.name}):
- Capital: £${context.scenarios.scenarios.A.capitalExpenditure.toLocaleString()}
- IRR: ${context.scenarios.scenarios.A.irr}%
- Risk: ${context.scenarios.scenarios.A.riskLevel}

Scenario B (${context.scenarios.scenarios.B.name}):
- Capital: £${context.scenarios.scenarios.B.capitalExpenditure.toLocaleString()}
- IRR: ${context.scenarios.scenarios.B.irr}%
- Risk: ${context.scenarios.scenarios.B.riskLevel}

Scenario C (${context.scenarios.scenarios.C.name}):
- Capital: £${context.scenarios.scenarios.C.capitalExpenditure.toLocaleString()}
- IRR: ${context.scenarios.scenarios.C.irr}%
- Risk: ${context.scenarios.scenarios.C.riskLevel}

RECOMMENDATION: Scenario ${context.scenarios.recommendation}
Rationale: ${context.scenarios.recommendationRationale}

You can:
1. Explain any aspect of the analysis
2. Compare scenarios in more detail
3. Answer "what if" questions (estimate based on changed assumptions)
4. Provide market context and benchmarks
5. Suggest next steps
6. Explain regulatory requirements (MEES, EPC, planning rules)

Be conversational but professional. Reference specific numbers from the analysis. Keep responses concise - 2-3 paragraphs max unless asked for detail.

If asked to change assumptions and recalculate, provide estimated figures and note they are indicative. Suggest regenerating the full analysis for accurate numbers.

Use British English. Do not use markdown formatting - plain text only.`;

  const response = await client.messages.create({
    model: 'claude-sonnet-4-20250514',
    max_tokens: 2048,
    system: systemPrompt,
    messages: messages.map((m) => ({
      role: m.role,
      content: m.content,
    })),
  });

  const content = response.content[0];
  if (content.type !== 'text') {
    throw new Error('Unexpected response type');
  }

  return content.text;
}
