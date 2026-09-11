import { useState } from 'react';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { Navigation } from './components/Navigation';
import { Sidebar } from './components/Sidebar';
import { PatientDashboard } from './components/PatientDashboard';
import { DoctorDashboard } from './components/DoctorDashboard';
import { AuthScreen } from './components/AuthScreen';
import { api } from './lib/api';

// Patient Screens
import { CurrentCaseScreen } from './components/screens/CurrentCaseScreen';
import { FullCalendarScreen } from './components/screens/FullCalendarScreen';
import { DailyCheckinScreen } from './components/screens/DailyCheckinScreen';
import { MedicalFileScreen } from './components/screens/MedicalFileScreen';
import { MyReportsScreen } from './components/screens/MyReportsScreen';
import { OcrResultsScreen } from './components/screens/OcrResultsScreen';
import { PatientAlertsScreen } from './components/screens/PatientAlertsScreen';

// Doctor Screens
import { PatientsDirectoryScreen } from './components/screens/PatientsDirectoryScreen';
import { RecoveryPlansManagerScreen } from './components/screens/RecoveryPlansManagerScreen';
import { TrackingCalendarScreen } from './components/screens/TrackingCalendarScreen';
import { DailyReviewsFeedScreen } from './components/screens/DailyReviewsFeedScreen';
import { DoctorReportsScreen } from './components/screens/DoctorReportsScreen';
import { OcrReviewScreen } from './components/screens/OcrReviewScreen';
import { DoctorAlertsScreen } from './components/screens/DoctorAlertsScreen';

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      refetchOnWindowFocus: false,
      staleTime: 1000 * 60 * 5, // 5 minutes
    },
  },
});

export function MainApp() {
  const [role, setRole] = useState<'patient' | 'doctor'>(() => {
    const stored = localStorage.getItem('meditech_user');
    if (stored) {
      try {
        const u = JSON.parse(stored);
        return u.role === 'patient' ? 'patient' : 'doctor';
      } catch {
        // fallback
      }
    }
    return 'doctor';
  });
  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(() => {
    return !!localStorage.getItem('meditech_token');
  });
  const [activeSection, setActiveSection] = useState<string>('dashboard');
  const [selectedReportId, setSelectedReportId] = useState<string>('rep-seed-1');

  const handleLogin = (selectedRole: 'patient' | 'doctor', _user?: any) => {
    setRole(selectedRole);
    setActiveSection('dashboard');
    setIsAuthenticated(true);
    queryClient.clear();
  };

  const handleLogout = () => {
    api.logout();
    setIsAuthenticated(false);
    setActiveSection('dashboard');
    queryClient.clear();
  };

  const handleSwitchRole = (newRole: 'patient' | 'doctor') => {
    setRole(newRole);
    setActiveSection('dashboard');
    setSelectedReportId('rep-seed-1');
    const storedUser =
      newRole === 'doctor'
        ? { user_id: 'doctor.ananya', role: 'doctor' }
        : { user_id: 'patient.rahul', role: 'patient' };
    localStorage.setItem('meditech_user', JSON.stringify(storedUser));
    queryClient.clear();
  };

  if (!isAuthenticated) {
    return <AuthScreen onLogin={handleLogin} />;
  }

  const renderContent = () => {
    if (role === 'patient') {
      switch (activeSection) {
        case 'dashboard':
          return <PatientDashboard onNavigate={setActiveSection} />;
        case 'current_case':
          return <CurrentCaseScreen />;
        case 'recovery_calendar':
          return <FullCalendarScreen />;
        case 'daily_checkin':
          return <DailyCheckinScreen />;
        case 'medical_file':
          return <MedicalFileScreen />;
        case 'my_reports':
          return (
            <MyReportsScreen
              onViewOcr={(reportId) => {
                setSelectedReportId(reportId);
                setActiveSection('ocr_results');
              }}
            />
          );
        case 'ocr_results':
          return (
            <OcrResultsScreen
              reportId={selectedReportId}
              onBack={() => setActiveSection('my_reports')}
            />
          );
        case 'alerts':
          return <PatientAlertsScreen />;
        default:
          return <PatientDashboard onNavigate={setActiveSection} />;
      }
    } else {
      switch (activeSection) {
        case 'dashboard':
          return <DoctorDashboard onNavigate={setActiveSection} />;
        case 'patients':
          return <PatientsDirectoryScreen />;
        case 'recovery_plans':
          return <RecoveryPlansManagerScreen />;
        case 'tracking_calendar':
          return <TrackingCalendarScreen />;
        case 'daily_reviews':
          return <DailyReviewsFeedScreen />;
        case 'medical_reports':
          return (
            <DoctorReportsScreen
              onReviewOcr={(reportId) => {
                setSelectedReportId(reportId);
                setActiveSection('ocr_review');
              }}
            />
          );
        case 'ocr_review':
          return (
            <OcrReviewScreen
              reportId={selectedReportId}
              onBack={() => setActiveSection('medical_reports')}
            />
          );
        case 'alerts':
          return <DoctorAlertsScreen />;
        default:
          return <DoctorDashboard onNavigate={setActiveSection} />;
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
          onSwitchRole={handleSwitchRole}
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
