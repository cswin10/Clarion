import Anthropic from '@anthropic-ai/sdk';
import { ProjectInputs } from '../types';
import { ScenarioResponse } from './generateScenarios';

const client = new Anthropic();

export interface GeneratedNarratives {
  executiveSummary: string;
  propertyOverview: string;
  scenarioANarrative: string;
  scenarioBNarrative: string;
  scenarioCNarrative: string;
  riskAssessment: string;
  esgCommentary: string;
  conclusion: string;
}

interface PropertyContext {
  name: string;
  address: string;
  city: string;
  propertyType: string;
  size: number;
  yearBuilt: number;
  clientName?: string;
  clientCompany?: string;
}

export async function generateNarratives(
  property: PropertyContext,
  inputs: ProjectInputs,
  scenarios: ScenarioResponse
): Promise<GeneratedNarratives> {
  const systemPrompt = `You are Clarion's AI analyst writing professional investment analysis content. Your writing style is:

- Authoritative but accessible
- Data-driven with specific references to the numbers
- Balanced - acknowledging both opportunities and risks
- Concise - every sentence adds value
- Professional British English

You are writing sections for an investment feasibility report that will be presented to sophisticated investors, banks, and investment committees.

Do NOT use:
- Buzzwords or filler phrases
- Overly optimistic language
- Vague generalities
- American spellings
- Markdown formatting

DO use:
- Specific figures from the data
- Clear cause-and-effect reasoning
- Professional property terminology
- Measured, defensible conclusions`;

  const userPrompt = `Generate professional narrative content for this feasibility report:

PROPERTY:
Name: ${property.name}
Address: ${property.address}, ${property.city}
Type: ${property.propertyType}
Size: ${property.size} sqm
Year Built: ${property.yearBuilt}
${property.clientName ? `Client: ${property.clientName}` : ''}
${property.clientCompany ? `Company: ${property.clientCompany}` : ''}

INPUTS SUMMARY:
- Building Condition: ${inputs.condition?.overallStructuralCondition || 'N/A'} overall, ${inputs.condition?.currentFitOutCondition || 'N/A'} fit-out
- Current EPC: ${inputs.esg?.currentEPCRating || 'N/A'}
- Planning: ${inputs.planning?.listedBuilding || 'Not Listed'}, ${inputs.planning?.conservationArea ? 'In Conservation Area' : 'Not in Conservation Area'}
- Current Rent: £${inputs.costs?.currentAnnualRent?.toLocaleString() || 'N/A'}/year
- Occupancy: ${inputs.costs?.currentOccupancyRate || 'N/A'}%

GENERATED SCENARIOS:
Scenario A (${scenarios.scenarios.A.name}):
- Capital: £${scenarios.scenarios.A.capitalExpenditure.toLocaleString()}
- Projected Income: £${scenarios.scenarios.A.projectedAnnualIncome.toLocaleString()}
- IRR: ${scenarios.scenarios.A.irr}%
- Risk: ${scenarios.scenarios.A.riskLevel}

Scenario B (${scenarios.scenarios.B.name}):
- Capital: £${scenarios.scenarios.B.capitalExpenditure.toLocaleString()}
- Projected Income: £${scenarios.scenarios.B.projectedAnnualIncome.toLocaleString()}
- IRR: ${scenarios.scenarios.B.irr}%
- Risk: ${scenarios.scenarios.B.riskLevel}

Scenario C (${scenarios.scenarios.C.name}):
- Capital: £${scenarios.scenarios.C.capitalExpenditure.toLocaleString()}
- Projected Income: £${scenarios.scenarios.C.projectedAnnualIncome.toLocaleString()}
- IRR: ${scenarios.scenarios.C.irr}%
- Risk: ${scenarios.scenarios.C.riskLevel}

RECOMMENDATION: Scenario ${scenarios.recommendation}
Rationale: ${scenarios.recommendationRationale}

Generate the following sections as JSON (no markdown, plain text only):

{
  "executiveSummary": "3-4 paragraphs. Lead with the recommendation. Summarise the property, the three scenarios, and why the recommended scenario is optimal. This is the most important section.",

  "propertyOverview": "2 paragraphs describing the property, its location context, current condition, and key characteristics.",

  "scenarioANarrative": "2 paragraphs explaining Scenario A - the strategy, financial logic, and who this scenario suits.",

  "scenarioBNarrative": "2 paragraphs explaining Scenario B - same structure.",

  "scenarioCNarrative": "2 paragraphs explaining Scenario C - same structure.",

  "riskAssessment": "2-3 paragraphs identifying key risks across all scenarios. Be specific - reference actual data points that create risk.",

  "esgCommentary": "2 paragraphs on ESG position, regulatory compliance trajectory, and sustainability opportunities.",

  "conclusion": "1-2 paragraphs with clear next steps and any conditions on the recommendation."
}

Return JSON only, no markdown formatting.`;

  const response = await client.messages.create({
    model: 'claude-sonnet-4-20250514',
    max_tokens: 8192,
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

  // Extract JSON from response
  let jsonText = content.text;
  const jsonMatch = jsonText.match(/\{[\s\S]*\}/);
  if (jsonMatch) {
    jsonText = jsonMatch[0];
  }

  return JSON.parse(jsonText) as GeneratedNarratives;
}
