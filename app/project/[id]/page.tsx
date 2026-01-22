'use client';

import { useState, useEffect } from 'react';
import { useParams, useRouter } from 'next/navigation';
import Link from 'next/link';
import {
  Building2,
  Compass,
  Zap,
  Calculator,
  Leaf,
  ArrowLeft,
  BarChart3,
  MapPin,
  Calendar,
  ChevronRight,
} from 'lucide-react';
import { PageWrapper } from '@/components/layout/PageWrapper';
import { Card } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { StatusBadge } from '@/components/ui/Badge';
import { Progress } from '@/components/ui/Progress';
import { BuildingConditionForm } from '@/components/forms/BuildingConditionForm';
import { PlanningForm } from '@/components/forms/PlanningForm';
import { MEPForm } from '@/components/forms/MEPForm';
import { CostsForm } from '@/components/forms/CostsForm';
import { ESGForm } from '@/components/forms/ESGForm';
import { useApp, useFormCompletion } from '@/lib/store';
import { FormSection } from '@/lib/types';

const sections: {
  id: FormSection;
  name: string;
  icon: React.ComponentType<{ className?: string }>;
}[] = [
  { id: 'condition', name: 'Building Condition', icon: Building2 },
  { id: 'planning', name: 'Planning & Architecture', icon: Compass },
  { id: 'mep', name: 'MEP & Services', icon: Zap },
  { id: 'costs', name: 'Costs', icon: Calculator },
  { id: 'esg', name: 'ESG & Compliance', icon: Leaf },
];

