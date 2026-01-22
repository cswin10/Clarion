'use client';

import { useState, useEffect } from 'react';
import { Card } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { Select } from '@/components/ui/Select';
import { NumberInput } from '@/components/ui/Input';
import { BuildingConditionInputs } from '@/lib/types';
import { Save } from 'lucide-react';

interface Props {
  initialData?: BuildingConditionInputs;
  onSave: (data: BuildingConditionInputs) => void;
}

const conditionOptions = [
  { value: 'Excellent', label: 'Excellent' },
  { value: 'Good', label: 'Good' },
  { value: 'Fair', label: 'Fair' },
  { value: 'Poor', label: 'Poor' },
  { value: 'Critical', label: 'Critical' },
];

const foundationOptions = [
  { value: 'None', label: 'None' },
  { value: 'Minor', label: 'Minor' },
  { value: 'Moderate', label: 'Moderate' },
  { value: 'Severe', label: 'Severe' },
];

const layoutOptions = [
  { value: 'Excellent', label: 'Excellent' },
  { value: 'Good', label: 'Good' },
  { value: 'Fair', label: 'Fair' },
  { value: 'Poor', label: 'Poor' },
];

const lightOptions = [
  { value: 'Excellent', label: 'Excellent' },
  { value: 'Good', label: 'Good' },
  { value: 'Limited', label: 'Limited' },
  { value: 'Poor', label: 'Poor' },
];

const fitOutOptions = [
  { value: 'Modern', label: 'Modern' },
  { value: 'Dated', label: 'Dated' },
  { value: 'Poor', label: 'Poor' },
  { value: 'Shell', label: 'Shell' },
];

const defaultData: BuildingConditionInputs = {
  overallStructuralCondition: 'Good',
  roofCondition: 'Good',
  facadeCondition: 'Good',
  foundationIssues: 'None',
  internalLayoutQuality: 'Good',
  floorToCeilingHeight: 2.7,
  naturalLightAssessment: 'Good',
  currentFitOutCondition: 'Dated',
  lastMajorRefurbishment: null,
  estimatedRemainingLifespan: 30,
  deferredMaintenanceEstimate: 100000,
};

export function BuildingConditionForm({ initialData, onSave }: Props) {
  const [formData, setFormData] = useState<BuildingConditionInputs>(
    initialData || defaultData
  );
  const [isSaving, setIsSaving] = useState(false);

  useEffect(() => {
    if (initialData) {
      setFormData(initialData);
    }
  }, [initialData]);

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
      {/* Structural Assessment */}
      <Card variant="bordered" padding="lg">
        <h3 className="text-lg font-semibold text-text-primary mb-6">
          Structural Assessment
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <Select
            label="Overall Structural Condition"
            options={conditionOptions}
            value={formData.overallStructuralCondition}
            onChange={(value) =>
              setFormData({ ...formData, overallStructuralCondition: value as BuildingConditionInputs['overallStructuralCondition'] })
            }
          />
          <Select
            label="Roof Condition"
            options={conditionOptions}
            value={formData.roofCondition}
            onChange={(value) =>
              setFormData({ ...formData, roofCondition: value as BuildingConditionInputs['roofCondition'] })
            }
          />
          <Select
            label="Facade Condition"
            options={conditionOptions}
            value={formData.facadeCondition}
            onChange={(value) =>
              setFormData({ ...formData, facadeCondition: value as BuildingConditionInputs['facadeCondition'] })
            }
          />
          <Select
            label="Foundation Issues"
            options={foundationOptions}
            value={formData.foundationIssues}
            onChange={(value) =>
              setFormData({ ...formData, foundationIssues: value as BuildingConditionInputs['foundationIssues'] })
            }
          />
        </div>
      </Card>

      {/* Interior Assessment */}
      <Card variant="bordered" padding="lg">
        <h3 className="text-lg font-semibold text-text-primary mb-6">
          Interior Assessment
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <Select
            label="Internal Layout Quality"
            options={layoutOptions}
            value={formData.internalLayoutQuality}
            onChange={(value) =>
              setFormData({ ...formData, internalLayoutQuality: value as BuildingConditionInputs['internalLayoutQuality'] })
            }
          />
          <NumberInput
            label="Floor-to-Ceiling Height"
            value={formData.floorToCeilingHeight}
            onChange={(value) =>
              setFormData({ ...formData, floorToCeilingHeight: value || 0 })
            }
            suffix="m"
            step={0.1}
            min={2}
            max={10}
          />
          <Select
            label="Natural Light Assessment"
            options={lightOptions}
            value={formData.naturalLightAssessment}
            onChange={(value) =>
              setFormData({ ...formData, naturalLightAssessment: value as BuildingConditionInputs['naturalLightAssessment'] })
            }
          />
          <Select
            label="Current Fit-Out Condition"
            options={fitOutOptions}
            value={formData.currentFitOutCondition}
            onChange={(value) =>
              setFormData({ ...formData, currentFitOutCondition: value as BuildingConditionInputs['currentFitOutCondition'] })
            }
          />
        </div>
      </Card>

      {/* Age & Maintenance */}
      <Card variant="bordered" padding="lg">
        <h3 className="text-lg font-semibold text-text-primary mb-6">
          Age & Maintenance
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <NumberInput
            label="Last Major Refurbishment"
            value={formData.lastMajorRefurbishment || ''}
            onChange={(value) =>
              setFormData({ ...formData, lastMajorRefurbishment: value || null })
            }
            placeholder="Year (or leave empty for Never)"
            min={1900}
            max={new Date().getFullYear()}
            hint="Leave empty if never refurbished"
          />
          <NumberInput
            label="Estimated Remaining Lifespan"
            value={formData.estimatedRemainingLifespan}
            onChange={(value) =>
              setFormData({ ...formData, estimatedRemainingLifespan: value || 0 })
            }
            suffix="years"
            min={0}
            max={100}
          />
          <NumberInput
            label="Deferred Maintenance Estimate"
            value={formData.deferredMaintenanceEstimate}
            onChange={(value) =>
              setFormData({ ...formData, deferredMaintenanceEstimate: value || 0 })
            }
            prefix="£"
            min={0}
          />
        </div>
      </Card>

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

export default BuildingConditionForm;
