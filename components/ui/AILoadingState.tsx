'use client';

import { Sparkles } from 'lucide-react';

interface Props {
  message: string;
  subMessage?: string;
}

export function AILoadingState({ message, subMessage }: Props) {
  return (
    <div className="flex flex-col items-center justify-center py-16">
      {/* Animated ring */}
      <div className="relative w-20 h-20 mb-8">
        {/* Outer ring */}
        <div className="absolute inset-0 border-2 border-gold/20 rounded-full" />
        {/* Spinning ring */}
        <div className="absolute inset-0 border-2 border-transparent border-t-gold rounded-full animate-spin" />
        {/* Inner glow */}
        <div className="absolute inset-3 bg-gold/5 rounded-full flex items-center justify-center">
          <Sparkles className="w-6 h-6 text-gold animate-pulse" />
        </div>
      </div>

      <p className="text-lg font-medium text-text-primary mb-2">{message}</p>
      {subMessage && (
        <p className="text-sm text-text-secondary">{subMessage}</p>
      )}

      {/* Progress dots */}
      <div className="flex gap-1.5 mt-6">
        <span
          className="w-2 h-2 bg-gold/60 rounded-full animate-pulse"
          style={{ animationDelay: '0s' }}
        />
        <span
          className="w-2 h-2 bg-gold/60 rounded-full animate-pulse"
          style={{ animationDelay: '0.2s' }}
        />
        <span
          className="w-2 h-2 bg-gold/60 rounded-full animate-pulse"
          style={{ animationDelay: '0.4s' }}
        />
      </div>
    </div>
  );
}

export function AILoadingOverlay({ message, subMessage }: Props) {
  return (
    <div className="fixed inset-0 z-50 bg-navy/90 backdrop-blur-sm flex items-center justify-center">
      <div className="bg-charcoal rounded-card p-12 border border-slate/20 shadow-2xl max-w-md w-full mx-4">
        <AILoadingState message={message} subMessage={subMessage} />
      </div>
    </div>
  );
}
