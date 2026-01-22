'use client';

import { useEffect, useState, useCallback } from 'react';
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
  Sparkles,
  RefreshCw,
} from 'lucide-react';
import { PageWrapper } from '@/components/layout/PageWrapper';
import { Button } from '@/components/ui/Button';
import { Badge } from '@/components/ui/Badge';
import { ScenarioCard } from '@/components/results/ScenarioCard';
import { Scorecard } from '@/components/results/Scorecard';
import { RecommendationPanel, RiskFlags } from '@/components/results/RecommendationPanel';
import { ChatPanel } from '@/components/results/ChatPanel';
import { AILoadingOverlay } from '@/components/ui/AILoadingState';
import { useApp } from '@/lib/store';
import { ScenarioResults, Scenario, RiskFlag, CashFlowData, RiskReturnData } from '@/lib/types';

// Helper function to convert AI scenarios to our ScenarioResults format
interface AIScenario {
  id: 'A' | 'B' | 'C';
  name: string;
  summary: string;
  strategy: string;
  capitalExpenditure: number;
  projectedAnnualIncome: number;
  netYield: number;
  irr: number;
  esgRating: string;
  riskLevel: 'Low' | 'Medium' | 'High';
  complexity: 'Low' | 'Medium' | 'High';
  timelineMonths: number;
  keyConsiderations: string[];
  epcRatingAchieved?: string;
  meesCompliant?: boolean;
  paybackPeriod?: number;
}

interface AIScenarioResponse {
  scenarios: {
    A: AIScenario;
    B: AIScenario;
    C: AIScenario;
  };
  recommendation: 'A' | 'B' | 'C';
  recommendationRationale: string;
}

interface AINarratives {
  executiveSummary?: string;
  riskAssessment?: string;
}

