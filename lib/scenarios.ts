import {
  Project,
  Scenario,
  ScenarioResults,
  RecommendationType,
  RiskFlag,
  CashFlowData,
  RiskReturnData,
  EPCRating,
  ESGGrade,
} from './types';
import {
  calculateNIY,
  calculateIRR,
  calculatePayback,
  calculateRiskScore,
  calculateComplexity,
  estimateTimeline,
  calculateMaintenanceCostAdjustment,
  calculateCumulativeCashFlows,
} from './calculations';

export function generateScenarios(project: Project): ScenarioResults {
  const { inputs, size } = project;
  const { condition, costs, esg } = inputs;

  // Default values if inputs are missing
  const currentRent = costs?.currentAnnualRent || 0;
  const currentOccupancy = (costs?.currentOccupancyRate || 80) / 100;
  const propertyValue = costs?.currentPropertyValueEstimate || 1000000;
  const lightRefurbCost = (costs?.lightRefurbishmentEstimate || 150) * size;
  const fullRefurbCost = (costs?.fullRefurbishmentEstimate || 350) * size;
  const extensionCost = (costs?.extensionConversionCostEstimate || 500) * size;
  const comparableRentCurrent = (costs?.comparableRentCurrentUse || 300) * size;
  const comparableRentAlt = (costs?.comparableRentAlternativeUse || 400) * size;
  const targetYield = (costs?.targetYield || 6) / 100;
  const deferredMaintenance = calculateMaintenanceCostAdjustment(condition);
  const currentEPC = esg?.currentEPCRating || 'D';

  // Base risk and complexity
  const baseRisk = calculateRiskScore(inputs);
  const baseComplexity = calculateComplexity(inputs);

  // Scenario A: Status Quo / Light Refurbishment
  const scenarioACapex = deferredMaintenance + Math.min(lightRefurbCost * 0.3, 100000);
  const scenarioAIncome = currentRent * currentOccupancy;
  const scenarioAYield = calculateNIY(scenarioAIncome, propertyValue + scenarioACapex);
  const scenarioACashFlows = Array(10).fill(scenarioAIncome * 0.85); // 85% of income after costs
  const scenarioAExitValue = (scenarioAIncome / targetYield) * 0.95; // Conservative exit
  const scenarioAIRR = calculateIRR(scenarioACapex, scenarioACashFlows, scenarioAExitValue);
  const scenarioAPayback = calculatePayback(scenarioACapex, scenarioAIncome * 0.85);
  const scenarioAEPC = getImprovedEPC(currentEPC, 0);

  const scenarioA: Scenario = {
    id: 'A',
    name: 'Status Quo',
    description: 'Minimal intervention - maintain current use with basic compliance works only.',
    capitalRequired: scenarioACapex,
    projectedAnnualIncome: scenarioAIncome,
    netYield: scenarioAYield,
    irr: Math.max(0, scenarioAIRR),
    esgScore: calculateESGScoreFromEPC(scenarioAEPC),
    riskRating: 'Low',
    complexityRating: 'Low',
    timeline: estimateTimeline(inputs, 'A'),
    paybackPeriod: Math.min(scenarioAPayback, 20),
    epcRatingAchieved: scenarioAEPC,
    meesCompliant: isMEESCompliant(scenarioAEPC),
    planningComplexity: 'Low',
    deliveryRisk: 'Low',
  };

  // Scenario B: Value-Add / Change of Use
  const scenarioBCapex = fullRefurbCost + deferredMaintenance;
  const scenarioBIncome = comparableRentCurrent * 0.95; // 95% occupancy
  const scenarioBYield = calculateNIY(scenarioBIncome, propertyValue + scenarioBCapex);
  const scenarioBCashFlows = Array(10).fill(scenarioBIncome * 0.82); // 82% after costs
  const scenarioBExitValue = scenarioBIncome / targetYield;
  const scenarioBIRR = calculateIRR(scenarioBCapex, scenarioBCashFlows, scenarioBExitValue);
  const scenarioBPayback = calculatePayback(scenarioBCapex, scenarioBIncome * 0.82);
  const scenarioBEPC = getImprovedEPC(currentEPC, 1);

  const scenarioB: Scenario = {
    id: 'B',
    name: 'Value-Add',
    description: 'Moderate investment with full refurbishment, targeting modern standards and potential use change.',
    capitalRequired: scenarioBCapex,
    projectedAnnualIncome: scenarioBIncome,
    netYield: scenarioBYield,
    irr: Math.max(0, scenarioBIRR),
    esgScore: calculateESGScoreFromEPC(scenarioBEPC),
    riskRating: baseRisk,
    complexityRating: baseComplexity,
    timeline: estimateTimeline(inputs, 'B'),
    paybackPeriod: Math.min(scenarioBPayback, 20),
    epcRatingAchieved: scenarioBEPC,
    meesCompliant: isMEESCompliant(scenarioBEPC),
    planningComplexity: baseComplexity,
    deliveryRisk: baseRisk,
  };

  // Scenario C: Maximum Value / ESG-Optimised
  const scenarioCCapex = fullRefurbCost + extensionCost * 0.5 + deferredMaintenance;
  const scenarioCIncome = comparableRentAlt * 0.90; // 90% occupancy (conservative)
  const scenarioCYield = calculateNIY(scenarioCIncome, propertyValue + scenarioCCapex);
  const scenarioCCashFlows = Array(10).fill(scenarioCIncome * 0.78); // 78% after higher costs
  const scenarioCExitValue = (scenarioCIncome / (targetYield * 0.9)) * 1.1; // Premium exit
  const scenarioCIRR = calculateIRR(scenarioCCapex, scenarioCCashFlows, scenarioCExitValue);
  const scenarioCPayback = calculatePayback(scenarioCCapex, scenarioCIncome * 0.78);
  const scenarioCEPC: EPCRating = 'A';

  const highRisk = increaseRiskLevel(baseRisk);
  const highComplexity = increaseRiskLevel(baseComplexity);

  const scenarioC: Scenario = {
    id: 'C',
    name: 'Maximum Value',
    description: 'Significant investment for full transformation with premium positioning and ESG leadership.',
    capitalRequired: scenarioCCapex,
    projectedAnnualIncome: scenarioCIncome,
    netYield: scenarioCYield,
    irr: Math.max(0, scenarioCIRR),
    esgScore: 'A',
    riskRating: highRisk,
    complexityRating: highComplexity,
    timeline: estimateTimeline(inputs, 'C'),
    paybackPeriod: Math.min(scenarioCPayback, 20),
    epcRatingAchieved: scenarioCEPC,
    meesCompliant: true,
    planningComplexity: highComplexity,
    deliveryRisk: highRisk,
  };

  // Generate cash flow data for charts
  const cashFlowData = generateCashFlowChartData(
    [scenarioACapex, scenarioBCapex, scenarioCCapex],
    [scenarioACashFlows, scenarioBCashFlows, scenarioCCashFlows]
  );

  // Generate risk/return data
  const riskReturnData: RiskReturnData[] = [
    { scenario: 'A', risk: riskToNumber('Low'), irr: scenarioA.irr },
    { scenario: 'B', risk: riskToNumber(baseRisk), irr: scenarioB.irr },
    { scenario: 'C', risk: riskToNumber(highRisk), irr: scenarioC.irr },
  ];

  // Generate risk flags
  const riskFlags = generateRiskFlags(project);

  // Determine recommendation
  const { recommendation, summary, recommendedScenario } = determineRecommendation(
    scenarioA,
    scenarioB,
    scenarioC,
    inputs
  );

  return {
    recommendation,
    recommendationSummary: summary,
    recommendedScenario,
    scenarios: {
      A: scenarioA,
      B: scenarioB,
      C: scenarioC,
    },
    cashFlowData,
    riskReturnData,
    riskFlags,
    generatedAt: new Date().toISOString(),
  };
}

