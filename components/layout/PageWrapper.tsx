'use client';

import { ReactNode } from 'react';
import Sidebar from './Sidebar';

interface PageWrapperProps {
  children: ReactNode;
  withSidebar?: boolean;
  fullWidth?: boolean;
}

export function PageWrapper({
  children,
  withSidebar = true,
  fullWidth = false,
}: PageWrapperProps) {
  if (!withSidebar) {
    return (
      <main className="min-h-screen bg-navy">
        {children}
      </main>
    );
  }

  return (
    <div className="min-h-screen bg-navy">
      <Sidebar />
      <main
        className={`
          ml-[280px] min-h-screen
          ${fullWidth ? 'p-0' : 'p-8'}
        `}
      >
        <div className={fullWidth ? '' : 'max-w-7xl mx-auto'}>
          {children}
        </div>
      </main>
    </div>
  );
}

export default PageWrapper;
