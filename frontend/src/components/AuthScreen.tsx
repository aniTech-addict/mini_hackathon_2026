import { useState } from 'react';
import { HeartPulse, Stethoscope, User, ArrowRight, Lock } from 'lucide-react';

interface AuthScreenProps {
  onLogin: (role: 'patient' | 'doctor') => void;
}

export const AuthScreen: React.FC<AuthScreenProps> = ({ onLogin }) => {
  const [selectedRole, setSelectedRole] = useState<'doctor' | 'patient'>('doctor');
  const [userId, setUserId] = useState<string>('doctor.demo');
  const [password, setPassword] = useState<string>('password123');

  const handleRoleSelect = (role: 'doctor' | 'patient') => {
    setSelectedRole(role);
    setUserId(role === 'doctor' ? 'doctor.demo' : 'maya.patel');
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onLogin(selectedRole);
  };

  return (
    <div className="min-h-screen bg-[#f8fafc] flex items-center justify-center p-6">
      <div className="max-w-4xl w-full grid grid-cols-1 md:grid-cols-12 gap-8 items-center">
        {/* Left: Brand Presentation */}
        <div className="md:col-span-6 space-y-6">
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 rounded-xl bg-emerald-700 flex items-center justify-center text-white shadow-md shadow-emerald-700/20">
              <HeartPulse className="w-6 h-6" />
            </div>
            <div>
              <div className="font-bold text-slate-900 leading-tight">Meditech Workspace</div>
              <div className="text-xs text-slate-400 font-medium">Recovery care coordination</div>
            </div>
          </div>

          <h1 className="text-3xl sm:text-4xl font-extrabold text-slate-900 tracking-tight leading-tight">
            Care plans that keep every recovery step visible.
          </h1>

          <p className="text-sm text-slate-500 leading-relaxed">
            A focused workspace for patients and doctors to coordinate plans, tasks, reviews, reports, and care alerts.
          </p>

          <div className="flex flex-wrap gap-3 pt-2">
            <div className="bg-white border border-slate-200/80 px-3.5 py-2 rounded-xl text-xs font-semibold text-slate-700 shadow-2xs">
              <span className="w-2 h-2 rounded-full bg-emerald-500 inline-block mr-2" />
              Recovery plans
            </div>
            <div className="bg-white border border-slate-200/80 px-3.5 py-2 rounded-xl text-xs font-semibold text-slate-700 shadow-2xs">
              <span className="w-2 h-2 rounded-full bg-emerald-500 inline-block mr-2" />
              Daily check-ins
            </div>
            <div className="bg-white border border-slate-200/80 px-3.5 py-2 rounded-xl text-xs font-semibold text-slate-700 shadow-2xs">
              <span className="w-2 h-2 rounded-full bg-emerald-500 inline-block mr-2" />
              Medical reports
            </div>
          </div>
        </div>

        {/* Right: Demo Access Card */}
        <div className="md:col-span-6 bg-white border border-slate-200/80 rounded-2xl p-8 shadow-sm">
          <div className="text-[10px] font-bold uppercase tracking-wider text-emerald-800">
            DEMO ACCESS
          </div>
          <h2 className="text-xl font-bold text-slate-900 mt-1">Choose your workspace</h2>
          <p className="text-xs text-slate-400 mt-0.5">
            Use either role to explore the planned frontend flows.
          </p>

          <form onSubmit={handleSubmit} className="mt-6 space-y-5">
            {/* Role Tabs */}
            <div className="grid grid-cols-2 p-1 bg-slate-100/90 rounded-xl border border-slate-200/60 text-xs font-semibold">
              <button
                type="button"
                onClick={() => handleRoleSelect('doctor')}
                className={`py-2 rounded-lg flex items-center justify-center space-x-2 transition-all ${
                  selectedRole === 'doctor'
                    ? 'bg-white text-emerald-900 shadow-xs font-bold'
                    : 'text-slate-500 hover:text-slate-800'
                }`}
              >
                <Stethoscope className="w-3.5 h-3.5" />
                <span>Doctor</span>
              </button>
              <button
                type="button"
                onClick={() => handleRoleSelect('patient')}
                className={`py-2 rounded-lg flex items-center justify-center space-x-2 transition-all ${
                  selectedRole === 'patient'
                    ? 'bg-white text-emerald-900 shadow-xs font-bold'
                    : 'text-slate-500 hover:text-slate-800'
                }`}
              >
                <User className="w-3.5 h-3.5" />
                <span>Patient</span>
              </button>
            </div>

            {/* Inputs */}
            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">User ID</label>
              <input
                type="text"
                value={userId}
                onChange={(e) => setUserId(e.target.value)}
                className="w-full text-xs p-3 rounded-xl border border-slate-200 focus:outline-hidden focus:ring-2 focus:ring-emerald-500/30 focus:border-emerald-500 bg-slate-50/50"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">Password</label>
              <div className="relative">
                <input
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full text-xs p-3 rounded-xl border border-slate-200 focus:outline-hidden focus:ring-2 focus:ring-emerald-500/30 focus:border-emerald-500 bg-slate-50/50 pl-9"
                />
                <Lock className="w-3.5 h-3.5 text-slate-400 absolute left-3 top-3.5" />
              </div>
            </div>

            <button
              type="submit"
              className="w-full py-3 bg-emerald-700 hover:bg-emerald-800 text-white text-xs font-bold rounded-xl shadow-xs transition-colors flex items-center justify-center space-x-2 mt-2"
            >
              <span>Open {selectedRole} dashboard</span>
              <ArrowRight className="w-4 h-4" />
            </button>

            <div className="text-center text-[11px] text-slate-400 pt-1">
              Any non-empty credentials work in demo mode.
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};
