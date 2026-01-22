'use client';

import { useState, useEffect } from 'react';
import { Card } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { Select } from '@/components/ui/Select';
import { NumberInput } from '@/components/ui/Input';
import { Toggle } from '@/components/ui/Toggle';
import { MEPInputs } from '@/lib/types';
import { Save } from 'lucide-react';

interface Props {
  initialData?: MEPInputs;
  onSave: (data: MEPInputs) => void;
}

const capacityOptions = [
  { value: 'Adequate', label: 'Adequate' },
  { value: 'Upgrade Needed', label: 'Upgrade Needed' },
  { value: 'Major Upgrade', label: 'Major Upgrade' },
];

const boardConditionOptions = [
  { value: 'Good', label: 'Good' },
  { value: 'Fair', label: 'Fair' },
  { value: 'Poor', label: 'Poor' },
  { value: 'Replace', label: 'Replace' },
];

const hvacTypeOptions = [
  { value: 'Central', label: 'Central' },
  { value: 'Split', label: 'Split' },
  { value: 'VRF', label: 'VRF' },
  { value: 'None', label: 'None' },
];

const hvacConditionOptions = [
  { value: 'Good', label: 'Good' },
  { value: 'Fair', label: 'Fair' },
  { value: 'Poor', label: 'Poor' },
  { value: 'End of Life', label: 'End of Life' },
];

const heatingOptions = [
  { value: 'Gas', label: 'Gas' },
  { value: 'Electric', label: 'Electric' },
  { value: 'Heat Pump', label: 'Heat Pump' },
  { value: 'District', label: 'District' },
  { value: 'Other', label: 'Other' },
];

const coolingOptions = [
  { value: 'Full', label: 'Full' },
  { value: 'Partial', label: 'Partial' },
  { value: 'None', label: 'None' },
];

const simpleConditionOptions = [
  { value: 'Good', label: 'Good' },
  { value: 'Fair', label: 'Fair' },
  { value: 'Poor', label: 'Poor' },
];

const pressureOptions = [
  { value: 'Adequate', label: 'Adequate' },
  { value: 'Low', label: 'Low' },
  { value: 'Variable', label: 'Variable' },
];

const liftConditionOptions = [
  { value: 'Good', label: 'Good' },
  { value: 'Fair', label: 'Fair' },
  { value: 'Poor', label: 'Poor' },
  { value: 'None', label: 'None (No Lifts)' },
];

const fireAlarmOptions = [
  { value: 'Modern', label: 'Modern' },
  { value: 'Compliant', label: 'Compliant' },
  { value: 'Needs Upgrade', label: 'Needs Upgrade' },
  { value: 'Non-Compliant', label: 'Non-Compliant' },
];

const sprinklerOptions = [
  { value: 'Full', label: 'Full' },
  { value: 'Partial', label: 'Partial' },
  { value: 'None', label: 'None' },
];

const compartmentOptions = [
  { value: 'Compliant', label: 'Compliant' },
  { value: 'Issues Identified', label: 'Issues Identified' },
  { value: 'Non-Compliant', label: 'Non-Compliant' },
];

const defaultData: MEPInputs = {
  electricalSystemAge: 15,
  electricalCapacity: 'Adequate',
  distributionBoardCondition: 'Good',
  hvacSystemType: 'Central',
  hvacCondition: 'Fair',
  heatingSource: 'Gas',
  coolingProvision: 'Full',
  plumbingCondition: 'Good',
  waterPressure: 'Adequate',
  numberOfLifts: 2,
  liftCondition: 'Fair',
  liftModernisationNeeded: false,
  fireAlarmSystem: 'Compliant',
  sprinklerSystem: 'Partial',
  compartmentalisationStatus: 'Compliant',
};

