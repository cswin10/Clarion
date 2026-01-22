'use client';

import { useState, useEffect } from 'react';
import { Card } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { Select } from '@/components/ui/Select';
import { NumberInput } from '@/components/ui/Input';
import { Toggle } from '@/components/ui/Toggle';
import { ESGInputs, WellbeingFeature } from '@/lib/types';
import { Save } from 'lucide-react';

interface Props {
  initialData?: ESGInputs;
  onSave: (data: ESGInputs) => void;
}

const epcOptions = [
  { value: 'A', label: 'A' },
  { value: 'B', label: 'B' },
  { value: 'C', label: 'C' },
  { value: 'D', label: 'D' },
  { value: 'E', label: 'E' },
  { value: 'F', label: 'F' },
  { value: 'G', label: 'G' },
];

const targetEpcOptions = [
  { value: 'A', label: 'A' },
  { value: 'B', label: 'B' },
  { value: 'C', label: 'C' },
];

const renewableOptions = [
  { value: 'None', label: 'None' },
  { value: 'Solar PV', label: 'Solar PV' },
  { value: 'Other', label: 'Other' },
  { value: 'Multiple', label: 'Multiple' },
];

const certificationOptions = [
  { value: 'None', label: 'None' },
  { value: 'BREEAM', label: 'BREEAM' },
  { value: 'LEED', label: 'LEED' },
  { value: 'Other', label: 'Other' },
];

const targetCertOptions = [
  { value: 'None', label: 'None' },
  { value: 'BREEAM Excellent', label: 'BREEAM Excellent' },
  { value: 'BREEAM Outstanding', label: 'BREEAM Outstanding' },
  { value: 'Net Zero', label: 'Net Zero' },
];

const riskOptions = [
  { value: 'Low', label: 'Low' },
  { value: 'Medium', label: 'Medium' },
  { value: 'High', label: 'High' },
];

const epbdOptions = [
  { value: 'None', label: 'None' },
  { value: 'Minor', label: 'Minor' },
  { value: 'Significant', label: 'Significant' },
  { value: 'Major', label: 'Major' },
];

const accessibilityOptions = [
  { value: 'Full DDA Compliant', label: 'Full DDA Compliant' },
  { value: 'Partial', label: 'Partial' },
  { value: 'Non-Compliant', label: 'Non-Compliant' },
];

const wellbeingFeatures: { value: WellbeingFeature; label: string }[] = [
  { value: 'Cycling Facilities', label: 'Cycling Facilities' },
  { value: 'Showers', label: 'Showers' },
  { value: 'Green Space', label: 'Green Space' },
  { value: 'Air Quality Monitoring', label: 'Air Quality Monitoring' },
  { value: 'Natural Light Optimisation', label: 'Natural Light Optimisation' },
];

const defaultData: ESGInputs = {
  currentEPCRating: 'D',
  targetEPCRating: 'B',
  energyUseIntensity: 150,
  carbonEmissionsCurrent: 35,
  renewableEnergyOnSite: 'None',
  greenBuildingCertification: 'None',
  targetCertification: 'BREEAM Excellent',
  meesCompliant: true,
  meesDeadlineRisk: 'Medium',
  epbdGegImplications: 'Minor',
  occupierWellbeingFeatures: [],
  accessibilityRating: 'Partial',
};

