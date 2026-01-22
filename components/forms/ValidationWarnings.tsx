'use client';

import { AlertTriangle, AlertCircle, Info, Lightbulb } from 'lucide-react';

export interface ValidationWarning {
  severity: 'info' | 'warning' | 'critical';
  field: string;
  message: string;
  suggestion?: string;
}

interface Props {
  warnings: ValidationWarning[];
  isLoading?: boolean;
}

export function ValidationWarnings({ warnings, isLoading }: Props) {
  if (isLoading) {
    return (
      <div className="mt-6 p-4 rounded-card bg-charcoal border border-slate/20">
        <div className="flex items-center gap-3">
          <div className="w-5 h-5 border-2 border-gold/30 border-t-gold rounded-full animate-spin" />
          <span className="text-sm text-text-secondary">AI reviewing inputs...</span>
        </div>
      </div>
    );
  }

  if (warnings.length === 0) return null;

  const getSeverityStyles = (severity: string) => {
    switch (severity) {
      case 'critical':
        return 'bg-danger/10 border-danger/30 text-danger';
      case 'warning':
        return 'bg-warning/10 border-warning/30 text-warning';
      default:
        return 'bg-gold/10 border-gold/30 text-gold';
    }
  };

  const getSeverityIcon = (severity: string) => {
    switch (severity) {
      case 'critical':
        return <AlertTriangle className="w-4 h-4" />;
      case 'warning':
        return <AlertCircle className="w-4 h-4" />;
      default:
        return <Info className="w-4 h-4" />;
    }
  };

  return (
    <div className="mt-6 space-y-3">
      <div className="flex items-center gap-2">
        <Lightbulb className="w-4 h-4 text-gold" />
        <h4 className="text-sm font-medium text-text-secondary">AI Review</h4>
      </div>
      {warnings.map((warning, index) => (
        <div
          key={index}
          className={`p-4 rounded-card border ${getSeverityStyles(warning.severity)}`}
        >
          <div className="flex items-start gap-3">
            <span className="mt-0.5 shrink-0">
              {getSeverityIcon(warning.severity)}
            </span>
            <div className="flex-1">
              <p className="text-sm font-medium text-text-primary">
                {warning.message}
              </p>
              {warning.suggestion && (
                <p className="text-sm text-text-secondary mt-1">
                  Suggestion: {warning.suggestion}
                </p>
              )}
              <p className="text-xs text-text-muted mt-1">
                Field: {warning.field}
              </p>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
}
