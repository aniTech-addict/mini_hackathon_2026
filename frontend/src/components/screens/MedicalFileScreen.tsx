import React from 'react';
import { FileText, User, ShieldAlert, Award } from 'lucide-react';
import { useRecovery } from '../../hooks/use-recovery';

export const MedicalFileScreen: React.FC = () => {
  const { patientProfile, patientFile } = useRecovery('patient');

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="bg-white rounded-2xl border border-slate-200/80 p-6 shadow-xs flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="inline-flex items-center space-x-2 px-2.5 py-1 rounded-full bg-emerald-50 text-emerald-800 text-xs font-semibold mb-2">
            <FileText className="w-3.5 h-3.5" />
            <span>Official Patient Medical File</span>
          </div>
          <h1 className="text-2xl font-bold text-slate-900 tracking-tight">
            {patientProfile?.name || 'Maya Patel'} &bull; EHR #{patientProfile?.id || 'pat-maya-1'}
          </h1>
          <p className="text-sm text-slate-500 mt-1">
            Consolidated electronic health records, surgical disclosures, and verified care credentials.
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* Demographics Card */}
        <div className="bg-white rounded-2xl border border-slate-200/80 p-6 shadow-xs space-y-4">
          <div className="flex items-center space-x-2 text-slate-800 font-bold text-sm">
            <User className="w-4 h-4 text-emerald-600" />
            <span>Demographics & Identity</span>
          </div>

          <div className="space-y-2.5 text-xs divide-y divide-slate-100">
            <div className="flex justify-between py-1.5">
              <span className="text-slate-400">Date of Birth</span>
              <span className="font-semibold text-slate-800">{patientProfile?.date_of_birth || '1997-04-12'}</span>
            </div>
            <div className="flex justify-between py-1.5">
              <span className="text-slate-400">Biological Sex</span>
              <span className="font-semibold text-slate-800">{patientProfile?.sex || 'Female'}</span>
            </div>
            <div className="flex justify-between py-1.5">
              <span className="text-slate-400">Blood Type</span>
              <span className="font-bold text-rose-600">{patientProfile?.blood_group || 'B+'}</span>
            </div>
            <div className="flex justify-between py-1.5">
              <span className="text-slate-400">Phone Contact</span>
              <span className="font-semibold text-slate-800">{patientProfile?.phone_number || '+1 (555) 234-5678'}</span>
            </div>
            <div className="flex justify-between py-1.5">
              <span className="text-slate-400">Email Address</span>
              <span className="font-semibold text-slate-800">{patientProfile?.email || 'maya.patel@meditech.care'}</span>
            </div>
          </div>
        </div>

        {/* Clinical History & Allergies */}
        <div className="bg-white rounded-2xl border border-slate-200/80 p-6 shadow-xs space-y-4">
          <div className="flex items-center space-x-2 text-slate-800 font-bold text-sm">
            <ShieldAlert className="w-4 h-4 text-amber-600" />
            <span>Allergies & Contraindications</span>
          </div>

          <div className="space-y-3">
            <div>
              <div className="text-[11px] font-bold text-slate-400 uppercase tracking-wider mb-1.5">Documented Allergies</div>
              <div className="flex flex-wrap gap-1.5">
                {(patientProfile?.allergies || ['Penicillin', 'Sulfa drugs']).map((allergy: string) => (
                  <span key={allergy} className="px-2.5 py-1 rounded-lg bg-rose-50 border border-rose-200 text-rose-700 text-xs font-bold">
                    {allergy}
                  </span>
                ))}
              </div>
            </div>

            <div className="pt-2">
              <div className="text-[11px] font-bold text-slate-400 uppercase tracking-wider mb-1">Prior Surgical History</div>
              <p className="text-xs text-slate-700 leading-relaxed bg-slate-50 p-3 rounded-xl border border-slate-200/60">
                {patientProfile?.medical_history || 'ACL reconstruction surgery (Left Knee), Meniscal repair.'}
              </p>
            </div>
          </div>
        </div>

        {/* Emergency & Attending Physician */}
        <div className="bg-white rounded-2xl border border-slate-200/80 p-6 shadow-xs space-y-4">
          <div className="flex items-center space-x-2 text-slate-800 font-bold text-sm">
            <Award className="w-4 h-4 text-emerald-600" />
            <span>Care Team Assignment</span>
          </div>

          <div className="p-3.5 rounded-xl bg-emerald-50/70 border border-emerald-200/60 space-y-1">
            <div className="text-xs font-bold text-emerald-950">{patientProfile?.doctor_name || 'Dr. Ananya Rao'}</div>
            <div className="text-[11px] text-emerald-700">{patientProfile?.doctor_dept || 'Orthopaedic Recovery'}</div>
            <div className="text-[11px] text-slate-500">{patientProfile?.hospital || 'St. Jude Orthopaedic Medical Centre'}</div>
          </div>

          <div>
            <div className="text-[11px] font-bold text-slate-400 uppercase tracking-wider mb-1">Emergency Contact</div>
            <div className="p-3 rounded-xl bg-slate-50 border border-slate-200/60 text-xs font-medium text-slate-700">
              {patientProfile?.emergency_contact || 'Suresh Patel (Father) - +1 (555) 902-3344'}
            </div>
          </div>
        </div>
      </div>

      {/* Recovery Metrics Summary */}
      <div className="bg-white rounded-2xl border border-slate-200/80 p-6 shadow-xs">
        <h2 className="text-base font-bold text-slate-900 mb-4">Post-Operative Recovery Stats</h2>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <div className="p-4 rounded-xl bg-slate-50 border border-slate-200/60">
            <div className="text-xs text-slate-400 font-semibold">Total Days Monitored</div>
            <div className="text-2xl font-bold text-slate-900 mt-1">{patientFile?.active_plan?.days_elapsed || 12} / {patientFile?.active_plan?.total_days || 28}</div>
          </div>
          <div className="p-4 rounded-xl bg-slate-50 border border-slate-200/60">
            <div className="text-xs text-slate-400 font-semibold">Completed Protocol Tasks</div>
            <div className="text-2xl font-bold text-emerald-700 mt-1">{patientFile?.completed_tasks_count || 36}</div>
          </div>
          <div className="p-4 rounded-xl bg-slate-50 border border-slate-200/60">
            <div className="text-xs text-slate-400 font-semibold">Average Recovery Score</div>
            <div className="text-2xl font-bold text-emerald-700 mt-1">{patientFile?.average_recovery_score || 7.2} / 10</div>
          </div>
          <div className="p-4 rounded-xl bg-slate-50 border border-slate-200/60">
            <div className="text-xs text-slate-400 font-semibold">Average Pain Rating</div>
            <div className="text-2xl font-bold text-slate-700 mt-1">{patientFile?.average_pain_level || 3.8} / 10</div>
          </div>
        </div>
      </div>
    </div>
  );
};
