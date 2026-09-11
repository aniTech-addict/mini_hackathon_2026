import { z } from 'zod';

export const RoleSchema = z.enum(['patient', 'doctor']);

export const UserSchema = z.object({
  id: z.string(),
  user_id: z.string(),
  role: RoleSchema,
  phone_number: z.string().optional().nullable(),
  age: z.number().optional().nullable(),
  profileId: z.string().optional().nullable(),
});

export const LoginSchema = z.object({
  user_id: z.string().min(1, 'User ID is required'),
  password: z.string().min(1, 'Password is required'),
});

export const RegisterSchema = z.object({
  user_id: z.string().min(3),
  password: z.string().min(6),
  role: RoleSchema,
  phone_number: z.string().min(6),
  age: z.number().optional(),
  email: z.string().email().optional(),
  address: z.string().optional(),
  department: z.string().optional(),
  sex: z.string().optional(),
});

export const TaskCategorySchema = z.enum(['MEDICATION', 'EXERCISE', 'WOUND_CARE', 'ACTIVITY', 'CHECK_IN', 'GENERAL']);

export const RecoveryTaskSchema = z.object({
  id: z.string().or(z.number()),
  task_id: z.string().optional(),
  title: z.string(),
  category: z.string().default('GENERAL'),
  start_day: z.number().default(1),
  end_day: z.number().optional().nullable(),
  schedule_times: z.array(z.string()).default([]),
  time: z.string().optional(),
  frequency: z.string().default('DAILY'),
  is_required: z.boolean().default(true),
  completed: z.boolean().default(false),
  completed_at: z.string().optional().nullable(),
  notes: z.string().optional().nullable(),
});

export const RecoveryPlanSchema = z.object({
  id: z.string().or(z.number()),
  patient_id: z.string().optional(),
  doctor_id: z.string().optional(),
  title: z.string(),
  status: z.enum(['draft', 'active', 'completed', 'cancelled']),
  start_date: z.string(),
  end_date: z.string().optional().nullable(),
  procedure: z.string().optional().nullable(),
  tasks: z.array(RecoveryTaskSchema).default([]),
  progress_pct: z.number().default(0),
  days_elapsed: z.number().default(0),
  total_days: z.number().default(28),
});

export const DailyReviewSchema = z.object({
  id: z.string().optional(),
  patient_id: z.string().optional(),
  review_date: z.string(),
  scale: z.number().min(0).max(10),
  recovery_score: z.number().min(0).max(10).optional(),
  note: z.string().optional().nullable(),
  created_at: z.string().optional(),
});

export const AlertSeveritySchema = z.enum(['low', 'medium', 'high', 'critical']);

export const CareAlertSchema = z.object({
  id: z.string(),
  patient_id: z.string().optional(),
  doctor_id: z.string().optional(),
  patient_name: z.string().optional(),
  type: z.string().default('symptom'),
  severity: AlertSeveritySchema,
  title: z.string(),
  message: z.string(),
  is_read: z.boolean().default(false),
  status: z.enum(['active', 'read', 'dismissed', 'resolved']).default('active'),
  created_at: z.string().default(new Date().toISOString()),
});

export const MedicalReportSchema = z.object({
  report_id: z.string(),
  patient_id: z.string(),
  report_type: z.string(),
  file_url: z.string().optional(),
  ocr_status: z.enum(['pending', 'processing', 'completed', 'failed']),
  ocr_text: z.string().optional().nullable(),
  processed_at: z.string().optional().nullable(),
  created_at: z.string().optional(),
});

export const ExtractedClinicalDataSchema = z.object({
  procedure: z.string().optional().nullable(),
  surgery_date: z.string().optional().nullable(),
  discharge_date: z.string().optional().nullable(),
  medications: z.array(
    z.object({
      name: z.string(),
      dose: z.string().optional(),
      schedule: z.array(z.string()).optional(),
    })
  ).default([]),
  wound_care: z.array(z.string()).default([]),
  exercises: z.array(z.string()).default([]),
  restrictions: z.array(z.string()).default([]),
  follow_up: z.any().optional(),
  warning_signs: z.array(z.string()).default([]),
});

export type User = z.infer<typeof UserSchema>;
export type RecoveryTask = z.infer<typeof RecoveryTaskSchema>;
export type RecoveryPlan = z.infer<typeof RecoveryPlanSchema>;
export type DailyReview = z.infer<typeof DailyReviewSchema>;
export type CareAlert = z.infer<typeof CareAlertSchema>;
export type MedicalReport = z.infer<typeof MedicalReportSchema>;
export type ExtractedClinicalData = z.infer<typeof ExtractedClinicalDataSchema>;
