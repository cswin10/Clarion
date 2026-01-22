'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { User, Bell, Palette, Save, Key } from 'lucide-react';
import { PageWrapper } from '@/components/layout/PageWrapper';
import { Card } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { Toggle } from '@/components/ui/Toggle';
import { useApp } from '@/lib/store';

export default function SettingsPage() {
  const { isAuthenticated, isLoading, user } = useApp();
  const router = useRouter();

  const [activeTab, setActiveTab] = useState('profile');
  const [isSaving, setIsSaving] = useState(false);
  const [saveMessage, setSaveMessage] = useState('');

  // Profile settings
  const [profileSettings, setProfileSettings] = useState({
    name: user?.name || '',
    email: user?.email || '',
    company: '',
    role: '',
  });

  // Notification settings
  const [notificationSettings, setNotificationSettings] = useState({
    emailReports: true,
    projectUpdates: true,
    marketAlerts: false,
  });

  // AI settings
  const [aiSettings, setAiSettings] = useState({
    useAIScenarios: true,
    useAINarratives: true,
    useAIValidation: true,
    apiKey: '',
  });

  useEffect(() => {
    if (!isLoading && !isAuthenticated) {
      router.push('/');
    }
  }, [isAuthenticated, isLoading, router]);

  useEffect(() => {
    if (user) {
      setProfileSettings((prev) => ({
        ...prev,
        name: user.name || '',
        email: user.email || '',
      }));
    }
  }, [user]);

  if (isLoading || !isAuthenticated) {
    return (
      <div className="min-h-screen bg-navy flex items-center justify-center">
        <div className="animate-pulse text-gold text-xl">Loading...</div>
      </div>
    );
  }

  const handleSave = async () => {
    setIsSaving(true);
    setSaveMessage('');

    // Simulate save - in a real app, this would persist to backend
    await new Promise((resolve) => setTimeout(resolve, 1000));

    // Save AI settings to localStorage
    if (aiSettings.apiKey) {
      localStorage.setItem('clarion_ai_key', aiSettings.apiKey);
    }
    localStorage.setItem('clarion_ai_settings', JSON.stringify({
      useAIScenarios: aiSettings.useAIScenarios,
      useAINarratives: aiSettings.useAINarratives,
      useAIValidation: aiSettings.useAIValidation,
    }));

    setSaveMessage('Settings saved successfully');
    setIsSaving(false);

    setTimeout(() => setSaveMessage(''), 3000);
  };

  const tabs = [
    { id: 'profile', label: 'Profile', icon: User },
    { id: 'ai', label: 'AI Settings', icon: Key },
    { id: 'notifications', label: 'Notifications', icon: Bell },
    { id: 'appearance', label: 'Appearance', icon: Palette },
  ];

  return (
    <PageWrapper>
      <div className="max-w-4xl mx-auto">
        <div className="mb-6 sm:mb-8">
          <h1 className="text-xl sm:text-2xl font-bold text-text-primary tracking-heading mb-2">
            Settings
          </h1>
          <p className="text-text-secondary text-sm sm:text-base">
            Manage your account settings and preferences
          </p>
        </div>

        <div className="flex flex-col lg:flex-row gap-4 lg:gap-8">
          {/* Sidebar - Horizontal scroll on mobile */}
          <div className="w-full lg:w-48 lg:shrink-0">
            <nav className="flex lg:flex-col gap-2 lg:gap-1 overflow-x-auto lg:overflow-visible pb-2 lg:pb-0 scrollbar-hide">
              {tabs.map((tab) => {
                const Icon = tab.icon;
                const isActive = activeTab === tab.id;

                return (
                  <button
                    key={tab.id}
                    onClick={() => setActiveTab(tab.id)}
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
                    <Icon className="w-4 h-4" />
                    <span className="text-xs lg:text-sm font-medium whitespace-nowrap">{tab.label}</span>
                  </button>
                );
              })}
            </nav>
          </div>

          {/* Content */}
          <div className="flex-1">
            {/* Profile Tab */}
            {activeTab === 'profile' && (
              <Card variant="elevated" padding="lg">
                <h2 className="text-lg font-semibold text-text-primary mb-6">
                  Profile Settings
                </h2>

                <div className="space-y-6">
                  <div className="flex flex-col sm:flex-row items-center gap-4 sm:gap-6">
                    <div className="w-16 h-16 sm:w-20 sm:h-20 rounded-full bg-charcoal flex items-center justify-center">
                      <User className="w-8 h-8 sm:w-10 sm:h-10 text-text-secondary" />
                    </div>
                    <Button variant="outline" size="sm">
                      Change Avatar
                    </Button>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-6">
                    <Input
                      label="Full Name"
                      value={profileSettings.name}
                      onChange={(e) =>
                        setProfileSettings({ ...profileSettings, name: e.target.value })
                      }
                    />
                    <Input
                      label="Email"
                      type="email"
                      value={profileSettings.email}
                      onChange={(e) =>
                        setProfileSettings({ ...profileSettings, email: e.target.value })
                      }
                    />
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-6">
                    <Input
                      label="Company"
                      placeholder="Your company name"
                      value={profileSettings.company}
                      onChange={(e) =>
                        setProfileSettings({ ...profileSettings, company: e.target.value })
                      }
                    />
                    <Input
                      label="Role"
                      placeholder="Your job title"
                      value={profileSettings.role}
                      onChange={(e) =>
                        setProfileSettings({ ...profileSettings, role: e.target.value })
                      }
                    />
                  </div>
                </div>
              </Card>
            )}

            {/* AI Settings Tab */}
            {activeTab === 'ai' && (
              <Card variant="elevated" padding="lg">
                <h2 className="text-lg font-semibold text-text-primary mb-2">
                  AI Settings
                </h2>
                <p className="text-text-secondary text-sm mb-6">
                  Configure how Clarion uses AI to enhance your analysis
                </p>

                <div className="space-y-6">
                  <div className="p-4 rounded-card bg-gold/10 border border-gold/20">
                    <h3 className="font-medium text-gold mb-2">API Key Configuration</h3>
                    <p className="text-sm text-text-secondary mb-4">
                      For self-hosted deployments, you can provide your own Anthropic API key.
                      Leave blank to use the default server-side key.
                    </p>
                    <Input
                      label="Anthropic API Key (Optional)"
                      type="password"
                      placeholder="sk-ant-..."
                      value={aiSettings.apiKey}
                      onChange={(e) =>
                        setAiSettings({ ...aiSettings, apiKey: e.target.value })
                      }
                    />
                  </div>

                  <div className="space-y-4">
                    <h3 className="font-medium text-text-primary">AI Features</h3>

                    <div className="flex items-center justify-between py-3 border-b border-slate/20">
                      <div>
                        <p className="font-medium text-text-primary">AI Scenario Generation</p>
                        <p className="text-sm text-text-secondary">
                          Use AI to generate intelligent, tailored development scenarios
                        </p>
                      </div>
                      <Toggle
                        checked={aiSettings.useAIScenarios}
                        onChange={(checked) =>
                          setAiSettings({ ...aiSettings, useAIScenarios: checked })
                        }
                      />
                    </div>

                    <div className="flex items-center justify-between py-3 border-b border-slate/20">
                      <div>
                        <p className="font-medium text-text-primary">AI Narratives</p>
                        <p className="text-sm text-text-secondary">
                          Generate professional written content for reports
                        </p>
                      </div>
                      <Toggle
                        checked={aiSettings.useAINarratives}
                        onChange={(checked) =>
                          setAiSettings({ ...aiSettings, useAINarratives: checked })
                        }
                      />
                    </div>

                    <div className="flex items-center justify-between py-3">
                      <div>
                        <p className="font-medium text-text-primary">AI Input Validation</p>
                        <p className="text-sm text-text-secondary">
                          Get AI-powered warnings about potential issues in your inputs
                        </p>
                      </div>
                      <Toggle
                        checked={aiSettings.useAIValidation}
                        onChange={(checked) =>
                          setAiSettings({ ...aiSettings, useAIValidation: checked })
                        }
                      />
                    </div>
                  </div>
                </div>
              </Card>
            )}

            {/* Notifications Tab */}
            {activeTab === 'notifications' && (
              <Card variant="elevated" padding="lg">
                <h2 className="text-lg font-semibold text-text-primary mb-6">
                  Notification Preferences
                </h2>

                <div className="space-y-4">
                  <div className="flex items-center justify-between py-3 border-b border-slate/20">
                    <div>
                      <p className="font-medium text-text-primary">Email Reports</p>
                      <p className="text-sm text-text-secondary">
                        Receive PDF reports via email when analysis is complete
                      </p>
                    </div>
                    <Toggle
                      checked={notificationSettings.emailReports}
                      onChange={(checked) =>
                        setNotificationSettings({ ...notificationSettings, emailReports: checked })
                      }
                    />
                  </div>

                  <div className="flex items-center justify-between py-3 border-b border-slate/20">
                    <div>
                      <p className="font-medium text-text-primary">Project Updates</p>
                      <p className="text-sm text-text-secondary">
                        Get notified when collaborators update shared projects
                      </p>
                    </div>
                    <Toggle
                      checked={notificationSettings.projectUpdates}
                      onChange={(checked) =>
                        setNotificationSettings({
                          ...notificationSettings,
                          projectUpdates: checked,
                        })
                      }
                    />
                  </div>

                  <div className="flex items-center justify-between py-3">
                    <div>
                      <p className="font-medium text-text-primary">Market Alerts</p>
                      <p className="text-sm text-text-secondary">
                        Receive alerts about market changes affecting your properties
                      </p>
                    </div>
                    <Toggle
                      checked={notificationSettings.marketAlerts}
                      onChange={(checked) =>
                        setNotificationSettings({ ...notificationSettings, marketAlerts: checked })
                      }
                    />
                  </div>
                </div>
              </Card>
            )}

            {/* Appearance Tab */}
            {activeTab === 'appearance' && (
              <Card variant="elevated" padding="lg">
                <h2 className="text-lg font-semibold text-text-primary mb-6">
                  Appearance Settings
                </h2>

                <div className="space-y-6">
                  <div>
                    <h3 className="font-medium text-text-primary mb-3">Theme</h3>
                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 sm:gap-4">
                      <button className="p-3 sm:p-4 rounded-card bg-navy border-2 border-gold flex flex-row sm:flex-col items-center gap-3 sm:gap-2">
                        <div className="w-8 h-8 rounded bg-charcoal shrink-0" />
                        <span className="text-sm text-gold">Dark (Default)</span>
                      </button>
                      <button className="p-3 sm:p-4 rounded-card bg-charcoal border border-slate/30 flex flex-row sm:flex-col items-center gap-3 sm:gap-2 opacity-50 cursor-not-allowed">
                        <div className="w-8 h-8 rounded bg-white shrink-0" />
                        <span className="text-sm text-text-secondary">Light (Coming Soon)</span>
                      </button>
                      <button className="p-3 sm:p-4 rounded-card bg-charcoal border border-slate/30 flex flex-row sm:flex-col items-center gap-3 sm:gap-2 opacity-50 cursor-not-allowed">
                        <div className="w-8 h-8 rounded bg-gradient-to-b from-charcoal to-white shrink-0" />
                        <span className="text-sm text-text-secondary">System (Coming Soon)</span>
                      </button>
                    </div>
                  </div>

                  <div>
                    <h3 className="font-medium text-text-primary mb-3">Accent Colour</h3>
                    <div className="flex gap-3">
                      <button className="w-10 h-10 rounded-full bg-gold ring-2 ring-gold ring-offset-2 ring-offset-charcoal" />
                      <button className="w-10 h-10 rounded-full bg-blue-500 opacity-50 cursor-not-allowed" />
                      <button className="w-10 h-10 rounded-full bg-green-500 opacity-50 cursor-not-allowed" />
                      <button className="w-10 h-10 rounded-full bg-purple-500 opacity-50 cursor-not-allowed" />
                    </div>
                  </div>
                </div>
              </Card>
            )}

            {/* Save Button */}
            <div className="flex items-center justify-between mt-6">
              {saveMessage && (
                <p className="text-success text-sm">{saveMessage}</p>
              )}
              <div className="ml-auto">
                <Button
                  onClick={handleSave}
                  isLoading={isSaving}
                  leftIcon={<Save className="w-4 h-4" />}
                >
                  Save Changes
                </Button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </PageWrapper>
  );
}
