import { useState } from 'react';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { Navigation } from './components/Navigation';
import { Sidebar } from './components/Sidebar';
import { PatientDashboard } from './components/PatientDashboard';
import { DoctorDashboard } from './components/DoctorDashboard';
import { AuthScreen } from './components/AuthScreen';

// Patient Screens
import { CurrentCaseScreen } from './components/screens/CurrentCaseScreen';
import { FullCalendarScreen } from './components/screens/FullCalendarScreen';
import { DailyCheckinScreen } from './components/screens/DailyCheckinScreen';
import { MedicalFileScreen } from './components/screens/MedicalFileScreen';
import { MyReportsScreen } from './components/screens/MyReportsScreen';
import { OcrResultsScreen } from './components/screens/OcrResultsScreen';
import { PatientAlertsScreen } from './components/screens/PatientAlertsScreen';
import { CaseHistoryScreen } from './components/screens/CaseHistoryScreen';
import { DownloadSummaryScreen } from './components/screens/DownloadSummaryScreen';

// Doctor Screens
import { PatientsDirectoryScreen } from './components/screens/PatientsDirectoryScreen';
import { RecoveryPlansManagerScreen } from './components/screens/RecoveryPlansManagerScreen';
import { TrackingCalendarScreen } from './components/screens/TrackingCalendarScreen';
import { DailyReviewsFeedScreen } from './components/screens/DailyReviewsFeedScreen';
import { DoctorReportsScreen } from './components/screens/DoctorReportsScreen';
import { OcrReviewScreen } from './components/screens/OcrReviewScreen';
import { AnalyticsScreen } from './components/screens/AnalyticsScreen';
import { DoctorAlertsScreen } from './components/screens/DoctorAlertsScreen';
import { CompletedCasesScreen } from './components/screens/CompletedCasesScreen';
import { DoctorDownloadScreen } from './components/screens/DoctorDownloadScreen';

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      refetchOnWindowFocus: false,
      staleTime: 1000 * 60 * 5, // 5 minutes
    },
  },
});

export function MainApp() {
  const [role, setRole] = useState<'patient' | 'doctor'>('doctor');
  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(false);
  const [activeSection, setActiveSection] = useState<string>('dashboard');

  const handleLogin = (selectedRole: 'patient' | 'doctor', _user?: any) => {
    setRole(selectedRole);
    setActiveSection('dashboard');
    setIsAuthenticated(true);
  };

  const handleLogout = () => {
    setIsAuthenticated(false);
    setActiveSection('dashboard');
  };

  if (!isAuthenticated) {
    return <AuthScreen onLogin={handleLogin} />;
  }

  const renderContent = () => {
    if (role === 'patient') {
      switch (activeSection) {
        case 'dashboard':
          return <PatientDashboard />;
        case 'current_case':
          return <CurrentCaseScreen />;
        case 'recovery_calendar':
          return <FullCalendarScreen />;
        case 'daily_checkin':
          return <DailyCheckinScreen />;
        case 'medical_file':
          return <MedicalFileScreen />;
        case 'my_reports':
          return <MyReportsScreen onViewOcr={() => setActiveSection('ocr_results')} />;
        case 'ocr_results':
          return <OcrResultsScreen onBack={() => setActiveSection('my_reports')} />;
        case 'alerts':
          return <PatientAlertsScreen />;
        case 'case_history':
          return <CaseHistoryScreen />;
        case 'download_summary':
          return <DownloadSummaryScreen />;
        default:
          return <PatientDashboard />;
      }
    } else {
      switch (activeSection) {
        case 'dashboard':
          return <DoctorDashboard />;
        case 'active_cases':
        case 'patients':
          return <PatientsDirectoryScreen />;
        case 'recovery_plans':
          return <RecoveryPlansManagerScreen />;
        case 'tracking_calendar':
          return <TrackingCalendarScreen />;
        case 'daily_reviews':
          return <DailyReviewsFeedScreen />;
        case 'medical_reports':
          return <DoctorReportsScreen onReviewOcr={() => setActiveSection('ocr_review')} />;
        case 'ocr_review':
          return <OcrReviewScreen onBack={() => setActiveSection('medical_reports')} />;
        case 'analytics':
          return <AnalyticsScreen />;
        case 'alerts':
          return <DoctorAlertsScreen />;
        case 'completed_cases':
          return <CompletedCasesScreen />;
        case 'download_reports':
          return <DoctorDownloadScreen />;
        default:
          return <DoctorDashboard />;
      }
    }
  };

  return (
    <div className="min-h-screen bg-[#f8fafc] flex">
      {/* Left Sidebar */}
      <Sidebar
        role={role}
        activeSection={activeSection}
        onSelectSection={setActiveSection}
      />

      {/* Main Content Area */}
      <div className="flex-1 flex flex-col min-w-0">
        <Navigation
          role={role}
          activeSection={activeSection}
          onLogout={handleLogout}
        />

        <main className="flex-1 p-6 max-w-7xl w-full mx-auto">
          {renderContent()}
        </main>
      </div>
    </div>
  );
}

export default function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <MainApp />
    </QueryClientProvider>
  );
}