export function MEPForm({ initialData, onSave }: Props) {
  const [formData, setFormData] = useState<MEPInputs>(initialData || defaultData);
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
      {/* Electrical */}
      <Card variant="bordered" padding="lg">
        <h3 className="text-lg font-semibold text-text-primary mb-6">
          Electrical Systems
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <NumberInput
            label="Electrical System Age"
            value={formData.electricalSystemAge}
            onChange={(value) =>
              setFormData({ ...formData, electricalSystemAge: value || 0 })
            }
            suffix="years"
            min={0}
            max={100}
          />
          <Select
            label="Electrical Capacity"
            options={capacityOptions}
            value={formData.electricalCapacity}
            onChange={(value) =>
              setFormData({ ...formData, electricalCapacity: value as MEPInputs['electricalCapacity'] })
            }
          />
          <Select
            label="Distribution Board Condition"
            options={boardConditionOptions}
            value={formData.distributionBoardCondition}
            onChange={(value) =>
              setFormData({ ...formData, distributionBoardCondition: value as MEPInputs['distributionBoardCondition'] })
            }
          />
        </div>
      </Card>

      {/* Mechanical */}
      <Card variant="bordered" padding="lg">
        <h3 className="text-lg font-semibold text-text-primary mb-6">
          Mechanical Systems
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <Select
            label="HVAC System Type"
            options={hvacTypeOptions}
            value={formData.hvacSystemType}
            onChange={(value) =>
              setFormData({ ...formData, hvacSystemType: value as MEPInputs['hvacSystemType'] })
            }
          />
          <Select
            label="HVAC Condition"
            options={hvacConditionOptions}
            value={formData.hvacCondition}
            onChange={(value) =>
              setFormData({ ...formData, hvacCondition: value as MEPInputs['hvacCondition'] })
            }
          />
          <Select
            label="Heating Source"
            options={heatingOptions}
            value={formData.heatingSource}
            onChange={(value) =>
              setFormData({ ...formData, heatingSource: value as MEPInputs['heatingSource'] })
            }
          />
          <Select
            label="Cooling Provision"
            options={coolingOptions}
            value={formData.coolingProvision}
            onChange={(value) =>
              setFormData({ ...formData, coolingProvision: value as MEPInputs['coolingProvision'] })
            }
          />
        </div>
      </Card>

      {/* Plumbing */}
      <Card variant="bordered" padding="lg">
        <h3 className="text-lg font-semibold text-text-primary mb-6">
          Plumbing
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <Select
            label="Plumbing Condition"
            options={simpleConditionOptions}
            value={formData.plumbingCondition}
            onChange={(value) =>
              setFormData({ ...formData, plumbingCondition: value as MEPInputs['plumbingCondition'] })
            }
          />
          <Select
            label="Water Pressure"
            options={pressureOptions}
            value={formData.waterPressure}
            onChange={(value) =>
              setFormData({ ...formData, waterPressure: value as MEPInputs['waterPressure'] })
            }
          />
        </div>
      </Card>

      {/* Lifts */}
      <Card variant="bordered" padding="lg">
        <h3 className="text-lg font-semibold text-text-primary mb-6">
          Lifts
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <NumberInput
            label="Number of Lifts"
            value={formData.numberOfLifts}
            onChange={(value) =>
              setFormData({ ...formData, numberOfLifts: value || 0 })
            }
            min={0}
            max={20}
          />
          <Select
            label="Lift Condition"
            options={liftConditionOptions}
            value={formData.liftCondition}
            onChange={(value) =>
              setFormData({ ...formData, liftCondition: value as MEPInputs['liftCondition'] })
            }
          />
        </div>
        <div className="mt-6">
          <Toggle
            label="Lift Modernisation Needed"
            description="Does the lift system require modernisation?"
            checked={formData.liftModernisationNeeded}
            onChange={(checked) => setFormData({ ...formData, liftModernisationNeeded: checked })}
          />
        </div>
      </Card>

      {/* Fire & Life Safety */}
      <Card variant="bordered" padding="lg">
        <h3 className="text-lg font-semibold text-text-primary mb-6">
          Fire & Life Safety
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <Select
            label="Fire Alarm System"
            options={fireAlarmOptions}
            value={formData.fireAlarmSystem}
            onChange={(value) =>
              setFormData({ ...formData, fireAlarmSystem: value as MEPInputs['fireAlarmSystem'] })
            }
          />
          <Select
            label="Sprinkler System"
            options={sprinklerOptions}
            value={formData.sprinklerSystem}
            onChange={(value) =>
              setFormData({ ...formData, sprinklerSystem: value as MEPInputs['sprinklerSystem'] })
            }
          />
          <Select
            label="Compartmentalisation Status"
            options={compartmentOptions}
            value={formData.compartmentalisationStatus}
            onChange={(value) =>
              setFormData({ ...formData, compartmentalisationStatus: value as MEPInputs['compartmentalisationStatus'] })
            }
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

export default MEPForm;