export default function ProjectDetailPage() {
  const params = useParams();
  const router = useRouter();
  const projectId = params.id as string;

  const { isAuthenticated, isLoading, projects, updateProjectInputs, generateResults } = useApp();
  const [activeSection, setActiveSection] = useState<FormSection>('condition');

  const project = projects.find((p) => p.id === projectId);
  const completion = useFormCompletion(project || null);

  useEffect(() => {
    if (!isLoading && !isAuthenticated) {
      router.push('/');
    }
  }, [isAuthenticated, isLoading, router]);

  useEffect(() => {
    if (!isLoading && !project) {
      router.push('/dashboard');
    }
  }, [isLoading, project, router]);

  if (isLoading || !project) {
    return (
      <div className="min-h-screen bg-navy flex items-center justify-center">
        <div className="animate-pulse text-gold text-xl">Loading...</div>
      </div>
    );
  }

  const handleSaveSection = (section: FormSection, data: unknown) => {
    updateProjectInputs(projectId, section, data);

    // Auto-advance to next section
    const currentIndex = sections.findIndex((s) => s.id === section);
    if (currentIndex < sections.length - 1) {
      setActiveSection(sections[currentIndex + 1].id);
    }
  };

  const handleGenerateResults = () => {
    generateResults(projectId);
    router.push(`/project/${projectId}/results`);
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-GB', {
      day: 'numeric',
      month: 'short',
      year: 'numeric',
    });
  };

  const renderForm = () => {
    switch (activeSection) {
      case 'condition':
        return (
          <BuildingConditionForm
            initialData={project.inputs.condition}
            onSave={(data) => handleSaveSection('condition', data)}
          />
        );
      case 'planning':
        return (
          <PlanningForm
            initialData={project.inputs.planning}
            onSave={(data) => handleSaveSection('planning', data)}
          />
        );
      case 'mep':
        return (
          <MEPForm
            initialData={project.inputs.mep}
            onSave={(data) => handleSaveSection('mep', data)}
          />
        );
      case 'costs':
        return (
          <CostsForm
            initialData={project.inputs.costs}
            onSave={(data) => handleSaveSection('costs', data)}
          />
        );
      case 'esg':
        return (
          <ESGForm
            initialData={project.inputs.esg}
            onSave={(data) => handleSaveSection('esg', data)}
          />
        );
    }
  };

  const isSectionComplete = (section: FormSection) => {
    return completion[section];
  };

  return (
    <PageWrapper>
      <div className="flex gap-8">
        {/* Left Sidebar - Project Info & Navigation */}
        <div className="w-80 shrink-0">
          <div className="sticky top-8 space-y-6">
            {/* Back Link */}
            <Link
              href="/dashboard"
              className="inline-flex items-center gap-2 text-text-secondary hover:text-gold transition-colors"
            >
              <ArrowLeft className="w-4 h-4" />
              <span>Back to Projects</span>
            </Link>

            {/* Project Info Card */}
            <Card variant="elevated" padding="lg">
              <div className="flex items-center gap-3 mb-4">
                <div className="w-12 h-12 rounded-card bg-gold/10 flex items-center justify-center">
                  <Building2 className="w-6 h-6 text-gold" />
                </div>
                <div>
                  <h1 className="font-semibold text-text-primary text-lg">
                    {project.name}
                  </h1>
                  <StatusBadge status={project.status} />
                </div>
              </div>

              <div className="space-y-2 text-sm">
                <div className="flex items-center gap-2 text-text-secondary">
                  <MapPin className="w-4 h-4 text-text-muted" />
                  <span>{project.address}, {project.city}</span>
                </div>
                <div className="flex items-center gap-2 text-text-secondary">
                  <Calendar className="w-4 h-4 text-text-muted" />
                  <span>Updated {formatDate(project.updatedAt)}</span>
                </div>
              </div>

              <div className="mt-4 pt-4 border-t border-slate/20">
                <div className="flex justify-between text-sm mb-2">
                  <span className="text-text-secondary">Progress</span>
                  <span className="text-text-primary font-medium">
                    {completion.completedCount}/{completion.totalCount}
                  </span>
                </div>
                <Progress
                  value={(completion.completedCount / completion.totalCount) * 100}
                  size="sm"
                />
              </div>
            </Card>

            {/* Section Navigation */}
            <Card variant="bordered" padding="sm">
              <nav className="space-y-1">
                {sections.map((section, index) => {
                  const Icon = section.icon;
                  const isActive = activeSection === section.id;
                  const isComplete = isSectionComplete(section.id);

                  return (
                    <button
                      key={section.id}
                      onClick={() => setActiveSection(section.id)}
                      className={`
                        w-full flex items-center gap-3 px-4 py-3 rounded-button
                        transition-all duration-200 text-left
                        ${
                          isActive
                            ? 'bg-gold/10 text-gold'
                            : 'text-text-secondary hover:bg-charcoal hover:text-text-primary'
                        }
                      `}
                    >
                      <span className="w-6 h-6 rounded-full bg-charcoal flex items-center justify-center text-xs font-medium">
                        {isComplete ? (
                          <svg
                            className="w-4 h-4 text-success"
                            fill="none"
                            viewBox="0 0 24 24"
                            stroke="currentColor"
                          >
                            <path
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              strokeWidth={2}
                              d="M5 13l4 4L19 7"
                            />
                          </svg>
                        ) : (
                          <span className={isActive ? 'text-gold' : ''}>{index + 1}</span>
                        )}
                      </span>
                      <span
                        className={`flex-1 text-sm font-medium ${
                          isActive ? 'text-gold' : ''
                        }`}
                      >
                        {section.name}
                      </span>
                      <Icon
                        className={`w-4 h-4 ${
                          isActive ? 'text-gold' : isComplete ? 'text-success' : 'text-text-muted'
                        }`}
                      />
                    </button>
                  );
                })}
              </nav>
            </Card>

            {/* Generate Results Button */}
            {completion.isComplete && (
              <Button
                fullWidth
                size="lg"
                onClick={handleGenerateResults}
                leftIcon={<BarChart3 className="w-5 h-5" />}
                className="shadow-gold"
              >
                Generate Analysis
              </Button>
            )}

            {project.results && (
              <Link href={`/project/${projectId}/results`}>
                <Button
                  fullWidth
                  variant="outline"
                  rightIcon={<ChevronRight className="w-4 h-4" />}
                >
                  View Results
                </Button>
              </Link>
            )}
          </div>
        </div>

        {/* Main Content - Form */}
        <div className="flex-1 min-w-0">
          <div className="mb-6">
            <h2 className="text-xl font-semibold text-text-primary tracking-heading">
              {sections.find((s) => s.id === activeSection)?.name}
            </h2>
            <p className="text-text-secondary mt-1">
              Complete this section to continue with your feasibility analysis.
            </p>
          </div>

          {renderForm()}
        </div>
      </div>
    </PageWrapper>
  );
}
