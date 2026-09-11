const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api/v1';

// Seed mock data for resilient demo states & instant loading
export const DEMO_PATIENT = {
  id: 'pat-maya-1',
  user_id: 'maya.patel',
  name: 'Maya Patel',
  role: 'patient',
  age: 29,
  sex: 'female',
  date_of_birth: '1997-04-12',
  blood_group: 'B+',
  allergies: ['Penicillin', 'Sulfa drugs'],
  medical_history: 'ACL reconstruction surgery (Left Knee), Meniscal repair',
  emergency_contact: 'Suresh Patel (Father) - +1 (555) 902-3344',
  email: 'maya.patel@meditech.care',
  phone_number: '+1 (555) 234-5678',
  doctor_name: 'Dr. Ananya Rao',
  doctor_dept: 'Orthopaedic Recovery',
  surgery_date: '2026-08-30',
  hospital: 'St. Jude Orthopaedic Medical Centre',
};

export const DEMO_DOCTOR = {
  id: 'doc-ananya-1',
  user_id: 'doctor.demo',
  name: 'Dr. Ananya Rao',
  role: 'doctor',
  department: 'Orthopaedic Recovery',
  hospital: 'St. Jude Orthopaedic Medical Centre',
  license_number: 'MD-MED-84920',
  active_cases: 4,
};

export const DEMO_PATIENTS_LIST = [
  {
    patient_id: 'p-1',
    name: 'Maya Patel',
    age: 29,
    sex: 'female',
    plan_name: 'Post-operative knee recovery',
    progress: 43,
    last_review: 'Today',
    status: 'on_track',
    surgery_date: '2026-08-30',
    surgery_type: 'ACL Reconstruction (Left Knee)',
  },
  {
    patient_id: 'p-2',
    name: 'Arjun Mehta',
    age: 46,
    sex: 'male',
    plan_name: 'Lower back rehabilitation',
    progress: 68,
    last_review: 'Yesterday',
    status: 'needs_review',
    surgery_date: '2026-08-20',
    surgery_type: 'Lumbar Microdiscectomy (L4-L5)',
  },
  {
    patient_id: 'p-3',
    name: 'Sara Khan',
    age: 35,
    sex: 'female',
    plan_name: 'Shoulder mobility program',
    progress: 25,
    last_review: '10 Sep 2026',
    status: 'on_track',
    surgery_date: '2026-09-02',
    surgery_type: 'Rotator Cuff Arthroscopic Repair',
  },
  {
    patient_id: 'p-4',
    name: 'Vivek Shah',
    age: 58,
    sex: 'male',
    plan_name: 'Cardiac recovery support',
    progress: 81,
    last_review: '09 Sep 2026',
    status: 'on_track',
    surgery_date: '2026-08-10',
    surgery_type: 'Coronary Artery Bypass Graft (CABG)',
  },
];

