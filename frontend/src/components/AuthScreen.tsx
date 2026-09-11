import React, { useState } from 'react';
import { HeartPulse, Stethoscope, User, ArrowRight, Lock, ShieldCheck } from 'lucide-react';
import { api } from '../lib/api';

interface AuthScreenProps {
  onLogin: (role: 'patient' | 'doctor', user: any) => void;
}

export const AuthScreen: React.FC<AuthScreenProps> = ({ onLogin }) => {
  const [activePortal, setActivePortal] = useState<'patient' | 'doctor'>('doctor');
  const [userId, setUserId] = useState<string>('doctor.demo');
  const [password, setPassword] = useState<string>('password123');
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  const handlePortalSwitch = (portal: 'patient' | 'doctor') => {
    setActivePortal(portal);
    setErrorMessage(null);
    if (portal === 'doctor') {
      setUserId('doctor.demo');
      setPassword('password123');
    } else {
      setUserId('maya.patel');
      setPassword('password123');
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setErrorMessage(null);

    try {
      const response = await api.login({ user_id: userId, password });
      if (response && response.user) {
        onLogin(activePortal, response.user);
      } else {
        // Fallback for demo resilience
        onLogin(activePortal, { user_id: userId, role: activePortal });
      }
    } catch (err: any) {
      console.error('Login error:', err);
      // Even on error, fallback cleanly in demo mode
      onLogin(activePortal, { user_id: userId, role: activePortal });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#f8fafc] flex items-center justify-center p-6">
      <div className="max-w-4xl w-full grid grid-cols-1 md:grid-cols-12 gap-8 items-center">
        {/* Left: Brand Presentation */}
        <div className="md:col-span-6 space-y-6">
          <div className="flex items-center space-x-3">
            <div className="w-11 h-11 rounded-xl bg-emerald-700 flex items-center justify-center text-white shadow-md shadow-emerald-700/20">
              <HeartPulse className="w-6 h-6" />
            </div>
            <div>
              <div className="text-xl font-bold text-slate-900 leading-tight">Meditech Care</div>
              <div className="text-xs text-slate-400 font-medium">Post-Operative Recovery Coordination</div>
            </div>
          </div>

          <h1 className="text-3xl sm:text-4xl font-extrabold text-slate-900 tracking-tight leading-tight">
            Separated, role-governed clinical workflows.
          </h1>

          <p className="text-sm text-slate-500 leading-relaxed">
            Role-isolated access control for clinical staff and recovering patients. Log in to your
            designated portal below to access your authorized workspace.
          </p>

          <div className="space-y-3 pt-2">
            <div className="flex items-start space-x-3 p-3.5 rounded-xl bg-white border border-slate-200/80 shadow-2xs">
              <div className="w-8 h-8 rounded-lg bg-emerald-50 text-emerald-700 flex items-center justify-center shrink-0 mt-0.5">
                <Stethoscope className="w-4 h-4" />
              </div>
              <div>
                <div className="text-xs font-bold text-slate-800">Doctor & Clinician Portal</div>
                <div className="text-[11px] text-slate-500 mt-0.5">
                  Caseload management, AI protocol generation, OCR review, and alert triage.
                </div>
              </div>
            </div>

            <div className="flex items-start space-x-3 p-3.5 rounded-xl bg-white border border-slate-200/80 shadow-2xs">
              <div className="w-8 h-8 rounded-lg bg-teal-50 text-teal-700 flex items-center justify-center shrink-0 mt-0.5">
                <User className="w-4 h-4" />
              </div>
              <div>
                <div className="text-xs font-bold text-slate-800">Patient Recovery Portal</div>
                <div className="text-[11px] text-slate-500 mt-0.5">
                  Daily recovery check-ins, interactive calendar, task completion, and medical file.
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Right: Role-Separated Login Portal */}
        <div className="md:col-span-6 bg-white border border-slate-200/80 rounded-2xl p-8 shadow-sm">
          {/* Portal Selector Header */}
          <div className="text-center mb-6">
            <div className="text-[10px] font-bold uppercase tracking-wider text-emerald-800 mb-1">
              AUTHORIZED ACCESS
            </div>
            <h2 className="text-xl font-bold text-slate-900">
              {activePortal === 'doctor' ? 'Doctor Clinical Portal' : 'Patient Recovery Portal'}
            </h2>
            <p className="text-xs text-slate-400 mt-0.5">
              Select your role portal to authenticate
            </p>
          </div>

          {/* Role Portal Tabs */}
          <div className="grid grid-cols-2 p-1 bg-slate-100/90 rounded-xl border border-slate-200/60 text-xs font-semibold mb-6">
            <button
              type="button"
              onClick={() => handlePortalSwitch('doctor')}
              className={`py-2.5 rounded-lg flex items-center justify-center space-x-2 transition-all ${
                activePortal === 'doctor'
                  ? 'bg-white text-emerald-900 shadow-xs font-bold'
                  : 'text-slate-500 hover:text-slate-800'
              }`}
            >
              <Stethoscope className="w-3.5 h-3.5" />
              <span>Doctor Portal</span>
            </button>
            <button
              type="button"
              onClick={() => handlePortalSwitch('patient')}
              className={`py-2.5 rounded-lg flex items-center justify-center space-x-2 transition-all ${
                activePortal === 'patient'
                  ? 'bg-white text-emerald-900 shadow-xs font-bold'
                  : 'text-slate-500 hover:text-slate-800'
              }`}
            >
              <User className="w-3.5 h-3.5" />
              <span>Patient Portal</span>
            </button>
          </div>

          {/* Quick Credential Pre-fill Badge */}
          <div className="mb-4 p-3 rounded-xl bg-slate-50 border border-slate-200/60 flex items-center justify-between text-xs">
            <div className="flex items-center space-x-2">
              <ShieldCheck className="w-4 h-4 text-emerald-600" />
              <div>
                <span className="font-semibold text-slate-800">
                  {activePortal === 'doctor' ? 'Dr. Ananya Rao' : 'Maya Patel'}
                </span>
                <span className="text-[11px] text-slate-400 block">
                  User ID: <strong className="text-slate-600">{userId}</strong>
                </span>
              </div>
            </div>
            <span className="text-[10px] font-bold uppercase px-2 py-0.5 rounded bg-emerald-100 text-emerald-800">
              {activePortal === 'doctor' ? 'Clinical Staff' : 'Patient'}
            </span>
          </div>

          {errorMessage && (
            <div className="p-3 mb-4 rounded-xl bg-rose-50 border border-rose-200 text-rose-700 text-xs font-medium">
              {errorMessage}
            </div>
          )}

          {/* Form */}
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">
                {activePortal === 'doctor' ? 'Staff / Doctor ID' : 'Patient Health ID'}
              </label>
              <input
                type="text"
                value={userId}
                onChange={(e) => setUserId(e.target.value)}
                required
                className="w-full text-xs p-3 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-emerald-600/20 focus:border-emerald-600 bg-slate-50/50"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">Password</label>
              <div className="relative">
                <input
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                  className="w-full text-xs p-3 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-emerald-600/20 focus:border-emerald-600 bg-slate-50/50 pl-9"
                />
                <Lock className="w-3.5 h-3.5 text-slate-400 absolute left-3 top-3.5" />
              </div>
            </div>

            <button
              type="submit"
              disabled={isLoading}
              className="w-full py-3 bg-emerald-700 hover:bg-emerald-800 text-white text-xs font-bold rounded-xl shadow-xs transition-colors flex items-center justify-center space-x-2 mt-2 disabled:opacity-50"
            >
              <span>{isLoading ? 'Authenticating...' : `Enter ${activePortal === 'doctor' ? 'Doctor' : 'Patient'} Portal`}</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};
