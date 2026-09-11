import React, { useState } from 'react';
import { ScanLine, Save, CheckCircle2, ArrowLeft, Pill, Activity } from 'lucide-react';
import { useRecovery } from '../../hooks/use-recovery';

interface OcrReviewScreenProps {
  onBack?: () => void;
}

export const OcrReviewScreen: React.FC<OcrReviewScreenProps> = ({ onBack }) => {
  const { extractedData, updateExtractedData } = useRecovery('doctor');
  const [data, setData] = useState(extractedData);
  const [savedToast, setSavedToast] = useState(false);

  const handleSave = () => {
    updateExtractedData.mutate(
      { reportId: data.report_id, data },
      {
        onSuccess: () => {
          setSavedToast(true);
          setTimeout(() => setSavedToast(false), 3000);
        },
      }
    );
  };

  const updateMedication = (index: number, field: string, value: string) => {
    const updated = [...data.medications];
    updated[index] = { ...updated[index], [field]: value };
    setData({ ...data, medications: updated });
  };

  const updateExercise = (index: number, field: string, value: string) => {
    const updated = [...data.exercises];
    updated[index] = { ...updated[index], [field]: value };
    setData({ ...data, exercises: updated });
  };

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
              <span>Back to Reports Hub</span>
            </button>
          )}
          <div className="inline-flex items-center space-x-2 px-2.5 py-1 rounded-full bg-emerald-50 text-emerald-800 text-xs font-semibold mb-2">
            <ScanLine className="w-3.5 h-3.5" />
            <span>Doctor Clinical Review & Validation Interface</span>
          </div>
          <h1 className="text-2xl font-bold text-slate-900 tracking-tight">
            Review AI-Extracted Clinical Protocol
          </h1>
          <p className="text-sm text-slate-500 mt-1">
            Validate and adjust dosages, exercise frequencies, and warning signs before approving recovery schedule.
          </p>
        </div>

        <div className="flex items-center space-x-3">
          {savedToast && (
            <span className="text-xs font-bold text-emerald-700 bg-emerald-50 px-3 py-1.5 rounded-lg border border-emerald-200 flex items-center space-x-1">
              <CheckCircle2 className="w-3.5 h-3.5" />
              <span>Changes Saved</span>
            </span>
          )}
          <button
            onClick={handleSave}
            disabled={updateExtractedData.isPending}
            className="inline-flex items-center space-x-2 px-4 py-2.5 rounded-xl bg-emerald-700 hover:bg-emerald-800 text-white font-semibold text-xs transition-colors shadow-xs disabled:opacity-50"
          >
            <Save className="w-4 h-4" />
            <span>Save & Apply Protocol</span>
          </button>
        </div>
      </div>

      {/* Procedure Form */}
      <div className="bg-white rounded-2xl border border-slate-200/80 p-6 shadow-xs space-y-4">
        <h2 className="text-sm font-bold text-slate-900">Operative Procedure Metadata</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 text-xs">
          <div>
            <label className="block font-semibold text-slate-700 mb-1">Procedure Title</label>
            <input
              type="text"
              value={data.procedure.name}
              onChange={(e) =>
                setData({ ...data, procedure: { ...data.procedure, name: e.target.value } })
              }
              className="w-full p-2.5 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-emerald-600/20"
            />
          </div>
          <div>
            <label className="block font-semibold text-slate-700 mb-1">Surgeon Name</label>
            <input
              type="text"
              value={data.procedure.surgeon}
              onChange={(e) =>
                setData({ ...data, procedure: { ...data.procedure, surgeon: e.target.value } })
              }
              className="w-full p-2.5 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-emerald-600/20"
            />
          </div>
          <div>
            <label className="block font-semibold text-slate-700 mb-1">Surgery Date</label>
            <input
              type="text"
              value={data.procedure.date}
              onChange={(e) =>
                setData({ ...data, procedure: { ...data.procedure, date: e.target.value } })
              }
              className="w-full p-2.5 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-emerald-600/20"
            />
          </div>
        </div>
      </div>

      {/* Medications Editor */}
      <div className="bg-white rounded-2xl border border-slate-200/80 p-6 shadow-xs space-y-4">
        <div className="flex items-center space-x-2 text-slate-900 font-bold text-sm">
          <Pill className="w-4 h-4 text-emerald-600" />
          <span>Extracted Prescriptions & Dosages</span>
        </div>

        <div className="space-y-3">
          {data.medications.map((med: any, idx: number) => (
            <div key={idx} className="grid grid-cols-1 sm:grid-cols-3 gap-3 p-3.5 rounded-xl bg-slate-50/70 border border-slate-200/60 text-xs">
              <div>
                <label className="block font-medium text-slate-500 mb-1">Medication Name</label>
                <input
                  type="text"
                  value={med.name}
                  onChange={(e) => updateMedication(idx, 'name', e.target.value)}
                  className="w-full p-2 rounded-lg border border-slate-200 bg-white"
                />
              </div>
              <div>
                <label className="block font-medium text-slate-500 mb-1">Dosage</label>
                <input
                  type="text"
                  value={med.dosage}
                  onChange={(e) => updateMedication(idx, 'dosage', e.target.value)}
                  className="w-full p-2 rounded-lg border border-slate-200 bg-white"
                />
              </div>
              <div>
                <label className="block font-medium text-slate-500 mb-1">Frequency & Duration</label>
                <input
                  type="text"
                  value={med.frequency}
                  onChange={(e) => updateMedication(idx, 'frequency', e.target.value)}
                  className="w-full p-2 rounded-lg border border-slate-200 bg-white"
                />
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Exercises Editor */}
      <div className="bg-white rounded-2xl border border-slate-200/80 p-6 shadow-xs space-y-4">
        <div className="flex items-center space-x-2 text-slate-900 font-bold text-sm">
          <Activity className="w-4 h-4 text-emerald-600" />
          <span>Physical Therapy Regimen</span>
        </div>

        <div className="space-y-3">
          {data.exercises.map((ex: any, idx: number) => (
            <div key={idx} className="p-3.5 rounded-xl bg-slate-50/70 border border-slate-200/60 text-xs space-y-2">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block font-medium text-slate-500 mb-1">Exercise Title</label>
                  <input
                    type="text"
                    value={ex.title}
                    onChange={(e) => updateExercise(idx, 'title', e.target.value)}
                    className="w-full p-2 rounded-lg border border-slate-200 bg-white"
                  />
                </div>
                <div>
                  <label className="block font-medium text-slate-500 mb-1">Target Frequency</label>
                  <input
                    type="text"
                    value={ex.frequency}
                    onChange={(e) => updateExercise(idx, 'frequency', e.target.value)}
                    className="w-full p-2 rounded-lg border border-slate-200 bg-white"
                  />
                </div>
              </div>
              <div>
                <label className="block font-medium text-slate-500 mb-1">Technique Instructions</label>
                <input
                  type="text"
                  value={ex.description}
                  onChange={(e) => updateExercise(idx, 'description', e.target.value)}
                  className="w-full p-2 rounded-lg border border-slate-200 bg-white"
                />
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
