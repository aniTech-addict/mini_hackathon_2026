import React from 'react';
import { User, LogOut, Stethoscope, HeartPulse } from 'lucide-react';

interface NavigationProps {
  role: 'patient' | 'doctor';
  activeSection: string;
  onLogout: () => void;
}

export const Navigation: React.FC<NavigationProps> = ({ role, activeSection, onLogout }) => {
  const isDoctor = role === 'doctor';
  const userName = isDoctor ? 'Dr. Ananya Rao' : 'Maya Patel';
  // Format section ID to clean human title (e.g. 'recovery_calendar' -> 'Recovery Calendar')
  const sectionTitle = (activeSection || 'Dashboard')
    .split('_')
    .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
    .join(' ');

  return (
    <header className="h-16 bg-white border-b border-slate-200 px-6 flex items-center justify-between sticky top-0 z-30">
      {/* Left: Breadcrumbs & App Identifier */}
      <div className="flex items-center space-x-3">
        <span className="text-xs font-semibold uppercase tracking-wider text-slate-400">
          {isDoctor ? 'Clinical Workspace' : 'Recovery Workspace'}
        </span>
        <span className="text-slate-300">›</span>
        <span className="text-sm font-semibold text-slate-800">{sectionTitle}</span>
      </div>

      {/* Right: Role Badge, Live Sync Indicator, User Badge, Sign Out */}
      <div className="flex items-center space-x-3 sm:space-x-4">
        {/* Live Network Sync Status Indicator */}
        <div className="flex items-center space-x-2 px-2.5 py-1 bg-emerald-50 border border-emerald-200/60 rounded-full text-xs font-medium text-emerald-700">
          <span className="relative flex h-2 w-2">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
            <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500 animate-pulse"></span>
          </span>
          <span className="hidden sm:inline">Synced</span>
        </div>

        {/* Role Enforcement Badge */}
        <div className="hidden md:flex items-center space-x-1.5 px-3 py-1 rounded-lg bg-slate-100 border border-slate-200 text-xs font-bold text-slate-700">
          {isDoctor ? (
            <>
              <Stethoscope className="w-3.5 h-3.5 text-emerald-700" />
              <span>Doctor Portal</span>
            </>
          ) : (
            <>
              <HeartPulse className="w-3.5 h-3.5 text-emerald-700" />
              <span>Patient Portal</span>
            </>
          )}
        </div>

        {/* Active Identity Badge */}
        <div className="flex items-center space-x-2 bg-emerald-50/60 border border-emerald-100 px-3 py-1.5 rounded-full text-slate-800 text-xs font-medium">
          <div className="w-5 h-5 rounded-full bg-emerald-100 text-emerald-700 flex items-center justify-center">
            <User className="w-3.5 h-3.5" />
          </div>
          <span className="font-semibold text-emerald-950">{userName}</span>
        </div>

        {/* Sign Out Button */}
        <button
          onClick={onLogout}
          title="Sign out of current role"
          className="flex items-center space-x-1.5 px-3 py-1.5 text-xs font-semibold text-slate-500 hover:text-rose-600 hover:bg-rose-50 rounded-lg transition-colors border border-transparent hover:border-rose-200"
        >
          <LogOut className="w-3.5 h-3.5" />
          <span className="hidden sm:inline">Sign Out</span>
        </button>
      </div>
    </header>
  );
};
