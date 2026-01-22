'use client';

import { ReactNode, createContext, useContext, useState } from 'react';

interface TabsContextType {
  activeTab: string;
  setActiveTab: (id: string) => void;
}

const TabsContext = createContext<TabsContextType | null>(null);

interface TabsProps {
  defaultTab: string;
  children: ReactNode;
  className?: string;
  onChange?: (tabId: string) => void;
}

export function Tabs({ defaultTab, children, className = '', onChange }: TabsProps) {
  const [activeTab, setActiveTab] = useState(defaultTab);

  const handleTabChange = (id: string) => {
    setActiveTab(id);
    onChange?.(id);
  };

  return (
    <TabsContext.Provider value={{ activeTab, setActiveTab: handleTabChange }}>
      <div className={className}>{children}</div>
    </TabsContext.Provider>
  );
}

interface TabListProps {
  children: ReactNode;
  className?: string;
}

export function TabList({ children, className = '' }: TabListProps) {
  return (
    <div
      className={`flex border-b border-slate/20 ${className}`}
      role="tablist"
    >
      {children}
    </div>
  );
}

interface TabProps {
  id: string;
  children: ReactNode;
  icon?: ReactNode;
  disabled?: boolean;
}

export function Tab({ id, children, icon, disabled = false }: TabProps) {
  const context = useContext(TabsContext);
  if (!context) throw new Error('Tab must be used within Tabs');

  const { activeTab, setActiveTab } = context;
  const isActive = activeTab === id;

  return (
    <button
      role="tab"
      aria-selected={isActive}
      aria-controls={`panel-${id}`}
      disabled={disabled}
      onClick={() => !disabled && setActiveTab(id)}
      className={`
        flex items-center gap-2 px-4 py-3
        text-sm font-medium
        border-b-2 -mb-px
        transition-all duration-200
        ${
          isActive
            ? 'border-gold text-gold'
            : 'border-transparent text-text-secondary hover:text-text-primary hover:border-slate/50'
        }
        ${disabled ? 'opacity-50 cursor-not-allowed' : 'cursor-pointer'}
      `}
    >
      {icon && <span className="shrink-0">{icon}</span>}
      {children}
    </button>
  );
}

interface TabPanelProps {
  id: string;
  children: ReactNode;
  className?: string;
}

export function TabPanel({ id, children, className = '' }: TabPanelProps) {
  const context = useContext(TabsContext);
  if (!context) throw new Error('TabPanel must be used within Tabs');

  const { activeTab } = context;
  if (activeTab !== id) return null;

  return (
    <div
      role="tabpanel"
      id={`panel-${id}`}
      aria-labelledby={id}
      className={`animate-fade-in ${className}`}
    >
      {children}
    </div>
  );
}

// Vertical Tab List for sidebar navigation
interface VerticalTabListProps {
  children: ReactNode;
  className?: string;
}

export function VerticalTabList({ children, className = '' }: VerticalTabListProps) {
  return (
    <div className={`flex flex-col gap-1 ${className}`} role="tablist">
      {children}
    </div>
  );
}

interface VerticalTabProps {
  id: string;
  children: ReactNode;
  icon?: ReactNode;
  completed?: boolean;
  disabled?: boolean;
}

export function VerticalTab({
  id,
  children,
  icon,
  completed = false,
  disabled = false,
}: VerticalTabProps) {
  const context = useContext(TabsContext);
  if (!context) throw new Error('VerticalTab must be used within Tabs');

  const { activeTab, setActiveTab } = context;
  const isActive = activeTab === id;

  return (
    <button
      role="tab"
      aria-selected={isActive}
      aria-controls={`panel-${id}`}
      disabled={disabled}
      onClick={() => !disabled && setActiveTab(id)}
      className={`
        flex items-center gap-3 px-4 py-3
        text-sm font-medium text-left
        rounded-button
        transition-all duration-200
        ${
          isActive
            ? 'bg-gold/10 text-gold border-l-2 border-gold'
            : 'text-text-secondary hover:text-text-primary hover:bg-charcoal'
        }
        ${disabled ? 'opacity-50 cursor-not-allowed' : 'cursor-pointer'}
      `}
    >
      {icon && (
        <span
          className={`shrink-0 ${isActive ? 'text-gold' : completed ? 'text-success' : ''}`}
        >
          {completed ? (
            <svg
              className="w-5 h-5"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"
              />
            </svg>
          ) : (
            icon
          )}
        </span>
      )}
      <span className="flex-1">{children}</span>
      {completed && !isActive && (
        <span className="text-xs text-success">Complete</span>
      )}
    </button>
  );
}

export default Tabs;
