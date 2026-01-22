'use client';

import { ReactNode } from 'react';
import { ChevronRight } from 'lucide-react';
import Link from 'next/link';

interface BreadcrumbItem {
  label: string;
  href?: string;
}

interface HeaderProps {
  title: string;
  subtitle?: string;
  breadcrumbs?: BreadcrumbItem[];
  action?: ReactNode;
}

export function Header({ title, subtitle, breadcrumbs, action }: HeaderProps) {
  return (
    <header className="mb-6 sm:mb-8">
      {/* Breadcrumbs */}
      {breadcrumbs && breadcrumbs.length > 0 && (
        <nav className="flex items-center gap-1 sm:gap-2 text-xs sm:text-sm mb-3 overflow-x-auto">
          {breadcrumbs.map((item, index) => (
            <div key={index} className="flex items-center gap-1 sm:gap-2 shrink-0">
              {index > 0 && (
                <ChevronRight className="w-3 h-3 sm:w-4 sm:h-4 text-text-muted" />
              )}
              {item.href ? (
                <Link
                  href={item.href}
                  className="text-text-secondary hover:text-gold transition-colors whitespace-nowrap"
                >
                  {item.label}
                </Link>
              ) : (
                <span className="text-text-primary whitespace-nowrap">{item.label}</span>
              )}
            </div>
          ))}
        </nav>
      )}

      {/* Title and Action */}
      <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-3 sm:gap-4">
        <div className="min-w-0">
          <h1 className="text-xl sm:text-2xl font-bold text-text-primary tracking-heading">
            {title}
          </h1>
          {subtitle && (
            <p className="text-text-secondary text-sm sm:text-base mt-1">{subtitle}</p>
          )}
        </div>
        {action && <div className="shrink-0">{action}</div>}
      </div>
    </header>
  );
}

export default Header;
