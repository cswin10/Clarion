'use client';

import { ScenarioResults, RiskFlag } from '@/lib/types';
import { Card } from '@/components/ui/Card';
import { Badge } from '@/components/ui/Badge';
import {
  CheckCircle,
  AlertTriangle,
  XCircle,
  AlertOctagon,
  Info,
} from 'lucide-react';

interface Props {
  results: ScenarioResults;
}

export function RecommendationPanel({ results }: Props) {
  const { recommendation, recommendationSummary } = results;

  const getRecommendationStyles = () => {
    switch (recommendation) {
      case 'Proceed':
        return {
          bg: 'bg-success/10',
          border: 'border-success/30',
          icon: CheckCircle,
          iconColor: 'text-success',
          badgeVariant: 'success' as const,
        };
      case 'Optimise':
        return {
          bg: 'bg-warning/10',
          border: 'border-warning/30',
          icon: AlertTriangle,
          iconColor: 'text-warning',
          badgeVariant: 'warning' as const,
        };
      case 'Exit':
        return {
          bg: 'bg-danger/10',
          border: 'border-danger/30',
          icon: XCircle,
          iconColor: 'text-danger',
          badgeVariant: 'danger' as const,
        };
    }
  };

  const styles = getRecommendationStyles();
  const Icon = styles.icon;

  return (
    <Card
      variant="bordered"
      padding="lg"
      className={`${styles.bg} ${styles.border}`}
    >
      <div className="flex items-start gap-4">
        <div className={`shrink-0 ${styles.iconColor}`}>
          <Icon className="w-8 h-8" />
        </div>
        <div className="flex-1">
          <div className="flex items-center gap-3 mb-2">
            <h3 className="text-xl font-semibold text-text-primary">
              Recommendation
            </h3>
            <Badge variant={styles.badgeVariant} size="md">
              {recommendation}
            </Badge>
          </div>
          <p className="text-text-secondary leading-relaxed">
            {recommendationSummary}
          </p>
        </div>
      </div>
    </Card>
  );
}

interface RiskFlagsProps {
  flags: RiskFlag[];
}

export function RiskFlags({ flags }: RiskFlagsProps) {
  const getSeverityStyles = (severity: RiskFlag['severity']) => {
    switch (severity) {
      case 'high':
        return {
          bg: 'bg-danger/10',
          border: 'border-danger/30',
          icon: AlertOctagon,
          iconColor: 'text-danger',
        };
      case 'medium':
        return {
          bg: 'bg-warning/10',
          border: 'border-warning/30',
          icon: AlertTriangle,
          iconColor: 'text-warning',
        };
      case 'low':
        return {
          bg: 'bg-slate/20',
          border: 'border-slate/30',
          icon: Info,
          iconColor: 'text-text-secondary',
        };
    }
  };

  if (flags.length === 0) {
    return null;
  }

  return (
    <Card variant="bordered" padding="lg">
      <h3 className="text-lg font-semibold text-text-primary mb-4">
        Key Risks & Considerations
      </h3>
      <div className="space-y-3">
        {flags.map((flag, index) => {
          const styles = getSeverityStyles(flag.severity);
          const Icon = styles.icon;

          return (
            <div
              key={index}
              className={`flex items-start gap-3 p-3 rounded-button ${styles.bg} border ${styles.border}`}
            >
              <Icon className={`w-5 h-5 shrink-0 ${styles.iconColor}`} />
              <p className="text-sm text-text-primary">{flag.message}</p>
            </div>
          );
        })}
      </div>
    </Card>
  );
}

export default RecommendationPanel;
