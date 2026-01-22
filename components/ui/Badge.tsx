'use client';

import { HTMLAttributes, ReactNode } from 'react';

type BadgeVariant = 'default' | 'success' | 'warning' | 'danger' | 'gold' | 'outline';
type BadgeSize = 'sm' | 'md';

interface BadgeProps extends HTMLAttributes<HTMLSpanElement> {
  variant?: BadgeVariant;
  size?: BadgeSize;
  icon?: ReactNode;
}

const variantStyles: Record<BadgeVariant, string> = {
  default: 'bg-slate/50 text-text-secondary',
  success: 'bg-success/20 text-success',
  warning: 'bg-warning/20 text-warning',
  danger: 'bg-danger/20 text-danger',
  gold: 'bg-gold/20 text-gold',
  outline: 'bg-transparent border border-slate/50 text-text-secondary',
};

const sizeStyles: Record<BadgeSize, string> = {
  sm: 'px-2 py-0.5 text-xs',
  md: 'px-2.5 py-1 text-sm',
};

export function Badge({
  variant = 'default',
  size = 'sm',
  icon,
  children,
  className = '',
  ...props
}: BadgeProps) {
  return (
    <span
      className={`
        inline-flex items-center gap-1
        rounded-full font-medium
        ${variantStyles[variant]}
        ${sizeStyles[size]}
        ${className}
      `}
      {...props}
    >
      {icon && <span className="shrink-0">{icon}</span>}
      {children}
    </span>
  );
}

// Status Badge for project status
interface StatusBadgeProps {
  status: 'In Progress' | 'Complete';
}

export function StatusBadge({ status }: StatusBadgeProps) {
  return (
    <Badge variant={status === 'Complete' ? 'success' : 'gold'}>
      {status}
    </Badge>
  );
}

// Risk Badge
interface RiskBadgeProps {
  level: 'Low' | 'Medium' | 'High';
}

export function RiskBadge({ level }: RiskBadgeProps) {
  const variant = level === 'Low' ? 'success' : level === 'Medium' ? 'warning' : 'danger';
  return <Badge variant={variant}>{level} Risk</Badge>;
}

// ESG Grade Badge
interface ESGBadgeProps {
  grade: 'A' | 'B' | 'C' | 'D' | 'E' | 'F';
}

export function ESGBadge({ grade }: ESGBadgeProps) {
  const variant =
    grade === 'A' || grade === 'B'
      ? 'success'
      : grade === 'C' || grade === 'D'
      ? 'warning'
      : 'danger';
  return (
    <Badge variant={variant} size="md">
      ESG: {grade}
    </Badge>
  );
}

// EPC Rating Badge
interface EPCBadgeProps {
  rating: 'A' | 'B' | 'C' | 'D' | 'E' | 'F' | 'G';
}

export function EPCBadge({ rating }: EPCBadgeProps) {
  const variant =
    rating === 'A' || rating === 'B'
      ? 'success'
      : rating === 'C' || rating === 'D'
      ? 'warning'
      : 'danger';
  return (
    <Badge variant={variant}>
      EPC {rating}
    </Badge>
  );
}

export default Badge;
