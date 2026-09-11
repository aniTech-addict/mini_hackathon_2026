const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api/v1';

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
  12: 'completed',
};

export const DEMO_REVIEWS_CHART = [
  { date: '01 Sep', score: 3, pain: 8 },
  { date: '03 Sep', score: 4, pain: 7 },
  { date: '05 Sep', score: 5, pain: 6 },
  { date: '07 Sep', score: 6, pain: 5 },
  { date: '09 Sep', score: 7, pain: 4 },
  { date: '11 Sep', score: 8, pain: 3 },
];

export const DEMO_TASKS: any[] = [];

export const DEMO_ADHERENCE = {
  completion_rate: 88,
  completed_tasks: 22,
  total_tasks: 25,
  streak_days: 7,
  trend: 'improving',
  missed_tasks: 3,
};

export const DEMO_PATIENT = {
  full_name: 'Maya Patel',
  recovery_progress: 72,
  surgery_type: 'Total Knee Arthroplasty (TKA)',
  surgery_date: '2026-09-01',
};

export const DEMO_DOCTOR = {
  full_name: 'Dr. Ananya Rao',
  specialty: 'Orthopedic Surgery',
};

export const DEMO_PATIENTS_LIST: any[] = [];
export const DEMO_ALERTS: any[] = [];
export const DEMO_REPORTS: any[] = [];
export const DEMO_EXTRACTED_DATA: any = {};
export const DEMO_PATIENT_FILE: any = null;


// Generic fetcher with Authorization header directly connected to Express backend
async function request<T = any>(endpoint: string, options: RequestInit = {}): Promise<T | null> {
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
      return (json.data !== undefined ? json.data : json) as T;
    } else {
      const errJson = await res.json().catch(() => null);
      console.error(`API ${options.method || 'GET'} ${endpoint} failed (${res.status}):`, errJson);
    }
  } catch (err) {
    console.error(`Network error on ${endpoint}:`, err);
  }
  return null;
}