export function ESGForm({ initialData, onSave }: Props) {
  const [formData, setFormData] = useState<ESGInputs>(initialData || defaultData);
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

  const toggleWellbeingFeature = (feature: WellbeingFeature) => {
    const current = formData.occupierWellbeingFeatures;
    const updated = current.includes(feature)
      ? current.filter((f) => f !== feature)
      : [...current, feature];
    setFormData({ ...formData, occupierWellbeingFeatures: updated });
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-8">
      {/* Energy Performance */}
      <Card variant="bordered" padding="lg">
        <h3 className="text-lg font-semibold text-text-primary mb-6">
          Energy Performance
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <Select
            label="Current EPC Rating"
            options={epcOptions}
            value={formData.currentEPCRating}
            onChange={(value) =>
              setFormData({ ...formData, currentEPCRating: value as ESGInputs['currentEPCRating'] })
            }
          />
          <Select
            label="Target EPC Rating"
            options={targetEpcOptions}
            value={formData.targetEPCRating}
            onChange={(value) =>
              setFormData({ ...formData, targetEPCRating: value as ESGInputs['targetEPCRating'] })
            }
          />
          <NumberInput
            label="Energy Use Intensity"
            value={formData.energyUseIntensity}
            onChange={(value) =>
              setFormData({ ...formData, energyUseIntensity: value || 0 })
            }
            suffix="kWh/sqm/year"
            min={0}
          />
        </div>
      </Card>

      {/* Carbon & Environment */}
      <Card variant="bordered" padding="lg">
        <h3 className="text-lg font-semibold text-text-primary mb-6">
          Carbon & Environment
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <NumberInput
            label="Carbon Emissions - Current"
            value={formData.carbonEmissionsCurrent}
            onChange={(value) =>
              setFormData({ ...formData, carbonEmissionsCurrent: value || 0 })
            }
            suffix="kgCO2/sqm/year"
            min={0}
          />
          <Select
            label="Renewable Energy On-Site"
            options={renewableOptions}
            value={formData.renewableEnergyOnSite}
            onChange={(value) =>
              setFormData({ ...formData, renewableEnergyOnSite: value as ESGInputs['renewableEnergyOnSite'] })
            }
          />
          <Select
            label="Green Building Certification"
            options={certificationOptions}
            value={formData.greenBuildingCertification}
            onChange={(value) =>
              setFormData({ ...formData, greenBuildingCertification: value as ESGInputs['greenBuildingCertification'] })
            }
          />
          <Select
            label="Target Certification"
            options={targetCertOptions}
            value={formData.targetCertification}
            onChange={(value) =>
              setFormData({ ...formData, targetCertification: value as ESGInputs['targetCertification'] })
            }
          />
        </div>
      </Card>

      {/* Regulatory Compliance */}
      <Card variant="bordered" padding="lg">
        <h3 className="text-lg font-semibold text-text-primary mb-6">
          Regulatory Compliance
        </h3>
        <div className="mb-6">
          <Toggle
            label="MEES Compliant"
            description="Does the property meet Minimum Energy Efficiency Standards?"
            checked={formData.meesCompliant}
            onChange={(checked) => setFormData({ ...formData, meesCompliant: checked })}
          />
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <Select
            label="MEES Deadline Risk"
            options={riskOptions}
            value={formData.meesDeadlineRisk}
            onChange={(value) =>
              setFormData({ ...formData, meesDeadlineRisk: value as ESGInputs['meesDeadlineRisk'] })
            }
          />
          <Select
            label="EPBD/GEG Implications"
            options={epbdOptions}
            value={formData.epbdGegImplications}
            onChange={(value) =>
              setFormData({ ...formData, epbdGegImplications: value as ESGInputs['epbdGegImplications'] })
            }
          />
        </div>
      </Card>

      {/* Social & Governance */}
      <Card variant="bordered" padding="lg">
        <h3 className="text-lg font-semibold text-text-primary mb-6">
          Social & Governance
        </h3>

        <div className="mb-6">
          <label className="form-label">Occupier Wellbeing Features</label>
          <div className="grid grid-cols-2 md:grid-cols-3 gap-3 mt-2">
            {wellbeingFeatures.map((feature) => (
              <button
                key={feature.value}
                type="button"
                onClick={() => toggleWellbeingFeature(feature.value)}
                className={`
                  px-4 py-2 rounded-button text-sm font-medium
                  transition-all duration-200
                  ${
                    formData.occupierWellbeingFeatures.includes(feature.value)
                      ? 'bg-gold text-navy'
                      : 'bg-charcoal text-text-secondary hover:bg-slate hover:text-text-primary border border-slate/30'
                  }
                `}
              >
                {feature.label}
              </button>
            ))}
          </div>
        </div>

        <Select
          label="Accessibility Rating"
          options={accessibilityOptions}
          value={formData.accessibilityRating}
          onChange={(value) =>
            setFormData({ ...formData, accessibilityRating: value as ESGInputs['accessibilityRating'] })
          }
        />
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

export default ESGForm;
