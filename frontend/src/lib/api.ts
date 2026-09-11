const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api/v1';

// Seed mock data for resilient demo states & instant loading
export const DEMO_PATIENT = {
  id: 'pat-maya-1',
  user_id: 'maya.patel',
  name: 'Maya Patel',
  role: 'patient',
  age: 29,
  sex: 'female',
  email: 'maya.patel@meditech.care',
  phone_number: '+1 (555) 234-5678',
  doctor_name: 'Dr. Ananya Rao',
  doctor_dept: 'Orthopaedic Recovery',
};

export const DEMO_DOCTOR = {
  id: 'doc-ananya-1',
  user_id: 'doctor.demo',
  name: 'Dr. Ananya Rao',
  role: 'doctor',
  department: 'Orthopaedic Recovery',
  active_cases: 4,
};

export const DEMO_PATIENTS_LIST = [
  {
    patient_id: 'p-1',
    name: 'Maya Patel',
    age: 29,
    plan_name: 'Post-operative knee recovery',
    progress: 43,
    last_review: 'Today',
    status: 'on_track',
  },
  {
    patient_id: 'p-2',
    name: 'Arjun Mehta',
    age: 46,
    plan_name: 'Lower back rehabilitation',
    progress: 68,
    last_review: 'Yesterday',
    status: 'needs_review',
  },
  {
    patient_id: 'p-3',
    name: 'Sara Khan',
    age: 35,
    plan_name: 'Shoulder mobility program',
    progress: 25,
    last_review: '10 Sep 2026',
    status: 'on_track',
  },
  {
    patient_id: 'p-4',
    name: 'Vivek Shah',
    age: 58,
    plan_name: 'Cardiac recovery support',
    progress: 81,
    last_review: '09 Sep 2026',
    status: 'on_track',
  },
];

export const DEMO_TASKS = [
  {
    id: 't-1',
    title: 'Complete knee mobility exercises',
    category: 'EXERCISE',
    schedule_times: ['08:00 AM'],
    frequency: 'DAILY',
    is_required: true,
    start_day: 1,
    end_day: 28,
    completed: true,
  },
  {
    id: 't-2',
    title: 'Take prescribed medication',
    category: 'MEDICATION',
    schedule_times: ['01:00 PM'],
    frequency: 'DAILY',
    is_required: true,
    start_day: 1,
    end_day: 14,
    completed: false,
  },
  {
    id: 't-3',
    title: 'Walk for 15 minutes',
    category: 'ACTIVITY',
    schedule_times: ['05:00 PM'],
    frequency: 'DAILY',
    is_required: true,
    start_day: 3,
    end_day: 28,
    completed: false,
  },
  {
    id: 't-4',
    title: 'Record pain and mobility review',
    category: 'CHECK_IN',
    schedule_times: ['06:00 PM'],
    frequency: 'DAILY',
    is_required: true,
    start_day: 1,
    end_day: 28,
    completed: false,
  },
];

export const DEMO_ALERTS = [
  {
    id: 'alt-1',
    type: 'review_prompt',
    severity: 'medium' as const,
    title: 'Review due today',
    message: 'Share your recovery progress with Dr. Rao.',
    created_at: '2026-09-11T12:00:00Z',
    is_read: false,
    status: 'active' as const,
  },
  {
    id: 'alt-2',
    type: 'clinical_alert',
    severity: 'critical' as const,
    title: 'Review overdue',
    message: 'Arjun Mehta has not submitted a daily review for 2 days.',
    patient_name: 'Arjun Mehta',
    created_at: '2026-09-10T18:30:00Z',
    is_read: false,
    status: 'active' as const,
  },
];

export const DEMO_REVIEWS_CHART = [
  { date: '01 Sep', score: 3, pain: 8 },
  { date: '03 Sep', score: 4, pain: 7 },
  { date: '05 Sep', score: 5, pain: 6 },
  { date: '07 Sep', score: 6, pain: 5 },
  { date: '09 Sep', score: 7, pain: 4 },
  { date: '11 Sep', score: 8, pain: 3 },
];

export const DEMO_CALENDAR_STATUS: Record<number, 'completed' | 'partial' | 'no_update'> = {
  1: 'completed',
  2: 'completed',
  3: 'completed',
  4: 'completed',
  5: 'completed',
  6: 'partial',
  7: 'completed',
  8: 'completed',
  9: 'partial',
  10: 'completed',
  11: 'completed',
};

