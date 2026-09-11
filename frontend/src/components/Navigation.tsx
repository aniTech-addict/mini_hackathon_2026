import React from 'react';
import { LogOut, Stethoscope, HeartPulse } from 'lucide-react';

interface NavigationProps {
  role: 'patient' | 'doctor';
  activeSection: string;
  onLogout: () => void;
  onSwitchRole?: (role: 'patient' | 'doctor') => void;
}

export const Navigation: React.FC<NavigationProps> = ({
  role,
  activeSection,
  onLogout,
  onSwitchRole,
}) => {
  const isDoctor = role === 'doctor';
  const userJson = typeof window !== 'undefined' ? localStorage.getItem('meditech_user') : null;
  const storedUser = userJson ? JSON.parse(userJson) : null;
  const userName =
    storedUser?.user_id === 'doctor.ananya' || storedUser?.role === 'doctor'
      ? 'Dr. Ananya Rao'
      : storedUser?.user_id === 'patient.rahul' || storedUser?.role === 'patient'
      ? 'Rahul Sharma'
      : storedUser?.user_id || (isDoctor ? 'Dr. Ananya Rao' : 'Rahul Sharma');

  // Format section ID to clean human title (e.g. 'recovery_calendar' -> 'Recovery Calendar')
  const sectionTitle = (activeSection || 'Dashboard')
    .split('_')
    .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
    .join(' ');

  return (
    <header className="h-16 bg-white border-b border-slate-200 px-6 flex items-center justify-between sticky top-0 z-30">
      {/* Left: App Title, Role Badge & Section Breadcrumb */}
      <div className="flex items-center space-x-2.5 sm:space-x-3">
        <span className="text-sm font-extrabold text-emerald-800 tracking-tight">Meditech Care</span>
        <span className="text-slate-300 hidden sm:inline">/</span>
        <span className="text-xs font-semibold uppercase tracking-wider text-slate-500 hidden sm:inline">
          {isDoctor ? 'Doctor Workspace' : 'Patient Workspace'}
        </span>
        <span className="text-slate-300">›</span>
        <span className="text-xs font-semibold text-slate-800 bg-slate-100 px-2 py-0.5 rounded-md">
          {sectionTitle}
        </span>
      </div>

      {/* Right: Quick Role Switcher, Live Sync, User Badge, Sign Out */}
      <div className="flex items-center space-x-2 sm:space-x-3">
        {/* Quick Portal Switcher (Single-click doctor <-> patient) */}
        {onSwitchRole && (
          <div className="flex items-center p-0.5 bg-slate-100 rounded-xl border border-slate-200 text-xs font-semibold">
            <button
              onClick={() => onSwitchRole('doctor')}
              className={`flex items-center space-x-1.5 px-2.5 py-1 rounded-lg transition-all cursor-pointer ${
                isDoctor
                  ? 'bg-emerald-700 text-white shadow-xs font-bold'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
              title="Switch to Doctor Clinical Portal"
            >
              <Stethoscope className="w-3.5 h-3.5" />
              <span className="hidden sm:inline">Doctor</span>
            </button>
            <button
              onClick={() => onSwitchRole('patient')}
              className={`flex items-center space-x-1.5 px-2.5 py-1 rounded-lg transition-all cursor-pointer ${
                !isDoctor
                  ? 'bg-emerald-700 text-white shadow-xs font-bold'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
              title="Switch to Patient Recovery Portal"
            >
              <HeartPulse className="w-3.5 h-3.5" />
              <span className="hidden sm:inline">Patient</span>
            </button>
          </div>
        )}

        {/* Live Network Sync Status */}
        <div className="hidden lg:flex items-center space-x-1.5 px-2.5 py-1 bg-emerald-50 border border-emerald-200/60 rounded-full text-[11px] font-semibold text-emerald-700">
          <span className="bg-emerald-500 animate-pulse h-2 w-2 rounded-full inline-block" />
          <span>Active</span>
        </div>

        {/* Active Identity Badge */}
        <div className="flex items-center space-x-2 bg-emerald-50/70 border border-emerald-200/60 px-2.5 sm:px-3 py-1.5 rounded-full text-slate-800 text-xs font-medium">
          <div className="w-5 h-5 rounded-full bg-emerald-700 text-white flex items-center justify-center text-[10px] font-bold shrink-0">
            {isDoctor ? 'Dr' : 'Pt'}
          </div>
          <span className="font-semibold text-emerald-950 truncate max-w-[110px] sm:max-w-none">
            {userName}
          </span>
        </div>

        {/* Sign Out Button */}
        <button
          onClick={onLogout}
          title="Sign out of workspace"
          className="flex items-center space-x-1.5 px-2.5 sm:px-3 py-1.5 text-xs font-semibold text-slate-500 hover:text-rose-600 hover:bg-rose-50 rounded-lg transition-colors border border-transparent hover:border-rose-200 cursor-pointer"
        >
          <LogOut className="w-3.5 h-3.5" />
          <span className="hidden md:inline">Sign Out</span>
        </button>
      </div>
    </header>
  );
};
