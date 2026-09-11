import React, { useState } from 'react';
import { Users, Search, Eye, CheckCircle2, AlertTriangle } from 'lucide-react';
import { useRecovery } from '../../hooks/use-recovery';

export const PatientsDirectoryScreen: React.FC = () => {
  const { assignedPatients } = useRecovery('doctor');
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState<'all' | 'on_track' | 'needs_review'>('all');
  const [selectedPatient, setSelectedPatient] = useState<any | null>(null);

  const filteredPatients = (assignedPatients || []).filter((p: any) => {
    const pName = p.name || p.username || p.user_id || '';
    const planName = p.plan_name || 'Active Rehabilitation Plan';
    const matchesSearch =
      pName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      planName.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesFilter =
      statusFilter === 'all'
        ? true
        : statusFilter === 'needs_review'
        ? p.status === 'needs_review' || p.status === 'attention_needed'
        : p.status === statusFilter;
    return matchesSearch && matchesFilter;
  });

  return (
    <div className="space-y-6">
      {/* Top Banner */}
      <div className="bg-white rounded-2xl border border-slate-200/80 p-6 shadow-xs flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="inline-flex items-center space-x-2 px-2.5 py-1 rounded-full bg-emerald-50 text-emerald-800 text-xs font-semibold mb-2">
            <Users className="w-3.5 h-3.5" />
            <span>Caseload Directory & EHR</span>
          </div>
          <h1 className="text-2xl font-bold text-slate-900 tracking-tight">Active Patients Caseload</h1>
          <p className="text-sm text-slate-500 mt-1">
            Monitor rehabilitation adherence, inspect surgical records, and review active recovery plans.
          </p>
        </div>

        {/* Search & Filter Controls */}
        <div className="flex items-center space-x-3">
          <div className="relative">
            <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              placeholder="Search patients or plans..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-9 pr-4 py-2 rounded-xl text-xs border border-slate-200 focus:outline-none focus:ring-2 focus:ring-emerald-600/20 focus:border-emerald-600 w-56"
            />
          </div>

          <div className="flex items-center space-x-1 bg-slate-100 p-1 rounded-xl">
            <button
              onClick={() => setStatusFilter('all')}
              className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-all ${
                statusFilter === 'all' ? 'bg-white text-slate-900 shadow-xs' : 'text-slate-500 hover:text-slate-800'
              }`}
            >
              All ({assignedPatients.length})
            </button>
            <button
              onClick={() => setStatusFilter('on_track')}
              className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-all ${
                statusFilter === 'on_track' ? 'bg-white text-emerald-800 shadow-xs' : 'text-slate-500 hover:text-slate-800'
              }`}
            >
              On Track
            </button>
            <button
              onClick={() => setStatusFilter('needs_review')}
              className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-all ${
                statusFilter === 'needs_review' ? 'bg-white text-amber-800 shadow-xs' : 'text-slate-500 hover:text-slate-800'
              }`}
            >
              Needs Review
            </button>
          </div>
        </div>
      </div>

      {/* Patients Table */}
      <div className="bg-white rounded-2xl border border-slate-200/80 p-6 shadow-xs space-y-4">
        <div className="overflow-x-auto">
          <table className="w-full text-left">
            <thead>
              <tr className="border-b border-slate-100 text-[11px] font-bold text-slate-400 uppercase tracking-wider">
                <th className="pb-3">Patient Profile</th>
                <th className="pb-3">Surgery / Procedure</th>
                <th className="pb-3">Recovery Plan</th>
                <th className="pb-3">Adherence Progress</th>
                <th className="pb-3">Last Daily Review</th>
                <th className="pb-3">Status</th>
                <th className="pb-3 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 text-xs">
              {filteredPatients.length === 0 ? (
                <tr>
                  <td colSpan={7} className="py-8 text-center text-slate-400">
                    No matching patients found in your clinical caseload.
                  </td>
                </tr>
              ) : (
                filteredPatients.map((p: any) => {
                  const isOnTrack = p.status !== 'needs_review';
                  const name = p.name || p.username || p.user_id || 'Patient';
                  const planTitle = p.plan_name || 'Post-operative Recovery Protocol';
                  const progressPct = p.progress !== undefined ? p.progress : 0;
                  const reviewStr = p.last_review || 'Active';

                  return (
                    <tr key={p.patient_id} className="hover:bg-slate-50/60 transition-colors">
                      <td className="py-3.5 pr-4">
                        <div className="font-bold text-slate-900">{name}</div>
                        <div className="text-[11px] text-slate-400">
                          {p.age} y/o &bull; {p.sex || 'Patient'}
                        </div>
                      </td>
                      <td className="py-3.5 pr-4">
                        <div className="font-medium text-slate-800">{p.surgery_type || 'Orthopaedic Surgery'}</div>
                        <div className="text-[11px] text-slate-400">{p.surgery_date || 'Aug 2026'}</div>
                      </td>
                      <td className="py-3.5 pr-4">
                        <div className="font-medium text-slate-800">{planTitle}</div>
                      </td>
                      <td className="py-3.5 pr-4">
                        <div className="w-32">
                          <div className="flex justify-between text-[11px] font-semibold text-slate-600 mb-1">
                            <span>{progressPct}%</span>
                          </div>
                          <div className="w-full h-2 bg-slate-100 rounded-full overflow-hidden">
                            <div
                              className={`h-full rounded-full ${isOnTrack ? 'bg-emerald-600' : 'bg-amber-500'}`}
                              style={{ width: `${progressPct}%` }}
                            />
                          </div>
                        </div>
                      </td>
                      <td className="py-3.5 pr-4 text-slate-600">{reviewStr}</td>
                      <td className="py-3.5 pr-4">
                        <span
                          className={`inline-flex items-center space-x-1 px-2.5 py-1 rounded-full text-[10px] font-bold uppercase ${
                            isOnTrack
                              ? 'bg-emerald-50 text-emerald-800'
                              : 'bg-amber-50 text-amber-800'
                          }`}
                        >
                          {isOnTrack ? (
                            <CheckCircle2 className="w-3 h-3 text-emerald-600" />
                          ) : (
                            <AlertTriangle className="w-3 h-3 text-amber-600" />
                          )}
                          <span>{isOnTrack ? 'On Track' : 'Needs Review'}</span>
                        </span>
                      </td>
                      <td className="py-3.5 text-right">
                        <button
                          onClick={() => setSelectedPatient(p)}
                          className="inline-flex items-center space-x-1 px-2.5 py-1.5 rounded-lg border border-slate-200 text-xs font-semibold text-slate-700 hover:bg-slate-50 transition-colors"
                        >
                          <Eye className="w-3.5 h-3.5 text-slate-500" />
                          <span>Inspect</span>
                        </button>
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Patient Inspector Modal */}
      {selectedPatient && (
        <div className="fixed inset-0 bg-slate-900/50 backdrop-blur-xs z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl max-w-lg w-full p-6 space-y-5 shadow-2xl border border-slate-100">
            <div className="flex justify-between items-start">
              <div>
                <h3 className="text-lg font-bold text-slate-900">{selectedPatient.name}</h3>
                <p className="text-xs text-slate-500">{selectedPatient.plan_name}</p>
              </div>
              <button
                onClick={() => setSelectedPatient(null)}
                className="text-slate-400 hover:text-slate-600 text-sm font-bold p-1"
              >
                ✕
              </button>
            </div>

            <div className="space-y-3 text-xs divide-y divide-slate-100">
              <div className="flex justify-between py-2">
                <span className="text-slate-400">Surgery Procedure:</span>
                <span className="font-semibold text-slate-800">{selectedPatient.surgery_type || 'Orthopaedic Surgery'}</span>
              </div>
              <div className="flex justify-between py-2">
                <span className="text-slate-400">Surgery Date:</span>
                <span className="font-semibold text-slate-800">{selectedPatient.surgery_date || '2026-08-30'}</span>
              </div>
              <div className="flex justify-between py-2">
                <span className="text-slate-400">Rehabilitation Adherence:</span>
                <span className="font-bold text-emerald-700">{selectedPatient.progress}%</span>
              </div>
              <div className="flex justify-between py-2">
                <span className="text-slate-400">Last Daily Check-in:</span>
                <span className="font-semibold text-slate-800">{selectedPatient.last_review}</span>
              </div>
            </div>

            <button
              onClick={() => setSelectedPatient(null)}
              className="w-full py-2.5 rounded-xl bg-slate-900 text-white font-semibold text-xs hover:bg-slate-800 transition-colors"
            >
              Close Dossier
            </button>
          </div>
        </div>
      )}
    </div>
  );
};
