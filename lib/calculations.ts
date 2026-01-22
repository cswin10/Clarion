import {
  BuildingConditionInputs,
  PlanningInputs,
  MEPInputs,
  CostsInputs,
  ESGInputs,
  RiskLevel,
  ESGGrade,
  EPCRating,
} from './types';

// Net Initial Yield calculation
export function calculateNIY(annualRent: number, purchasePrice: number): number {
  if (purchasePrice === 0) return 0;
  return (annualRent / purchasePrice) * 100;
}

// IRR calculation using Newton-Raphson method
export function calculateIRR(
  initialInvestment: number,
  annualCashFlows: number[],
  exitValue: number
): number {
  const cashFlows = [-initialInvestment, ...annualCashFlows];
  cashFlows[cashFlows.length - 1] += exitValue;

  // Newton-Raphson method for IRR
  let rate = 0.1; // Initial guess of 10%
  const tolerance = 0.0001;
  const maxIterations = 100;

  for (let i = 0; i < maxIterations; i++) {
    let npv = 0;
    let npvDerivative = 0;

    for (let t = 0; t < cashFlows.length; t++) {
      const discountFactor = Math.pow(1 + rate, t);
      npv += cashFlows[t] / discountFactor;
      if (t > 0) {
        npvDerivative -= (t * cashFlows[t]) / Math.pow(1 + rate, t + 1);
      }
    }

    if (Math.abs(npv) < tolerance) break;
    if (npvDerivative === 0) break;

    rate = rate - npv / npvDerivative;

    // Clamp rate to reasonable bounds
    if (rate < -0.99) rate = -0.99;
    if (rate > 1) rate = 1;
  }

  return rate * 100;
}

// Payback Period calculation
export function calculatePayback(
  initialInvestment: number,
  annualNetIncome: number
): number {
  if (annualNetIncome <= 0) return Infinity;
  return initialInvestment / annualNetIncome;
}

// Simple ROI calculation
export function calculateROI(
  totalReturn: number,
  totalInvestment: number
): number {
  if (totalInvestment === 0) return 0;
  return ((totalReturn - totalInvestment) / totalInvestment) * 100;
}

// ESG Score calculation
export function calculateESGScore(inputs: ESGInputs): ESGGrade {
  let score = 0;

  // EPC Rating (0-30 points)
  const epcScores: Record<EPCRating, number> = {
    A: 30,
    B: 25,
    C: 20,
    D: 15,
    E: 10,
    F: 5,
    G: 0,
  };
  score += epcScores[inputs.currentEPCRating] || 0;

  // Renewable Energy (0-20 points)
  if (inputs.renewableEnergyOnSite !== 'None') {
    score += inputs.renewableEnergyOnSite === 'Multiple' ? 20 : 15;
  }

  // Certification (0-20 points)
  if (inputs.greenBuildingCertification !== 'None') {
    score += 20;
  }

  // MEES Compliance (0-15 points)
  if (inputs.meesCompliant) {
    score += 15;
  }

  // Wellbeing Features (0-15 points)
  score += Math.min(inputs.occupierWellbeingFeatures.length * 3, 15);

  // Convert to letter grade
  if (score >= 85) return 'A';
  if (score >= 70) return 'B';
  if (score >= 55) return 'C';
  if (score >= 40) return 'D';
  if (score >= 25) return 'E';
  return 'F';
}

// Risk Score calculation
interface AllInputs {
  condition?: BuildingConditionInputs;
  planning?: PlanningInputs;
  mep?: MEPInputs;
  costs?: CostsInputs;
  esg?: ESGInputs;
}

export function calculateRiskScore(inputs: AllInputs): RiskLevel {
  let riskFactors = 0;

  // Planning risks
  if (inputs.planning) {
    if (inputs.planning.listedBuilding !== 'Not Listed') riskFactors += 2;
    if (inputs.planning.conservationArea) riskFactors += 1;
    if (inputs.planning.planningRiskLevel === 'High') riskFactors += 2;
    if (inputs.planning.planningRiskLevel === 'Medium') riskFactors += 1;
    if (inputs.planning.changeOfUseFeasibility === 'Unlikely') riskFactors += 2;
    if (inputs.planning.changeOfUseFeasibility === 'Complex') riskFactors += 1;
  }

  // Building condition risks
  if (inputs.condition) {
    if (
      inputs.condition.overallStructuralCondition === 'Poor' ||
      inputs.condition.overallStructuralCondition === 'Critical'
    ) {
      riskFactors += 2;
    }
    if (inputs.condition.foundationIssues === 'Severe') riskFactors += 2;
    if (inputs.condition.foundationIssues === 'Moderate') riskFactors += 1;
  }

  // ESG risks
  if (inputs.esg) {
    if (inputs.esg.currentEPCRating === 'E' || inputs.esg.currentEPCRating === 'F' || inputs.esg.currentEPCRating === 'G') {
      riskFactors += 1;
    }
    if (!inputs.esg.meesCompliant) riskFactors += 2;
    if (inputs.esg.meesDeadlineRisk === 'High') riskFactors += 1;
  }

  // MEP risks
  if (inputs.mep) {
    if (inputs.mep.hvacCondition === 'End of Life') riskFactors += 1;
    if (inputs.mep.fireAlarmSystem === 'Non-Compliant') riskFactors += 2;
    if (inputs.mep.compartmentalisationStatus === 'Non-Compliant') riskFactors += 2;
  }

  if (riskFactors <= 2) return 'Low';
  if (riskFactors <= 5) return 'Medium';
  return 'High';
}

