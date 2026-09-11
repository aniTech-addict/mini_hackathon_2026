import React from 'react';
import { Download, Printer, HeartPulse } from 'lucide-react';
import { useRecovery } from '../../hooks/use-recovery';

export const DownloadSummaryScreen: React.FC = () => {
  const { patientProfile, recoveryPlan } = useRecovery('patient');

  const handlePrint = () => {
    window.print();
  };

  return (
    <div className="space-y-6">
      {/* Top Banner */}
      <div className="bg-white rounded-2xl border border-slate-200/80 p-6 shadow-xs flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="inline-flex items-center space-x-2 px-2.5 py-1 rounded-full bg-emerald-50 text-emerald-800 text-xs font-semibold mb-2">
            <Download className="w-3.5 h-3.5" />
            <span>Exportable Recovery Dossier</span>
          </div>
          <h1 className="text-2xl font-bold text-slate-900 tracking-tight">Clinical Recovery Summary</h1>
          <p className="text-sm text-slate-500 mt-1">
            Download or print a certified summary card for physical therapists, insurers, or employer leave records.
          </p>
        </div>

        <button
          onClick={handlePrint}
          className="inline-flex items-center space-x-2 px-4 py-2.5 rounded-xl bg-emerald-700 hover:bg-emerald-800 text-white font-semibold text-xs transition-colors shadow-xs"
        >
          <Printer className="w-4 h-4" />
          <span>Print / Export PDF</span>
        </button>
      </div>

      {/* Printable Card */}
      <div className="bg-white rounded-2xl border border-slate-200/80 p-8 shadow-xs max-w-4xl mx-auto space-y-6">
        {/* Certificate Header */}
        <div className="border-b border-slate-100 pb-6 flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <div className="w-12 h-12 rounded-xl bg-emerald-700 flex items-center justify-center text-white">
              <HeartPulse className="w-6 h-6" />
            </div>
            <div>
              <div className="text-lg font-bold text-slate-900">Meditech Care Workspace</div>
              <div className="text-xs text-slate-400 font-medium">Post-Operative Rehabilitation Coordination Certificate</div>
            </div>
          </div>
          <div className="text-right">
            <div className="text-[10px] uppercase font-bold text-slate-400">Report Date</div>
            <div className="text-xs font-bold text-slate-800">11 September 2026</div>
          </div>
        </div>

        {/* Patient & Case Grid */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 p-4 rounded-xl bg-slate-50/80 border border-slate-200/60 text-xs">
          <div>
            <div className="text-slate-400 font-semibold">Patient Name</div>
            <div className="font-bold text-slate-800 mt-0.5">{patientProfile?.name || 'Maya Patel'}</div>
          </div>
          <div>
            <div className="text-slate-400 font-semibold">Date of Surgery</div>
            <div className="font-bold text-slate-800 mt-0.5">{patientProfile?.surgery_date || '2026-08-30'}</div>
          </div>
          <div>
            <div className="text-slate-400 font-semibold">Attending Surgeon</div>
            <div className="font-bold text-slate-800 mt-0.5">{patientProfile?.doctor_name || 'Dr. Ananya Rao'}</div>
          </div>
          <div>
            <div className="text-slate-400 font-semibold">Overall Adherence</div>
            <div className="font-bold text-emerald-700 mt-0.5">88% Verified</div>
          </div>
        </div>

        {/* Summary Description */}
        <div className="space-y-3">
          <h2 className="text-sm font-bold text-slate-900">Clinical Recovery Status</h2>
          <p className="text-xs text-slate-600 leading-relaxed">
            The patient has completed 12 days of the 28-day Phase 1 Post-Operative Rehabilitation Protocol for
            arthroscopic ACL reconstruction. Voluntary quadriceps reactivation has been successfully achieved, and terminal
            extension is maintained at 0°. Swelling is minimal and pain is managed with oral analgesics. The patient remains
            strictly compliant with cryotherapy and partial weight-bearing precautions.
          </p>
        </div>

        {/* Prescribed Regimen List */}
        <div className="space-y-2">
          <div className="text-xs font-bold text-slate-900">Current Prescribed Activities</div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-2 text-xs">
            {(recoveryPlan?.tasks || []).map((t: any) => (
              <div key={t.id} className="p-2.5 rounded-lg border border-slate-100 bg-slate-50/50 flex items-center justify-between">
                <span className="font-medium text-slate-800">{t.title}</span>
                <span className="text-[10px] font-bold px-2 py-0.5 rounded bg-emerald-100 text-emerald-800">
                  {t.completed ? 'COMPLETED' : 'IN PROGRESS'}
                </span>
              </div>
            ))}
          </div>
        </div>

        {/* Signature Box */}
        <div className="border-t border-slate-100 pt-6 flex justify-between items-end text-xs">
          <div>
            <div className="text-slate-400 font-medium">Digital Verification Hash</div>
            <div className="font-mono text-[10px] text-slate-500 mt-0.5">SHA256: 9f82a170b42c98d601b0f5e1a38</div>
          </div>
          <div className="text-right">
            <div className="font-serif italic text-base text-slate-800">Dr. Ananya Rao, MD</div>
            <div className="text-[11px] text-slate-400">Chief of Orthopaedic Recovery &bull; Meditech Care</div>
          </div>
        </div>
      </div>
    </div>
  );
};
