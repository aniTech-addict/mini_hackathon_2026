import React from 'react';
import { BarChart3 } from 'lucide-react';
import { AreaChart, Area, XAxis, YAxis, Tooltip, ResponsiveContainer } from 'recharts';
import { useRecovery } from '../../hooks/use-recovery';

export const AnalyticsScreen: React.FC = () => {
  const { doctorAdherence, reviewsChart } = useRecovery('doctor');

  const categoryAdherence = [
    { name: 'Pharmacotherapy & Meds', rate: doctorAdherence.breakdown.medication, color: 'bg-emerald-600' },
    { name: 'Physical Therapy Exercises', rate: doctorAdherence.breakdown.exercise, color: 'bg-emerald-500' },
    { name: 'Daily Review Check-ins', rate: doctorAdherence.breakdown.check_in, color: 'bg-teal-600' },
    { name: 'Mobility & Walking Activity', rate: doctorAdherence.breakdown.activity, color: 'bg-amber-500' },
  ];

  return (
    <div className="space-y-6">
      {/* Top Banner */}
      <div className="bg-white rounded-2xl border border-slate-200/80 p-6 shadow-xs flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="inline-flex items-center space-x-2 px-2.5 py-1 rounded-full bg-emerald-50 text-emerald-800 text-xs font-semibold mb-2">
            <BarChart3 className="w-3.5 h-3.5" />
            <span>Caseload Adherence & Clinical Performance</span>
          </div>
          <h1 className="text-2xl font-bold text-slate-900 tracking-tight">Rehabilitation Analytics</h1>
          <p className="text-sm text-slate-500 mt-1">
            Aggregate task compliance, symptom reduction velocity, and clinical milestone adherence.
          </p>
        </div>

        <div className="flex items-center space-x-2">
          <div className="px-4 py-2 rounded-xl bg-emerald-50 border border-emerald-200 text-emerald-800 font-bold text-xs">
            Overall Caseload Compliance: {doctorAdherence.overall_adherence_pct}%
          </div>
        </div>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <div className="bg-white rounded-2xl border border-slate-200/80 p-5 shadow-xs">
          <div className="text-xs text-slate-400 font-semibold">Total Assigned Tasks</div>
          <div className="text-2xl font-bold text-slate-900 mt-1">{doctorAdherence.total_assigned_tasks}</div>
          <div className="text-[11px] text-slate-500 mt-1">Across 4 active cases</div>
        </div>
        <div className="bg-white rounded-2xl border border-slate-200/80 p-5 shadow-xs">
          <div className="text-xs text-slate-400 font-semibold">Verified Completed</div>
          <div className="text-2xl font-bold text-emerald-700 mt-1">{doctorAdherence.total_completed_tasks}</div>
          <div className="text-[11px] text-emerald-600 font-medium mt-1">87.5% on-time completion</div>
        </div>
        <div className="bg-white rounded-2xl border border-slate-200/80 p-5 shadow-xs">
          <div className="text-xs text-slate-400 font-semibold">Missed / Overdue</div>
          <div className="text-2xl font-bold text-rose-600 mt-1">{doctorAdherence.missed_tasks}</div>
          <div className="text-[11px] text-rose-500 font-medium mt-1">Primarily back rehabilitation</div>
        </div>
        <div className="bg-white rounded-2xl border border-slate-200/80 p-5 shadow-xs">
          <div className="text-xs text-slate-400 font-semibold">Average Recovery Score</div>
          <div className="text-2xl font-bold text-emerald-700 mt-1">7.4 / 10</div>
          <div className="text-[11px] text-emerald-600 font-medium mt-1">+1.8 pts over 14 days</div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Adherence Breakdown by Regimen Type */}
        <div className="lg:col-span-6 bg-white rounded-2xl border border-slate-200/80 p-6 shadow-xs space-y-4">
          <h2 className="text-base font-bold text-slate-900">Compliance by Regimen Category</h2>
          <div className="space-y-4 pt-1">
            {categoryAdherence.map((cat) => (
              <div key={cat.name} className="space-y-1.5">
                <div className="flex justify-between text-xs font-semibold text-slate-800">
                  <span>{cat.name}</span>
                  <span className="font-bold text-emerald-700">{cat.rate}%</span>
                </div>
                <div className="w-full h-2.5 bg-slate-100 rounded-full overflow-hidden">
                  <div className={`h-full rounded-full ${cat.color}`} style={{ width: `${cat.rate}%` }} />
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Recovery Trajectory Chart */}
        <div className="lg:col-span-6 bg-white rounded-2xl border border-slate-200/80 p-6 shadow-xs space-y-4">
          <h2 className="text-base font-bold text-slate-900">Caseload Recovery Trajectory (0–10 Scale)</h2>
          <div className="h-56 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={reviewsChart}>
                <defs>
                  <linearGradient id="scoreColor" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#047857" stopOpacity={0.3} />
                    <stop offset="95%" stopColor="#047857" stopOpacity={0.0} />
                  </linearGradient>
                </defs>
                <XAxis dataKey="date" stroke="#94a3b8" fontSize={11} tickLine={false} />
                <YAxis stroke="#94a3b8" fontSize={11} domain={[0, 10]} tickLine={false} />
                <Tooltip
                  contentStyle={{
                    backgroundColor: '#ffffff',
                    borderColor: '#e2e8f0',
                    borderRadius: '0.75rem',
                    fontSize: '12px',
                  }}
                />
                <Area type="monotone" dataKey="score" stroke="#047857" strokeWidth={2.5} fillOpacity={1} fill="url(#scoreColor)" />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>
    </div>
  );
};
