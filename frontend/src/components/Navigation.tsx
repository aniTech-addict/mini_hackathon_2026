import { User, LogOut } from 'lucide-react';

interface NavigationProps {
  role: 'patient' | 'doctor';
  onSwitchRole: (role: 'patient' | 'doctor') => void;
  onLogout: () => void;
}

export const Navigation: React.FC<NavigationProps> = ({ role, onSwitchRole, onLogout }) => {
  const isDoctor = role === 'doctor';
  const userName = isDoctor ? 'Dr. Ananya Rao' : 'Maya Patel';
  const workspaceTitle = isDoctor ? 'Doctor Workspace' : 'Patient Workspace';

  return (
    <header className="h-16 bg-white border-b border-slate-200 px-6 flex items-center justify-between sticky top-0 z-30">
      {/* Left: Breadcrumbs & App Identifier */}
      <div className="flex items-center space-x-3">
        <span className="text-xs font-semibold uppercase tracking-wider text-slate-400">Workspace</span>
        <span className="text-slate-300">›</span>
        <span className="text-sm font-semibold text-slate-800">Dashboard</span>
      </div>

      {/* Right: Role Switcher, Sync Indicator, User Badge */}
      <div className="flex items-center space-x-4">
        {/* Live Network Sync Status Indicator */}
        <div className="flex items-center space-x-2 px-2.5 py-1 bg-emerald-50 border border-emerald-200/60 rounded-full text-xs font-medium text-emerald-700">
          <span className="relative flex h-2 w-2">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
            <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500 animate-pulse"></span>
          </span>
          <span className="hidden sm:inline">Synced</span>
        </div>

        {/* Quick Role Switcher Toggle */}
        <div className="bg-slate-100 p-1 rounded-lg flex items-center text-xs font-medium border border-slate-200">
          <button
            onClick={() => onSwitchRole('doctor')}
            className={`px-3 py-1 rounded-md transition-all ${
              isDoctor
                ? 'bg-white text-emerald-800 font-semibold shadow-sm'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            Doctor
          </button>
          <button
            onClick={() => onSwitchRole('patient')}
            className={`px-3 py-1 rounded-md transition-all ${
              !isDoctor
                ? 'bg-white text-emerald-800 font-semibold shadow-sm'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            Patient
          </button>
        </div>

        {/* Active Identity Badge */}
        <div className="flex items-center space-x-2 bg-emerald-50/60 border border-emerald-100 px-3 py-1.5 rounded-full text-slate-800 text-xs font-medium">
          <div className="w-5 h-5 rounded-full bg-emerald-100 text-emerald-700 flex items-center justify-center">
            <User className="w-3.5 h-3.5" />
          </div>
          <span className="font-semibold text-emerald-950">{userName}</span>
          <span className="text-slate-400">·</span>
          <span className="text-emerald-700 font-normal">{workspaceTitle}</span>
        </div>

        {/* Logout / Switch */}
        <button
          onClick={onLogout}
          title="Switch workspace / logout"
          className="p-1.5 text-slate-400 hover:text-slate-600 hover:bg-slate-100 rounded-md transition-colors"
        >
          <LogOut className="w-4 h-4" />
        </button>
      </div>
    </header>
  );
};
