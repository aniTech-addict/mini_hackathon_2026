import React from 'react';
import { Calendar } from 'lucide-react';
import { useRecovery } from '../../hooks/use-recovery';

export const TrackingCalendarScreen: React.FC = () => {
  const { assignedPatients } = useRecovery('doctor');

  // Patient submission status for September days
  const getStatus = (patientId: string, day: number) => {
    if (day > 11) return 'pending';
    if (patientId === 'p-2' && (day === 10 || day === 11)) return 'missed';
    if (day % 4 === 0) return 'partial';
    return 'completed';
  };

  return (
    <div className="space-y-6">
      {/* Top Banner */}
      <div className="bg-white rounded-2xl border border-slate-200/80 p-6 shadow-xs flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="inline-flex items-center space-x-2 px-2.5 py-1 rounded-full bg-emerald-50 text-emerald-800 text-xs font-semibold mb-2">
            <Calendar className="w-3.5 h-3.5" />
            <span>Caseload Tracking Calendar</span>
          </div>
          <h1 className="text-2xl font-bold text-slate-900 tracking-tight">September 2026 Adherence Matrix</h1>
          <p className="text-sm text-slate-500 mt-1">
            Real-time compliance heat-map across all assigned recovery patients.
          </p>
        </div>

        {/* Legend */}
        <div className="flex items-center space-x-3 text-xs">
          <div className="flex items-center space-x-1.5">
            <span className="w-2.5 h-2.5 rounded-full bg-emerald-500" />
            <span className="text-slate-600 font-medium">Logged & Done</span>
          </div>
          <div className="flex items-center space-x-1.5">
            <span className="w-2.5 h-2.5 rounded-full bg-amber-500" />
            <span className="text-slate-600 font-medium">Partial</span>
          </div>
          <div className="flex items-center space-x-1.5">
            <span className="w-2.5 h-2.5 rounded-full bg-rose-500" />
            <span className="text-slate-600 font-medium">Missed Review</span>
          </div>
        </div>
      </div>

      {/* Matrix Table */}
      <div className="bg-white rounded-2xl border border-slate-200/80 p-6 shadow-xs space-y-4">
        <div className="flex items-center justify-between">
          <h2 className="text-base font-bold text-slate-900">Patient Adherence Grid (Days 1–12)</h2>
          <span className="text-xs text-slate-400 font-medium">{assignedPatients.length} Active Patients</span>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left">
            <thead>
              <tr className="border-b border-slate-100 text-[11px] font-bold text-slate-400">
                <th className="pb-3 pr-4">Patient</th>
                {Array.from({ length: 12 }, (_, i) => i + 1).map((d) => (
                  <th key={d} className="pb-3 px-2 text-center">
                    Sep {d}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 text-xs">
              {assignedPatients.map((patient: any) => (
                <tr key={patient.patient_id} className="hover:bg-slate-50/60">
                  <td className="py-3.5 pr-4 font-bold text-slate-900 whitespace-nowrap">
                    {patient.name}
                    <div className="text-[10px] font-normal text-slate-400">{patient.plan_name}</div>
                  </td>
                  {Array.from({ length: 12 }, (_, i) => i + 1).map((day) => {
                    const st = getStatus(patient.patient_id, day);
                    return (
                      <td key={day} className="py-3.5 px-2 text-center">
                        <div className="inline-flex items-center justify-center">
                          {st === 'completed' && (
                            <span className="w-6 h-6 rounded-lg bg-emerald-50 text-emerald-700 flex items-center justify-center font-bold text-[10px] border border-emerald-200">
                              ✓
                            </span>
                          )}
                          {st === 'partial' && (
                            <span className="w-6 h-6 rounded-lg bg-amber-50 text-amber-700 flex items-center justify-center font-bold text-[10px] border border-amber-200">
                              ~
                            </span>
                          )}
                          {st === 'missed' && (
                            <span className="w-6 h-6 rounded-lg bg-rose-50 text-rose-700 flex items-center justify-center font-bold text-[10px] border border-rose-200">
                              ✕
                            </span>
                          )}
                          {st === 'pending' && (
                            <span className="w-6 h-6 rounded-lg bg-slate-50 text-slate-400 flex items-center justify-center font-bold text-[10px]">
                              -
                            </span>
                          )}
                        </div>
                      </td>
                    );
                  })}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};
