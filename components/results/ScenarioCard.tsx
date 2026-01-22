'use client';

import { Scenario } from '@/lib/types';
import { Card } from '@/components/ui/Card';
import { Badge, RiskBadge, ESGBadge, EPCBadge } from '@/components/ui/Badge';
import { formatCurrency, formatPercentage } from '@/lib/calculations';
import { TrendingUp, Clock, AlertTriangle } from 'lucide-react';

interface Props {
  scenario: Scenario;
  isRecommended?: boolean;
}

export function ScenarioCard({ scenario, isRecommended = false }: Props) {
  return (
    <Card
      variant={isRecommended ? 'gold' : 'elevated'}
      padding="lg"
      className={`relative ${isRecommended ? 'ring-2 ring-gold shadow-gold-strong' : ''}`}
    >
      {isRecommended && (
        <div className="absolute -top-3 left-1/2 -translate-x-1/2">
          <Badge variant="gold" size="md">
            Recommended
          </Badge>
        </div>
      )}

      {/* Header */}
      <div className="mb-6">
        <div className="flex items-center gap-3 mb-2">
          <span className="w-10 h-10 rounded-full bg-gold/10 flex items-center justify-center text-gold font-bold text-lg">
            {scenario.id}
          </span>
          <div>
            <h3 className="text-lg font-semibold text-text-primary">
              {scenario.name}
            </h3>
          </div>
        </div>
        <p className="text-sm text-text-secondary mt-2">
          {scenario.description}
        </p>
      </div>

      {/* Key Metrics */}
      <div className="space-y-4 mb-6">
        <div className="flex justify-between items-center py-2 border-b border-slate/20">
          <span className="text-text-secondary">Capital Required</span>
          <span className="text-text-primary font-semibold">
            {formatCurrency(scenario.capitalRequired)}
          </span>
        </div>
        <div className="flex justify-between items-center py-2 border-b border-slate/20">
          <span className="text-text-secondary">Annual Income</span>
          <span className="text-text-primary font-semibold">
            {formatCurrency(scenario.projectedAnnualIncome)}
          </span>
        </div>
        <div className="flex justify-between items-center py-2 border-b border-slate/20">
          <span className="text-text-secondary">Net Yield</span>
          <span className="text-success font-semibold">
            {formatPercentage(scenario.netYield)}
          </span>
        </div>
        <div className="flex justify-between items-center py-2 border-b border-slate/20">
          <span className="text-text-secondary flex items-center gap-1">
            <TrendingUp className="w-4 h-4" />
            IRR (10-year)
          </span>
          <span className="text-gold font-bold text-lg">
            {formatPercentage(scenario.irr)}
          </span>
        </div>
      </div>

      {/* Badges */}
      <div className="flex flex-wrap gap-2 mb-6">
        <ESGBadge grade={scenario.esgScore} />
        <EPCBadge rating={scenario.epcRatingAchieved} />
        <RiskBadge level={scenario.riskRating} />
      </div>

      {/* Timeline & Complexity */}
      <div className="grid grid-cols-2 gap-4 pt-4 border-t border-slate/20">
        <div>
          <div className="flex items-center gap-1 text-text-muted text-xs mb-1">
            <Clock className="w-3 h-3" />
            Timeline
          </div>
          <span className="text-text-primary font-medium">
            {scenario.timeline} months
          </span>
        </div>
        <div>
          <div className="flex items-center gap-1 text-text-muted text-xs mb-1">
            <AlertTriangle className="w-3 h-3" />
            Complexity
          </div>
          <span className="text-text-primary font-medium">
            {scenario.complexityRating}
          </span>
        </div>
      </div>

      {/* Payback */}
      <div className="mt-4 pt-4 border-t border-slate/20">
        <div className="flex justify-between items-center">
          <span className="text-text-secondary text-sm">Payback Period</span>
          <span className="text-text-primary font-medium">
            {scenario.paybackPeriod.toFixed(1)} years
          </span>
        </div>
      </div>

      {/* MEES Compliance */}
      <div className="mt-4">
        <div className="flex items-center gap-2">
          <span
            className={`w-2 h-2 rounded-full ${
              scenario.meesCompliant ? 'bg-success' : 'bg-danger'
            }`}
          />
          <span className="text-sm text-text-secondary">
            {scenario.meesCompliant ? 'MEES Compliant' : 'MEES Non-Compliant'}
          </span>
        </div>
      </div>
    </Card>
  );
}

export default ScenarioCard;