function getImprovedEPC(current: EPCRating, levels: number): EPCRating {
  const ratings: EPCRating[] = ['A', 'B', 'C', 'D', 'E', 'F', 'G'];
  const currentIndex = ratings.indexOf(current);
  const newIndex = Math.max(0, currentIndex - levels);
  return ratings[newIndex];
}

function calculateESGScoreFromEPC(epc: EPCRating): ESGGrade {
  const mapping: Record<EPCRating, ESGGrade> = {
    A: 'A',
    B: 'B',
    C: 'C',
    D: 'D',
    E: 'E',
    F: 'F',
    G: 'F',
  };
  return mapping[epc];
}

function isMEESCompliant(epc: EPCRating): boolean {
  return ['A', 'B', 'C', 'D', 'E'].includes(epc);
}

function increaseRiskLevel(level: 'Low' | 'Medium' | 'High'): 'Low' | 'Medium' | 'High' {
  if (level === 'Low') return 'Medium';
  return 'High';
}

function riskToNumber(risk: 'Low' | 'Medium' | 'High'): number {
  const mapping = { Low: 2, Medium: 5, High: 8 };
  return mapping[risk];
}

function generateCashFlowChartData(
  capexes: number[],
  cashFlowArrays: number[][]
): CashFlowData[] {
  const years = 10;
  const data: CashFlowData[] = [];

  const cumulativeA = calculateCumulativeCashFlows(capexes[0], cashFlowArrays[0]);
  const cumulativeB = calculateCumulativeCashFlows(capexes[1], cashFlowArrays[1]);
  const cumulativeC = calculateCumulativeCashFlows(capexes[2], cashFlowArrays[2]);

  for (let i = 0; i < years; i++) {
    data.push({
      year: i + 1,
      scenarioA: cumulativeA[i],
      scenarioB: cumulativeB[i],
      scenarioC: cumulativeC[i],
    });
  }

  return data;
}

