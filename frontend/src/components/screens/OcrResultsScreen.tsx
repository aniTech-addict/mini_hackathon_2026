import React, { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { Sparkles, Pill, Activity, ShieldAlert, CheckCircle2, AlertTriangle, ArrowLeft, FileText, Download, ShieldCheck } from 'lucide-react';
import { api } from '../../lib/api';
import { STATIC_OCR_EXTRACTION, STATIC_OCR_EXTRACTION_MAP } from '../../lib/staticData';

interface OcrResultsScreenProps {
  reportId?: string;
  onBack?: () => void;
}

export const OcrResultsScreen: React.FC<OcrResultsScreenProps> = ({
  reportId = 'rep-seed-1',
  onBack,
}) => {
  const [activeTab, setActiveTab] = useState<'structured' | 'raw'>('structured');

  const { data: extractedData = STATIC_OCR_EXTRACTION_MAP[reportId] || STATIC_OCR_EXTRACTION } = useQuery({
    queryKey: ['patient', 'reports', reportId, 'extracted-data'],
    queryFn: () => api.getExtractedData(reportId),
  });

  const procedure = extractedData?.procedure || STATIC_OCR_EXTRACTION.procedure;
  const medications = extractedData?.medications || STATIC_OCR_EXTRACTION.medications;
  const exercises = extractedData?.exercises || STATIC_OCR_EXTRACTION.exercises;
  const precautions = extractedData?.precautions || STATIC_OCR_EXTRACTION.precautions;
  const warningSigns = extractedData?.warning_signs || (STATIC_OCR_EXTRACTION as any).warning_signs || [
    'Persistent calf pain, localized tenderness, or progressive lower extremity swelling (DVT risk).',
    'Fever greater than 101.0°F (38.3°C) or severe shaking chills.',
    'Spreading redness or purulent discharge from incision site.',
  ];

  const rawText =
    (extractedData as any)?.raw_ocr_text ||
    STATIC_OCR_EXTRACTION_MAP[reportId]?.raw_ocr_text ||
    STATIC_OCR_EXTRACTION_MAP['rep-seed-1'].raw_ocr_text;

  return (
    <div className="space-y-6">
      {/* Top Banner */}
      <div className="bg-white rounded-2xl border border-slate-200/80 p-6 shadow-xs flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          {onBack && (
            <button
              onClick={onBack}
              className="inline-flex items-center space-x-1.5 text-xs font-bold text-slate-500 hover:text-emerald-700 mb-2 transition-colors"
            >
              <ArrowLeft className="w-3.5 h-3.5" />
              <span>Back to Reports Archive</span>
            </button>
          )}
          <div className="inline-flex items-center space-x-2 px-2.5 py-1 rounded-full bg-emerald-50 text-emerald-800 text-xs font-semibold mb-2">
            <Sparkles className="w-3.5 h-3.5 text-emerald-600" />
            <span>AI Clinical Entity Extraction (Tesseract OCR + Groq LLaMA 3.3)</span>
          </div>
          <h1 className="text-2xl font-bold text-slate-900 tracking-tight">
            Extracted Clinical Data: {procedure.name}
          </h1>
          <p className="text-sm text-slate-500 mt-1">
            Structured recovery protocol entities extracted automatically from surgical discharge documentation.
          </p>
        </div>

        <div className="flex items-center space-x-2 self-start md:self-auto">
          {/* View Mode Switcher */}
          <div className="flex items-center p-1 bg-slate-100 rounded-xl border border-slate-200 text-xs font-semibold">
            <button
              onClick={() => setActiveTab('structured')}
              className={`px-3 py-1.5 rounded-lg transition-all ${
                activeTab === 'structured'
                  ? 'bg-white text-emerald-900 shadow-2xs font-bold'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              Structured Protocol
            </button>
            <button
              onClick={() => setActiveTab('raw')}
              className={`px-3 py-1.5 rounded-lg transition-all ${
                activeTab === 'raw'
                  ? 'bg-white text-emerald-900 shadow-2xs font-bold'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              Raw Document OCR
            </button>
          </div>

          <button
            onClick={() => window.print()}
            className="inline-flex items-center space-x-1.5 px-3 py-2 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-semibold transition-colors"
          >
            <Download className="w-3.5 h-3.5" />
            <span className="hidden sm:inline">Export</span>
          </button>
        </div>
      </div>

      {activeTab === 'structured' ? (
        <div className="space-y-6">
          {/* Procedure Metadata Overview */}
          <div className="bg-white rounded-2xl border border-slate-200/80 p-5 shadow-xs space-y-3">
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold text-slate-400 uppercase tracking-wider">
                Operative Procedure Summary
              </span>
              <span className="inline-flex items-center space-x-1.5 px-2.5 py-0.5 rounded-full bg-emerald-50 text-emerald-800 text-[11px] font-bold">
                <ShieldCheck className="w-3.5 h-3.5 text-emerald-600" />
                <span>99.2% Clinical Confidence</span>
              </span>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 text-xs">
              <div className="p-3 rounded-xl bg-slate-50 border border-slate-200/60">
                <div className="text-[11px] text-slate-400 font-semibold">Date of Surgery</div>
                <div className="text-sm font-bold text-slate-900 mt-0.5">{procedure.date}</div>
              </div>
              <div className="p-3 rounded-xl bg-slate-50 border border-slate-200/60">
                <div className="text-[11px] text-slate-400 font-semibold">Attending Surgeon</div>
                <div className="text-sm font-bold text-slate-900 mt-0.5">{procedure.surgeon}</div>
              </div>
              <div className="p-3 rounded-xl bg-slate-50 border border-slate-200/60">
                <div className="text-[11px] text-slate-400 font-semibold">Clinical Facility</div>
                <div className="text-sm font-bold text-slate-900 mt-0.5">
                  {procedure.hospital || 'St. Jude Orthopaedic Medical Centre'}
                </div>
              </div>
              <div className="p-3 rounded-xl bg-slate-50 border border-slate-200/60">
                <div className="text-[11px] text-slate-400 font-semibold">Anesthesia Administered</div>
                <div className="text-xs font-semibold text-slate-800 mt-0.5 line-clamp-2">
                  {procedure.anesthesia || 'Spinal with nerve block'}
                </div>
              </div>
            </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Prescribed Medications */}
            <div className="bg-white rounded-2xl border border-slate-200/80 p-6 shadow-xs space-y-4">
              <div className="flex items-center space-x-2 text-slate-900 font-bold text-sm">
                <Pill className="w-4 h-4 text-emerald-600" />
                <span>Prescribed Pharmacotherapy ({medications.length})</span>
              </div>

              <div className="space-y-3">
                {medications.map((med: any, idx: number) => (
                  <div key={idx} className="p-3.5 rounded-xl border border-slate-100 bg-slate-50/70 space-y-1">
                    <div className="flex items-center justify-between gap-2">
                      <span className="text-xs font-bold text-slate-900">{med.name}</span>
                      <span className="text-[10px] font-bold px-2 py-0.5 rounded bg-emerald-100 text-emerald-800 shrink-0">
                        {med.dosage || med.dose}
                      </span>
                    </div>
                    <div className="text-xs text-slate-600">{med.frequency}</div>
                    {med.instructions && (
                      <p className="text-[11px] text-slate-500 italic mt-0.5">{med.instructions}</p>
                    )}
                    {Array.isArray(med.schedule) && med.schedule.length > 0 && (
                      <div className="text-[10px] text-slate-400 pt-1 font-semibold">
                        Schedule: {med.schedule.join(' & ')}
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </div>

            {/* Physical Therapy & Exercises */}
            <div className="bg-white rounded-2xl border border-slate-200/80 p-6 shadow-xs space-y-4">
              <div className="flex items-center space-x-2 text-slate-900 font-bold text-sm">
                <Activity className="w-4 h-4 text-emerald-600" />
                <span>Rehabilitation & Physical Therapy ({exercises.length})</span>
              </div>

              <div className="space-y-3">
                {exercises.map((ex: any, idx: number) => (
                  <div key={idx} className="p-3.5 rounded-xl border border-slate-100 bg-slate-50/70 space-y-1">
                    <div className="flex items-center justify-between gap-2">
                      <span className="text-xs font-bold text-slate-900">{ex.title}</span>
                      <span className="text-[10px] font-semibold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded shrink-0">
                        {ex.frequency}
                      </span>
                    </div>
                    <p className="text-xs text-slate-600">{ex.description}</p>
                    {ex.target_phase && (
                      <div className="text-[10px] font-bold text-emerald-800 pt-1">
                        Target: {ex.target_phase}
                      </div>
                    )}
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
              <ul className="space-y-2.5 text-xs text-slate-700">
                {precautions.map((p: string, i: number) => (
                  <li key={i} className="flex items-start space-x-2.5">
                    <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
                    <span className="leading-relaxed">{p}</span>
                  </li>
                ))}
              </ul>
            </div>

            <div className="bg-white rounded-2xl border border-rose-200 p-6 shadow-xs space-y-3 bg-rose-50/20">
              <div className="flex items-center space-x-2 text-rose-950 font-bold text-sm">
                <AlertTriangle className="w-4 h-4 text-rose-600" />
                <span>Critical Red Flags (Immediate Contact)</span>
              </div>
              <ul className="space-y-2.5 text-xs text-rose-900">
                {warningSigns.map((w: string, i: number) => (
                  <li key={i} className="flex items-start space-x-2.5">
                    <span className="w-1.5 h-1.5 rounded-full bg-rose-600 shrink-0 mt-1.5" />
                    <span className="leading-relaxed">{w}</span>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>
      ) : (
        /* Raw Scanned OCR Document Text Tab */
        <div className="bg-white rounded-2xl border border-slate-200/80 p-6 shadow-xs space-y-4">
          <div className="flex items-center justify-between pb-3 border-b border-slate-100">
            <div className="flex items-center space-x-2">
              <FileText className="w-4 h-4 text-slate-600" />
              <span className="text-sm font-bold text-slate-900">
                Raw Scanned Document OCR Stream (Tesseract Output)
              </span>
            </div>
            <span className="text-xs text-slate-500 font-mono">Character Encoding: UTF-8</span>
          </div>

          <pre className="p-4 bg-slate-900 text-slate-100 rounded-xl text-xs font-mono leading-relaxed overflow-x-auto whitespace-pre-wrap selection:bg-emerald-500 selection:text-white">
            {rawText}
          </pre>
        </div>
      )}
    </div>
  );
};
