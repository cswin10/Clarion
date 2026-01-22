'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { GitCompareArrows, Building2, TrendingUp, AlertTriangle, Check, X } from 'lucide-react';
import { PageWrapper } from '@/components/layout/PageWrapper';
import { Header } from '@/components/layout/Header';
import { Card } from '@/components/ui/Card';
import { Badge } from '@/components/ui/Badge';
import { useApp } from '@/lib/store';
import { Project } from '@/lib/types';
import { formatCurrency, formatPercentage } from '@/lib/calculations';

export default function ComparePage() {
  const { isAuthenticated, isLoading, projects } = useApp();
  const router = useRouter();
  const [selectedProjects, setSelectedProjects] = useState<string[]>([]);

  useEffect(() => {
    if (!isLoading && !isAuthenticated) {
      router.push('/');
    }
  }, [isAuthenticated, isLoading, router]);

  if (isLoading) {
    return (
      <div className="min-h-screen bg-navy flex items-center justify-center">
        <div className="animate-pulse text-gold text-xl">Loading...</div>
      </div>
    );
  }

  if (!isAuthenticated) {
    return null;
  }

  // Filter to only projects with results
  const completedProjects = projects.filter((p) => p.results);

  const toggleProject = (projectId: string) => {
    setSelectedProjects((prev) =>
      prev.includes(projectId)
        ? prev.filter((id) => id !== projectId)
        : prev.length < 4
        ? [...prev, projectId]
        : prev
    );
  };

  const selectedProjectData = selectedProjects
    .map((id) => completedProjects.find((p) => p.id === id))
    .filter((p): p is Project => p !== undefined);

  return (
    <PageWrapper>
      <Header
        title="Compare Projects"
        subtitle="Compare key metrics across your completed analyses"
      />

      {completedProjects.length === 0 ? (
        <Card variant="bordered" className="text-center py-16">
          <div className="flex flex-col items-center">
            <div className="w-20 h-20 rounded-full bg-charcoal flex items-center justify-center mb-6">
              <GitCompareArrows className="w-10 h-10 text-text-muted" />
            </div>
            <h3 className="text-xl font-semibold text-text-primary mb-2">
              No completed analyses yet
            </h3>
            <p className="text-text-secondary mb-8 max-w-md">
              Complete at least two project analyses to compare them side by side.
            </p>
          </div>
        </Card>
      ) : (
        <div className="space-y-8">
          {/* Project Selection */}
          <Card variant="bordered" padding="lg">
            <h3 className="text-lg font-semibold text-text-primary mb-4">
              Select Projects to Compare (up to 4)
            </h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
              {completedProjects.map((project) => {
                const isSelected = selectedProjects.includes(project.id);
                return (
                  <button
                    key={project.id}
                    onClick={() => toggleProject(project.id)}
                    className={`
                      p-4 rounded-card border-2 text-left transition-all
                      ${
                        isSelected
                          ? 'border-gold bg-gold/10'
                          : 'border-slate/30 hover:border-slate/50 bg-charcoal'
                      }
                    `}
                  >
                    <div className="flex items-start justify-between">
                      <div className="flex items-center gap-3">
                        <div className="w-8 h-8 rounded bg-gold/10 flex items-center justify-center shrink-0">
                          <Building2 className="w-4 h-4 text-gold" />
                        </div>
                        <div className="min-w-0">
                          <p className="font-medium text-text-primary truncate">
                            {project.name}
                          </p>
                          <p className="text-xs text-text-secondary truncate">
                            {project.city}
                          </p>
                        </div>
                      </div>
                      <div
                        className={`w-5 h-5 rounded-full border-2 flex items-center justify-center shrink-0 ${
                          isSelected ? 'border-gold bg-gold' : 'border-slate'
                        }`}
                      >
                        {isSelected && <Check className="w-3 h-3 text-navy" />}
                      </div>
                    </div>
                  </button>
                );
              })}
            </div>
          </Card>

          {/* Comparison Table */}
          {selectedProjectData.length >= 2 && (
            <Card variant="elevated" padding="none" className="overflow-hidden">
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead>
                    <tr className="border-b border-slate/20">
                      <th className="px-6 py-4 text-left text-sm font-medium text-text-secondary bg-charcoal">
                        Metric
                      </th>
                      {selectedProjectData.map((project) => (
                        <th
                          key={project.id}
                          className="px-6 py-4 text-left text-sm font-medium text-text-primary bg-charcoal min-w-[180px]"
                        >
                          <div className="flex items-center gap-2">
                            <Building2 className="w-4 h-4 text-gold" />
                            {project.name}
                          </div>
                        </th>
                      ))}
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate/10">
                    {/* Property Details */}
                    <tr className="bg-navy/50">
                      <td colSpan={selectedProjectData.length + 1} className="px-6 py-2">
                        <span className="text-xs font-semibold text-gold uppercase tracking-wider">
                          Property Details
                        </span>
                      </td>
                    </tr>
                    <ComparisonRow
                      label="Type"
                      values={selectedProjectData.map((p) => p.propertyType)}
                    />
                    <ComparisonRow
                      label="Size"
                      values={selectedProjectData.map((p) => `${p.size.toLocaleString()} sqm`)}
                    />
                    <ComparisonRow
                      label="City"
                      values={selectedProjectData.map((p) => p.city)}
                    />

                    {/* Recommendation */}
                    <tr className="bg-navy/50">
                      <td colSpan={selectedProjectData.length + 1} className="px-6 py-2">
                        <span className="text-xs font-semibold text-gold uppercase tracking-wider">
                          Analysis Result
                        </span>
                      </td>
                    </tr>
                    <tr>
                      <td className="px-6 py-3 text-sm text-text-secondary">
                        Recommendation
                      </td>
                      {selectedProjectData.map((p) => (
                        <td key={p.id} className="px-6 py-3">
                          <Badge
                            variant={
                              p.results?.recommendation === 'Proceed'
                                ? 'success'
                                : p.results?.recommendation === 'Optimise'
                                ? 'warning'
                                : 'danger'
                            }
                          >
                            {p.results?.recommendation}
                          </Badge>
                        </td>
                      ))}
                    </tr>
                    <ComparisonRow
                      label="Recommended Scenario"
                      values={selectedProjectData.map(
                        (p) =>
                          `${p.results?.recommendedScenario}: ${
                            p.results?.scenarios[p.results.recommendedScenario].name
                          }`
                      )}
                    />

                    {/* Financial Metrics */}
                    <tr className="bg-navy/50">
                      <td colSpan={selectedProjectData.length + 1} className="px-6 py-2">
                        <span className="text-xs font-semibold text-gold uppercase tracking-wider">
                          Financial Metrics (Recommended Scenario)
                        </span>
                      </td>
                    </tr>
                    <ComparisonRow
                      label="Capital Required"
                      values={selectedProjectData.map((p) =>
                        formatCurrency(
                          p.results?.scenarios[p.results.recommendedScenario].capitalRequired || 0
                        )
                      )}
                      highlight="lowest"
                    />
                    <ComparisonRow
                      label="IRR"
                      values={selectedProjectData.map((p) =>
                        formatPercentage(
                          p.results?.scenarios[p.results.recommendedScenario].irr || 0
                        )
                      )}
                      highlight="highest"
                    />
                    <ComparisonRow
                      label="Net Yield"
                      values={selectedProjectData.map((p) =>
                        formatPercentage(
                          p.results?.scenarios[p.results.recommendedScenario].netYield || 0
                        )
                      )}
                      highlight="highest"
                    />
                    <ComparisonRow
                      label="Payback Period"
                      values={selectedProjectData.map(
                        (p) =>
                          `${p.results?.scenarios[
                            p.results.recommendedScenario
                          ].paybackPeriod.toFixed(1)} years`
                      )}
                      highlight="lowest"
                    />

                    {/* Risk & ESG */}
                    <tr className="bg-navy/50">
                      <td colSpan={selectedProjectData.length + 1} className="px-6 py-2">
                        <span className="text-xs font-semibold text-gold uppercase tracking-wider">
                          Risk & ESG
                        </span>
                      </td>
                    </tr>
                    <ComparisonRow
                      label="Risk Rating"
                      values={selectedProjectData.map(
                        (p) => p.results?.scenarios[p.results.recommendedScenario].riskRating || '-'
                      )}
                    />
                    <ComparisonRow
                      label="ESG Score"
                      values={selectedProjectData.map(
                        (p) => p.results?.scenarios[p.results.recommendedScenario].esgScore || '-'
                      )}
                    />
                    <ComparisonRow
                      label="EPC Achieved"
                      values={selectedProjectData.map(
                        (p) =>
                          p.results?.scenarios[p.results.recommendedScenario].epcRatingAchieved ||
                          '-'
                      )}
                    />
                    <tr>
                      <td className="px-6 py-3 text-sm text-text-secondary">MEES Compliant</td>
                      {selectedProjectData.map((p) => (
                        <td key={p.id} className="px-6 py-3">
                          {p.results?.scenarios[p.results.recommendedScenario].meesCompliant ? (
                            <span className="flex items-center gap-1 text-success text-sm">
                              <Check className="w-4 h-4" /> Yes
                            </span>
                          ) : (
                            <span className="flex items-center gap-1 text-danger text-sm">
                              <X className="w-4 h-4" /> No
                            </span>
                          )}
                        </td>
                      ))}
                    </tr>
                    <ComparisonRow
                      label="High Risk Flags"
                      values={selectedProjectData.map(
                        (p) =>
                          `${p.results?.riskFlags.filter((f) => f.severity === 'high').length || 0}`
                      )}
                      highlight="lowest"
                    />
                  </tbody>
                </table>
              </div>
            </Card>
          )}

          {selectedProjectData.length === 1 && (
            <Card variant="bordered" className="text-center py-8">
              <p className="text-text-secondary">
                Select at least one more project to compare.
              </p>
            </Card>
          )}
        </div>
      )}
    </PageWrapper>
  );
}

interface ComparisonRowProps {
  label: string;
  values: string[];
  highlight?: 'highest' | 'lowest';
}

function ComparisonRow({ label, values, highlight }: ComparisonRowProps) {
  // Determine which value to highlight
  let highlightIndex = -1;
  if (highlight && values.length > 1) {
    const numericValues = values.map((v) => {
      const num = parseFloat(v.replace(/[^0-9.-]/g, ''));
      return isNaN(num) ? null : num;
    });

    if (numericValues.every((v) => v !== null)) {
      const validValues = numericValues as number[];
      if (highlight === 'highest') {
        highlightIndex = validValues.indexOf(Math.max(...validValues));
      } else {
        highlightIndex = validValues.indexOf(Math.min(...validValues));
      }
    }
  }

  return (
    <tr>
      <td className="px-6 py-3 text-sm text-text-secondary">{label}</td>
      {values.map((value, index) => (
        <td
          key={index}
          className={`px-6 py-3 text-sm ${
            index === highlightIndex ? 'text-gold font-semibold' : 'text-text-primary'
          }`}
        >
          {index === highlightIndex && <TrendingUp className="w-3 h-3 inline mr-1" />}
          {value}
        </td>
      ))}
    </tr>
  );
}
