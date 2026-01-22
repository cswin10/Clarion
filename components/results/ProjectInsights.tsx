'use client';

import { Lightbulb, TrendingUp, AlertTriangle, Target, CheckCircle } from 'lucide-react';
import { Card } from '@/components/ui/Card';
import { Project, ScenarioResults } from '@/lib/types';
import { formatCurrency, formatPercentage } from '@/lib/calculations';

interface Props {
  project: Project;
  results: ScenarioResults;
}

export function ProjectInsights({ project, results }: Props) {
  // Generate insights based on the analysis
  const keyFindings = generateKeyFindings(project, results);
  const improvements = generateImprovements(project, results);
  const keyMetrics = generateKeyMetrics(results);

  return (
    <Card variant="elevated" padding="lg">
      <div className="flex items-center gap-3 mb-6">
        <div className="w-10 h-10 rounded-full bg-gold/10 flex items-center justify-center">
          <Lightbulb className="w-5 h-5 text-gold" />
        </div>
        <div>
          <h2 className="text-lg font-semibold text-text-primary">Project Insights</h2>
          <p className="text-sm text-text-secondary">Key discoveries from the analysis</p>
        </div>
      </div>

      <div className="space-y-6">
        {/* What We Found */}
        <div>
          <div className="flex items-center gap-2 mb-3">
            <TrendingUp className="w-4 h-4 text-success" />
            <h3 className="font-medium text-text-primary">What We Found</h3>
          </div>
          <ul className="space-y-2">
            {keyFindings.map((finding, index) => (
              <li key={index} className="flex items-start gap-2 text-sm text-text-secondary">
                <CheckCircle className="w-4 h-4 text-success shrink-0 mt-0.5" />
                <span>{finding}</span>
              </li>
            ))}
          </ul>
        </div>

        {/* Areas for Improvement */}
        <div>
          <div className="flex items-center gap-2 mb-3">
            <AlertTriangle className="w-4 h-4 text-warning" />
            <h3 className="font-medium text-text-primary">What Could Be Improved</h3>
          </div>
          <ul className="space-y-2">
            {improvements.map((improvement, index) => (
              <li key={index} className="flex items-start gap-2 text-sm text-text-secondary">
                <Target className="w-4 h-4 text-warning shrink-0 mt-0.5" />
                <span>{improvement}</span>
              </li>
            ))}
          </ul>
        </div>

        {/* Key Metrics Snapshot */}
        <div className="pt-4 border-t border-slate/20">
          <h3 className="font-medium text-text-primary mb-4">Key Metrics Snapshot</h3>
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-4">
            {keyMetrics.map((metric, index) => (
              <div key={index} className="text-center p-3 rounded-card bg-charcoal">
                <p className="text-xs text-text-muted mb-1">{metric.label}</p>
                <p className="text-sm font-semibold text-text-primary">{metric.value}</p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </Card>
  );
}

function generateKeyFindings(project: Project, results: ScenarioResults): string[] {
  const findings: string[] = [];
  const recommended = results.scenarios[results.recommendedScenario];

  // Opportunity assessment
  if (recommended.irr > 12) {
    findings.push(`Strong investment opportunity with ${formatPercentage(recommended.irr)} IRR achievable under ${recommended.name} scenario.`);
  } else if (recommended.irr > 8) {
    findings.push(`Moderate investment opportunity with ${formatPercentage(recommended.irr)} IRR achievable.`);
  } else {
    findings.push(`Conservative returns expected with ${formatPercentage(recommended.irr)} IRR - consider risk-adjusted alternatives.`);
  }

  // ESG pathway
  if (project.inputs.esg) {
    const currentEPC = project.inputs.esg.currentEPCRating;
    const targetEPC = recommended.epcRatingAchieved;
    if (currentEPC !== targetEPC) {
      findings.push(`EPC improvement pathway identified: ${currentEPC} to ${targetEPC} achievable within ${recommended.timeline} months.`);
    }
    if (recommended.meesCompliant) {
      findings.push('MEES compliance achievable under recommended scenario - no regulatory risk.');
    }
  }

  // Planning assessment
  if (project.inputs.planning) {
    if (project.inputs.planning.changeOfUseFeasibility === 'Straightforward') {
      findings.push('Change of use is straightforward - opens alternative value scenarios.');
    }
    if (project.inputs.planning.extensionPotential !== 'None') {
      findings.push(`Extension potential identified: ${project.inputs.planning.extensionPotential.toLowerCase()} opportunity for additional floor area.`);
    }
  }

  // Building condition
  if (project.inputs.condition) {
    if (project.inputs.condition.overallStructuralCondition === 'Good' || project.inputs.condition.overallStructuralCondition === 'Excellent') {
      findings.push('Sound structural condition reduces refurbishment risk and cost uncertainty.');
    }
  }

  return findings.slice(0, 4);
}

function generateImprovements(project: Project, results: ScenarioResults): string[] {
  const improvements: string[] = [];

  // Check for data gaps
  if (!project.inputs.condition) {
    improvements.push('Building condition assessment missing - would improve accuracy of refurbishment cost estimates.');
  }
  if (!project.inputs.planning) {
    improvements.push('Planning assessment incomplete - could unlock additional value scenarios.');
  }
  if (!project.inputs.mep) {
    improvements.push('MEP assessment would help quantify systems upgrade requirements.');
  }

  // Check for optimistic assumptions
  if (project.inputs.costs) {
    if (project.inputs.costs.targetYield > 7) {
      improvements.push(`Target yield of ${project.inputs.costs.targetYield}% is above typical market levels - validate with recent transactions.`);
    }
    if (project.inputs.costs.currentOccupancyRate < 70) {
      improvements.push('Low current occupancy impacts baseline income - consider stabilised vs as-is scenarios.');
    }
  }

  // ESG considerations
  if (project.inputs.esg) {
    if (!project.inputs.esg.meesCompliant) {
      improvements.push('MEES non-compliance requires urgent attention - factor into timeline and costs.');
    }
    if (project.inputs.esg.currentEPCRating === 'F' || project.inputs.esg.currentEPCRating === 'G') {
      improvements.push('Very low EPC rating will require significant investment - detailed energy audit recommended.');
    }
  }

  // Risk factors
  const highRisks = results.riskFlags.filter(f => f.severity === 'high');
  if (highRisks.length > 2) {
    improvements.push('Multiple high-severity risks identified - consider risk mitigation strategies before proceeding.');
  }

  return improvements.slice(0, 4);
}

function generateKeyMetrics(results: ScenarioResults): { label: string; value: string }[] {
  const recommended = results.scenarios[results.recommendedScenario];

  return [
    { label: 'IRR', value: formatPercentage(recommended.irr) },
    { label: 'Net Yield', value: formatPercentage(recommended.netYield) },
    { label: 'CapEx', value: formatCurrency(recommended.capitalRequired) },
    { label: 'Payback', value: `${recommended.paybackPeriod.toFixed(1)} yrs` },
    { label: 'EPC', value: recommended.epcRatingAchieved },
    { label: 'Risk', value: recommended.riskRating },
  ];
}

export default ProjectInsights;
