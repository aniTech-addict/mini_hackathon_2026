import {
  LayoutDashboard,
  Activity,
  Calendar,
  CheckSquare,
  FileText,
  FileSearch,
  ScanLine,
  Bell,
  Users,
  HeartPulse,
  CheckCircle2,
} from 'lucide-react';

interface SidebarProps {
  role: 'patient' | 'doctor';
  activeSection: string;
  onSelectSection: (section: string) => void;
}

export const Sidebar: React.FC<SidebarProps> = ({ role, activeSection, onSelectSection }) => {
  const isDoctor = role === 'doctor';

  const patientSections = [
    {
      group: 'OVERVIEW',
      items: [{ id: 'dashboard', label: 'Dashboard', icon: LayoutDashboard }],
    },
    {
      group: 'MY RECOVERY',
      items: [
        { id: 'current_case', label: 'Recovery Plan', icon: Activity },
        { id: 'recovery_calendar', label: 'Recovery Calendar', icon: Calendar },
        { id: 'daily_checkin', label: 'Daily Check-in', icon: CheckSquare },
      ],
    },
    {
      group: 'CLINICAL RECORDS & ALERTS',
      items: [
        { id: 'medical_file', label: 'Medical File', icon: FileText },
        { id: 'my_reports', label: 'Diagnostic Reports', icon: FileSearch },
        { id: 'ocr_results', label: 'OCR Results', icon: ScanLine },
        { id: 'alerts', label: 'Care Alerts', icon: Bell },
      ],
    },
  ];

  const doctorSections = [
    {
      group: 'OVERVIEW',
      items: [{ id: 'dashboard', label: 'Dashboard', icon: LayoutDashboard }],
    },
    {
      group: 'CASELOAD MANAGEMENT',
      items: [
        { id: 'patients', label: 'Assigned Patients', icon: Users },
        { id: 'recovery_plans', label: 'Recovery Plans', icon: HeartPulse },
        { id: 'tracking_calendar', label: 'Tracking Calendar', icon: Calendar },
      ],
    },
    {
      group: 'CLINICAL REVIEW & ALERTS',
      items: [
        { id: 'daily_reviews', label: 'Daily Reviews', icon: CheckCircle2 },
        { id: 'medical_reports', label: 'Medical Reports & Upload', icon: FileText },
        { id: 'ocr_review', label: 'OCR Validation', icon: ScanLine },
        { id: 'alerts', label: 'Care Alerts', icon: Bell },
      ],
    },
  ];

  const sections = isDoctor ? doctorSections : patientSections;

  return (
    <aside className="w-64 bg-white border-r border-slate-200 flex flex-col shrink-0 min-h-screen">
      {/* Brand Header */}
      <div className="p-5 border-b border-slate-100 flex items-center space-x-3">
        <div className="w-9 h-9 rounded-xl bg-emerald-700 flex items-center justify-center text-white shadow-sm shadow-emerald-700/20">
          <HeartPulse className="w-5 h-5" />
        </div>
        <div>
          <div className="font-bold text-slate-900 leading-none">Meditech</div>
          <div className="text-[11px] text-slate-400 font-medium tracking-tight mt-0.5">Workspace</div>
        </div>
      </div>

      {/* Workspace Indicator Card */}
      <div className="px-4 pt-4 pb-2">
        <div className="bg-slate-50 border border-slate-200/80 rounded-xl p-3">
          <div className="text-[10px] font-bold uppercase tracking-wider text-slate-400">Workspace</div>
          <div className="text-xs font-semibold text-slate-800 mt-0.5">
            {isDoctor ? 'Doctor Workspace' : 'Patient Workspace'}
          </div>
        </div>
      </div>

      {/* Navigation Groups */}
      <nav className="flex-1 px-3 py-3 space-y-6 overflow-y-auto">
        {sections.map((group) => (
          <div key={group.group}>
            <div className="px-3 text-[10px] font-bold tracking-wider text-slate-400 uppercase mb-2">
              {group.group}
            </div>
            <div className="space-y-1">
              {group.items.map((item) => {
                const Icon = item.icon;
                const isActive = activeSection === item.id;
                return (
                  <button
                    key={item.id}
                    onClick={() => onSelectSection(item.id)}
                    className={`w-full flex items-center space-x-3 px-3 py-2 rounded-lg text-xs font-medium transition-all ${
                      isActive
                        ? 'bg-emerald-50 text-emerald-800 font-semibold'
                        : 'text-slate-600 hover:text-slate-900 hover:bg-slate-50'
                    }`}
                  >
                    <Icon className={`w-4 h-4 ${isActive ? 'text-emerald-600' : 'text-slate-400'}`} />
                    <span>{item.label}</span>
                  </button>
                );
              })}
            </div>
          </div>
        ))}
      </nav>
    </aside>
  );
};
