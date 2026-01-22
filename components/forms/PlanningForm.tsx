'use client';

import { useState, useEffect } from 'react';
import { Card } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { Select } from '@/components/ui/Select';
import { NumberInput } from '@/components/ui/Input';
import { Toggle } from '@/components/ui/Toggle';
import { PlanningInputs } from '@/lib/types';
import { Save } from 'lucide-react';

interface Props {
  initialData?: PlanningInputs;
  onSave: (data: PlanningInputs) => void;
}

const useClassOptions = [
  { value: 'E', label: 'E (Commercial, Business & Service)' },
  { value: 'F1', label: 'F1 (Learning & Non-Residential)' },
  { value: 'F2', label: 'F2 (Local Community)' },
  { value: 'C1', label: 'C1 (Hotels)' },
  { value: 'C2', label: 'C2 (Residential Institutions)' },
  { value: 'C3', label: 'C3 (Dwellinghouses)' },
  { value: 'B2', label: 'B2 (General Industrial)' },
  { value: 'B8', label: 'B8 (Storage & Distribution)' },
  { value: 'Sui Generis', label: 'Sui Generis' },
];

const listedOptions = [
  { value: 'Not Listed', label: 'Not Listed' },
  { value: 'Grade I', label: 'Grade I' },
  { value: 'Grade II*', label: 'Grade II*' },
  { value: 'Grade II', label: 'Grade II' },
];

const extensionOptions = [
  { value: 'None', label: 'None' },
  { value: 'Limited', label: 'Limited' },
  { value: 'Moderate', label: 'Moderate' },
  { value: 'Significant', label: 'Significant' },
];

const feasibilityOptions = [
  { value: 'Straightforward', label: 'Straightforward' },
  { value: 'Achievable', label: 'Achievable' },
  { value: 'Complex', label: 'Complex' },
  { value: 'Unlikely', label: 'Unlikely' },
];

const planningHistoryOptions = [
  { value: 'None', label: 'None' },
  { value: 'Approved', label: 'Approved' },
  { value: 'Refused', label: 'Refused' },
  { value: 'Pending', label: 'Pending' },
];

const riskOptions = [
  { value: 'Low', label: 'Low' },
  { value: 'Medium', label: 'Medium' },
  { value: 'High', label: 'High' },
];

const defaultData: PlanningInputs = {
  currentUseClass: 'E',
  conservationArea: false,
  listedBuilding: 'Not Listed',
  article4Direction: false,
  permittedDevelopmentRights: true,
  extensionPotential: 'Moderate',
  changeOfUseFeasibility: 'Achievable',
  additionalFloorsPotential: 0,
  recentPlanningApplications: 'None',
  planningRiskLevel: 'Low',
  estimatedPlanningTimeline: 6,
};

export function PlanningForm({ initialData, onSave }: Props) {
  const [formData, setFormData] = useState<PlanningInputs>(initialData || defaultData);
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
      {/* Current Status */}
      <Card variant="bordered" padding="lg">
        <h3 className="text-lg font-semibold text-text-primary mb-6">
          Current Status
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <Select
            label="Current Use Class"
            options={useClassOptions}
            value={formData.currentUseClass}
            onChange={(value) =>
              setFormData({ ...formData, currentUseClass: value as PlanningInputs['currentUseClass'] })
            }
          />
          <Select
            label="Listed Building"
            options={listedOptions}
            value={formData.listedBuilding}
            onChange={(value) =>
              setFormData({ ...formData, listedBuilding: value as PlanningInputs['listedBuilding'] })
            }
          />
        </div>
        <div className="mt-6 space-y-4">
          <Toggle
            label="Conservation Area"
            description="Is the property located within a conservation area?"
            checked={formData.conservationArea}
            onChange={(checked) => setFormData({ ...formData, conservationArea: checked })}
          />
          <Toggle
            label="Article 4 Direction"
            description="Is there an Article 4 Direction in place?"
            checked={formData.article4Direction}
            onChange={(checked) => setFormData({ ...formData, article4Direction: checked })}
          />
        </div>
      </Card>

      {/* Development Potential */}
      <Card variant="bordered" padding="lg">
        <h3 className="text-lg font-semibold text-text-primary mb-6">
          Development Potential
        </h3>
        <div className="mb-6">
          <Toggle
            label="Permitted Development Rights"
            description="Does the property benefit from PD rights?"
            checked={formData.permittedDevelopmentRights}
            onChange={(checked) => setFormData({ ...formData, permittedDevelopmentRights: checked })}
          />
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <Select
            label="Extension Potential"
            options={extensionOptions}
            value={formData.extensionPotential}
            onChange={(value) =>
              setFormData({ ...formData, extensionPotential: value as PlanningInputs['extensionPotential'] })
            }
          />
          <Select
            label="Change of Use Feasibility"
            options={feasibilityOptions}
            value={formData.changeOfUseFeasibility}
            onChange={(value) =>
              setFormData({ ...formData, changeOfUseFeasibility: value as PlanningInputs['changeOfUseFeasibility'] })
            }
          />
          <NumberInput
            label="Additional Floors Potential"
            value={formData.additionalFloorsPotential}
            onChange={(value) =>
              setFormData({ ...formData, additionalFloorsPotential: value || 0 })
            }
            min={0}
            max={10}
            hint="Number of potential additional floors"
          />
        </div>
      </Card>

      {/* Planning History */}
      <Card variant="bordered" padding="lg">
        <h3 className="text-lg font-semibold text-text-primary mb-6">
          Planning History
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <Select
            label="Recent Planning Applications"
            options={planningHistoryOptions}
            value={formData.recentPlanningApplications}
            onChange={(value) =>
              setFormData({ ...formData, recentPlanningApplications: value as PlanningInputs['recentPlanningApplications'] })
            }
          />
          <Select
            label="Planning Risk Level"
            options={riskOptions}
            value={formData.planningRiskLevel}
            onChange={(value) =>
              setFormData({ ...formData, planningRiskLevel: value as PlanningInputs['planningRiskLevel'] })
            }
          />
          <NumberInput
            label="Estimated Planning Timeline"
            value={formData.estimatedPlanningTimeline}
            onChange={(value) =>
              setFormData({ ...formData, estimatedPlanningTimeline: value || 0 })
            }
            suffix="months"
            min={0}
            max={36}
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

export default PlanningForm;
