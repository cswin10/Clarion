import Anthropic from '@anthropic-ai/sdk';
import { ProjectInputs } from '../types';

const client = new Anthropic();

export interface ValidationWarning {
  severity: 'info' | 'warning' | 'critical';
  field: string;
  message: string;
  suggestion?: string;
}

export interface ValidationResponse {
  isValid: boolean;
  warnings: ValidationWarning[];
}

export async function validateInputs(
  inputs: Partial<ProjectInputs>,
  propertySize: number,
  propertyType: string
): Promise<ValidationResponse> {
  const systemPrompt = `You are a senior property analyst reviewing feasibility study inputs for inconsistencies, errors, or red flags.

Your job is to catch:
1. Logical inconsistencies (e.g., "Good" HVAC condition but system is 30 years old)
2. Unrealistic assumptions (e.g., 10% yield in Central London prime locations)
3. Missing critical considerations (e.g., no budget for EPC improvements when current rating is F)
4. Compliance risks (e.g., EPC below legal minimum for letting - E or below cannot be let)
5. Cost underestimates based on UK market norms

Be helpful, not pedantic. Only flag things that genuinely matter for investment decisions.

Property context:
- Size: ${propertySize} sqm
- Type: ${propertyType}

Return JSON only:
{
  "isValid": true/false,
  "warnings": [
    {
      "severity": "info|warning|critical",
      "field": "which input section or field",
      "message": "clear explanation of the issue",
      "suggestion": "how to fix it (optional)"
    }
  ]
}

Severity guide:
- "critical" = must fix before proceeding (legal/compliance issues, major errors)
- "warning" = should review, may affect accuracy significantly
- "info" = worth noting, helpful context

Limit to maximum 5 most important warnings. Return empty warnings array if inputs look reasonable.`;

  const userPrompt = `Review these feasibility study inputs for a UK commercial property:

${JSON.stringify(inputs, null, 2)}

Identify any inconsistencies, unrealistic assumptions, or red flags. Return JSON only.`;

  try {
    const response = await client.messages.create({
      model: 'claude-sonnet-4-20250514',
      max_tokens: 2048,
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

    return JSON.parse(jsonText) as ValidationResponse;
  } catch (error) {
    console.error('Validation error:', error);
    // Return valid response on error to not block user
    return { isValid: true, warnings: [] };
  }
}
