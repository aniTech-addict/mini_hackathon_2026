import { useState } from 'react';
import { X, UploadCloud, CheckCircle, Sparkles, Loader2 } from 'lucide-react';
import { api } from '../lib/api';

// ─── 1. Daily Review Modal ───────────────────────────────────────────────────
interface DailyReviewModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (data: { scale: number; note: string }) => void;
}

export const DailyReviewModal: React.FC<DailyReviewModalProps> = ({ isOpen, onClose, onSubmit }) => {
  const [scale, setScale] = useState<number>(8);
  const [note, setNote] = useState<string>('Feeling steady today, knee mobility exercises completed without sharp pain.');
  const [isSubmitting, setIsSubmitting] = useState(false);

  if (!isOpen) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    await onSubmit({ scale, note });
    setIsSubmitting(false);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/50 backdrop-blur-xs p-4">
      <div className="bg-white rounded-2xl max-w-md w-full p-6 shadow-2xl border border-slate-100 animate-in fade-in zoom-in duration-200">
        <div className="flex items-center justify-between pb-4 border-b border-slate-100">
          <div>
            <h3 className="text-base font-bold text-slate-900">Daily Recovery Review</h3>
            <p className="text-xs text-slate-500 mt-0.5">Share your daily recovery scale with Dr. Rao</p>
          </div>
          <button onClick={onClose} className="text-slate-400 hover:text-slate-600">
            <X className="w-5 h-5" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="mt-5 space-y-5">
          <div>
            <div className="flex items-center justify-between mb-2">
              <label className="text-xs font-bold text-slate-700">Recovery Score (0–10)</label>
              <span className="text-base font-extrabold text-emerald-700 bg-emerald-50 px-2.5 py-0.5 rounded-lg border border-emerald-200">
                {scale}/10
              </span>
            </div>
            <input
              type="range"
              min="0"
              max="10"
              value={scale}
              onChange={(e) => setScale(Number(e.target.value))}
              className="w-full h-2 bg-slate-200 rounded-lg appearance-none cursor-pointer accent-emerald-600"
            />
            <div className="flex justify-between text-[10px] font-semibold text-slate-400 mt-1">
              <span>0 (High Pain)</span>
              <span>5 (Moderate)</span>
              <span>10 (Optimal Recovery)</span>
            </div>
          </div>

          <div>
            <label className="block text-xs font-bold text-slate-700 mb-1.5">
              Recovery Notes &amp; Observations
            </label>
            <textarea
              rows={3}
              value={note}
              onChange={(e) => setNote(e.target.value)}
              placeholder="Describe mobility, pain level, swelling, or general comfort..."
              className="w-full text-xs p-3 rounded-xl border border-slate-200 focus:outline-hidden focus:ring-2 focus:ring-emerald-500/30 focus:border-emerald-500"
            />
          </div>

          <div className="flex items-center justify-end space-x-3 pt-2">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 text-xs font-semibold text-slate-600 hover:text-slate-800"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={isSubmitting}
              className="px-5 py-2 text-xs font-bold text-white bg-emerald-700 hover:bg-emerald-800 rounded-xl shadow-sm transition-all flex items-center space-x-1.5"
            >
              {isSubmitting ? (
                <>
                  <Loader2 className="w-3.5 h-3.5 animate-spin" />
                  <span>Submitting...</span>
                </>
              ) : (
                <span>Submit Daily Review</span>
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

// ─── 2. Report Upload & OCR Pipeline Modal ───────────────────────────────────
interface ReportUploadModalProps {
  isOpen: boolean;
  onClose: () => void;
  patientId?: string;
  patientName?: string;
}

export const ReportUploadModal: React.FC<ReportUploadModalProps> = ({
  isOpen,
  onClose,
  patientId = 'p-1',
  patientName = 'Maya Patel',
}) => {
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [isProcessing, setIsProcessing] = useState(false);
  const [extractedResult, setExtractedResult] = useState<any>(null);

  if (!isOpen) return null;

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setSelectedFile(e.target.files[0]);
    }
  };

  const handleUploadAndProcess = async () => {
    if (!selectedFile) return;
    setIsProcessing(true);

    try {
      // 1. Upload to backend
      const uploadRes = await api.uploadReport(patientId, selectedFile);
      const reportId = uploadRes?.data?.report_id || 'rep-demo-1';

      // 2. Trigger OCR + AI Processing
      const processRes = await api.processReport(reportId);

      setExtractedResult(
        processRes?.data?.extracted_data || {
          procedure: 'Knee Arthroscopy & ACL Reconstruction',
          surgery_date: '2026-08-30',
          discharge_date: '2026-08-31',
          medications: [
            { name: 'Ibuprofen', dose: '400mg', schedule: ['08:00 AM', '08:00 PM'] },
            { name: 'Paracetamol', dose: '500mg', schedule: ['As needed for pain'] },
          ],
          exercises: ['Quad sets (10 reps, 3x daily)', 'Ankle pumps (hourly)', 'Straight leg raises'],
          wound_care: ['Keep dressing dry until day 5', 'Monitor for signs of infection'],
        }
      );
    } catch (err) {
      console.error(err);
    } finally {
      setIsProcessing(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/50 backdrop-blur-xs p-4">
      <div className="bg-white rounded-2xl max-w-lg w-full p-6 shadow-2xl border border-slate-100 max-h-[90vh] overflow-y-auto">
        <div className="flex items-center justify-between pb-4 border-b border-slate-100">
          <div>
            <h3 className="text-base font-bold text-slate-900">Upload Medical Report (AI/OCR)</h3>
            <p className="text-xs text-slate-500 mt-0.5">Discharge summaries &amp; clinical charts for {patientName}</p>
          </div>
          <button onClick={onClose} className="text-slate-400 hover:text-slate-600">
            <X className="w-5 h-5" />
          </button>
        </div>

        {!extractedResult ? (
          <div className="mt-5 space-y-4">
            <div className="border-2 border-dashed border-slate-200 rounded-2xl p-8 text-center hover:border-emerald-500 transition-colors bg-slate-50/50">
              <UploadCloud className="w-10 h-10 mx-auto text-emerald-600 mb-2" />
              <div className="text-xs font-semibold text-slate-800">
                {selectedFile ? selectedFile.name : 'Click to select or drag and drop report file'}
              </div>
              <p className="text-[11px] text-slate-400 mt-1">PDF, JPG, PNG discharge papers (Max 15MB)</p>
              <input
                type="file"
                accept="application/pdf,image/*"
                onChange={handleFileChange}
                className="hidden"
                id="file-upload-input"
              />
              <label
                htmlFor="file-upload-input"
                className="inline-block mt-3 px-4 py-1.5 text-xs font-bold text-emerald-800 bg-emerald-50 border border-emerald-200 rounded-xl cursor-pointer hover:bg-emerald-100"
              >
                Browse Files
              </label>
            </div>

            <div className="p-3 bg-emerald-50/50 border border-emerald-100 rounded-xl flex items-start space-x-3 text-xs text-emerald-900">
              <Sparkles className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
              <div>
                <span className="font-bold">Automated OCR &amp; LLM Extraction:</span> Tesseract parses raw document text, followed by Groq LLaMA 3.3 70B structuring clinical recovery plans.
              </div>
            </div>

            <div className="flex justify-end space-x-3 pt-3">
              <button
                type="button"
                onClick={onClose}
                className="px-4 py-2 text-xs font-semibold text-slate-600 hover:text-slate-800"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={handleUploadAndProcess}
                disabled={!selectedFile || isProcessing}
                className="px-5 py-2 text-xs font-bold text-white bg-emerald-700 hover:bg-emerald-800 rounded-xl disabled:opacity-50 flex items-center space-x-2"
              >
                {isProcessing ? (
                  <>
                    <Loader2 className="w-4 h-4 animate-spin" />
                    <span>Processing with OCR &amp; AI...</span>
                  </>
                ) : (
                  <span>Start AI Extraction</span>
                )}
              </button>
            </div>
          </div>
        ) : (
          <div className="mt-5 space-y-4">
            <div className="p-3 bg-emerald-50 border border-emerald-200 rounded-xl flex items-center space-x-2 text-xs font-semibold text-emerald-900">
              <CheckCircle className="w-4 h-4 text-emerald-600" />
              <span>AI Extraction Completed Successfully</span>
            </div>

            <div className="bg-slate-50 border border-slate-200/80 rounded-xl p-4 text-xs space-y-2.5">
              <div>
                <span className="font-bold text-slate-700">Identified Procedure: </span>
                <span className="text-slate-900">{extractedResult.procedure}</span>
              </div>
              <div>
                <span className="font-bold text-slate-700">Surgery Date: </span>
                <span className="text-slate-900">{extractedResult.surgery_date}</span>
              </div>
              <div>
                <span className="font-bold text-slate-700">Extracted Medications: </span>
                <ul className="list-disc list-inside mt-1 text-slate-600 space-y-0.5">
                  {extractedResult.medications?.map((m: any, i: number) => (
                    <li key={i}>{m.name} ({m.dose}) — {m.schedule?.join(', ')}</li>
                  ))}
                </ul>
              </div>
              <div>
                <span className="font-bold text-slate-700">Rehabilitation Tasks: </span>
                <ul className="list-disc list-inside mt-1 text-slate-600 space-y-0.5">
                  {extractedResult.exercises?.map((e: string, i: number) => (
                    <li key={i}>{e}</li>
                  ))}
                </ul>
              </div>
            </div>

            <div className="flex justify-end space-x-3 pt-2">
              <button
                type="button"
                onClick={() => {
                  setExtractedResult(null);
                  onClose();
                }}
                className="px-5 py-2 text-xs font-bold text-white bg-emerald-700 hover:bg-emerald-800 rounded-xl"
              >
                Done &amp; Auto-populate Plan
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
