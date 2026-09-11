import React, { useState } from 'react';
import {
  FileSearch,
  FileText,
  Clock,
  Upload,
  ShieldCheck,
  Eye,
  Calendar,
  HardDrive,
} from 'lucide-react';
import { useRecovery } from '../../hooks/use-recovery';
import { STATIC_PATIENT_REPORTS } from '../../lib/staticData';
import { ReportUploadModal } from '../Modals';

interface MyReportsScreenProps {
  onViewOcr: (reportId: string) => void;
}

export const MyReportsScreen: React.FC<MyReportsScreenProps> = ({ onViewOcr }) => {
  const { patientReports } = useRecovery('patient');
  const [isUploadOpen, setIsUploadOpen] = useState(false);

  const displayReports =
    patientReports && patientReports.length > 0
      ? patientReports
      : STATIC_PATIENT_REPORTS;

  return (
    <div className="space-y-6">
      {/* Top Banner */}
      <div className="bg-white rounded-2xl border border-slate-200/80 p-6 shadow-xs flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="inline-flex items-center space-x-2 px-2.5 py-1 rounded-full bg-emerald-50 text-emerald-800 text-xs font-semibold mb-2">
            <FileSearch className="w-3.5 h-3.5" />
            <span>Digital Document Archive</span>
          </div>
          <h1 className="text-2xl font-bold text-slate-900 tracking-tight">My Medical Reports</h1>
          <p className="text-sm text-slate-500 mt-1">
            Access hospital discharge summaries, post-op imaging, and AI clinical entity extractions.
          </p>
        </div>

        <button
          onClick={() => setIsUploadOpen(true)}
          className="inline-flex items-center space-x-2 px-4 py-2.5 rounded-xl bg-emerald-700 hover:bg-emerald-800 text-white font-semibold text-xs transition-colors shadow-xs cursor-pointer"
        >
          <Upload className="w-4 h-4" />
          <span>Upload Document</span>
        </button>
      </div>

      {/* Reports Table Card */}
      <div className="bg-white rounded-2xl border border-slate-200/80 p-6 shadow-xs space-y-4">
        <div className="flex items-center justify-between">
          <h2 className="text-base font-bold text-slate-900">Archived Clinical Reports</h2>
          <span className="text-xs text-slate-400 font-medium">{displayReports.length} Documents</span>
        </div>

        <div className="divide-y divide-slate-100">
          {displayReports.map((report: any) => (
            <div
              key={report.id}
              className="py-4.5 flex flex-col sm:flex-row sm:items-center justify-between gap-3 hover:bg-slate-50/60 p-2.5 rounded-xl transition-colors"
            >
              <div className="flex items-start space-x-3.5">
                <div className="w-11 h-11 rounded-xl bg-emerald-50 border border-emerald-100 flex items-center justify-center text-emerald-700 shrink-0 mt-0.5">
                  <FileText className="w-5 h-5 text-emerald-700" />
                </div>
                <div>
                  <div className="flex flex-wrap items-center gap-2">
                    <span className="text-xs font-bold text-slate-900">{report.file_name}</span>
                    <span className="text-[10px] font-semibold uppercase px-2 py-0.5 rounded bg-slate-100 text-slate-600">
                      {(report.report_type || 'report').replace('_', ' ')}
                    </span>
                    {report.confidence_score && (
                      <span className="inline-flex items-center space-x-1 text-[10px] font-bold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded-md border border-emerald-200">
                        <ShieldCheck className="w-3 h-3" />
                        <span>{report.confidence_score}% Confidence</span>
                      </span>
                    )}
                  </div>
                  <div className="flex items-center space-x-4 text-[11px] text-slate-400 mt-1.5">
                    <span className="flex items-center space-x-1">
                      <Calendar className="w-3.5 h-3.5 text-slate-400" />
                      <span>
                        Uploaded on{' '}
                        {new Date(report.uploaded_at).toLocaleDateString('en-GB', {
                          day: 'numeric',
                          month: 'short',
                          year: 'numeric',
                        })}
                      </span>
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

              <div className="flex items-center space-x-2.5 self-end sm:self-center shrink-0">
                {report.ocr_status === 'COMPLETED' ? (
                  <span className="inline-flex items-center space-x-1.5 px-2.5 py-1 rounded-full bg-emerald-50 text-emerald-800 text-[11px] font-semibold">
                    <ShieldCheck className="w-3.5 h-3.5 text-emerald-600" />
                    <span>OCR Ready</span>
                  </span>
                ) : (
                  <span className="inline-flex items-center space-x-1.5 px-2.5 py-1 rounded-full bg-amber-50 text-amber-800 text-[11px] font-semibold">
                    <Clock className="w-3.5 h-3.5 text-amber-600" />
                    <span>Processing</span>
                  </span>
                )}

                <button
                  onClick={() => onViewOcr(report.id)}
                  className="inline-flex items-center space-x-1.5 px-3 py-1.5 rounded-xl border border-slate-200 text-xs font-semibold text-slate-700 hover:bg-slate-50 transition-colors shadow-2xs cursor-pointer"
                >
                  <Eye className="w-3.5 h-3.5 text-slate-500" />
                  <span>View Extracted Protocol</span>
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>

      <ReportUploadModal isOpen={isUploadOpen} onClose={() => setIsUploadOpen(false)} />
    </div>
  );
};
