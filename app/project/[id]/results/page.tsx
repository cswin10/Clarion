'use client';

import { useEffect, useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import Link from 'next/link';
import dynamic from 'next/dynamic';
import {
  ArrowLeft,
  Building2,
  MapPin,
  Calendar,
  Edit,
  CheckCircle,
} from 'lucide-react';
import { PageWrapper } from '@/components/layout/PageWrapper';
import { Button } from '@/components/ui/Button';
import { Badge } from '@/components/ui/Badge';
import { ScenarioCard } from '@/components/results/ScenarioCard';
import { Scorecard } from '@/components/results/Scorecard';
import { RecommendationPanel, RiskFlags } from '@/components/results/RecommendationPanel';
import { useApp } from '@/lib/store';

// Dynamic import for charts to avoid SSR issues
const CashFlowChart = dynamic(
  () => import('@/components/results/ComparisonChart').then((mod) => mod.CashFlowChart),
  { ssr: false }
);

const RiskReturnChart = dynamic(
  () => import('@/components/results/ComparisonChart').then((mod) => mod.RiskReturnChart),
  { ssr: false }
);

// Dynamic import for PDF
const PDFDownloadButton = dynamic(
  () => import('@/components/pdf/PDFDownloadButton'),
  { ssr: false }
);

export default function ResultsPage() {
  const params = useParams();
  const router = useRouter();
  const projectId = params.id as string;

  const { isAuthenticated, isLoading, projects, generateResults } = useApp();
  const [isGenerating, setIsGenerating] = useState(false);

  const project = projects.find((p) => p.id === projectId);

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

  // Generate results if not already done
  useEffect(() => {
    if (project && !project.results && !isGenerating) {
      const hasAllInputs =
        project.inputs.condition &&
        project.inputs.planning &&
        project.inputs.mep &&
        project.inputs.costs &&
        project.inputs.esg;

      if (hasAllInputs) {
        setIsGenerating(true);
        generateResults(projectId);
        setIsGenerating(false);
      }
    }
  }, [project, projectId, generateResults, isGenerating]);

  if (isLoading || !project) {
    return (
      <div className="min-h-screen bg-navy flex items-center justify-center">
        <div className="animate-pulse text-gold text-xl">Loading...</div>
      </div>
    );
  }

  if (!project.results) {
    return (
      <PageWrapper>
        <div className="text-center py-16">
          <h2 className="text-xl font-semibold text-text-primary mb-4">
            Results Not Available
          </h2>
          <p className="text-text-secondary mb-8">
            Please complete all input sections before generating results.
          </p>
          <Link href={`/project/${projectId}`}>
            <Button>Complete Inputs</Button>
          </Link>
        </div>
      </PageWrapper>
    );
  }

  const { results } = project;

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-GB', {
      day: 'numeric',
      month: 'long',
      year: 'numeric',
    });
  };

  return (
    <PageWrapper fullWidth>
      <div className="max-w-7xl mx-auto px-8 py-8">
        {/* Header */}
        <div className="flex items-start justify-between mb-8">
          <div>
            <Link
              href={`/project/${projectId}`}
              className="inline-flex items-center gap-2 text-text-secondary hover:text-gold transition-colors mb-4"
            >
              <ArrowLeft className="w-4 h-4" />
              <span>Back to Project</span>
            </Link>

            <div className="flex items-center gap-4 mb-2">
              <div className="w-12 h-12 rounded-card bg-gold/10 flex items-center justify-center">
                <Building2 className="w-6 h-6 text-gold" />
              </div>
              <div>
                <h1 className="text-2xl font-bold text-text-primary tracking-heading">
                  {project.name}
                </h1>
                <div className="flex items-center gap-3 mt-1">
                  <div className="flex items-center gap-1 text-text-secondary text-sm">
                    <MapPin className="w-4 h-4" />
                    {project.address}, {project.city}
                  </div>
                </div>
              </div>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <Badge variant="success" size="md">
              <CheckCircle className="w-4 h-4 mr-1" />
              Analysis Complete
            </Badge>
            <Link href={`/project/${projectId}`}>
              <Button variant="ghost" leftIcon={<Edit className="w-4 h-4" />}>
                Edit Inputs
              </Button>
            </Link>
            <PDFDownloadButton project={project} />
          </div>
        </div>

        {/* Meta Info */}
        <div className="flex items-center gap-2 text-sm text-text-secondary mb-8">
          <Calendar className="w-4 h-4" />
          <span>Generated on {formatDate(results.generatedAt)}</span>
        </div>

        {/* Executive Summary */}
        <section className="mb-12">
          <h2 className="text-lg font-semibold text-text-primary mb-4">
            Executive Summary
          </h2>
          <RecommendationPanel results={results} />
        </section>

        {/* Scenario Comparison */}
        <section className="mb-12">
          <h2 className="text-lg font-semibold text-text-primary mb-4">
            Scenario Comparison
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <ScenarioCard
              scenario={results.scenarios.A}
              isRecommended={results.recommendedScenario === 'A'}
            />
            <ScenarioCard
              scenario={results.scenarios.B}
              isRecommended={results.recommendedScenario === 'B'}
            />
            <ScenarioCard
              scenario={results.scenarios.C}
              isRecommended={results.recommendedScenario === 'C'}
            />
          </div>
        </section>

        {/* Detailed Scorecard */}
        <section className="mb-12">
          <h2 className="text-lg font-semibold text-text-primary mb-4">
            Detailed Scorecard
          </h2>
          <Scorecard results={results} />
        </section>

        {/* Financial Charts */}
        <section className="mb-12">
          <h2 className="text-lg font-semibold text-text-primary mb-4">
            Financial Analysis
          </h2>
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <CashFlowChart
              data={results.cashFlowData}
              recommendedScenario={results.recommendedScenario}
            />
            <RiskReturnChart
              data={results.riskReturnData}
              recommendedScenario={results.recommendedScenario}
            />
          </div>
        </section>

        {/* Risk Flags */}
        <section className="mb-12">
          <RiskFlags flags={results.riskFlags} />
        </section>

        {/* Export Section */}
        <section className="border-t border-slate/20 pt-8">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-lg font-semibold text-text-primary">
                Export Report
              </h3>
              <p className="text-text-secondary text-sm mt-1">
                Download a comprehensive PDF report for stakeholders and investors.
              </p>
            </div>
            <PDFDownloadButton project={project} size="lg" />
          </div>
        </section>
      </div>
    </PageWrapper>
  );
}
