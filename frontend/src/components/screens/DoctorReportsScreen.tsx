import React, { useState } from 'react';
import { FileText, Upload, Sparkles, CheckCircle2, Eye } from 'lucide-react';
import { useRecovery } from '../../hooks/use-recovery';
import { api } from '../../lib/api';
import { ReportUploadModal } from '../Modals';

interface DoctorReportsScreenProps {
  onReviewOcr: (reportId: string) => void;
}

export const DoctorReportsScreen: React.FC<DoctorReportsScreenProps> = ({ onReviewOcr }) => {
  const { doctorReports } = useRecovery('doctor');
  const [reports, setReports] = useState(doctorReports);
  const [isUploadOpen, setIsUploadOpen] = useState(false);
  const [processingId, setProcessingId] = useState<string | null>(null);

  const handleProcessOcr = async (reportId: string) => {
    setProcessingId(reportId);
    try {
      await api.processReport(reportId);
      setReports(
        reports.map((r: any) =>
          r.id === reportId ? { ...r, ocr_status: 'COMPLETED', processed_at: new Date().toISOString() } : r
        )
      );
    } finally {
      setProcessingId(null);
    }
  };

  return (
    <div className="space-y-6">
      {/* Top Banner */}
      <div className="bg-white rounded-2xl border border-slate-200/80 p-6 shadow-xs flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="inline-flex items-center space-x-2 px-2.5 py-1 rounded-full bg-emerald-50 text-emerald-800 text-xs font-semibold mb-2">
            <Sparkles className="w-3.5 h-3.5" />
            <span>OCR & LLM Extraction Engine</span>
          </div>
          <h1 className="text-2xl font-bold text-slate-900 tracking-tight">Clinical Document Processing</h1>
          <p className="text-sm text-slate-500 mt-1">
            Upload patient discharge summaries or operative notes to extract medications, exercises, and precautions via Tesseract & Groq.
          </p>
        </div>

        <button
          onClick={() => setIsUploadOpen(true)}
          className="inline-flex items-center space-x-2 px-4 py-2.5 rounded-xl bg-emerald-700 hover:bg-emerald-800 text-white font-semibold text-xs transition-colors shadow-xs"
        >
          <Upload className="w-4 h-4" />
          <span>Upload New Report</span>
        </button>
      </div>

      {/* Reports Table */}
      <div className="bg-white rounded-2xl border border-slate-200/80 p-6 shadow-xs space-y-4">
        <div className="flex items-center justify-between">
          <h2 className="text-base font-bold text-slate-900">Document Extraction Queue</h2>
          <span className="text-xs text-slate-400 font-medium">{reports.length} Files Enrolled</span>
        </div>

        <div className="divide-y divide-slate-100">
          {reports.map((report: any) => {
            const isCompleted = report.ocr_status === 'COMPLETED';
            const isProcessing = processingId === report.id;

            return (
              <div key={report.id} className="py-4 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                <div className="flex items-start space-x-3.5">
                  <div className="w-10 h-10 rounded-xl bg-slate-100 flex items-center justify-center text-slate-600 shrink-0">
                    <FileText className="w-5 h-5 text-emerald-700" />
                  </div>
                  <div>
                    <div className="flex items-center space-x-2">
                      <span className="text-xs font-bold text-slate-800">{report.file_name}</span>
                      <span className="text-[10px] font-semibold uppercase px-2 py-0.5 rounded bg-slate-100 text-slate-600">
                        {report.report_type.replace('_', ' ')}
                      </span>
                    </div>
                    <div className="text-[11px] text-slate-400 mt-0.5">
                      Uploaded on {new Date(report.uploaded_at).toLocaleDateString('en-GB', { day: 'numeric', month: 'short', year: 'numeric' })}
                    </div>
                  </div>
                </div>

                <div className="flex items-center space-x-2.5 self-end sm:self-center">
                  {isCompleted ? (
                    <>
                      <span className="inline-flex items-center space-x-1.5 px-2.5 py-1 rounded-full bg-emerald-50 text-emerald-800 text-[11px] font-semibold">
                        <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
                        <span>OCR Ready</span>
                      </span>
                      <button
                        onClick={() => onReviewOcr(report.id)}
                        className="inline-flex items-center space-x-1.5 px-3 py-1.5 rounded-lg bg-emerald-700 hover:bg-emerald-800 text-white text-xs font-semibold transition-colors"
                      >
                        <Eye className="w-3.5 h-3.5" />
                        <span>Review Extracted Entities</span>
                      </button>
                    </>
                  ) : (
                    <button
                      onClick={() => handleProcessOcr(report.id)}
                      disabled={isProcessing}
                      className="inline-flex items-center space-x-1.5 px-3 py-1.5 rounded-lg bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-semibold transition-colors disabled:opacity-50"
                    >
                      <Sparkles className="w-3.5 h-3.5" />
                      <span>{isProcessing ? 'Processing OCR & AI...' : 'Run OCR & Extract'}</span>
                    </button>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      </div>

      <ReportUploadModal isOpen={isUploadOpen} onClose={() => setIsUploadOpen(false)} />
    </div>
  );
};
