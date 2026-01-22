import Anthropic from '@anthropic-ai/sdk';
import { ProjectInputs, Scenario } from '../types';

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
  scenarios: {
    scenarios: {
      A: Scenario;
      B: Scenario;
      C: Scenario;
    };
    recommendation: string;
    recommendationRationale: string;
  };
}

// Helper to safely get capital value (handles both formats)
function getCapital(scenario: Scenario): number {
  return scenario.capitalRequired || 0;
}

export async function chat(
  messages: ChatMessage[],
  context: ChatContext
): Promise<string> {
  const scenarioA = context.scenarios?.scenarios?.A;
  const scenarioB = context.scenarios?.scenarios?.B;
  const scenarioC = context.scenarios?.scenarios?.C;

  const systemPrompt = `You are Clarion's AI assistant, helping users understand their property feasibility analysis. You have complete context about their project.

PROJECT CONTEXT:
Property: ${context.property?.name || 'Unknown'}
Address: ${context.property?.address || 'Unknown'}, ${context.property?.city || 'Unknown'}
Type: ${context.property?.propertyType || 'Unknown'}
Size: ${context.property?.size || 0} sqm
Year Built: ${context.property?.yearBuilt || 'Unknown'}

KEY INPUTS:
- Building Condition: ${context.inputs?.condition?.overallStructuralCondition || 'N/A'}
- Current EPC: ${context.inputs?.esg?.currentEPCRating || 'N/A'}
- Current Rent: £${context.inputs?.costs?.currentAnnualRent?.toLocaleString() || 'N/A'}/year
- Property Value: £${context.inputs?.costs?.currentPropertyValueEstimate?.toLocaleString() || 'N/A'}

SCENARIOS:
Scenario A (${scenarioA?.name || 'Status Quo'}):
- Capital: £${getCapital(scenarioA).toLocaleString()}
- IRR: ${scenarioA?.irr || 0}%
- Risk: ${scenarioA?.riskRating || 'Unknown'}

Scenario B (${scenarioB?.name || 'Value-Add'}):
- Capital: £${getCapital(scenarioB).toLocaleString()}
- IRR: ${scenarioB?.irr || 0}%
- Risk: ${scenarioB?.riskRating || 'Unknown'}

Scenario C (${scenarioC?.name || 'Maximum Value'}):
- Capital: £${getCapital(scenarioC).toLocaleString()}
- IRR: ${scenarioC?.irr || 0}%
- Risk: ${scenarioC?.riskRating || 'Unknown'}

RECOMMENDATION: Scenario ${context.scenarios?.recommendation || 'B'}
Rationale: ${context.scenarios?.recommendationRationale || 'Based on risk-return analysis'}

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
