import React, { useState } from 'react';
import {
  FileText,
  Upload,
  Sparkles,
  CheckCircle2,
  Eye,
  Search,
  User,
  ShieldCheck,
  Calendar,
  HardDrive,
} from 'lucide-react';
import { useRecovery } from '../../hooks/use-recovery';
import { api } from '../../lib/api';
import { STATIC_DOCTOR_REPORTS, type StaticReportItem } from '../../lib/staticData';
import { ReportUploadModal } from '../Modals';

interface DoctorReportsScreenProps {
  onReviewOcr: (reportId: string) => void;
}

export const DoctorReportsScreen: React.FC<DoctorReportsScreenProps> = ({ onReviewOcr }) => {
  const { doctorReports } = useRecovery('doctor');
  const [reports, setReports] = useState<StaticReportItem[]>(
    doctorReports && doctorReports.length > 0 ? doctorReports : STATIC_DOCTOR_REPORTS
  );
  const [searchQuery, setSearchQuery] = useState('');
  const [categoryFilter, setCategoryFilter] = useState<'ALL' | 'discharge_summary' | 'operative_note' | 'imaging_report' | 'pathology_report'>('ALL');
  const [isUploadOpen, setIsUploadOpen] = useState(false);
  const [processingId, setProcessingId] = useState<string | null>(null);

  React.useEffect(() => {
    if (doctorReports && doctorReports.length > 0) {
      setReports(doctorReports);
    }
  }, [doctorReports]);

  const filteredReports = reports.filter((report) => {
    const matchesSearch =
      (report.file_name || '').toLowerCase().includes(searchQuery.toLowerCase()) ||
      (report.patient_name || '').toLowerCase().includes(searchQuery.toLowerCase());
    const matchesCategory =
      categoryFilter === 'ALL' || report.report_type === categoryFilter;
    return matchesSearch && matchesCategory;
  });

  const handleProcessOcr = async (reportId: string) => {
    setProcessingId(reportId);
    try {
      await api.processReport(reportId);
      setReports((prev) =>
        prev.map((r) =>
          r.id === reportId ? { ...r, ocr_status: 'COMPLETED' } : r
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
            <span>OCR & LLM Extraction Engine (Tesseract + Groq LLaMA 3.3)</span>
          </div>
          <h1 className="text-2xl font-bold text-slate-900 tracking-tight">Clinical Document Archive &amp; OCR Hub</h1>
          <p className="text-sm text-slate-500 mt-1">
            Review parsed discharge summaries, operative protocols, and radiology reports with automated clinical entity extractions.
          </p>
        </div>

        <button
          onClick={() => setIsUploadOpen(true)}
          className="inline-flex items-center space-x-2 px-4 py-2.5 rounded-xl bg-emerald-700 hover:bg-emerald-800 text-white font-semibold text-xs transition-colors shadow-xs"
        >
          <Upload className="w-4 h-4" />
          <span>Upload Clinical Report</span>
        </button>
      </div>

      {/* Filter & Search Bar */}
      <div className="bg-white rounded-2xl border border-slate-200/80 p-4 shadow-xs flex flex-col sm:flex-row items-center justify-between gap-3">
        {/* Search */}
        <div className="relative w-full sm:w-80">
          <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            placeholder="Search by patient name or file name..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-9 pr-4 py-2 text-xs rounded-xl border border-slate-200 bg-slate-50/50 focus:outline-none focus:ring-2 focus:ring-emerald-600/20 focus:bg-white transition-all"
          />
        </div>

        {/* Category Pills */}
        <div className="flex items-center space-x-1 overflow-x-auto w-full sm:w-auto p-1 bg-slate-100 rounded-xl border border-slate-200/80 text-xs font-semibold">
          <button
            onClick={() => setCategoryFilter('ALL')}
            className={`px-3 py-1.5 rounded-lg transition-all ${
              categoryFilter === 'ALL'
                ? 'bg-white text-emerald-900 shadow-2xs font-bold'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            All ({reports.length})
          </button>
          <button
            onClick={() => setCategoryFilter('discharge_summary')}
            className={`px-3 py-1.5 rounded-lg transition-all ${
              categoryFilter === 'discharge_summary'
                ? 'bg-white text-emerald-900 shadow-2xs font-bold'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            Discharge
          </button>
          <button
            onClick={() => setCategoryFilter('operative_note')}
            className={`px-3 py-1.5 rounded-lg transition-all ${
              categoryFilter === 'operative_note'
                ? 'bg-white text-emerald-900 shadow-2xs font-bold'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            Operative Notes
          </button>
          <button
            onClick={() => setCategoryFilter('imaging_report')}
            className={`px-3 py-1.5 rounded-lg transition-all ${
              categoryFilter === 'imaging_report'
                ? 'bg-white text-emerald-900 shadow-2xs font-bold'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            Imaging &amp; Radiology
          </button>
        </div>
      </div>

      {/* Reports Matrix List */}
      <div className="bg-white rounded-2xl border border-slate-200/80 p-6 shadow-xs space-y-4">
        <div className="flex items-center justify-between">
          <h2 className="text-base font-bold text-slate-900">Document Processing Queue</h2>
          <span className="text-xs text-slate-400 font-medium">{filteredReports.length} Available Documents</span>
        </div>

        <div className="divide-y divide-slate-100">
          {filteredReports.map((report) => {
            const isCompleted = report.ocr_status === 'COMPLETED';
            const isProcessing = processingId === report.id;
            const repType = (report.report_type || 'report').replace('_', ' ');
            const dateDisplay = report.uploaded_at
              ? new Date(report.uploaded_at).toLocaleDateString('en-GB', {
                  day: 'numeric',
                  month: 'short',
                  year: 'numeric',
                })
              : 'Recent';

            return (
              <div
                key={report.id}
                className="py-4.5 flex flex-col lg:flex-row lg:items-center justify-between gap-4 hover:bg-slate-50/60 p-2.5 rounded-xl transition-colors"
              >
                <div className="flex items-start space-x-3.5">
                  <div className="w-11 h-11 rounded-xl bg-emerald-50 border border-emerald-100 flex items-center justify-center text-emerald-700 shrink-0 mt-0.5">
                    <FileText className="w-5 h-5 text-emerald-700" />
                  </div>
                  <div>
                    <div className="flex flex-wrap items-center gap-2">
                      <span className="text-xs font-bold text-slate-900 hover:text-emerald-700 transition-colors">
                        {report.file_name}
                      </span>
                      <span className="text-[10px] font-semibold uppercase px-2 py-0.5 rounded-md bg-slate-100 text-slate-600">
                        {repType}
                      </span>
                      {report.confidence_score && (
                        <span className="inline-flex items-center space-x-1 text-[10px] font-bold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded-md border border-emerald-200">
                          <ShieldCheck className="w-3 h-3" />
                          <span>{report.confidence_score}% Confidence</span>
                        </span>
                      )}
                    </div>

                    <div className="flex flex-wrap items-center gap-4 text-[11px] text-slate-400 mt-1.5">
                      {report.patient_name && (
                        <span className="flex items-center space-x-1 text-slate-600 font-semibold">
                          <User className="w-3.5 h-3.5 text-slate-400" />
                          <span>{report.patient_name}</span>
                        </span>
                      )}
                      <span className="flex items-center space-x-1">
                        <Calendar className="w-3.5 h-3.5 text-slate-400" />
                        <span>Uploaded on {dateDisplay}</span>
                      </span>
                      {report.file_size && (
                        <span className="flex items-center space-x-1">
                          <HardDrive className="w-3.5 h-3.5 text-slate-400" />
                          <span>{report.file_size}</span>
                        </span>
                      )}
                    </div>
                  </div>
                </div>

                <div className="flex items-center space-x-2.5 self-end lg:self-center shrink-0">
                  {isCompleted ? (
                    <>
                      <span className="inline-flex items-center space-x-1.5 px-2.5 py-1 rounded-full bg-emerald-50 text-emerald-800 text-[11px] font-semibold">
                        <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
                        <span>OCR Ready</span>
                      </span>
                      <button
                        onClick={() => onReviewOcr(report.id)}
                        className="inline-flex items-center space-x-1.5 px-3.5 py-2 rounded-xl bg-emerald-700 hover:bg-emerald-800 text-white text-xs font-semibold transition-colors shadow-xs cursor-pointer"
                      >
                        <Eye className="w-3.5 h-3.5" />
                        <span>Review Extracted Entities</span>
                      </button>
                    </>
                  ) : (
                    <button
                      onClick={() => handleProcessOcr(report.id)}
                      disabled={isProcessing}
                      className="inline-flex items-center space-x-1.5 px-3.5 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-semibold transition-colors disabled:opacity-50"
                    >
                      <Sparkles className="w-3.5 h-3.5" />
                      <span>{isProcessing ? 'Processing OCR & AI...' : 'Run OCR & Extract'}</span>
                    </button>
                  )}
                </div>
              </div>
            );
          })}

          {filteredReports.length === 0 && (
            <div className="py-12 text-center text-slate-400">
              <FileText className="w-10 h-10 mx-auto mb-2 text-slate-300" />
              <div className="text-xs font-semibold text-slate-600">No clinical reports match your search</div>
              <p className="text-[11px] text-slate-400 mt-0.5">Try clearing filters or uploading a new clinical document.</p>
            </div>
          )}
        </div>
      </div>

      <ReportUploadModal
        isOpen={isUploadOpen}
        onClose={() => setIsUploadOpen(false)}
      />
    </div>
  );
};
