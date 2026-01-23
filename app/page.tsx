'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useApp } from '@/lib/store';
import { ArrowUpRight, ArrowDown } from 'lucide-react';

export default function LandingPage() {
  const { isAuthenticated, isLoading } = useApp();
  const router = useRouter();
  const [mounted, setMounted] = useState(false);
  const [activeTestimonial, setActiveTestimonial] = useState(0);

  useEffect(() => {
    setMounted(true);
  }, []);

  useEffect(() => {
    if (isAuthenticated && !isLoading) {
      router.push('/dashboard');
    }
  }, [isAuthenticated, isLoading, router]);

  useEffect(() => {
    const interval = setInterval(() => {
      setActiveTestimonial((prev) => (prev + 1) % 3);
    }, 5000);
    return () => clearInterval(interval);
  }, []);

  if (isLoading) {
    return (
      <div className="min-h-screen bg-[#0a0a0a] flex items-center justify-center">
        <div className="w-8 h-8 border-2 border-[#c9a66b] border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#0a0a0a] text-[#fafafa] overflow-x-hidden">
      {/* Minimal Nav */}
      <nav className="fixed top-0 left-0 right-0 z-50 mix-blend-difference">
        <div className="flex justify-between items-center px-6 md:px-12 py-6">
          <span className="text-xl tracking-[0.2em] font-light">CLARION</span>
          <Link
            href="/login"
            className="text-sm tracking-wider hover:opacity-60 transition-opacity"
          >
            ENTER
          </Link>
        </div>
      </nav>

      {/* Hero - Full viewport with dramatic typography */}
      <section className="relative h-screen flex flex-col justify-end pb-24 px-6 md:px-12">
        {/* Architectural line element */}
        <div className="absolute top-0 right-12 md:right-24 w-px h-[40vh] bg-gradient-to-b from-transparent via-[#c9a66b]/40 to-transparent" />
        <div className="absolute bottom-48 left-12 md:left-24 w-[20vw] h-px bg-gradient-to-r from-[#c9a66b]/40 to-transparent" />

        {/* Main headline */}
        <div className={`transition-all duration-1000 ${mounted ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'}`}>
          <h1 className="text-[12vw] md:text-[8vw] leading-[0.85] font-extralight tracking-tight">
            Clear
            <br />
            <span className="italic font-normal text-[#c9a66b]">Decisions</span>
          </h1>
        </div>

        {/* Subtext positioned absolutely */}
        <div className={`absolute right-6 md:right-12 bottom-24 max-w-xs text-right transition-all duration-1000 delay-300 ${mounted ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'}`}>
          <p className="text-sm leading-relaxed text-[#888] font-light">
            AI-powered feasibility analysis for commercial real estate.
            Transform complexity into conviction.
          </p>
        </div>

        {/* Scroll indicator */}
        <div className="absolute bottom-8 left-1/2 -translate-x-1/2 flex flex-col items-center gap-2 text-[#444]">
          <ArrowDown className="w-4 h-4 animate-bounce" />
        </div>
      </section>

      {/* Statement section - Large quote style */}
      <section className="min-h-screen flex items-center px-6 md:px-12 py-32 relative">
        <div className="absolute top-32 right-12 text-[20vw] font-extralight text-[#111] select-none pointer-events-none">
          01
        </div>
        <div className="max-w-4xl">
          <p className="text-2xl md:text-4xl lg:text-5xl font-extralight leading-relaxed">
            We built Clarion because property decisions
            <span className="text-[#c9a66b]"> shouldn&apos;t take weeks</span>.
            Five forms. Three scenarios. One clear recommendation.
          </p>
          <div className="mt-16 flex items-center gap-8">
            <div className="w-24 h-px bg-[#333]" />
            <span className="text-sm text-[#666] tracking-wider">THE PREMISE</span>
          </div>
        </div>
      </section>

      {/* Capabilities - Horizontal scroll feel with staggered layout */}
      <section className="py-32 px-6 md:px-12 relative">
        <div className="absolute top-32 right-12 text-[20vw] font-extralight text-[#111] select-none pointer-events-none">
          02
        </div>

        <div className="mb-24">
          <span className="text-sm text-[#666] tracking-wider">CAPABILITIES</span>
        </div>

        <div className="grid md:grid-cols-12 gap-y-24 md:gap-y-32">
          {/* Item 1 - spans left */}
          <div className="md:col-span-5 md:col-start-1">
            <span className="text-[#c9a66b] text-sm tracking-wider mb-4 block">01</span>
            <h3 className="text-2xl md:text-3xl font-light mb-6">Structured Assessment</h3>
            <p className="text-[#777] font-light leading-relaxed">
              Building condition. Planning context. MEP systems. Financial parameters. ESG compliance.
              Five focused inputs that capture everything material to the decision.
            </p>
          </div>

          {/* Item 2 - spans right */}
          <div className="md:col-span-5 md:col-start-7">
            <span className="text-[#c9a66b] text-sm tracking-wider mb-4 block">02</span>
            <h3 className="text-2xl md:text-3xl font-light mb-6">Scenario Intelligence</h3>
            <p className="text-[#777] font-light leading-relaxed">
              Hold. Refurbish. Redevelop. Each scenario modelled with IRR, yield, payback,
              and NPV projections. AI-generated narratives explain the trade-offs.
            </p>
          </div>

          {/* Item 3 - spans left */}
          <div className="md:col-span-5 md:col-start-2">
            <span className="text-[#c9a66b] text-sm tracking-wider mb-4 block">03</span>
            <h3 className="text-2xl md:text-3xl font-light mb-6">Risk Quantification</h3>
            <p className="text-[#777] font-light leading-relaxed">
              MEES deadlines. Market exposure. Execution complexity. Every material risk
              identified, categorised, and factored into the recommendation.
            </p>
          </div>

          {/* Item 4 - spans right */}
          <div className="md:col-span-5 md:col-start-8">
            <span className="text-[#c9a66b] text-sm tracking-wider mb-4 block">04</span>
            <h3 className="text-2xl md:text-3xl font-light mb-6">Investor Documentation</h3>
            <p className="text-[#777] font-light leading-relaxed">
              Professional PDF reports ready for board papers and investment committees.
              Complete with visualisations, comparisons, and ESG roadmaps.
            </p>
          </div>
        </div>
      </section>

      {/* Numbers section - Editorial grid */}
      <section className="py-32 px-6 md:px-12 border-t border-[#1a1a1a]">
        <div className="grid md:grid-cols-4 gap-12 md:gap-6">
          {[
            { value: '80%', label: 'Faster than traditional analysis' },
            { value: '5', label: 'Structured input forms' },
            { value: '3', label: 'Scenarios per assessment' },
            { value: '1', label: 'Clear recommendation' },
          ].map((stat, i) => (
            <div key={i} className="border-l border-[#222] pl-6">
              <span className="text-5xl md:text-6xl font-extralight text-[#c9a66b]">{stat.value}</span>
              <p className="mt-4 text-sm text-[#666] font-light">{stat.label}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Testimonial - Minimal, rotating */}
      <section className="py-32 px-6 md:px-12 relative min-h-[70vh] flex items-center">
        <div className="absolute top-32 right-12 text-[20vw] font-extralight text-[#111] select-none pointer-events-none">
          03
        </div>

        <div className="max-w-3xl">
          <div className="mb-12">
            <span className="text-sm text-[#666] tracking-wider">PERSPECTIVES</span>
          </div>

          <div className="relative h-48 md:h-40">
            {[
              { quote: "Replaced our three-week feasibility process with a three-hour workflow.", role: "Head of Acquisitions, Private Equity" },
              { quote: "The scenario comparisons finally gave our IC the clarity they needed.", role: "Asset Manager, Family Office" },
              { quote: "ESG compliance mapping alone justified the entire platform.", role: "Sustainability Director, REIT" },
            ].map((testimonial, i) => (
              <div
                key={i}
                className={`absolute inset-0 transition-all duration-700 ${
                  activeTestimonial === i
                    ? 'opacity-100 translate-y-0'
                    : 'opacity-0 translate-y-4 pointer-events-none'
                }`}
              >
                <p className="text-xl md:text-2xl font-light leading-relaxed mb-8">
                  &ldquo;{testimonial.quote}&rdquo;
                </p>
                <span className="text-sm text-[#666]">{testimonial.role}</span>
              </div>
            ))}
          </div>

          {/* Dots */}
          <div className="flex gap-3 mt-12">
            {[0, 1, 2].map((i) => (
              <button
                key={i}
                onClick={() => setActiveTestimonial(i)}
                className={`w-2 h-2 rounded-full transition-all ${
                  activeTestimonial === i ? 'bg-[#c9a66b] w-8' : 'bg-[#333]'
                }`}
              />
            ))}
          </div>
        </div>
      </section>

      {/* Process - Timeline style */}
      <section className="py-32 px-6 md:px-12 border-t border-[#1a1a1a]">
        <div className="grid md:grid-cols-2 gap-16 md:gap-24">
          <div>
            <span className="text-sm text-[#666] tracking-wider">THE PROCESS</span>
            <h2 className="text-3xl md:text-4xl font-light mt-6 leading-tight">
              From data to decision<br />in four stages
            </h2>
          </div>

          <div className="space-y-12">
            {[
              { stage: 'Input', desc: 'Complete five structured assessments covering all material factors.' },
              { stage: 'Analysis', desc: 'AI processes inputs and generates three development scenarios.' },
              { stage: 'Review', desc: 'Compare scenarios with detailed metrics, risks, and narratives.' },
              { stage: 'Export', desc: 'Download investor-ready documentation for stakeholders.' },
            ].map((step, i) => (
              <div key={i} className="flex gap-6 group">
                <div className="w-12 h-12 rounded-full border border-[#333] flex items-center justify-center text-sm text-[#666] group-hover:border-[#c9a66b] group-hover:text-[#c9a66b] transition-colors">
                  {i + 1}
                </div>
                <div className="flex-1 pt-2">
                  <h4 className="font-light text-lg mb-2">{step.stage}</h4>
                  <p className="text-sm text-[#666] font-light">{step.desc}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA - Dramatic, minimal */}
      <section className="py-48 px-6 md:px-12 text-center relative">
        {/* Subtle corner accents */}
        <div className="absolute top-24 left-12 w-16 h-px bg-[#c9a66b]/30" />
        <div className="absolute top-24 left-12 w-px h-16 bg-[#c9a66b]/30" />
        <div className="absolute bottom-24 right-12 w-16 h-px bg-[#c9a66b]/30" />
        <div className="absolute bottom-24 right-12 w-px h-16 bg-[#c9a66b]/30" />

        <h2 className="text-4xl md:text-6xl lg:text-7xl font-extralight mb-8">
          Ready to begin?
        </h2>
        <p className="text-[#666] font-light mb-16 max-w-md mx-auto">
          Start your first feasibility analysis today. No commitment required.
        </p>
        <Link
          href="/login"
          className="group inline-flex items-center gap-4 text-lg tracking-wider hover:text-[#c9a66b] transition-colors"
        >
          <span>START ANALYSIS</span>
          <ArrowUpRight className="w-5 h-5 group-hover:translate-x-1 group-hover:-translate-y-1 transition-transform" />
        </Link>
      </section>

      {/* Footer - Minimal */}
      <footer className="py-12 px-6 md:px-12 border-t border-[#1a1a1a]">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-8">
          <div>
            <span className="text-sm tracking-[0.2em] font-light">CLARION</span>
            <p className="text-xs text-[#444] mt-2">Clear decisions for complex assets</p>
          </div>
          <div className="flex gap-8 text-xs text-[#666]">
            <a href="#" className="hover:text-[#fafafa] transition-colors">Privacy</a>
            <a href="#" className="hover:text-[#fafafa] transition-colors">Terms</a>
            <a href="#" className="hover:text-[#fafafa] transition-colors">Contact</a>
          </div>
          <span className="text-xs text-[#444]">&copy; {new Date().getFullYear()}</span>
        </div>
      </footer>
    </div>
  );
}
