'use client';

import { forwardRef, InputHTMLAttributes } from 'react';

interface ToggleProps extends Omit<InputHTMLAttributes<HTMLInputElement>, 'onChange'> {
  label?: string;
  description?: string;
  checked?: boolean;
  onChange?: (checked: boolean) => void;
}

export const Toggle = forwardRef<HTMLInputElement, ToggleProps>(
  ({ label, description, checked = false, onChange, className = '', id, disabled, ...props }, ref) => {
    const toggleId = id || label?.toLowerCase().replace(/\s+/g, '-');

    return (
      <div className={`flex items-center justify-between ${className}`}>
        {(label || description) && (
          <div className="flex-1 mr-4">
            {label && (
              <label
                htmlFor={toggleId}
                className="text-sm font-medium text-text-primary cursor-pointer"
              >
                {label}
              </label>
            )}
            {description && (
              <p className="text-sm text-text-secondary mt-0.5">{description}</p>
            )}
          </div>
        )}
        <button
          type="button"
          role="switch"
          aria-checked={checked}
          disabled={disabled}
          onClick={() => onChange?.(!checked)}
          className={`
            relative inline-flex h-6 w-11 shrink-0
            cursor-pointer rounded-full
            border-2 border-transparent
            transition-colors duration-200 ease-in-out
            focus:outline-none focus:ring-2 focus:ring-gold/30 focus:ring-offset-2 focus:ring-offset-navy
            disabled:opacity-50 disabled:cursor-not-allowed
            ${checked ? 'bg-gold' : 'bg-slate'}
          `}
        >
          <span
            className={`
              pointer-events-none inline-block h-5 w-5
              rounded-full bg-white shadow-lg
              ring-0 transition duration-200 ease-in-out
              ${checked ? 'translate-x-5' : 'translate-x-0'}
            `}
          />
        </button>
        <input
          ref={ref}
          type="checkbox"
          id={toggleId}
          checked={checked}
          onChange={(e) => onChange?.(e.target.checked)}
          className="sr-only"
          {...props}
        />
      </div>
    );
  }
);

Toggle.displayName = 'Toggle';

export default Toggle;
