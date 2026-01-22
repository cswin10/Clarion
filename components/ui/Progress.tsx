'use client';

import { HTMLAttributes } from 'react';

interface ProgressProps extends HTMLAttributes<HTMLDivElement> {
  value: number;
  max?: number;
  showLabel?: boolean;
  size?: 'sm' | 'md' | 'lg';
  variant?: 'default' | 'success' | 'warning' | 'danger';
}

const sizeStyles = {
  sm: 'h-1',
  md: 'h-2',
  lg: 'h-3',
};

const variantStyles = {
  default: 'bg-gold',
  success: 'bg-success',
  warning: 'bg-warning',
  danger: 'bg-danger',
};

export function Progress({
  value,
  max = 100,
  showLabel = false,
  size = 'md',
  variant = 'default',
  className = '',
  ...props
}: ProgressProps) {
  const percentage = Math.min(100, Math.max(0, (value / max) * 100));

  return (
    <div className={className} {...props}>
      {showLabel && (
        <div className="flex justify-between mb-1.5">
          <span className="text-sm text-text-secondary">Progress</span>
          <span className="text-sm text-text-primary font-medium">
            {Math.round(percentage)}%
          </span>
        </div>
      )}
      <div className={`progress-bar ${sizeStyles[size]}`}>
        <div
          className={`progress-fill ${variantStyles[variant]}`}
          style={{ width: `${percentage}%` }}
        />
      </div>
    </div>
  );
}

// Stepped Progress for form sections
interface Step {
  id: string;
  label: string;
  completed: boolean;
  active?: boolean;
}

interface SteppedProgressProps {
  steps: Step[];
  onStepClick?: (stepId: string) => void;
}

export function SteppedProgress({ steps, onStepClick }: SteppedProgressProps) {
  return (
    <div className="flex items-center gap-2">
      {steps.map((step, index) => (
        <div key={step.id} className="flex items-center">
          <button
            onClick={() => onStepClick?.(step.id)}
            className={`
              w-8 h-8 rounded-full flex items-center justify-center
              text-sm font-medium transition-all duration-200
              ${
                step.completed
                  ? 'bg-gold text-navy'
                  : step.active
                  ? 'bg-gold/20 text-gold border border-gold'
                  : 'bg-charcoal text-text-secondary border border-slate/30'
              }
              ${onStepClick ? 'cursor-pointer hover:opacity-80' : ''}
            `}
          >
            {step.completed ? (
              <svg
                className="w-4 h-4"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M5 13l4 4L19 7"
                />
              </svg>
            ) : (
              index + 1
            )}
          </button>
          {index < steps.length - 1 && (
            <div
              className={`w-8 h-0.5 mx-1 ${
                step.completed ? 'bg-gold' : 'bg-slate/30'
              }`}
            />
          )}
        </div>
      ))}
    </div>
  );
}

export default Progress;
