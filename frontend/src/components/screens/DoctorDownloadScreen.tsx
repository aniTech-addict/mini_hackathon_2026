import React from 'react';
import { Download, FileText } from 'lucide-react';
import { useRecovery } from '../../hooks/use-recovery';

export const DoctorDownloadScreen: React.FC = () => {
  const { assignedPatients } = useRecovery('doctor');

  const exportDatasets = [
    {
      title: 'Full Caseload Rehabilitation Compliance (September 2026)',
      type: 'CSV / EXCEL',
      records: `${assignedPatients.length} Active Patients`,
      desc: 'Export daily check-in ratings, missed task logs, and overall adherence percentages.',
    },
    {
      title: 'Tesseract & Groq LLM OCR Entity Extraction Audit Logs',
      type: 'JSON / PDF',
      records: '3 Processed Documents',
      desc: 'Raw and normalized clinical entity extractions including confidence scores.',
    },
    {
      title: 'Clinical Exception & Alert Incident Resolution Log',
      type: 'PDF',
      records: 'All Resolved Alerts',
      desc: 'Hospital quality assurance summary of critical symptom threshold responses.',
    },
  ];

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="bg-white rounded-2xl border border-slate-200/80 p-6 shadow-xs flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="inline-flex items-center space-x-2 px-2.5 py-1 rounded-full bg-emerald-50 text-emerald-800 text-xs font-semibold mb-2">
            <Download className="w-3.5 h-3.5" />
            <span>Clinical Data Export Hub</span>
          </div>
          <h1 className="text-2xl font-bold text-slate-900 tracking-tight">Export Clinical Summaries</h1>
          <p className="text-sm text-slate-500 mt-1">
            Generate certified reports for departmental audits, accreditation, and insurance reimbursement.
          </p>
        </div>
      </div>

      <div className="space-y-3">
        {exportDatasets.map((item, idx) => (
          <div key={idx} className="bg-white rounded-2xl border border-slate-200/80 p-5 shadow-xs flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div className="flex items-start space-x-3.5">
              <div className="w-10 h-10 rounded-xl bg-emerald-50 text-emerald-700 flex items-center justify-center shrink-0">
                <FileText className="w-5 h-5" />
              </div>
              <div>
                <div className="flex items-center space-x-2">
                  <h3 className="text-xs font-bold text-slate-900">{item.title}</h3>
                  <span className="text-[10px] font-bold px-2 py-0.5 rounded bg-slate-100 text-slate-600">
                    {item.type}
                  </span>
                </div>
                <p className="text-xs text-slate-500 mt-0.5">{item.desc}</p>
                <div className="text-[11px] text-slate-400 mt-1">{item.records}</div>
              </div>
            </div>

            <button
              onClick={() => window.print()}
              className="inline-flex items-center space-x-1.5 px-3 py-2 rounded-xl bg-emerald-700 hover:bg-emerald-800 text-white text-xs font-semibold transition-colors shrink-0 shadow-xs"
            >
              <Download className="w-3.5 h-3.5" />
              <span>Export Dataset</span>
            </button>
          </div>
        ))}
      </div>
    </div>
  );
};
