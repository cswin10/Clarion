'use client';

import { useEffect, useRef, useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useApp } from '@/lib/store';
import {
  ArrowRight,
  Building2,
  BarChart3,
  FileText,
  Shield,
  Sparkles,
  TrendingUp,
  Zap,
  Check,
  ChevronDown,
  Play,
} from 'lucide-react';

export default function LandingPage() {
  const { isAuthenticated, isLoading } = useApp();
  const router = useRouter();
  const [scrollY, setScrollY] = useState(0);
  const heroRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (isAuthenticated && !isLoading) {
      router.push('/dashboard');
    }
  }, [isAuthenticated, isLoading, router]);

  useEffect(() => {
    const handleScroll = () => setScrollY(window.scrollY);
    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  if (isLoading) {
    return (
      <div className="min-h-screen bg-navy flex items-center justify-center">
        <div className="animate-pulse text-accent text-xl">Loading...</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-surface-primary overflow-hidden">
      {/* Navigation */}
      <nav className="fixed top-0 left-0 right-0 z-50 transition-all duration-300"
           style={{ backgroundColor: scrollY > 50 ? 'rgba(8, 12, 21, 0.95)' : 'transparent' }}>
        <div className="max-w-7xl mx-auto px-6 lg:px-8">
          <div className="flex items-center justify-between h-20">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-accent to-accent-warm flex items-center justify-center">
                <Building2 className="w-5 h-5 text-surface-primary" />
              </div>
              <span className="text-2xl font-bold tracking-tight text-white">Clarion</span>
            </div>
            <div className="hidden md:flex items-center gap-8">
              <a href="#features" className="text-sm text-neutral-400 hover:text-white transition-colors">Features</a>
              <a href="#how-it-works" className="text-sm text-neutral-400 hover:text-white transition-colors">How it Works</a>
              <a href="#benefits" className="text-sm text-neutral-400 hover:text-white transition-colors">Benefits</a>
            </div>
            <div className="flex items-center gap-4">
              <Link
                href="/login"
                className="hidden sm:block text-sm font-medium text-white hover:text-accent transition-colors"
              >
                Sign In
              </Link>
              <Link
                href="/login"
                className="group inline-flex items-center gap-2 px-5 py-2.5 bg-gradient-to-r from-accent to-accent-warm text-surface-primary font-semibold text-sm rounded-full hover:shadow-accent transition-all duration-300"
              >
                Get Started
                <ArrowRight className="w-4 h-4 group-hover:translate-x-0.5 transition-transform" />
              </Link>
            </div>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <section ref={heroRef} className="relative min-h-screen flex items-center justify-center pt-20">
        {/* Animated Background */}
        <div className="absolute inset-0 overflow-hidden">
          {/* Gradient orbs */}
          <div
            className="absolute w-[800px] h-[800px] rounded-full opacity-20"
            style={{
              background: 'radial-gradient(circle, rgba(200, 170, 110, 0.4) 0%, transparent 70%)',
              top: '-20%',
              right: '-10%',
              transform: `translateY(${scrollY * 0.1}px)`,
            }}
          />
          <div
            className="absolute w-[600px] h-[600px] rounded-full opacity-15"
            style={{
              background: 'radial-gradient(circle, rgba(139, 115, 85, 0.5) 0%, transparent 70%)',
              bottom: '-10%',
              left: '-5%',
              transform: `translateY(${-scrollY * 0.05}px)`,
            }}
          />

          {/* Grid pattern */}
          <div
            className="absolute inset-0 opacity-[0.03]"
            style={{
              backgroundImage: `
                linear-gradient(rgba(200, 170, 110, 0.5) 1px, transparent 1px),
                linear-gradient(90deg, rgba(200, 170, 110, 0.5) 1px, transparent 1px)
              `,
              backgroundSize: '60px 60px',
            }}
          />

          {/* Floating elements */}
          <div className="absolute top-1/4 left-[15%] w-2 h-2 rounded-full bg-accent/40 animate-pulse" />
          <div className="absolute top-1/3 right-[20%] w-3 h-3 rounded-full bg-accent-warm/30 animate-pulse" style={{ animationDelay: '1s' }} />
          <div className="absolute bottom-1/3 left-[25%] w-2 h-2 rounded-full bg-accent/30 animate-pulse" style={{ animationDelay: '2s' }} />
        </div>

        <div className="relative z-10 max-w-7xl mx-auto px-6 lg:px-8 text-center">
          {/* Badge */}
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-surface-secondary/80 border border-accent/20 mb-8 backdrop-blur-sm">
            <Sparkles className="w-4 h-4 text-accent" />
            <span className="text-sm text-neutral-300">AI-Powered Real Estate Intelligence</span>
          </div>

          {/* Main headline */}
          <h1 className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-bold text-white tracking-tight mb-6 leading-[1.1]">
            Make Confident
            <span className="block mt-2 bg-gradient-to-r from-accent via-accent-warm to-accent bg-clip-text text-transparent">
              Property Decisions
            </span>
          </h1>

          {/* Subheadline */}
          <p className="max-w-2xl mx-auto text-lg sm:text-xl text-neutral-400 mb-10 leading-relaxed">
            Transform complex commercial real estate data into clear, actionable
            investment insights with AI-powered feasibility analysis.
          </p>

          {/* CTA Buttons */}
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4 mb-16">
            <Link
              href="/login"
              className="group w-full sm:w-auto inline-flex items-center justify-center gap-3 px-8 py-4 bg-gradient-to-r from-accent to-accent-warm text-surface-primary font-semibold rounded-full hover:shadow-accent transition-all duration-300 text-lg"
            >
              Start Analysing
              <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
            </Link>
            <button className="group w-full sm:w-auto inline-flex items-center justify-center gap-3 px-8 py-4 border border-neutral-700 text-white font-medium rounded-full hover:border-accent/50 hover:bg-surface-secondary transition-all duration-300 text-lg">
              <Play className="w-5 h-5 text-accent" />
              Watch Demo
            </button>
          </div>

          {/* Trust indicators */}
          <div className="flex flex-wrap items-center justify-center gap-8 text-neutral-500 text-sm">
            <div className="flex items-center gap-2">
              <Shield className="w-4 h-4 text-accent" />
              <span>Enterprise Security</span>
            </div>
            <div className="flex items-center gap-2">
              <Zap className="w-4 h-4 text-accent" />
              <span>Real-Time Analysis</span>
            </div>
            <div className="flex items-center gap-2">
              <FileText className="w-4 h-4 text-accent" />
              <span>Investor-Ready Reports</span>
            </div>
          </div>

          {/* Scroll indicator */}
          <div className="absolute bottom-8 left-1/2 -translate-x-1/2 flex flex-col items-center gap-2 text-neutral-500">
            <span className="text-xs uppercase tracking-wider">Explore</span>
            <ChevronDown className="w-5 h-5 animate-bounce" />
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section id="features" className="relative py-32 bg-surface-secondary">
        <div className="max-w-7xl mx-auto px-6 lg:px-8">
          {/* Section header */}
          <div className="text-center mb-20">
            <span className="inline-block px-4 py-1.5 rounded-full bg-accent/10 text-accent text-sm font-medium mb-4">
              Powerful Features
            </span>
            <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-white mb-6">
              Everything You Need to Decide
            </h2>
            <p className="max-w-2xl mx-auto text-neutral-400 text-lg">
              Comprehensive tools designed for real estate professionals who demand clarity and precision.
            </p>
          </div>

          {/* Feature cards */}
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {[
              {
                icon: Building2,
                title: 'Building Assessment',
                description: 'Evaluate structural condition, MEP systems, and compliance status with guided assessments.',
                gradient: 'from-blue-500/20 to-cyan-500/20',
              },
              {
                icon: BarChart3,
                title: 'Scenario Modelling',
                description: 'Compare Hold, Refurbish, and Redevelop scenarios with automated financial projections.',
                gradient: 'from-accent/20 to-accent-warm/20',
              },
              {
                icon: Sparkles,
                title: 'AI Recommendations',
                description: 'Get intelligent insights and recommendations powered by advanced AI analysis.',
                gradient: 'from-purple-500/20 to-pink-500/20',
              },
              {
                icon: TrendingUp,
                title: 'Financial Metrics',
                description: 'Calculate IRR, Net Yield, Payback Period, and NPV with industry-standard models.',
                gradient: 'from-green-500/20 to-emerald-500/20',
              },
              {
                icon: Shield,
                title: 'Risk Assessment',
                description: 'Identify and quantify regulatory, market, and operational risks automatically.',
                gradient: 'from-orange-500/20 to-red-500/20',
              },
              {
                icon: FileText,
                title: 'Professional Reports',
                description: 'Generate investor-ready PDF reports with complete analysis and visualisations.',
                gradient: 'from-indigo-500/20 to-violet-500/20',
              },
            ].map((feature, index) => (
              <div
                key={index}
                className="group relative p-8 rounded-2xl bg-surface-primary border border-neutral-800 hover:border-accent/30 transition-all duration-500"
              >
                <div className={`absolute inset-0 rounded-2xl bg-gradient-to-br ${feature.gradient} opacity-0 group-hover:opacity-100 transition-opacity duration-500`} />
                <div className="relative">
                  <div className="w-14 h-14 rounded-xl bg-surface-secondary flex items-center justify-center mb-6 group-hover:scale-110 transition-transform duration-300">
                    <feature.icon className="w-7 h-7 text-accent" />
                  </div>
                  <h3 className="text-xl font-semibold text-white mb-3">{feature.title}</h3>
                  <p className="text-neutral-400 leading-relaxed">{feature.description}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* How It Works Section */}
      <section id="how-it-works" className="relative py-32 bg-surface-primary overflow-hidden">
        {/* Background decoration */}
        <div className="absolute left-0 top-1/2 -translate-y-1/2 w-[500px] h-[500px] rounded-full bg-accent/5 blur-3xl" />

        <div className="relative max-w-7xl mx-auto px-6 lg:px-8">
          <div className="text-center mb-20">
            <span className="inline-block px-4 py-1.5 rounded-full bg-accent/10 text-accent text-sm font-medium mb-4">
              Simple Process
            </span>
            <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-white mb-6">
              From Data to Decision
            </h2>
            <p className="max-w-2xl mx-auto text-neutral-400 text-lg">
              Four simple steps to transform your property assessment into actionable intelligence.
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
            {[
              { step: '01', title: 'Input Details', description: 'Enter property details, building condition, and financial parameters.' },
              { step: '02', title: 'AI Analysis', description: 'Our AI processes your data and generates multiple scenarios.' },
              { step: '03', title: 'Review Results', description: 'Compare scenarios with detailed metrics and recommendations.' },
              { step: '04', title: 'Export Report', description: 'Download investor-ready PDF reports for stakeholders.' },
            ].map((item, index) => (
              <div key={index} className="relative">
                {index < 3 && (
                  <div className="hidden lg:block absolute top-8 left-[60%] w-[80%] h-px bg-gradient-to-r from-accent/50 to-transparent" />
                )}
                <div className="relative text-center lg:text-left">
                  <span className="inline-block text-6xl font-bold bg-gradient-to-b from-accent/40 to-transparent bg-clip-text text-transparent mb-4">
                    {item.step}
                  </span>
                  <h3 className="text-xl font-semibold text-white mb-3">{item.title}</h3>
                  <p className="text-neutral-400">{item.description}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Benefits Section */}
      <section id="benefits" className="relative py-32 bg-surface-secondary">
        <div className="max-w-7xl mx-auto px-6 lg:px-8">
          <div className="grid lg:grid-cols-2 gap-16 items-center">
            {/* Left content */}
            <div>
              <span className="inline-block px-4 py-1.5 rounded-full bg-accent/10 text-accent text-sm font-medium mb-4">
                Why Clarion
              </span>
              <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-white mb-6">
                Built for Real Estate Professionals
              </h2>
              <p className="text-neutral-400 text-lg mb-10">
                Stop spending weeks on feasibility studies. Get the insights you need in hours, not days.
              </p>

              <div className="space-y-6">
                {[
                  'Reduce analysis time by up to 80%',
                  'Generate consistent, professional reports',
                  'Compare multiple scenarios instantly',
                  'Make data-driven investment decisions',
                  'Stay ahead of MEES and ESG compliance',
                ].map((benefit, index) => (
                  <div key={index} className="flex items-center gap-4">
                    <div className="w-6 h-6 rounded-full bg-accent/20 flex items-center justify-center shrink-0">
                      <Check className="w-4 h-4 text-accent" />
                    </div>
                    <span className="text-white">{benefit}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Right visual */}
            <div className="relative">
              <div className="absolute inset-0 bg-gradient-to-br from-accent/20 to-accent-warm/10 rounded-3xl blur-3xl" />
              <div className="relative p-8 rounded-3xl bg-surface-primary border border-neutral-800">
                {/* Mock dashboard preview */}
                <div className="space-y-6">
                  <div className="flex items-center justify-between pb-4 border-b border-neutral-800">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-lg bg-accent/10 flex items-center justify-center">
                        <Building2 className="w-5 h-5 text-accent" />
                      </div>
                      <div>
                        <p className="font-medium text-white">125 City Road</p>
                        <p className="text-sm text-neutral-500">Office - 5,200 sqm</p>
                      </div>
                    </div>
                    <span className="px-3 py-1 rounded-full bg-green-500/10 text-green-400 text-sm font-medium">
                      Proceed
                    </span>
                  </div>

                  <div className="grid grid-cols-3 gap-4">
                    {[
                      { label: 'IRR', value: '14.2%' },
                      { label: 'Net Yield', value: '6.8%' },
                      { label: 'Payback', value: '5.2 yrs' },
                    ].map((metric, index) => (
                      <div key={index} className="text-center p-4 rounded-xl bg-surface-secondary">
                        <p className="text-2xl font-bold text-accent mb-1">{metric.value}</p>
                        <p className="text-xs text-neutral-500 uppercase tracking-wider">{metric.label}</p>
                      </div>
                    ))}
                  </div>

                  <div className="space-y-3">
                    {['Light Refurb', 'Full Refurb', 'Redevelop'].map((scenario, index) => (
                      <div key={index} className="flex items-center justify-between p-3 rounded-lg bg-surface-secondary">
                        <span className="text-sm text-white">{scenario}</span>
                        <div className="flex items-center gap-2">
                          <div className="w-24 h-2 rounded-full bg-neutral-700 overflow-hidden">
                            <div
                              className="h-full rounded-full bg-gradient-to-r from-accent to-accent-warm"
                              style={{ width: `${[65, 80, 45][index]}%` }}
                            />
                          </div>
                          <span className="text-sm text-neutral-400">{[65, 80, 45][index]}%</span>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="relative py-32 bg-surface-primary overflow-hidden">
        {/* Background effects */}
        <div className="absolute inset-0">
          <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[1000px] h-[600px] rounded-full bg-accent/10 blur-3xl" />
        </div>

        <div className="relative max-w-4xl mx-auto px-6 lg:px-8 text-center">
          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-white mb-6">
            Ready to Transform Your
            <span className="block mt-2 bg-gradient-to-r from-accent to-accent-warm bg-clip-text text-transparent">
              Investment Analysis?
            </span>
          </h2>
          <p className="text-neutral-400 text-lg mb-10 max-w-2xl mx-auto">
            Join forward-thinking property professionals who are making smarter decisions with Clarion.
          </p>
          <Link
            href="/login"
            className="group inline-flex items-center gap-3 px-10 py-5 bg-gradient-to-r from-accent to-accent-warm text-surface-primary font-semibold rounded-full hover:shadow-accent transition-all duration-300 text-lg"
          >
            Get Started Free
            <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
          </Link>
        </div>
      </section>

      {/* Footer */}
      <footer className="py-12 bg-surface-secondary border-t border-neutral-800">
        <div className="max-w-7xl mx-auto px-6 lg:px-8">
          <div className="flex flex-col md:flex-row items-center justify-between gap-6">
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-accent to-accent-warm flex items-center justify-center">
                <Building2 className="w-4 h-4 text-surface-primary" />
              </div>
              <span className="text-lg font-bold tracking-tight text-white">Clarion</span>
            </div>
            <p className="text-neutral-500 text-sm">
              &copy; {new Date().getFullYear()} Clarion. Clear decisions for complex assets.
            </p>
            <div className="flex items-center gap-6">
              <a href="#" className="text-sm text-neutral-400 hover:text-white transition-colors">Privacy</a>
              <a href="#" className="text-sm text-neutral-400 hover:text-white transition-colors">Terms</a>
              <a href="#" className="text-sm text-neutral-400 hover:text-white transition-colors">Contact</a>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}
