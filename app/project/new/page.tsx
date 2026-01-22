'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { ArrowLeft, ArrowRight } from 'lucide-react';
import { Button } from '@/components/ui/Button';
import { Card } from '@/components/ui/Card';
import { Input, NumberInput } from '@/components/ui/Input';
import { Select } from '@/components/ui/Select';
import { useApp } from '@/lib/store';
import { PropertyType } from '@/lib/types';
import Link from 'next/link';

const propertyTypes: { value: PropertyType; label: string }[] = [
  { value: 'Office', label: 'Office' },
  { value: 'Residential', label: 'Residential' },
  { value: 'Retail', label: 'Retail' },
  { value: 'Industrial', label: 'Industrial' },
  { value: 'Mixed-Use', label: 'Mixed-Use' },
  { value: 'Other', label: 'Other' },
];

export default function NewProjectPage() {
  const { isAuthenticated, isLoading, createProject } = useApp();
  const router = useRouter();

  const [formData, setFormData] = useState({
    name: '',
    address: '',
    city: '',
    propertyType: '' as PropertyType | '',
    size: '' as number | '',
    yearBuilt: '' as number | '',
    clientName: '',
    clientCompany: '',
  });

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});

  useEffect(() => {
    if (!isLoading && !isAuthenticated) {
      router.push('/');
    }
  }, [isAuthenticated, isLoading, router]);

  if (isLoading || !isAuthenticated) {
    return (
      <div className="min-h-screen bg-navy flex items-center justify-center">
        <div className="animate-pulse text-gold text-xl">Loading...</div>
      </div>
    );
  }

  const validateForm = () => {
    const newErrors: Record<string, string> = {};

    if (!formData.name.trim()) {
      newErrors.name = 'Project name is required';
    }
    if (!formData.address.trim()) {
      newErrors.address = 'Property address is required';
    }
    if (!formData.city.trim()) {
      newErrors.city = 'City is required';
    }
    if (!formData.propertyType) {
      newErrors.propertyType = 'Property type is required';
    }
    if (!formData.size || formData.size <= 0) {
      newErrors.size = 'Valid property size is required';
    }
    if (!formData.yearBuilt || formData.yearBuilt < 1800 || formData.yearBuilt > new Date().getFullYear()) {
      newErrors.yearBuilt = 'Valid year built is required';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!validateForm()) {
      return;
    }

    setIsSubmitting(true);

    try {
      const project = createProject({
        name: formData.name,
        address: formData.address,
        city: formData.city,
        propertyType: formData.propertyType as PropertyType,
        size: formData.size as number,
        yearBuilt: formData.yearBuilt as number,
        clientName: formData.clientName || undefined,
        clientCompany: formData.clientCompany || undefined,
      });

      router.push(`/project/${project.id}`);
    } catch (error) {
      console.error('Failed to create project:', error);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen bg-navy">
      {/* Background decoration */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-0 right-0 w-1/2 h-1/2 bg-gradient-to-bl from-gold/5 to-transparent" />
        <div className="absolute bottom-0 left-0 w-1/2 h-1/2 bg-gradient-to-tr from-charcoal/50 to-transparent" />
      </div>

      <div className="relative z-10 min-h-screen flex flex-col">
        {/* Header */}
        <header className="p-6 lg:p-8">
          <Link
            href="/dashboard"
            className="inline-flex items-center gap-2 text-text-secondary hover:text-gold transition-colors"
          >
            <ArrowLeft className="w-4 h-4" />
            <span>Back to Projects</span>
          </Link>
        </header>

        {/* Form */}
        <main className="flex-1 flex items-center justify-center p-6 lg:p-8">
          <Card variant="elevated" className="w-full max-w-2xl">
            <div className="mb-8">
              <h1 className="text-2xl font-bold text-text-primary tracking-heading mb-2">
                Create New Project
              </h1>
              <p className="text-text-secondary">
                Enter the basic property details to get started with your feasibility analysis.
              </p>
            </div>

            <form onSubmit={handleSubmit} className="space-y-6">
              {/* Project Details */}
              <div className="space-y-4">
                <h2 className="text-sm font-medium text-gold uppercase tracking-wider">
                  Project Details
                </h2>
                <div className="h-px bg-gradient-to-r from-gold/30 to-transparent" />
              </div>

              <Input
                label="Project Name"
                placeholder="e.g., Victoria House Assessment"
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                error={errors.name}
              />

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <Input
                  label="Property Address"
                  placeholder="e.g., 42 Victoria Street"
                  value={formData.address}
                  onChange={(e) => setFormData({ ...formData, address: e.target.value })}
                  error={errors.address}
                />

                <Input
                  label="City"
                  placeholder="e.g., London"
                  value={formData.city}
                  onChange={(e) => setFormData({ ...formData, city: e.target.value })}
                  error={errors.city}
                />
              </div>

              {/* Property Details */}
              <div className="space-y-4 pt-4">
                <h2 className="text-sm font-medium text-gold uppercase tracking-wider">
                  Property Details
                </h2>
                <div className="h-px bg-gradient-to-r from-gold/30 to-transparent" />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <Select
                  label="Property Type"
                  options={propertyTypes}
                  value={formData.propertyType}
                  onChange={(value) => setFormData({ ...formData, propertyType: value as PropertyType })}
                  error={errors.propertyType}
                />

                <NumberInput
                  label="Approximate Size"
                  placeholder="e.g., 3500"
                  value={formData.size}
                  onChange={(value) => setFormData({ ...formData, size: value })}
                  suffix="sqm"
                  min={1}
                  error={errors.size}
                />
              </div>

              <NumberInput
                label="Year Built"
                placeholder="e.g., 1985"
                value={formData.yearBuilt}
                onChange={(value) => setFormData({ ...formData, yearBuilt: value })}
                min={1800}
                max={new Date().getFullYear()}
                error={errors.yearBuilt}
              />

              {/* Client Details (Optional) */}
              <div className="space-y-4 pt-4">
                <h2 className="text-sm font-medium text-gold uppercase tracking-wider">
                  Client Details (Optional)
                </h2>
                <div className="h-px bg-gradient-to-r from-gold/30 to-transparent" />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <Input
                  label="Client Name"
                  placeholder="e.g., John Smith"
                  value={formData.clientName}
                  onChange={(e) => setFormData({ ...formData, clientName: e.target.value })}
                />

                <Input
                  label="Client Company"
                  placeholder="e.g., Blackstone Capital"
                  value={formData.clientCompany}
                  onChange={(e) => setFormData({ ...formData, clientCompany: e.target.value })}
                />
              </div>

              {/* Actions */}
              <div className="flex justify-end gap-4 pt-6 border-t border-slate/20">
                <Link href="/dashboard">
                  <Button variant="ghost" type="button">
                    Cancel
                  </Button>
                </Link>
                <Button
                  type="submit"
                  isLoading={isSubmitting}
                  rightIcon={<ArrowRight className="w-4 h-4" />}
                >
                  Create Project
                </Button>
              </div>
            </form>
          </Card>
        </main>
      </div>
    </div>
  );
}
