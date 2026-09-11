import React, { useState, useEffect } from 'react';
import {
  ScanLine,
  Save,
  CheckCircle2,
  ArrowLeft,
  Pill,
  Activity,
  Plus,
  Trash2,
  ShieldAlert,
  ShieldCheck,
  FileText,
  Copy,
  Check,
  Building,
} from 'lucide-react';
import { useRecovery } from '../../hooks/use-recovery';
import {
  STATIC_OCR_EXTRACTION_MAP,
  STATIC_OCR_EXTRACTION,
  updateStaticExtraction,
  type ExtractedClinicalReport,
} from '../../lib/staticData';

interface OcrReviewScreenProps {
  reportId?: string;
  onBack?: () => void;
}

export const OcrReviewScreen: React.FC<OcrReviewScreenProps> = ({
  reportId = 'rep-seed-1',
  onBack,
}) => {
  const { updateExtractedData } = useRecovery('doctor');
  const [activeTab, setActiveTab] = useState<'editor' | 'raw_ocr'>('editor');
  const [copiedRaw, setCopiedRaw] = useState(false);

  const initialReport: ExtractedClinicalReport =
    STATIC_OCR_EXTRACTION_MAP[reportId] || STATIC_OCR_EXTRACTION;

  const [data, setData] = useState<ExtractedClinicalReport>(initialReport);
  const [savedToast, setSavedToast] = useState(false);

  useEffect(() => {
    const nextReport = STATIC_OCR_EXTRACTION_MAP[reportId] || STATIC_OCR_EXTRACTION;
    setData(nextReport);
  }, [reportId]);

  const handleSave = () => {
    updateStaticExtraction(data.report_id, data);
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

  // Medication handlers
  const updateMedication = (index: number, field: string, value: string) => {
    const updated = [...data.medications];
    updated[index] = { ...updated[index], [field]: value };
    setData({ ...data, medications: updated });
  };

  const addMedication = () => {
    setData({
      ...data,
      medications: [
        ...data.medications,
        {
          name: 'New Medication',
          dosage: '500mg PO',
          frequency: 'Twice daily',
          duration: '5 days',
          instructions: 'Take after meals with water.',
          schedule: ['08:00 AM', '08:00 PM'],
        },
      ],
    });
  };

  const removeMedication = (index: number) => {
    setData({
      ...data,
      medications: data.medications.filter((_, idx) => idx !== index),
    });
  };

  // Exercise handlers
  const updateExercise = (index: number, field: string, value: string) => {
    const updated = [...data.exercises];
    updated[index] = { ...updated[index], [field]: value };
    setData({ ...data, exercises: updated });
  };

  const addExercise = () => {
    setData({
      ...data,
      exercises: [
        ...data.exercises,
        {
          title: 'Mobility Stretch Exercise',
          frequency: '10 repetitions, 3 times daily',
          duration: '10 minutes',
          description: 'Smooth controlled movement within pain-free arc.',
          target_phase: 'Phase 1: Mobilization',
        },
      ],
    });
  };

  const removeExercise = (index: number) => {
    setData({
      ...data,
      exercises: data.exercises.filter((_, idx) => idx !== index),
    });
  };

  // Precaution handlers
  const updatePrecaution = (index: number, value: string) => {
    const updated = [...data.precautions];
    updated[index] = value;
    setData({ ...data, precautions: updated });
  };

  const addPrecaution = () => {
    setData({
      ...data,
      precautions: [...data.precautions, 'New clinical recovery guideline / restriction'],
    });
  };

  const removePrecaution = (index: number) => {
    setData({
      ...data,
      precautions: data.precautions.filter((_, idx) => idx !== index),
    });
  };

  // Warning Sign handlers
  const updateWarningSign = (index: number, value: string) => {
    const updated = [...data.warning_signs];
    updated[index] = value;
    setData({ ...data, warning_signs: updated });
  };

  const addWarningSign = () => {
    setData({
      ...data,
      warning_signs: [...data.warning_signs, 'New red-flag clinical symptom requiring triage'],
    });
  };

  const removeWarningSign = (index: number) => {
    setData({
      ...data,
      warning_signs: data.warning_signs.filter((_, idx) => idx !== index),
    });
  };

  const copyRawText = () => {
    if (data.raw_ocr_text) {
      navigator.clipboard.writeText(data.raw_ocr_text);
      setCopiedRaw(true);
      setTimeout(() => setCopiedRaw(false), 2000);
    }
  };

  return (
    <div className="space-y-6">
      {/* Header Banner */}
      <div className="bg-white rounded-2xl border border-slate-200/80 p-6 shadow-xs flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          {onBack && (
            <button
              onClick={onBack}
              className="inline-flex items-center space-x-1.5 text-xs font-semibold text-slate-500 hover:text-slate-800 mb-2 transition-colors cursor-pointer"
            >
              <ArrowLeft className="w-3.5 h-3.5" />
              <span>Back to Reports Archive</span>
            </button>
          )}
          <div className="inline-flex items-center space-x-2 px-2.5 py-1 rounded-full bg-emerald-50 text-emerald-800 text-xs font-semibold mb-2">
            <ScanLine className="w-3.5 h-3.5 text-emerald-600" />
            <span>Doctor Clinical Review &amp; Validation Interface</span>
          </div>
          <h1 className="text-2xl font-bold text-slate-900 tracking-tight">
            Review AI-Extracted Clinical Protocol
          </h1>
          <p className="text-sm text-slate-500 mt-1">
            Validate medications, exercises, precautions, and warning signs parsed from <span className="font-semibold text-slate-700">{data.file_name}</span>.
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-2.5">
          {/* View Mode Toggle */}
          <div className="flex items-center p-1 bg-slate-100 rounded-xl border border-slate-200 text-xs font-semibold">
            <button
              onClick={() => setActiveTab('editor')}
              className={`px-3 py-1.5 rounded-lg transition-all ${
                activeTab === 'editor'
                  ? 'bg-white text-emerald-900 shadow-2xs font-bold'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              Interactive Editor
            </button>
            <button
              onClick={() => setActiveTab('raw_ocr')}
              className={`px-3 py-1.5 rounded-lg transition-all ${
                activeTab === 'raw_ocr'
                  ? 'bg-white text-emerald-900 shadow-2xs font-bold'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              Raw Document OCR
            </button>
          </div>

          {savedToast && (
            <span className="text-xs font-bold text-emerald-700 bg-emerald-50 px-3 py-2 rounded-xl border border-emerald-200 flex items-center space-x-1 animate-in fade-in">
              <CheckCircle2 className="w-3.5 h-3.5" />
              <span>Changes Saved &amp; Applied</span>
            </span>
          )}

          <button
            onClick={handleSave}
            disabled={updateExtractedData.isPending}
            className="inline-flex items-center space-x-2 px-4 py-2 rounded-xl bg-emerald-700 hover:bg-emerald-800 text-white font-semibold text-xs transition-colors shadow-xs disabled:opacity-50 cursor-pointer"
          >
            <Save className="w-4 h-4" />
            <span>Save &amp; Apply Protocol</span>
          </button>
        </div>
      </div>

      {activeTab === 'raw_ocr' ? (
        /* Raw Document OCR View */
        <div className="bg-white rounded-2xl border border-slate-200/80 p-6 shadow-xs space-y-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-2">
              <FileText className="w-4 h-4 text-emerald-700" />
              <h2 className="text-sm font-bold text-slate-900">Scanned Document Text (Tesseract OCR Engine)</h2>
            </div>
            <button
              onClick={copyRawText}
              className="inline-flex items-center space-x-1.5 px-3 py-1.5 rounded-lg border border-slate-200 bg-white hover:bg-slate-50 text-slate-700 text-xs font-semibold transition-colors"
            >
              {copiedRaw ? <Check className="w-3.5 h-3.5 text-emerald-600" /> : <Copy className="w-3.5 h-3.5" />}
              <span>{copiedRaw ? 'Copied' : 'Copy Text'}</span>
            </button>
          </div>
          <pre className="p-4 bg-slate-900 text-emerald-300 font-mono text-xs rounded-xl overflow-x-auto whitespace-pre-wrap leading-relaxed border border-slate-800">
            {data.raw_ocr_text || 'No raw OCR transcription available.'}
          </pre>
        </div>
      ) : (
        /* Interactive Editor View */
        <div className="space-y-6">
          {/* Procedure Form */}
          <div className="bg-white rounded-2xl border border-slate-200/80 p-6 shadow-xs space-y-4">
            <div className="flex items-center space-x-2 text-slate-900 font-bold text-sm">
              <Building className="w-4 h-4 text-emerald-600" />
              <span>Operative Procedure Metadata</span>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 text-xs">
              <div>
                <label className="block font-semibold text-slate-700 mb-1">Procedure Title</label>
                <input
                  type="text"
                  value={data.procedure.name}
                  onChange={(e) =>
                    setData({ ...data, procedure: { ...data.procedure, name: e.target.value } })
                  }
                  className="w-full p-2.5 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-emerald-600/20 bg-slate-50/50 focus:bg-white"
                />
              </div>
              <div>
                <label className="block font-semibold text-slate-700 mb-1">Attending Surgeon</label>
                <input
                  type="text"
                  value={data.procedure.surgeon}
                  onChange={(e) =>
                    setData({ ...data, procedure: { ...data.procedure, surgeon: e.target.value } })
                  }
                  className="w-full p-2.5 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-emerald-600/20 bg-slate-50/50 focus:bg-white"
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
                  className="w-full p-2.5 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-emerald-600/20 bg-slate-50/50 focus:bg-white"
                />
              </div>
              <div>
                <label className="block font-semibold text-slate-700 mb-1">Discharge Date</label>
                <input
                  type="text"
                  value={data.procedure.discharge_date || ''}
                  onChange={(e) =>
                    setData({ ...data, procedure: { ...data.procedure, discharge_date: e.target.value } })
                  }
                  className="w-full p-2.5 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-emerald-600/20 bg-slate-50/50 focus:bg-white"
                />
              </div>
              <div>
                <label className="block font-semibold text-slate-700 mb-1">Clinical Facility / Hospital</label>
                <input
                  type="text"
                  value={data.procedure.hospital || ''}
                  onChange={(e) =>
                    setData({ ...data, procedure: { ...data.procedure, hospital: e.target.value } })
                  }
                  className="w-full p-2.5 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-emerald-600/20 bg-slate-50/50 focus:bg-white"
                />
              </div>
              <div>
                <label className="block font-semibold text-slate-700 mb-1">Anesthesia Administered</label>
                <input
                  type="text"
                  value={data.procedure.anesthesia || ''}
                  onChange={(e) =>
                    setData({ ...data, procedure: { ...data.procedure, anesthesia: e.target.value } })
                  }
                  className="w-full p-2.5 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-emerald-600/20 bg-slate-50/50 focus:bg-white"
                />
              </div>
            </div>
          </div>

          {/* Medications Editor */}
          <div className="bg-white rounded-2xl border border-slate-200/80 p-6 shadow-xs space-y-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-2 text-slate-900 font-bold text-sm">
                <Pill className="w-4 h-4 text-emerald-600" />
                <span>Extracted Prescriptions &amp; Dosages ({data.medications.length})</span>
              </div>
              <button
                type="button"
                onClick={addMedication}
                className="inline-flex items-center space-x-1 text-xs font-bold text-emerald-700 bg-emerald-50 hover:bg-emerald-100 border border-emerald-200 px-3 py-1.5 rounded-xl transition-colors cursor-pointer"
              >
                <Plus className="w-3.5 h-3.5" />
                <span>Add Medication</span>
              </button>
            </div>

            <div className="space-y-3">
              {data.medications.map((med, idx) => (
                <div
                  key={idx}
                  className="p-4 rounded-xl bg-slate-50/80 border border-slate-200/70 text-xs space-y-3 relative group"
                >
                  <div className="flex items-center justify-between">
                    <span className="font-bold text-slate-700 flex items-center space-x-1.5">
                      <span className="w-5 h-5 rounded-full bg-emerald-100 text-emerald-800 inline-flex items-center justify-center text-[10px] font-bold">
                        {idx + 1}
                      </span>
                      <span>Prescription Item</span>
                    </span>
                    <button
                      type="button"
                      onClick={() => removeMedication(idx)}
                      className="text-slate-400 hover:text-rose-600 p-1 transition-colors"
                      title="Remove medication"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                    <div>
                      <label className="block font-medium text-slate-500 mb-1">Medication Name</label>
                      <input
                        type="text"
                        value={med.name}
                        onChange={(e) => updateMedication(idx, 'name', e.target.value)}
                        className="w-full p-2 rounded-lg border border-slate-200 bg-white focus:outline-none focus:ring-1 focus:ring-emerald-500"
                      />
                    </div>
                    <div>
                      <label className="block font-medium text-slate-500 mb-1">Dosage &amp; Route</label>
                      <input
                        type="text"
                        value={med.dosage}
                        onChange={(e) => updateMedication(idx, 'dosage', e.target.value)}
                        className="w-full p-2 rounded-lg border border-slate-200 bg-white focus:outline-none focus:ring-1 focus:ring-emerald-500"
                      />
                    </div>
                    <div>
                      <label className="block font-medium text-slate-500 mb-1">Frequency &amp; Duration</label>
                      <input
                        type="text"
                        value={med.frequency}
                        onChange={(e) => updateMedication(idx, 'frequency', e.target.value)}
                        className="w-full p-2 rounded-lg border border-slate-200 bg-white focus:outline-none focus:ring-1 focus:ring-emerald-500"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block font-medium text-slate-500 mb-1">Clinical Instructions</label>
                    <input
                      type="text"
                      value={med.instructions || ''}
                      onChange={(e) => updateMedication(idx, 'instructions', e.target.value)}
                      placeholder="e.g. Take with food. Complete entire course."
                      className="w-full p-2 rounded-lg border border-slate-200 bg-white focus:outline-none focus:ring-1 focus:ring-emerald-500"
                    />
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Exercises Editor */}
          <div className="bg-white rounded-2xl border border-slate-200/80 p-6 shadow-xs space-y-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-2 text-slate-900 font-bold text-sm">
                <Activity className="w-4 h-4 text-emerald-600" />
                <span>Physical Therapy &amp; Exercises ({data.exercises.length})</span>
              </div>
              <button
                type="button"
                onClick={addExercise}
                className="inline-flex items-center space-x-1 text-xs font-bold text-emerald-700 bg-emerald-50 hover:bg-emerald-100 border border-emerald-200 px-3 py-1.5 rounded-xl transition-colors cursor-pointer"
              >
                <Plus className="w-3.5 h-3.5" />
                <span>Add Exercise</span>
              </button>
            </div>

            <div className="space-y-3">
              {data.exercises.map((ex, idx) => (
                <div
                  key={idx}
                  className="p-4 rounded-xl bg-slate-50/80 border border-slate-200/70 text-xs space-y-3 relative"
                >
                  <div className="flex items-center justify-between">
                    <span className="font-bold text-slate-700 flex items-center space-x-1.5">
                      <span className="w-5 h-5 rounded-full bg-emerald-100 text-emerald-800 inline-flex items-center justify-center text-[10px] font-bold">
                        {idx + 1}
                      </span>
                      <span>Physiotherapy Protocol</span>
                    </span>
                    <button
                      type="button"
                      onClick={() => removeExercise(idx)}
                      className="text-slate-400 hover:text-rose-600 p-1 transition-colors"
                      title="Remove exercise"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    <div>
                      <label className="block font-medium text-slate-500 mb-1">Exercise Title</label>
                      <input
                        type="text"
                        value={ex.title}
                        onChange={(e) => updateExercise(idx, 'title', e.target.value)}
                        className="w-full p-2 rounded-lg border border-slate-200 bg-white focus:outline-none focus:ring-1 focus:ring-emerald-500"
                      />
                    </div>
                    <div>
                      <label className="block font-medium text-slate-500 mb-1">Target Frequency &amp; Sets</label>
                      <input
                        type="text"
                        value={ex.frequency}
                        onChange={(e) => updateExercise(idx, 'frequency', e.target.value)}
                        className="w-full p-2 rounded-lg border border-slate-200 bg-white focus:outline-none focus:ring-1 focus:ring-emerald-500"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block font-medium text-slate-500 mb-1">Technique Instructions</label>
                    <textarea
                      rows={2}
                      value={ex.description}
                      onChange={(e) => updateExercise(idx, 'description', e.target.value)}
                      className="w-full p-2 rounded-lg border border-slate-200 bg-white focus:outline-none focus:ring-1 focus:ring-emerald-500"
                    />
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Precautions & Warnings Editor */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Precautions */}
            <div className="bg-white rounded-2xl border border-slate-200/80 p-6 shadow-xs space-y-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-2 text-slate-900 font-bold text-sm">
                  <ShieldCheck className="w-4 h-4 text-emerald-600" />
                  <span>Clinical Precautions ({data.precautions.length})</span>
                </div>
                <button
                  type="button"
                  onClick={addPrecaution}
                  className="inline-flex items-center space-x-1 text-[11px] font-bold text-emerald-700 bg-emerald-50 hover:bg-emerald-100 border border-emerald-200 px-2.5 py-1 rounded-lg transition-colors cursor-pointer"
                >
                  <Plus className="w-3 h-3" />
                  <span>Add Precaution</span>
                </button>
              </div>

              <div className="space-y-2">
                {data.precautions.map((prec, idx) => (
                  <div key={idx} className="flex items-center space-x-2">
                    <input
                      type="text"
                      value={prec}
                      onChange={(e) => updatePrecaution(idx, e.target.value)}
                      className="flex-1 text-xs p-2 rounded-lg border border-slate-200 bg-white focus:outline-none focus:ring-1 focus:ring-emerald-500"
                    />
                    <button
                      type="button"
                      onClick={() => removePrecaution(idx)}
                      className="text-slate-400 hover:text-rose-600 p-1"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </div>
                ))}
              </div>
            </div>

            {/* Warning Signs */}
            <div className="bg-white rounded-2xl border border-slate-200/80 p-6 shadow-xs space-y-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-2 text-slate-900 font-bold text-sm">
                  <ShieldAlert className="w-4 h-4 text-rose-600" />
                  <span>Red-Flag Warning Signs ({data.warning_signs.length})</span>
                </div>
                <button
                  type="button"
                  onClick={addWarningSign}
                  className="inline-flex items-center space-x-1 text-[11px] font-bold text-rose-700 bg-rose-50 hover:bg-rose-100 border border-rose-200 px-2.5 py-1 rounded-lg transition-colors cursor-pointer"
                >
                  <Plus className="w-3 h-3" />
                  <span>Add Warning Sign</span>
                </button>
              </div>

              <div className="space-y-2">
                {data.warning_signs.map((sign, idx) => (
                  <div key={idx} className="flex items-center space-x-2">
                    <input
                      type="text"
                      value={sign}
                      onChange={(e) => updateWarningSign(idx, e.target.value)}
                      className="flex-1 text-xs p-2 rounded-lg border border-slate-200 bg-white focus:outline-none focus:ring-1 focus:ring-rose-500"
                    />
                    <button
                      type="button"
                      onClick={() => removeWarningSign(idx)}
                      className="text-slate-400 hover:text-rose-600 p-1"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
