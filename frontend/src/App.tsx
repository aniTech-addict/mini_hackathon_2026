import { useState } from 'react';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { Navigation } from './components/Navigation';
import { Sidebar } from './components/Sidebar';
import { PatientDashboard } from './components/PatientDashboard';
import { DoctorDashboard } from './components/DoctorDashboard';
import { AuthScreen } from './components/AuthScreen';

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      refetchOnWindowFocus: false,
      staleTime: 1000 * 60 * 5, // 5 minutes
    },
  },
});

export function MainApp() {
  const [role, setRole] = useState<'patient' | 'doctor'>('patient');
  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(true);
  const [activeSection, setActiveSection] = useState<string>('dashboard');

  const handleLogin = (selectedRole: 'patient' | 'doctor') => {
    setRole(selectedRole);
    setIsAuthenticated(true);
  };

  const handleLogout = () => {
    setIsAuthenticated(false);
  };

  const handleSwitchRole = (newRole: 'patient' | 'doctor') => {
    setRole(newRole);
  };

  if (!isAuthenticated) {
    return <AuthScreen onLogin={handleLogin} />;
  }

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
          onSwitchRole={handleSwitchRole}
          onLogout={handleLogout}
        />

        <main className="flex-1 p-6 max-w-7xl w-full mx-auto">
          {role === 'patient' ? <PatientDashboard /> : <DoctorDashboard />}
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
