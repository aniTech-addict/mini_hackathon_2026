import React from 'react';
import { Clock } from 'lucide-react';

export const CaseHistoryScreen: React.FC = () => {
  const historyEvents = [
    {
      date: '30 Aug 2026',
      title: 'Surgical Procedure Conducted',
      description: 'Arthroscopic ACL Reconstruction with Hamstring Autograft & Lateral Meniscal Repair performed by Dr. Ananya Rao.',
      type: 'SURGERY',
    },
    {
      date: '31 Aug 2026',
      title: 'Hospital Discharge & Protocol Initiation',
      description: 'Discharge summary issued. Patient enrolled into Meditech Post-Operative Recovery Coordination Workspace.',
      type: 'DISCHARGE',
    },
    {
      date: '03 Sep 2026',
      title: 'Phase 1 - Quadriceps Activation Check',
      description: 'Patient attained full voluntary quad activation with 0° terminal knee extension.',
      type: 'MILESTONE',
    },
    {
      date: '07 Sep 2026',
      title: 'Post-Op Follow-up & Suture Inspection',
      description: 'Incision sites clean, healthy, and dry. Cryotherapy and partial weight-bearing clearance confirmed.',
      type: 'CLINICAL',
    },
    {
      date: '11 Sep 2026',
      title: 'Day 12 Active Review Milestone',
      description: 'Patient logged recovery rating 8/10. Pain reduced to 3/10.',
      type: 'CHECK_IN',
    },
  ];

  return (
    <div className="space-y-6">
      {/* Top Banner */}
      <div className="bg-white rounded-2xl border border-slate-200/80 p-6 shadow-xs flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="inline-flex items-center space-x-2 px-2.5 py-1 rounded-full bg-emerald-50 text-emerald-800 text-xs font-semibold mb-2">
            <Clock className="w-3.5 h-3.5" />
            <span>Clinical Timeline & Milestones</span>
          </div>
          <h1 className="text-2xl font-bold text-slate-900 tracking-tight">Case Chronology & History</h1>
          <p className="text-sm text-slate-500 mt-1">
            Complete historical audit trail of surgical milestones, clinical evaluations, and check-ins.
          </p>
        </div>
      </div>

      {/* Timeline Card */}
      <div className="bg-white rounded-2xl border border-slate-200/80 p-6 shadow-xs">
        <div className="relative border-l-2 border-emerald-200 ml-4 space-y-8 py-2">
          {historyEvents.map((evt, idx) => (
            <div key={idx} className="relative pl-6 group">
              {/* Dot */}
              <div className="absolute -left-[9px] top-1 w-4 h-4 rounded-full bg-white border-2 border-emerald-600 flex items-center justify-center">
                <div className="w-1.5 h-1.5 rounded-full bg-emerald-600" />
              </div>

              <div className="flex flex-col sm:flex-row sm:items-baseline justify-between gap-1 mb-1">
                <span className="text-xs font-bold text-slate-900">{evt.title}</span>
                <span className="text-[11px] font-semibold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded-md">
                  {evt.date}
                </span>
              </div>

              <p className="text-xs text-slate-600 max-w-2xl leading-relaxed">{evt.description}</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