function generateRiskFlags(project: Project): RiskFlag[] {
  const flags: RiskFlag[] = [];
  const { inputs } = project;

  // EPC/MEES risks
  if (inputs.esg) {
    if (['E', 'F', 'G'].includes(inputs.esg.currentEPCRating)) {
      flags.push({
        severity: 'high',
        message: `EPC rating (${inputs.esg.currentEPCRating}) below MEES threshold - regulatory action required by 2027`,
      });
    }
    if (!inputs.esg.meesCompliant) {
      flags.push({
        severity: 'high',
        message: 'Property is not MEES compliant - remediation works required',
      });
    }
    if (inputs.esg.meesDeadlineRisk === 'High') {
      flags.push({
        severity: 'medium',
        message: 'High risk of missing MEES compliance deadline',
      });
    }
  }

  // Planning risks
  if (inputs.planning) {
    if (inputs.planning.listedBuilding !== 'Not Listed') {
      flags.push({
        severity: 'medium',
        message: `Listed building status (${inputs.planning.listedBuilding}) will add 3-6 months to planning timeline`,
      });
    }
    if (inputs.planning.conservationArea) {
      flags.push({
        severity: 'low',
        message: 'Conservation area restrictions may limit development options',
      });
    }
    if (inputs.planning.planningRiskLevel === 'High') {
      flags.push({
        severity: 'high',
        message: 'High planning risk identified - recommend early pre-application engagement',
      });
    }
  }

  // Building condition risks
  if (inputs.condition) {
    if (inputs.condition.deferredMaintenanceEstimate > 500000) {
      flags.push({
        severity: 'high',
        message: `Significant deferred maintenance liability identified (£${(inputs.condition.deferredMaintenanceEstimate / 1000).toFixed(0)}k)`,
      });
    }
    if (
      inputs.condition.overallStructuralCondition === 'Poor' ||
      inputs.condition.overallStructuralCondition === 'Critical'
    ) {
      flags.push({
        severity: 'high',
        message: 'Structural condition concerns require immediate attention',
      });
    }
    if (inputs.condition.foundationIssues === 'Severe') {
      flags.push({
        severity: 'high',
        message: 'Severe foundation issues identified - specialist investigation required',
      });
    }
  }

  // MEP risks
  if (inputs.mep) {
    if (inputs.mep.hvacCondition === 'End of Life') {
      flags.push({
        severity: 'medium',
        message: 'HVAC system at end of life - full replacement recommended',
      });
    }
    if (inputs.mep.fireAlarmSystem === 'Non-Compliant') {
      flags.push({
        severity: 'high',
        message: 'Fire alarm system non-compliant - immediate upgrade required',
      });
    }
    if (inputs.mep.compartmentalisationStatus === 'Non-Compliant') {
      flags.push({
        severity: 'high',
        message: 'Fire compartmentalisation non-compliant - remediation required',
      });
    }
  }

  return flags;
}