function convertAIScenariosToResults(
  aiResponse: AIScenarioResponse,
  narratives: AINarratives | null
): ScenarioResults {
  const convertScenario = (ai: AIScenario): Scenario => ({
    id: ai.id,
    name: ai.name,
    description: ai.strategy || ai.summary,
    capitalRequired: ai.capitalExpenditure,
    projectedAnnualIncome: ai.projectedAnnualIncome,
    netYield: ai.netYield,
    irr: ai.irr,
    esgScore: (ai.esgRating as 'A' | 'B' | 'C' | 'D' | 'E' | 'F') || 'C',
    riskRating: ai.riskLevel,
    complexityRating: ai.complexity,
    timeline: ai.timelineMonths,
    paybackPeriod: ai.paybackPeriod || (ai.capitalExpenditure / ai.projectedAnnualIncome),
    epcRatingAchieved: (ai.epcRatingAchieved as 'A' | 'B' | 'C' | 'D' | 'E' | 'F' | 'G') || 'C',
    meesCompliant: ai.meesCompliant ?? true,
    planningComplexity: ai.complexity,
    deliveryRisk: ai.riskLevel,
  });

  // Generate cash flow projections based on scenarios
  const cashFlowData: CashFlowData[] = [];
  for (let year = 1; year <= 10; year++) {
    const scenarioA = aiResponse.scenarios.A;
    const scenarioB = aiResponse.scenarios.B;
    const scenarioC = aiResponse.scenarios.C;

    // Simple cash flow model: -capex in year 1, then annual income accumulates
    const getCashFlow = (s: AIScenario, yr: number) => {
      if (yr === 1) return -s.capitalExpenditure + (s.projectedAnnualIncome * 0.5);
      return (yr - 1) * s.projectedAnnualIncome - s.capitalExpenditure + s.projectedAnnualIncome;
    };

    cashFlowData.push({
      year,
      scenarioA: Math.round(getCashFlow(scenarioA, year)),
      scenarioB: Math.round(getCashFlow(scenarioB, year)),
      scenarioC: Math.round(getCashFlow(scenarioC, year)),
    });
  }

  // Risk/return data for scatter plot
  const getRiskScore = (level: string) => {
    if (level === 'Low') return 2;
    if (level === 'Medium') return 5;
    return 8;
  };

  const riskReturnData: RiskReturnData[] = [
    { scenario: 'A', risk: getRiskScore(aiResponse.scenarios.A.riskLevel), irr: aiResponse.scenarios.A.irr },
    { scenario: 'B', risk: getRiskScore(aiResponse.scenarios.B.riskLevel), irr: aiResponse.scenarios.B.irr },
    { scenario: 'C', risk: getRiskScore(aiResponse.scenarios.C.riskLevel), irr: aiResponse.scenarios.C.irr },
  ];

  // Generate risk flags from AI considerations
  const riskFlags: RiskFlag[] = [];
  const allConsiderations = [
    ...aiResponse.scenarios.A.keyConsiderations,
    ...aiResponse.scenarios.B.keyConsiderations,
    ...aiResponse.scenarios.C.keyConsiderations,
  ];

  // Deduplicate and convert to risk flags
  const uniqueConsiderations = Array.from(new Set(allConsiderations)).slice(0, 5);
  uniqueConsiderations.forEach((consideration, index) => {
    riskFlags.push({
      severity: index === 0 ? 'high' : index < 3 ? 'medium' : 'low',
      message: consideration,
    });
  });

  // Determine recommendation type
  const recommendedScenario = aiResponse.scenarios[aiResponse.recommendation];
  let recommendationType: 'Proceed' | 'Optimise' | 'Exit' = 'Optimise';
  if (recommendedScenario.riskLevel === 'Low' && recommendedScenario.irr > 10) {
    recommendationType = 'Proceed';
  } else if (recommendedScenario.riskLevel === 'High' && recommendedScenario.irr < 8) {
    recommendationType = 'Exit';
  }

  return {
    recommendation: recommendationType,
    recommendationSummary: narratives?.executiveSummary?.substring(0, 500) || aiResponse.recommendationRationale,
    recommendedScenario: aiResponse.recommendation,
    scenarios: {
      A: convertScenario(aiResponse.scenarios.A),
      B: convertScenario(aiResponse.scenarios.B),
      C: convertScenario(aiResponse.scenarios.C),
    },
    cashFlowData,
    riskReturnData,
    riskFlags,
    generatedAt: new Date().toISOString(),
  };
}

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

  const { isAuthenticated, isLoading, projects, generateResults, setProjectResults } = useApp();
  const [isGeneratingAI, setIsGeneratingAI] = useState(false);
  const [aiLoadingMessage, setAiLoadingMessage] = useState('');
  const useAI = true; // Enable AI by default

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

  // Generate AI results
  const generateAIResults = useCallback(async () => {
    if (!project || isGeneratingAI) return;

    const hasAllInputs =
      project.inputs.condition &&
      project.inputs.planning &&
      project.inputs.mep &&
      project.inputs.costs &&
      project.inputs.esg;

    if (!hasAllInputs) return;

    setIsGeneratingAI(true);

    try {
      // Step 1: Generate AI scenarios
      setAiLoadingMessage('Analysing property data...');

      const propertyContext = {
        name: project.name,
        address: project.address,
        city: project.city,
        propertyType: project.propertyType,
        size: project.size,
        yearBuilt: project.yearBuilt,
      };

      const scenarioResponse = await fetch('/api/ai/scenarios', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          property: propertyContext,
          inputs: project.inputs,
        }),
      });

      if (!scenarioResponse.ok) {
        throw new Error('Failed to generate AI scenarios');
      }

      const aiScenarios = await scenarioResponse.json();

      // Step 2: Generate narratives
      setAiLoadingMessage('Writing executive summary...');

      const narrativeResponse = await fetch('/api/ai/narratives', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          property: propertyContext,
          inputs: project.inputs,
          scenarios: aiScenarios,
        }),
      });

      let narratives = null;
      if (narrativeResponse.ok) {
        narratives = await narrativeResponse.json();
      }

      // Convert AI scenarios to ScenarioResults format
      setAiLoadingMessage('Finalising analysis...');

      const convertedResults = convertAIScenariosToResults(aiScenarios, narratives);
      setProjectResults(projectId, convertedResults);

    } catch (error) {
      console.error('AI generation error:', error);
      // Fall back to standard calculation
      generateResults(projectId);
    } finally {
      setIsGeneratingAI(false);
      setAiLoadingMessage('');
    }
  }, [project, projectId, generateResults, setProjectResults, isGeneratingAI]);

  // Auto-generate results if not already done
  useEffect(() => {
    if (project && !project.results && !isGeneratingAI) {
      const hasAllInputs =
        project.inputs.condition &&
        project.inputs.planning &&
        project.inputs.mep &&
        project.inputs.costs &&
        project.inputs.esg;

      if (hasAllInputs) {
        if (useAI) {
          generateAIResults();
        } else {
          generateResults(projectId);
        }
      }
    }
  }, [project, projectId, generateResults, isGeneratingAI, useAI, generateAIResults]);

  if (isLoading || !project) {
    return (
      <div className="min-h-screen bg-navy flex items-center justify-center">
        <div className="animate-pulse text-gold text-xl">Loading...</div>
      </div>
    );
  }

  if (isGeneratingAI) {
    return (
      <AILoadingOverlay
        message={aiLoadingMessage || 'Generating analysis...'}
        subMessage="This typically takes 15-30 seconds"
      />
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

  // Chat context for AI assistant
  const chatContext = {
    property: {
      name: project.name,
      address: project.address,
      city: project.city,
      propertyType: project.propertyType,
      size: project.size,
      yearBuilt: project.yearBuilt,
    },
    inputs: project.inputs,
    scenarios: {
      scenarios: results.scenarios,
      recommendation: results.recommendedScenario,
      recommendationRationale: results.recommendationSummary,
    },
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
            <Button
              variant="ghost"
              size="sm"
              leftIcon={<RefreshCw className="w-4 h-4" />}
              onClick={() => {
                if (useAI) {
                  generateAIResults();
                } else {
                  generateResults(projectId);
                }
              }}
            >
              Regenerate
            </Button>
            <Link href={`/project/${projectId}`}>
              <Button variant="ghost" leftIcon={<Edit className="w-4 h-4" />}>
                Edit Inputs
              </Button>
            </Link>
            <PDFDownloadButton project={project} />
          </div>
        </div>

        {/* Meta Info */}
        <div className="flex items-center gap-4 text-sm text-text-secondary mb-8">
          <div className="flex items-center gap-2">
            <Calendar className="w-4 h-4" />
            <span>Generated on {formatDate(results.generatedAt)}</span>
          </div>
          <div className="flex items-center gap-2">
            <Sparkles className="w-4 h-4 text-gold" />
            <span>AI-Enhanced Analysis</span>
          </div>
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

        {/* AI Chat Assistant */}
        <section className="mb-12">
          <h2 className="text-lg font-semibold text-text-primary mb-4">
            Ask Questions
          </h2>
          <ChatPanel context={chatContext} />
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