// Generic fetcher with Authorization header & demo fallback
async function request(endpoint: string, options: RequestInit = {}) {
  const token = localStorage.getItem('meditech_token');
  const headers: Record<string, string> = {
    'Content-Type': 'application/json',
    ...(options.headers as Record<string, string>),
  };

  if (token) {
    headers['Authorization'] = `Bearer ${token}`;
  }

  try {
    const res = await fetch(`${API_BASE_URL}${endpoint}`, {
      ...options,
      headers,
    });

    if (res.ok) {
      const json = await res.json();
      return json.data || json;
    }
  } catch (err) {
    // Network / offline fallback to keep demo 100% interactive
    console.warn(`API call failed for ${endpoint}, utilizing demo fallback.`, err);
  }
  return null;
}

export const api = {
  // Auth
  login: async (credentials: { user_id: string; password: string }) => {
    const data = await request('/auth/login', {
      method: 'POST',
      body: JSON.stringify(credentials),
    });
    return data || { token: 'mock-jwt-token', user: credentials.user_id.includes('doctor') ? DEMO_DOCTOR : DEMO_PATIENT };
  },

  getMe: async () => {
    const data = await request('/auth/me');
    return data;
  },

  // Patient
  getPatientProfile: async () => {
    const data = await request('/patients/me');
    return data || DEMO_PATIENT;
  },

  getAssignedDoctor: async () => {
    const data = await request('/patients/me/doctor');
    return data || DEMO_DOCTOR;
  },

  getRecoveryPlan: async () => {
    const data = await request('/patient/recovery-plan');
    return data || {
      id: 'plan-1',
      title: 'Post-operative knee recovery',
      status: 'active',
      start_date: '2026-08-30',
      days_elapsed: 12,
      total_days: 28,
      progress_pct: 43,
      tasks: DEMO_TASKS,
    };
  },

  getPlanProgress: async () => {
    const data = await request('/patient/recovery-plan/progress');
    return data || {
      days_elapsed: 12,
      total_days: 28,
      completed_tasks: 1,
      total_tasks: 4,
    };
  },

  getTodayCalendar: async () => {
    const data = await request('/patient/calendar/today');
    return data || {
      date: '2026-09-11',
      day_number: 12,
      tasks: DEMO_TASKS,
    };
  },

  completeTask: async (taskId: string, notes?: string) => {
    return await request(`/patient/tasks/${taskId}/complete`, {
      method: 'POST',
      body: JSON.stringify({ notes }),
    });
  },

  submitDailyReview: async (review: { scale: number; note?: string }) => {
    return await request('/patient/daily-reviews', {
      method: 'POST',
      body: JSON.stringify({
        recovery_score: review.scale,
        note: review.note,
      }),
    });
  },

  getPatientAlerts: async () => {
    const data = await request('/patient/alerts');
    return data || DEMO_ALERTS;
  },

  dismissAlert: async (alertId: string) => {
    return await request(`/patient/alerts/${alertId}/dismiss`, { method: 'PATCH' });
  },

  // Doctor
  getAssignedPatients: async () => {
    const data = await request('/doctor/patients');
    return data || DEMO_PATIENTS_LIST;
  },

  getDoctorAlerts: async () => {
    const data = await request('/doctor/alerts');
    return data || DEMO_ALERTS;
  },

  resolveDoctorAlert: async (alertId: string) => {
    return await request(`/doctor/alerts/${alertId}/resolve`, { method: 'PATCH' });
  },

  uploadReport: async (patientId: string, file: File, reportType = 'discharge_summary') => {
    const formData = new FormData();
    formData.append('file', file);
    formData.append('report_type', reportType);

    const token = localStorage.getItem('meditech_token');
    const res = await fetch(`${API_BASE_URL}/doctor/patients/${patientId}/reports`, {
      method: 'POST',
      headers: token ? { Authorization: `Bearer ${token}` } : {},
      body: formData,
    });
    return await res.json();
  },

  processReport: async (reportId: string) => {
    return await request(`/doctor/reports/${reportId}/process`, { method: 'POST' });
  },
};
