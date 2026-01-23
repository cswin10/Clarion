'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { useApp } from '@/lib/store';
import { Mail, Lock, ArrowRight, ArrowLeft } from 'lucide-react';

export default function LoginPage() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  const { login, isAuthenticated, isLoading: appLoading } = useApp();
  const router = useRouter();

  useEffect(() => {
    if (isAuthenticated && !appLoading) {
      router.push('/dashboard');
    }
  }, [isAuthenticated, appLoading, router]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setIsLoading(true);

    try {
      const success = await login(email, password);
      if (success) {
        router.push('/dashboard');
      } else {
        setError('Invalid credentials');
      }
    } catch {
      setError('An error occurred. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  if (appLoading) {
    return (
      <div className="min-h-screen bg-navy flex items-center justify-center">
        <div className="animate-pulse text-gold text-xl">Loading...</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-navy flex">
      {/* Left Panel - Branding */}
      <div className="hidden lg:flex lg:w-[60%] relative overflow-hidden bg-gradient-to-br from-navy via-navy-light to-charcoal">
        {/* Decorative curved lines */}
        <svg
          className="absolute inset-0 w-full h-full"
          viewBox="0 0 800 600"
          preserveAspectRatio="xMidYMid slice"
        >
          {/* Large curved line 1 */}
          <path
            d="M-100,300 Q200,100 500,250 T900,200"
            fill="none"
            stroke="url(#goldGradient)"
            strokeWidth="1"
            opacity="0.3"
          />
          {/* Large curved line 2 */}
          <path
            d="M-50,450 Q250,300 550,400 T950,350"
            fill="none"
            stroke="url(#goldGradient)"
            strokeWidth="1"
            opacity="0.2"
          />
          {/* Smaller accent curves */}
          <path
            d="M100,500 Q300,400 500,480"
            fill="none"
            stroke="url(#goldGradient)"
            strokeWidth="0.5"
            opacity="0.4"
          />
          <path
            d="M600,100 Q700,200 650,350"
            fill="none"
            stroke="url(#goldGradient)"
            strokeWidth="0.5"
            opacity="0.3"
          />
          {/* Diagonal lines */}
          <line
            x1="0"
            y1="600"
            x2="300"
            y2="400"
            stroke="url(#goldGradient)"
            strokeWidth="0.5"
            opacity="0.15"
          />
          <line
            x1="500"
            y1="0"
            x2="800"
            y2="300"
            stroke="url(#goldGradient)"
            strokeWidth="0.5"
            opacity="0.15"
          />
          <defs>
            <linearGradient id="goldGradient" x1="0%" y1="0%" x2="100%" y2="0%">
              <stop offset="0%" stopColor="#D4A853" stopOpacity="0" />
              <stop offset="50%" stopColor="#D4A853" stopOpacity="1" />
              <stop offset="100%" stopColor="#D4A853" stopOpacity="0" />
            </linearGradient>
          </defs>
        </svg>

        {/* Abstract building silhouette */}
        <div className="absolute bottom-0 right-0 w-full h-1/2 opacity-5">
          <svg viewBox="0 0 400 200" className="w-full h-full">
            <rect x="50" y="50" width="60" height="150" fill="#D4A853" />
            <rect x="130" y="80" width="80" height="120" fill="#D4A853" />
            <rect x="230" y="30" width="50" height="170" fill="#D4A853" />
            <rect x="300" y="100" width="70" height="100" fill="#D4A853" />
          </svg>
        </div>

        {/* Content */}
        <div className="relative z-10 flex flex-col justify-center px-16 lg:px-24">
          <div className="mb-8">
            <h1 className="text-5xl lg:text-6xl font-bold text-text-primary tracking-heading mb-4">
              Clarion
            </h1>
            <div className="h-1 w-24 bg-gradient-to-r from-gold to-gold-dark rounded-full mb-6" />
            <p className="text-xl text-text-secondary max-w-md leading-relaxed">
              Clear decisions for complex assets.
            </p>
          </div>

          <div className="space-y-6 max-w-md">
            <div className="flex items-start gap-4">
              <div className="w-10 h-10 rounded-full bg-gold/10 flex items-center justify-center shrink-0">
                <div className="w-2 h-2 rounded-full bg-gold" />
              </div>
              <div>
                <h3 className="text-text-primary font-medium mb-1">
                  Comprehensive Analysis
                </h3>
                <p className="text-sm text-text-secondary">
                  Transform complex property data into actionable investment insights.
                </p>
              </div>
            </div>

            <div className="flex items-start gap-4">
              <div className="w-10 h-10 rounded-full bg-gold/10 flex items-center justify-center shrink-0">
                <div className="w-2 h-2 rounded-full bg-gold" />
              </div>
              <div>
                <h3 className="text-text-primary font-medium mb-1">
                  Scenario Modelling
                </h3>
                <p className="text-sm text-text-secondary">
                  Compare multiple development scenarios with automated financial projections.
                </p>
              </div>
            </div>

            <div className="flex items-start gap-4">
              <div className="w-10 h-10 rounded-full bg-gold/10 flex items-center justify-center shrink-0">
                <div className="w-2 h-2 rounded-full bg-gold" />
              </div>
              <div>
                <h3 className="text-text-primary font-medium mb-1">
                  Professional Reports
                </h3>
                <p className="text-sm text-text-secondary">
                  Export investor-ready PDF reports with full scenario breakdowns.
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Right Panel - Login Form */}
      <div className="w-full lg:w-[40%] flex items-center justify-center p-8 lg:p-16">
        <div className="w-full max-w-md">
          {/* Back to landing */}
          <Link
            href="/"
            className="inline-flex items-center gap-2 text-text-secondary hover:text-gold transition-colors mb-8"
          >
            <ArrowLeft className="w-4 h-4" />
            <span>Back to home</span>
          </Link>

          {/* Mobile logo */}
          <div className="lg:hidden mb-12 text-center">
            <h1 className="text-4xl font-bold text-text-primary tracking-heading mb-2">
              Clarion
            </h1>
            <p className="text-text-secondary">Clear decisions for complex assets.</p>
          </div>

          <div className="mb-8">
            <h2 className="text-2xl font-semibold text-text-primary tracking-heading mb-2">
              Welcome back
            </h2>
            <p className="text-text-secondary">
              Sign in to access your projects
            </p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-6">
            <Input
              label="Email"
              type="email"
              placeholder="Enter your email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              leftAddon={<Mail className="w-4 h-4" />}
              required
            />

            <Input
              label="Password"
              type="password"
              placeholder="Enter your password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              leftAddon={<Lock className="w-4 h-4" />}
              required
            />

            {error && (
              <div className="p-3 rounded-input bg-danger/10 border border-danger/30 text-danger text-sm">
                {error}
              </div>
            )}

            <Button
              type="submit"
              fullWidth
              size="lg"
              isLoading={isLoading}
              rightIcon={<ArrowRight className="w-4 h-4" />}
            >
              Sign In
            </Button>
          </form>

          <div className="mt-8 pt-8 border-t border-slate/20">
            <p className="text-sm text-text-muted text-center">
              Demo mode: Enter any email and password to sign in
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
