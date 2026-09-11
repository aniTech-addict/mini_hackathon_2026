import { Router } from 'express';
import { verifyToken, requireRole } from '../middlewares/auth.js';
import upload from '../middlewares/upload.js';
import {
    getPatients,
    getPatientById,
    getPatientFile,
    uploadReport,
    getPatientReports,
    getReportById,
    getReportStatus,
    generateRecoveryPlan,
    getPatientRecoveryPlans,
    getRecoveryPlanById,
    updateRecoveryPlan,
    approvePlan,
    cancelPlan,
    createTask,
    getPlanTasks,
    getTaskById,
    updateTask,
    deleteTask,
    getPatientTaskCompletions,
    getPatientAdherence,
    getPatientDailyReviews,
    getLatestDailyReview,
    getDoctorAlerts,
    getUnreadDoctorAlerts,
    markDoctorAlertRead,
    resolveDoctorAlert,
} from '../controllers/doctor.controller.js';

const router = Router();

router.use(verifyToken, requireRole('doctor'));

// 3.1 Patient Management
router.get('/patients', getPatients);
router.get('/patients/:patientId', getPatientById);
router.get('/patients/:patientId/file', getPatientFile);

// 3.2 Medical Report Upload
router.post('/patients/:patientId/reports', upload.single('file'), uploadReport);
router.get('/patients/:patientId/reports', getPatientReports);
router.get('/reports/:reportId', getReportById);
router.get('/reports/:reportId/status', getReportStatus);

// 3.4 Recovery Plan Generation
router.post('/patients/:patientId/recovery-plans/generate', generateRecoveryPlan);
router.get('/patients/:patientId/recovery-plans', getPatientRecoveryPlans);
router.get('/recovery-plans/:planId', getRecoveryPlanById);
router.patch('/recovery-plans/:planId', updateRecoveryPlan);
router.post('/recovery-plans/:planId/approve', approvePlan);
router.post('/recovery-plans/:planId/cancel', cancelPlan);

// 3.5 Recovery Tasks
router.post('/recovery-plans/:planId/tasks', createTask);
router.get('/recovery-plans/:planId/tasks', getPlanTasks);
router.get('/tasks/:taskId', getTaskById);
router.patch('/tasks/:taskId', updateTask);
router.delete('/tasks/:taskId', deleteTask);

// 3.6 Adherence & Daily Reviews
router.get('/patients/:patientId/task-completions', getPatientTaskCompletions);
router.get('/patients/:patientId/adherence', getPatientAdherence);
router.get('/patients/:patientId/daily-reviews/latest', getLatestDailyReview);
router.get('/patients/:patientId/daily-reviews', getPatientDailyReviews);

// 3.7 Doctor Alerts
router.get('/alerts/unread', getUnreadDoctorAlerts);
router.get('/alerts', getDoctorAlerts);
router.patch('/alerts/:alertId/read', markDoctorAlertRead);
router.patch('/alerts/:alertId/resolve', resolveDoctorAlert);

export default router;