function determineRecommendation(
  scenarioA: Scenario,
  scenarioB: Scenario,
  scenarioC: Scenario,
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  _inputs: Project['inputs']
): { recommendation: RecommendationType; summary: string; recommendedScenario: 'A' | 'B' | 'C' } {
  // Score each scenario
  let scoreA = 0;
  let scoreB = 0;
  let scoreC = 0;

  // IRR weighting (40%)
  scoreA += scenarioA.irr * 4;
  scoreB += scenarioB.irr * 4;
  scoreC += scenarioC.irr * 4;

  // Risk adjustment (-20% for high risk)
  if (scenarioA.riskRating === 'High') scoreA *= 0.8;
  if (scenarioB.riskRating === 'High') scoreB *= 0.8;
  if (scenarioC.riskRating === 'High') scoreC *= 0.8;

  // ESG bonus (10%)
  if (scenarioA.esgScore === 'A') scoreA *= 1.1;
  if (scenarioB.esgScore === 'A') scoreB *= 1.1;
  if (scenarioC.esgScore === 'A') scoreC *= 1.1;

  // MEES compliance is critical
  if (!scenarioA.meesCompliant) scoreA *= 0.5;
  if (!scenarioB.meesCompliant) scoreB *= 0.5;
  if (!scenarioC.meesCompliant) scoreC *= 0.5;

  // Find best scenario
  const scores = [
    { id: 'A' as const, score: scoreA, scenario: scenarioA },
    { id: 'B' as const, score: scoreB, scenario: scenarioB },
    { id: 'C' as const, score: scoreC, scenario: scenarioC },
  ];

  scores.sort((a, b) => b.score - a.score);
  const best = scores[0];

  // Determine recommendation type
  let recommendation: RecommendationType;
  let summary: string;

  if (best.scenario.irr < 5 || !best.scenario.meesCompliant) {
    recommendation = 'Exit';
    summary = `The analysis indicates limited investment potential. ${
      !best.scenario.meesCompliant
        ? 'MEES compliance challenges present significant regulatory risk.'
        : 'Projected returns do not meet minimum thresholds.'
    } Consider disposal or alternative strategies.`;
  } else if (best.scenario.irr >= 12 && best.scenario.riskRating === 'Low') {
    recommendation = 'Proceed';
    summary = `Strong investment case identified with ${best.scenario.name} strategy. Projected IRR of ${best.scenario.irr.toFixed(1)}% with ${best.scenario.riskRating.toLowerCase()} risk profile presents an attractive opportunity.`;
  } else {
    recommendation = 'Optimise';
    summary = `The ${best.scenario.name} strategy presents a viable path forward with modifications. Consider risk mitigation measures and phased implementation to enhance returns.`;
  }

  return {
    recommendation,
    summary,
    recommendedScenario: best.id,
  };
}
