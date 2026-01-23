'use client';

import { useState, useEffect, useCallback } from 'react';
import { Card } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { NumberInput } from '@/components/ui/Input';
import { ValidationWarnings, ValidationWarning } from './ValidationWarnings';
import { CostsInputs } from '@/lib/types';
import { Save } from 'lucide-react';

interface Props {
  initialData?: CostsInputs;
  onSave: (data: CostsInputs) => void;
  propertySize?: number;
  propertyType?: string;
}

const defaultData: CostsInputs = {
  currentAnnualRent: 500000,
  currentOccupancyRate: 85,
  currentAnnualServiceCharge: 100000,
  currentAnnualOperatingCosts: 150000,
  currentPropertyValueEstimate: 10000000,
  lightRefurbishmentEstimate: 150,
  fullRefurbishmentEstimate: 350,
  extensionConversionCostEstimate: 500,
  comparableRentCurrentUse: 280,
  comparableRentAlternativeUse: 380,
  targetYield: 6,
  estimatedSaleValuePostWorks: 15000000,
};

export function CostsForm({ initialData, onSave, propertySize = 1000, propertyType = 'Office' }: Props) {
  const [formData, setFormData] = useState<CostsInputs>(initialData || defaultData);
  const [isSaving, setIsSaving] = useState(false);
  const [warnings, setWarnings] = useState<ValidationWarning[]>([]);
  const [isValidating, setIsValidating] = useState(false);

  useEffect(() => {
    if (initialData) {
      setFormData(initialData);
    }
  }, [initialData]);

  // Debounced validation
  const validateInputs = useCallback(async (data: CostsInputs) => {
    setIsValidating(true);
    try {
      const response = await fetch('/api/ai/validate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          inputs: { costs: data },
          propertySize,
          propertyType,
        }),
      });

      if (response.ok) {
        const result = await response.json();
        setWarnings(result.warnings || []);
      }
    } catch (error) {
      console.error('Validation error:', error);
    } finally {
      setIsValidating(false);
    }
  }, [propertySize, propertyType]);

  // Validate on data change (debounced)
  useEffect(() => {
    const timer = setTimeout(() => {
      validateInputs(formData);
    }, 1000); // 1 second debounce

    return () => clearTimeout(timer);
  }, [formData, validateInputs]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSaving(true);
    try {
      onSave(formData);
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-8">
      {/* Current Financials */}
      <Card variant="bordered" padding="lg">
        <h3 className="text-lg font-semibold text-text-primary mb-6">
          Current Financials
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <NumberInput
            label="Current Annual Rent"
            value={formData.currentAnnualRent}
            onChange={(value) =>
              setFormData({ ...formData, currentAnnualRent: value || 0 })
            }
            prefix="£"
            min={0}
          />
          <NumberInput
            label="Current Occupancy Rate"
            value={formData.currentOccupancyRate}
            onChange={(value) =>
              setFormData({ ...formData, currentOccupancyRate: value || 0 })
            }
            suffix="%"
            min={0}
            max={100}
          />
          <NumberInput
            label="Current Annual Service Charge"
            value={formData.currentAnnualServiceCharge}
            onChange={(value) =>
              setFormData({ ...formData, currentAnnualServiceCharge: value || 0 })
            }
            prefix="£"
            min={0}
          />
          <NumberInput
            label="Current Annual Operating Costs"
            value={formData.currentAnnualOperatingCosts}
            onChange={(value) =>
              setFormData({ ...formData, currentAnnualOperatingCosts: value || 0 })
            }
            prefix="£"
            min={0}
          />
          <NumberInput
            label="Current Property Value Estimate"
            value={formData.currentPropertyValueEstimate}
            onChange={(value) =>
              setFormData({ ...formData, currentPropertyValueEstimate: value || 0 })
            }
            prefix="£"
            min={0}
          />
        </div>
      </Card>

      {/* Refurbishment Costs */}
      <Card variant="bordered" padding="lg">
        <h3 className="text-lg font-semibold text-text-primary mb-6">
          Refurbishment Cost Estimates
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <NumberInput
            label="Light Refurbishment Estimate"
            value={formData.lightRefurbishmentEstimate}
            onChange={(value) =>
              setFormData({ ...formData, lightRefurbishmentEstimate: value || 0 })
            }
            prefix="£"
            suffix="/sqm"
            min={0}
            hint="Cost per square metre for light refurbishment"
          />
          <NumberInput
            label="Full Refurbishment Estimate"
            value={formData.fullRefurbishmentEstimate}
            onChange={(value) =>
              setFormData({ ...formData, fullRefurbishmentEstimate: value || 0 })
            }
            prefix="£"
            suffix="/sqm"
            min={0}
            hint="Cost per square metre for full refurbishment"
          />
          <NumberInput
            label="Extension/Conversion Cost Estimate"
            value={formData.extensionConversionCostEstimate}
            onChange={(value) =>
              setFormData({ ...formData, extensionConversionCostEstimate: value || 0 })
            }
            prefix="£"
            suffix="/sqm"
            min={0}
            hint="Cost per square metre for extension or conversion"
          />
        </div>
      </Card>

      {/* Market Context */}
      <Card variant="bordered" padding="lg">
        <h3 className="text-lg font-semibold text-text-primary mb-6">
          Market Context
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <NumberInput
            label="Comparable Rent - Current Use"
            value={formData.comparableRentCurrentUse}
            onChange={(value) =>
              setFormData({ ...formData, comparableRentCurrentUse: value || 0 })
            }
            prefix="£"
            suffix="/sqm/year"
            min={0}
            hint="Market rent for current use type"
          />
          <NumberInput
            label="Comparable Rent - Alternative Use"
            value={formData.comparableRentAlternativeUse}
            onChange={(value) =>
              setFormData({ ...formData, comparableRentAlternativeUse: value || 0 })
            }
            prefix="£"
            suffix="/sqm/year"
            min={0}
            hint="Market rent for alternative/best use type"
          />
          <NumberInput
            label="Target Yield"
            value={formData.targetYield}
            onChange={(value) =>
              setFormData({ ...formData, targetYield: value || 0 })
            }
            suffix="%"
            min={0}
            max={20}
            step={0.1}
          />
          <NumberInput
            label="Estimated Sale Value Post-Works"
            value={formData.estimatedSaleValuePostWorks}
            onChange={(value) =>
              setFormData({ ...formData, estimatedSaleValuePostWorks: value || 0 })
            }
            prefix="£"
            min={0}
          />
        </div>
      </Card>

      {/* AI Validation Warnings */}
      <ValidationWarnings warnings={warnings} isLoading={isValidating} />

      {/* Save Button */}
      <div className="flex justify-end">
        <Button
          type="submit"
          isLoading={isSaving}
          leftIcon={<Save className="w-4 h-4" />}
        >
          Save & Continue
        </Button>
      </div>
    </form>
  );
}

export default CostsForm;
