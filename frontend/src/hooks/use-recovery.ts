import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import {
  api,
  DEMO_PATIENTS_LIST,
  DEMO_TASKS,
  DEMO_ALERTS,
  DEMO_REVIEWS_CHART,
  DEMO_REPORTS,
  DEMO_EXTRACTED_DATA,
  DEMO_PATIENT_FILE,
  DEMO_ADHERENCE,
} from '../lib/api';
import { RecoveryPlanSchema, CareAlertSchema } from '../lib/schemas/recovery';

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
    queryFn: async () => {
      const data = await api.getRecoveryPlan();
      return RecoveryPlanSchema.parse(data);
    },
    enabled: role === 'patient',
    initialData: {
      id: 'plan-1',
      title: 'Post-operative knee recovery',
      status: 'active' as const,
      start_date: '2026-08-30',
      days_elapsed: 12,
      total_days: 28,
      progress_pct: 43,
      tasks: DEMO_TASKS,
    },
  });

  const patientAlertsQuery = useQuery({
    queryKey: ['patient', 'alerts'],
    queryFn: async () => {
      const data = await api.getPatientAlerts();
      return Array.isArray(data) ? data.map((item) => CareAlertSchema.parse(item)) : DEMO_ALERTS;
    },
    enabled: role === 'patient',
    initialData: DEMO_ALERTS,
  });

  const patientReportsQuery = useQuery({
    queryKey: ['patient', 'reports'],
    queryFn: () => api.getPatientReports(),
    enabled: role === 'patient',
    initialData: DEMO_REPORTS,
  });

  const patientFileQuery = useQuery({
    queryKey: ['patient', 'file'],
    queryFn: () => api.getPatientFile(),
    enabled: role === 'patient',
    initialData: DEMO_PATIENT_FILE,
  });

  // ─── Doctor Queries ────────────────────────────────────────────────────────
  const assignedPatientsQuery = useQuery({
    queryKey: ['doctor', 'patients'],
    queryFn: () => api.getAssignedPatients(),
    enabled: role === 'doctor',
    initialData: DEMO_PATIENTS_LIST,
  });

  const doctorAlertsQuery = useQuery({
    queryKey: ['doctor', 'alerts'],
    queryFn: async () => {
      const data = await api.getDoctorAlerts();
      return Array.isArray(data) ? data.map((item) => CareAlertSchema.parse(item)) : DEMO_ALERTS;
    },
    enabled: role === 'doctor',
    initialData: DEMO_ALERTS,
  });

  const doctorReportsQuery = useQuery({
    queryKey: ['doctor', 'reports'],
    queryFn: () => api.getDoctorPatientReports('p-1'),
    enabled: role === 'doctor',
    initialData: DEMO_REPORTS,
  });

  const doctorAdherenceQuery = useQuery({
    queryKey: ['doctor', 'adherence', 'p-1'],
    queryFn: () => api.getPatientAdherence('p-1'),
    enabled: role === 'doctor',
    initialData: DEMO_ADHERENCE,
  });

  // ─── Optimistic Task Completion Mutation ──────────────────────────────────
  const toggleTaskCompletion = useMutation({
    mutationFn: async ({ taskId, notes }: { taskId: string; notes?: string }) => {
      return await api.completeTask(taskId, notes);
    },
    onMutate: async ({ taskId }) => {
      await queryClient.cancelQueries({ queryKey: ['patient', 'recovery-plan'] });
      const previousPlan = queryClient.getQueryData(['patient', 'recovery-plan']) as any;

      if (previousPlan) {
        const updatedTasks = previousPlan.tasks.map((task: any) =>
          task.id === taskId ? { ...task, completed: !task.completed } : task
        );
        const completedCount = updatedTasks.filter((t: any) => t.completed).length;
        const progressPct = Math.round((completedCount / updatedTasks.length) * 100);

        queryClient.setQueryData(['patient', 'recovery-plan'], {
          ...previousPlan,
          tasks: updatedTasks,
          progress_pct: progressPct,
        });
      }

      return { previousPlan };
    },
    onError: (_err, _variables, context) => {
      if (context?.previousPlan) {
        queryClient.setQueryData(['patient', 'recovery-plan'], context.previousPlan);
      }
    },
    onSettled: () => {
      queryClient.invalidateQueries({ queryKey: ['patient', 'recovery-plan'] });
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
    onMutate: async (alertId) => {
      const queryKey = role === 'doctor' ? ['doctor', 'alerts'] : ['patient', 'alerts'];
      await queryClient.cancelQueries({ queryKey });

      const previousAlerts = queryClient.getQueryData(queryKey) as any[];

      if (previousAlerts) {
        queryClient.setQueryData(
          queryKey,
          previousAlerts.filter((alert) => alert.id !== alertId)
        );
      }

      return { previousAlerts, queryKey };
    },
    onError: (_err, _variables, context) => {
      if (context?.previousAlerts) {
        queryClient.setQueryData(context.queryKey, context.previousAlerts);
      }
    },
    onSettled: (_data, _error, _variables, context) => {
      if (context?.queryKey) {
        queryClient.invalidateQueries({ queryKey: context.queryKey });
      }
    },
  });

  // ─── Daily Review Submission ──────────────────────────────────────────────
  const submitReview = useMutation({
    mutationFn: async ({ scale, note }: { scale: number; note?: string }) => {
      return await api.submitDailyReview({ scale, note });
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['patient', 'reviews'] });
    },
  });

  // ─── Plan Approval & Cancellation Mutations (Doctor) ──────────────────────
  const approvePlan = useMutation({
    mutationFn: async (planId: string) => {
      return await api.approveRecoveryPlan(planId);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['doctor', 'patients'] });
      queryClient.invalidateQueries({ queryKey: ['patient', 'recovery-plan'] });
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
    patientProfile: patientProfileQuery.data,
    recoveryPlan: recoveryPlanQuery.data,
    patientAlerts: patientAlertsQuery.data || DEMO_ALERTS,
    patientReports: patientReportsQuery.data || DEMO_REPORTS,
    patientFile: patientFileQuery.data || DEMO_PATIENT_FILE,
    assignedPatients: assignedPatientsQuery.data || DEMO_PATIENTS_LIST,
    doctorAlerts: doctorAlertsQuery.data || DEMO_ALERTS,
    doctorReports: doctorReportsQuery.data || DEMO_REPORTS,
    doctorAdherence: doctorAdherenceQuery.data || DEMO_ADHERENCE,
    extractedData: DEMO_EXTRACTED_DATA,
    reviewsChart: DEMO_REVIEWS_CHART,
    toggleTaskCompletion,
    resolveAlert,
    submitReview,
    approvePlan,
    cancelPlan,
    updateExtractedData,
    isLoading: patientProfileQuery.isLoading || recoveryPlanQuery.isLoading,
  };
};