export const api = {
  // ─── Auth ──────────────────────────────────────────────────────────────────
  login: async (credentials: { user_id: string; password: string }) => {
    const res = await fetch(`${API_BASE_URL}/auth/login`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(credentials),
    });

    const json = await res.json();
    if (res.ok && json.data?.token) {
      localStorage.setItem('meditech_token', json.data.token);
      localStorage.setItem('meditech_user', JSON.stringify(json.data.user));
      return json.data;
    }
    throw new Error(json.message || 'Login failed');
  },

  getMe: async () => {
    return await request('/auth/me');
  },

  logout: async () => {
    localStorage.removeItem('meditech_token');
    localStorage.removeItem('meditech_user');
  },

  // ─── Patient: Profile & Doctor ─────────────────────────────────────────────
  getPatientProfile: async () => {
    return await request('/patients/me');
  },

  updatePatientProfile: async (profileData: any) => {
    return await request('/patients/me', {
      method: 'PATCH',
      body: JSON.stringify(profileData),
    });
  },

  getAssignedDoctor: async () => {
    return await request('/patients/me/doctor');
  },

  // ─── Patient: Recovery Plan ────────────────────────────────────────────────
  getRecoveryPlan: async () => {
    const data = await request('/patient/recovery-plan');
    if (data) {
      if (Array.isArray(data.tasks)) {
        data.tasks = data.tasks.map((t: any) => ({
          ...t,
          id: t.task_id || t.id,
          completed: t.completed || t.status === 'completed' || false,
        }));
      }
      return data;
    }
    return null;
  },

  getPlanProgress: async () => {
    return await request('/patient/recovery-plan/progress');
  },

  getRecoveryPlanById: async (planId: string) => {
    return await request(`/patient/recovery-plan/${planId}`);
  },

  // ─── Patient: Calendar & Tasks ─────────────────────────────────────────────
  getTodayCalendar: async () => {
    return await request('/patient/calendar/today');
  },

  getCalendarRange: async (from: string, to: string) => {
    return await request(`/patient/calendar?from=${from}&to=${to}`);
  },

  getCalendarByDate: async (date: string) => {
    return await request(`/patient/calendar/${date}`);
  },

  createCustomTask: async (taskData: any) => {
    return await request('/patient/tasks', {
      method: 'POST',
      body: JSON.stringify(taskData),
    });
  },

  completeTask: async (taskId: string, notes?: string) => {
    return await request(`/patient/tasks/${taskId}/complete`, {
      method: 'POST',
      body: JSON.stringify({ notes }),
    });
  },

  updateTaskCompletion: async (completionId: string, payload: { notes?: string; is_completed?: boolean }) => {
    return await request(`/patient/task-completions/${completionId}`, {
      method: 'PATCH',
      body: JSON.stringify(payload),
    });
  },

  getTaskCompletions: async () => {
    const data = await request('/patient/task-completions');
    return Array.isArray(data) ? data : [];
  },

  // ─── Patient: Daily Reviews ────────────────────────────────────────────────
  submitDailyReview: async (review: { scale: number; note?: string }) => {
    return await request('/patient/daily-reviews', {
      method: 'POST',
      body: JSON.stringify({
        recovery_score: review.scale,
        note: review.note,
      }),
    });
  },

  getTodayReview: async () => {
    return await request('/patient/daily-reviews/today');
  },

  getDailyReviews: async () => {
    const data = await request('/patient/daily-reviews');
    return Array.isArray(data) ? data : [];
  },

  // ─── Patient: Alerts ───────────────────────────────────────────────────────
  createPatientAlert: async (alertData: any) => {
    return await request('/patient/alerts', {
      method: 'POST',
      body: JSON.stringify(alertData),
    });
  },

  getUnreadAlerts: async () => {
    const data = await request('/patient/alerts/unread');
    return Array.isArray(data) ? data : [];
  },

  getPatientAlerts: async () => {
    const data = await request('/patient/alerts');
    return Array.isArray(data) ? data : [];
  },

  markAlertRead: async (alertId: string) => {
    return await request(`/patient/alerts/${alertId}/read`, { method: 'PATCH' });
  },

  dismissAlert: async (alertId: string) => {
    return await request(`/patient/alerts/${alertId}/dismiss`, { method: 'PATCH' });
  },

  // ─── Patient: Reports & Medical File ───────────────────────────────────────
  getPatientReports: async () => {
    const data = await request('/patient/reports');
    return Array.isArray(data) ? data : [];
  },

  getPatientReportById: async (reportId: string) => {
    return await request(`/patient/reports/${reportId}`);
  },

  getExtractedData: async (reportId: string) => {
    return await request(`/patient/reports/${reportId}/extracted-data`);
  },

  getPatientFile: async () => {
    return await request('/patient/file');
  },

  // ─── Doctor: Patients & Cases ──────────────────────────────────────────────
  getAssignedPatients: async () => {
    const data = await request('/doctor/patients');
    return Array.isArray(data) ? data : [];
  },

  getDoctorPatientById: async (patientId: string) => {
    return await request(`/doctor/patients/${patientId}`);
  },

  getDoctorPatientFile: async (patientId: string) => {
    return await request(`/doctor/patients/${patientId}/file`);
  },

  // ─── Doctor: Reports & OCR ─────────────────────────────────────────────────
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
    const json = await res.json();
    return json.data !== undefined ? json.data : json;
  },

  getDoctorPatientReports: async (patientId: string) => {
    const data = await request(`/doctor/patients/${patientId}/reports`);
    return Array.isArray(data) ? data : [];
  },

  getDoctorReportById: async (reportId: string) => {
    return await request(`/doctor/reports/${reportId}`);
  },

  getReportStatus: async (reportId: string) => {
    return await request(`/doctor/reports/${reportId}/status`);
  },

  processReport: async (reportId: string) => {
    return await request(`/doctor/reports/${reportId}/process`, { method: 'POST' });
  },

  getDoctorExtractedData: async (reportId: string) => {
    return await request(`/doctor/reports/${reportId}/extracted-data`);
  },

  updateDoctorExtractedData: async (reportId: string, extractedData: any) => {
    return await request(`/doctor/reports/${reportId}/extracted-data`, {
      method: 'PATCH',
      body: JSON.stringify(extractedData),
    });
  },

  // ─── Doctor: Recovery Plans ────────────────────────────────────────────────
  generateRecoveryPlan: async (patientId: string, payload?: any) => {
    return await request(`/doctor/patients/${patientId}/recovery-plans/generate`, {
      method: 'POST',
      body: JSON.stringify(payload || {}),
    });
  },

  getDoctorPatientRecoveryPlans: async (patientId: string) => {
    const data = await request(`/doctor/patients/${patientId}/recovery-plans`);
    return Array.isArray(data) ? data : [];
  },

  getDoctorRecoveryPlanById: async (planId: string) => {
    return await request(`/doctor/recovery-plans/${planId}`);
  },

  updateRecoveryPlan: async (planId: string, updates: any) => {
    return await request(`/doctor/recovery-plans/${planId}`, {
      method: 'PATCH',
      body: JSON.stringify(updates),
    });
  },

  approveRecoveryPlan: async (planId: string) => {
    return await request(`/doctor/recovery-plans/${planId}/approve`, { method: 'POST' });
  },

  cancelRecoveryPlan: async (planId: string) => {
    return await request(`/doctor/recovery-plans/${planId}/cancel`, { method: 'POST' });
  },

  // ─── Doctor: Plan Tasks ────────────────────────────────────────────────────
  createPlanTask: async (planId: string, taskData: any) => {
    return await request(`/doctor/recovery-plans/${planId}/tasks`, {
      method: 'POST',
      body: JSON.stringify(taskData),
    });
  },

  getPlanTasks: async (planId: string) => {
    const data = await request(`/doctor/recovery-plans/${planId}/tasks`);
    return Array.isArray(data) ? data : [];
  },

  updateTask: async (taskId: string, updates: any) => {
    return await request(`/doctor/tasks/${taskId}`, {
      method: 'PATCH',
      body: JSON.stringify(updates),
    });
  },

  deleteTask: async (taskId: string) => {
    return await request(`/doctor/tasks/${taskId}`, { method: 'DELETE' });
  },

  // ─── Doctor: Adherence & Reviews ───────────────────────────────────────────
  getPatientTaskCompletions: async (patientId: string) => {
    const data = await request(`/doctor/patients/${patientId}/task-completions`);
    return Array.isArray(data) ? data : [];
  },

  getPatientAdherence: async (patientId: string) => {
    return await request(`/doctor/patients/${patientId}/adherence`);
  },

  getLatestDailyReview: async (patientId: string) => {
    return await request(`/doctor/patients/${patientId}/daily-reviews/latest`);
  },

  getPatientDailyReviews: async (patientId: string) => {
    const data = await request(`/doctor/patients/${patientId}/daily-reviews`);
    return Array.isArray(data) ? data : [];
  },

  // ─── Doctor: Alerts ────────────────────────────────────────────────────────
  getDoctorAlerts: async () => {
    const data = await request('/doctor/alerts');
    return Array.isArray(data) ? data : [];
  },

  getDoctorUnreadAlerts: async () => {
    const data = await request('/doctor/alerts/unread');
    return Array.isArray(data) ? data : [];
  },

  markDoctorAlertRead: async (alertId: string) => {
    return await request(`/doctor/alerts/${alertId}/read`, { method: 'PATCH' });
  },

  resolveDoctorAlert: async (alertId: string) => {
    return await request(`/doctor/alerts/${alertId}/resolve`, { method: 'PATCH' });
  },
};
