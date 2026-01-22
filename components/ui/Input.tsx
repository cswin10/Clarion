'use client';

import { forwardRef, InputHTMLAttributes, ReactNode } from 'react';

interface InputProps extends InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  error?: string;
  hint?: string;
  leftAddon?: ReactNode;
  rightAddon?: ReactNode;
}

export const Input = forwardRef<HTMLInputElement, InputProps>(
  (
    {
      label,
      error,
      hint,
      leftAddon,
      rightAddon,
      className = '',
      id,
      ...props
    },
    ref
  ) => {
    const inputId = id || label?.toLowerCase().replace(/\s+/g, '-');

    return (
      <div className="form-group">
        {label && (
          <label htmlFor={inputId} className="form-label">
            {label}
          </label>
        )}
        <div className="relative">
          {leftAddon && (
            <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
              <span className="text-text-secondary text-sm">{leftAddon}</span>
            </div>
          )}
          <input
            ref={ref}
            id={inputId}
            className={`
              w-full
              bg-navy
              border border-slate/50
              rounded-input
              px-4 py-2.5
              text-text-primary
              placeholder-text-muted
              transition-all duration-200
              input-focus-gold
              hover:border-slate
              disabled:opacity-50 disabled:cursor-not-allowed
              ${leftAddon ? 'pl-10' : ''}
              ${rightAddon ? 'pr-10' : ''}
              ${error ? 'border-danger focus:border-danger focus:ring-danger/20' : ''}
              ${className}
            `}
            {...props}
          />
          {rightAddon && (
            <div className="absolute inset-y-0 right-0 flex items-center pr-3 pointer-events-none">
              <span className="text-text-secondary text-sm">{rightAddon}</span>
            </div>
          )}
        </div>
        {error && <p className="mt-1.5 text-sm text-danger">{error}</p>}
        {hint && !error && (
          <p className="mt-1.5 text-sm text-text-muted">{hint}</p>
        )}
      </div>
    );
  }
);

Input.displayName = 'Input';

// Number Input with formatting
interface NumberInputProps extends Omit<InputProps, 'type' | 'value' | 'onChange'> {
  value: number | '';
  onChange: (value: number | '') => void;
  min?: number;
  max?: number;
  step?: number;
  prefix?: string;
  suffix?: string;
}

export const NumberInput = forwardRef<HTMLInputElement, NumberInputProps>(
  (
    {
      value,
      onChange,
      min,
      max,
      step = 1,
      prefix,
      suffix,
      ...props
    },
    ref
  ) => {
    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
      const val = e.target.value;
      if (val === '') {
        onChange('');
      } else {
        const num = parseFloat(val);
        if (!isNaN(num)) {
          onChange(num);
        }
      }
    };

    return (
      <Input
        ref={ref}
        type="number"
        value={value}
        onChange={handleChange}
        min={min}
        max={max}
        step={step}
        leftAddon={prefix}
        rightAddon={suffix}
        {...props}
      />
    );
  }
);

NumberInput.displayName = 'NumberInput';

export default Input;
