import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { api } from '../lib/api';

export const useRecovery = (role: 'patient' | 'doctor' = 'patient') => {
  const queryClient = useQueryClient();

  // ─── Patient Queries ───────────────────────────────────────────────────────
  const patientProfileQuery = useQuery({
    queryKey: ['patient', 'profile'],
    queryFn: () => api.getPatientProfile(),
    enabled: role === 'patient',
  });

  const recoveryPlanQuery = useQuery({
    queryKey: ['patient', 'recovery-plan'],
    queryFn: () => api.getRecoveryPlan(),
    enabled: role === 'patient',
  });

  const planProgressQuery = useQuery({
    queryKey: ['patient', 'recovery-plan', 'progress'],
    queryFn: () => api.getPlanProgress(),
    enabled: role === 'patient',
  });

  const todayCalendarQuery = useQuery({
    queryKey: ['patient', 'calendar', 'today'],
    queryFn: () => api.getTodayCalendar(),
    enabled: role === 'patient',
  });

  const patientAlertsQuery = useQuery({
    queryKey: ['patient', 'alerts'],
    queryFn: () => api.getPatientAlerts(),
    enabled: role === 'patient',
  });

  const patientReportsQuery = useQuery({
    queryKey: ['patient', 'reports'],
    queryFn: () => api.getPatientReports(),
    enabled: role === 'patient',
  });

  const patientFileQuery = useQuery({
    queryKey: ['patient', 'file'],
    queryFn: () => api.getPatientFile(),
    enabled: role === 'patient',
  });

  const dailyReviewsQuery = useQuery({
    queryKey: ['patient', 'daily-reviews'],
    queryFn: () => api.getDailyReviews(),
    enabled: role === 'patient',
  });

  // ─── Doctor Queries ────────────────────────────────────────────────────────
  const assignedPatientsQuery = useQuery({
    queryKey: ['doctor', 'patients'],
    queryFn: () => api.getAssignedPatients(),
    enabled: role === 'doctor',
  });

  const doctorAlertsQuery = useQuery({
    queryKey: ['doctor', 'alerts'],
    queryFn: () => api.getDoctorAlerts(),
    enabled: role === 'doctor',
  });

  const doctorReportsQuery = useQuery({
    queryKey: ['doctor', 'reports'],
    queryFn: async () => {
      const patients = await api.getAssignedPatients();
      if (patients && patients.length > 0) {
        return await api.getDoctorPatientReports(patients[0].patient_id);
      }
      return [];
    },
    enabled: role === 'doctor',
  });

  const doctorAdherenceQuery = useQuery({
    queryKey: ['doctor', 'adherence'],
    queryFn: async () => {
      const patients = await api.getAssignedPatients();
      if (patients && patients.length > 0) {
        return await api.getPatientAdherence(patients[0].patient_id);
      }
      return null;
    },
    enabled: role === 'doctor',
  });

  // ─── Optimistic Task Completion Mutation ──────────────────────────────────
  const toggleTaskCompletion = useMutation({
    mutationFn: async ({ taskId, notes }: { taskId: string; notes?: string }) => {
      return await api.completeTask(taskId, notes);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['patient', 'calendar', 'today'] });
      queryClient.invalidateQueries({ queryKey: ['patient', 'recovery-plan'] });
      queryClient.invalidateQueries({ queryKey: ['patient', 'recovery-plan', 'progress'] });
    },
  });

  // ─── Optimistic Alert Resolution Mutation ─────────────────────────────────
  const resolveAlert = useMutation({
    mutationFn: async (alertId: string) => {
      if (role === 'doctor') {
        return await api.resolveDoctorAlert(alertId);
      }
      return await api.dismissAlert(alertId);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: role === 'doctor' ? ['doctor', 'alerts'] : ['patient', 'alerts'] });
    },
  });

  // ─── Daily Review Submission ──────────────────────────────────────────────
  const submitReview = useMutation({
    mutationFn: async ({ scale, note }: { scale: number; note?: string }) => {
      return await api.submitDailyReview({ scale, note });
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['patient', 'daily-reviews'] });
      queryClient.invalidateQueries({ queryKey: ['doctor', 'patients'] });
    },
  });

  // ─── Plan Approval & Cancellation Mutations (Doctor) ──────────────────────
  const approvePlan = useMutation({
    mutationFn: async (planId: string) => {
      return await api.approveRecoveryPlan(planId);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['doctor', 'patients'] });
      queryClient.invalidateQueries({ queryKey: ['doctor', 'recovery-plans'] });
    },
  });

  const cancelPlan = useMutation({
    mutationFn: async (planId: string) => {
      return await api.cancelRecoveryPlan(planId);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['doctor', 'patients'] });
    },
  });

  // ─── OCR Update Mutation ──────────────────────────────────────────────────
  const updateExtractedData = useMutation({
    mutationFn: async ({ reportId, data }: { reportId: string; data: any }) => {
      return await api.updateDoctorExtractedData(reportId, data);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['doctor', 'reports'] });
    },
  });

  return {
    patientProfile: patientProfileQuery.data || null,
    recoveryPlan: recoveryPlanQuery.data || null,
    planProgress: planProgressQuery.data || null,
    todayCalendar: todayCalendarQuery.data || null,
    patientAlerts: patientAlertsQuery.data || [],
    patientReports: patientReportsQuery.data || [],
    patientFile: patientFileQuery.data || null,
    dailyReviews: dailyReviewsQuery.data || [],
    assignedPatients: assignedPatientsQuery.data || [],
    doctorAlerts: doctorAlertsQuery.data || [],
    doctorReports: doctorReportsQuery.data || [],
    doctorAdherence: doctorAdherenceQuery.data || null,
    toggleTaskCompletion,
    resolveAlert,
    submitReview,
    approvePlan,
    cancelPlan,
    updateExtractedData,
    isLoading:
      role === 'patient'
        ? patientProfileQuery.isLoading || recoveryPlanQuery.isLoading
        : assignedPatientsQuery.isLoading,
  };
};
