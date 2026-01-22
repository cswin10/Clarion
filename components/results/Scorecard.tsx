'use client';

import { ScenarioResults } from '@/lib/types';
import { Card } from '@/components/ui/Card';
import { formatCurrency, formatPercentage } from '@/lib/calculations';

interface Props {
  results: ScenarioResults;
}

export function Scorecard({ results }: Props) {
  const { scenarios } = results;

  const metrics = [
    {
      label: 'Capital Expenditure',
      format: (v: number) => formatCurrency(v),
      valueA: scenarios.A.capitalRequired,
      valueB: scenarios.B.capitalRequired,
      valueC: scenarios.C.capitalRequired,
    },
    {
      label: 'Annual Net Income',
      format: (v: number) => formatCurrency(v),
      valueA: scenarios.A.projectedAnnualIncome,
      valueB: scenarios.B.projectedAnnualIncome,
      valueC: scenarios.C.projectedAnnualIncome,
    },
    {
      label: 'Net Initial Yield',
      format: (v: number) => formatPercentage(v),
      valueA: scenarios.A.netYield,
      valueB: scenarios.B.netYield,
      valueC: scenarios.C.netYield,
    },
    {
      label: 'IRR (10-year)',
      format: (v: number) => formatPercentage(v),
      valueA: scenarios.A.irr,
      valueB: scenarios.B.irr,
      valueC: scenarios.C.irr,
      highlight: true,
    },
    {
      label: 'Payback Period',
      format: (v: number) => `${v.toFixed(1)} yrs`,
      valueA: scenarios.A.paybackPeriod,
      valueB: scenarios.B.paybackPeriod,
      valueC: scenarios.C.paybackPeriod,
    },
    {
      label: 'EPC Rating Achieved',
      format: (v: string) => v,
      valueA: scenarios.A.epcRatingAchieved,
      valueB: scenarios.B.epcRatingAchieved,
      valueC: scenarios.C.epcRatingAchieved,
    },
    {
      label: 'MEES Compliant',
      format: (v: boolean) => v ? 'Yes' : 'No',
      valueA: scenarios.A.meesCompliant,
      valueB: scenarios.B.meesCompliant,
      valueC: scenarios.C.meesCompliant,
    },
    {
      label: 'Planning Complexity',
      format: (v: string) => v,
      valueA: scenarios.A.planningComplexity,
      valueB: scenarios.B.planningComplexity,
      valueC: scenarios.C.planningComplexity,
    },
    {
      label: 'Delivery Risk',
      format: (v: string) => v,
      valueA: scenarios.A.deliveryRisk,
      valueB: scenarios.B.deliveryRisk,
      valueC: scenarios.C.deliveryRisk,
    },
    {
      label: 'Timeline',
      format: (v: number) => `${v} months`,
      valueA: scenarios.A.timeline,
      valueB: scenarios.B.timeline,
      valueC: scenarios.C.timeline,
    },
  ];

  const isRecommended = (scenario: 'A' | 'B' | 'C') =>
    scenario === results.recommendedScenario;

  return (
    <Card variant="bordered" padding="none" className="overflow-hidden">
      <div className="overflow-x-auto">
        <table className="w-full">
          <thead>
            <tr className="bg-charcoal">
              <th className="text-left px-6 py-4 text-sm font-medium text-text-secondary border-b border-slate/20">
                Metric
              </th>
              <th
                className={`text-center px-6 py-4 text-sm font-medium border-b ${
                  isRecommended('A')
                    ? 'text-gold bg-gold/10 border-gold/30'
                    : 'text-text-secondary border-slate/20'
                }`}
              >
                Scenario A
                {isRecommended('A') && (
                  <span className="block text-xs mt-1">Recommended</span>
                )}
              </th>
              <th
                className={`text-center px-6 py-4 text-sm font-medium border-b ${
                  isRecommended('B')
                    ? 'text-gold bg-gold/10 border-gold/30'
                    : 'text-text-secondary border-slate/20'
                }`}
              >
                Scenario B
                {isRecommended('B') && (
                  <span className="block text-xs mt-1">Recommended</span>
                )}
              </th>
              <th
                className={`text-center px-6 py-4 text-sm font-medium border-b ${
                  isRecommended('C')
                    ? 'text-gold bg-gold/10 border-gold/30'
                    : 'text-text-secondary border-slate/20'
                }`}
              >
                Scenario C
                {isRecommended('C') && (
                  <span className="block text-xs mt-1">Recommended</span>
                )}
              </th>
            </tr>
          </thead>
          <tbody>
            {metrics.map((metric, index) => (
              <tr
                key={metric.label}
                className={index % 2 === 0 ? 'bg-navy' : 'bg-navy/50'}
              >
                <td
                  className={`px-6 py-3 text-sm ${
                    metric.highlight
                      ? 'text-text-primary font-medium'
                      : 'text-text-secondary'
                  }`}
                >
                  {metric.label}
                </td>
                <td
                  className={`text-center px-6 py-3 text-sm ${
                    isRecommended('A') ? 'bg-gold/5' : ''
                  } ${
                    metric.highlight
                      ? 'text-gold font-semibold'
                      : 'text-text-primary'
                  }`}
                >
                  {metric.format(metric.valueA as never)}
                </td>
                <td
                  className={`text-center px-6 py-3 text-sm ${
                    isRecommended('B') ? 'bg-gold/5' : ''
                  } ${
                    metric.highlight
                      ? 'text-gold font-semibold'
                      : 'text-text-primary'
                  }`}
                >
                  {metric.format(metric.valueB as never)}
                </td>
                <td
                  className={`text-center px-6 py-3 text-sm ${
                    isRecommended('C') ? 'bg-gold/5' : ''
                  } ${
                    metric.highlight
                      ? 'text-gold font-semibold'
                      : 'text-text-primary'
                  }`}
                >
                  {metric.format(metric.valueC as never)}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </Card>
  );
}

export default Scorecard;
