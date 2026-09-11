import React from 'react';
import { Clock } from 'lucide-react';

export const CompletedCasesScreen: React.FC = () => {
  const completedPatients = [
    {
      id: 'c-1',
      name: 'Rohan Sharma',
      age: 42,
      procedure: 'Total Hip Arthroplasty (Right Hip)',
      completed_at: '24 Aug 2026',
      adherence: 94,
      total_days: 45,
      outcome: 'Full functional recovery, unassisted ambulation restored.',
    },
    {
      id: 'c-2',
      name: 'Deepa Sen',
      age: 31,
      procedure: 'Meniscus Arthroscopic Repair',
      completed_at: '15 Aug 2026',
      adherence: 91,
      total_days: 30,
      outcome: '0-135° ROM achieved, discharge signed off.',
    },
  ];

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="bg-white rounded-2xl border border-slate-200/80 p-6 shadow-xs flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="inline-flex items-center space-x-2 px-2.5 py-1 rounded-full bg-emerald-50 text-emerald-800 text-xs font-semibold mb-2">
            <Clock className="w-3.5 h-3.5" />
            <span>Historical Caseload Archive</span>
          </div>
          <h1 className="text-2xl font-bold text-slate-900 tracking-tight">Completed Rehabilitation Cases</h1>
          <p className="text-sm text-slate-500 mt-1">
            Archived recovery plans, verified discharge milestones, and final functional outcomes.
          </p>
        </div>
      </div>

      <div className="space-y-3">
        {completedPatients.map((caseItem) => (
          <div key={caseItem.id} className="bg-white rounded-2xl border border-slate-200/80 p-5 shadow-xs space-y-3">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
              <div>
                <div className="flex items-center space-x-2">
                  <h3 className="text-sm font-bold text-slate-900">{caseItem.name}</h3>
                  <span className="text-xs text-slate-400">({caseItem.age} y/o)</span>
                  <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-emerald-100 text-emerald-800">
                    DISCHARGED
                  </span>
                </div>
                <div className="text-xs text-slate-500 mt-0.5">{caseItem.procedure}</div>
              </div>

              <div className="text-right">
                <div className="text-xs font-bold text-emerald-700">{caseItem.adherence}% Protocol Adherence</div>
                <div className="text-[11px] text-slate-400">Completed on {caseItem.completed_at}</div>
              </div>
            </div>

            <div className="p-3 bg-slate-50 rounded-xl border border-slate-200/60 text-xs text-slate-700">
              <span className="font-semibold text-slate-800">Final Clinical Outcome: </span>
              {caseItem.outcome}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
