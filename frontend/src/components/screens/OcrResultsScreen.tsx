import React from 'react';
import { Sparkles, Pill, Activity, ShieldAlert, CheckCircle2, AlertTriangle, ArrowLeft } from 'lucide-react';
import { useRecovery } from '../../hooks/use-recovery';

interface OcrResultsScreenProps {
  onBack?: () => void;
}

export const OcrResultsScreen: React.FC<OcrResultsScreenProps> = ({ onBack }) => {
  const { extractedData } = useRecovery('patient');

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="bg-white rounded-2xl border border-slate-200/80 p-6 shadow-xs flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          {onBack && (
            <button
              onClick={onBack}
              className="inline-flex items-center space-x-1.5 text-xs font-semibold text-slate-500 hover:text-slate-800 mb-2 transition-colors"
            >
              <ArrowLeft className="w-3.5 h-3.5" />
              <span>Back to Reports</span>
            </button>
          )}
          <div className="inline-flex items-center space-x-2 px-2.5 py-1 rounded-full bg-emerald-50 text-emerald-800 text-xs font-semibold mb-2">
            <Sparkles className="w-3.5 h-3.5 text-emerald-600" />
            <span>AI Clinical Entity Extraction (Tesseract + Groq LLM)</span>
          </div>
          <h1 className="text-2xl font-bold text-slate-900 tracking-tight">
            Extracted Clinical Data: {extractedData.procedure.name}
          </h1>
          <p className="text-sm text-slate-500 mt-1">
            Structured entities extracted automatically from surgical discharge documentation.
          </p>
        </div>
      </div>

      {/* Procedure Overview */}
      <div className="bg-white rounded-2xl border border-slate-200/80 p-5 shadow-xs space-y-3">
        <div className="text-xs font-bold text-slate-400 uppercase tracking-wider">Procedure Summary</div>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 text-xs">
          <div className="p-3 rounded-xl bg-slate-50 border border-slate-200/60">
            <div className="text-[11px] text-slate-400 font-semibold">Date of Surgery</div>
            <div className="text-sm font-bold text-slate-900 mt-0.5">{extractedData.procedure.date}</div>
          </div>
          <div className="p-3 rounded-xl bg-slate-50 border border-slate-200/60">
            <div className="text-[11px] text-slate-400 font-semibold">Lead Surgeon</div>
            <div className="text-sm font-bold text-slate-900 mt-0.5">{extractedData.procedure.surgeon}</div>
          </div>
          <div className="sm:col-span-2 p-3 rounded-xl bg-slate-50 border border-slate-200/60">
            <div className="text-[11px] text-slate-400 font-semibold">Anesthesia Protocol</div>
            <div className="text-sm font-bold text-slate-900 mt-0.5">{extractedData.procedure.anesthesia}</div>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Medications Table */}
        <div className="bg-white rounded-2xl border border-slate-200/80 p-6 shadow-xs space-y-4">
          <div className="flex items-center space-x-2 text-slate-900 font-bold text-sm">
            <Pill className="w-4 h-4 text-emerald-600" />
            <span>Prescribed Pharmacotherapy</span>
          </div>

          <div className="space-y-2.5">
            {extractedData.medications.map((med: any, idx: number) => (
              <div key={idx} className="p-3.5 rounded-xl border border-slate-100 bg-slate-50/60 space-y-1">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-bold text-slate-800">{med.name}</span>
                  <span className="text-[10px] font-bold px-2 py-0.5 rounded bg-emerald-100 text-emerald-800">
                    {med.dosage}
                  </span>
                </div>
                <div className="text-xs text-slate-600">{med.frequency}</div>
                <div className="text-[11px] text-slate-400">Duration: {med.duration}</div>
              </div>
            ))}
          </div>
        </div>

        {/* Physical Therapy & Exercises */}
        <div className="bg-white rounded-2xl border border-slate-200/80 p-6 shadow-xs space-y-4">
          <div className="flex items-center space-x-2 text-slate-900 font-bold text-sm">
            <Activity className="w-4 h-4 text-emerald-600" />
            <span>Rehabilitation Protocols</span>
          </div>

          <div className="space-y-2.5">
            {extractedData.exercises.map((ex: any, idx: number) => (
              <div key={idx} className="p-3.5 rounded-xl border border-slate-100 bg-slate-50/60 space-y-1">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-bold text-slate-800">{ex.title}</span>
                  <span className="text-[10px] font-semibold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded">
                    {ex.frequency}
                  </span>
                </div>
                <p className="text-xs text-slate-500">{ex.description}</p>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Precautions and Warning Signs */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="bg-white rounded-2xl border border-slate-200/80 p-6 shadow-xs space-y-3">
          <div className="flex items-center space-x-2 text-slate-900 font-bold text-sm">
            <ShieldAlert className="w-4 h-4 text-emerald-600" />
            <span>Post-Operative Precautions</span>
          </div>
          <ul className="space-y-2 text-xs text-slate-600">
            {extractedData.precautions.map((p: string, i: number) => (
              <li key={i} className="flex items-start space-x-2">
                <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600 shrink-0 mt-0.5" />
                <span>{p}</span>
              </li>
            ))}
          </ul>
        </div>

        <div className="bg-white rounded-2xl border border-rose-200/80 p-6 shadow-xs space-y-3 bg-rose-50/20">
          <div className="flex items-center space-x-2 text-rose-900 font-bold text-sm">
            <AlertTriangle className="w-4 h-4 text-rose-600" />
            <span>Red Flag Warning Signs (Call Clinic Immediately)</span>
          </div>
          <ul className="space-y-2 text-xs text-rose-800">
            {extractedData.warning_signs.map((w: string, i: number) => (
              <li key={i} className="flex items-start space-x-2">
                <span className="w-1.5 h-1.5 rounded-full bg-rose-600 shrink-0 mt-1.5" />
                <span>{w}</span>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </div>
  );
};
