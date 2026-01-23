'use client';

import { useEffect, useState, useRef } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useApp } from '@/lib/store';
import { ArrowUpRight, ArrowDown, Building2, BarChart3, Shield, FileText } from 'lucide-react';

// Hook for scroll-triggered animations
function useInView(options = {}) {
  const ref = useRef<HTMLDivElement>(null);
  const [isInView, setIsInView] = useState(false);

  useEffect(() => {
    const observer = new IntersectionObserver(([entry]) => {
      if (entry.isIntersecting) {
        setIsInView(true);
      }
    }, { threshold: 0.1, ...options });

    if (ref.current) {
      observer.observe(ref.current);
    }

    return () => observer.disconnect();
  }, [options]);

  return { ref, isInView };
}

export default function LandingPage() {
  const { isAuthenticated, isLoading } = useApp();
  const router = useRouter();
  const [mounted, setMounted] = useState(false);
  const [activeTestimonial, setActiveTestimonial] = useState(0);

  // Section refs for scroll animations
  const statement = useInView();
  const capabilities = useInView();
  const metrics = useInView();
  const testimonials = useInView();
  const process = useInView();
  const cta = useInView();

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
      {/* Navigation */}
      <nav className="fixed top-0 left-0 right-0 z-50 bg-[#0a0a0a]/80 backdrop-blur-md border-b border-white/5">
        <div className="flex justify-between items-center px-6 md:px-12 py-5">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded bg-[#c9a66b]/10 flex items-center justify-center">
              <Building2 className="w-4 h-4 text-[#c9a66b]" />
            </div>
            <span className="text-lg tracking-[0.15em] font-light">CLARION</span>
          </div>
          <div className="flex items-center gap-8">
            <a href="#capabilities" className="hidden md:block text-sm text-[#888] hover:text-white transition-colors">Capabilities</a>
            <a href="#process" className="hidden md:block text-sm text-[#888] hover:text-white transition-colors">Process</a>
            <Link
              href="/login"
              className="text-sm px-5 py-2 rounded-full border border-[#333] hover:border-[#c9a66b] hover:text-[#c9a66b] transition-all"
            >
              Sign In
            </Link>
          </div>
        </div>
      </nav>

      {/* Hero */}
      <section className="relative min-h-screen flex flex-col justify-center pt-20 pb-24 px-6 md:px-12">
        {/* Architectural accents */}
        <div className="absolute top-24 right-12 md:right-24 w-px h-[30vh] bg-gradient-to-b from-[#c9a66b]/30 to-transparent" />
        <div className="absolute bottom-32 left-12 md:left-24 w-[15vw] h-px bg-gradient-to-r from-[#c9a66b]/30 to-transparent" />

        <div className="max-w-5xl">
          {/* Eyebrow */}
          <div className={`mb-8 transition-all duration-700 ${mounted ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'}`}>
            <span className="text-sm text-[#c9a66b] tracking-wider">COMMERCIAL REAL ESTATE FEASIBILITY</span>
          </div>

          {/* Headline */}
          <h1 className={`text-[11vw] md:text-[7vw] leading-[0.9] font-extralight tracking-tight mb-8 transition-all duration-1000 delay-100 ${mounted ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'}`}>
            Feasibility Analysis
            <br />
            <span className="italic font-normal text-[#c9a66b]">in Hours, Not Weeks</span>
          </h1>

          {/* Subheadline */}
          <p className={`text-lg md:text-xl text-[#888] font-light max-w-xl leading-relaxed mb-12 transition-all duration-1000 delay-300 ${mounted ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'}`}>
            AI-powered scenario modelling for asset managers, acquisitions teams, and investment committees.
            From building assessment to board-ready documentation.
          </p>

          {/* CTA */}
          <div className={`flex flex-col sm:flex-row gap-4 transition-all duration-1000 delay-500 ${mounted ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'}`}>
            <Link
              href="/login"
              className="group inline-flex items-center justify-center gap-3 px-8 py-4 bg-[#c9a66b] text-[#0a0a0a] font-medium rounded-full hover:bg-[#d4b67a] transition-all"
            >
              Start Your Analysis
              <ArrowUpRight className="w-4 h-4 group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-transform" />
            </Link>
            <a
              href="#capabilities"
              className="inline-flex items-center justify-center gap-3 px-8 py-4 border border-[#333] text-white rounded-full hover:border-[#555] transition-all"
            >
              See How It Works
            </a>
          </div>
        </div>

        {/* Scroll indicator */}
        <div className="absolute bottom-8 left-1/2 -translate-x-1/2 flex flex-col items-center gap-2 text-[#444]">
          <span className="text-xs tracking-wider">SCROLL</span>
          <ArrowDown className="w-4 h-4 animate-bounce" />
        </div>
      </section>

      {/* Value Proposition */}
      <section
        ref={statement.ref}
        className="py-32 px-6 md:px-12 border-t border-[#1a1a1a]"
      >
        <div className={`max-w-4xl transition-all duration-1000 ${statement.isInView ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-12'}`}>
          <p className="text-2xl md:text-4xl lg:text-5xl font-extralight leading-relaxed">
            Investment committees need clarity.
            <span className="text-[#c9a66b]"> MEES deadlines are approaching.</span>
            {' '}Your feasibility process shouldn&apos;t be the bottleneck.
          </p>
          <div className="mt-16 flex items-center gap-8">
            <div className="w-24 h-px bg-[#333]" />
            <span className="text-sm text-[#666] tracking-wider">THE CHALLENGE</span>
          </div>
        </div>
      </section>

      {/* Capabilities */}
      <section
        id="capabilities"
        ref={capabilities.ref}
        className="py-32 px-6 md:px-12 relative"
      >
        <div className="absolute top-32 right-12 text-[18vw] font-extralight text-[#0f0f0f] select-none pointer-events-none">
          01
        </div>

        <div className={`mb-16 transition-all duration-700 ${capabilities.isInView ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'}`}>
          <span className="text-sm text-[#666] tracking-wider">WHAT CLARION DELIVERS</span>
          <h2 className="text-3xl md:text-4xl font-light mt-4">End-to-end feasibility intelligence</h2>
        </div>

        <div className="grid md:grid-cols-2 gap-8 lg:gap-12">
          {[
            {
              icon: Building2,
              title: 'Building Assessment',
              description: 'Structured inputs for condition, MEP systems, planning context, and ESG status. Captures everything material to your hold/refurb/redevelop decision.',
              delay: 0,
            },
            {
              icon: BarChart3,
              title: 'Scenario Modelling',
              description: 'Three scenarios automatically generated: Hold & Maintain, Light/Full Refurbishment, and Redevelopment. Each with IRR, Net Yield, NPV, and Payback projections.',
              delay: 100,
            },
            {
              icon: Shield,
              title: 'Risk & Compliance',
              description: 'MEES 2025/2027/2030 pathway analysis. EPC improvement roadmaps. Regulatory, market, and execution risks identified and quantified.',
              delay: 200,
            },
            {
              icon: FileText,
              title: 'IC Documentation',
              description: 'Export investor-ready PDF reports with executive summary, scenario comparisons, risk matrices, and ESG roadmaps. Board-paper quality output.',
              delay: 300,
            },
          ].map((item, i) => (
            <div
              key={i}
              className={`group p-8 rounded-2xl border border-[#1a1a1a] hover:border-[#2a2a2a] bg-[#0f0f0f]/50 transition-all duration-700 ${
                capabilities.isInView ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'
              }`}
              style={{ transitionDelay: `${item.delay}ms` }}
            >
              <div className="w-12 h-12 rounded-xl bg-[#c9a66b]/10 flex items-center justify-center mb-6 group-hover:bg-[#c9a66b]/20 transition-colors">
                <item.icon className="w-6 h-6 text-[#c9a66b]" />
              </div>
              <h3 className="text-xl font-light mb-4">{item.title}</h3>
              <p className="text-[#777] font-light leading-relaxed">{item.description}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Metrics */}
      <section
        ref={metrics.ref}
        className="py-32 px-6 md:px-12 border-t border-[#1a1a1a]"
      >
        <div className="grid md:grid-cols-4 gap-12 md:gap-8">
          {[
            { value: '80%', label: 'Reduction in analysis time', sublabel: 'vs. traditional feasibility studies' },
            { value: '5', label: 'Structured assessment forms', sublabel: 'Condition, Planning, MEP, Costs, ESG' },
            { value: '3', label: 'Scenarios per property', sublabel: 'Hold, Refurbish, Redevelop' },
            { value: '24hr', label: 'To IC-ready documentation', sublabel: 'From first input to PDF export' },
          ].map((stat, i) => (
            <div
              key={i}
              className={`border-l border-[#222] pl-6 transition-all duration-700 ${
                metrics.isInView ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'
              }`}
              style={{ transitionDelay: `${i * 100}ms` }}
            >
              <span className="text-4xl md:text-5xl font-extralight text-[#c9a66b]">{stat.value}</span>
              <p className="mt-3 text-white font-light">{stat.label}</p>
              <p className="mt-1 text-sm text-[#555]">{stat.sublabel}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Testimonials */}
      <section
        ref={testimonials.ref}
        className="py-32 px-6 md:px-12 relative"
      >
        <div className="absolute top-32 right-12 text-[18vw] font-extralight text-[#0f0f0f] select-none pointer-events-none">
          02
        </div>

        <div className={`max-w-3xl transition-all duration-700 ${testimonials.isInView ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'}`}>
          <div className="mb-12">
            <span className="text-sm text-[#666] tracking-wider">FROM THE INDUSTRY</span>
          </div>

          <div className="relative h-56 md:h-44">
            {[
              {
                quote: "We used to spend three weeks on feasibility for each acquisition target. Clarion gets us to the same quality output in a day.",
                role: "Head of Acquisitions",
                company: "UK Private Equity Fund"
              },
              {
                quote: "The MEES compliance pathway alone saved us from a costly mistake. We didn't realise our 2027 exposure until Clarion flagged it.",
                role: "Asset Manager",
                company: "Pan-European REIT"
              },
              {
                quote: "Finally, a tool that speaks our language. IRR, yield compression, EPC trajectories — it's built by people who understand CRE.",
                role: "Investment Director",
                company: "Family Office"
              },
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
                <div>
                  <span className="text-white">{testimonial.role}</span>
                  <span className="text-[#555] ml-2">— {testimonial.company}</span>
                </div>
              </div>
            ))}
          </div>

          <div className="flex gap-3 mt-12">
            {[0, 1, 2].map((i) => (
              <button
                key={i}
                onClick={() => setActiveTestimonial(i)}
                className={`h-1 rounded-full transition-all ${
                  activeTestimonial === i ? 'bg-[#c9a66b] w-12' : 'bg-[#333] w-6'
                }`}
              />
            ))}
          </div>
        </div>
      </section>

      {/* Process */}
      <section
        id="process"
        ref={process.ref}
        className="py-32 px-6 md:px-12 border-t border-[#1a1a1a]"
      >
        <div className="grid md:grid-cols-2 gap-16 md:gap-24">
          <div className={`transition-all duration-700 ${process.isInView ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'}`}>
            <span className="text-sm text-[#666] tracking-wider">YOUR WORKFLOW</span>
            <h2 className="text-3xl md:text-4xl font-light mt-6 leading-tight">
              From property data<br />to investment decision
            </h2>
            <p className="text-[#666] font-light mt-6 leading-relaxed">
              A structured process designed around how acquisitions and asset management teams actually work.
            </p>
          </div>

          <div className="space-y-10">
            {[
              {
                stage: 'Assess',
                desc: 'Complete five structured forms: Building Condition, Planning Context, MEP Systems, Financial Parameters, and ESG Compliance.',
              },
              {
                stage: 'Generate',
                desc: 'AI analyses your inputs and generates three complete scenarios with financial projections, risk assessments, and narrative explanations.',
              },
              {
                stage: 'Compare',
                desc: 'Review scenarios side-by-side. Understand the IRR/yield trade-offs. See exactly why each option scores the way it does.',
              },
              {
                stage: 'Present',
                desc: 'Export professional PDF documentation ready for investment committees, board papers, or stakeholder presentations.',
              },
            ].map((step, i) => (
              <div
                key={i}
                className={`flex gap-6 group transition-all duration-700 ${
                  process.isInView ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'
                }`}
                style={{ transitionDelay: `${i * 100}ms` }}
              >
                <div className="w-12 h-12 rounded-full border border-[#333] flex items-center justify-center text-sm text-[#666] group-hover:border-[#c9a66b] group-hover:text-[#c9a66b] transition-colors shrink-0">
                  {String(i + 1).padStart(2, '0')}
                </div>
                <div className="pt-1">
                  <h4 className="font-light text-lg mb-2 group-hover:text-[#c9a66b] transition-colors">{step.stage}</h4>
                  <p className="text-sm text-[#666] font-light leading-relaxed">{step.desc}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section
        ref={cta.ref}
        className="py-32 md:py-48 px-6 md:px-12 text-center relative border-t border-[#1a1a1a]"
      >
        {/* Corner accents */}
        <div className="absolute top-16 left-12 w-12 h-px bg-[#c9a66b]/30" />
        <div className="absolute top-16 left-12 w-px h-12 bg-[#c9a66b]/30" />
        <div className="absolute bottom-16 right-12 w-12 h-px bg-[#c9a66b]/30" />
        <div className="absolute bottom-16 right-12 w-px h-12 bg-[#c9a66b]/30" />

        <div className={`transition-all duration-1000 ${cta.isInView ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-12'}`}>
          <span className="text-sm text-[#666] tracking-wider mb-6 block">GET STARTED</span>
          <h2 className="text-3xl md:text-5xl lg:text-6xl font-extralight mb-6">
            Your next acquisition<br />
            <span className="text-[#c9a66b]">deserves better analysis</span>
          </h2>
          <p className="text-[#666] font-light mb-12 max-w-lg mx-auto">
            Start with a single property. See the difference structured feasibility analysis makes.
          </p>
          <Link
            href="/login"
            className="group inline-flex items-center gap-4 px-10 py-5 bg-[#c9a66b] text-[#0a0a0a] font-medium rounded-full hover:bg-[#d4b67a] transition-all"
          >
            <span>Begin Free Analysis</span>
            <ArrowUpRight className="w-5 h-5 group-hover:translate-x-1 group-hover:-translate-y-1 transition-transform" />
          </Link>
          <p className="text-xs text-[#444] mt-6">No credit card required</p>
        </div>
      </section>

      {/* Footer */}
      <footer className="py-12 px-6 md:px-12 border-t border-[#1a1a1a]">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-8">
          <div className="flex items-center gap-3">
            <div className="w-6 h-6 rounded bg-[#c9a66b]/10 flex items-center justify-center">
              <Building2 className="w-3 h-3 text-[#c9a66b]" />
            </div>
            <span className="text-sm tracking-[0.15em] font-light">CLARION</span>
          </div>
          <div className="flex gap-8 text-xs text-[#666]">
            <a href="#" className="hover:text-white transition-colors">Privacy Policy</a>
            <a href="#" className="hover:text-white transition-colors">Terms of Service</a>
            <a href="#" className="hover:text-white transition-colors">Contact</a>
          </div>
          <span className="text-xs text-[#444]">&copy; {new Date().getFullYear()} Clarion. All rights reserved.</span>
        </div>
      </footer>
    </div>
  );
}
