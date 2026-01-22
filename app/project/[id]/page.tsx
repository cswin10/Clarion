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
      {/* Back Link - Mobile */}
      <Link
        href="/dashboard"
        className="inline-flex items-center gap-2 text-text-secondary hover:text-gold transition-colors mb-4 lg:hidden"
      >
        <ArrowLeft className="w-4 h-4" />
        <span>Back to Projects</span>
      </Link>

      <div className="flex flex-col lg:flex-row gap-6 lg:gap-8">
        {/* Left Sidebar - Project Info & Navigation */}
        <div className="w-full lg:w-80 lg:shrink-0">
          <div className="lg:sticky lg:top-8 space-y-4 lg:space-y-6">
            {/* Back Link - Desktop */}
            <Link
              href="/dashboard"
              className="hidden lg:inline-flex items-center gap-2 text-text-secondary hover:text-gold transition-colors"
            >
              <ArrowLeft className="w-4 h-4" />
              <span>Back to Projects</span>
            </Link>

            {/* Project Info Card */}
            <Card variant="elevated" padding="lg">
              <div className="flex items-center gap-3 mb-4">
                <div className="w-10 h-10 sm:w-12 sm:h-12 rounded-card bg-gold/10 flex items-center justify-center shrink-0">
                  <Building2 className="w-5 h-5 sm:w-6 sm:h-6 text-gold" />
                </div>
                <div className="min-w-0">
                  <h1 className="font-semibold text-text-primary text-base sm:text-lg truncate">
                    {project.name}
                  </h1>
                  <StatusBadge status={project.status} />
                </div>
              </div>

              <div className="space-y-2 text-sm">
                <div className="flex items-center gap-2 text-text-secondary">
                  <MapPin className="w-4 h-4 text-text-muted shrink-0" />
                  <span className="truncate">{project.address}, {project.city}</span>
                </div>
                <div className="flex items-center gap-2 text-text-secondary">
                  <Calendar className="w-4 h-4 text-text-muted shrink-0" />
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

            {/* Section Navigation - Horizontal scroll on mobile */}
            <Card variant="bordered" padding="sm">
              <nav className="flex lg:flex-col gap-2 lg:gap-1 overflow-x-auto lg:overflow-visible pb-2 lg:pb-0 scrollbar-hide">
                {sections.map((section, index) => {
                  const Icon = section.icon;
                  const isActive = activeSection === section.id;
                  const isComplete = isSectionComplete(section.id);

                  return (
                    <button
                      key={section.id}
                      onClick={() => setActiveSection(section.id)}
                      className={`
                        flex items-center gap-2 lg:gap-3 px-3 lg:px-4 py-2 lg:py-3 rounded-button
                        transition-all duration-200 text-left shrink-0 lg:shrink lg:w-full
                        ${
                          isActive
                            ? 'bg-gold/10 text-gold'
                            : 'text-text-secondary hover:bg-charcoal hover:text-text-primary'
                        }
                      `}
                    >
                      <span className="w-5 h-5 lg:w-6 lg:h-6 rounded-full bg-charcoal flex items-center justify-center text-xs font-medium shrink-0">
                        {isComplete ? (
                          <svg
                            className="w-3 h-3 lg:w-4 lg:h-4 text-success"
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
                        className={`text-xs lg:text-sm font-medium whitespace-nowrap lg:whitespace-normal lg:flex-1 ${
                          isActive ? 'text-gold' : ''
                        }`}
                      >
                        <span className="lg:hidden">{section.name.split(' ')[0]}</span>
                        <span className="hidden lg:inline">{section.name}</span>
                      </span>
                      <Icon
                        className={`w-4 h-4 hidden lg:block ${
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
          <div className="mb-4 lg:mb-6">
            <h2 className="text-lg lg:text-xl font-semibold text-text-primary tracking-heading">
              {sections.find((s) => s.id === activeSection)?.name}
            </h2>
            <p className="text-text-secondary text-sm lg:text-base mt-1">
              Complete this section to continue with your feasibility analysis.
            </p>
          </div>

          {renderForm()}
        </div>
      </div>
    </PageWrapper>
  );
}
