'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { FolderKanban, GitCompareArrows, Settings, LogOut, User, Menu, X } from 'lucide-react';
import { useApp } from '@/lib/store';

interface NavItem {
  label: string;
  href: string;
  icon: React.ReactNode;
  disabled?: boolean;
}

const navItems: NavItem[] = [
  {
    label: 'Projects',
    href: '/dashboard',
    icon: <FolderKanban className="w-5 h-5" />,
  },
  {
    label: 'Compare',
    href: '/compare',
    icon: <GitCompareArrows className="w-5 h-5" />,
  },
  {
    label: 'Settings',
    href: '/settings',
    icon: <Settings className="w-5 h-5" />,
  },
];

export function Sidebar() {
  const pathname = usePathname();
  const { user, logout } = useApp();
  const [isMobileOpen, setIsMobileOpen] = useState(false);

  // Close mobile menu on route change
  useEffect(() => {
    setIsMobileOpen(false);
  }, [pathname]);

  // Prevent scroll when mobile menu is open
  useEffect(() => {
    if (isMobileOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }
    return () => {
      document.body.style.overflow = '';
    };
  }, [isMobileOpen]);

  const sidebarContent = (
    <>
      {/* Logo */}
      <div className="p-6 flex items-center justify-between">
        <Link href="/dashboard" className="flex items-center gap-2">
          <div className="relative">
            <span className="text-2xl font-bold text-text-primary tracking-heading">
              Clarion
            </span>
            <div className="absolute -bottom-1 left-0 w-full h-0.5 bg-gradient-to-r from-gold to-transparent" />
          </div>
        </Link>
        {/* Mobile close button */}
        <button
          onClick={() => setIsMobileOpen(false)}
          className="lg:hidden p-2 rounded-button hover:bg-navy text-text-secondary"
        >
          <X className="w-5 h-5" />
        </button>
      </div>

      {/* Slanted divider */}
      <div className="relative h-6 mx-4 mb-4">
        <div className="absolute inset-0 bg-slate/10 skew-y-[-2deg]" />
      </div>

      {/* Navigation */}
      <nav className="flex-1 px-4">
        <ul className="space-y-1">
          {navItems.map((item) => {
            const isActive = pathname.startsWith(item.href);
            const isDisabled = item.disabled;

            return (
              <li key={item.href}>
                {isDisabled ? (
                  <div
                    className="flex items-center gap-3 px-4 py-3 rounded-button text-text-muted cursor-not-allowed"
                  >
                    {item.icon}
                    <span className="text-sm font-medium">{item.label}</span>
                    <span className="ml-auto text-xs bg-slate/50 px-2 py-0.5 rounded">
                      Soon
                    </span>
                  </div>
                ) : (
                  <Link
                    href={item.href}
                    className={`
                      flex items-center gap-3 px-4 py-3 rounded-button
                      transition-all duration-200
                      ${
                        isActive
                          ? 'bg-gold/10 text-gold'
                          : 'text-text-secondary hover:bg-navy hover:text-text-primary'
                      }
                    `}
                  >
                    <span className={isActive ? 'text-gold' : ''}>
                      {item.icon}
                    </span>
                    <span className="text-sm font-medium">{item.label}</span>
                  </Link>
                )}
              </li>
            );
          })}
        </ul>
      </nav>

      {/* Slanted divider */}
      <div className="relative h-6 mx-4 my-4">
        <div className="absolute inset-0 bg-slate/10 skew-y-[2deg]" />
      </div>

      {/* User section */}
      <div className="p-4 border-t border-slate/20">
        <div className="flex items-center gap-3 px-2">
          <div className="w-10 h-10 rounded-full bg-slate flex items-center justify-center">
            <User className="w-5 h-5 text-text-secondary" />
          </div>
          <div className="flex-1 min-w-0">
            <p className="text-sm font-medium text-text-primary truncate">
              {user?.name || 'User'}
            </p>
            <p className="text-xs text-text-secondary truncate">
              {user?.email || 'user@example.com'}
            </p>
          </div>
          <button
            onClick={logout}
            className="p-2 rounded-button hover:bg-navy text-text-secondary hover:text-danger transition-colors"
            title="Logout"
          >
            <LogOut className="w-4 h-4" />
          </button>
        </div>
      </div>
    </>
  );

  return (
    <>
      {/* Mobile hamburger button */}
      <button
        onClick={() => setIsMobileOpen(true)}
        className="lg:hidden fixed top-4 left-4 z-50 p-2 rounded-button bg-charcoal border border-slate/20 text-text-primary"
      >
        <Menu className="w-6 h-6" />
      </button>

      {/* Mobile overlay */}
      {isMobileOpen && (
        <div
          className="lg:hidden fixed inset-0 bg-black/50 z-40"
          onClick={() => setIsMobileOpen(false)}
        />
      )}

      {/* Desktop sidebar - always visible */}
      <aside className="hidden lg:flex fixed left-0 top-0 h-screen w-[280px] bg-charcoal border-r border-slate/20 flex-col z-40">
        {sidebarContent}
      </aside>

      {/* Mobile sidebar - slide in */}
      <aside
        className={`
          lg:hidden fixed left-0 top-0 h-screen w-[280px] bg-charcoal border-r border-slate/20 flex flex-col z-50
          transform transition-transform duration-300 ease-in-out
          ${isMobileOpen ? 'translate-x-0' : '-translate-x-full'}
        `}
      >
        {sidebarContent}
      </aside>
    </>
  );
}

export default Sidebar;