export const DEMO_TASKS = [
  {
    id: 't-1',
    title: 'Complete knee mobility exercises',
    description: 'Perform 3 sets of 10 quad sets and ankle pumps with leg elevated.',
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
    description: 'Celecoxib 200mg with water after food; apply ice pack for 20 mins.',
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
    description: 'Use crutches with 50% partial weight bearing on flat surfaces.',
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
    description: 'Submit daily rating (0-10) and document any knee swelling or stiffness.',
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
    message: 'Share your recovery progress with Dr. Rao to keep your recovery plan calibrated.',
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
  {
    id: 'alt-3',
    type: 'medication_refill',
    severity: 'low' as const,
    title: 'Prescription renewal due',
    message: 'Anti-inflammatory course ends in 3 days. Dr. Rao has prepared the refill prescription.',
    created_at: '2026-09-09T09:15:00Z',
    is_read: true,
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
  12: 'partial',
};

export const DEMO_REPORTS = [
  {
    id: 'rep-01',
    patient_id: 'p-1',
    report_type: 'discharge_summary',
    file_name: 'Discharge_Summary_Maya_Patel_ACL.pdf',
    file_url: '/uploads/Discharge_Summary_Maya_Patel_ACL.pdf',
    uploaded_at: '2026-08-31T10:30:00Z',
    ocr_status: 'COMPLETED',
    processed_at: '2026-08-31T10:32:00Z',
  },
  {
    id: 'rep-02',
    patient_id: 'p-1',
    report_type: 'mri_scan',
    file_name: 'Post_Op_MRI_Knee_Check.pdf',
    file_url: '/uploads/Post_Op_MRI_Knee_Check.pdf',
    uploaded_at: '2026-09-07T14:15:00Z',
    ocr_status: 'COMPLETED',
    processed_at: '2026-09-07T14:16:30Z',
  },
  {
    id: 'rep-03',
    patient_id: 'p-2',
    report_type: 'lab_report',
    file_name: 'Blood_Panel_Inflammation_Markers.pdf',
    file_url: '/uploads/Blood_Panel_Inflammation_Markers.pdf',
    uploaded_at: '2026-09-09T08:00:00Z',
    ocr_status: 'PENDING',
    processed_at: null,
  },
];

export const DEMO_EXTRACTED_DATA = {
  report_id: 'rep-01',
  procedure: {
    name: 'Arthroscopic Anterior Cruciate Ligament (ACL) Reconstruction with Hamstring Autograft',
    date: '2026-08-30',
    surgeon: 'Dr. Ananya Rao, MS Ortho',
    anesthesia: 'General Anesthesia with Femoral Nerve Block',
  },
  medications: [
    { name: 'Celecoxib', dosage: '200 mg', frequency: 'Once daily after breakfast', duration: '14 days' },
    { name: 'Acetaminophen', dosage: '500 mg', frequency: 'Every 6 hours as needed for breakthrough pain', duration: '7 days' },
    { name: 'Enoxaparin', dosage: '40 mg SC', frequency: 'Once daily for DVT prophylaxis', duration: '10 days' },
  ],
  exercises: [
    { title: 'Passive Knee Extension', frequency: '4 times daily', description: 'Rest heel on towel roll for 10 minutes.' },
    { title: 'Quad Sets & Patellar Mobilization', frequency: '3 sets of 10 reps twice daily', description: 'Tighten thigh muscle without bending knee.' },
    { title: 'Straight Leg Raises (in brace)', frequency: '3 sets of 10 reps once daily', description: 'Lift leg 12 inches off floor keeping knee locked.' },
  ],
  precautions: [
    'Strict partial weight bearing with crutches for first 2 weeks',
    'Keep surgical dressing clean and dry until first follow-up',
    'Do not submerge knee in water or bathtub',
    'Wear hinged knee brace locked in 0° extension while ambulating or sleeping',
  ],
  warning_signs: [
    'Calf pain, swelling, or localized tenderness (suspected DVT)',
    'Fever above 101°F (38.3°C) or persistent chills',
    'Spreading erythema (redness) or foul-smelling drainage from incisions',
    'Uncontrolled severe pain not relieved by prescribed analgesics',
  ],
};

export const DEMO_PATIENT_FILE = {
  patient: DEMO_PATIENT,
  active_plan: {
    id: 'plan-1',
    title: 'Post-operative knee recovery',
    status: 'active',
    start_date: '2026-08-30',
    days_elapsed: 12,
    total_days: 28,
    progress_pct: 43,
  },
  doctor: DEMO_DOCTOR,
  reports_count: 2,
  completed_tasks_count: 36,
  average_recovery_score: 7.2,
  average_pain_level: 3.8,
  alerts_count: 1,
};

export const DEMO_ADHERENCE = {
  patient_id: 'p-1',
  overall_adherence_pct: 88,
  total_assigned_tasks: 48,
  total_completed_tasks: 42,
  missed_tasks: 6,
  breakdown: {
    medication: 96,
    exercise: 84,
    activity: 80,
    check_in: 92,
  },
  weekly_trend: [
    { week: 'Week 1', rate: 92 },
    { week: 'Week 2', rate: 85 },
  ],
};

// Generic fetcher with Authorization header & demo fallback
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
    }
  } catch (err) {
    console.warn(`API call failed for ${endpoint}, utilizing demo fallback.`, err);
  }
  return null;
}

