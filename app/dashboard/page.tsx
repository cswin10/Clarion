'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { Plus, Building2, MapPin, Calendar, ChevronRight, FolderOpen } from 'lucide-react';
import { PageWrapper } from '@/components/layout/PageWrapper';
import { Header } from '@/components/layout/Header';
import { Button } from '@/components/ui/Button';
import { Card } from '@/components/ui/Card';
import { Badge, StatusBadge } from '@/components/ui/Badge';
import { Progress } from '@/components/ui/Progress';
import { useApp } from '@/lib/store';

export default function DashboardPage() {
  const { isAuthenticated, isLoading, projects } = useApp();
  const router = useRouter();

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

  const getCompletedSections = (project: typeof projects[0]) => {
    let count = 0;
    if (project.inputs.condition) count++;
    if (project.inputs.planning) count++;
    if (project.inputs.mep) count++;
    if (project.inputs.costs) count++;
    if (project.inputs.esg) count++;
    return count;
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-GB', {
      day: 'numeric',
      month: 'short',
      year: 'numeric',
    });
  };

  return (
    <PageWrapper>
      <Header
        title="Your Projects"
        subtitle="Manage and analyse your real estate investments"
        action={
          <Link href="/project/new">
            <Button leftIcon={<Plus className="w-4 h-4" />}>New Project</Button>
          </Link>
        }
      />

      {projects.length === 0 ? (
        // Empty State
        <Card variant="bordered" className="mt-12 text-center py-16">
          <div className="flex flex-col items-center">
            <div className="w-20 h-20 rounded-full bg-charcoal flex items-center justify-center mb-6">
              <FolderOpen className="w-10 h-10 text-text-muted" />
            </div>
            <h3 className="text-xl font-semibold text-text-primary mb-2">
              No projects yet
            </h3>
            <p className="text-text-secondary mb-8 max-w-md">
              Create your first project to start analysing property investments and generating feasibility reports.
            </p>
            <Link href="/project/new">
              <Button size="lg" leftIcon={<Plus className="w-5 h-5" />}>
                Create Your First Project
              </Button>
            </Link>
          </div>
        </Card>
      ) : (
        // Project Grid
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6 mt-8">
          {projects.map((project) => {
            const completedSections = getCompletedSections(project);
            const progressPercentage = (completedSections / 5) * 100;

            return (
              <Link key={project.id} href={`/project/${project.id}`}>
                <Card
                  variant="elevated"
                  hover
                  className="h-full group"
                >
                  <div className="flex items-start justify-between mb-4">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-card bg-gold/10 flex items-center justify-center">
                        <Building2 className="w-5 h-5 text-gold" />
                      </div>
                      <div>
                        <h3 className="font-semibold text-text-primary group-hover:text-gold transition-colors">
                          {project.name}
                        </h3>
                        <Badge variant="outline" size="sm">
                          {project.propertyType}
                        </Badge>
                      </div>
                    </div>
                    <ChevronRight className="w-5 h-5 text-text-muted group-hover:text-gold transition-colors" />
                  </div>

                  <div className="space-y-3 mb-4">
                    <div className="flex items-center gap-2 text-sm text-text-secondary">
                      <MapPin className="w-4 h-4 text-text-muted" />
                      <span className="truncate">{project.address}</span>
                    </div>
                    <div className="flex items-center gap-2 text-sm text-text-secondary">
                      <Calendar className="w-4 h-4 text-text-muted" />
                      <span>Updated {formatDate(project.updatedAt)}</span>
                    </div>
                  </div>

                  <div className="pt-4 border-t border-slate/20">
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-sm text-text-secondary">
                        {completedSections}/5 sections complete
                      </span>
                      <StatusBadge status={project.status} />
                    </div>
                    <Progress value={progressPercentage} size="sm" />
                  </div>

                  {project.results && (
                    <div className="mt-4 pt-4 border-t border-slate/20">
                      <div className="flex items-center justify-between">
                        <span className="text-sm text-text-secondary">Recommendation</span>
                        <Badge
                          variant={
                            project.results.recommendation === 'Proceed'
                              ? 'success'
                              : project.results.recommendation === 'Optimise'
                              ? 'warning'
                              : 'danger'
                          }
                        >
                          {project.results.recommendation}
                        </Badge>
                      </div>
                    </div>
                  )}
                </Card>
              </Link>
            );
          })}
        </div>
      )}
    </PageWrapper>
  );
}
