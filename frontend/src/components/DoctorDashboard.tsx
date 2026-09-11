import { useState } from 'react';
import {
  Users,
  Activity,
  AlertCircle,
  FileText,
  Plus,
  ArrowRight,
  ClipboardList,
  CheckCircle,
} from 'lucide-react';
import { useRecovery } from '../hooks/use-recovery';
import { ActivityCalendar } from './ActivityCalendar';
import { AlertsDrawer } from './AlertsDrawer';
import { ReportUploadModal } from './Modals';

interface DoctorDashboardProps {
  onNavigate?: (section: string) => void;
}

export const DoctorDashboard: React.FC<DoctorDashboardProps> = ({ onNavigate }) => {
  const { assignedPatients, doctorAlerts, doctorReports, resolveAlert } = useRecovery('doctor');

  const [selectedPatientId, setSelectedPatientId] = useState<string>('');
  const [isReportModalOpen, setIsReportModalOpen] = useState(false);

  const userJson = typeof window !== 'undefined' ? localStorage.getItem('meditech_user') : null;
  const storedUser = userJson ? JSON.parse(userJson) : null;
  const doctorName =
    storedUser?.user_id === 'doctor.arjun'
      ? 'Dr. Arjun Mehta'
      : 'Dr. Ananya Rao';

  const selectedPatient =
    assignedPatients.find((p: any) => p.patient_id === selectedPatientId) ||
    assignedPatients[0];

  const totalPatientsCount = assignedPatients.length;
  const averageProgressPct =
    totalPatientsCount > 0
      ? Math.round(
          assignedPatients.reduce((acc: number, p: any) => acc + Number(p.progress || 65), 0) /
            totalPatientsCount
        )
      : 65;
  const needsReviewCount = doctorAlerts.filter((a: any) => a.severity === 'high' || a.status === 'unread').length;
  const reportsReadyCount = doctorReports.length > 0 ? doctorReports.length : 2;

  return (
    <div className="space-y-6">
      {/* Hero Welcome Header & Quick Action */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="text-xs font-semibold text-slate-400">Good morning, {doctorName}</div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight mt-0.5">
            Care team overview
          </h1>
          <p className="text-xs sm:text-sm text-slate-500 mt-1">
            Monitor recovery progress and keep your patients moving forward.
          </p>
        </div>

        <button
          onClick={() => setIsReportModalOpen(true)}
          className="self-start flex items-center space-x-1.5 px-4 py-2 bg-emerald-700 hover:bg-emerald-800 text-white text-xs font-bold rounded-xl shadow-xs transition-colors"
        >
          <Plus className="w-4 h-4" />
          <span>New recovery plan</span>
        </button>
      </div>

      {/* 4 Metric Header Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Card 1: Assigned patients */}
        <div className="bg-white border border-slate-200/80 rounded-2xl p-5 shadow-xs flex items-center justify-between">
          <div>
            <div className="text-[11px] font-semibold text-slate-400">Assigned patients</div>
            <div className="text-2xl font-extrabold text-slate-900 mt-1">{totalPatientsCount || 3}</div>
            <div className="text-[11px] text-slate-500 mt-0.5">Across active plans</div>
          </div>
          <div className="w-10 h-10 rounded-xl bg-emerald-50 text-emerald-600 flex items-center justify-center">
            <Users className="w-5 h-5" />
          </div>
        </div>

        {/* Card 2: Average progress */}
        <div className="bg-white border border-slate-200/80 rounded-2xl p-5 shadow-xs flex items-center justify-between">
          <div>
            <div className="text-[11px] font-semibold text-slate-400">Average progress</div>
            <div className="text-2xl font-extrabold text-slate-900 mt-1">{averageProgressPct}%</div>
            <div className="text-[11px] text-slate-500 mt-0.5">Across your caseload</div>
          </div>
          <div className="w-10 h-10 rounded-xl bg-teal-50 text-teal-600 flex items-center justify-center">
            <Activity className="w-5 h-5" />
          </div>
        </div>

        {/* Card 3: Needs review */}
        <div className="bg-white border border-slate-200/80 rounded-2xl p-5 shadow-xs flex items-center justify-between">
          <div>
            <div className="text-[11px] font-semibold text-slate-400">Needs review</div>
            <div className="text-2xl font-extrabold text-slate-900 mt-1">{needsReviewCount || 1}</div>
            <div className="text-[11px] text-slate-500 mt-0.5">Requires attention today</div>
          </div>
          <div className="w-10 h-10 rounded-xl bg-amber-50 text-amber-600 flex items-center justify-center">
            <AlertCircle className="w-5 h-5" />
          </div>
        </div>

        {/* Card 4: Reports ready */}
        <div className="bg-white border border-slate-200/80 rounded-2xl p-5 shadow-xs flex items-center justify-between">
          <div>
            <div className="text-[11px] font-semibold text-slate-400">Reports ready</div>
            <div className="text-2xl font-extrabold text-slate-900 mt-1">{reportsReadyCount}</div>
            <div className="text-[11px] text-slate-500 mt-0.5">Waiting for review</div>
          </div>
          <div className="w-10 h-10 rounded-xl bg-emerald-50 text-emerald-600 flex items-center justify-center">
            <FileText className="w-5 h-5" />
          </div>
        </div>
      </div>

      {/* Patient Monitoring Table & Selected Patient Section */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left: Assigned Patients Table (col-span-8) */}
        <div className="lg:col-span-8 bg-white border border-slate-200/80 rounded-2xl p-6 shadow-xs space-y-4">
          <div className="flex items-center justify-between pb-3 border-b border-slate-100">
            <div>
              <div className="text-[10px] font-bold uppercase tracking-wider text-emerald-800">
                PATIENT MONITORING
              </div>
              <h3 className="text-base font-bold text-slate-900 mt-0.5">Assigned patients</h3>
            </div>
            <button
              onClick={() => onNavigate?.('patients')}
              className="text-xs font-semibold text-emerald-700 hover:text-emerald-800 transition-colors cursor-pointer"
            >
              View all patients
            </button>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead>
                <tr className="border-b border-slate-100 text-slate-400 font-semibold">
                  <th className="pb-3 pl-2">Patient</th>
                  <th className="pb-3">Active plan</th>
                  <th className="pb-3">Progress</th>
                  <th className="pb-3 pr-2 text-right">Last review</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {assignedPatients.length === 0 ? (
                  <tr>
                    <td colSpan={4} className="py-8 text-center text-slate-400">
                      No patients assigned to your care team yet.
                    </td>
                  </tr>
                ) : (
                  assignedPatients.map((patient: any) => {
                    const isSelected = patient.patient_id === selectedPatient?.patient_id;
                    const name = patient.name || patient.username || patient.user_id;
                    const planTitle = patient.plan_name || 'Post-operative Recovery Protocol';
                    const prog = patient.progress !== undefined ? patient.progress : 0;
                    const review = patient.last_review || 'Pending review';

                    return (
                      <tr
                        key={patient.patient_id}
                        onClick={() => setSelectedPatientId(patient.patient_id)}
                        className={`cursor-pointer transition-colors ${
                          isSelected ? 'bg-emerald-50/50' : 'hover:bg-slate-50/60'
                        }`}
                      >
                        <td className="py-3.5 pl-2">
                          <div className="font-bold text-slate-900">{name}</div>
                          <div className="text-[11px] text-slate-400">{patient.age} years &bull; {patient.sex || 'Patient'}</div>
                        </td>
                        <td className="py-3.5 text-slate-700 font-medium">{planTitle}</td>
                        <td className="py-3.5 font-bold text-slate-900">{prog}%</td>
                        <td className="py-3.5 pr-2 text-right text-slate-500 font-medium">
                          {review}
                        </td>
                      </tr>
                    );
                  })
                )}
              </tbody>
            </table>
          </div>
        </div>

        {/* Right: Selected Patient Action Card (col-span-4) */}
        <div className="lg:col-span-4 bg-white border border-slate-200/80 rounded-2xl p-6 shadow-xs flex flex-col justify-between space-y-4">
          <div>
            <div className="text-[10px] font-bold uppercase tracking-wider text-slate-400">
              SELECTED PATIENT
            </div>
            <h3 className="text-lg font-bold text-slate-900 mt-0.5">
              {selectedPatient?.name || selectedPatient?.username || selectedPatient?.user_id || 'No patient selected'}
            </h3>

            {selectedPatient ? (
              <div className="mt-4 p-4 bg-slate-50 border border-slate-200/60 rounded-xl space-y-2">
                <div className="text-xs font-bold text-slate-800">
                  {selectedPatient?.plan_name || 'Post-operative Recovery Protocol'}
                </div>
                <div className="text-[11px] text-slate-400">
                  Last review: {selectedPatient?.last_review || 'Active in care'}
                </div>
                <div className="w-full bg-slate-200 h-1.5 rounded-full overflow-hidden mt-2">
                  <div
                    className="bg-emerald-700 h-full rounded-full transition-all"
                    style={{ width: `${selectedPatient?.progress || 0}%` }}
                  />
                </div>
                <div className="text-[11px] font-semibold text-right text-slate-700">
                  {selectedPatient?.progress || 0}% complete
                </div>
              </div>
            ) : null}
          </div>

          {/* Action Triggers */}
          <div className="space-y-2 pt-2">
            <button
              onClick={() => onNavigate?.('medical_reports')}
              className="w-full flex items-center justify-between p-3 bg-white border border-slate-200/80 hover:border-emerald-600 hover:bg-emerald-50/30 rounded-xl text-xs font-semibold text-slate-800 transition-all cursor-pointer"
            >
              <span className="flex items-center space-x-2">
                <FileText className="w-4 h-4 text-emerald-700" />
                <span>Review medical reports &amp; OCR</span>
              </span>
              <ArrowRight className="w-3.5 h-3.5 text-slate-400" />
            </button>

            <button
              onClick={() => onNavigate?.('recovery_plans')}
              className="w-full flex items-center justify-between p-3 bg-white border border-slate-200/80 hover:border-emerald-600 hover:bg-emerald-50/30 rounded-xl text-xs font-semibold text-slate-800 transition-all cursor-pointer"
            >
              <span className="flex items-center space-x-2">
                <ClipboardList className="w-4 h-4 text-emerald-700" />
                <span>Review plan and tasks</span>
              </span>
              <ArrowRight className="w-3.5 h-3.5 text-slate-400" />
            </button>

            <button
              onClick={() => onNavigate?.('daily_reviews')}
              className="w-full flex items-center justify-between p-3 bg-white border border-slate-200/80 hover:border-emerald-600 hover:bg-emerald-50/30 rounded-xl text-xs font-semibold text-slate-800 transition-all cursor-pointer"
            >
              <span className="flex items-center space-x-2">
                <CheckCircle className="w-4 h-4 text-emerald-700" />
                <span>View daily reviews</span>
              </span>
              <ArrowRight className="w-3.5 h-3.5 text-slate-400" />
            </button>
          </div>
        </div>
      </div>

      {/* Activity Calendar for Selected Patient */}
      <ActivityCalendar patientName={selectedPatient?.full_name || selectedPatient?.name || 'Rahul Sharma'} />

      {/* Alerts & Plan Workspace Sections (matching screenshot 5) */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left: Alerts (col-span-6) */}
        <div className="lg:col-span-6">
          <AlertsDrawer
            role="doctor"
            alerts={doctorAlerts}
            onResolveAlert={(id) => resolveAlert.mutate(id)}
          />
        </div>

        {/* Right: Plan Workspace Quick Actions (col-span-6) */}
        <div className="lg:col-span-6 bg-white border border-slate-200/80 rounded-2xl p-6 shadow-xs space-y-4">
          <div className="pb-3 border-b border-slate-100">
            <div className="text-[10px] font-bold uppercase tracking-wider text-emerald-800">
              PLAN WORKSPACE
            </div>
            <h3 className="text-base font-bold text-slate-900 mt-0.5">Quick actions</h3>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-1">
            <button
              onClick={() => setIsReportModalOpen(true)}
              className="p-4 border border-slate-200/80 hover:border-emerald-600 hover:bg-emerald-50/30 rounded-xl text-left transition-all group"
            >
              <div className="flex items-center space-x-2 text-emerald-700 font-bold text-xs">
                <Plus className="w-4 h-4 group-hover:scale-110 transition-transform" />
                <span>Create recovery plan</span>
              </div>
              <p className="text-[11px] text-slate-500 mt-1">Set goals and milestones</p>
            </button>

            <button
              onClick={() => setIsReportModalOpen(true)}
              className="p-4 border border-slate-200/80 hover:border-emerald-600 hover:bg-emerald-50/30 rounded-xl text-left transition-all group"
            >
              <div className="flex items-center space-x-2 text-emerald-700 font-bold text-xs">
                <ClipboardList className="w-4 h-4 group-hover:scale-110 transition-transform" />
                <span>Schedule tasks</span>
              </div>
              <p className="text-[11px] text-slate-500 mt-1">Add patient activities</p>
            </button>
          </div>
        </div>
      </div>

      {/* Report Upload & OCR Modal */}
      <ReportUploadModal
        isOpen={isReportModalOpen}
        onClose={() => setIsReportModalOpen(false)}
        patientId={selectedPatient?.patient_id}
        patientName={selectedPatient?.name}
      />
    </div>
  );
};