export const api = {
  // ─── Auth ──────────────────────────────────────────────────────────────────
  login: async (credentials: { user_id: string; password: string }) => {
    const data = await request<{ token: string; user: any }>('/auth/login', {
      method: 'POST',
      body: JSON.stringify(credentials),
    });
    if (data?.token) {
      localStorage.setItem('meditech_token', data.token);
      return data;
    }
    const mockToken = 'mock-jwt-token-production-seed';
    localStorage.setItem('meditech_token', mockToken);
    return {
      token: mockToken,
      user: credentials.user_id.includes('doctor') ? DEMO_DOCTOR : DEMO_PATIENT,
    };
  },

  getMe: async () => {
    const data = await request('/auth/me');
    return data;
  },

  logout: async () => {
    localStorage.removeItem('meditech_token');
  },

  // ─── Patient: Profile & Doctor ─────────────────────────────────────────────
  getPatientProfile: async () => {
    const data = await request('/patients/me');
    return data || DEMO_PATIENT;
  },

  updatePatientProfile: async (profileData: Partial<typeof DEMO_PATIENT>) => {
    const data = await request('/patients/me', {
      method: 'PATCH',
      body: JSON.stringify(profileData),
    });
    return data || { ...DEMO_PATIENT, ...profileData };
  },

  getAssignedDoctor: async () => {
    const data = await request('/patients/me/doctor');
    return data || DEMO_DOCTOR;
  },

  // ─── Patient: Recovery Plan ────────────────────────────────────────────────
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
      compliance_rate: 88,
    };
  },

  getRecoveryPlanById: async (planId: string) => {
    const data = await request(`/patient/recovery-plan/${planId}`);
    return data || {
      id: planId,
      title: 'Post-operative knee recovery',
      status: 'active',
      start_date: '2026-08-30',
      days_elapsed: 12,
      total_days: 28,
      progress_pct: 43,
      tasks: DEMO_TASKS,
    };
  },

  // ─── Patient: Calendar & Tasks ─────────────────────────────────────────────
  getTodayCalendar: async () => {
    const data = await request('/patient/calendar/today');
    return data || {
      date: '2026-09-11',
      day_number: 12,
      tasks: DEMO_TASKS,
    };
  },

  getCalendarRange: async (from: string, to: string) => {
    const data = await request(`/patient/calendar?from=${from}&to=${to}`);
    return data || {
      range: { from, to },
      days: Array.from({ length: 30 }, (_, i) => ({
        day: i + 1,
        date: `2026-09-${String(i + 1).padStart(2, '0')}`,
        status: DEMO_CALENDAR_STATUS[i + 1] || 'no_update',
        tasks_count: 4,
        completed_count: (DEMO_CALENDAR_STATUS[i + 1] === 'completed' ? 4 : DEMO_CALENDAR_STATUS[i + 1] === 'partial' ? 2 : 0),
      })),
    };
  },

  getCalendarByDate: async (date: string) => {
    const data = await request(`/patient/calendar/${date}`);
    return data || {
      date,
      day_number: 12,
      tasks: DEMO_TASKS,
    };
  },

  createCustomTask: async (taskData: any) => {
    const data = await request('/patient/tasks', {
      method: 'POST',
      body: JSON.stringify(taskData),
    });
    return data || { id: `task-${Date.now()}`, ...taskData, completed: false };
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
    return data || [];
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
    const data = await request('/patient/daily-reviews/today');
    return data || {
      recovery_score: 8,
      note: 'Swelling noticeably lower today; walked 15 mins with single crutch.',
      created_at: '2026-09-11T10:00:00Z',
    };
  },

  getDailyReviews: async () => {
    const data = await request('/patient/daily-reviews');
    return data || DEMO_REVIEWS_CHART;
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
    return data || DEMO_ALERTS.filter(a => !a.is_read);
  },

  getPatientAlerts: async () => {
    const data = await request('/patient/alerts');
    return data || DEMO_ALERTS;
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
    return data || DEMO_REPORTS;
  },

  getPatientReportById: async (reportId: string) => {
    const data = await request(`/patient/reports/${reportId}`);
    return data || DEMO_REPORTS.find(r => r.id === reportId) || DEMO_REPORTS[0];
  },

  getExtractedData: async (reportId: string) => {
    const data = await request(`/patient/reports/${reportId}/extracted-data`);
    return data || DEMO_EXTRACTED_DATA;
  },

  getPatientFile: async () => {
    const data = await request('/patient/file');
    return data || DEMO_PATIENT_FILE;
  },

  // ─── Doctor: Patients & Cases ──────────────────────────────────────────────
  getAssignedPatients: async () => {
    const data = await request('/doctor/patients');
    return data || DEMO_PATIENTS_LIST;
  },

  getDoctorPatientById: async (patientId: string) => {
    const data = await request(`/doctor/patients/${patientId}`);
    return data || DEMO_PATIENTS_LIST.find(p => p.patient_id === patientId) || DEMO_PATIENTS_LIST[0];
  },

  getDoctorPatientFile: async (patientId: string) => {
    const data = await request(`/doctor/patients/${patientId}/file`);
    return data || DEMO_PATIENT_FILE;
  },

  // ─── Doctor: Reports & OCR ─────────────────────────────────────────────────
  uploadReport: async (patientId: string, file: File, reportType = 'discharge_summary') => {
    const formData = new FormData();
    formData.append('file', file);
    formData.append('report_type', reportType);

    const token = localStorage.getItem('meditech_token');
    try {
      const res = await fetch(`${API_BASE_URL}/doctor/patients/${patientId}/reports`, {
        method: 'POST',
        headers: token ? { Authorization: `Bearer ${token}` } : {},
        body: formData,
      });
      if (res.ok) {
        const json = await res.json();
        return json.data || json;
      }
    } catch (e) {
      console.warn('Upload fallback', e);
    }
    return {
      id: `rep-${Date.now()}`,
      patient_id: patientId,
      report_type: reportType,
      file_name: file.name,
      ocr_status: 'PENDING',
      uploaded_at: new Date().toISOString(),
    };
  },

  getDoctorPatientReports: async (patientId: string) => {
    const data = await request(`/doctor/patients/${patientId}/reports`);
    return data || DEMO_REPORTS;
  },

  getDoctorReportById: async (reportId: string) => {
    const data = await request(`/doctor/reports/${reportId}`);
    return data || DEMO_REPORTS.find(r => r.id === reportId) || DEMO_REPORTS[0];
  },

  getReportStatus: async (reportId: string) => {
    const data = await request(`/doctor/reports/${reportId}/status`);
    return data || { report_id: reportId, ocr_status: 'COMPLETED' };
  },

  processReport: async (reportId: string) => {
    const data = await request(`/doctor/reports/${reportId}/process`, { method: 'POST' });
    return data || { report_id: reportId, status: 'PROCESSING_SUCCESS', extracted_data: DEMO_EXTRACTED_DATA };
  },

  getDoctorExtractedData: async (reportId: string) => {
    const data = await request(`/doctor/reports/${reportId}/extracted-data`);
    return data || DEMO_EXTRACTED_DATA;
  },

  updateDoctorExtractedData: async (reportId: string, extractedData: any) => {
    const data = await request(`/doctor/reports/${reportId}/extracted-data`, {
      method: 'PATCH',
      body: JSON.stringify(extractedData),
    });
    return data || extractedData;
  },

  // ─── Doctor: Recovery Plans ────────────────────────────────────────────────
  generateRecoveryPlan: async (patientId: string, payload?: any) => {
    const data = await request(`/doctor/patients/${patientId}/recovery-plans/generate`, {
      method: 'POST',
      body: JSON.stringify(payload || {}),
    });
    return data || {
      id: `plan-${Date.now()}`,
      patient_id: patientId,
      title: 'AI-Generated Orthopaedic Recovery Protocol',
      status: 'draft',
      tasks: DEMO_TASKS,
    };
  },

  getDoctorPatientRecoveryPlans: async (patientId: string) => {
    const data = await request(`/doctor/patients/${patientId}/recovery-plans`);
    return data || [
      {
        id: 'plan-1',
        patient_id: patientId,
        title: 'Post-operative knee recovery',
        status: 'active',
        start_date: '2026-08-30',
        progress_pct: 43,
        tasks_count: 4,
      },
    ];
  },

  getDoctorRecoveryPlanById: async (planId: string) => {
    const data = await request(`/doctor/recovery-plans/${planId}`);
    return data || {
      id: planId,
      title: 'Post-operative knee recovery',
      status: 'active',
      start_date: '2026-08-30',
      days_elapsed: 12,
      total_days: 28,
      progress_pct: 43,
      tasks: DEMO_TASKS,
    };
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
    return data || DEMO_TASKS;
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
    return data || DEMO_TASKS.map(t => ({ task_id: t.id, completed: t.completed, title: t.title }));
  },

  getPatientAdherence: async (patientId: string) => {
    const data = await request(`/doctor/patients/${patientId}/adherence`);
    return data || DEMO_ADHERENCE;
  },

  getLatestDailyReview: async (patientId: string) => {
    const data = await request(`/doctor/patients/${patientId}/daily-reviews/latest`);
    return data || {
      patient_id: patientId,
      recovery_score: 8,
      pain_score: 3,
      note: 'Patient noted significant decrease in swelling after ice regimen.',
      submitted_at: '2026-09-11T10:00:00Z',
    };
  },

  getPatientDailyReviews: async (patientId: string) => {
    const data = await request(`/doctor/patients/${patientId}/daily-reviews`);
    return data || DEMO_REVIEWS_CHART;
  },

  // ─── Doctor: Alerts ────────────────────────────────────────────────────────
  getDoctorAlerts: async () => {
    const data = await request('/doctor/alerts');
    return data || DEMO_ALERTS;
  },

  getDoctorUnreadAlerts: async () => {
    const data = await request('/doctor/alerts/unread');
    return data || DEMO_ALERTS.filter(a => !a.is_read);
  },

  markDoctorAlertRead: async (alertId: string) => {
    return await request(`/doctor/alerts/${alertId}/read`, { method: 'PATCH' });
  },

  resolveDoctorAlert: async (alertId: string) => {
    return await request(`/doctor/alerts/${alertId}/resolve`, { method: 'PATCH' });
  },
};