// Calculate complexity rating
export function calculateComplexity(inputs: AllInputs): RiskLevel {
  let complexityFactors = 0;

  if (inputs.planning) {
    if (inputs.planning.listedBuilding !== 'Not Listed') complexityFactors += 2;
    if (inputs.planning.conservationArea) complexityFactors += 1;
    if (inputs.planning.article4Direction) complexityFactors += 1;
    if (inputs.planning.changeOfUseFeasibility === 'Complex') complexityFactors += 2;
    if (inputs.planning.additionalFloorsPotential > 2) complexityFactors += 1;
  }

  if (inputs.condition) {
    if (inputs.condition.overallStructuralCondition === 'Poor') complexityFactors += 1;
    if (inputs.condition.overallStructuralCondition === 'Critical') complexityFactors += 2;
  }

  if (inputs.mep) {
    if (inputs.mep.electricalCapacity === 'Major Upgrade') complexityFactors += 1;
    if (inputs.mep.hvacCondition === 'End of Life') complexityFactors += 1;
  }

  if (complexityFactors <= 2) return 'Low';
  if (complexityFactors <= 5) return 'Medium';
  return 'High';
}

// Estimate timeline based on inputs
export function estimateTimeline(inputs: AllInputs, scenarioType: 'A' | 'B' | 'C'): number {
  let baseTimeline = 0;

  switch (scenarioType) {
    case 'A':
      baseTimeline = 6; // 6 months for light refurbishment
      break;
    case 'B':
      baseTimeline = 12; // 12 months for value-add
      break;
    case 'C':
      baseTimeline = 18; // 18 months for maximum value
      break;
  }

  // Add time for planning complexity
  if (inputs.planning) {
    if (inputs.planning.listedBuilding !== 'Not Listed') baseTimeline += 6;
    if (inputs.planning.conservationArea) baseTimeline += 3;
    if (inputs.planning.planningRiskLevel === 'High') baseTimeline += 6;
    if (inputs.planning.planningRiskLevel === 'Medium') baseTimeline += 3;
    baseTimeline += inputs.planning.estimatedPlanningTimeline || 0;
  }

  return baseTimeline;
}

// Calculate deferred maintenance cost adjustment
export function calculateMaintenanceCostAdjustment(condition?: BuildingConditionInputs): number {
  if (!condition) return 0;

  const adjustment = condition.deferredMaintenanceEstimate || 0;

  // Additional adjustments based on condition
  const conditionMultipliers: Record<string, number> = {
    Critical: 1.5,
    Poor: 1.25,
    Fair: 1.1,
    Good: 1.0,
    Excellent: 0.9,
  };

  const multiplier = conditionMultipliers[condition.overallStructuralCondition] || 1.0;
  return adjustment * multiplier;
}

// Format currency for display
export function formatCurrency(value: number): string {
  return new Intl.NumberFormat('en-GB', {
    style: 'currency',
    currency: 'GBP',
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(value);
}

// Format percentage for display
export function formatPercentage(value: number, decimals: number = 1): string {
  return `${value.toFixed(decimals)}%`;
}

// Generate cash flow projections
export function generateCashFlows(
  initialInvestment: number,
  annualIncome: number,
  annualCosts: number,
  years: number = 10
): number[] {
  const netAnnualIncome = annualIncome - annualCosts;
  return Array(years).fill(netAnnualIncome);
}

// Calculate cumulative cash flows
export function calculateCumulativeCashFlows(
  initialInvestment: number,
  annualCashFlows: number[]
): number[] {
  let cumulative = -initialInvestment;
  return annualCashFlows.map((cf) => {
    cumulative += cf;
    return cumulative;
  });
}
